import { apiFetch } from "@/lib/api";

export interface AdminCategory {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
  productCount: number;
}

export const getCategories = () => apiFetch<AdminCategory[]>("/admin/categories");

export const createCategory = (name: string) =>
  apiFetch<AdminCategory>("/admin/categories", { method: "POST", body: JSON.stringify({ name }) });

export const updateCategory = (id: string, name: string) =>
  apiFetch<AdminCategory>(`/admin/categories/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ name }),
  });

export const deleteCategory = (id: string) =>
  apiFetch<void>(`/admin/categories/${id}`, { method: "DELETE" });
