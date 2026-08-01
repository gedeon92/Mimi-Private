import { z } from "zod";

const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

export const createProductSchema = z.object({
  categoryId: z.string().uuid("Catégorie invalide."),
  line: z.string().trim().min(1).max(80),
  name: z.string().trim().min(1).max(80),
  slug: z
    .string()
    .trim()
    .min(1)
    .max(80)
    .transform((s) => slugify(s))
    .optional(),
  ref: z.string().trim().min(1).max(80),
  price: z.coerce.number().int().min(0),
  detail: z.string().trim().max(200).default(""),
  shortDescription: z.string().trim().max(1000).default(""),
  story: z.string().trim().max(3000).default(""),
  designIntent: z.string().trim().max(3000).default(""),
  materials: z.string().trim().max(3000).default(""),
  craftsmanship: z.string().trim().max(3000).default(""),
  care: z.string().trim().max(3000).default(""),
  tag: z.string().trim().max(60).optional(),
  isActive: z.coerce.boolean().default(true),
  displayOrder: z.coerce.number().int().default(0),
});

export const updateProductSchema = createProductSchema.partial();

export { slugify };
export type CreateProductDto = z.infer<typeof createProductSchema>;
export type UpdateProductDto = z.infer<typeof updateProductSchema>;

export const listAdminProductsQuerySchema = z.object({
  search: z.string().trim().min(1).optional(),
  category: z.string().trim().min(1).optional(),
  status: z.enum(["active", "inactive"]).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export type ListAdminProductsQuery = z.infer<typeof listAdminProductsQuerySchema>;
