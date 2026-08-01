import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../../auth/guards/roles.guard";
import { Roles } from "../../../common/decorators/roles.decorator";
import { ZodValidationPipe } from "../../../common/pipes/zod-validation.pipe";
import { CategoriesAdminService } from "./categories-admin.service";
import {
  createCategorySchema,
  updateCategorySchema,
  type CreateCategoryDto,
  type UpdateCategoryDto,
} from "./dto/category-admin.dto";

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles("ADMIN")
@Controller("admin/categories")
export class CategoriesAdminController {
  constructor(private readonly categoriesAdminService: CategoriesAdminService) {}

  @Get()
  findAll() {
    return this.categoriesAdminService.findAll();
  }

  @Post()
  create(@Body(new ZodValidationPipe(createCategorySchema)) dto: CreateCategoryDto) {
    return this.categoriesAdminService.create(dto);
  }

  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body(new ZodValidationPipe(updateCategorySchema)) dto: UpdateCategoryDto,
  ) {
    return this.categoriesAdminService.update(id, dto);
  }

  @HttpCode(204)
  @Delete(":id")
  async remove(@Param("id") id: string) {
    await this.categoriesAdminService.remove(id);
  }
}
