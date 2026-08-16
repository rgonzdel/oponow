import { Controller, Get, Query, Res } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import type { Response } from "express";
import { GoogleCalendarService } from "./google-calendar.service";

// Sin JwtAuthGuard a propósito: Google redirige aquí el navegador del
// usuario tras el consentimiento, sin cabecera de autorización — la
// identidad se recupera del "state" firmado (ver getAuthUrl/handleCallback).
@Controller("agenda/google")
export class GoogleCallbackController {
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

    if (error || !code || !state) {
      res.redirect(`${webOrigin}/agenda?google=error`);
      return;
    }

    try {
      await this.googleCalendarService.handleCallback(code, state);
      res.redirect(`${webOrigin}/agenda?google=connected`);
    } catch {
      res.redirect(`${webOrigin}/agenda?google=error`);
    }
  }
}
