import { MongoClient } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = 'steamworkshop';
const COLLECTION_NAME = 'users';

export default async function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { token, email } = req.query;

  if (!token || !email) {
    return res.status(400).json({ error: 'Missing token or email' });
  }

  let client;

  try {
    // Connect to MongoDB
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    const db = client.db(DB_NAME);
    const usersCollection = db.collection(COLLECTION_NAME);

    // Find user by email and verification token
    const user = await usersCollection.findOne({
      email: decodeURIComponent(email),
      verificationToken: token,
    });

    if (!user) {
      return res.status(404).json({ error: 'Invalid verification link or user not found' });
    }

    // Check if token has expired
    if (new Date() > user.verificationTokenExpires) {
      return res.status(400).json({ error: 'Verification link has expired. Please sign up again.' });
    }

    // Check if already verified
    if (user.isVerified) {
      return res.status(400).json({ error: 'Email already verified' });
    }

    // Mark user as verified
    await usersCollection.updateOne(
      { _id: user._id },
      {
        $set: {
          isVerified: true,
          updatedAt: new Date(),
        },
        $unset: {
          verificationToken: 1,
          verificationTokenExpires: 1,
        },
      }
    );

    return res.status(200).json({
      message: '✅ Email verified successfully! You can now login.',
      success: true,
    });
  } catch (error) {
    console.error('Email verification error:', error);
    return res.status(500).json({
      error: 'An error occurred during verification. Please try again later.',
    });
  } finally {
    if (client) {
      await client.close();
    }
  }
}