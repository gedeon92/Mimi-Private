import { createParamDecorator, type ExecutionContext } from "@nestjs/common";
import type { AuthenticatedUser } from "../../modules/auth/strategies/jwt.strategy";

/** Injecte l'utilisateur authentifié (peuplé par JwtStrategy) dans un handler. */
export const CurrentUser = createParamDecorator(
  (_: unknown, ctx: ExecutionContext): AuthenticatedUser => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
