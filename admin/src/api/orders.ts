import { apiFetch } from "@/lib/api";

export type OrderStatus = "PENDING" | "PAID" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELED";

export interface AdminOrderItem {
  id: string;
  variantId: string | null;
  productName: string;
  colorName: string;
  image: string;
  unitPrice: number;
  quantity: number;
}

export interface AdminOrder {
  id: string;
  status: OrderStatus;
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
  user: { id: string; firstName: string; lastName: string; email: string };
  items: AdminOrderItem[];
  payment: { id: string; provider: string; status: string; amount: number } | null;
}

export interface OrdersPage {
  items: AdminOrder[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface OrdersFilter {
  status?: OrderStatus;
  search?: string;
  page?: number;
  limit?: number;
}

function toQueryString(filter: OrdersFilter): string {
  const params = new URLSearchParams();
  if (filter.status) params.set("status", filter.status);
  if (filter.search) params.set("search", filter.search);
  params.set("page", String(filter.page ?? 1));
  params.set("limit", String(filter.limit ?? 20));
  return params.toString();
}

export const getAdminOrders = (filter: OrdersFilter = {}) =>
  apiFetch<OrdersPage>(`/admin/orders?${toQueryString(filter)}`);

export const getAdminOrder = (id: string) => apiFetch<AdminOrder>(`/admin/orders/${id}`);

export const updateOrderStatus = (id: string, status: OrderStatus) =>
  apiFetch<AdminOrder>(`/admin/orders/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
