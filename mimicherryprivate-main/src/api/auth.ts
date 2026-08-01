import { apiFetch, setAccessToken } from "@/lib/api";

export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  role: "CLIENT" | "ADMIN";
}

interface AuthResponse {
  accessToken: string;
  user: AuthUser;
}

function applyAuthResponse(res: AuthResponse): AuthUser {
  setAccessToken(res.accessToken);
  return res.user;
}

export interface RegisterPayload {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

export async function register(payload: RegisterPayload): Promise<AuthUser> {
  const res = await apiFetch<AuthResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return applyAuthResponse(res);
}

export async function login(email: string, password: string): Promise<AuthUser> {
  const res = await apiFetch<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  return applyAuthResponse(res);
}

export async function logout(): Promise<void> {
  await apiFetch("/auth/logout", { method: "POST" });
  setAccessToken(null);
}

export async function fetchCurrentUser(): Promise<AuthUser> {
  return apiFetch<AuthUser>("/auth/me");
}

export async function forgotPassword(email: string): Promise<void> {
  await apiFetch("/auth/forgot-password", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

export async function resetPassword(token: string, password: string): Promise<void> {
  await apiFetch("/auth/reset-password", {
    method: "POST",
    body: JSON.stringify({ token, password }),
  });
}
