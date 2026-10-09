import { Body, Controller, Get, HttpCode, Param, ParseUUIDPipe, Post, Put, UseGuards } from "@nestjs/common";
import { Throttle } from "@nestjs/throttler";
import { Type } from "class-transformer";
import { ArrayMaxSize, IsArray, IsBoolean, IsIn, IsInt, IsOptional, IsUUID, Max, Min } from "class-validator";
import { ExamenService } from "./examen.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import type { AuthenticatedUser } from "../auth/strategies/jwt.strategy";

class CrearExamenDto {
  @IsArray()
  @ArrayMaxSize(100)
  @IsUUID("all", { each: true })
  temaIds!: string[];

  @IsInt()
  @Min(5)
  @Max(200)
  numPreguntas!: number;

  @IsInt()
  @Min(5)
  @Max(240)
  duracionMinutos!: number;

  @IsBoolean()
  modoAvanzado!: boolean;

  @IsInt()
  @Min(1)
  @Max(10)
  maxSalidas!: number;
}

class RespuestaExamenDto {
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(9)
  opcionElegida!: number | null;

  @IsBoolean()
  marcada!: boolean;
}

class SalidaDto {
  @IsIn(["salida", "vuelta"])
  fase!: "salida" | "vuelta";

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  segundosFuera?: number;
}

@Controller("examenes")
@UseGuards(JwtAuthGuard)
export class ExamenController {
  constructor(private readonly examen: ExamenService) {}

  @Get("oposiciones/:slug")
  opciones(@CurrentUser() user: AuthenticatedUser, @Param("slug") slug: string) {
    return this.examen.opciones(user.id, slug);
  }

  @Post("oposiciones/:slug")
  @Throttle({ default: { limit: 10, ttl: 60_000 } })
  crear(
    @CurrentUser() user: AuthenticatedUser,
    @Param("slug") slug: string,
    @Body() dto: CrearExamenDto,
  ) {
    return this.examen.crear(user.id, user.plan, slug, dto, user.permisos.includes("ver_contenido"));
  }

  @Get(":id")
  estado(@CurrentUser() user: AuthenticatedUser, @Param("id", ParseUUIDPipe) id: string) {
    return this.examen.estado(user.id, id);
  }

  @Put(":id/respuestas/:preguntaId")
  @HttpCode(204)
  @Throttle({ default: { limit: 240, ttl: 60_000 } })
  responder(
    @CurrentUser() user: AuthenticatedUser,
    @Param("id", ParseUUIDPipe) id: string,
    @Param("preguntaId", ParseUUIDPipe) preguntaId: string,
    @Body() dto: RespuestaExamenDto,
  ) {
    return this.examen.responder(user.id, id, preguntaId, {
      opcionElegida: dto.opcionElegida ?? null,
      marcada: dto.marcada,
    });
  }

  @Post(":id/salidas")
  @Throttle({ default: { limit: 60, ttl: 60_000 } })
  salida(
    @CurrentUser() user: AuthenticatedUser,
    @Param("id", ParseUUIDPipe) id: string,
    @Body() dto: SalidaDto,
  ) {
    return this.examen.salida(user.id, id, dto.fase, dto.segundosFuera ?? 0);
  }

  @Post(":id/entregar")
  entregar(@CurrentUser() user: AuthenticatedUser, @Param("id", ParseUUIDPipe) id: string) {
    return this.examen.entregarPorUsuario(user.id, user.plan, id);
  }
}
