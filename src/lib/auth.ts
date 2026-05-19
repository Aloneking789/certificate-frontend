export function serializeTokenCookie(token: string, options?: { maxAge?: number }) {
  const maxAge = options?.maxAge ?? 60 * 60 * 24 * 7; // 7 days
  const isProd = process.env.NODE_ENV === 'production';
  return `certiflow_token=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge}; ${isProd ? 'Secure; ' : ''}`;
}

export function serializeTokenCookieClear() {
  const isProd = process.env.NODE_ENV === 'production';
  return `certiflow_token=; Path=/; HttpOnly; Max-Age=0; SameSite=Lax; ${isProd ? 'Secure; ' : ''}`;
}

export function getTokenFromCookieHeader(cookieHeader?: string) {
  if (!cookieHeader) return null;
  const match = cookieHeader.match(/certiflow_token=([^;]+)/);
  return match ? match[1] : null;
}
