import { apiGet, apiPost } from "@/lib/api/client";
import { clearAuth, readAuth, writeAuth, type StoredAuth } from "@/lib/auth/storage";

export type RegisterPayload = {
  name: string;
  email: string;
  password: string;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type AuthResponse = {
  access_token: string;
  refresh_token: string;
  token_type: string;
};

export type CurrentUser = {
  user_id: string;
  name: string;
  email: string;
  created_at?: string;
};

function userIdFromAccessToken(token: string): string {
  try {
    const part = token.split(".")[1];
    if (!part) return "";
    const json = atob(part.replace(/-/g, "+").replace(/_/g, "/"));
    const payload = JSON.parse(json) as { user_id?: string };
    return payload.user_id ?? "";
  } catch {
    return "";
  }
}

export async function registerUser(payload: RegisterPayload) {
  return apiPost<{ message: string }>('/auth/register', payload);
}

export async function loginUser(payload: LoginPayload) {
  const result = await apiPost<AuthResponse>('/auth/login', payload);
  const auth: StoredAuth = {
    accessToken: result.access_token,
    refreshToken: result.refresh_token,
    userId: userIdFromAccessToken(result.access_token),
    email: payload.email,
    name: payload.email.split("@")[0],
  };
  writeAuth(auth);
  return result;
}

function persistTokens(result: AuthResponse, email: string) {
  const auth: StoredAuth = {
    accessToken: result.access_token,
    refreshToken: result.refresh_token,
    userId: userIdFromAccessToken(result.access_token),
    email,
    name: email.split("@")[0],
  };
  writeAuth(auth);
  return result;
}

export async function requestOtp(email: string) {
  return apiPost<{ message: string; status?: string; dev_mode?: boolean }>("/auth/otp/request", {
    email,
  });
}

export async function verifyOtp(payload: { email: string; code: string; name?: string }) {
  return apiPost<{ message: string; status?: string; dev_mode?: boolean }>('/auth/otp/verify', payload);
}

export async function fetchCurrentUser() {
  const user = await apiGet<CurrentUser>('/auth/me');
  const auth = readAuth();
  if (auth) {
    writeAuth({ ...auth, userId: user.user_id, email: user.email, name: user.name });
  }
  return user;
}

export async function logoutUser() {
  const auth = readAuth();
  if (!auth) {
    clearAuth();
    return { message: "Logged out" };
  }

  try {
    await apiPost('/auth/logout', {
      user_id: auth.userId,
      refresh_token: auth.refreshToken,
    });
  } catch {
    // ignore logout API failures and clear local session
  } finally {
    clearAuth();
  }

  return { message: "Logged out" };
}

export function getStoredAuth() {
  return readAuth();
}
