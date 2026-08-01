import { z } from "zod";

export const updateProfileSchema = z.object({
  firstName: z.string().trim().min(1).max(80).optional(),
  lastName: z.string().trim().min(1).max(80).optional(),
  phone: z.string().trim().min(1).max(30).optional(),
});

export type UpdateProfileDto = z.infer<typeof updateProfileSchema>;
