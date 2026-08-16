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
  refreshAccessToken,
  revokeGoogleToken,
  updateGoogleEvent,
  type GoogleEventInput,
} from "./google-calendar.client";

interface OauthState {
  purpose: "google-oauth-state";
  sub: string;
}

type TareaParaSync = Pick<
  typeof schema.tareasAgenda.$inferSelect,
  "id" | "titulo" | "descripcion" | "fecha" | "completada" | "googleEventId"
>;

@Injectable()
export class GoogleCalendarService {
  private readonly logger = new Logger(GoogleCalendarService.name);

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

    return payload.sub;
  }

  async getStatus(userId: string): Promise<{ connected: boolean }> {
    const db = getRequestDb();
    const [conexion] = await db
      .select({ id: schema.googleCalendarConexiones.id })
      .from(schema.googleCalendarConexiones)
      .where(eq(schema.googleCalendarConexiones.usuarioId, userId))
      .limit(1);
    return { connected: Boolean(conexion) };
  }

  async disconnect(userId: string): Promise<void> {
    const db = getRequestDb();
    const [conexion] = await db
      .select({ refreshTokenCifrado: schema.googleCalendarConexiones.refreshTokenCifrado })
      .from(schema.googleCalendarConexiones)
      .where(eq(schema.googleCalendarConexiones.usuarioId, userId))
      .limit(1);

    if (conexion) {
      const refreshToken = decryptToken(
        conexion.refreshTokenCifrado,
        this.configService.getOrThrow<string>("TOKEN_ENCRYPTION_KEY"),
      );
      await revokeGoogleToken(refreshToken);
    }

    await db
      .delete(schema.googleCalendarConexiones)
      .where(eq(schema.googleCalendarConexiones.usuarioId, userId));
  }

  private async getValidAccessToken(userId: string): Promise<string | null> {
    const db = getRequestDb();
    const [conexion] = await db
      .select({ refreshTokenCifrado: schema.googleCalendarConexiones.refreshTokenCifrado })
      .from(schema.googleCalendarConexiones)
      .where(eq(schema.googleCalendarConexiones.usuarioId, userId))
      .limit(1);
    if (!conexion) return null;

    const refreshToken = decryptToken(
      conexion.refreshTokenCifrado,
      this.configService.getOrThrow<string>("TOKEN_ENCRYPTION_KEY"),
    );
    const tokens = await refreshAccessToken({
      refreshToken,
      clientId: this.configService.getOrThrow<string>("GOOGLE_CLIENT_ID"),
      clientSecret: this.configService.getOrThrow<string>("GOOGLE_CLIENT_SECRET"),
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
