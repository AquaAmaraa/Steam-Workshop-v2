import bcrypt from 'bcryptjs';
import { MongoClient } from 'mongodb';
import jwt from 'jsonwebtoken';
import { createAuthCookie } from '../../lib/apiAuth';

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = 'steamworkshop';
const COLLECTION_NAME = 'users';
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this';

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  if (!validateEmail(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  let client;

  try {
    client = new MongoClient(MONGODB_URI);
    await client.connect();

    const db = client.db(DB_NAME);
    const usersCollection = db.collection(COLLECTION_NAME);

    const user = await usersCollection.findOne({ email });

    if (!user) {
      return res.status(401).json({ 
        error: 'No account found with this email',
        noAccount: true
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ 
        error: 'Incorrect password',
        wrongPassword: true
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        username: user.username,
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.setHeader('Set-Cookie', createAuthCookie(token));

    return res.status(200).json({
      message: 'Login successful',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        profilePicture: user.profilePicture || null,
      },
      purchases: Array.isArray(user.purchases) ? user.purchases : [],
      kitProgress: user.kitProgress && typeof user.kitProgress === 'object' ? user.kitProgress : {},
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'An error occurred during login. Please try again.' });
  } finally {
    if (client) {
      await client.close();
    }
  }
}
