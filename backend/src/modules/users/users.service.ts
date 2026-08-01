import { ConflictException, Injectable, UnauthorizedException } from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { PrismaService } from "../../prisma/prisma.service";
import { EmailService } from "../email/email.service";
import type { UpdateProfileDto } from "./dto/update-profile.dto";
import type { ChangePasswordDto } from "./dto/change-password.dto";
import type { ChangeEmailDto } from "./dto/change-email.dto";

const BCRYPT_ROUNDS = 12;

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly emailService: EmailService,
  ) {}

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    const user = await this.prisma.user.update({ where: { id: userId }, data: dto });
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      role: user.role,
    };
  }

  async changePassword(userId: string, dto: ChangePasswordDto) {
    const user = await this.prisma.user.findUniqueOrThrow({ where: { id: userId } });
    const matches = await bcrypt.compare(dto.currentPassword, user.passwordHash);
    if (!matches) {
      throw new UnauthorizedException("Mot de passe actuel incorrect.");
    }
    const passwordHash = await bcrypt.hash(dto.newPassword, BCRYPT_ROUNDS);
    await this.prisma.user.update({ where: { id: userId }, data: { passwordHash } });

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

  /**
   * Changement d'adresse e-mail : appliqué immédiatement après vérification
   * du mot de passe actuel, puis confirmé par e-mail à la nouvelle adresse.
   */
  async changeEmail(userId: string, dto: ChangeEmailDto) {
    const user = await this.prisma.user.findUniqueOrThrow({ where: { id: userId } });

    const matches = await bcrypt.compare(dto.currentPassword, user.passwordHash);
    if (!matches) {
      throw new UnauthorizedException("Mot de passe actuel incorrect.");
    }

    if (dto.newEmail === user.email) {
      return this.toPublicUser(user);
    }

    const existing = await this.prisma.user.findUnique({ where: { email: dto.newEmail } });
    if (existing) {
      throw new ConflictException("Cette adresse e-mail est déjà utilisée par un autre compte.");
    }

    const updated = await this.prisma.user.update({
      where: { id: userId },
      data: { email: dto.newEmail },
    });

    const recipient = { email: updated.email, name: `${updated.firstName} ${updated.lastName}` };
    if (updated.role === "ADMIN") {
      void this.emailService.sendAdminSecurityEmail(
        recipient,
        updated.firstName,
        "Votre adresse e-mail a été modifiée avec succès.",
      );
    } else {
      void this.emailService.sendAccountSecurityEmail(
        recipient,
        updated.firstName,
        "Votre adresse e-mail a été modifiée avec succès.",
      );
    }

    return this.toPublicUser(updated);
  }

  private toPublicUser(user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phone: string | null;
    role: string;
  }) {
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      role: user.role,
    };
  }
}
