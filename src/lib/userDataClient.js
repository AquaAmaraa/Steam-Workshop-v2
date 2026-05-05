import { setStoredUser } from './clientCookies';

export async function fetchMongoUserData() {
  const res = await fetch('/api/user-data', {
    credentials: 'include',
  });

  if (!res.ok) {
    throw new Error('Failed to fetch user data');
  }

  return res.json();
}

export async function patchMongoUserData(patch) {
  const res = await fetch('/api/user-data', {
    method: 'PATCH',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(patch),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to update user data');
  }
  return data;
}

export function persistLocalUserData({ user }) {
  if (user) {
    setStoredUser(user);
  }
}
