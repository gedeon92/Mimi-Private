import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../../auth/guards/roles.guard";
import { Roles } from "../../../common/decorators/roles.decorator";
import { ZodValidationPipe } from "../../../common/pipes/zod-validation.pipe";
import { ProductsAdminService } from "./products-admin.service";
import {
  createProductSchema,
  listAdminProductsQuerySchema,
  updateProductSchema,
  type CreateProductDto,
  type ListAdminProductsQuery,
  type UpdateProductDto,
} from "./dto/product-admin.dto";
import {
  createImageSchema,
  createVariantSchema,
  updateVariantSchema,
  type CreateImageDto,
  type CreateVariantDto,
  type UpdateVariantDto,
} from "./dto/variant-admin.dto";

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles("ADMIN")
@Controller("admin/products")
export class ProductsAdminController {
  constructor(private readonly productsAdminService: ProductsAdminService) {}

  @Get()
  findAll(@Query(new ZodValidationPipe(listAdminProductsQuerySchema)) query: ListAdminProductsQuery) {
    return this.productsAdminService.findAll(query);
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.productsAdminService.findOne(id);
  }

  @Post()
  create(@Body(new ZodValidationPipe(createProductSchema)) dto: CreateProductDto) {
    return this.productsAdminService.create(dto);
  }

  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body(new ZodValidationPipe(updateProductSchema)) dto: UpdateProductDto,
  ) {
    return this.productsAdminService.update(id, dto);
  }

  @HttpCode(204)
  @Delete(":id")
  async remove(@Param("id") id: string) {
    await this.productsAdminService.remove(id);
  }

  @Post(":id/variants")
  addVariant(
    @Param("id") id: string,
    @Body(new ZodValidationPipe(createVariantSchema)) dto: CreateVariantDto,
  ) {
    return this.productsAdminService.addVariant(id, dto);
  }

  @Patch("variants/:variantId")
  updateVariant(
    @Param("variantId") variantId: string,
    @Body(new ZodValidationPipe(updateVariantSchema)) dto: UpdateVariantDto,
  ) {
    return this.productsAdminService.updateVariant(variantId, dto);
  }

  @Delete("variants/:variantId")
  removeVariant(@Param("variantId") variantId: string) {
    return this.productsAdminService.removeVariant(variantId);
  }

  @Post("variants/:variantId/images")
  addImage(
    @Param("variantId") variantId: string,
    @Body(new ZodValidationPipe(createImageSchema)) dto: CreateImageDto,
  ) {
    return this.productsAdminService.addImage(variantId, dto);
  }

  @Delete("images/:imageId")
  removeImage(@Param("imageId") imageId: string) {
    return this.productsAdminService.removeImage(imageId);
  }

  @Post("images/:imageId/main")
  setMainImage(@Param("imageId") imageId: string) {
    return this.productsAdminService.setMainImage(imageId);
  }
}
