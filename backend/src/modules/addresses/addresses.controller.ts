import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { ZodValidationPipe } from "../../common/pipes/zod-validation.pipe";
import type { AuthenticatedUser } from "../auth/strategies/jwt.strategy";
import { AddressesService } from "./addresses.service";
import {
  createAddressSchema,
  updateAddressSchema,
  type CreateAddressDto,
  type UpdateAddressDto,
} from "./dto/address.dto";

@UseGuards(JwtAuthGuard)
@Controller("addresses")
export class AddressesController {
  constructor(private readonly addressesService: AddressesService) {}

  @Get()
  findAll(@CurrentUser() user: AuthenticatedUser) {
    return this.addressesService.findAll(user.id);
  }

  @Post()
  create(
    @CurrentUser() user: AuthenticatedUser,
    @Body(new ZodValidationPipe(createAddressSchema)) dto: CreateAddressDto,
  ) {
    return this.addressesService.create(user.id, dto);
  }

  @Patch(":id")
  update(
    @CurrentUser() user: AuthenticatedUser,
    @Param("id") id: string,
    @Body(new ZodValidationPipe(updateAddressSchema)) dto: UpdateAddressDto,
  ) {
    return this.addressesService.update(user.id, id, dto);
  }

  @HttpCode(204)
  @Delete(":id")
  async remove(@CurrentUser() user: AuthenticatedUser, @Param("id") id: string) {
    await this.addressesService.remove(user.id, id);
  }
}
