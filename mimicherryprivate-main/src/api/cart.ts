import { apiFetch } from "@/lib/api";

export interface ServerCartLine {
  id: string;
  quantity: number;
  variantId: string;
  productId: string;
  productSlug: string;
  line: string;
  name: string;
  category: string;
  colorName: string;
  swatchHex: string;
  /** Clé d'image à résoudre via productAssets, ou URL absolue une fois Cloudinary branché. */
  image: string;
  price: number;
  stock: number;
}

export const getServerCart = () => apiFetch<ServerCartLine[]>("/cart");

export const addServerCartItem = (variantId: string, quantity = 1) =>
  apiFetch<ServerCartLine[]>("/cart/items", {
    method: "POST",
    body: JSON.stringify({ variantId, quantity }),
  });

export const updateServerCartItem = (variantId: string, quantity: number) =>
  apiFetch<ServerCartLine[]>(`/cart/items/${variantId}`, {
    method: "PATCH",
    body: JSON.stringify({ quantity }),
  });

export const removeServerCartItem = (variantId: string) =>
  apiFetch<ServerCartLine[]>(`/cart/items/${variantId}`, { method: "DELETE" });

export const clearServerCart = () => apiFetch<ServerCartLine[]>("/cart", { method: "DELETE" });

export const mergeServerCart = (items: { variantId: string; quantity: number }[]) =>
  apiFetch<ServerCartLine[]>("/cart/merge", {
    method: "POST",
    body: JSON.stringify({ items }),
  });
