import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { MongoClient } from 'mongodb';
import * as brevo from '@getbrevo/brevo';
import { createAuthCookie } from '../../lib/apiAuth';

const DB_NAME = 'steamworkshop';
const COLLECTION_NAME = 'users';
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this';

const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const validatePassword = (password) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(password);
const normalizeEmail = (email) => String(email || '').trim().toLowerCase();

const buildWelcomeEmail = (username) => `
  <div style="margin:0;padding:32px;background:#f3f7f6;font-family:Arial,sans-serif;color:#1f2937;">
    <div style="max-width:640px;margin:0 auto;background:#ffffff;border:1px solid #dbe9e7;border-radius:20px;overflow:hidden;">
      <div style="padding:40px 40px 28px;background:linear-gradient(135deg,#173a45 0%,#4B8481 100%);color:#ffffff;">
        <div style="font-size:12px;letter-spacing:0.18em;text-transform:uppercase;opacity:.78;">STEAM Workshop</div>
        <h1 style="margin:14px 0 10px;font-size:32px;line-height:1.2;">Welcome to your learning workspace</h1>
        <p style="margin:0;font-size:15px;line-height:1.7;color:#d8ecea;">Your account is ready. You can sign in, activate your set, and start the guided lessons immediately.</p>
      </div>
      <div style="padding:36px 40px;">
        <p style="margin:0 0 16px;font-size:16px;line-height:1.7;">Hi <strong>${username}</strong>,</p>
        <p style="margin:0 0 24px;font-size:15px;line-height:1.8;color:#4b5563;">We created STEAM Workshop to feel clear, practical, and premium from the first session. Your account now gives you access to activation, lesson tracking, and your learner dashboard.</p>
        <div style="border:1px solid #dbe9e7;border-radius:16px;padding:20px 22px;background:#f8fbfb;">
          <div style="font-size:13px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#4B8481;margin-bottom:12px;">What you can do next</div>
          <div style="margin:0 0 10px;font-size:15px;color:#1f2937;">1. Sign in to your account</div>
          <div style="margin:0 0 10px;font-size:15px;color:#1f2937;">2. Activate your STEAM Core Set</div>
          <div style="margin:0;font-size:15px;color:#1f2937;">3. Start the Discover, Build, and Apply lessons</div>
        </div>
        <div style="margin-top:28px;">
          <a href="https://steamworkshop.xyz/login" style="display:inline-block;padding:14px 24px;border-radius:12px;background:#4B8481;color:#ffffff;text-decoration:none;font-weight:700;">Sign In</a>
        </div>
      </div>
    </div>
  </div>
`;

async function sendWelcomeEmail({ email, username }) {
  if (!process.env.BREVO_API_KEY) {
    console.warn('Skipping welcome email: BREVO_API_KEY is not configured.');
    return;
  }

  const apiInstance = new brevo.TransactionalEmailsApi();
  apiInstance.setApiKey(brevo.TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_API_KEY);

  const sendEmail = new brevo.SendSmtpEmail();
  sendEmail.sender = {
    name: process.env.BREVO_FROM_NAME || 'STEAM Workshop',
    email: process.env.BREVO_FROM_EMAIL || 'Steamworkshop.kids@outlook.com'
  };
  sendEmail.to = [{ email }];
  sendEmail.subject = 'Welcome to STEAM Workshop';
  sendEmail.htmlContent = buildWelcomeEmail(username);
  await apiInstance.sendTransacEmail(sendEmail);
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { username, password } = req.body;
  const email = normalizeEmail(req.body.email);

  if (!username || !email || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  if (username.length < 3) {
    return res.status(400).json({ error: 'Username must be at least 3 characters' });
  }

  if (!validateEmail(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  if (!validatePassword(password)) {
    return res.status(400).json({
      error: 'Password must be at least 8 characters with 1 uppercase, 1 lowercase, and 1 number',
    });
  }

  let client;

  try {
    if (!process.env.MONGODB_URI) {
      console.error('Signup configuration error: MONGODB_URI is not set.');
      return res.status(500).json({ error: 'Signup is not configured yet. Please contact support.' });
    }

    client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();

    const db = client.db(DB_NAME);
    const usersCollection = db.collection(COLLECTION_NAME);

    const existingUser = await usersCollection.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      if (existingUser.email === email) {
        return res.status(409).json({
          error: 'Email already registered',
          field: 'email',
          hasAccount: true
        });
      }
      return res.status(409).json({
        error: 'Username already taken',
        field: 'username'
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = {
      username: username.trim(),
      email,
      password: hashedPassword,
      profilePicture: null,
      purchases: [],
      kitProgress: {},
      createdAt: new Date(),
      updatedAt: new Date(),
      isVerified: true,
      role: 'user',
    };

    const result = await usersCollection.insertOne(newUser);

    try {
      await sendWelcomeEmail({ email, username: newUser.username });
    } catch (emailError) {
      console.error('Welcome email error:', emailError);
    }

    const token = jwt.sign(
      {
        userId: result.insertedId,
        email: newUser.email,
        username: newUser.username,
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.setHeader('Set-Cookie', createAuthCookie(token));

    return res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: result.insertedId,
        username: newUser.username,
        email: newUser.email,
        profilePicture: null,
      },
      purchases: [],
      kitProgress: {},
    });
  } catch (error) {
    console.error('Signup error:', error);
    if (error.code === 11000) {
      return res.status(409).json({ error: 'Email or username already exists' });
    }
    return res.status(500).json({ error: 'An error occurred during signup. Please try again.' });
  } finally {
    if (client) {
      await client.close();
    }
  }
}
