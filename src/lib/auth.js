// lib/auth.js

// Client-side functions (for use in components)
export function setAuthToken(token) {
  if (typeof document !== 'undefined') {
    document.cookie = `auth-token=${token}; path=/; max-age=86400`; // 1 day
  }
}

export function removeAuthToken() {
  if (typeof document !== 'undefined') {
    document.cookie = 'auth-token=; path=/; max-age=0';
  }
}

export function getAuthToken() {
  if (typeof document !== 'undefined') {
    return document.cookie
      .split('; ')
      .find(row => row.startsWith('auth-token='))
      ?.split('=')[1];
  }
  return null;
}

// Server-side function (for middleware) - you can remove this since it's in middleware now
export function getTokenFromRequest(req) {
  const cookieHeader = req.headers.get('cookie') || '';
  const tokenMatch = cookieHeader.match(/auth-token=([^;]+)/);
  return tokenMatch ? tokenMatch[1] : false;
}