const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:4000/api";

/** Erreur HTTP normalisée — porte le statut pour permettre un traitement fin par l'appelant. */
export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

// Le token d'accès vit uniquement en mémoire (jamais localStorage) : il
// disparaît à chaque rechargement de page, restauré ensuite via /auth/refresh
// (cookie httpOnly, invisible en JavaScript).
let accessToken: string | null = null;

export function setAccessToken(token: string | null): void {
  accessToken = token;
}

interface RefreshResponse {
  accessToken: string;
}

let refreshInFlight: Promise<string | null> | null = null;

/** Tente de restaurer une session à partir du cookie de refresh. Ne lève jamais. */
export async function refreshSession(): Promise<string | null> {
  if (!refreshInFlight) {
    refreshInFlight = (async () => {
      try {
        const res = await fetch(`${BASE_URL}/auth/refresh`, {
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

/**
 * Wrapper fetch pour l'API Mimi Cherry Private. Attache automatiquement le
 * token d'accès s'il est présent, et tente un unique rafraîchissement
 * silencieux sur un 401 (hors routes /auth/*, où un 401 est un résultat
 * métier normal — mauvais mot de passe, session absente — pas une expiration).
 */
export async function apiFetch<T>(
  path: string,
  init: RequestInit = {},
  _retried = false,
): Promise<T> {
  const headers = new Headers(init.headers);
  headers.set("Content-Type", "application/json");
  if (accessToken) headers.set("Authorization", `Bearer ${accessToken}`);

  const response = await fetch(`${BASE_URL}${path}`, {
    ...init,
    headers,
    credentials: "include",
  });

  if (response.status === 401 && !_retried && !path.startsWith("/auth/")) {
    const newToken = await refreshSession();
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
