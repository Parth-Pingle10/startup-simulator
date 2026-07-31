export const AUTH_STORAGE_KEY = "ass.auth.v1";

export type StoredAuth = {
  accessToken: string;
  refreshToken: string;
  userId: string;
  email: string;
  name: string;
};

export function readAuth(): StoredAuth | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(AUTH_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as StoredAuth) : null;
  } catch {
    return null;
  }
}

export function writeAuth(auth: StoredAuth | null) {
  if (typeof window === "undefined") return;
  if (!auth) {
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
    return;
  }
  window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(auth));
}

export function clearAuth() {
  writeAuth(null);
}
