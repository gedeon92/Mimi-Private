import { Body, Controller, Delete, Get, Param, Post, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { ZodValidationPipe } from "../../common/pipes/zod-validation.pipe";
import type { AuthenticatedUser } from "../auth/strategies/jwt.strategy";
import { FavoritesService } from "./favorites.service";
import {
  addFavoriteSchema,
  mergeFavoritesSchema,
  type AddFavoriteDto,
  type MergeFavoritesDto,
} from "./dto/favorites.dto";

@UseGuards(JwtAuthGuard)
@Controller("favorites")
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Get()
  findAll(@CurrentUser() user: AuthenticatedUser) {
    return this.favoritesService.findAll(user.id);
  }

  @Post()
  add(
    @CurrentUser() user: AuthenticatedUser,
    @Body(new ZodValidationPipe(addFavoriteSchema)) dto: AddFavoriteDto,
  ) {
    return this.favoritesService.add(user.id, dto.variantId);
  }

  @Delete(":variantId")
  remove(@CurrentUser() user: AuthenticatedUser, @Param("variantId") variantId: string) {
    return this.favoritesService.remove(user.id, variantId);
  }

  @Post("merge")
  merge(
    @CurrentUser() user: AuthenticatedUser,
    @Body(new ZodValidationPipe(mergeFavoritesSchema)) dto: MergeFavoritesDto,
  ) {
    return this.favoritesService.merge(user.id, dto.variantIds);
  }
}
