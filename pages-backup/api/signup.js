import bcrypt from 'bcryptjs';
import { MongoClient } from 'mongodb';
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = 'steamworkshop';
const COLLECTION_NAME = 'users';

// Validation helper functions
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password) => {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  return passwordRegex.test(password);
};

const validateUsername = (username) => {
  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
  return usernameRegex.test(username);
};

// Generate verification token
const generateVerificationToken = () => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { username, email, password, confirmPassword } = req.body;

  // Validation checks
  if (!username || !email || !password || !confirmPassword) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  if (!validateUsername(username)) {
    return res.status(400).json({
      error: 'Username must be 3-20 characters and contain only letters, numbers, and underscores',
    });
  }

  if (!validateEmail(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  if (!validatePassword(password)) {
    return res.status(400).json({
      error: 'Password must be at least 8 characters and contain uppercase, lowercase, and numbers',
    });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ error: 'Passwords do not match' });
  }

  let client;

  try {
    // Connect to MongoDB
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    const db = client.db(DB_NAME);
    const usersCollection = db.collection(COLLECTION_NAME);

    // Check if user already exists
    const existingUser = await usersCollection.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      return res.status(409).json({
        error: existingUser.email === email ? 'Email already registered' : 'Username already taken',
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Generate verification token
    const verificationToken = generateVerificationToken();
    const verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Create new user document
    const newUser = {
      username,
      email,
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
      isVerified: false,
      verificationToken,
      verificationTokenExpires,
      role: 'user',
    };

    // Insert user into database
    const result = await usersCollection.insertOne(newUser);

    // Send verification email
    const verificationUrl = `${process.env.VERCEL_URL || 'http://localhost:3000'}/verify-email?token=${verificationToken}&email=${encodeURIComponent(email)}`;

    const msg = {
      to: email,
      from: 'steamworkshop.kids@outlook.com',
      subject: '🎉 Verify your STEAM Workshop Account',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #f59e0b, #f97316); padding: 20px; border-radius: 10px; color: white; text-align: center;">
            <h1 style="margin: 0;">Welcome to STEAM Workshop!</h1>
          </div>
          
          <div style="padding: 20px; background-color: #f9fafb;">
            <p>Hi <strong>${username}</strong>,</p>
            
            <p>Thanks for signing up! To complete your registration and start building amazing things, please verify your email address.</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${verificationUrl}" style="background-color: #f59e0b; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
                ✅ Verify Email
              </a>
            </div>
            
            <p style="color: #666; font-size: 14px;">Or copy this link: <br/>
            <code style="background-color: #e5e7eb; padding: 5px 10px; border-radius: 3px; word-break: break-all;">${verificationUrl}</code>
            </p>
            
            <p style="color: #999; font-size: 12px;">This link expires in 24 hours.</p>
            
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
            
            <p style="color: #666; font-size: 12px;">If you didn't create this account, please ignore this email.</p>
          </div>
        </div>
      `,
    };

    await sgMail.send(msg);

    return res.status(201).json({
      message: 'User registered successfully! Check your email to verify your account.',
      user: {
        id: result.insertedId,
        username: newUser.username,
        email: newUser.email,
      },
    });
  } catch (error) {
    console.error('Signup error:', error);

    if (error.code === 11000) {
      return res.status(409).json({
        error: 'Email or username already exists',
      });
    }

    return res.status(500).json({
      error: 'An error occurred during signup. Please try again later.',
    });
  } finally {
    if (client) {
      await client.close();
    }
  }
}