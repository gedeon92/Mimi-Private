import { z } from "zod";

export const listCustomersQuerySchema = z.object({
  search: z.string().trim().min(1).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export type ListCustomersQuery = z.infer<typeof listCustomersQuerySchema>;
