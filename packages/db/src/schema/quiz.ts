import { sql } from "drizzle-orm";
import {
  boolean,
  index,
  jsonb,
  numeric,
  pgTable,
  smallint,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { intentoEstadoEnum } from "./enums";
import { articulos, temas } from "./content";
import { usuarios } from "./users";

export const preguntas = pgTable("preguntas", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  temaId: uuid("tema_id")
    .notNull()
    .references(() => temas.id, { onDelete: "cascade" }),
  articuloId: uuid("articulo_id").references(() => articulos.id, {
    onDelete: "set null",
  }),
  enunciado: text("enunciado").notNull(),
  // Array de opciones, ej. ["Opción A", "Opción B", "Opción C", "Opción D"]
  opciones: jsonb("opciones").notNull().$type<string[]>(),
  // Índice (0-based) de la opción correcta dentro de `opciones`.
  respuestaCorrecta: smallint("respuesta_correcta").notNull(),
  justificacionIa: text("justificacion_ia"),
  // Para el futuro generador adaptativo de tests fallados (VIP).
  dificultad: smallint("dificultad"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
}, (t) => [
  index("preguntas_tema_id_idx").on(t.temaId),
  index("preguntas_articulo_id_idx").on(t.articuloId),
]);

export const intentosTest = pgTable("intentos_test", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  usuarioId: uuid("usuario_id")
    .notNull()
    .references(() => usuarios.id, { onDelete: "cascade" }),
  temaId: uuid("tema_id")
    .notNull()
    .references(() => temas.id, { onDelete: "cascade" }),
  fecha: timestamp("fecha", { withTimezone: true }).notNull().defaultNow(),
  esDiario: boolean("es_diario").notNull().default(false),
  estado: intentoEstadoEnum("estado").notNull().default("en_progreso"),
  puntuacion: numeric("puntuacion", { precision: 5, scale: 2 }),
}, (t) => [
  index("intentos_test_usuario_tema_fecha_idx").on(
    t.usuarioId,
    t.temaId,
    t.fecha,
  ),
]);

export const respuestasUsuario = pgTable("respuestas_usuario", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  intentoId: uuid("intento_id")
    .notNull()
    .references(() => intentosTest.id, { onDelete: "cascade" }),
  preguntaId: uuid("pregunta_id")
    .notNull()
    .references(() => preguntas.id, { onDelete: "cascade" }),
  opcionElegida: smallint("opcion_elegida").notNull(),
  esCorrecta: boolean("es_correcta").notNull(),
  fecha: timestamp("fecha", { withTimezone: true }).notNull().defaultNow(),
}, (t) => [
  index("respuestas_usuario_intento_id_idx").on(t.intentoId),
  index("respuestas_usuario_pregunta_id_idx").on(t.preguntaId),
]);
