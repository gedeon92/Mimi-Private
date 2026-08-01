import { Injectable, NotFoundException } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../../../prisma/prisma.service";
import type { ListAdminOrdersQuery, UpdateOrderStatusDto } from "./dto/order-admin.dto";

const ORDER_INCLUDE = {
  user: { select: { id: true, firstName: true, lastName: true, email: true } },
  items: true,
  payment: true,
};

@Injectable()
export class OrdersAdminService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: ListAdminOrdersQuery) {
    const where: Prisma.OrderWhereInput = {};
    if (query.status) where.status = query.status;
    if (query.search) {
      where.user = {
        OR: [
          { firstName: { contains: query.search, mode: "insensitive" } },
          { lastName: { contains: query.search, mode: "insensitive" } },
          { email: { contains: query.search, mode: "insensitive" } },
        ],
      };
    }

    const [items, total] = await this.prisma.$transaction([
      this.prisma.order.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (query.page - 1) * query.limit,
        take: query.limit,
        include: ORDER_INCLUDE,
      }),
      this.prisma.order.count({ where }),
    ]);

    return { items, total, page: query.page, limit: query.limit, totalPages: Math.ceil(total / query.limit) };
  }

  async findOne(id: string) {
    const order = await this.prisma.order.findUnique({ where: { id }, include: ORDER_INCLUDE });
    if (!order) throw new NotFoundException("Commande introuvable.");
    return order;
  }

  async updateStatus(id: string, dto: UpdateOrderStatusDto) {
    const order = await this.findOne(id);

    if (dto.status === "CANCELED" && order.status !== "CANCELED") {
      await this.prisma.$transaction([
        ...order.items
          .filter((item) => item.variantId)
          .map((item) =>
            this.prisma.productVariant.update({
              where: { id: item.variantId! },
              data: { stock: { increment: item.quantity } },
            }),
          ),
        this.prisma.order.update({ where: { id }, data: { status: dto.status } }),
      ]);
    } else {
      await this.prisma.order.update({ where: { id }, data: { status: dto.status } });
    }

    return this.findOne(id);
  }
}
