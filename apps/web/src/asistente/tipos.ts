// Tipos compartidos por el motor de Silvia (que corre en un Web Worker) y la
// interfaz de chat. Todo es serializable: viaja por postMessage.

/** Entrada de normativa/fuentes.json. */
export interface FuenteNorma {
  clave: string;
  id: string;
  abreviatura: string;
  nombre: string;
  titulo: string;
  materia: string;
  alias: string[];
}

/** Precepto tal y como lo guarda scripts/descargar-normativa.mjs. */
export interface PreceptoCrudo {
  /** id del bloque en el BOE (ancla de la URL). */
  b: string;
  /** Nombre: «Artículo 24», «Artículo ciento ochenta y dos», «Disposición adicional primera»… */
  n: string;
  /** Rúbrica («Silencio administrativo en…») o null. */
  r: string | null;
  /** Índices en `encabezados` de la ruta Libro > Título > Capítulo > Sección. */
  e: number[];
  /** Párrafos del texto vigente. */
  p: string[];
}

export interface TextoNorma {
  clave: string;
  id: string;
  tituloOficial: string;
  actualizado: string | null;
  descargado: string;
  encabezados: string[];
  preceptos: PreceptoCrudo[];
}

/** Cita literal verificable (scripts/verificar-asistente.ts comprueba que
 * `fragmento` aparece tal cual en el precepto). */
export interface Cita {
  norma: string;
  /** id de bloque del precepto (PreceptoCrudo.b). */
  precepto: string;
  fragmento: string;
}

export interface Ficha {
  id: string;
  /** Pregunta canónica, como la haría un opositor. */
  pregunta: string;
  /** Otras formas de preguntarlo y palabras clave que deben activarla. */
  variantes: string[];
  materia: string;
  /** Respuesta directa, redactada a partir de las citas. */
  respuesta: string;
  citas: Cita[];
  /** «Para el examen»: datos que suelen preguntarse. */
  claves?: string[];
  /** Confusiones y trampas habituales en los test. */
  trampas?: string[];
  /** ids de otras fichas. */
  relacionadas?: string[];
}

export type AmbitoOposicion =
  | "Justicia"
  | "Administración General del Estado"
  | "Hacienda"
  | "Seguridad"
  | "Educación"
  | "Sanidad"
  | "Administración local"
  | "Comunidades autónomas"
  | "Correos"
  | "Instituciones";

export interface OposicionCatalogo {
  id: string;
  nombre: string;
  alias: string[];
  ambito: AmbitoOposicion;
  administracion: string;
  /** Grupo/subgrupo de clasificación (TREBEP art. 76). */
  grupo: string;
  /** true si `grupo` está respaldado por una cita literal en `citas`. */
  grupoVerificado: boolean;
  titulacion: string;
  /** true si `titulacion` está respaldada por una cita literal en `citas`. */
  titulacionVerificada: boolean;
  descripcion: string;
  /** Claves de normativa/fuentes.json que suelen formar el temario jurídico. */
  normasClave: string[];
  /** Grandes bloques habituales del programa (orientativo). */
  bloquesTemario: string[];
  citas: Cita[];
  /** slug de @oponow/shared-types si Oponow ya la tiene como oposición disponible. */
  slugOponow?: string;
}

// ===== Respuesta del asistente =====

export interface FuenteRespuesta {
  etiqueta: string;
  url: string;
}

export interface PreguntaGenerada {
  enunciado: string;
  opciones: string[];
  correcta: number;
  explicacion: string;
  fuente: FuenteRespuesta;
}

export interface ResultadoBusqueda {
  norma: string;
  precepto: string;
  rubrica: string | null;
  extracto: string;
  url: string;
  /** Consulta que abre ese precepto completo si se pulsa. */
  consulta: string;
}

export type Bloque =
  | { tipo: "parrafo"; texto: string }
  | {
      tipo: "cita";
      norma: string;
      precepto: string;
      rubrica: string | null;
      ruta: string[];
      parrafos: string[];
      url: string;
      /** Términos a resaltar dentro de la cita. */
      resaltar?: string[];
    }
  | { tipo: "lista"; titulo?: string; items: string[] }
  | { tipo: "claves"; titulo: string; items: string[] }
  | { tipo: "aviso"; texto: string }
  | { tipo: "tabla"; cabecera: string[]; filas: string[][] }
  | { tipo: "resultados"; titulo: string; items: ResultadoBusqueda[] }
  | { tipo: "test"; preguntas: PreguntaGenerada[] }
  /** Enlace a una ruta interna de la web (p. ej. la ficha de una oposición). */
  | { tipo: "enlace"; texto: string; to: string };

export interface ContextoConversacion {
  ultimaNorma?: string;
  /** Índice del último precepto mostrado dentro de su norma. */
  ultimoPrecepto?: number;
  ultimaOposicion?: string;
}

export interface Respuesta {
  intencion: string;
  titulo?: string;
  bloques: Bloque[];
  fuentes: FuenteRespuesta[];
  sugerencias: string[];
  contexto: ContextoConversacion;
}

// ===== Mensajes entre la página y el worker =====

export type MensajeAlWorker = { tipo: "consulta"; id: number; texto: string; contexto: ContextoConversacion };

export type MensajeDelWorker =
  | { tipo: "progreso"; cargadas: number; total: number; preceptos: number }
  | { tipo: "respuesta"; id: number; respuesta: Respuesta }
  | { tipo: "error"; id: number; mensaje: string };
