import { Module } from "@nestjs/common";
import { AgendaController } from "./agenda.controller";
import { AgendaService } from "./agenda.service";
import { GoogleCallbackController } from "./google/google-callback.controller";
import { GoogleCalendarService } from "./google/google-calendar.service";

@Module({
  controllers: [AgendaController, GoogleCallbackController],
  providers: [AgendaService, GoogleCalendarService],
})
export class AgendaModule {}
