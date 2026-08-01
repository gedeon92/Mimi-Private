import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { ZodValidationPipe } from "../../common/pipes/zod-validation.pipe";
import type { AuthenticatedUser } from "../auth/strategies/jwt.strategy";
import { CartService } from "./cart.service";
import {
  addCartItemSchema,
  mergeCartSchema,
  updateCartItemSchema,
  type AddCartItemDto,
  type MergeCartDto,
  type UpdateCartItemDto,
} from "./dto/cart.dto";

@UseGuards(JwtAuthGuard)
@Controller("cart")
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  getCart(@CurrentUser() user: AuthenticatedUser) {
    return this.cartService.getCart(user.id);
  }

  @Post("items")
  addItem(
    @CurrentUser() user: AuthenticatedUser,
    @Body(new ZodValidationPipe(addCartItemSchema)) dto: AddCartItemDto,
  ) {
    return this.cartService.addItem(user.id, dto.variantId, dto.quantity);
  }

  @Patch("items/:variantId")
  updateItem(
    @CurrentUser() user: AuthenticatedUser,
    @Param("variantId") variantId: string,
    @Body(new ZodValidationPipe(updateCartItemSchema)) dto: UpdateCartItemDto,
  ) {
    return this.cartService.updateQuantity(user.id, variantId, dto.quantity);
  }

  @Delete("items/:variantId")
  removeItem(@CurrentUser() user: AuthenticatedUser, @Param("variantId") variantId: string) {
    return this.cartService.removeItem(user.id, variantId);
  }

  @HttpCode(200)
  @Delete()
  clear(@CurrentUser() user: AuthenticatedUser) {
    return this.cartService.clear(user.id);
  }

  @Post("merge")
  merge(
    @CurrentUser() user: AuthenticatedUser,
    @Body(new ZodValidationPipe(mergeCartSchema)) dto: MergeCartDto,
  ) {
    return this.cartService.merge(user.id, dto);
  }
}
