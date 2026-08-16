import { Controller, Get, Header, Param } from "@nestjs/common";
import { AgendaService } from "./agenda.service";

// Sin JwtAuthGuard a propósito: a esta URL se suscriben apps de calendario
// externas (Google Calendar / Apple Calendar), que no mandan cabeceras de
// autorización — la identidad se resuelve por el token opaco de la propia
// URL (ver AgendaService.getFeedIcs).
@Controller("agenda/feed")
export class AgendaFeedController {
  constructor(private readonly agendaService: AgendaService) {}

  @Get(":token")
  @Header("Content-Type", "text/calendar; charset=utf-8")
  async getFeed(@Param("token") tokenParam: string): Promise<string> {
    const token = tokenParam.endsWith(".ics")
      ? tokenParam.slice(0, -4)
      : tokenParam;
    return this.agendaService.getFeedIcs(token);
  }
}
