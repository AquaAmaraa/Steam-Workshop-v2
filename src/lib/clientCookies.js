const DEFAULT_MAX_AGE = 60 * 60 * 24 * 30;
const USER_COOKIE = 'steam_user';
const LANGUAGE_COOKIE = 'site-language';
const PENDING_ACTIVATION_COOKIE = 'steam_pending_activation';

function shouldUseSecureCookies() {
  return typeof window !== 'undefined' && window.location.protocol === 'https:';
}

export function getCookie(name) {
  if (typeof document === 'undefined') return null;
  const encodedName = `${encodeURIComponent(name)}=`;
  const entry = document.cookie
    .split('; ')
    .find((item) => item.startsWith(encodedName));

  if (!entry) return null;
  return decodeURIComponent(entry.slice(encodedName.length));
}

export function setCookie(name, value, options = {}) {
  if (typeof document === 'undefined') return;

  const {
    maxAge = DEFAULT_MAX_AGE,
    path = '/',
    sameSite = 'Lax',
    secure = shouldUseSecureCookies(),
  } = options;

  const parts = [
    `${encodeURIComponent(name)}=${encodeURIComponent(value)}`,
    `Path=${path}`,
    `SameSite=${sameSite}`,
  ];

  if (typeof maxAge === 'number') {
    parts.push(`Max-Age=${maxAge}`);
  }

  if (secure) {
    parts.push('Secure');
  }

  document.cookie = parts.join('; ');
}

export function removeCookie(name) {
  if (typeof document === 'undefined') return;
  document.cookie = `${encodeURIComponent(name)}=; Path=/; Max-Age=0; SameSite=Lax`;
}

export function getJsonCookie(name, fallback = null) {
  const value = getCookie(name);
  if (!value) return fallback;

  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

export function setJsonCookie(name, value, options = {}) {
  setCookie(name, JSON.stringify(value), options);
}

export function getStoredUser() {
  return getJsonCookie(USER_COOKIE, null);
}

export function setStoredUser(user) {
  if (!user) {
    removeCookie(USER_COOKIE);
    return;
  }

  const lightweightUser = {
    id: user.id,
    username: user.username,
    email: user.email,
  };

  setJsonCookie(USER_COOKIE, lightweightUser, { maxAge: 60 * 60 * 24 * 7 });
}

export function clearStoredUser() {
  removeCookie(USER_COOKIE);
}

export function getStoredLanguage() {
  const value = getCookie(LANGUAGE_COOKIE);
  return value === 'en' || value === 'mn' ? value : null;
}

export function setStoredLanguage(language) {
  if (language !== 'en' && language !== 'mn') return;
  setCookie(LANGUAGE_COOKIE, language, { maxAge: 60 * 60 * 24 * 365 });
}

export function getPendingActivationCode() {
  return getCookie(PENDING_ACTIVATION_COOKIE) || '';
}

export function setPendingActivationCode(code) {
  if (!code) {
    removeCookie(PENDING_ACTIVATION_COOKIE);
    return;
  }
  setCookie(PENDING_ACTIVATION_COOKIE, code, { maxAge: 60 * 30 });
}

export async function clearClientSession() {
  try {
    await fetch('/api/logout', { method: 'POST' });
  } catch {
    // Ignore network errors during client-side logout cleanup.
  }

  clearStoredUser();
  setPendingActivationCode('');
}
