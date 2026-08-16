import { Module } from "@nestjs/common";
import { AgendaController } from "./agenda.controller";
import { AgendaFeedController } from "./agenda-feed.controller";
import { AgendaService } from "./agenda.service";

@Module({
  controllers: [AgendaController, AgendaFeedController],
  providers: [AgendaService],
})
export class AgendaModule {}
