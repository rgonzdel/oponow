import { CanActivate, ExecutionContext, ForbiddenException, Injectable, SetMetadata } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import type { Request } from "express";
import type { AuthenticatedUser } from "../strategies/jwt.strategy";
import type { Permiso } from "../roles";

const CLAVE = "permiso-requerido";

/** Exige este permiso (según el rol del JWT) para la ruta o el controlador. */
export const RequierePermiso = (permiso: Permiso) => SetMetadata(CLAVE, permiso);

// Siempre detrás de JwtAuthGuard, que ya pone request.user.
@Injectable()
export class PermisoGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const permiso = this.reflector.getAllAndOverride<Permiso | undefined>(CLAVE, [context.getHandler(), context.getClass()]);
    if (!permiso) return true;
    const user = context.switchToHttp().getRequest<Request>().user as AuthenticatedUser | undefined;
    if (!user?.permisos.includes(permiso)) {
      throw new ForbiddenException("Tu rol no tiene permiso para esto");
    }
    return true;
  }
}
