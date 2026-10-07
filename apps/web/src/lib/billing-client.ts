import { apiFetch } from "./api-client";

export type SuscripcionEstado = "trialing" | "active" | "past_due" | "canceled";

export interface SubscriptionStatus {
  oposicionSlug: string;
  oposicionNombre: string;
  subscribed: boolean;
  estado: SuscripcionEstado | null;
  trialEndsAt: string | null;
  ciclo?: "mensual" | "anual";
  /** Importe de cada cobro, en céntimos. */
  importeCentimos?: number | null;
  proximoPago?: string | null;
  metodoPago?:
    | { tipo: "tarjeta"; marca: string | null; ultimos4: string | null; caducidad: string | null }
    | { tipo: "bizum"; telefonoUltimos: string | null }
    | null;
}

export interface SubscribePayload {
  oposicionSlug: string;
  ciclo: "mensual" | "anual";
  cardNumber: string;
  cardExpiry: string;
  cardCvc: string;
  cardName: string;
}

export function listMySubscriptions() {
  return apiFetch<SubscriptionStatus[]>("/billing/subscriptions");
}

export function getSubscriptionStatus(oposicionSlug: string) {
  return apiFetch<SubscriptionStatus>(
    `/billing/subscriptions/${oposicionSlug}`,
  );
}

export function subscribeWithTrial(payload: SubscribePayload) {
  return apiFetch<SubscriptionStatus>("/billing/subscriptions", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function cancelSubscription(oposicionSlug: string) {
  return apiFetch<SubscriptionStatus>(`/billing/subscriptions/${oposicionSlug}/cancelar`, { method: "POST" });
}
