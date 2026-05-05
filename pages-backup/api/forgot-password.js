import { MongoClient } from "mongodb";
import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = "steamworkshop";
const COLLECTION_NAME = "users";

const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const generateResetToken = () =>
  Math.random().toString(36).substring(2, 15) +
  Math.random().toString(36).substring(2, 15);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email } = req.body;

  if (!email) return res.status(400).json({ error: "Email is required" });
  if (!validateEmail(email)) return res.status(400).json({ error: "Invalid email format" });

  let client;
  try {
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    const db = client.db(DB_NAME);
    const usersCollection = db.collection(COLLECTION_NAME);

    const user = await usersCollection.findOne({ email });

    // Always return success to prevent email enumeration
    if (!user) {
      return res.status(200).json({
        message: "If an account exists with that email, password reset instructions have been sent.",
      });
    }

    const resetToken = generateResetToken();
    const resetTokenExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await usersCollection.updateOne(
      { _id: user._id },
      { $set: { resetToken, resetTokenExpires, updatedAt: new Date() } }
    );

    const baseUrl = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000";
    const resetUrl = `${baseUrl}/reset-password?token=${resetToken}&email=${encodeURIComponent(email)}`;

    await sgMail.send({
      to: email,
      from: "steamworkshop.kids@outlook.com",
      subject: "🔐 Reset Your STEAM Workshop Password",
      html: `
        <div style="font-family: Arial, sans-serif; max-width:600px;margin:0 auto;">
          <div style="background:linear-gradient(135deg,#f59e0b,#f97316);padding:20px;border-radius:10px;color:white;text-align:center;">
            <h1>Password Reset Request</h1>
          </div>
          <div style="padding:20px;background:#f9fafb;">
            <p>Hi <strong>${user.username}</strong>,</p>
            <p>Click the button below to reset your password:</p>
            <div style="text-align:center;margin:20px 0;">
              <a href="${resetUrl}" style="background-color:#f59e0b;color:white;padding:12px 30px;text-decoration:none;border-radius:5px;font-weight:bold;">Reset Password</a>
            </div>
            <p>Or copy this link: <code style="background:#e5e7eb;padding:5px 10px;border-radius:3px;word-break:break-all;">${resetUrl}</code></p>
            <p style="color:#999;font-size:12px;">This link expires in 1 hour.</p>
            <p>If you didn't request this, ignore this email.</p>
          </div>
        </div>
      `,
    });

    return res.status(200).json({
      message: "If an account exists with that email, password reset instructions have been sent.",
    });
  } catch (err) {
    console.error("Forgot password error:", err);
    return res.status(500).json({ error: "An error occurred. Please try again later." });
  } finally {
    if (client) await client.close();
  }
}
