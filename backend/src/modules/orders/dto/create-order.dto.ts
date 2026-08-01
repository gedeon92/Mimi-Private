import { z } from "zod";

export const createOrderSchema = z.object({
  addressId: z.string().uuid().optional(),
  shippingFirstName: z.string().trim().min(1).max(80),
  shippingLastName: z.string().trim().min(1).max(80),
  shippingEmail: z.string().trim().email(),
  shippingPhone: z.string().trim().min(1).max(30),
  shippingLine1: z.string().trim().min(1).max(200),
  shippingLine2: z.string().trim().max(200).optional(),
  shippingCity: z.string().trim().min(1).max(100),
  shippingCountry: z.string().trim().min(1).max(100),
  notes: z.string().trim().max(500).optional(),
});

export type CreateOrderDto = z.infer<typeof createOrderSchema>;
