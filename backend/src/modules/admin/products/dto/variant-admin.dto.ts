import { z } from "zod";

export const createVariantSchema = z.object({
  colorName: z.string().trim().min(1).max(60),
  swatchHex: z
    .string()
    .trim()
    .regex(/^#[0-9a-fA-F]{6}$/, "Couleur invalide (format #RRGGBB attendu)."),
  sku: z.string().trim().min(1).max(80),
  stock: z.coerce.number().int().min(0).default(0),
});

export const updateVariantSchema = createVariantSchema.partial();

export type CreateVariantDto = z.infer<typeof createVariantSchema>;
export type UpdateVariantDto = z.infer<typeof updateVariantSchema>;

export const createImageSchema = z.object({
  url: z.string().trim().min(1).max(500),
  publicId: z.string().trim().max(300).optional(),
  position: z.coerce.number().int().min(0).default(0),
});

export type CreateImageDto = z.infer<typeof createImageSchema>;
