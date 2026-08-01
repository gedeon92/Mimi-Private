import { z } from "zod";

export const resetPasswordSchema = z.object({
  token: z.string().min(1, "Jeton manquant."),
  password: z
    .string()
    .min(8, "Le mot de passe doit contenir au moins 8 caractères.")
    .max(72, "Le mot de passe est trop long."),
});

export type ResetPasswordDto = z.infer<typeof resetPasswordSchema>;
