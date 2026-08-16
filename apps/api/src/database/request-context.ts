import { AsyncLocalStorage } from "node:async_hooks";
import type { Database } from "@oponow/db";

export interface RlsContext {
  /** Instancia de Drizzle atada a la conexión reservada de esta request (rol app_user, sujeta a RLS). */
  db: Database;
  userId: string | null;
  plan: string | null;
}

export const rlsContextStorage = new AsyncLocalStorage<RlsContext>();

export function getRequestDb(): Database {
  const store = rlsContextStorage.getStore();
  if (!store) {
    throw new Error(
      "No hay contexto de base de datos en esta request (falta RlsContextMiddleware)",
    );
  }
  return store.db;
}

export function getRequestUserId(): string | null {
  return rlsContextStorage.getStore()?.userId ?? null;
}
