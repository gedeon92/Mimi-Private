import { z } from "zod";

export const addFavoriteSchema = z.object({
  variantId: z.string().uuid("Identifiant de variante invalide."),
});

export const mergeFavoritesSchema = z.object({
  variantIds: z.array(z.string().uuid()).max(200),
});

export type AddFavoriteDto = z.infer<typeof addFavoriteSchema>;
export type MergeFavoritesDto = z.infer<typeof mergeFavoritesSchema>;
