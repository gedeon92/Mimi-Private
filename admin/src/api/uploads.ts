import { apiFetch } from "@/lib/api";

export interface UploadResult {
  url: string;
  publicId: string;
}

export const uploadImage = async (file: File): Promise<UploadResult> => {
  const form = new FormData();
  form.append("file", file);
  return apiFetch<UploadResult>("/admin/uploads", { method: "POST", body: form });
};

export const deleteUploadedImage = (publicId: string) =>
  apiFetch<{ success: boolean }>(`/admin/uploads/${publicId}`, { method: "DELETE" });
