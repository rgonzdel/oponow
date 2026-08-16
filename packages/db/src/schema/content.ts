import { sql } from "drizzle-orm";
import {
  boolean,
  date,
  index,
  integer,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

export const oposiciones = pgTable("oposiciones", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  nombre: text("nombre").notNull(),
  slug: text("slug").notNull(),
  categoria: text("categoria").notNull(),
  faseEscalado: text("fase_escalado"),
  activa: boolean("activa").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
}, (t) => [
  uniqueIndex("oposiciones_slug_idx").on(t.slug),
]);

export const leyes = pgTable("leyes", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  nombre: text("nombre").notNull(),
  boeReferencia: text("boe_referencia").notNull(),
  boeUrl: text("boe_url"),
  fechaUltimaActualizacion: date("fecha_ultima_actualizacion"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const articulos = pgTable("articulos", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  leyId: uuid("ley_id")
    .notNull()
    .references(() => leyes.id, { onDelete: "cascade" }),
  numero: text("numero").notNull(),
  textoOriginal: text("texto_original").notNull(),
  textoResumidoIa: text("texto_resumido_ia"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
}, (t) => [
  index("articulos_ley_id_idx").on(t.leyId),
]);

export const temas = pgTable("temas", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  oposicionId: uuid("oposicion_id")
    .notNull()
    .references(() => oposiciones.id, { onDelete: "cascade" }),
  orden: integer("orden").notNull(),
  titulo: text("titulo").notNull(),
  esGratuito: boolean("es_gratuito").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
}, (t) => [
  uniqueIndex("temas_oposicion_orden_idx").on(t.oposicionId, t.orden),
]);

export const bloquesContenido = pgTable("bloques_contenido", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  temaId: uuid("tema_id")
    .notNull()
    .references(() => temas.id, { onDelete: "cascade" }),
  orden: integer("orden").notNull(),
  contenido: text("contenido").notNull(),
  articuloId: uuid("articulo_id").references(() => articulos.id, {
    onDelete: "set null",
  }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
}, (t) => [
  uniqueIndex("bloques_tema_orden_idx").on(t.temaId, t.orden),
]);
