import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { AgendaService } from "./agenda.service";
import { GoogleCalendarService } from "./google/google-calendar.service";
import { CreateTareaDto } from "./dto/create-tarea.dto";
import { UpdateTareaDto } from "./dto/update-tarea.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import type { AuthenticatedUser } from "../auth/strategies/jwt.strategy";

@Controller("agenda")
@UseGuards(JwtAuthGuard)
export class AgendaController {
  constructor(
    private readonly agendaService: AgendaService,
    private readonly googleCalendarService: GoogleCalendarService,
  ) {}

  @Get("tareas")
  listTareas(@CurrentUser() user: AuthenticatedUser) {
    return this.agendaService.listTareas(user.id);
  }

  @Post("tareas")
  createTarea(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateTareaDto,
  ) {
    return this.agendaService.createTarea(user.id, dto);
  }

  @Patch("tareas/:id")
  updateTarea(
    @CurrentUser() user: AuthenticatedUser,
    @Param("id") id: string,
    @Body() dto: UpdateTareaDto,
  ) {
    return this.agendaService.updateTarea(user.id, id, dto);
  }

  @Delete("tareas/:id")
  deleteTarea(@CurrentUser() user: AuthenticatedUser, @Param("id") id: string) {
    return this.agendaService.deleteTarea(user.id, id);
  }

  @Get("google/status")
  googleStatus(@CurrentUser() user: AuthenticatedUser) {
    return this.googleCalendarService.getStatus(user.id);
  }

  @Get("google/connect")
  async googleConnect(@CurrentUser() user: AuthenticatedUser) {
    return { url: await this.googleCalendarService.getAuthUrl(user.id) };
  }

  @Delete("google")
  disconnectGoogle(@CurrentUser() user: AuthenticatedUser) {
    return this.googleCalendarService.disconnect(user.id);
  }
}
