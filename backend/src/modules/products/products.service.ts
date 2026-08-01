import { Injectable, NotFoundException } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../../prisma/prisma.service";
import type { ListProductsQuery } from "./dto/list-products.query";

const PRODUCT_INCLUDE = {
  category: true,
  variants: {
    orderBy: { createdAt: "asc" as const },
    include: {
      images: { orderBy: { position: "asc" as const } },
    },
  },
};

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: ListProductsQuery) {
    const where: Prisma.ProductWhereInput = { isActive: true };

    if (query.category) {
      where.category = { slug: query.category };
    }

    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: "insensitive" } },
        { line: { contains: query.search, mode: "insensitive" } },
        { detail: { contains: query.search, mode: "insensitive" } },
        { ref: { contains: query.search, mode: "insensitive" } },
        { category: { name: { contains: query.search, mode: "insensitive" } } },
      ];
    }

    const orderBy: Prisma.ProductOrderByWithRelationInput =
      query.sort === "price_asc"
        ? { price: "asc" }
        : query.sort === "price_desc"
          ? { price: "desc" }
          : { displayOrder: "asc" };

    const [items, total] = await this.prisma.$transaction([
      this.prisma.product.findMany({
        where,
        orderBy,
        skip: (query.page - 1) * query.limit,
        take: query.limit,
        include: PRODUCT_INCLUDE,
      }),
      this.prisma.product.count({ where }),
    ]);

    return {
      items,
      total,
      page: query.page,
      limit: query.limit,
      totalPages: Math.ceil(total / query.limit),
    };
  }

  async findOne(slug: string) {
    const product = await this.prisma.product.findFirst({
      where: { slug, isActive: true },
      include: PRODUCT_INCLUDE,
    });

    if (!product) {
      throw new NotFoundException("Pièce introuvable.");
    }

    return product;
  }
}
