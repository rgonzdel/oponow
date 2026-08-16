// Formas de respuesta de apps/api compartidas entre los clientes de
// apps/web y apps/mobile (que hablan con la misma API con fetch nativo,
// cada uno con su propio *-client.ts — solo los TIPOS se comparten aquí).

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
