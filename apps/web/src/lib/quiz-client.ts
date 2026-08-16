import { apiFetch } from "./api-client";

export interface PreguntaTest {
  id: string;
  enunciado: string;
  opciones: string[];
}

export interface IntentoIniciado {
  intentoId: string;
  preguntas: PreguntaTest[];
}

export interface RespuestaResultado {
  esCorrecta: boolean;
  respuestaCorrecta: number;
}

export interface ResumenIntento {
  correctas: number;
  incorrectas: number;
  enBlanco: number;
  puntuacion: number;
}

export type FallosGroupBy = "day" | "month" | "year";

export interface FalloDetalle {
  id: string;
  fecha: string;
  temaTitulo: string;
  enunciado: string;
  opciones: string[];
  opcionElegida: number;
  respuestaCorrecta: number;
}

export interface FallosResumen {
  fallos: FalloDetalle[];
  porPeriodo: { periodo: string; total: number }[];
}

export function iniciarIntento(temaId: string) {
  return apiFetch<IntentoIniciado>(`/quiz/temas/${temaId}/intentos`, {
    method: "POST",
  });
}

export function responder(
  intentoId: string,
  preguntaId: string,
  opcionElegida: number,
) {
  return apiFetch<RespuestaResultado>(
    `/quiz/intentos/${intentoId}/respuestas`,
    { method: "POST", body: JSON.stringify({ preguntaId, opcionElegida }) },
  );
}

export function finalizarIntento(intentoId: string) {
  return apiFetch<ResumenIntento>(`/quiz/intentos/${intentoId}/finalizar`, {
    method: "POST",
  });
}

export function getFallos(params: {
  from?: string;
  to?: string;
  groupBy?: FallosGroupBy;
}) {
  const qs = new URLSearchParams();
  if (params.from) qs.set("from", params.from);
  if (params.to) qs.set("to", params.to);
  if (params.groupBy) qs.set("groupBy", params.groupBy);
  const suffix = qs.toString() ? `?${qs.toString()}` : "";
  return apiFetch<FallosResumen>(`/quiz/fallos${suffix}`);
}
