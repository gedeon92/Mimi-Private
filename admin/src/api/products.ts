import { apiFetch } from "@/lib/api";

export interface AdminImage {
  id: string;
  url: string;
  publicId: string | null;
  position: number;
}

export interface AdminVariant {
  id: string;
  colorName: string;
  swatchHex: string;
  sku: string;
  stock: number;
  images: AdminImage[];
}

export interface AdminProduct {
  id: string;
  categoryId: string;
  category: { id: string; name: string; slug: string };
  line: string;
  name: string;
  slug: string;
  ref: string;
  price: number;
  detail: string;
  shortDescription: string;
  story: string;
  designIntent: string;
  materials: string;
  craftsmanship: string;
  care: string;
  tag: string | null;
  isActive: boolean;
  displayOrder: number;
  variants: AdminVariant[];
}

export interface ProductsPage {
  items: AdminProduct[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ProductsFilter {
  search?: string;
  category?: string;
  status?: "active" | "inactive";
  page?: number;
  limit?: number;
}

export interface ProductPayload {
  categoryId: string;
  line: string;
  name: string;
  slug?: string;
  ref: string;
  price: number;
  detail?: string;
  shortDescription?: string;
  story?: string;
  designIntent?: string;
  materials?: string;
  craftsmanship?: string;
  care?: string;
  tag?: string;
  isActive?: boolean;
  displayOrder?: number;
}

export interface VariantPayload {
  colorName: string;
  swatchHex: string;
  sku: string;
  stock: number;
}

function toQueryString(filter: ProductsFilter): string {
  const params = new URLSearchParams();
  if (filter.search) params.set("search", filter.search);
  if (filter.category) params.set("category", filter.category);
  if (filter.status) params.set("status", filter.status);
  params.set("page", String(filter.page ?? 1));
  params.set("limit", String(filter.limit ?? 20));
  return params.toString();
}

export const getAdminProducts = (filter: ProductsFilter = {}) =>
  apiFetch<ProductsPage>(`/admin/products?${toQueryString(filter)}`);

export const getAdminProduct = (id: string) => apiFetch<AdminProduct>(`/admin/products/${id}`);

export const createProduct = (payload: ProductPayload) =>
  apiFetch<AdminProduct>("/admin/products", { method: "POST", body: JSON.stringify(payload) });

export const updateProduct = (id: string, payload: Partial<ProductPayload>) =>
  apiFetch<AdminProduct>(`/admin/products/${id}`, { method: "PATCH", body: JSON.stringify(payload) });

export const deleteProduct = (id: string) =>
  apiFetch<void>(`/admin/products/${id}`, { method: "DELETE" });

export const addVariant = (productId: string, payload: VariantPayload) =>
  apiFetch<AdminProduct>(`/admin/products/${productId}/variants`, {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const updateVariant = (variantId: string, payload: Partial<VariantPayload>) =>
  apiFetch<AdminProduct>(`/admin/products/variants/${variantId}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });

export const removeVariant = (variantId: string) =>
  apiFetch<AdminProduct>(`/admin/products/variants/${variantId}`, { method: "DELETE" });

export const addImage = (variantId: string, url: string, position = 0, publicId?: string) =>
  apiFetch<AdminProduct>(`/admin/products/variants/${variantId}/images`, {
    method: "POST",
    body: JSON.stringify({ url, position, publicId }),
  });

export const removeImage = (imageId: string) =>
  apiFetch<AdminProduct>(`/admin/products/images/${imageId}`, { method: "DELETE" });

export const setMainImage = (imageId: string) =>
  apiFetch<AdminProduct>(`/admin/products/images/${imageId}/main`, { method: "POST" });
