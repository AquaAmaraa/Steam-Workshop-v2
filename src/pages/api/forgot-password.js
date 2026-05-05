import { MongoClient } from 'mongodb';
import * as brevo from '@getbrevo/brevo';

const apiInstance = new brevo.TransactionalEmailsApi();
apiInstance.setApiKey(brevo.TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_API_KEY);

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = 'steamworkshop';
const COLLECTION_NAME = 'users';

const generateResetToken = () => {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  let client;

  try {
    client = new MongoClient(MONGODB_URI);
    await client.connect();

    const db = client.db(DB_NAME);
    const usersCollection = db.collection(COLLECTION_NAME);

    const user = await usersCollection.findOne({ email });

    if (!user) {
      // Don't reveal if email exists
      return res.status(200).json({ message: 'If an account exists, a reset link has been sent.' });
    }

    const resetToken = generateResetToken();
    const resetTokenExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await usersCollection.updateOne(
      { _id: user._id },
      {
        $set: {
          resetToken,
          resetTokenExpires,
          updatedAt: new Date(),
        },
      }
    );

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://steamworkshop.xyz';
    const resetUrl = `${baseUrl}/reset-password?token=${resetToken}&email=${encodeURIComponent(email)}`;

    const sendEmail = new brevo.SendSmtpEmail();
    sendEmail.sender = { 
      name: process.env.BREVO_FROM_NAME || 'STEAM Workshop',
      email: process.env.BREVO_FROM_EMAIL || 'Steamworkshop.kids@outlook.com'
    };
    sendEmail.to = [{ email }];
    sendEmail.subject = '🔑 Reset Your STEAM Workshop Password';
    sendEmail.htmlContent = `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f8fafa;">
        <!-- Winter Header -->
        <div style="background: linear-gradient(135deg, #4B8481 0%, #4B8481 50%, #4B8481 100%); padding: 45px 30px; text-align: center; position: relative; overflow: hidden;">
          <div style="position: absolute; top: 8px; left: 12%; font-size: 22px; opacity: 0.3;">❄</div>
          <div style="position: absolute; top: 35px; right: 15%; font-size: 14px; opacity: 0.4;">❄</div>
          <div style="position: absolute; bottom: 15px; left: 30%; font-size: 16px; opacity: 0.25;">❄</div>
          <div style="position: absolute; bottom: 25px; right: 25%; font-size: 20px; opacity: 0.3;">❄</div>
          <h1 style="color: white; margin: 0; font-size: 32px; font-weight: 600;">🔒 Password Reset</h1>
          <p style="color: #d8efee; margin: 12px 0 0 0; font-size: 16px;">Don't worry, we've got you covered</p>
        </div>
        
        <div style="background-color: white; padding: 40px; margin: 20px; border-radius: 16px; box-shadow: 0 4px 20px rgba(30, 64, 175, 0.1); border: 1px solid #e8f4f4;">
          <p style="color: #1e3a5f; font-size: 17px; line-height: 1.6; margin: 0;">Hi <strong>${user.username}</strong>,</p>
          
          <p style="color: #475569; font-size: 15px; line-height: 1.7; margin: 20px 0;">
            We received a request to reset your password for your STEAM Workshop account. Click the button below to create a new password.
          </p>
          
          <div style="text-align: center; margin: 40px 0;">
            <a href="${resetUrl}" style="background: linear-gradient(135deg, #4B8481 0%, #4B8481 100%); color: white; padding: 16px 45px; text-decoration: none; border-radius: 50px; font-weight: 600; font-size: 16px; display: inline-block; box-shadow: 0 4px 15px rgba(30, 64, 175, 0.3); border: 2px solid transparent;">
              🔑 Reset Password
            </a>
          </div>
          
          <div style="background: linear-gradient(135deg, #f8fafa 0%, #e8f4f4 100%); padding: 20px; border-radius: 12px; margin: 30px 0;">
            <p style="color: #64748b; margin: 0 0 10px 0; font-size: 13px;">Or copy and paste this link:</p>
            <p style="color: #4B8481; margin: 0; font-size: 11px; word-break: break-all; font-family: 'Courier New', monospace; background: white; padding: 12px; border-radius: 8px;">${resetUrl}</p>
          </div>
          
          <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 18px; margin: 30px 0; border-radius: 0 12px 12px 0;">
            <p style="color: #92400e; margin: 0; font-size: 14px; line-height: 1.5;">
              <strong>⚠️ Security Note:</strong> This link expires in 1 hour. If you didn't request this password reset, you can safely ignore this email.
            </p>
          </div>
        </div>
        
        <div style="text-align: center; padding: 25px; color: #64748b; font-size: 13px;">
          <p style="margin: 0;">Best regards,<br><strong style="color: #4B8481;">STEAM Workshop Team</strong></p>
          <p style="margin: 15px 0 0 0; font-size: 20px; opacity: 0.5;">❄ ❄ ❄</p>
        </div>
      </div>
    `;

    await apiInstance.sendTransacEmail(sendEmail);

    return res.status(200).json({ message: 'Password reset link sent!' });
  } catch (error) {
    console.error('Forgot password error:', error);
    return res.status(500).json({ error: 'An error occurred. Please try again.' });
  } finally {
    if (client) {
      await client.close();
    }
  }
}