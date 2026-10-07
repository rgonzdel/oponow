import { sql } from "drizzle-orm";
import {
  index,
  integer,
  pgTable,
  primaryKey,
  smallint,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";
import { temas } from "./content";
import { usuarios } from "./users";

// Tarjetas de memoria: pregunta (anverso) y respuesta (reverso), cada una
// respaldada por una cita literal del texto consolidado del BOE.
export const flashcards = pgTable("flashcards", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  // Identificador estable del banco de contenido (p. ej. "ce-1-3"): permite
  // reimportar el banco actualizando en vez de duplicar.
  clave: text("clave").notNull(),
  anverso: text("anverso").notNull(),
  reverso: text("reverso").notNull(),
  cita: text("cita").notNull(),
  // "CE, art. 1.3" — lo que ve el usuario como fuente.
  referencia: text("referencia").notNull(),
  boeId: text("boe_id").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
}, (t) => [
  uniqueIndex("flashcards_clave_idx").on(t.clave),
]);

// Una misma tarjeta sirve a varios temas (p. ej. la Constitución está en el
// tema 1 de varias oposiciones).
export const flashcardsTemas = pgTable("flashcards_temas", {
  flashcardId: uuid("flashcard_id")
    .notNull()
    .references(() => flashcards.id, { onDelete: "cascade" }),
  temaId: uuid("tema_id")
    .notNull()
    .references(() => temas.id, { onDelete: "cascade" }),
}, (t) => [
  primaryKey({ columns: [t.flashcardId, t.temaId] }),
  index("flashcards_temas_tema_id_idx").on(t.temaId),
]);

// Repaso espaciado (sistema Leitner): la caja sube al acertar y vuelve a 0
// al fallar; cada caja tiene un intervalo de días hasta el siguiente repaso.
export const flashcardsProgreso = pgTable("flashcards_progreso", {
  usuarioId: uuid("usuario_id")
    .notNull()
    .references(() => usuarios.id, { onDelete: "cascade" }),
  flashcardId: uuid("flashcard_id")
    .notNull()
    .references(() => flashcards.id, { onDelete: "cascade" }),
  caja: smallint("caja").notNull().default(0),
  proximaRevision: timestamp("proxima_revision", { withTimezone: true }).notNull(),
  aciertos: integer("aciertos").notNull().default(0),
  fallos: integer("fallos").notNull().default(0),
  actualizadoEn: timestamp("actualizado_en", { withTimezone: true })
    .notNull()
    .defaultNow(),
}, (t) => [
  primaryKey({ columns: [t.usuarioId, t.flashcardId] }),
  index("flashcards_progreso_usuario_revision_idx").on(t.usuarioId, t.proximaRevision),
]);
