import type {
  CrearExamen,
  ExamenEstado,
  ExamenOpciones,
  ExamenRespuesta,
  ExamenResultado,
  ExamenSalida,
} from "@oponow/shared-types";
import { apiFetch } from "./api-client";

export type {
  CrearExamen,
  ExamenEstado,
  ExamenHistorial,
  ExamenOpciones,
  ExamenPregunta,
  ExamenRespuesta,
  ExamenResultado,
  ExamenSalida,
  MotivoEntregaExamen,
} from "@oponow/shared-types";

export function getOpcionesExamen(slug: string) {
  return apiFetch<ExamenOpciones>(`/examenes/oposiciones/${slug}`);
}

export function crearExamen(slug: string, datos: CrearExamen) {
  return apiFetch<{ id: string }>(`/examenes/oposiciones/${slug}`, {
    method: "POST",
    body: JSON.stringify(datos),
  });
}

export function getExamen(id: string) {
  return apiFetch<ExamenEstado>(`/examenes/${id}`);
}

export function guardarRespuesta(id: string, preguntaId: string, respuesta: ExamenRespuesta) {
  return apiFetch<void>(`/examenes/${id}/respuestas/${preguntaId}`, {
    method: "PUT",
    body: JSON.stringify(respuesta),
  });
}

export function registrarSalida(id: string, fase: "salida" | "vuelta", segundosFuera = 0) {
  return apiFetch<ExamenSalida>(`/examenes/${id}/salidas`, {
    method: "POST",
    body: JSON.stringify({ fase, segundosFuera }),
  });
}

export function entregarExamen(id: string) {
  return apiFetch<ExamenResultado>(`/examenes/${id}/entregar`, { method: "POST" });
}
