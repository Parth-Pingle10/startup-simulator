import { readAuth, clearAuth, writeAuth } from "@/lib/auth/storage";

const DEFAULT_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";

export type ApiErrorShape = {
  message: string;
  status: number;
  details?: unknown;
};

class ApiError extends Error {
  status: number;
  details?: unknown;

  constructor(message: string, status: number, details?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

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

/** Refresh access token using the 7-day refresh token. Returns false if session is over. */
async function refreshAccessToken(): Promise<boolean> {
  const auth = readAuth();
  if (!auth?.refreshToken) return false;

  const userId = auth.userId || userIdFromAccessToken(auth.accessToken);
  if (!userId) return false;

  try {
    const response = await fetch(`${DEFAULT_BASE_URL}/auth/refresh`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: userId,
        refresh_token: auth.refreshToken,
      }),
    });

    if (!response.ok) {
      clearAuth();
      return false;
    }

    const result = (await response.json()) as {
      access_token: string;
      refresh_token: string;
    };

    writeAuth({
      ...auth,
      userId,
      accessToken: result.access_token,
      refreshToken: result.refresh_token,
    });
    return true;
  } catch {
    clearAuth();
    return false;
  }
}

let refreshPromise: Promise<boolean> | null = null;

function ensureRefreshed() {
  if (!refreshPromise) {
    refreshPromise = refreshAccessToken().finally(() => {
      refreshPromise = null;
    });
  }
  return refreshPromise;
}

function isAuthPath(path: string) {
  return path.startsWith("/auth/");
}

async function request<T>(path: string, init: RequestInit = {}, retried = false): Promise<T> {
  const auth = readAuth();
  const headers = new Headers(init.headers);
  headers.set("Accept", "application/json");

  if (auth?.accessToken) {
    headers.set("Authorization", `Bearer ${auth.accessToken}`);
  }

  if (!(init.body instanceof FormData) && !headers.has("Content-Type") && init.body != null) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(`${DEFAULT_BASE_URL}${path}`, {
    ...init,
    headers,
  });

  const contentType = response.headers.get("content-type") ?? "";
  const isJson = contentType.includes("application/json");
  const payload = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    // Access token expired (~30 min) — try refresh token (valid ~7 days) once
    if (response.status === 401 && !retried && !isAuthPath(path) && readAuth()?.refreshToken) {
      const refreshed = await ensureRefreshed();
      if (refreshed) {
        return request<T>(path, init, true);
      }
      if (typeof window !== "undefined" && !window.location.pathname.startsWith("/login")) {
        window.location.assign("/login");
      }
    } else if (response.status === 401) {
      clearAuth();
      if (
        typeof window !== "undefined" &&
        !isAuthPath(path) &&
        !window.location.pathname.startsWith("/login")
      ) {
        window.location.assign("/login");
      }
    }

    const errorMessage =
      typeof payload === "object" && payload && "detail" in payload
        ? String((payload as { detail?: unknown }).detail ?? "Request failed")
        : typeof payload === "string"
          ? payload
          : "Request failed";

    throw new ApiError(errorMessage, response.status, payload);
  }

  return payload as T;
}

export function apiGet<T>(path: string) {
  return request<T>(path, { method: "GET" });
}

export function apiPost<T>(path: string, body?: unknown) {
  return request<T>(path, {
    method: "POST",
    body: body == null ? undefined : JSON.stringify(body),
  });
}

export function apiDelete<T>(path: string) {
  return request<T>(path, { method: "DELETE" });
}

export { ApiError };
export const API_BASE_URL = DEFAULT_BASE_URL;
