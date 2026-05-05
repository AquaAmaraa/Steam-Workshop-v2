import bcrypt from 'bcryptjs';
import { MongoClient } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = 'steamworkshop';
const COLLECTION_NAME = 'users';

// Validation helpers
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password) => {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  return passwordRegex.test(password);
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { token, email, password, confirmPassword } = req.body;

  // Validation checks
  if (!token || !email || !password || !confirmPassword) {
    return res.status(400).json({ error: 'All fields are required' });
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
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    const db = client.db(DB_NAME);
    const usersCollection = db.collection(COLLECTION_NAME);

    // Find user by email and reset token
    const user = await usersCollection.findOne({
      email: decodeURIComponent(email),
      resetToken: token,
    });

    if (!user) {
      return res.status(404).json({ 
        error: 'Invalid or expired reset link. Please request a new password reset.' 
      });
    }

    // Check if token has expired (1 hour)
    if (new Date() > user.resetTokenExpires) {
      return res.status(400).json({ 
        error: 'Reset link has expired. Please request a new password reset.' 
      });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Update user password and remove reset token
    await usersCollection.updateOne(
      { _id: user._id },
      {
        $set: {
          password: hashedPassword,
          updatedAt: new Date(),
        },
        $unset: {
          resetToken: 1,
          resetTokenExpires: 1,
        },
      }
    );

    return res.status(200).json({
      message: 'Password reset successfully! You can now login with your new password.',
      success: true,
    });
  } catch (error) {
    console.error('Reset password error:', error);
    return res.status(500).json({
      error: 'An error occurred. Please try again later.',
    });
  } finally {
    if (client) {
      await client.close();
    }
  }
}