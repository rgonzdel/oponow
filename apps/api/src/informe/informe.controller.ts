import { Controller, Get, Header, Query, Res, UseGuards } from "@nestjs/common";
import { Throttle } from "@nestjs/throttler";
import { Type } from "class-transformer";
import { IsIn, IsOptional } from "class-validator";
import type { Response } from "express";
import { InformeService, type PeriodoInforme } from "./informe.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import type { AuthenticatedUser } from "../auth/strategies/jwt.strategy";

class InformeQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsIn([7, 30, 90, 0])
  dias?: PeriodoInforme;
}

@Controller("informe")
@UseGuards(JwtAuthGuard)
export class InformeController {
  constructor(private readonly informe: InformeService) {}

  /** PDF con el progreso del opositor (tests, aciertos, fallos por tema…). */
  @Get("progreso.pdf")
  @Throttle({ default: { limit: 10, ttl: 60_000 } })
  @Header("Content-Type", "application/pdf")
  @Header("Cache-Control", "no-store")
  async progreso(
    @CurrentUser() user: AuthenticatedUser,
    @Query() query: InformeQueryDto,
    @Res() res: Response,
  ) {
    const { pdf, nombre } = await this.informe.generarPdf(user.id, query.dias ?? 30);
    res.setHeader("Content-Disposition", `attachment; filename="${nombre}"`);
    res.send(pdf);
  }
}
