import { z } from "zod";

export const changeEmailSchema = z.object({
  currentPassword: z.string().min(1, "Le mot de passe actuel est requis."),
  newEmail: z.string().trim().toLowerCase().email("Adresse e-mail invalide."),
});

export type ChangeEmailDto = z.infer<typeof changeEmailSchema>;
