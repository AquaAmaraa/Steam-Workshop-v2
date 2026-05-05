import bcrypt from 'bcryptjs';
import { MongoClient } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = 'steamworkshop';
const COLLECTION_NAME = 'users';

const validatePassword = (password) => {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  return passwordRegex.test(password);
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { token, email, password } = req.body;

  if (!token || !email || !password) {
    return res.status(400).json({ error: 'Token, email, and password are required' });
  }

  if (!validatePassword(password)) {
    return res.status(400).json({
      error: 'Password must be at least 8 characters with 1 uppercase, 1 lowercase, and 1 number',
    });
  }

  let client;

  try {
    client = new MongoClient(MONGODB_URI);
    await client.connect();

    const db = client.db(DB_NAME);
    const usersCollection = db.collection(COLLECTION_NAME);

    const userByEmail = await usersCollection.findOne({ email });
    if (!userByEmail) {
      return res.status(400).json({ error: 'No account found with this email' });
    }

    const user = await usersCollection.findOne({
      email,
      resetToken: token,
      resetTokenExpires: { $gt: new Date() },
    });

    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired reset link' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await usersCollection.updateOne(
      { _id: user._id },
      {
        $set: {
          password: hashedPassword,
          updatedAt: new Date(),
        },
        $unset: {
          resetToken: '',
          resetTokenExpires: '',
        },
      }
    );

    return res.status(200).json({ message: 'Password reset successfully!' });

  } catch (err) {
    console.error('Reset password error:', err);
    return res.status(500).json({ error: 'An error occurred. Please try again.' });
  } finally {
    if (client) await client.close();
  }
}