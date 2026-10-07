import {
  ConflictException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
  ServiceUnavailableException,
  UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { createHmac, randomInt, randomUUID, timingSafeEqual } from "node:crypto";
import * as argon2 from "argon2";
import { and, eq, sql as dsql } from "drizzle-orm";
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
import { canjearCodigoGoogle, verificarIdTokenGoogle } from "./proveedores/google-id-token";
import { verificarTokenFacebook } from "./proveedores/facebook";
import { CorreoService } from "../correo/correo.service";

export interface ProveedoresDisponibles {
  /** Client ID público de Google, o null si no está configurado. */
  google: string | null;
  /** App ID público de Facebook, o null si no está configurado. */
  facebook: string | null;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: string;
  /** Token de "navegador de confianza" recién emitido (tras registro o MFA).
   * La web lo recibe en cookie; la app móvil lo guarda y lo manda en el login. */
  tokenDispositivo?: string;
}

/** Respuesta de /auth/login cuando hace falta el código enviado por correo. */
export interface MfaRequerido {
  mfaRequerido: true;
  desafioId: string;
  /** Email enmascarado (ra****@gmail.com) para que el usuario sepa dónde mirar. */
  email: string;
}

const MFA_CODIGO_MIN = 10;
const MFA_MAX_INTENTOS = 5;
const MFA_MAX_REENVIOS = 3;
const MFA_REENVIO_ESPERA_S = 30;
const DISPOSITIVO_TTL_MS = 30 * 86_400_000;
const MFA_INVALIDO = "El código ha caducado o ya no es válido. Vuelve a iniciar sesión.";

const INVALID_CREDENTIALS = "Credenciales inválidas";
const INVALID_REFRESH = "Refresh token inválido o expirado";

// Perfil "ligero" de OWASP para Argon2id (m=19456 KiB, t=2, p=1) en vez de
// los valores por defecto de la librería (m=65536, t=3, p=4) — con CPU
// compartida y limitada (Render), 4 hilos en paralelo no tienen 4 núcleos
// reales que usar y solo añaden contención, sin más seguridad real; este
// perfil sigue estando dentro de lo que OWASP considera seguro. argon2.verify
// no necesita estas opciones: los parámetros van codificados en el propio
// hash almacenado, así que los hashes ya existentes (con los valores
// antiguos) se siguen verificando igual sin ningún cambio.
const ARGON2_OPTIONS = {
  type: argon2.argon2id,
  memoryCost: 19456,
  timeCost: 2,
  parallelism: 1,
} as const;

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly authDb: Database;
  /** Público: apps/api/src/auth/auth.controller.ts lo necesita para el maxAge de la cookie de refresh. */
  readonly refreshTtlMs: number;

  constructor(
    @Inject(AUTH_DATABASE_POOL) authPool: Sql,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly correo: CorreoService,
  ) {
    this.authDb = createDb(authPool);
    // En producción sin SMTP no hay forma de entregar el código: mejor no
    // pedirlo (y avisar en el log) que dejar a todo el mundo sin poder entrar.
    if (this.configService.get<string>("NODE_ENV") === "production" && !this.correo.configurado) {
      this.logger.warn("SMTP sin configurar: el MFA por correo está DESACTIVADO.");
    }
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

    const passwordHash = await argon2.hash(dto.password, ARGON2_OPTIONS);
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

    const tokens = await this.issueTokens(db, userId, "free", false, userAgent);
    return { ...tokens, tokenDispositivo: await this.confiarDispositivo(db, userId, userAgent) };
  }

  async login(
    dto: LoginDto,
    userAgent?: string,
    tokenDispositivo?: string,
  ): Promise<AuthTokens | MfaRequerido> {
    const [user] = await this.authDb
      .select({
        id: schema.usuarios.id,
        passwordHash: schema.usuarios.passwordHash,
        plan: schema.usuarios.plan,
        esAdmin: schema.usuarios.esAdmin,
        email: schema.usuarios.email,
      })
      .from(schema.usuarios)
      .where(eq(schema.usuarios.email, dto.email))
      .limit(1);

    // Sin contraseña = la cuenta solo entra con Google/Facebook.
    if (!user || !user.passwordHash) {
      // Igualamos el tiempo de respuesta al caso "contraseña incorrecta"
      // para no filtrar por timing qué emails existen.
      await argon2.hash(dto.password, ARGON2_OPTIONS);
      throw new UnauthorizedException(INVALID_CREDENTIALS);
    }

    const passwordOk = await argon2.verify(user.passwordHash, dto.password);
    if (!passwordOk) {
      throw new UnauthorizedException(INVALID_CREDENTIALS);
    }

    const db = getRequestDb();
    await db.execute(dsql`SELECT
      set_config('app.current_user_id', ${user.id}, false),
      set_config('app.current_plan', ${user.plan}, false),
      set_config('app.is_admin', ${String(user.esAdmin)}, false)`);

    if (!this.mfaActivo() || (await this.dispositivoDeConfianza(db, user.id, tokenDispositivo))) {
      return this.issueTokens(db, user.id, user.plan, user.esAdmin, userAgent);
    }
    try {
      return await this.crearDesafioMfa(db, user.id, user.email ?? dto.email, userAgent);
    } catch (e) {
      // Si el código no se puede enviar (SMTP caído o bloqueado), es mejor
      // dejar entrar con la contraseña correcta que dejar a nadie fuera.
      // El fallo ya queda registrado en enviarCodigo.
      this.logger.warn(`MFA omitido para ${user.id}: ${e instanceof Error ? e.message : String(e)}`);
      return this.issueTokens(db, user.id, user.plan, user.esAdmin, userAgent);
    }
  }

  /** Comprueba el código del correo. Si es correcto, inicia sesión y marca
   * este navegador como de confianza durante 30 días. */
  async verificarMfa(desafioId: string, codigo: string, userAgent?: string): Promise<AuthTokens> {
    const desafio = await this.desafioVigente(desafioId);
    if (desafio.intentos >= MFA_MAX_INTENTOS) {
      throw new UnauthorizedException("Has agotado los intentos. Pide un código nuevo.");
    }

    const esperado = Buffer.from(desafio.codigoHash, "hex");
    const recibido = Buffer.from(this.hashCodigo(desafio.id, codigo), "hex");
    if (esperado.length !== recibido.length || !timingSafeEqual(esperado, recibido)) {
      await this.authDb
        .update(schema.desafiosMfa)
        .set({ intentos: desafio.intentos + 1 })
        .where(eq(schema.desafiosMfa.id, desafio.id));
      const quedan = MFA_MAX_INTENTOS - desafio.intentos - 1;
      throw new UnauthorizedException(
        quedan > 0
          ? `Código incorrecto. Te ${quedan === 1 ? "queda 1 intento" : `quedan ${quedan} intentos`}.`
          : "Código incorrecto. Has agotado los intentos: pide un código nuevo.",
      );
    }

    // Un solo uso: se marca antes de emitir nada.
    await this.authDb
      .update(schema.desafiosMfa)
      .set({ usadoEn: new Date() })
      .where(eq(schema.desafiosMfa.id, desafio.id));

    const [user] = await this.authDb
      .select({ plan: schema.usuarios.plan, esAdmin: schema.usuarios.esAdmin })
      .from(schema.usuarios)
      .where(eq(schema.usuarios.id, desafio.usuarioId))
      .limit(1);
    if (!user) throw new UnauthorizedException(MFA_INVALIDO);

    const db = getRequestDb();
    await db.execute(dsql`SELECT
      set_config('app.current_user_id', ${desafio.usuarioId}, false),
      set_config('app.current_plan', ${user.plan}, false),
      set_config('app.is_admin', ${String(user.esAdmin)}, false)`);
    // Recibir el código demuestra que el email es suyo.
    await db
      .update(schema.usuarios)
      .set({ emailVerified: true })
      .where(eq(schema.usuarios.id, desafio.usuarioId));

    const tokens = await this.issueTokens(db, desafio.usuarioId, user.plan, user.esAdmin, userAgent);
    return { ...tokens, tokenDispositivo: await this.confiarDispositivo(db, desafio.usuarioId, userAgent) };
  }

  async reenviarMfa(desafioId: string, userAgent?: string): Promise<void> {
    const desafio = await this.desafioVigente(desafioId);
    if (desafio.reenvios >= MFA_MAX_REENVIOS) {
      throw new HttpException(
        "Has pedido demasiados códigos. Vuelve a iniciar sesión.",
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }
    if (Date.now() - desafio.enviadoEn.getTime() < MFA_REENVIO_ESPERA_S * 1000) {
      throw new HttpException(
        `Espera ${MFA_REENVIO_ESPERA_S} segundos antes de pedir otro código.`,
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }
    const [user] = await this.authDb
      .select({ email: schema.usuarios.email })
      .from(schema.usuarios)
      .where(eq(schema.usuarios.id, desafio.usuarioId))
      .limit(1);
    if (!user?.email) throw new UnauthorizedException(MFA_INVALIDO);

    const codigo = this.nuevoCodigo();
    await this.authDb
      .update(schema.desafiosMfa)
      .set({
        codigoHash: this.hashCodigo(desafio.id, codigo),
        intentos: 0,
        reenvios: desafio.reenvios + 1,
        enviadoEn: new Date(),
        expiraEn: new Date(Date.now() + MFA_CODIGO_MIN * 60_000),
      })
      .where(eq(schema.desafiosMfa.id, desafio.id));
    await this.enviarCodigo(user.email, codigo, userAgent);
  }

  private mfaActivo(): boolean {
    return this.correo.configurado || this.configService.get<string>("NODE_ENV") !== "production";
  }

  private async dispositivoDeConfianza(db: Database, userId: string, token?: string): Promise<boolean> {
    if (!token) return false;
    const [d] = await db
      .select({ expiraEn: schema.dispositivosConfianza.expiraEn })
      .from(schema.dispositivosConfianza)
      .where(
        and(
          eq(schema.dispositivosConfianza.tokenHash, hashRefreshToken(token)),
          eq(schema.dispositivosConfianza.usuarioId, userId),
        ),
      )
      .limit(1);
    return !!d && d.expiraEn > new Date();
  }

  /** Requiere que la conexión ya tenga app.current_user_id = userId (RLS). */
  private async confiarDispositivo(db: Database, userId: string, userAgent?: string): Promise<string> {
    const token = generateRefreshToken();
    await db.insert(schema.dispositivosConfianza).values({
      usuarioId: userId,
      tokenHash: hashRefreshToken(token),
      userAgent: userAgent ?? null,
      expiraEn: new Date(Date.now() + DISPOSITIVO_TTL_MS),
    });
    return token;
  }

  private async crearDesafioMfa(
    db: Database,
    userId: string,
    email: string,
    userAgent?: string,
  ): Promise<MfaRequerido> {
    const id = randomUUID();
    const codigo = this.nuevoCodigo();
    await db.insert(schema.desafiosMfa).values({
      id,
      usuarioId: userId,
      codigoHash: this.hashCodigo(id, codigo),
      expiraEn: new Date(Date.now() + MFA_CODIGO_MIN * 60_000),
    });
    await this.enviarCodigo(email, codigo, userAgent);
    return { mfaRequerido: true, desafioId: id, email: enmascararEmail(email) };
  }

  private async desafioVigente(desafioId: string) {
    const [desafio] = await this.authDb
      .select({
        id: schema.desafiosMfa.id,
        usuarioId: schema.desafiosMfa.usuarioId,
        codigoHash: schema.desafiosMfa.codigoHash,
        intentos: schema.desafiosMfa.intentos,
        reenvios: schema.desafiosMfa.reenvios,
        expiraEn: schema.desafiosMfa.expiraEn,
        enviadoEn: schema.desafiosMfa.enviadoEn,
        usadoEn: schema.desafiosMfa.usadoEn,
      })
      .from(schema.desafiosMfa)
      .where(eq(schema.desafiosMfa.id, desafioId))
      .limit(1);
    if (!desafio || desafio.usadoEn || desafio.expiraEn < new Date()) {
      throw new UnauthorizedException(MFA_INVALIDO);
    }
    return desafio;
  }

  private nuevoCodigo(): string {
    return String(randomInt(0, 1_000_000)).padStart(6, "0");
  }

  // HMAC con un secreto del servidor y el id del desafío: con solo 10^6
  // códigos posibles, un hash simple se invertiría al instante si se
  // filtrara la tabla.
  private hashCodigo(desafioId: string, codigo: string): string {
    return createHmac("sha256", this.configService.getOrThrow<string>("JWT_ACCESS_SECRET"))
      .update(`mfa:${desafioId}:${codigo}`)
      .digest("hex");
  }

  private async enviarCodigo(email: string, codigo: string, userAgent?: string): Promise<void> {
    try {
      await this.correo.enviarCodigoAcceso({ email, codigo, minutosValidez: MFA_CODIGO_MIN, userAgent });
    } catch (e) {
      this.logger.error(`No se pudo enviar el código MFA: ${e instanceof Error ? e.message : String(e)}`);
      throw new ServiceUnavailableException(
        "No hemos podido enviarte el código. Inténtalo de nuevo en unos minutos.",
      );
    }
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
      .select({ plan: schema.usuarios.plan, esAdmin: schema.usuarios.esAdmin })
      .from(schema.usuarios)
      .where(eq(schema.usuarios.id, stored.usuarioId))
      .limit(1);

    if (!user) {
      throw new UnauthorizedException(INVALID_REFRESH);
    }

    const db = getRequestDb();
    await db.execute(dsql`SELECT
      set_config('app.current_user_id', ${stored.usuarioId}, false),
      set_config('app.current_plan', ${user.plan}, false),
      set_config('app.is_admin', ${String(user.esAdmin)}, false)`);

    return this.issueTokens(db, stored.usuarioId, user.plan, user.esAdmin, userAgent);
  }

  /** Qué métodos de acceso alternativos están configurados en este entorno. */
  proveedoresDisponibles(): ProveedoresDisponibles {
    return {
      google: this.googleClientId() ?? null,
      facebook: this.facebookCredenciales()?.appId ?? null,
    };
  }

  async loginGoogle(
    datos: { credential?: string; code?: string },
    userAgent?: string,
  ): Promise<AuthTokens> {
    const clientId = this.googleClientId();
    if (!clientId) throw new ServiceUnavailableException("El acceso con Google no está disponible");
    let credential = datos.credential;
    if (datos.code) {
      const secreto =
        this.configService.get<string>("GOOGLE_LOGIN_CLIENT_SECRET") ||
        this.configService.get<string>("GOOGLE_CLIENT_SECRET");
      if (!secreto) throw new ServiceUnavailableException("El acceso con Google no está disponible");
      credential = (await canjearCodigoGoogle(datos.code, clientId, secreto)) ?? undefined;
    }
    if (!credential) throw new UnauthorizedException("No se ha podido verificar tu cuenta de Google");
    const perfil = await verificarIdTokenGoogle(credential, clientId);
    if (!perfil) throw new UnauthorizedException("No se ha podido verificar tu cuenta de Google");
    return this.loginExterno("google", perfil, userAgent);
  }

  async loginFacebook(accessToken: string, userAgent?: string): Promise<AuthTokens> {
    const cred = this.facebookCredenciales();
    if (!cred) throw new ServiceUnavailableException("El acceso con Facebook no está disponible");
    const perfil = await verificarTokenFacebook(accessToken, cred.appId, cred.appSecret);
    if (!perfil) throw new UnauthorizedException("No se ha podido verificar tu cuenta de Facebook");
    return this.loginExterno("facebook", perfil, userAgent);
  }

  // Google/Facebook: 1) identidad ya vinculada → entra; 2) email verificado
  // que coincide con una cuenta existente → se vincula a esa cuenta;
  // 3) si no, cuenta nueva.
  private async loginExterno(
    proveedor: "google" | "facebook",
    perfil: { sujeto: string; email: string | null; emailVerificado: boolean },
    userAgent?: string,
  ): Promise<AuthTokens> {
    const [identidad] = await this.authDb
      .select({ usuarioId: schema.identidadesExternas.usuarioId })
      .from(schema.identidadesExternas)
      .where(
        and(
          eq(schema.identidadesExternas.proveedor, proveedor),
          eq(schema.identidadesExternas.sujeto, perfil.sujeto),
        ),
      )
      .limit(1);
    if (identidad) return this.iniciarSesion(identidad.usuarioId, userAgent);

    const emailVerificado = perfil.emailVerificado ? perfil.email : null;
    let usuarioId: string | null = null;
    if (emailVerificado) {
      const [u] = await this.authDb
        .select({ id: schema.usuarios.id })
        .from(schema.usuarios)
        .where(dsql`lower(${schema.usuarios.email}) = ${emailVerificado}`)
        .limit(1);
      usuarioId = u?.id ?? null;
    }

    const db = getRequestDb();
    if (usuarioId) {
      await db.execute(dsql`SELECT set_config('app.current_user_id', ${usuarioId}, false)`);
      // El proveedor acaba de confirmar que ese email es suyo.
      await db
        .update(schema.usuarios)
        .set({ emailVerified: true })
        .where(eq(schema.usuarios.id, usuarioId));
    } else {
      usuarioId = randomUUID();
      await db.execute(dsql`SELECT set_config('app.current_user_id', ${usuarioId}, false)`);
      await db.insert(schema.usuarios).values({
        id: usuarioId,
        // Un email sin verificar no se guarda: no debe poder "reservar" una
        // dirección que luego quiera registrar su dueño real.
        email: emailVerificado,
        emailVerified: emailVerificado !== null,
        plan: "free",
      });
    }
    await db.insert(schema.identidadesExternas).values({
      usuarioId,
      proveedor,
      sujeto: perfil.sujeto,
      email: perfil.email,
    });
    return this.iniciarSesion(usuarioId, userAgent);
  }

  private async iniciarSesion(userId: string, userAgent?: string): Promise<AuthTokens> {
    const [user] = await this.authDb
      .select({ plan: schema.usuarios.plan, esAdmin: schema.usuarios.esAdmin })
      .from(schema.usuarios)
      .where(eq(schema.usuarios.id, userId))
      .limit(1);
    if (!user) throw new UnauthorizedException(INVALID_CREDENTIALS);

    const db = getRequestDb();
    await db.execute(dsql`SELECT
      set_config('app.current_user_id', ${userId}, false),
      set_config('app.current_plan', ${user.plan}, false),
      set_config('app.is_admin', ${String(user.esAdmin)}, false)`);
    return this.issueTokens(db, userId, user.plan, user.esAdmin, userAgent);
  }

  // El login con Google puede usar su propio cliente OAuth; si no se define,
  // reutiliza el del calendario (mismo proyecto de Google Cloud).
  private googleClientId(): string | undefined {
    return (
      this.configService.get<string>("GOOGLE_LOGIN_CLIENT_ID") ||
      this.configService.get<string>("GOOGLE_CLIENT_ID") ||
      undefined
    );
  }

  private facebookCredenciales(): { appId: string; appSecret: string } | null {
    const appId = this.configService.get<string>("FACEBOOK_APP_ID");
    const appSecret = this.configService.get<string>("FACEBOOK_APP_SECRET");
    return appId && appSecret ? { appId, appSecret } : null;
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
    isAdmin: boolean,
    userAgent?: string,
  ): Promise<AuthTokens> {
    const accessToken = await this.jwtService.signAsync({
      sub: userId,
      plan,
      isAdmin,
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

function enmascararEmail(email: string): string {
  const [usuario, dominio] = email.split("@");
  if (!dominio) return email;
  return `${usuario.slice(0, 2)}****@${dominio}`;
}
