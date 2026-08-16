import type { BloqueContenido, BloqueSummary, TemaSummary } from "@oponow/shared-types";
import { apiFetch } from "./api-client";

export type { BloqueContenido, BloqueSummary, TemaSummary };

export function listTemas(oposicionSlug: string) {
  return apiFetch<TemaSummary[]>(`/temario/oposiciones/${oposicionSlug}/temas`);
}

export function listBloques(temaId: string) {
  return apiFetch<BloqueSummary[]>(`/temario/temas/${temaId}/bloques`);
}

export function getBloque(bloqueId: string) {
  return apiFetch<BloqueContenido>(`/temario/bloques/${bloqueId}`);
}
