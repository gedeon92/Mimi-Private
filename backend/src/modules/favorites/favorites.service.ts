import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";

const FAVORITE_INCLUDE = {
  variant: {
    include: {
      product: { include: { category: true } },
      images: { orderBy: { position: "asc" as const }, take: 1 },
    },
  },
};

function mapFavorite(fav: {
  id: string;
  variant: {
    id: string;
    colorName: string;
    swatchHex: string;
    stock: number;
    images: { url: string }[];
    product: {
      id: string;
      slug: string;
      line: string;
      name: string;
      price: number;
      category: { name: string };
    };
  };
}) {
  return {
    id: fav.id,
    variantId: fav.variant.id,
    productId: fav.variant.product.id,
    productSlug: fav.variant.product.slug,
    line: fav.variant.product.line,
    name: fav.variant.product.name,
    category: fav.variant.product.category.name,
    colorName: fav.variant.colorName,
    swatchHex: fav.variant.swatchHex,
    image: fav.variant.images[0]?.url ?? "",
    price: fav.variant.product.price,
    stock: fav.variant.stock,
  };
}

@Injectable()
export class FavoritesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(userId: string) {
    const favorites = await this.prisma.favorite.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: FAVORITE_INCLUDE,
    });
    return favorites.map(mapFavorite);
  }

  async add(userId: string, variantId: string) {
    const variant = await this.prisma.productVariant.findUnique({ where: { id: variantId } });
    if (!variant) throw new NotFoundException("Cette pièce n'existe pas.");

    await this.prisma.favorite.upsert({
      where: { userId_variantId: { userId, variantId } },
      create: { userId, variantId },
      update: {},
    });

    return this.findAll(userId);
  }

  async remove(userId: string, variantId: string) {
    await this.prisma.favorite.deleteMany({ where: { userId, variantId } });
    return this.findAll(userId);
  }

  async merge(userId: string, variantIds: string[]) {
    for (const variantId of variantIds) {
      const variant = await this.prisma.productVariant.findUnique({ where: { id: variantId } });
      if (!variant) continue;
      await this.prisma.favorite.upsert({
        where: { userId_variantId: { userId, variantId } },
        create: { userId, variantId },
        update: {},
      });
    }
    return this.findAll(userId);
  }
}
