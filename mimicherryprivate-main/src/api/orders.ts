import { apiFetch } from "@/lib/api";

export interface OrderItem {
  id: string;
  variantId: string | null;
  productName: string;
  colorName: string;
  image: string;
  unitPrice: number;
  quantity: number;
}

export interface OrderPayment {
  id: string;
  provider: string;
  status: "PENDING" | "PAID" | "FAILED" | "REFUNDED";
  amount: number;
  transactionRef: string | null;
  paidAt: string | null;
}

export interface Order {
  id: string;
  status: "PENDING" | "PAID" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELED";
  subtotal: number;
  shippingCost: number;
  total: number;
  shippingFirstName: string;
  shippingLastName: string;
  shippingEmail: string;
  shippingPhone: string;
  shippingLine1: string;
  shippingLine2: string | null;
  shippingCity: string;
  shippingCountry: string;
  notes: string | null;
  createdAt: string;
  items: OrderItem[];
  payment: OrderPayment | null;
}

export interface CreateOrderPayload {
  addressId?: string;
  shippingFirstName: string;
  shippingLastName: string;
  shippingEmail: string;
  shippingPhone: string;
  shippingLine1: string;
  shippingLine2?: string;
  shippingCity: string;
  shippingCountry: string;
  notes?: string;
}

export const getOrders = () => apiFetch<Order[]>("/orders");

export const getOrder = (id: string) => apiFetch<Order>(`/orders/${id}`);

export const createOrder = (payload: CreateOrderPayload) =>
  apiFetch<Order>("/orders", { method: "POST", body: JSON.stringify(payload) });
