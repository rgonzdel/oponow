import { BadRequestException, Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { eq, sql as dsql } from "drizzle-orm";
import { schema } from "@oponow/db";
import { getRequestDb } from "../../database/request-context";
import { decryptToken, encryptToken } from "./crypto.util";
import {
  buildGoogleAuthUrl,
  createGoogleEvent,
  deleteGoogleEvent,
  exchangeCodeForTokens,
  GoogleOauthError,
  listGoogleEvents,
  refreshAccessToken,
  revokeGoogleToken,
  updateGoogleEvent,
  type GoogleEventInput,
  type GoogleEventOcurrencia,
} from "./google-calendar.client";

interface OauthState {
  purpose: "google-oauth-state";
  sub: string;
}

interface AccessTokenCacheado {
  token: string;
  expiraEn: number;
}

/** Margen para no apurar el access token justo en el filo de su caducidad. */
const MARGEN_CADUCIDAD_MS = 60_000;

type TareaParaSync = Pick<
  typeof schema.tareasAgenda.$inferSelect,
  "id" | "titulo" | "descripcion" | "fecha" | "completada" | "googleEventId"
>;

@Injectable()
export class GoogleCalendarService {
  private readonly logger = new Logger(GoogleCalendarService.name);

  /**
   * Access tokens vivos por usuario. Sin esto se pedía uno nuevo a Google en
   * cada llamada — cada pintado del calendario, cada alta de tarea — lo que
   * es lento y gasta cuota de refresh para nada.
   */
  private readonly accessTokens = new Map<string, AccessTokenCacheado>();

  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  private redirectUri(): string {
    const baseUrl = this.configService.get<string>(
      "PUBLIC_API_URL",
      "http://localhost:3000",
    );
    return `${baseUrl}/agenda/google/callback`;
  }

  async getAuthUrl(userId: string): Promise<string> {
    const state = await this.jwtService.signAsync(
      { purpose: "google-oauth-state", sub: userId } satisfies OauthState,
      {
        secret: this.configService.getOrThrow<string>("JWT_ACCESS_SECRET"),
        expiresIn: "10m",
      },
    );
    return buildGoogleAuthUrl({
      clientId: this.configService.getOrThrow<string>("GOOGLE_CLIENT_ID"),
      redirectUri: this.redirectUri(),
      state,
    });
  }

  /** Devuelve el userId del usuario que inició el flujo. */
  async handleCallback(code: string, state: string): Promise<string> {
    let payload: OauthState;
    try {
      payload = await this.jwtService.verifyAsync<OauthState>(state, {
        secret: this.configService.getOrThrow<string>("JWT_ACCESS_SECRET"),
      });
    } catch {
      throw new BadRequestException("Enlace de conexión con Google caducado o inválido");
    }
    if (payload.purpose !== "google-oauth-state") {
      throw new BadRequestException("Estado de OAuth inválido");
    }

    const tokens = await exchangeCodeForTokens({
      code,
      clientId: this.configService.getOrThrow<string>("GOOGLE_CLIENT_ID"),
      clientSecret: this.configService.getOrThrow<string>("GOOGLE_CLIENT_SECRET"),
      redirectUri: this.redirectUri(),
    });
    if (!tokens.refresh_token) {
      // No debería pasar con prompt=consent+access_type=offline, pero por
      // si Google no lo manda (p. ej. la cuenta ya había autorizado esta
      // app con otro flujo), no podemos ofrecer sync duradera sin él.
      throw new BadRequestException(
        "Google no devolvió permiso de acceso duradero — inténtalo de nuevo",
      );
    }

    const encryptedRefreshToken = encryptToken(
      tokens.refresh_token,
      this.configService.getOrThrow<string>("TOKEN_ENCRYPTION_KEY"),
    );

    // Ruta pública (Google redirige el navegador sin cabecera de
    // autorización) — fijamos la identidad en la conexión RLS de esta
    // request antes de escribir, igual que auth.service.ts en
    // register/login/refresh.
    const db = getRequestDb();
    await db.execute(
      dsql`SELECT set_config('app.current_user_id', ${payload.sub}, false)`,
    );

    await db
      .insert(schema.googleCalendarConexiones)
      .values({ usuarioId: payload.sub, refreshTokenCifrado: encryptedRefreshToken })
      .onConflictDoUpdate({
        target: schema.googleCalendarConexiones.usuarioId,
        set: { refreshTokenCifrado: encryptedRefreshToken },
      });

    // Credenciales nuevas: cualquier access token cacheado es del anterior.
    this.accessTokens.delete(payload.sub);

    return payload.sub;
  }

  /**
   * "Conectado" significa que de verdad podemos hablar con Google en nombre
   * del usuario, no solo que quede una fila guardada: comprobar únicamente
   * la fila era lo que hacía que la UI dijese "conectado" mientras ninguna
   * tarea llegaba al calendario.
   */
  async getStatus(userId: string): Promise<{ connected: boolean }> {
    const db = getRequestDb();
    const [conexion] = await db
      .select({ id: schema.googleCalendarConexiones.id })
      .from(schema.googleCalendarConexiones)
      .where(eq(schema.googleCalendarConexiones.usuarioId, userId))
      .limit(1);
    if (!conexion) return { connected: false };

    try {
      return { connected: (await this.getValidAccessToken(userId)) !== null };
    } catch (err) {
      // Fallo pasajero hablando con Google: la credencial no está muerta,
      // solo no hemos podido comprobarla ahora. No alarmamos al usuario.
      this.logger.warn(`No se pudo verificar la conexión de Google del usuario ${userId}: ${err}`);
      return { connected: true };
    }
  }

  async disconnect(userId: string): Promise<void> {
    this.accessTokens.delete(userId);
    const db = getRequestDb();
    const [conexion] = await db
      .select({ refreshTokenCifrado: schema.googleCalendarConexiones.refreshTokenCifrado })
      .from(schema.googleCalendarConexiones)
      .where(eq(schema.googleCalendarConexiones.usuarioId, userId))
      .limit(1);

    if (conexion) {
      // Revocar es cortesía hacia Google, no un requisito: si el token ya no
      // se puede descifrar (clave rotada) desconectar debe funcionar
      // igualmente — si no, el usuario se queda atrapado con una conexión
      // rota que tampoco puede quitar.
      try {
        const refreshToken = decryptToken(
          conexion.refreshTokenCifrado,
          this.configService.getOrThrow<string>("TOKEN_ENCRYPTION_KEY"),
        );
        await revokeGoogleToken(refreshToken);
      } catch (err) {
        this.logger.warn(`No se pudo revocar el token de Google del usuario ${userId}: ${err}`);
      }
    }

    await db
      .delete(schema.googleCalendarConexiones)
      .where(eq(schema.googleCalendarConexiones.usuarioId, userId));
  }

  /**
   * Borra una conexión cuyas credenciales ya no sirven. Guardarla sería peor
   * que no tenerla: `getStatus` diría "conectado" y el usuario no entendería
   * por qué no se sincroniza nada. Sin fila, la UI le ofrece reconectar, que
   * es justo lo que hay que hacer.
   */
  private async invalidarConexion(userId: string, motivo: string): Promise<void> {
    this.logger.error(
      `Conexión de Google Calendar inservible para el usuario ${userId} (${motivo}). Se elimina para que pueda reconectar.`,
    );
    this.accessTokens.delete(userId);
    const db = getRequestDb();
    await db
      .delete(schema.googleCalendarConexiones)
      .where(eq(schema.googleCalendarConexiones.usuarioId, userId));
  }

  /**
   * Devuelve `null` cuando no hay conexión utilizable (nunca la hubo, o
   * acaba de invalidarse). Los fallos pasajeros se propagan como excepción:
   * el llamante decide, pero la conexión se conserva.
   */
  private async getValidAccessToken(userId: string): Promise<string | null> {
    const cacheado = this.accessTokens.get(userId);
    if (cacheado && cacheado.expiraEn > Date.now() + MARGEN_CADUCIDAD_MS) {
      return cacheado.token;
    }

    const db = getRequestDb();
    const [conexion] = await db
      .select({ refreshTokenCifrado: schema.googleCalendarConexiones.refreshTokenCifrado })
      .from(schema.googleCalendarConexiones)
      .where(eq(schema.googleCalendarConexiones.usuarioId, userId))
      .limit(1);
    if (!conexion) return null;

    let refreshToken: string;
    try {
      refreshToken = decryptToken(
        conexion.refreshTokenCifrado,
        this.configService.getOrThrow<string>("TOKEN_ENCRYPTION_KEY"),
      );
    } catch {
      // El token se cifró con otra TOKEN_ENCRYPTION_KEY (rotada, o la de
      // otro entorno). Es irrecuperable: la clave vieja ya no está.
      await this.invalidarConexion(
        userId,
        "el refresh token guardado no se puede descifrar con la TOKEN_ENCRYPTION_KEY actual",
      );
      return null;
    }

    let tokens;
    try {
      tokens = await refreshAccessToken({
        refreshToken,
        clientId: this.configService.getOrThrow<string>("GOOGLE_CLIENT_ID"),
        clientSecret: this.configService.getOrThrow<string>("GOOGLE_CLIENT_SECRET"),
      });
    } catch (err) {
      if (err instanceof GoogleOauthError && err.esCredencialMuerta) {
        await this.invalidarConexion(userId, `Google rechazó el refresh token (${err.codigo})`);
        return null;
      }
      throw err;
    }

    this.accessTokens.set(userId, {
      token: tokens.access_token,
      expiraEn: Date.now() + tokens.expires_in * 1000,
    });
    return tokens.access_token;
  }

  private toEventInput(tarea: TareaParaSync): GoogleEventInput {
    return {
      titulo: tarea.titulo,
      descripcion: tarea.descripcion,
      fecha: tarea.fecha,
      completada: tarea.completada,
      oponowTareaId: tarea.id,
    };
  }

  /**
   * Los tres syncXxx son deliberadamente "best effort": si Google Calendar
   * falla (token revocado por el usuario, corte de red, límite de cuota...)
   * la tarea local ya se creó/actualizó/borró igualmente — el calendario
   * es un reflejo, no la fuente de verdad.
   */
  async syncCreate(userId: string, tarea: TareaParaSync): Promise<void> {
    try {
      const accessToken = await this.getValidAccessToken(userId);
      if (!accessToken) return;
      const event = await createGoogleEvent(accessToken, this.toEventInput(tarea));
      const db = getRequestDb();
      await db
        .update(schema.tareasAgenda)
        .set({ googleEventId: event.id })
        .where(eq(schema.tareasAgenda.id, tarea.id));
    } catch (err) {
      this.logger.warn(`No se pudo sincronizar tarea ${tarea.id} con Google Calendar: ${err}`);
    }
  }

  async syncUpdate(userId: string, tarea: TareaParaSync): Promise<void> {
    if (!tarea.googleEventId) return;
    try {
      const accessToken = await this.getValidAccessToken(userId);
      if (!accessToken) return;
      await updateGoogleEvent(accessToken, tarea.googleEventId, this.toEventInput(tarea));
    } catch (err) {
      this.logger.warn(`No se pudo actualizar el evento de Google de la tarea ${tarea.id}: ${err}`);
    }
  }

  /**
   * Solo lectura, best-effort: si no hay conexión o Google falla, devuelve
   * `[]` en vez de lanzar — es un complemento no crítico al mini-calendario,
   * que siempre puede mostrar las tareas locales igualmente.
   */
  async listEventos(userId: string, desde: Date, hasta: Date): Promise<GoogleEventOcurrencia[]> {
    try {
      const accessToken = await this.getValidAccessToken(userId);
      if (!accessToken) return [];
      return await listGoogleEvents(accessToken, {
        timeMin: desde.toISOString(),
        timeMax: hasta.toISOString(),
      });
    } catch (err) {
      this.logger.warn(`No se pudieron listar eventos de Google Calendar: ${err}`);
      return [];
    }
  }

  async syncDelete(userId: string, googleEventId: string | null): Promise<void> {
    if (!googleEventId) return;
    try {
      const accessToken = await this.getValidAccessToken(userId);
      if (!accessToken) return;
      await deleteGoogleEvent(accessToken, googleEventId);
    } catch (err) {
      this.logger.warn(`No se pudo borrar el evento de Google (${googleEventId}): ${err}`);
    }
  }
}
