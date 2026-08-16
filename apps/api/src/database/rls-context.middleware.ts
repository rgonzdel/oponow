import { Inject, Injectable, type NestMiddleware } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import type { NextFunction, Request, Response } from "express";
import { createDb, type Sql } from "@oponow/db";
import { APP_DATABASE_POOL } from "./database.module";
import { rlsContextStorage } from "./request-context";

/**
 * UUID que nunca coincidirá con un usuario real (los ids se generan con
 * gen_random_uuid()/randomUUID()). Se usa como valor de
 * app.current_user_id para requests anónimas: mantiene el GUC con un valor
 * castable a uuid (evitar cadena vacía, que rompería `::uuid` en las
 * políticas) sin poder machear ninguna fila real.
 */
const ANONYMOUS_USER_ID = "00000000-0000-0000-0000-000000000000";

interface AccessTokenPayload {
  sub: string;
  plan: string;
  isAdmin?: boolean;
}

/**
 * Por cada request: reserva una conexión dedicada del pool de app_user y
 * fija app.current_user_id / app.current_plan (vía set_config, session-level
 * porque no hay una transacción explícita envolviendo toda la request) antes
 * de que cualquier handler toque la base de datos. Así las políticas RLS
 * quedan garantizadas para toda petición, no solo para las rutas detrás de
 * un guard de auth.
 */
@Injectable()
export class RlsContextMiddleware implements NestMiddleware {
  constructor(
    @Inject(APP_DATABASE_POOL) private readonly pool: Sql,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    let userId: string | null = null;
    let plan: string | null = null;
    let isAdmin = false;

    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith("Bearer ")) {
      try {
        const payload = await this.jwtService.verifyAsync<AccessTokenPayload>(
          authHeader.slice("Bearer ".length),
          { secret: this.configService.getOrThrow<string>("JWT_ACCESS_SECRET") },
        );
        userId = payload.sub;
        plan = payload.plan;
        isAdmin = payload.isAdmin ?? false;
      } catch {
        // Token ausente/inválido/expirado: seguimos como anónimos. Las
        // rutas protegidas con JwtAuthGuard devolverán 401 por su cuenta.
      }
    }

    const reserved = await this.pool.reserve();

    try {
      await reserved`SELECT
        set_config('app.current_user_id', ${userId ?? ANONYMOUS_USER_ID}, false),
        set_config('app.current_plan', ${plan ?? ""}, false),
        set_config('app.is_admin', ${String(isAdmin)}, false)`;
    } catch (err) {
      reserved.release();
      next(err as Error);
      return;
    }

    res.once("finish", () => reserved.release());
    res.once("close", () => reserved.release());

    // postgres.js's `pool.reserve()` devuelve un cliente "ligero" que no
    // copia `.options` del pool (ver postgres/src/index.js: reserve() llama
    // al factory interno Sql(handler) directamente, sin pasar por el
    // Object.assign que añade `.options` en el cliente raíz). El driver de
    // Drizzle necesita `client.options.parsers/serializers` para configurar
    // el parseo de tipos. Es seguro reutilizar el mismo objeto `.options`
    // del pool: los parsers/serializers son configuración global, no estado
    // por conexión (el estado de sesión de RLS vive en Postgres, no aquí).
    Object.assign(reserved, { options: this.pool.options });
    const db = createDb(reserved);
    rlsContextStorage.run({ db, userId, plan }, () => next());
  }
}
