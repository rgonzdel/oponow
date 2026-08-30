import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { Throttle } from "@nestjs/throttler";
import { BillingService, type SubscriptionStatus } from "./billing.service";
import { SubscribeDto } from "./dto/subscribe.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import type { AuthenticatedUser } from "../auth/strategies/jwt.strategy";

@Controller("billing")
@UseGuards(JwtAuthGuard)
export class BillingController {
  constructor(private readonly billingService: BillingService) {}

  @Get("subscriptions")
  listActive(@CurrentUser() user: AuthenticatedUser): Promise<SubscriptionStatus[]> {
    return this.billingService.listActive(user.id);
  }

  @Get("subscriptions/:oposicionSlug")
  getStatus(
    @CurrentUser() user: AuthenticatedUser,
    @Param("oposicionSlug") oposicionSlug: string,
  ): Promise<SubscriptionStatus> {
    return this.billingService.getStatus(user.id, oposicionSlug);
  }

  @Post("subscriptions")
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  subscribe(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: SubscribeDto,
  ): Promise<SubscriptionStatus> {
    return this.billingService.subscribeWithTrial(user.id, dto);
  }
}
