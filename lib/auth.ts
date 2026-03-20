export interface AuthUser {
  id: string;
  name: string;
  email: string;
}

const KEY = 'el_user';

export function getUser(): AuthUser | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp(`(?:^|;\\s*)${KEY}=([^;]*)`));
  if (!match) return null;
  try {
    return JSON.parse(decodeURIComponent(match[1])) as AuthUser;
  } catch {
    return null;
  }
}

export function setUser(user: AuthUser): void {
  const val = encodeURIComponent(JSON.stringify(user));
  document.cookie = `${KEY}=${val}; path=/; max-age=${7 * 24 * 3600}; SameSite=Lax`;
}

export function removeUser(): void {
  document.cookie = `${KEY}=; path=/; max-age=0; SameSite=Lax`;
}
