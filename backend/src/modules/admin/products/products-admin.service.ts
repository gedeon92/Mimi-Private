import { ConflictException, Injectable, Logger, NotFoundException } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../../../prisma/prisma.service";
import { CloudinaryService } from "../uploads/cloudinary.service";
import {
  slugify,
  type CreateProductDto,
  type ListAdminProductsQuery,
  type UpdateProductDto,
} from "./dto/product-admin.dto";
import type { CreateVariantDto, UpdateVariantDto, CreateImageDto } from "./dto/variant-admin.dto";

const PRODUCT_INCLUDE = {
  category: true,
  variants: {
    orderBy: { createdAt: "asc" as const },
    include: { images: { orderBy: { position: "asc" as const } } },
  },
};

@Injectable()
export class ProductsAdminService {
  private readonly logger = new Logger(ProductsAdminService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly cloudinary: CloudinaryService,
  ) {}

  async findAll(query: ListAdminProductsQuery) {
    const where: Prisma.ProductWhereInput = {};

    if (query.status) where.isActive = query.status === "active";
    if (query.category) where.category = { slug: query.category };
    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: "insensitive" } },
        { line: { contains: query.search, mode: "insensitive" } },
        { ref: { contains: query.search, mode: "insensitive" } },
      ];
    }

    const [items, total] = await this.prisma.$transaction([
      this.prisma.product.findMany({
        where,
        orderBy: { displayOrder: "asc" },
        skip: (query.page - 1) * query.limit,
        take: query.limit,
        include: PRODUCT_INCLUDE,
      }),
      this.prisma.product.count({ where }),
    ]);

    return { items, total, page: query.page, limit: query.limit, totalPages: Math.ceil(total / query.limit) };
  }

  async findOne(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: PRODUCT_INCLUDE,
    });
    if (!product) throw new NotFoundException("Produit introuvable.");
    return product;
  }

  async create(dto: CreateProductDto) {
    const slug = dto.slug || slugify(dto.name);

    const [slugExists, refExists] = await Promise.all([
      this.prisma.product.findUnique({ where: { slug } }),
      this.prisma.product.findUnique({ where: { ref: dto.ref } }),
    ]);
    if (slugExists) throw new ConflictException("Ce slug est déjà utilisé par un autre produit.");
    if (refExists) throw new ConflictException("Cette référence est déjà utilisée.");

    return this.prisma.product.create({
      data: { ...dto, slug, tag: dto.tag ?? null },
      include: PRODUCT_INCLUDE,
    });
  }

  async update(id: string, dto: UpdateProductDto) {
    await this.findOne(id);

    if (dto.slug) {
      const slugOwner = await this.prisma.product.findUnique({ where: { slug: dto.slug } });
      if (slugOwner && slugOwner.id !== id) {
        throw new ConflictException("Ce slug est déjà utilisé par un autre produit.");
      }
    }
    if (dto.ref) {
      const refOwner = await this.prisma.product.findUnique({ where: { ref: dto.ref } });
      if (refOwner && refOwner.id !== id) {
        throw new ConflictException("Cette référence est déjà utilisée.");
      }
    }

    return this.prisma.product.update({
      where: { id },
      data: dto,
      include: PRODUCT_INCLUDE,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.product.delete({ where: { id } });
  }

  // --- Variantes (teintes) ---

  async addVariant(productId: string, dto: CreateVariantDto) {
    await this.findOne(productId);
    const skuExists = await this.prisma.productVariant.findUnique({ where: { sku: dto.sku } });
    if (skuExists) throw new ConflictException("Ce SKU est déjà utilisé.");

    await this.prisma.productVariant.create({ data: { ...dto, productId } });
    return this.findOne(productId);
  }

  private async findVariantOrThrow(variantId: string) {
    const variant = await this.prisma.productVariant.findUnique({ where: { id: variantId } });
    if (!variant) throw new NotFoundException("Teinte introuvable.");
    return variant;
  }

  async updateVariant(variantId: string, dto: UpdateVariantDto) {
    const variant = await this.findVariantOrThrow(variantId);
    if (dto.sku) {
      const skuOwner = await this.prisma.productVariant.findUnique({ where: { sku: dto.sku } });
      if (skuOwner && skuOwner.id !== variantId) {
        throw new ConflictException("Ce SKU est déjà utilisé.");
      }
    }
    await this.prisma.productVariant.update({ where: { id: variantId }, data: dto });
    return this.findOne(variant.productId);
  }

  async removeVariant(variantId: string) {
    const variant = await this.findVariantOrThrow(variantId);
    await this.prisma.productVariant.delete({ where: { id: variantId } });
    return this.findOne(variant.productId);
  }

  // --- Images ---

  async addImage(variantId: string, dto: CreateImageDto) {
    const variant = await this.findVariantOrThrow(variantId);
    await this.prisma.productImage.create({ data: { ...dto, variantId } });
    return this.findOne(variant.productId);
  }

  async removeImage(imageId: string) {
    const image = await this.prisma.productImage.findUnique({ where: { id: imageId } });
    if (!image) throw new NotFoundException("Image introuvable.");
    const variant = await this.findVariantOrThrow(image.variantId);
    await this.prisma.productImage.delete({ where: { id: imageId } });

    // Best-effort : la suppression de la fiche produit ne doit jamais échouer
    // à cause d'un problème côté Cloudinary (asset déjà supprimé, quota, etc.).
    if (image.publicId) {
      try {
        await this.cloudinary.destroy(image.publicId);
      } catch (error) {
        this.logger.warn(`Échec de la suppression Cloudinary de l'image ${image.publicId} : ${(error as Error).message}`);
      }
    }

    return this.findOne(variant.productId);
  }

  /** Fait de cette image la photo principale (position 0) de sa variante. */
  async setMainImage(imageId: string) {
    const image = await this.prisma.productImage.findUnique({ where: { id: imageId } });
    if (!image) throw new NotFoundException("Image introuvable.");

    const siblings = await this.prisma.productImage.findMany({
      where: { variantId: image.variantId },
      orderBy: { position: "asc" },
    });
    const reordered = [image, ...siblings.filter((i) => i.id !== imageId)];

    await this.prisma.$transaction(
      reordered.map((img, index) =>
        this.prisma.productImage.update({ where: { id: img.id }, data: { position: index } }),
      ),
    );

    const variant = await this.findVariantOrThrow(image.variantId);
    return this.findOne(variant.productId);
  }
}
