import { Controller, Get, Param, Req, UseGuards } from "@nestjs/common";
import { Throttle } from "@nestjs/throttler";
import type { Request } from "express";
import { TemarioService } from "./temario.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import type { AuthenticatedUser } from "../auth/strategies/jwt.strategy";

@Controller("temario")
@UseGuards(JwtAuthGuard)
export class TemarioController {
  constructor(private readonly temarioService: TemarioService) {}

  @Get("oposiciones/:slug/temas")
  listTemas(@Param("slug") slug: string) {
    return this.temarioService.listTemas(slug);
  }

  @Get("temas/:temaId/bloques")
  listBloques(@Param("temaId") temaId: string) {
    return this.temarioService.listBloques(temaId);
  }

  // Endpoint que sirve contenido: límite propio y más estricto que el
  // global, tal y como se fijó como requisito desde el principio del
  // proyecto para "cualquier endpoint que sirva contenido".
  @Get("bloques/:bloqueId")
  @Throttle({ default: { limit: 20, ttl: 60_000 } })
  getBloque(
    @CurrentUser() user: AuthenticatedUser,
    @Param("bloqueId") bloqueId: string,
    @Req() req: Request,
  ) {
    return this.temarioService.getBloque(bloqueId, user.id, req.ip ?? "unknown");
  }
}
