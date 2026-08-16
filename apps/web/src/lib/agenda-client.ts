import { apiFetch } from "./api-client";

export interface Tarea {
  id: string;
  titulo: string;
  descripcion: string | null;
  fecha: string;
  completada: boolean;
  createdAt: string;
}

export interface CreateTareaPayload {
  titulo: string;
  descripcion?: string;
  fecha: string;
}

export interface UpdateTareaPayload {
  titulo?: string;
  descripcion?: string;
  fecha?: string;
  completada?: boolean;
}

export function listTareas() {
  return apiFetch<Tarea[]>("/agenda/tareas");
}

export function createTarea(payload: CreateTareaPayload) {
  return apiFetch<Tarea>("/agenda/tareas", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateTarea(id: string, payload: UpdateTareaPayload) {
  return apiFetch<Tarea>(`/agenda/tareas/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export function deleteTarea(id: string) {
  return apiFetch<void>(`/agenda/tareas/${id}`, { method: "DELETE" });
}

export function getFeedUrl() {
  return apiFetch<{ url: string }>("/agenda/feed-url");
}
