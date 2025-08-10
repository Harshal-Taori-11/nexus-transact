export type JwtClaims = {
  role?: string[];
  sub?: string; // phone number
  iat?: number;
  exp?: number;
};

export function parseJwt(token: string): JwtClaims | null {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => `%${('00' + c.charCodeAt(0).toString(16)).slice(-2)}`)
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

export function isTokenExpired(token?: string | null): boolean {
  if (!token) return true;
  const claims = parseJwt(token);
  if (!claims?.exp) return true;
  const now = Math.floor(Date.now() / 1000);
  return claims.exp <= now;
}
