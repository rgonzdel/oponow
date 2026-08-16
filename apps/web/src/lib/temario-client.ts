import { apiFetch } from "./api-client";

export interface TemaSummary {
  id: string;
  orden: number;
  titulo: string;
  esGratuito: boolean;
}

export interface BloqueSummary {
  id: string;
  orden: number;
}

export interface BloqueContenido {
  id: string;
  orden: number;
  contenidoHtml: string;
}

export function listTemas(oposicionSlug: string) {
  return apiFetch<TemaSummary[]>(`/temario/oposiciones/${oposicionSlug}/temas`);
}

export function listBloques(temaId: string) {
  return apiFetch<BloqueSummary[]>(`/temario/temas/${temaId}/bloques`);
}

export function getBloque(bloqueId: string) {
  return apiFetch<BloqueContenido>(`/temario/bloques/${bloqueId}`);
}
