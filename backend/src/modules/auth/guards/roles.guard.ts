import { Injectable, type CanActivate, type ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import type { Role } from "@prisma/client";
import { ROLES_KEY } from "../../../common/decorators/roles.decorator";
import type { AuthenticatedUser } from "../strategies/jwt.strategy";

/**
 * À utiliser après JwtAuthGuard sur les routes marquées @Roles(...).
 * Prêt pour l'espace admin à venir — aucune route n'y fait appel pour l'instant.
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[] | undefined>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles || requiredRoles.length === 0) return true;

    const request = context.switchToHttp().getRequest();
    const user = request.user as AuthenticatedUser | undefined;
    return Boolean(user && requiredRoles.includes(user.role));
  }
}
