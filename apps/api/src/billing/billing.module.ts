import { Module } from "@nestjs/common";
import { BillingController } from "./billing.controller";
import { BillingService } from "./billing.service";
import { PAYMENT_GATEWAY } from "./gateway/payment-gateway";
import { MockPaymentGateway } from "./gateway/mock-payment.gateway";

@Module({
  controllers: [BillingController],
  providers: [
    BillingService,
    // Único punto que hay que tocar para pasar a Stripe real: cambiar
    // useClass por StripePaymentGateway (mismo contrato, ver payment-gateway.ts).
    { provide: PAYMENT_GATEWAY, useClass: MockPaymentGateway },
  ],
})
export class BillingModule {}
