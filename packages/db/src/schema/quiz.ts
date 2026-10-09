import { sql } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  jsonb,
  numeric,
  pgTable,
  primaryKey,
  smallint,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { examenMotivoEntregaEnum, intentoEstadoEnum } from "./enums";
import { articulos, oposiciones, temas } from "./content";
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
  // Truco de memoria (acrónimo, rima, asociación...) para fijar el dato que
  // pregunta el enunciado — se muestra en el test junto a la justificación.
  mnemotecnia: text("mnemotecnia"),
  // Para el futuro generador adaptativo de tests fallados (VIP).
  dificultad: smallint("dificultad"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
}, (t) => [
  index("preguntas_tema_id_idx").on(t.temaId),
  index("preguntas_articulo_id_idx").on(t.articuloId),
]);

// Modo examen: un examen cronometrado con preguntas de uno o varios temas.
// El tiempo lo controla el servidor (inicio + duración), así que recargar la
// página no lo detiene. Al entregarlo se vuelcan las respuestas a
// intentos_test / respuestas_usuario (un intento por tema, con examen_id),
// para que cuente en la racha, los fallos y el informe como cualquier test.
export const examenes = pgTable("examenes", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  usuarioId: uuid("usuario_id")
    .notNull()
    .references(() => usuarios.id, { onDelete: "cascade" }),
  oposicionId: uuid("oposicion_id")
    .notNull()
    .references(() => oposiciones.id, { onDelete: "cascade" }),
  // Ids de las preguntas en el orden en que se muestran.
  preguntaIds: jsonb("pregunta_ids").notNull().$type<string[]>(),
  duracionSegundos: integer("duracion_segundos").notNull(),
  inicio: timestamp("inicio", { withTimezone: true }).notNull().defaultNow(),
  entregadoEn: timestamp("entregado_en", { withTimezone: true }),
  estado: intentoEstadoEnum("estado").notNull().default("en_progreso"),
  motivoEntrega: examenMotivoEntregaEnum("motivo_entrega"),
  // Modo avanzado: pantalla completa obligatoria y control de salidas.
  modoAvanzado: boolean("modo_avanzado").notNull().default(false),
  maxSalidas: smallint("max_salidas").notNull().default(3),
  salidas: smallint("salidas").notNull().default(0),
  segundosFuera: integer("segundos_fuera").notNull().default(0),
  correctas: smallint("correctas"),
  incorrectas: smallint("incorrectas"),
  enBlanco: smallint("en_blanco"),
  puntuacion: numeric("puntuacion", { precision: 5, scale: 2 }),
}, (t) => [
  index("examenes_usuario_inicio_idx").on(t.usuarioId, t.inicio),
]);

export const respuestasExamen = pgTable("respuestas_examen", {
  examenId: uuid("examen_id")
    .notNull()
    .references(() => examenes.id, { onDelete: "cascade" }),
  preguntaId: uuid("pregunta_id")
    .notNull()
    .references(() => preguntas.id, { onDelete: "cascade" }),
  // null = en blanco (puede estar solo marcada para revisar).
  opcionElegida: smallint("opcion_elegida"),
  marcada: boolean("marcada").notNull().default(false),
  actualizadoEn: timestamp("actualizado_en", { withTimezone: true }).notNull().defaultNow(),
}, (t) => [
  primaryKey({ columns: [t.examenId, t.preguntaId] }),
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
  // Si el intento sale de un examen (modo examen), su id: un examen con
  // varios temas genera un intento por tema, pero cuenta como un solo test.
  examenId: uuid("examen_id").references(() => examenes.id, { onDelete: "cascade" }),
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
