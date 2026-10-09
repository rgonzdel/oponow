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
  justificacionIa: string | null;
  mnemotecnia: string | null;
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

export interface ResumenDashboard {
  streak: number;
  testsRealizados: number;
  fallos: number | null;
  dias: 7 | 14 | 30;
}

export interface GoogleEventOcurrencia {
  id: string;
  titulo: string;
  inicio: string;
  todoElDia: boolean;
  oponowTareaId: string | null;
}

// ── Modo examen ──────────────────────────────────────────────────────────

export interface ExamenTemaOpcion {
  id: string;
  orden: number;
  titulo: string;
  /** Preguntas del tema visibles para el plan del usuario. */
  preguntas: number;
}

export interface ExamenHistorial {
  id: string;
  inicio: string;
  numPreguntas: number;
  puntuacion: number | null;
  motivoEntrega: MotivoEntregaExamen | null;
  modoAvanzado: boolean;
}

export interface ExamenOpciones {
  temas: ExamenTemaOpcion[];
  /** Examen sin entregar que el usuario puede retomar. */
  activoId: string | null;
  historial: ExamenHistorial[];
}

export type MotivoEntregaExamen = "usuario" | "tiempo" | "salidas";

export interface CrearExamen {
  temaIds: string[];
  numPreguntas: number;
  duracionMinutos: number;
  modoAvanzado: boolean;
  maxSalidas: number;
}

export interface ExamenRespuesta {
  opcionElegida: number | null;
  marcada: boolean;
}

export interface ExamenResultado {
  correctas: number;
  incorrectas: number;
  enBlanco: number;
  puntuacion: number;
  motivoEntrega: MotivoEntregaExamen;
  salidas: number;
  segundosFuera: number;
  segundosUsados: number;
}

export interface ExamenPreguntaRevision {
  respuestaCorrecta: number;
  justificacionIa: string | null;
  mnemotecnia: string | null;
  temaTitulo: string;
}

export interface ExamenPregunta {
  id: string;
  enunciado: string;
  opciones: string[];
  /** Solo cuando el examen está entregado. */
  revision?: ExamenPreguntaRevision;
}

export interface ExamenEstado {
  id: string;
  oposicionSlug: string;
  estado: "en_progreso" | "entregado";
  preguntas: ExamenPregunta[];
  respuestas: Record<string, ExamenRespuesta>;
  duracionSegundos: number;
  /** Según el reloj del servidor en el momento de la respuesta. */
  segundosRestantes: number;
  modoAvanzado: boolean;
  maxSalidas: number;
  salidas: number;
  resultado: ExamenResultado | null;
}

export interface ExamenSalida {
  salidas: number;
  maxSalidas: number;
  entregado: boolean;
}
