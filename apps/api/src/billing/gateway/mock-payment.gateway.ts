import { Injectable, UnprocessableEntityException } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import type {
  ChargeCardInput,
  ChargeCardResult,
  PaymentGateway,
} from "./payment-gateway";

// Mismo número que usa Stripe para simular una tarjeta rechazada en modo
// test — así el flujo de error se puede probar hoy y seguirá funcionando
// igual el día que esto se sustituya por Stripe real.
const DECLINED_TEST_CARD = "4000000000000002";

/**
 * Adaptador simulado: no llama a ningún servicio externo ni mueve dinero
 * real. Valida el formato de la tarjeta lo justo para que el flujo se
 * sienta real, y la descarta inmediatamente sin persistirla en ningún
 * sitio (ni siquiera aquí) — nunca llega a tocar la base de datos.
 */
@Injectable()
export class MockPaymentGateway implements PaymentGateway {
  async chargeAndSubscribe(
    input: ChargeCardInput,
  ): Promise<ChargeCardResult> {
    const digits = input.cardNumber.replace(/\s+/g, "");

    if (!/^\d{13,19}$/.test(digits)) {
      throw new UnprocessableEntityException("Número de tarjeta inválido");
    }
    if (!/^\d{2}\/\d{2}$/.test(input.cardExpiry)) {
      throw new UnprocessableEntityException(
        "Fecha de caducidad inválida (usa MM/AA)",
      );
    }
    if (!/^\d{3,4}$/.test(input.cardCvc)) {
      throw new UnprocessableEntityException("CVC inválido");
    }
    if (!input.cardName.trim()) {
      throw new UnprocessableEntityException("Falta el nombre del titular");
    }

    if (digits === DECLINED_TEST_CARD) {
      throw new UnprocessableEntityException(
        "La tarjeta ha sido rechazada por el banco",
      );
    }

    const trialEndsAt = new Date(
      Date.now() + input.trialDays * 24 * 60 * 60 * 1000,
    );

    return {
      externalSubscriptionId: `mock_sub_${randomUUID()}`,
      trialEndsAt,
    };
  }
}
