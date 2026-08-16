import { apiFetch } from "./api-client";

export type SuscripcionEstado = "trialing" | "active" | "past_due" | "canceled";

export interface SubscriptionStatus {
  oposicionSlug: string;
  oposicionNombre: string;
  subscribed: boolean;
  estado: SuscripcionEstado | null;
  trialEndsAt: string | null;
}

export interface SubscribePayload {
  oposicionSlug: string;
  cardNumber: string;
  cardExpiry: string;
  cardCvc: string;
  cardName: string;
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
