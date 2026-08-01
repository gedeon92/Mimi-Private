import { z } from "zod";

export const addCartItemSchema = z.object({
  variantId: z.string().uuid("Identifiant de variante invalide."),
  quantity: z.coerce.number().int().min(1).max(99).default(1),
});

export const updateCartItemSchema = z.object({
  quantity: z.coerce.number().int().min(1).max(99),
});

export const mergeCartSchema = z.object({
  items: z
    .array(
      z.object({
        variantId: z.string().uuid(),
        quantity: z.coerce.number().int().min(1).max(99),
      }),
    )
    .max(100),
});

export type AddCartItemDto = z.infer<typeof addCartItemSchema>;
export type UpdateCartItemDto = z.infer<typeof updateCartItemSchema>;
export type MergeCartDto = z.infer<typeof mergeCartSchema>;
