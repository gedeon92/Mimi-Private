import { z } from "zod";

export const forgotPasswordSchema = z.object({
  email: z.string().trim().toLowerCase().email("Adresse e-mail invalide."),
});

export type ForgotPasswordDto = z.infer<typeof forgotPasswordSchema>;
