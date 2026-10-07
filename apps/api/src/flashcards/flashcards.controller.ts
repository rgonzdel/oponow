import { Body, Controller, Get, Param, ParseUUIDPipe, Post, Query, UseGuards } from "@nestjs/common";
import { Throttle } from "@nestjs/throttler";
import { IsIn, IsOptional, IsUUID } from "class-validator";
import { FlashcardsService, type Calificacion, type ModoSesion } from "./flashcards.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import type { AuthenticatedUser } from "../auth/strategies/jwt.strategy";

class SesionQueryDto {
  @IsOptional()
  @IsUUID()
  temaId?: string;

  @IsOptional()
  @IsIn(["repaso", "todas"])
  modo?: ModoSesion;
}

class ResponderFlashcardDto {
  @IsIn(["otra", "dificil", "bien"])
  calificacion!: Calificacion;
}

@Controller("flashcards")
@UseGuards(JwtAuthGuard)
export class FlashcardsController {
  constructor(private readonly flashcards: FlashcardsService) {}

  @Get(":slug/resumen")
  resumen(@Param("slug") slug: string) {
    return this.flashcards.resumen(slug);
  }

  @Get(":slug/sesion")
  sesion(@Param("slug") slug: string, @Query() query: SesionQueryDto) {
    return this.flashcards.sesion(slug, query.temaId, query.modo ?? "repaso");
  }

  @Post(":id/respuesta")
  @Throttle({ default: { limit: 120, ttl: 60_000 } })
  responder(
    @CurrentUser() user: AuthenticatedUser,
    @Param("id", ParseUUIDPipe) id: string,
    @Body() dto: ResponderFlashcardDto,
  ) {
    return this.flashcards.responder(user.id, id, dto.calificacion);
  }
}
