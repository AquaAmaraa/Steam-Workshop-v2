import { getAuthUserFromRequest, toObjectId } from '../../lib/apiAuth';
import { withUsersCollection } from '../../lib/mongodb';

const isPlainObject = (value) =>
  value && typeof value === 'object' && !Array.isArray(value);

const sanitizeProgress = (progress) => {
  if (!isPlainObject(progress)) return {};
  const safe = {};

  for (const [kitSlug, entry] of Object.entries(progress)) {
    if (!isPlainObject(entry)) continue;
    const watchedVideos = Array.isArray(entry.watchedVideos)
      ? entry.watchedVideos.filter((v) => typeof v === 'string' || typeof v === 'number')
      : [];
    const completedExperiments = Array.isArray(entry.completedExperiments)
      ? entry.completedExperiments.filter((v) => typeof v === 'string' || typeof v === 'number')
      : [];
    const nextEntry = { watchedVideos, completedExperiments };
    if (entry.activatedAt && typeof entry.activatedAt === 'string') {
      nextEntry.activatedAt = entry.activatedAt;
    }
    safe[kitSlug] = nextEntry;
  }

  return safe;
};

const sanitizePurchases = (purchases) =>
  Array.isArray(purchases) ? [...new Set(purchases.filter((v) => typeof v === 'string'))] : [];

const sanitizeProfilePicture = (profilePicture) => {
  if (profilePicture === null) return null;
  if (typeof profilePicture !== 'string') return undefined;
  const trimmed = profilePicture.trim();
  if (!trimmed) return null;

  // Allow image data URLs for now to avoid introducing external storage requirements.
  if (!trimmed.startsWith('data:image/')) return undefined;
  if (trimmed.length > 700000) return undefined;
  return trimmed;
};

const serializeUserData = (user) => ({
  user: {
    id: user._id,
    username: user.username,
    email: user.email,
    profilePicture: user.profilePicture || null,
  },
  purchases: Array.isArray(user.purchases) ? user.purchases : [],
  kitProgress: isPlainObject(user.kitProgress) ? user.kitProgress : {},
});

export default async function handler(req, res) {
  let authUser;
  try {
    authUser = getAuthUserFromRequest(req);
  } catch (error) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method === 'GET') {
    try {
      const data = await withUsersCollection(async (users) => {
        const user = await users.findOne({ _id: toObjectId(authUser.userId) });
        if (!user) return null;
        return serializeUserData(user);
      });

      if (!data) {
        return res.status(404).json({ error: 'User not found' });
      }

      return res.status(200).json(data);
    } catch (error) {
      console.error('Get user-data error:', error);
      return res.status(500).json({ error: 'Failed to load user data' });
    }
  }

  if (req.method === 'PATCH') {
    const patch = {};

    if (Object.prototype.hasOwnProperty.call(req.body || {}, 'purchases')) {
      patch.purchases = sanitizePurchases(req.body.purchases);
    }

    if (Object.prototype.hasOwnProperty.call(req.body || {}, 'kitProgress')) {
      patch.kitProgress = sanitizeProgress(req.body.kitProgress);
    }

    if (Object.prototype.hasOwnProperty.call(req.body || {}, 'profilePicture')) {
      const sanitizedProfilePicture = sanitizeProfilePicture(req.body.profilePicture);
      if (typeof sanitizedProfilePicture === 'undefined') {
        return res.status(400).json({ error: 'Invalid profile picture format' });
      }
      patch.profilePicture = sanitizedProfilePicture;
    }

    if (Object.keys(patch).length === 0) {
      return res.status(400).json({ error: 'No valid fields to update' });
    }

    patch.updatedAt = new Date();

    try {
      const data = await withUsersCollection(async (users) => {
        const result = await users.findOneAndUpdate(
          { _id: toObjectId(authUser.userId) },
          { $set: patch },
          { returnDocument: 'after' }
        );
        return result?.value || result;
      });

      if (!data) {
        return res.status(404).json({ error: 'User not found' });
      }

      return res.status(200).json(serializeUserData(data));
    } catch (error) {
      console.error('Patch user-data error:', error);
      return res.status(500).json({ error: 'Failed to update user data' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
