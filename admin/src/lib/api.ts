const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:4000/api";

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

// Token en mémoire uniquement (jamais localStorage), restauré via le cookie
// httpOnly dédié à l'admin (/auth/admin-refresh) — distinct de celui du front client.
let accessToken: string | null = null;

export function setAccessToken(token: string | null): void {
  accessToken = token;
}

interface RefreshResponse {
  accessToken: string;
}

let refreshInFlight: Promise<string | null> | null = null;

export async function refreshAdminSession(): Promise<string | null> {
  if (!refreshInFlight) {
    refreshInFlight = (async () => {
      try {
        const res = await fetch(`${BASE_URL}/auth/admin-refresh`, {
          method: "POST",
          credentials: "include",
        });
        if (!res.ok) return null;
        const data = (await res.json()) as RefreshResponse;
        accessToken = data.accessToken;
        return data.accessToken;
      } catch {
        return null;
      } finally {
        refreshInFlight = null;
      }
    })();
  }
  return refreshInFlight;
}

export async function apiFetch<T>(
  path: string,
  init: RequestInit = {},
  _retried = false,
): Promise<T> {
  const headers = new Headers(init.headers);
  if (!(init.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }
  if (accessToken) headers.set("Authorization", `Bearer ${accessToken}`);

  const response = await fetch(`${BASE_URL}${path}`, {
    ...init,
    headers,
    credentials: "include",
  });

  if (response.status === 401 && !_retried && !path.startsWith("/auth/")) {
    const newToken = await refreshAdminSession();
    if (newToken) {
      return apiFetch<T>(path, init, true);
    }
  }

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new ApiError(body?.message ?? "Une erreur est survenue.", response.status);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}
