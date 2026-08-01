import { z } from "zod";

export const listProductsQuerySchema = z.object({
  search: z.string().trim().min(1).optional(),
  category: z.string().trim().min(1).optional(),
  sort: z.enum(["featured", "price_asc", "price_desc"]).default("featured"),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(20),
});

export type ListProductsQuery = z.infer<typeof listProductsQuerySchema>;
