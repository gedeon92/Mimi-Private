import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().trim().toLowerCase().email("Adresse e-mail invalide."),
  password: z
    .string()
    .min(8, "Le mot de passe doit contenir au moins 8 caractères.")
    .max(72, "Le mot de passe est trop long."),
  firstName: z.string().trim().min(1, "Le prénom est requis.").max(80),
  lastName: z.string().trim().min(1, "Le nom est requis.").max(80),
  phone: z.string().trim().min(1).max(30).optional(),
});

export type RegisterDto = z.infer<typeof registerSchema>;
