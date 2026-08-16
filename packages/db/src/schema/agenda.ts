import { sql } from "drizzle-orm";
import { boolean, index, pgTable, text, timestamp, uniqueIndex, uuid } from "drizzle-orm/pg-core";
import { usuarios } from "./users";

// Tareas de la agenda de estudio del usuario. Si el usuario ha conectado su
// Google Calendar (ver googleCalendarConexiones), cada tarea se refleja
// como un evento real en su calendario — googleEventId guarda el id de ese
// evento para poder actualizarlo/borrarlo luego (ver apps/api/src/agenda).
export const tareasAgenda = pgTable("tareas_agenda", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  usuarioId: uuid("usuario_id")
    .notNull()
    .references(() => usuarios.id, { onDelete: "cascade" }),
  titulo: text("titulo").notNull(),
  descripcion: text("descripcion"),
  fecha: timestamp("fecha", { withTimezone: true }).notNull(),
  completada: boolean("completada").notNull().default(false),
  googleEventId: text("google_event_id"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
}, (t) => [
  index("tareas_agenda_usuario_fecha_idx").on(t.usuarioId, t.fecha),
]);

// Una fila por usuario que haya conectado su cuenta de Google. refreshToken
// va cifrado en reposo (ver apps/api/src/agenda/google/crypto.util.ts) —
// es un secreto de larga duración que, a diferencia de una contraseña, SÍ
// necesitamos poder leer en claro para llamar a la API de Calendar, así
// que no vale con un hash: hace falta cifrado reversible con una clave que
// solo tiene el backend (TOKEN_ENCRYPTION_KEY).
export const googleCalendarConexiones = pgTable("google_calendar_conexiones", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  usuarioId: uuid("usuario_id")
    .notNull()
    .references(() => usuarios.id, { onDelete: "cascade" }),
  refreshTokenCifrado: text("refresh_token_cifrado").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
}, (t) => [
  uniqueIndex("google_calendar_conexiones_usuario_idx").on(t.usuarioId),
]);
