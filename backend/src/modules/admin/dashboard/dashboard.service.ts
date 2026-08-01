import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../../prisma/prisma.service";

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getStats() {
    const [
      totalProducts,
      activeProducts,
      totalOrders,
      totalCustomers,
      revenueAgg,
      recentOrders,
      productsWithStock,
      topProductsRaw,
    ] = await Promise.all([
      this.prisma.product.count(),
      this.prisma.product.count({ where: { isActive: true } }),
      this.prisma.order.count(),
      this.prisma.user.count({ where: { role: "CLIENT" } }),
      this.prisma.order.aggregate({
        _sum: { total: true },
        where: { status: { not: "CANCELED" } },
      }),
      this.prisma.order.findMany({
        take: 8,
        orderBy: { createdAt: "desc" },
        include: { user: { select: { firstName: true, lastName: true } } },
      }),
      this.prisma.product.findMany({
        select: { id: true, name: true, variants: { select: { stock: true } } },
      }),
      this.prisma.orderItem.groupBy({
        by: ["productName"],
        _sum: { quantity: true },
        orderBy: { _sum: { quantity: "desc" } },
        take: 5,
      }),
    ]);

    const outOfStockProducts = productsWithStock.filter((p) =>
      p.variants.every((v) => v.stock <= 0),
    ).length;

    return {
      totalProducts,
      activeProducts,
      outOfStockProducts,
      totalOrders,
      revenue: revenueAgg._sum.total ?? 0,
      totalCustomers,
      recentOrders: recentOrders.map((o) => ({
        id: o.id,
        customerName: `${o.user.firstName} ${o.user.lastName}`,
        total: o.total,
        status: o.status,
        createdAt: o.createdAt,
      })),
      topProducts: topProductsRaw.map((p) => ({
        name: p.productName,
        quantitySold: p._sum.quantity ?? 0,
      })),
    };
  }
}
