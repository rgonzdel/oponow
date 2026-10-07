import { sql } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";
import {
  cicloFacturacionEnum,
  metodoPagoEnum,
  planTipoEnum,
  proveedorIdentidadEnum,
  rolUsuarioEnum,
  suscripcionEstadoEnum,
} from "./enums";
import { bloquesContenido, oposiciones } from "./content";

export const usuarios = pgTable("usuarios", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  // email y password_hash son opcionales: quien entra con Google/Facebook no
  // tiene contraseña (ver identidadesExternas), y Facebook puede no dar
  // email. El índice único de email sigue valiendo: Postgres no considera
  // iguales dos NULL.
  email: text("email"),
  passwordHash: text("password_hash"),
  emailVerified: boolean("email_verified").notNull().default(false),
  plan: planTipoEnum("plan").notNull().default("free"),
  planExpira: timestamp("plan_expira", { withTimezone: true }),
  // Nunca se puede fijar desde el propio registro/API pública — solo se
  // activa a mano en la base de datos. Viaja en el JWT (ver auth.service.ts)
  // y se expone como GUC de sesión app.is_admin (ver rls-context.middleware)
  // para las políticas *_admin_read/*_admin_update de policies.sql.
  esAdmin: boolean("es_admin").notNull().default(false),
  // Rol del equipo (o "opositor"). es_admin se mantiene sincronizado
  // (= rol "admin") porque lo usan las políticas RLS y el JWT existentes.
  rol: rolUsuarioEnum("rol").notNull().default("opositor"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
}, (t) => [
  uniqueIndex("usuarios_email_idx").on(t.email),
]);

// Cuentas de Google/Facebook vinculadas a un usuario. `sujeto` es el id
// estable que da el proveedor (claim `sub` de Google, id de Facebook): el
// email puede cambiar en el proveedor, el sujeto no.
export const identidadesExternas = pgTable("identidades_externas", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  usuarioId: uuid("usuario_id")
    .notNull()
    .references(() => usuarios.id, { onDelete: "cascade" }),
  proveedor: proveedorIdentidadEnum("proveedor").notNull(),
  sujeto: text("sujeto").notNull(),
  email: text("email"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
}, (t) => [
  uniqueIndex("identidades_externas_proveedor_sujeto_idx").on(t.proveedor, t.sujeto),
  index("identidades_externas_usuario_id_idx").on(t.usuarioId),
]);

// MFA por correo: tras una contraseña correcta en un navegador que no es de
// confianza, se envía un código de 6 dígitos. Solo se guarda su hash.
export const desafiosMfa = pgTable("desafios_mfa", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  usuarioId: uuid("usuario_id")
    .notNull()
    .references(() => usuarios.id, { onDelete: "cascade" }),
  codigoHash: text("codigo_hash").notNull(),
  intentos: integer("intentos").notNull().default(0),
  reenvios: integer("reenvios").notNull().default(0),
  expiraEn: timestamp("expira_en", { withTimezone: true }).notNull(),
  enviadoEn: timestamp("enviado_en", { withTimezone: true }).notNull().defaultNow(),
  usadoEn: timestamp("usado_en", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
}, (t) => [
  index("desafios_mfa_usuario_id_idx").on(t.usuarioId),
]);

// "He olvidado mi contraseña": enlace de un solo uso enviado al correo. Solo
// se guarda el hash del token (como los refresh tokens).
export const restablecimientosContrasena = pgTable("restablecimientos_contrasena", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  usuarioId: uuid("usuario_id")
    .notNull()
    .references(() => usuarios.id, { onDelete: "cascade" }),
  tokenHash: text("token_hash").notNull(),
  expiraEn: timestamp("expira_en", { withTimezone: true }).notNull(),
  usadoEn: timestamp("usado_en", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
}, (t) => [
  uniqueIndex("restablecimientos_contrasena_token_hash_idx").on(t.tokenHash),
  index("restablecimientos_contrasena_usuario_id_idx").on(t.usuarioId),
]);

// Navegadores/dispositivos que ya pasaron el MFA: no se les vuelve a pedir
// código hasta que caducan. El token viaja en una cookie httpOnly (web) o en
// el body (móvil); aquí solo su hash.
export const dispositivosConfianza = pgTable("dispositivos_confianza", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  usuarioId: uuid("usuario_id")
    .notNull()
    .references(() => usuarios.id, { onDelete: "cascade" }),
  tokenHash: text("token_hash").notNull(),
  userAgent: text("user_agent"),
  expiraEn: timestamp("expira_en", { withTimezone: true }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
}, (t) => [
  uniqueIndex("dispositivos_confianza_token_hash_idx").on(t.tokenHash),
  index("dispositivos_confianza_usuario_id_idx").on(t.usuarioId),
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
  // Facturación: lo que se muestra en "Mi cuenta" (próximo pago, importe y
  // método). De la tarjeta solo se guarda lo que la propia pasarela expone
  // (marca, 4 últimos dígitos y caducidad): nunca el número ni el CVC.
  ciclo: cicloFacturacionEnum("ciclo").notNull().default("mensual"),
  importeCentimos: integer("importe_centimos"),
  proximoCobro: timestamp("proximo_cobro", { withTimezone: true }),
  metodoPago: metodoPagoEnum("metodo_pago"),
  tarjetaMarca: text("tarjeta_marca"),
  tarjetaUltimos4: text("tarjeta_ultimos4"),
  tarjetaCaducidad: text("tarjeta_caducidad"),
  /** Bizum: solo los últimos dígitos del móvil, para reconocerlo. */
  bizumTelefonoUltimos: text("bizum_telefono_ultimos"),
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
