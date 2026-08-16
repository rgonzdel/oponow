import { sql } from "drizzle-orm";
import { boolean, index, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { usuarios } from "./users";

// Tareas de la agenda de estudio del usuario. Se exponen tanto por la API
// normal (CRUD autenticado, sujeto a RLS) como por un feed .ics público
// (ver apps/api/src/agenda) al que se suscribe Google Calendar / Apple
// Calendar mediante la URL con el agenda_feed_token de usuarios — ese feed
// las lee vía el rol auth_service (misma lógica que login: identidad
// resuelta por un token opaco, no por sesión), de ahí la política
// tareas_agenda_auth_service en rls/policies.sql.
export const tareasAgenda = pgTable("tareas_agenda", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  usuarioId: uuid("usuario_id")
    .notNull()
    .references(() => usuarios.id, { onDelete: "cascade" }),
  titulo: text("titulo").notNull(),
  descripcion: text("descripcion"),
  fecha: timestamp("fecha", { withTimezone: true }).notNull(),
  completada: boolean("completada").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
}, (t) => [
  index("tareas_agenda_usuario_fecha_idx").on(t.usuarioId, t.fecha),
]);
