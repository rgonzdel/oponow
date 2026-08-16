import { sql } from "drizzle-orm";
import {
  boolean,
  index,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";
import { planTipoEnum, suscripcionEstadoEnum } from "./enums";
import { bloquesContenido, oposiciones } from "./content";

export const usuarios = pgTable("usuarios", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull(),
  passwordHash: text("password_hash").notNull(),
  emailVerified: boolean("email_verified").notNull().default(false),
  plan: planTipoEnum("plan").notNull().default("free"),
  planExpira: timestamp("plan_expira", { withTimezone: true }),
  // Nunca se puede fijar desde el propio registro/API pública — solo se
  // activa a mano en la base de datos. Viaja en el JWT (ver auth.service.ts)
  // y se expone como GUC de sesión app.is_admin (ver rls-context.middleware)
  // para las políticas *_admin_read/*_admin_update de policies.sql.
  esAdmin: boolean("es_admin").notNull().default(false),
  // Identificador opaco para la URL del feed .ics de la agenda (ver
  // packages/db/src/schema/agenda.ts) — no es un secreto de sesión, es el
  // equivalente a un enlace de suscripción de calendario "de solo lectura
  // por quien lo tenga", igual que hacen Google Calendar/Notion con sus
  // propios feeds. Cualquiera con la URL puede leer las tareas del usuario,
  // por eso no se expone en ningún sitio salvo al propio dueño autenticado.
  agendaFeedToken: uuid("agenda_feed_token")
    .notNull()
    .default(sql`gen_random_uuid()`),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
}, (t) => [
  uniqueIndex("usuarios_email_idx").on(t.email),
  uniqueIndex("usuarios_agenda_feed_token_idx").on(t.agendaFeedToken),
]);

// Tokens de refresco: tabla separada (no un campo en `usuarios`) para
// soportar múltiples dispositivos, rotación y revocación individual.
export const refreshTokens = pgTable("refresh_tokens", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  usuarioId: uuid("usuario_id")
    .notNull()
    .references(() => usuarios.id, { onDelete: "cascade" }),
  tokenHash: text("token_hash").notNull(),
  userAgent: text("user_agent"),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  revokedAt: timestamp("revoked_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
}, (t) => [
  uniqueIndex("refresh_tokens_token_hash_idx").on(t.tokenHash),
  index("refresh_tokens_usuario_id_idx").on(t.usuarioId),
]);

// Solo aplica al plan LITE (una oposición elegida). VIP se resuelve por
// usuarios.plan = 'vip' AND plan_expira > now(), sin fila aquí.
export const suscripcionesOposicion = pgTable("suscripciones_oposicion", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  usuarioId: uuid("usuario_id")
    .notNull()
    .references(() => usuarios.id, { onDelete: "cascade" }),
  oposicionId: uuid("oposicion_id")
    .notNull()
    .references(() => oposiciones.id, { onDelete: "cascade" }),
  activa: boolean("activa").notNull().default(true),
  // "trialing" durante los primeros días (ver trialEndsAt); una pasarela real
  // los transicionará a "active"/"past_due"/"canceled" vía webhook.
  estado: suscripcionEstadoEnum("estado").notNull().default("trialing"),
  trialEndsAt: timestamp("trial_ends_at", { withTimezone: true }),
  fechaInicio: timestamp("fecha_inicio", { withTimezone: true })
    .notNull()
    .defaultNow(),
  fechaFin: timestamp("fecha_fin", { withTimezone: true }),
  // Id de la suscripción en la pasarela de pago externa. Con el adaptador
  // simulado (ver apps/api/src/billing) lleva un valor con prefijo "mock_";
  // al conectar Stripe de verdad pasará a ser el id real de Stripe, sin
  // tocar el resto del modelo.
  stripeSubscriptionId: text("stripe_subscription_id"),
}, (t) => [
  uniqueIndex("suscripciones_usuario_oposicion_idx").on(
    t.usuarioId,
    t.oposicionId,
  ),
]);

// Auditoría de acceso a bloques de temario: base de la marca de agua
// (email + IP + timestamp) y evidencia forense ante piratería. email_snapshot
// copia el email en el momento del acceso para que la prueba siga siendo
// válida aunque el usuario cambie de email después.
export const sesionesLectura = pgTable("sesiones_lectura", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  usuarioId: uuid("usuario_id")
    .notNull()
    .references(() => usuarios.id, { onDelete: "cascade" }),
  bloqueId: uuid("bloque_id")
    .notNull()
    .references(() => bloquesContenido.id, { onDelete: "cascade" }),
  ip: text("ip").notNull(),
  emailSnapshot: text("email_snapshot").notNull(),
  timestamp: timestamp("timestamp", { withTimezone: true })
    .notNull()
    .defaultNow(),
}, (t) => [
  index("sesiones_lectura_usuario_bloque_idx").on(
    t.usuarioId,
    t.bloqueId,
    t.timestamp,
  ),
]);
