import { apiFetch } from "@/lib/api";

export interface AdminCustomer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  createdAt: string;
  orderCount: number;
  totalSpent: number;
}

export interface CustomersPage {
  items: AdminCustomer[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CustomerDetail extends Omit<AdminCustomer, "orderCount" | "totalSpent"> {
  orders: {
    id: string;
    status: string;
    total: number;
    createdAt: string;
    items: { id: string; quantity: number }[];
  }[];
  addresses: { id: string; label: string; city: string; isDefault: boolean }[];
  orderCount: number;
  totalSpent: number;
}

export const getAdminCustomers = (search: string, page = 1, limit = 20) => {
  const params = new URLSearchParams();
  if (search) params.set("search", search);
  params.set("page", String(page));
  params.set("limit", String(limit));
  return apiFetch<CustomersPage>(`/admin/customers?${params.toString()}`);
};

export const getAdminCustomer = (id: string) => apiFetch<CustomerDetail>(`/admin/customers/${id}`);
