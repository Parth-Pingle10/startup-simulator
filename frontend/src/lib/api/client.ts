import { readAuth, clearAuth } from "@/lib/auth/storage";

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

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
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
    if (response.status === 401) {
      clearAuth();
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
