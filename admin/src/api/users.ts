import { apiFetch } from "@/lib/api";
import type { AdminUser } from "@/api/auth";

export interface UpdateProfilePayload {
  firstName?: string;
  lastName?: string;
  phone?: string;
}

export const updateAdminProfile = (payload: UpdateProfilePayload) =>
  apiFetch<AdminUser>("/users/me", { method: "PATCH", body: JSON.stringify(payload) });

export const changeAdminPassword = (currentPassword: string, newPassword: string) =>
  apiFetch<{ message: string }>("/users/me/password", {
    method: "PATCH",
    body: JSON.stringify({ currentPassword, newPassword }),
  });
