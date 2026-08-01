import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import { formatFcfa } from "@/context/CartContext";
import { resolveProductImage } from "@/data/productAssets";
import type { Product, ProductColor } from "@/data/products";

interface ApiProductImage {
  url: string;
  position: number;
}

interface ApiProductVariant {
  id: string;
  colorName: string;
  swatchHex: string;
  stock: number;
  images: ApiProductImage[];
}

interface ApiProduct {
  slug: string;
  line: string;
  name: string;
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
  category: { name: string; slug: string };
  variants: ApiProductVariant[];
}

interface ProductsListResponse {
  items: ApiProduct[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

function mapProduct(api: ApiProduct): Product {
  const colors: ProductColor[] = api.variants.map((v) => ({
    id: v.id,
    name: v.colorName,
    swatch: v.swatchHex,
    img: resolveProductImage(v.images[0]?.url),
    stock: v.stock,
  }));

  return {
    id: api.slug,
    line: api.line,
    name: api.name,
    category: api.category.name,
    ref: api.ref,
    price: formatFcfa(api.price),
    img: colors[0]?.img ?? "",
    detail: api.detail,
    shortDescription: api.shortDescription,
    tag: api.tag,
    colors,
    story: api.story,
    designIntent: api.designIntent,
    materials: api.materials,
    craftsmanship: api.craftsmanship,
    care: api.care,
  };
}

export interface ProductsFilter {
  search?: string;
  category?: string;
  sort?: "featured" | "price_asc" | "price_desc";
}

/** Liste du catalogue, avec recherche/filtre/tri optionnels côté serveur. */
export function useProducts(filter: ProductsFilter = {}) {
  return useQuery({
    queryKey: ["products", filter],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filter.search) params.set("search", filter.search);
      if (filter.category) params.set("category", filter.category);
      if (filter.sort) params.set("sort", filter.sort);
      params.set("limit", "50");

      const data = await apiFetch<ProductsListResponse>(`/products?${params.toString()}`);
      return data.items.map(mapProduct);
    },
    staleTime: 5 * 60_000,
  });
}

/** Fiche produit par slug (ex. "standard"). */
export function useProduct(slug: string | undefined) {
  return useQuery({
    queryKey: ["product", slug],
    queryFn: () => apiFetch<ApiProduct>(`/products/${slug}`).then(mapProduct),
    enabled: Boolean(slug),
    staleTime: 5 * 60_000,
  });
}
