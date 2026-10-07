export const PAYMENT_GATEWAY = Symbol("PAYMENT_GATEWAY");

export interface ChargeCardInput {
  customerId: string;
  /** null si la cuenta no tiene email (acceso solo con teléfono). */
  customerEmail: string | null;
  /** Descriptivo, ej. "Oponow LITE — Técnico Auxiliar de Informática". */
  planLabel: string;
  trialDays: number;
  cardNumber: string;
  cardExpiry: string;
  cardCvc: string;
  cardName: string;
}

export interface ChargeCardResult {
  /** Id de la suscripción en la pasarela externa (con Stripe real, `sub_...`). */
  externalSubscriptionId: string;
  trialEndsAt: Date;
}

/**
 * Puerto que aísla al resto del backend de la pasarela de pago concreta.
 * Hoy solo existe MockPaymentGateway (ver mock-payment.gateway.ts); cuando
 * haya cuenta de Stripe, StripePaymentGateway implementa este mismo
 * contrato y se cambia el provider en billing.module.ts sin tocar
 * BillingService ni el controller.
 */
export interface PaymentGateway {
  chargeAndSubscribe(input: ChargeCardInput): Promise<ChargeCardResult>;
}
