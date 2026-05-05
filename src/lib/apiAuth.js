import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this';
const AUTH_COOKIE_NAME = 'steam_auth';

function parseCookies(cookieHeader = '') {
  return cookieHeader
    .split(';')
    .map((part) => part.trim())
    .filter(Boolean)
    .reduce((acc, part) => {
      const separatorIndex = part.indexOf('=');
      if (separatorIndex === -1) return acc;
      const key = decodeURIComponent(part.slice(0, separatorIndex));
      const value = decodeURIComponent(part.slice(separatorIndex + 1));
      acc[key] = value;
      return acc;
    }, {});
}

export function createAuthCookie(token) {
  const parts = [
    `${AUTH_COOKIE_NAME}=${encodeURIComponent(token)}`,
    'Path=/',
    'HttpOnly',
    'SameSite=Lax',
    `Max-Age=${60 * 60 * 24 * 7}`,
  ];

  if (process.env.NODE_ENV === 'production') {
    parts.push('Secure');
  }

  return parts.join('; ');
}

export function clearAuthCookie() {
  const parts = [
    `${AUTH_COOKIE_NAME}=`,
    'Path=/',
    'HttpOnly',
    'SameSite=Lax',
    'Max-Age=0',
  ];

  if (process.env.NODE_ENV === 'production') {
    parts.push('Secure');
  }

  return parts.join('; ');
}

export function getAuthUserFromRequest(req) {
  const authHeader = req.headers.authorization || '';
  const [, headerToken] = authHeader.split(' ');
  const cookieToken = parseCookies(req.headers.cookie || '')[AUTH_COOKIE_NAME];
  const token = headerToken || cookieToken;

  if (!token) {
    throw new Error('Missing token');
  }

  const decoded = jwt.verify(token, JWT_SECRET);
  return {
    userId: decoded.userId,
    email: decoded.email,
    username: decoded.username,
  };
}

export function toObjectId(id) {
  if (!id) return null;
  if (id instanceof ObjectId) return id;
  return new ObjectId(String(id));
}
