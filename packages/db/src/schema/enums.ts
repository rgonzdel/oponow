import { pgEnum } from "drizzle-orm/pg-core";

export const planTipoEnum = pgEnum("plan_tipo", ["free", "lite", "vip"]);

export const intentoEstadoEnum = pgEnum("intento_estado", [
  "en_progreso",
  "completado",
]);

export const suscripcionEstadoEnum = pgEnum("suscripcion_estado", [
  "trialing",
  "active",
  "past_due",
  "canceled",
]);
