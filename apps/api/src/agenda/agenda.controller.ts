import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { AgendaService } from "./agenda.service";
import { CreateTareaDto } from "./dto/create-tarea.dto";
import { UpdateTareaDto } from "./dto/update-tarea.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import type { AuthenticatedUser } from "../auth/strategies/jwt.strategy";

@Controller("agenda")
@UseGuards(JwtAuthGuard)
export class AgendaController {
  constructor(private readonly agendaService: AgendaService) {}

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
  updateTarea(@Param("id") id: string, @Body() dto: UpdateTareaDto) {
    return this.agendaService.updateTarea(id, dto);
  }

  @Delete("tareas/:id")
  deleteTarea(@Param("id") id: string) {
    return this.agendaService.deleteTarea(id);
  }

  @Get("feed-url")
  getFeedUrl(@CurrentUser() user: AuthenticatedUser) {
    return this.agendaService.getFeedUrl(user.id);
  }
}
