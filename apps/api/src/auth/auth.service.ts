import {
  ConflictException,
  Inject,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { randomUUID } from "node:crypto";
import * as argon2 from "argon2";
import { eq, sql as dsql } from "drizzle-orm";
import { createDb, schema, type Database, type Sql } from "@oponow/db";
import { AUTH_DATABASE_POOL } from "../database/database.module";
import { getRequestDb } from "../database/request-context";
import {
  generateRefreshToken,
  hashRefreshToken,
  parseDurationToMs,
} from "./token.util";
import type { RegisterDto } from "./dto/register.dto";
import type { LoginDto } from "./dto/login.dto";

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: string;
}

const INVALID_CREDENTIALS = "Credenciales inválidas";
const INVALID_REFRESH = "Refresh token inválido o expirado";

@Injectable()
export class AuthService {
  private readonly authDb: Database;
  /** Público: apps/api/src/auth/auth.controller.ts lo necesita para el maxAge de la cookie de refresh. */
  readonly refreshTtlMs: number;

  constructor(
    @Inject(AUTH_DATABASE_POOL) authPool: Sql,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    this.authDb = createDb(authPool);
    this.refreshTtlMs = parseDurationToMs(
      this.configService.get<string>("JWT_REFRESH_EXPIRES_IN", "30d"),
    );
  }

  async register(dto: RegisterDto, userAgent?: string): Promise<AuthTokens> {
    const existing = await this.authDb
      .select({ id: schema.usuarios.id })
      .from(schema.usuarios)
      .where(eq(schema.usuarios.email, dto.email))
      .limit(1);

    if (existing.length > 0) {
      throw new ConflictException("Ya existe una cuenta con este email");
    }

    const passwordHash = await argon2.hash(dto.password, {
      type: argon2.argon2id,
    });
    const userId = randomUUID();

    // La request llegó como anónima (RlsContextMiddleware, sin JWT
    // todavía). Fijamos la identidad en la conexión RLS de ESTA request
    // antes del insert, para que la política usuarios_self
    // (id = identidad actual) se cumpla con la fila que vamos a crear.
    const db = getRequestDb();
    await db.execute(
      dsql`SELECT set_config('app.current_user_id', ${userId}, false)`,
    );

    await db.insert(schema.usuarios).values({
      id: userId,
      email: dto.email,
      passwordHash,
      plan: "free",
    });

    return this.issueTokens(db, userId, "free", userAgent);
  }

  async login(dto: LoginDto, userAgent?: string): Promise<AuthTokens> {
    const [user] = await this.authDb
      .select({
        id: schema.usuarios.id,
        passwordHash: schema.usuarios.passwordHash,
        plan: schema.usuarios.plan,
      })
      .from(schema.usuarios)
      .where(eq(schema.usuarios.email, dto.email))
      .limit(1);

    if (!user) {
      // Igualamos el tiempo de respuesta al caso "contraseña incorrecta"
      // para no filtrar por timing qué emails existen.
      await argon2.hash(dto.password, { type: argon2.argon2id });
      throw new UnauthorizedException(INVALID_CREDENTIALS);
    }

    const passwordOk = await argon2.verify(user.passwordHash, dto.password);
    if (!passwordOk) {
      throw new UnauthorizedException(INVALID_CREDENTIALS);
    }

    const db = getRequestDb();
    await db.execute(dsql`SELECT
      set_config('app.current_user_id', ${user.id}, false),
      set_config('app.current_plan', ${user.plan}, false)`);

    return this.issueTokens(db, user.id, user.plan, userAgent);
  }

  async refresh(refreshToken: string, userAgent?: string): Promise<AuthTokens> {
    const tokenHash = hashRefreshToken(refreshToken);

    const [stored] = await this.authDb
      .select({
        id: schema.refreshTokens.id,
        usuarioId: schema.refreshTokens.usuarioId,
        expiresAt: schema.refreshTokens.expiresAt,
        revokedAt: schema.refreshTokens.revokedAt,
      })
      .from(schema.refreshTokens)
      .where(eq(schema.refreshTokens.tokenHash, tokenHash))
      .limit(1);

    if (!stored || stored.revokedAt || stored.expiresAt < new Date()) {
      throw new UnauthorizedException(INVALID_REFRESH);
    }

    // Rotación: revocamos el token usado inmediatamente. Si alguien
    // reutiliza un refresh token ya canjeado (robado), esta comprobación lo
    // detecta la próxima vez que lo intente.
    await this.authDb
      .update(schema.refreshTokens)
      .set({ revokedAt: new Date() })
      .where(eq(schema.refreshTokens.id, stored.id));

    const [user] = await this.authDb
      .select({ plan: schema.usuarios.plan })
      .from(schema.usuarios)
      .where(eq(schema.usuarios.id, stored.usuarioId))
      .limit(1);

    if (!user) {
      throw new UnauthorizedException(INVALID_REFRESH);
    }

    const db = getRequestDb();
    await db.execute(dsql`SELECT
      set_config('app.current_user_id', ${stored.usuarioId}, false),
      set_config('app.current_plan', ${user.plan}, false)`);

    return this.issueTokens(db, stored.usuarioId, user.plan, userAgent);
  }

  async logout(refreshToken: string): Promise<void> {
    const tokenHash = hashRefreshToken(refreshToken);
    await this.authDb
      .update(schema.refreshTokens)
      .set({ revokedAt: new Date() })
      .where(eq(schema.refreshTokens.tokenHash, tokenHash));
  }

  private async issueTokens(
    db: Database,
    userId: string,
    plan: string,
    userAgent?: string,
  ): Promise<AuthTokens> {
    const accessToken = await this.jwtService.signAsync({
      sub: userId,
      plan,
    });

    const refreshToken = generateRefreshToken();
    await db.insert(schema.refreshTokens).values({
      usuarioId: userId,
      tokenHash: hashRefreshToken(refreshToken),
      userAgent: userAgent ?? null,
      expiresAt: new Date(Date.now() + this.refreshTtlMs),
    });

    return {
      accessToken,
      refreshToken,
      expiresIn: this.configService.get<string>(
        "JWT_ACCESS_EXPIRES_IN",
        "15m",
      ),
    };
  }
}
