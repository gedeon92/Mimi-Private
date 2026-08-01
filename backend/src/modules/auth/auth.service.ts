import {
  ConflictException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { PrismaService } from "../../prisma/prisma.service";
import { generateOpaqueToken, hashToken, parseDurationMs } from "../../common/security/tokens";
import type { Env } from "../../config/env.validation";
import type { RegisterDto } from "./dto/register.dto";
import type { LoginDto } from "./dto/login.dto";
import { EmailService } from "../email/email.service";

const BCRYPT_ROUNDS = 12;

export interface PublicUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  role: string;
}

export interface AuthResult {
  accessToken: string;
  refreshToken: string;
  user: PublicUser;
}

function toPublicUser(user: {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  role: string;
}): PublicUser {
  return {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    phone: user.phone,
    role: user.role,
  };
}

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService<Env, true>,
    private readonly emailService: EmailService,
  ) {}

  private async issueTokens(userId: string, role: string): Promise<AuthResult> {
    const user = await this.prisma.user.findUniqueOrThrow({ where: { id: userId } });

    const accessToken = this.jwt.sign({ sub: userId, role });

    const rawRefreshToken = generateOpaqueToken();
    const refreshTtlMs = parseDurationMs(this.config.get("JWT_REFRESH_TTL", { infer: true }));
    await this.prisma.refreshToken.create({
      data: {
        userId,
        tokenHash: hashToken(rawRefreshToken),
        expiresAt: new Date(Date.now() + refreshTtlMs),
      },
    });

    return { accessToken, refreshToken: rawRefreshToken, user: toPublicUser(user) };
  }

  async register(dto: RegisterDto): Promise<AuthResult> {
    const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existing) {
      throw new ConflictException("Un compte existe déjà avec cette adresse e-mail.");
    }

    const passwordHash = await bcrypt.hash(dto.password, BCRYPT_ROUNDS);
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        passwordHash,
        firstName: dto.firstName,
        lastName: dto.lastName,
        phone: dto.phone,
      },
    });

    // E-mail de bienvenue en tâche de fond : ne doit jamais ralentir ni faire
    // échouer l'inscription (EmailService journalise ses propres erreurs).
    void this.emailService.sendWelcomeEmail(
      { email: user.email, name: `${user.firstName} ${user.lastName}` },
      user.firstName,
    );

    return this.issueTokens(user.id, user.role);
  }

  async login(dto: LoginDto): Promise<AuthResult> {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
    const invalidCredentials = () =>
      new UnauthorizedException("Email ou mot de passe incorrect.");

    if (!user) throw invalidCredentials();

    const passwordMatches = await bcrypt.compare(dto.password, user.passwordHash);
    if (!passwordMatches) throw invalidCredentials();

    return this.issueTokens(user.id, user.role);
  }

  /**
   * Connexion réservée aux comptes ADMIN — un compte CLIENT valide reçoit
   * des identifiants corrects mais est explicitement rejeté ici, côté serveur.
   */
  async adminLogin(dto: LoginDto): Promise<AuthResult> {
    const result = await this.login(dto);
    if (result.user.role !== "ADMIN") {
      await this.logout(result.refreshToken);
      throw new ForbiddenException("Accès réservé aux administrateurs.");
    }
    return result;
  }

  async refresh(rawToken: string): Promise<AuthResult> {
    const tokenHash = hashToken(rawToken);
    const stored = await this.prisma.refreshToken.findUnique({ where: { tokenHash } });

    if (!stored || stored.revokedAt || stored.expiresAt < new Date()) {
      throw new UnauthorizedException("Session expirée, veuillez vous reconnecter.");
    }

    await this.prisma.refreshToken.update({
      where: { id: stored.id },
      data: { revokedAt: new Date() },
    });

    const user = await this.prisma.user.findUnique({ where: { id: stored.userId } });
    if (!user) throw new UnauthorizedException("Session invalide.");

    return this.issueTokens(user.id, user.role);
  }

  async logout(rawToken: string): Promise<void> {
    const tokenHash = hashToken(rawToken);
    await this.prisma.refreshToken.updateMany({
      where: { tokenHash, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }

  /** Mot de passe oublié — espace client. N'agit que sur les comptes CLIENT. */
  async forgotPassword(email: string): Promise<void> {
    const user = await this.prisma.user.findFirst({ where: { email, role: "CLIENT" } });
    // Réponse toujours identique côté controller, qu'un compte existe ou non.
    if (!user) return;

    const { rawToken, expiresInMinutes } = await this.createPasswordResetToken(user.id);
    const resetUrl = `${this.config.get("CLIENT_APP_URL", { infer: true })}/reinitialiser-mot-de-passe?token=${rawToken}`;
    void this.emailService.sendPasswordResetEmail(
      { email: user.email, name: `${user.firstName} ${user.lastName}` },
      resetUrl,
      expiresInMinutes,
    );
  }

  /**
   * Mot de passe oublié — espace administrateur. Vérifie explicitement que
   * l'adresse appartient à un compte ADMIN avant d'émettre quoi que ce soit ;
   * le lien pointe vers le front admin, pas le front client.
   */
  async adminForgotPassword(email: string): Promise<void> {
    const user = await this.prisma.user.findFirst({ where: { email, role: "ADMIN" } });
    if (!user) return;

    const { rawToken, expiresInMinutes } = await this.createPasswordResetToken(user.id);
    const resetUrl = `${this.config.get("ADMIN_APP_URL", { infer: true })}/reinitialiser-mot-de-passe?token=${rawToken}`;
    void this.emailService.sendAdminPasswordResetEmail(
      { email: user.email, name: `${user.firstName} ${user.lastName}` },
      resetUrl,
      expiresInMinutes,
    );
  }

  private async createPasswordResetToken(userId: string): Promise<{ rawToken: string; expiresInMinutes: number }> {
    const rawToken = generateOpaqueToken();
    const expiresInMinutes = 30;
    await this.prisma.passwordResetToken.create({
      data: {
        userId,
        tokenHash: hashToken(rawToken),
        expiresAt: new Date(Date.now() + expiresInMinutes * 60_000),
      },
    });
    return { rawToken, expiresInMinutes };
  }

  async resetPassword(rawToken: string, newPassword: string): Promise<void> {
    const tokenHash = hashToken(rawToken);
    const stored = await this.prisma.passwordResetToken.findUnique({ where: { tokenHash } });

    if (!stored || stored.usedAt || stored.expiresAt < new Date()) {
      throw new BadRequestException("Lien de réinitialisation invalide ou expiré.");
    }

    const passwordHash = await bcrypt.hash(newPassword, BCRYPT_ROUNDS);

    await this.prisma.$transaction([
      this.prisma.user.update({
        where: { id: stored.userId },
        data: { passwordHash },
      }),
      this.prisma.passwordResetToken.update({
        where: { id: stored.id },
        data: { usedAt: new Date() },
      }),
      // Le changement de mot de passe invalide toutes les sessions actives.
      this.prisma.refreshToken.updateMany({
        where: { userId: stored.userId, revokedAt: null },
        data: { revokedAt: new Date() },
      }),
    ]);

    const user = await this.prisma.user.findUnique({ where: { id: stored.userId } });
    if (user) {
      const recipient = { email: user.email, name: `${user.firstName} ${user.lastName}` };
      if (user.role === "ADMIN") {
        void this.emailService.sendAdminSecurityEmail(
          recipient,
          user.firstName,
          "Votre mot de passe administrateur a été modifié avec succès.",
        );
      } else {
        void this.emailService.sendAccountSecurityEmail(
          recipient,
          user.firstName,
          "Votre mot de passe a été modifié avec succès.",
        );
      }
    }
  }

  async me(userId: string): Promise<PublicUser> {
    const user = await this.prisma.user.findUniqueOrThrow({ where: { id: userId } });
    return toPublicUser(user);
  }
}
