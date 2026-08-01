import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Adresse e-mail invalide."),
  password: z.string().min(1, "Le mot de passe est requis."),
});

export type LoginDto = z.infer<typeof loginSchema>;
