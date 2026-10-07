import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { Throttle } from "@nestjs/throttler";
import { BillingService, type SubscriptionStatus } from "./billing.service";
import { SubscribeDto } from "./dto/subscribe.dto";
import { CheckoutDto, ConfirmarCheckoutDto } from "./dto/checkout.dto";
import { StripeBillingService } from "./stripe-billing.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import type { AuthenticatedUser } from "../auth/strategies/jwt.strategy";

@Controller("billing")
@UseGuards(JwtAuthGuard)
export class BillingController {
  constructor(
    private readonly billingService: BillingService,
    private readonly stripe: StripeBillingService,
  ) {}

  /** Qué pasarela usa este entorno: Stripe (pago real/prueba) o la simulada. */
  @Get("pasarela")
  pasarela(): { tipo: "stripe" | "simulada" } {
    return { tipo: this.stripe.configurado ? "stripe" : "simulada" };
  }

  @Post("checkout")
  @Throttle({ default: { limit: 10, ttl: 60_000 } })
  checkout(@CurrentUser() user: AuthenticatedUser, @Body() dto: CheckoutDto): Promise<{ url: string }> {
    return this.stripe.crearCheckout(user.id, dto.oposicionSlug, dto.ciclo ?? "mensual");
  }

  @Post("checkout/confirmar")
  @Throttle({ default: { limit: 10, ttl: 60_000 } })
  confirmarCheckout(@CurrentUser() user: AuthenticatedUser, @Body() dto: ConfirmarCheckoutDto) {
    return this.stripe.confirmarCheckout(user.id, dto.sessionId);
  }

  @Post("portal")
  @Throttle({ default: { limit: 10, ttl: 60_000 } })
  portal(@CurrentUser() user: AuthenticatedUser): Promise<{ url: string }> {
    return this.stripe.crearPortal(user.id);
  }

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

  @Post("subscriptions/:oposicionSlug/cancelar")
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  cancel(
    @CurrentUser() user: AuthenticatedUser,
    @Param("oposicionSlug") oposicionSlug: string,
  ): Promise<SubscriptionStatus> {
    return this.billingService.cancel(user.id, oposicionSlug);
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
