import { Controller, Get, Param, Query, UsePipes } from "@nestjs/common";
import { ZodValidationPipe } from "../../common/pipes/zod-validation.pipe";
import { ProductsService } from "./products.service";
import { listProductsQuerySchema, type ListProductsQuery } from "./dto/list-products.query";

@Controller("products")
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @UsePipes(new ZodValidationPipe(listProductsQuerySchema))
  findAll(@Query() query: ListProductsQuery) {
    return this.productsService.findAll(query);
  }

  @Get(":slug")
  findOne(@Param("slug") slug: string) {
    return this.productsService.findOne(slug);
  }
}
