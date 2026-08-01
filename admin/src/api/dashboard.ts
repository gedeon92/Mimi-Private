import { apiFetch } from "@/lib/api";

export interface DashboardStats {
  totalProducts: number;
  activeProducts: number;
  outOfStockProducts: number;
  totalOrders: number;
  revenue: number;
  totalCustomers: number;
  recentOrders: {
    id: string;
    customerName: string;
    total: number;
    status: string;
    createdAt: string;
  }[];
  topProducts: { name: string; quantitySold: number }[];
}

export const getDashboardStats = () => apiFetch<DashboardStats>("/admin/dashboard");
