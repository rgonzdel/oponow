import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import type { Request } from "express";
import type { AuthenticatedUser } from "../strategies/jwt.strategy";

// Se usa SIEMPRE junto a JwtAuthGuard (que ya rechaza con 401 si no hay
// sesión válida) — este guard solo añade la comprobación de isAdmin sobre
// un request.user que JwtAuthGuard ya dejó puesto.
@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<Request>();
    const user = req.user as AuthenticatedUser | undefined;
    if (!user?.isAdmin) {
      throw new ForbiddenException("Requiere permisos de administrador");
    }
    return true;
  }
}
