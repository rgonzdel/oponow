export const PAYMENT_GATEWAY = Symbol("PAYMENT_GATEWAY");

export interface ChargeCardInput {
  customerId: string;
  /** null si la cuenta no tiene email (acceso solo con teléfono). */
  customerEmail: string | null;
  /** Descriptivo, ej. "Oponow LITE — Técnico Auxiliar de Informática". */
  planLabel: string;
  trialDays: number;
  /** Importe de cada cobro, en céntimos de euro. */
  importeCentimos: number;
  ciclo: "mensual" | "anual";
  cardNumber: string;
  cardExpiry: string;
  cardCvc: string;
  cardName: string;
}

/** Lo que la pasarela permite mostrar del medio de pago (como Stripe:
 * nunca el número completo ni el CVC). */
export type MetodoPagoGuardado =
  | { tipo: "tarjeta"; marca: string; ultimos4: string; caducidad: string }
  | { tipo: "bizum"; telefonoUltimos: string };

export interface ChargeCardResult {
  /** Id de la suscripción en la pasarela externa (con Stripe real, `sub_...`). */
  externalSubscriptionId: string;
  trialEndsAt: Date;
  /** Fecha del primer cobro (al acabar la prueba). */
  proximoCobro: Date;
  metodo: MetodoPagoGuardado;
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
  /** Da de baja la suscripción en la pasarela (deja de cobrarse). */
  cancelSubscription(externalSubscriptionId: string): Promise<void>;
}
