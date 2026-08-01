import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import type { MergeCartDto } from "./dto/cart.dto";

const CART_ITEM_INCLUDE = {
  variant: {
    include: {
      product: { include: { category: true } },
      images: { orderBy: { position: "asc" as const }, take: 1 },
    },
  },
};

function mapCartItem(item: {
  id: string;
  quantity: number;
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
    id: item.id,
    quantity: item.quantity,
    variantId: item.variant.id,
    productId: item.variant.product.id,
    productSlug: item.variant.product.slug,
    line: item.variant.product.line,
    name: item.variant.product.name,
    category: item.variant.product.category.name,
    colorName: item.variant.colorName,
    swatchHex: item.variant.swatchHex,
    image: item.variant.images[0]?.url ?? "",
    price: item.variant.product.price,
    stock: item.variant.stock,
  };
}

@Injectable()
export class CartService {
  constructor(private readonly prisma: PrismaService) {}

  async getCart(userId: string) {
    const items = await this.prisma.cartItem.findMany({
      where: { userId },
      orderBy: { createdAt: "asc" },
      include: CART_ITEM_INCLUDE,
    });
    return items.map(mapCartItem);
  }

  async addItem(userId: string, variantId: string, quantity: number) {
    const variant = await this.prisma.productVariant.findUnique({ where: { id: variantId } });
    if (!variant) throw new NotFoundException("Cette pièce n'existe pas.");

    const existing = await this.prisma.cartItem.findUnique({
      where: { userId_variantId: { userId, variantId } },
    });

    const nextQuantity = Math.min(
      (existing?.quantity ?? 0) + quantity,
      Math.max(variant.stock, 0),
    );

    if (nextQuantity <= 0) {
      return this.getCart(userId);
    }

    await this.prisma.cartItem.upsert({
      where: { userId_variantId: { userId, variantId } },
      create: { userId, variantId, quantity: nextQuantity },
      update: { quantity: nextQuantity },
    });

    return this.getCart(userId);
  }

  async updateQuantity(userId: string, variantId: string, quantity: number) {
    const variant = await this.prisma.productVariant.findUnique({ where: { id: variantId } });
    if (!variant) throw new NotFoundException("Cette pièce n'existe pas.");

    const clamped = Math.min(quantity, Math.max(variant.stock, 0));

    if (clamped <= 0) {
      await this.prisma.cartItem.deleteMany({ where: { userId, variantId } });
    } else {
      await this.prisma.cartItem.upsert({
        where: { userId_variantId: { userId, variantId } },
        create: { userId, variantId, quantity: clamped },
        update: { quantity: clamped },
      });
    }

    return this.getCart(userId);
  }

  async removeItem(userId: string, variantId: string) {
    await this.prisma.cartItem.deleteMany({ where: { userId, variantId } });
    return this.getCart(userId);
  }

  async clear(userId: string) {
    await this.prisma.cartItem.deleteMany({ where: { userId } });
    return [];
  }

  /** Fusionne un panier invité (localStorage) dans le panier serveur au login. */
  async merge(userId: string, dto: MergeCartDto) {
    for (const line of dto.items) {
      const variant = await this.prisma.productVariant.findUnique({
        where: { id: line.variantId },
      });
      if (!variant) continue; // catalogue potentiellement obsolète côté client — on ignore

      const existing = await this.prisma.cartItem.findUnique({
        where: { userId_variantId: { userId, variantId: line.variantId } },
      });
      const nextQuantity = Math.min(
        (existing?.quantity ?? 0) + line.quantity,
        Math.max(variant.stock, 0),
      );
      if (nextQuantity <= 0) continue;

      await this.prisma.cartItem.upsert({
        where: { userId_variantId: { userId, variantId: line.variantId } },
        create: { userId, variantId: line.variantId, quantity: nextQuantity },
        update: { quantity: nextQuantity },
      });
    }

    return this.getCart(userId);
  }
}
