import { Controller, Get, Header, Res, UseGuards } from "@nestjs/common";
import { Throttle } from "@nestjs/throttler";
import type { Response } from "express";
import { ContabilidadService } from "./contabilidad.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { PermisoGuard, RequierePermiso } from "../auth/guards/permiso.guard";

/** Panel de contabilidad: solo roles con el permiso ver_contabilidad. */
@Controller("contabilidad")
@UseGuards(JwtAuthGuard, PermisoGuard)
@RequierePermiso("ver_contabilidad")
export class ContabilidadController {
  constructor(private readonly contabilidad: ContabilidadService) {}

  @Get("resumen")
  @Throttle({ default: { limit: 20, ttl: 60_000 } })
  resumen() {
    return this.contabilidad.resumen();
  }

  @Get("facturas.csv")
  @Throttle({ default: { limit: 10, ttl: 60_000 } })
  @Header("Content-Type", "text/csv; charset=utf-8")
  @Header("Cache-Control", "no-store")
  async facturas(@Res() res: Response) {
    const csv = await this.contabilidad.facturasCsv();
    res.setHeader("Content-Disposition", `attachment; filename="facturas-oponow-${new Date().toISOString().slice(0, 10)}.csv"`);
    res.send(csv);
  }
}
