import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
  UsePipes,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Throttle } from "@nestjs/throttler";
import type { Request, Response } from "express";
import { ZodValidationPipe } from "../../common/pipes/zod-validation.pipe";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import type { Env } from "../../config/env.validation";
import { parseDurationMs } from "../../common/security/tokens";
import { AuthService, type AuthResult } from "./auth.service";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import type { AuthenticatedUser } from "./strategies/jwt.strategy";
import { registerSchema, type RegisterDto } from "./dto/register.dto";
import { loginSchema, type LoginDto } from "./dto/login.dto";
import { forgotPasswordSchema, type ForgotPasswordDto } from "./dto/forgot-password.dto";
import { resetPasswordSchema, type ResetPasswordDto } from "./dto/reset-password.dto";

const REFRESH_COOKIE = "mcp_refresh_token";
const REFRESH_COOKIE_PATH = "/api/auth";

// Namespace de cookie distinct pour l'app admin : évite qu'une connexion admin
// écrase la session client active dans un autre onglet du même navigateur
// (les deux front-ends parlent au même backend, donc au même domaine de cookie).
const ADMIN_REFRESH_COOKIE = "mcp_admin_refresh_token";
const ADMIN_REFRESH_COOKIE_PATH = "/api/auth";

@Controller("auth")
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly config: ConfigService<Env, true>,
  ) {}

  private setRefreshCookie(res: Response, token: string) {
    res.cookie(REFRESH_COOKIE, token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: REFRESH_COOKIE_PATH,
      maxAge: parseDurationMs(this.config.get("JWT_REFRESH_TTL", { infer: true })),
    });
  }

  private respond(res: Response, result: AuthResult) {
    this.setRefreshCookie(res, result.refreshToken);
    return { accessToken: result.accessToken, user: result.user };
  }

  private setAdminRefreshCookie(res: Response, token: string) {
    res.cookie(ADMIN_REFRESH_COOKIE, token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: ADMIN_REFRESH_COOKIE_PATH,
      maxAge: parseDurationMs(this.config.get("JWT_REFRESH_TTL", { infer: true })),
    });
  }

  private respondAdmin(res: Response, result: AuthResult) {
    this.setAdminRefreshCookie(res, result.refreshToken);
    return { accessToken: result.accessToken, user: result.user };
  }

  @Throttle({ default: { limit: 10, ttl: 60_000 } })
  @Post("register")
  async register(
    @Body(new ZodValidationPipe(registerSchema)) dto: RegisterDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.register(dto);
    return this.respond(res, result);
  }

  @Throttle({ default: { limit: 10, ttl: 60_000 } })
  @HttpCode(200)
  @Post("login")
  async login(
    @Body(new ZodValidationPipe(loginSchema)) dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.login(dto);
    return this.respond(res, result);
  }

  @HttpCode(200)
  @Post("refresh")
  async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const raw = req.cookies?.[REFRESH_COOKIE] as string | undefined;
    if (!raw) throw new UnauthorizedException("Aucune session active.");
    const result = await this.authService.refresh(raw);
    return this.respond(res, result);
  }

  @HttpCode(200)
  @Post("logout")
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const raw = req.cookies?.[REFRESH_COOKIE] as string | undefined;
    if (raw) await this.authService.logout(raw);
    res.clearCookie(REFRESH_COOKIE, { path: REFRESH_COOKIE_PATH });
    return { success: true };
  }

  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  @HttpCode(200)
  @Post("forgot-password")
  async forgotPassword(@Body(new ZodValidationPipe(forgotPasswordSchema)) dto: ForgotPasswordDto) {
    await this.authService.forgotPassword(dto.email);
    return { message: "Si un compte existe avec cette adresse, un e-mail a été envoyé." };
  }

  @HttpCode(200)
  @Post("reset-password")
  async resetPassword(@Body(new ZodValidationPipe(resetPasswordSchema)) dto: ResetPasswordDto) {
    await this.authService.resetPassword(dto.token, dto.password);
    return { message: "Mot de passe mis à jour." };
  }

  @UseGuards(JwtAuthGuard)
  @Get("me")
  me(@CurrentUser() user: AuthenticatedUser) {
    return user;
  }

  // --- Espace admin : cookie et endpoints dédiés, rôle vérifié côté serveur ---

  @Throttle({ default: { limit: 10, ttl: 60_000 } })
  @HttpCode(200)
  @Post("admin-login")
  async adminLogin(
    @Body(new ZodValidationPipe(loginSchema)) dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.adminLogin(dto);
    return this.respondAdmin(res, result);
  }

  @HttpCode(200)
  @Post("admin-refresh")
  async adminRefresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const raw = req.cookies?.[ADMIN_REFRESH_COOKIE] as string | undefined;
    if (!raw) throw new UnauthorizedException("Aucune session active.");
    const result = await this.authService.refresh(raw);
    return this.respondAdmin(res, result);
  }

  @HttpCode(200)
  @Post("admin-logout")
  async adminLogout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const raw = req.cookies?.[ADMIN_REFRESH_COOKIE] as string | undefined;
    if (raw) await this.authService.logout(raw);
    res.clearCookie(ADMIN_REFRESH_COOKIE, { path: ADMIN_REFRESH_COOKIE_PATH });
    return { success: true };
  }

  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  @HttpCode(200)
  @Post("admin-forgot-password")
  async adminForgotPassword(@Body(new ZodValidationPipe(forgotPasswordSchema)) dto: ForgotPasswordDto) {
    await this.authService.adminForgotPassword(dto.email);
    return { message: "Si un compte administrateur existe avec cette adresse, un e-mail a été envoyé." };
  }
}
