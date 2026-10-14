// Plantillas de respuesta de Silvia. Cada intención tiene una estructura fija
// (respuesta directa → fundamento literal → claves de examen → trampas →
// siguiente paso) para que todas las respuestas tengan la misma calidad y
// se lean igual. Los textos fijos de aquí no contienen datos normativos:
// esos vienen siempre de las fichas verificadas o del texto del BOE.
import type { Bloque, FuenteRespuesta, Respuesta, ContextoConversacion } from "./tipos";

export const NOMBRE = "Silvia";

export const AVISO_GENERAL =
  "Silvia responde con el texto consolidado del BOE que lleva incorporado (no consulta internet). Para un examen, contrasta siempre con la convocatoria y con la versión vigente en boe.es.";

export function respuesta(
  intencion: string,
  partes: { titulo?: string; bloques: Bloque[]; fuentes?: FuenteRespuesta[]; sugerencias?: string[]; contexto: ContextoConversacion },
): Respuesta {
  const vistas = new Set<string>();
  const fuentes = (partes.fuentes ?? []).filter((f) => !vistas.has(f.url) && vistas.add(f.url));
  return {
    intencion,
    titulo: partes.titulo,
    bloques: partes.bloques,
    fuentes,
    sugerencias: [...new Set(partes.sugerencias ?? [])].slice(0, 5),
    contexto: partes.contexto,
  };
}

export const SUGERENCIAS_INICIO = [
  "¿Cuál es el plazo del recurso de alzada?",
  "Artículo 24 de la Constitución",
  "¿Qué requisitos tiene Tramitación Procesal?",
  "¿Qué oposiciones hay con bachillerato?",
  "Hazme un test del artículo 116 de la Constitución",
];

export function plantillaSaludo(contexto: ContextoConversacion): Respuesta {
  return respuesta("saludo", {
    titulo: `Hola, soy ${NOMBRE}`,
    bloques: [
      {
        tipo: "parrafo",
        texto:
          "Soy el asistente de estudio de Oponow. Respondo con el **texto literal y vigente del BOE** de la Constitución, las leyes de procedimiento y régimen jurídico, el TREBEP, la LOPJ, las leyes procesales, los códigos Civil y Penal, los 19 Estatutos de Autonomía y otras normas que entran en las oposiciones. También conozco las principales oposiciones de España.",
      },
    ],
    sugerencias: SUGERENCIAS_INICIO,
    contexto,
  });
}

export function plantillaAyuda(contexto: ContextoConversacion, normasCargadas: number): Respuesta {
  return respuesta("ayuda", {
    titulo: `Qué puedes preguntarme`,
    bloques: [
      {
        tipo: "lista",
        items: [
          "**Un artículo concreto**: «artículo 103 de la Constitución», «art. 24 Ley 39/2015», «disposición adicional primera de la LO 3/2007». Después puedes decir «siguiente» o «anterior».",
          "**Preguntas de temario**: «¿cuándo es positivo el silencio administrativo?», «¿cómo se compone el CGPJ?», «diferencia entre alzada y reposición».",
          "**Plazos**: «¿en qué plazo se interpone el recurso contencioso?», «¿cuándo prescriben las faltas graves?».",
          "**Una norma entera**: «estructura de la LOPJ», «qué es el TREBEP».",
          "**Oposiciones**: «requisitos de Auxilio Judicial», «temario de Policía Nacional», «oposiciones de justicia con bachillerato».",
          "**Practicar**: «hazme un test del artículo 116 CE», «ponme a prueba con la Ley 40/2015».",
        ],
      },
      {
        tipo: "aviso",
        texto: `Tengo cargadas ${normasCargadas} normas. No invento: si algo no está en el texto del BOE que llevo o en mis fichas verificadas, te enseño los artículos donde aparece y te lo digo claramente.`,
      },
    ],
    sugerencias: SUGERENCIAS_INICIO,
    contexto,
  });
}

export function plantillaGracias(contexto: ContextoConversacion): Respuesta {
  return respuesta("gracias", {
    bloques: [{ tipo: "parrafo", texto: "¡A por ello! Si quieres repasar lo último, pídeme un test." }],
    sugerencias: ["Ponme a prueba", "¿Qué más puedes hacer?"],
    contexto,
  });
}

export function plantillaSinResultados(consulta: string, contexto: ContextoConversacion): Respuesta {
  return respuesta("sin-resultados", {
    titulo: "No lo encuentro en la normativa que tengo",
    bloques: [
      {
        tipo: "parrafo",
        texto: `No he encontrado nada fiable sobre «${consulta}» ni en mis fichas ni en el texto de las normas cargadas, y prefiero no inventarme la respuesta.`,
      },
      {
        tipo: "lista",
        titulo: "Prueba a:",
        items: [
          "Nombrar la ley: «… en la Ley 39/2015», «… según la LOPJ».",
          "Usar el término técnico: «silencio administrativo», «recurso de alzada», «prescripción».",
          "Pedir el artículo directamente: «artículo 9 de la Constitución».",
        ],
      },
    ],
    sugerencias: SUGERENCIAS_INICIO.slice(0, 3),
    contexto,
  });
}

/** Introducción según el matiz de la pregunta, para respuestas de búsqueda. */
export function introBusqueda(matiz: string, hayFicha: boolean): string {
  if (hayFicha) return "";
  switch (matiz) {
    case "plazo":
      return "No tengo una ficha preparada para esta pregunta, pero estos son los preceptos que regulan esos plazos según el texto vigente del BOE:";
    case "quien":
      return "No tengo una ficha preparada para esta pregunta. Esto es lo que dice el texto vigente sobre quién es competente:";
    case "definicion":
      return "No tengo una ficha preparada para este concepto. Este es el precepto donde mejor aparece, en su redacción vigente:";
    default:
      return "No tengo una ficha preparada para esta pregunta. Te enseño el texto vigente donde mejor aparece:";
  }
}
