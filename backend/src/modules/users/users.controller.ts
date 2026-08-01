import { Body, Controller, HttpCode, Patch, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { ZodValidationPipe } from "../../common/pipes/zod-validation.pipe";
import type { AuthenticatedUser } from "../auth/strategies/jwt.strategy";
import { UsersService } from "./users.service";
import { updateProfileSchema, type UpdateProfileDto } from "./dto/update-profile.dto";
import { changePasswordSchema, type ChangePasswordDto } from "./dto/change-password.dto";
import { changeEmailSchema, type ChangeEmailDto } from "./dto/change-email.dto";

@UseGuards(JwtAuthGuard)
@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Patch("me")
  updateMe(
    @CurrentUser() user: AuthenticatedUser,
    @Body(new ZodValidationPipe(updateProfileSchema)) dto: UpdateProfileDto,
  ) {
    return this.usersService.updateProfile(user.id, dto);
  }

  @HttpCode(200)
  @Patch("me/password")
  async changePassword(
    @CurrentUser() user: AuthenticatedUser,
    @Body(new ZodValidationPipe(changePasswordSchema)) dto: ChangePasswordDto,
  ) {
    await this.usersService.changePassword(user.id, dto);
    return { message: "Mot de passe mis à jour." };
  }

  @Patch("me/email")
  changeEmail(
    @CurrentUser() user: AuthenticatedUser,
    @Body(new ZodValidationPipe(changeEmailSchema)) dto: ChangeEmailDto,
  ) {
    return this.usersService.changeEmail(user.id, dto);
  }
}
