import { Body, Controller, Get, Param, Patch, Query, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../../auth/guards/roles.guard";
import { Roles } from "../../../common/decorators/roles.decorator";
import { ZodValidationPipe } from "../../../common/pipes/zod-validation.pipe";
import { OrdersAdminService } from "./orders-admin.service";
import {
  listAdminOrdersQuerySchema,
  updateOrderStatusSchema,
  type ListAdminOrdersQuery,
  type UpdateOrderStatusDto,
} from "./dto/order-admin.dto";

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles("ADMIN")
@Controller("admin/orders")
export class OrdersAdminController {
  constructor(private readonly ordersAdminService: OrdersAdminService) {}

  @Get()
  findAll(@Query(new ZodValidationPipe(listAdminOrdersQuerySchema)) query: ListAdminOrdersQuery) {
    return this.ordersAdminService.findAll(query);
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.ordersAdminService.findOne(id);
  }

  @Patch(":id/status")
  updateStatus(
    @Param("id") id: string,
    @Body(new ZodValidationPipe(updateOrderStatusSchema)) dto: UpdateOrderStatusDto,
  ) {
    return this.ordersAdminService.updateStatus(id, dto);
  }
}
