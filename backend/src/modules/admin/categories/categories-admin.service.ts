import { BadRequestException, ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../../prisma/prisma.service";
import { slugify, type CreateCategoryDto, type UpdateCategoryDto } from "./dto/category-admin.dto";

@Injectable()
export class CategoriesAdminService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    const categories = await this.prisma.category.findMany({
      orderBy: { name: "asc" },
      include: { _count: { select: { products: true } } },
    });
    return categories.map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      createdAt: c.createdAt,
      productCount: c._count.products,
    }));
  }

  private async findOwnCategoryOrThrow(id: string) {
    const category = await this.prisma.category.findUnique({ where: { id } });
    if (!category) throw new NotFoundException("Catégorie introuvable.");
    return category;
  }

  async create(dto: CreateCategoryDto) {
    const slug = dto.slug || slugify(dto.name);
    const exists = await this.prisma.category.findUnique({ where: { slug } });
    if (exists) throw new ConflictException("Ce slug de catégorie est déjà utilisé.");
    return this.prisma.category.create({ data: { name: dto.name, slug } });
  }

  async update(id: string, dto: UpdateCategoryDto) {
    await this.findOwnCategoryOrThrow(id);
    if (dto.slug) {
      const owner = await this.prisma.category.findUnique({ where: { slug: dto.slug } });
      if (owner && owner.id !== id) {
        throw new ConflictException("Ce slug de catégorie est déjà utilisé.");
      }
    }
    return this.prisma.category.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.findOwnCategoryOrThrow(id);
    const productCount = await this.prisma.product.count({ where: { categoryId: id } });
    if (productCount > 0) {
      throw new BadRequestException(
        `Impossible de supprimer : ${productCount} produit(s) utilisent encore cette catégorie.`,
      );
    }
    await this.prisma.category.delete({ where: { id } });
  }
}
