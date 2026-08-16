import { Body, Controller, Get, Param, Post, Query, UseGuards } from "@nestjs/common";
import { Throttle } from "@nestjs/throttler";
import { QuizService } from "./quiz.service";
import { ResponderDto } from "./dto/responder.dto";
import { FallosQueryDto } from "./dto/fallos-query.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import type { AuthenticatedUser } from "../auth/strategies/jwt.strategy";

@Controller("quiz")
@UseGuards(JwtAuthGuard)
export class QuizController {
  constructor(private readonly quizService: QuizService) {}

  @Post("temas/:temaId/intentos")
  @Throttle({ default: { limit: 20, ttl: 60_000 } })
  iniciar(
    @CurrentUser() user: AuthenticatedUser,
    @Param("temaId") temaId: string,
  ) {
    return this.quizService.iniciarIntento(user.id, user.plan, temaId);
  }

  @Post("intentos/:intentoId/respuestas")
  @Throttle({ default: { limit: 120, ttl: 60_000 } })
  responder(
    @Param("intentoId") intentoId: string,
    @Body() dto: ResponderDto,
  ) {
    return this.quizService.responder(intentoId, dto);
  }

  @Post("intentos/:intentoId/finalizar")
  finalizar(@Param("intentoId") intentoId: string) {
    return this.quizService.finalizar(intentoId);
  }

  @Get("fallos")
  fallos(
    @CurrentUser() user: AuthenticatedUser,
    @Query() query: FallosQueryDto,
  ) {
    return this.quizService.getFallos(user.id, query);
  }
}
