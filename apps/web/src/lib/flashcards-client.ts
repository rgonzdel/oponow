import { apiFetch } from "./api-client";

// Refleja apps/api/src/flashcards/flashcards.service.ts.
export type Calificacion = "otra" | "dificil" | "bien";
export type ModoSesion = "repaso" | "todas";

export interface TemaFlashcards {
  id: string;
  orden: number;
  titulo: string;
  total: number;
  nuevas: number;
  pendientes: number;
  dominadas: number;
}

export interface ResumenFlashcards {
  oposicion: { slug: string; nombre: string };
  temas: TemaFlashcards[];
}

export interface Flashcard {
  id: string;
  anverso: string;
  reverso: string;
  cita: string;
  referencia: string;
  boeUrl: string;
  caja: number | null;
}

export function getResumenFlashcards(slug: string) {
  return apiFetch<ResumenFlashcards>(`/flashcards/${slug}/resumen`);
}

export function getSesionFlashcards(slug: string, temaId: string | null, modo: ModoSesion) {
  const params = new URLSearchParams({ modo });
  if (temaId) params.set("temaId", temaId);
  return apiFetch<Flashcard[]>(`/flashcards/${slug}/sesion?${params}`);
}

export function responderFlashcard(id: string, calificacion: Calificacion) {
  return apiFetch<{ caja: number; proximaRevision: string }>(`/flashcards/${id}/respuesta`, {
    method: "POST",
    body: JSON.stringify({ calificacion }),
  });
}
