import { Controller, Get, Param, Query, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../../auth/guards/roles.guard";
import { Roles } from "../../../common/decorators/roles.decorator";
import { ZodValidationPipe } from "../../../common/pipes/zod-validation.pipe";
import { CustomersAdminService } from "./customers-admin.service";
import { listCustomersQuerySchema, type ListCustomersQuery } from "./dto/list-customers.query";

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles("ADMIN")
@Controller("admin/customers")
export class CustomersAdminController {
  constructor(private readonly customersAdminService: CustomersAdminService) {}

  @Get()
  findAll(@Query(new ZodValidationPipe(listCustomersQuerySchema)) query: ListCustomersQuery) {
    return this.customersAdminService.findAll(query);
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.customersAdminService.findOne(id);
  }
}
