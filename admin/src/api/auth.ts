import { apiFetch, setAccessToken } from "@/lib/api";

export interface AdminUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  role: "CLIENT" | "ADMIN";
}

interface AuthResponse {
  accessToken: string;
  user: AdminUser;
}

function applyAuthResponse(res: AuthResponse): AdminUser {
  setAccessToken(res.accessToken);
  return res.user;
}

export async function adminLogin(email: string, password: string): Promise<AdminUser> {
  const res = await apiFetch<AuthResponse>("/auth/admin-login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  return applyAuthResponse(res);
}

export async function adminLogout(): Promise<void> {
  await apiFetch("/auth/admin-logout", { method: "POST" });
  setAccessToken(null);
}

export async function fetchCurrentAdmin(): Promise<AdminUser> {
  return apiFetch<AdminUser>("/auth/me");
}

export async function adminForgotPassword(email: string): Promise<void> {
  await apiFetch("/auth/admin-forgot-password", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

export async function adminResetPassword(token: string, password: string): Promise<void> {
  await apiFetch("/auth/reset-password", {
    method: "POST",
    body: JSON.stringify({ token, password }),
  });
}
