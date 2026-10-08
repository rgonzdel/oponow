import { pgEnum } from "drizzle-orm/pg-core";

export const planTipoEnum = pgEnum("plan_tipo", ["free", "lite", "vip"]);

export const proveedorIdentidadEnum = pgEnum("proveedor_identidad", [
  "google",
  "facebook",
]);

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

export const cicloFacturacionEnum = pgEnum("ciclo_facturacion", ["mensual", "anual"]);

export const metodoPagoEnum = pgEnum("metodo_pago", ["tarjeta", "bizum"]);

// Rol dentro de Oponow. "opositor" es el usuario normal; el resto son roles
// del equipo con acceso al panel (permisos en apps/api/src/auth/roles.ts).
export const rolUsuarioEnum = pgEnum("rol_usuario", ["opositor", "admin", "editor", "soporte", "lectura", "contabilidad"]);
