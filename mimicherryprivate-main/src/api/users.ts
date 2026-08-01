import { apiFetch } from "@/lib/api";
import type { AuthUser } from "@/api/auth";

export interface UpdateProfilePayload {
  firstName?: string;
  lastName?: string;
  phone?: string;
}

export const updateProfile = (payload: UpdateProfilePayload) =>
  apiFetch<AuthUser>("/users/me", { method: "PATCH", body: JSON.stringify(payload) });

export const changeEmail = (currentPassword: string, newEmail: string) =>
  apiFetch<AuthUser>("/users/me/email", {
    method: "PATCH",
    body: JSON.stringify({ currentPassword, newEmail }),
  });

export const changePassword = (currentPassword: string, newPassword: string) =>
  apiFetch<{ message: string }>("/users/me/password", {
    method: "PATCH",
    body: JSON.stringify({ currentPassword, newPassword }),
  });
