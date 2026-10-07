import { Controller, Headers, HttpCode, HttpStatus, Post, Req, type RawBodyRequest } from "@nestjs/common";
import { SkipThrottle } from "@nestjs/throttler";
import type { Request } from "express";
import { StripeBillingService } from "./stripe-billing.service";

/**
 * Avisos de Stripe (pagos, cambios de tarjeta, cancelaciones). Sin sesión de
 * usuario: la autenticidad la da la firma (STRIPE_WEBHOOK_SECRET).
 * URL para registrar en Stripe: https://api.oponow.com/billing/stripe/webhook
 */
@Controller("billing/stripe")
@SkipThrottle()
export class StripeWebhookController {
  constructor(private readonly stripe: StripeBillingService) {}

  @Post("webhook")
  @HttpCode(HttpStatus.OK)
  async webhook(@Req() req: RawBodyRequest<Request>, @Headers("stripe-signature") firma?: string) {
    await this.stripe.procesarWebhook(req.rawBody, firma);
    return { recibido: true };
  }
}
