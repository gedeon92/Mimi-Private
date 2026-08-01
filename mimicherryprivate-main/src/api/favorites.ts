import { apiFetch } from "@/lib/api";

export interface ServerFavorite {
  id: string;
  variantId: string;
  productId: string;
  productSlug: string;
  line: string;
  name: string;
  category: string;
  colorName: string;
  swatchHex: string;
  image: string;
  price: number;
  stock: number;
}

export const getServerFavorites = () => apiFetch<ServerFavorite[]>("/favorites");

export const addServerFavorite = (variantId: string) =>
  apiFetch<ServerFavorite[]>("/favorites", {
    method: "POST",
    body: JSON.stringify({ variantId }),
  });

export const removeServerFavorite = (variantId: string) =>
  apiFetch<ServerFavorite[]>(`/favorites/${variantId}`, { method: "DELETE" });

export const mergeServerFavorites = (variantIds: string[]) =>
  apiFetch<ServerFavorite[]>("/favorites/merge", {
    method: "POST",
    body: JSON.stringify({ variantIds }),
  });
