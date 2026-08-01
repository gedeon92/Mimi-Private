import { Injectable, NotFoundException } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../../../prisma/prisma.service";

interface ListQuery {
  search?: string;
  page: number;
  limit: number;
}

@Injectable()
export class CustomersAdminService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: ListQuery) {
    const where: Prisma.UserWhereInput = { role: "CLIENT" };
    if (query.search) {
      where.OR = [
        { firstName: { contains: query.search, mode: "insensitive" } },
        { lastName: { contains: query.search, mode: "insensitive" } },
        { email: { contains: query.search, mode: "insensitive" } },
      ];
    }

    const [users, total, spendByUser] = await Promise.all([
      this.prisma.user.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (query.page - 1) * query.limit,
        take: query.limit,
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          phone: true,
          createdAt: true,
          _count: { select: { orders: true } },
        },
      }),
      this.prisma.user.count({ where }),
      this.prisma.order.groupBy({
        by: ["userId"],
        _sum: { total: true },
        where: { status: { not: "CANCELED" } },
      }),
    ]);

    const spendMap = new Map(spendByUser.map((s) => [s.userId, s._sum.total ?? 0]));

    return {
      items: users.map((u) => ({
        id: u.id,
        firstName: u.firstName,
        lastName: u.lastName,
        email: u.email,
        phone: u.phone,
        createdAt: u.createdAt,
        orderCount: u._count.orders,
        totalSpent: spendMap.get(u.id) ?? 0,
      })),
      total,
      page: query.page,
      limit: query.limit,
      totalPages: Math.ceil(total / query.limit),
    };
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findFirst({
      where: { id, role: "CLIENT" },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        createdAt: true,
        orders: {
          orderBy: { createdAt: "desc" },
          select: { id: true, status: true, total: true, createdAt: true, items: true },
        },
        addresses: true,
      },
    });
    if (!user) throw new NotFoundException("Client introuvable.");

    const totalSpent = user.orders
      .filter((o) => o.status !== "CANCELED")
      .reduce((sum, o) => sum + o.total, 0);

    return { ...user, orderCount: user.orders.length, totalSpent };
  }
}
