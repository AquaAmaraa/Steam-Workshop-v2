import { MongoClient } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = 'steamworkshop';
const USERS_COLLECTION = 'users';

export async function withUsersCollection(callback) {
  const client = new MongoClient(MONGODB_URI);
  try {
    await client.connect();
    const db = client.db(DB_NAME);
    return await callback(db.collection(USERS_COLLECTION));
  } finally {
    await client.close();
  }
}

