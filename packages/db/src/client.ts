import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "./schema";

export type Sql = ReturnType<typeof postgres>;
export type Database = ReturnType<typeof drizzle<typeof schema>>;

/**
 * Crea el pool de conexiones de runtime (rol app_user, sujeto a RLS).
 * `max` bajo a propósito: cada request reserva una conexión dedicada
 * (ver apps/api DatabaseService) para poder fijar `app.current_user_id` /
 * `app.current_plan` por request sin contaminar otras requests.
 */
export function createRuntimeSql(connectionString: string): Sql {
  return postgres(connectionString, { max: 10 });
}

export function createDb(sql: Sql): Database {
  return drizzle(sql, { schema });
}

export { schema };
