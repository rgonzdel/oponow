import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { esRol, permisosDe, type Permiso, type Rol } from "../roles";

interface AccessTokenPayload {
  sub: string;
  plan: string;
  isAdmin?: boolean;
  rol?: string;
}

export interface AuthenticatedUser {
  id: string;
  plan: string;
  isAdmin: boolean;
  rol: Rol;
  /** Lo que puede hacer en el panel según su rol (ver auth/roles.ts). */
  permisos: Permiso[];
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow<string>("JWT_ACCESS_SECRET"),
    });
  }

  validate(payload: AccessTokenPayload): AuthenticatedUser {
    // Tokens anteriores a los roles: un administrador sigue siéndolo.
    const rol: Rol = esRol(payload.rol) ? payload.rol : payload.isAdmin ? "admin" : "opositor";
    return { id: payload.sub, plan: payload.plan, isAdmin: rol === "admin", rol, permisos: permisosDe(rol) };
  }
}
