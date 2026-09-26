import { Controller, Get, Logger, Query, Res } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import type { Response } from "express";
import { GoogleCalendarService } from "./google-calendar.service";

// Sin JwtAuthGuard a propósito: Google redirige aquí el navegador del
// usuario tras el consentimiento, sin cabecera de autorización — la
// identidad se recupera del "state" firmado (ver getAuthUrl/handleCallback).
@Controller("agenda/google")
export class GoogleCallbackController {
  private readonly logger = new Logger(GoogleCallbackController.name);

  constructor(
    private readonly googleCalendarService: GoogleCalendarService,
    private readonly configService: ConfigService,
  ) {}

  @Get("callback")
  async callback(
    @Query("code") code: string | undefined,
    @Query("state") state: string | undefined,
    @Query("error") error: string | undefined,
    @Res() res: Response,
  ) {
    const webOrigin = this.configService.get<string>(
      "WEB_ORIGIN",
      "http://localhost:5173",
    );

    // El motivo viaja hasta la UI: un "no se pudo conectar" a secas deja al
    // usuario (y a quien lo depure) sin nada con lo que trabajar.
    const fallar = (motivo: string) => {
      this.logger.warn(`Callback de Google Calendar fallido: ${motivo}`);
      res.redirect(
        `${webOrigin}/agenda?google=error&motivo=${encodeURIComponent(motivo)}`,
      );
    };

    if (error || !code || !state) {
      fallar(error ?? "Google no devolvió el código de autorización");
      return;
    }

    try {
      await this.googleCalendarService.handleCallback(code, state);
      res.redirect(`${webOrigin}/agenda?google=connected`);
    } catch (err) {
      fallar(err instanceof Error ? err.message : "error desconocido");
    }
  }
}
