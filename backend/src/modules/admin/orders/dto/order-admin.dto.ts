import { z } from "zod";

export const orderStatusEnum = z.enum([
  "PENDING",
  "PAID",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELED",
]);

export const updateOrderStatusSchema = z.object({
  status: orderStatusEnum,
});

export const listAdminOrdersQuerySchema = z.object({
  status: orderStatusEnum.optional(),
  search: z.string().trim().min(1).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export type UpdateOrderStatusDto = z.infer<typeof updateOrderStatusSchema>;
export type ListAdminOrdersQuery = z.infer<typeof listAdminOrdersQuerySchema>;
