// Detección de intención y extracción de datos de la consulta. Todo con
// reglas sobre el texto normalizado: no hay modelo de lenguaje detrás, así
// que las reglas priorizan no inventar (ante la duda, se busca en el texto
// de las normas y se enseña lo encontrado).
import type { ContextoConversacion, FuenteNorma, OposicionCatalogo } from "../tipos";
import { leerNumero, normalizar, type ClavePrecepto } from "../texto";

export type Matiz = "plazo" | "quien" | "definicion" | "requisitos" | "general";
export type AspectoOposicion = "requisitos" | "temario" | "examen" | "grupo" | "general";

export type Intencion =
  | { tipo: "saludo" }
  | { tipo: "ayuda" }
  | { tipo: "gracias" }
  | { tipo: "precepto"; norma: string | null; clave: ClavePrecepto; normaSupuesta: boolean }
  | { tipo: "desplazar"; paso: 1 | -1 }
  | { tipo: "norma"; norma: string }
  | { tipo: "test"; norma: string | null; clave: ClavePrecepto | null }
  | { tipo: "oposicion"; id: string; aspecto: AspectoOposicion; explicita: boolean }
  | { tipo: "listaOposiciones"; filtros: FiltrosOposicion }
  | { tipo: "busqueda"; norma: string | null; matiz: Matiz; comparar: boolean };

export interface FiltrosOposicion {
  grupos: string[];
  ambitos: string[];
  texto: string[];
}

function contiene(q: string, frase: string): boolean {
  const f = frase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`(^|[^a-z0-9])${f}($|[^a-z0-9])`).test(q);
}

/** Norma mencionada (el alias más largo que aparece en la consulta). */
export function detectarNorma(q: string, fuentes: FuenteNorma[]): string | null {
  let mejor: { clave: string; largo: number } | null = null;
  for (const f of fuentes) {
    for (const alias of f.alias) {
      if (contiene(q, alias) && (!mejor || alias.length > mejor.largo)) mejor = { clave: f.clave, largo: alias.length };
    }
  }
  return mejor?.clave ?? null;
}

export function detectarOposicion(q: string, catalogo: OposicionCatalogo[]): string | null {
  let mejor: { id: string; largo: number } | null = null;
  for (const o of catalogo) {
    for (const alias of o.alias) {
      if (contiene(q, alias) && (!mejor || alias.length > mejor.largo)) mejor = { id: o.id, largo: alias.length };
    }
  }
  return mejor?.id ?? null;
}

const SUFIJO = "(bis|ter|quater|quinquies|sexies|septies|octies|nonies|decies)";
const PALABRA_NUMERO =
  "(?:un|uno|una|dos|tres|cuatro|cinco|seis|siete|ocho|nueve|diez|once|doce|trece|catorce|quince|dieci\\w+|veinte|veinti\\w+|treinta|cuarenta|cincuenta|sesenta|setenta|ochenta|noventa|cien|ciento|\\w+cientos|\\w+cientas|quinientos|mil|y|primer\\w*|segund\\w+|tercer\\w*|cuart\\w+|quint\\w+|sext\\w+|s[eé]ptim\\w+|octav\\w+|noven\\w+|d[eé]cim\\w*|und[eé]cim\\w+|duod[eé]cim\\w+|vig[eé]sim\\w+|trig[eé]sim\\w+|cuadrag[eé]sim\\w+|unic[oa])";

/** «artículo 24», «art. 103 bis», «artículo ciento ochenta y dos», «DA 1.ª»… */
export function detectarPrecepto(q: string, hayNorma: boolean): ClavePrecepto | null {
  let m = new RegExp(`\\b(?:articulos?|arts?)\\.?\\s*(\\d+)(?:\\s*${SUFIJO})?`).exec(q);
  if (m) return { tipo: "art", numero: Number(m[1]), sufijo: m[2] ?? "" };

  m = new RegExp(`\\barticulos?\\s+((?:${PALABRA_NUMERO}\\b\\s*)+)`).exec(q);
  if (m) {
    const palabras = m[1].trim().split(/\s+/);
    let sufijo = "";
    if (new RegExp(`^${SUFIJO}$`).test(palabras[palabras.length - 1] ?? "")) sufijo = palabras.pop()!;
    while (palabras.length && palabras[palabras.length - 1] === "y") palabras.pop();
    if (palabras.length === 1 && /^unic[oa]$/.test(palabras[0])) return { tipo: "art", numero: null, sufijo: "unico" };
    for (let n = palabras.length; n > 0; n--) {
      const v = leerNumero(palabras.slice(0, n).join(" "));
      if (v !== null) return { tipo: "art", numero: v, sufijo };
    }
  }

  m = /\b(?:disposicion|disp\.?)\s+(adicional|transitoria|final|derogatoria)\s+(\d+|[a-z]+(?:\s+[a-z]+)?)/.exec(q);
  if (m) {
    const tipo = ({ adicional: "da", transitoria: "dt", final: "df", derogatoria: "dd" } as const)[m[1] as "adicional"];
    if (/^unic[oa]$/.test(m[2])) return { tipo, numero: null, sufijo: "unico" };
    const partes = m[2].split(/\s+/);
    for (let n = partes.length; n > 0; n--) {
      const v = leerNumero(partes.slice(0, n).join(" "));
      if (v !== null) return { tipo, numero: v, sufijo: "" };
    }
  }
  m = /\b(da|dt|df|dd)\s*(\d+)/.exec(q);
  if (m) return { tipo: m[1] as "da", numero: Number(m[2]), sufijo: "" };

  // «el 24 de la constitución», «el 14 ce»: solo si se nombra la norma.
  if (hayNorma) {
    m = new RegExp(`\\b(?:el|del|al)\\s+(\\d+)(?:\\s*${SUFIJO})?\\s+(?:de\\s+la|de\\s+el|del|de|ce|lopj|lec|lecrim|trebep|cp|cc)\\b`).exec(q);
    if (m) return { tipo: "art", numero: Number(m[1]), sufijo: m[2] ?? "" };
    m = new RegExp(`^(\\d+)(?:\\s*${SUFIJO})?\\s+\\w`).exec(q);
    if (m) return { tipo: "art", numero: Number(m[1]), sufijo: m[2] ?? "" };
  }
  return null;
}

const RE_TEST = /\b(ponme a prueba|hazme (un |una )?(test|pregunta|preguntas|examen)|preguntame|examiname|quiero (hacer )?(un )?test|test (de|sobre|del)|preguntas (de test )?(de|sobre)|practicar|ponme (un )?test)\b/;
const RE_LISTA = /\b(que oposiciones|cuales son las oposiciones|lista de oposiciones|oposiciones (hay|existen|puedo|de|con|para|del)|que puedo opositar|a que puedo presentarme|opositar con)\b/;
const RE_NORMA_INFO = /\b(que es|estructura|de que trata|indice|esquema|titulos de|partes de|cuantos articulos|como se organiza|que regula|resumen de|contenido de|hablame de|explicame)\b/;

function aspectoDe(q: string): AspectoOposicion {
  if (/\b(requisit|titulacion|titulo|que necesito|estudios|edad|nacionalidad|puedo presentarme)/.test(q)) return "requisitos";
  if (/\b(temario|temas|que entra|que estudiar|que se estudia|materias|normativa)/.test(q)) return "temario";
  if (/\b(examen|ejercicio|pruebas|prueba|como es la oposicion|penaliza)/.test(q)) return "examen";
  if (/\b(grupo|subgrupo|nivel|categoria)/.test(q)) return "grupo";
  return "general";
}

function filtrosLista(q: string): FiltrosOposicion {
  const grupos = new Set<string>();
  if (/\b(eso|secundaria obligatoria|graduado escolar)\b/.test(q)) grupos.add("C2");
  if (/\b(bachiller|bachillerato|fp medio|grado medio|tecnico medio)\b/.test(q)) grupos.add("C1");
  if (/\b(tecnico superior|fp superior|grado superior)\b/.test(q)) grupos.add("B");
  if (/\b(carrera|universidad|universitario|grado universitario|licenciatura|diplomatura)\b/.test(q)) {
    grupos.add("A1");
    grupos.add("A2");
  }
  for (const g of ["a1", "a2", "c1", "c2"]) if (contiene(q, g)) grupos.add(g.toUpperCase());
  const ambitos = new Set<string>();
  const mapa: [RegExp, string][] = [
    [/\bjusticia|juzgado|judicial/, "Justicia"],
    [/\bhacienda|tributari|aeat/, "Hacienda"],
    [/\bpolicia|guardia civil|seguridad|prisiones|penitenciari/, "Seguridad"],
    [/\beducacion|docente|profesor|maestro|ensenanza/, "Educación"],
    [/\bsanidad|sanitari|hospital|salud|enfermer/, "Sanidad"],
    [/\bayuntamiento|local|municipal|diputacion/, "Administración local"],
    [/\bautonomic|comunidad autonoma|junta de|generalitat|xunta|gobierno de/, "Comunidades autónomas"],
    [/\bestado|age|ministerio/, "Administración General del Estado"],
    [/\bcorreos/, "Correos"],
  ];
  for (const [re, ambito] of mapa) if (re.test(q)) ambitos.add(ambito);
  return { grupos: [...grupos], ambitos: [...ambitos], texto: [] };
}

function matizDe(q: string): Matiz {
  if (/\b(plazo|plazos|cuanto tiempo|cuantos dias|cuantos meses|cuantos anos|en que plazo|cuando prescribe|prescrib|caduc|dentro de cuanto|hasta cuando)\b/.test(q)) return "plazo";
  if (/\b(quien|que organo|a quien corresponde|quienes|competente para)\b/.test(q)) return "quien";
  if (/\b(requisito|requisitos|que se necesita|que hace falta)\b/.test(q)) return "requisitos";
  if (/\b(que es|que son|que significa|concepto|definicion|define|en que consiste)\b/.test(q)) return "definicion";
  return "general";
}

export function detectarIntencion(
  texto: string,
  fuentes: FuenteNorma[],
  catalogo: OposicionCatalogo[],
  contexto: ContextoConversacion,
): Intencion {
  const q = normalizar(texto).replace(/[¿?¡!]/g, " ").replace(/\s+/g, " ").trim();
  const palabras = q.split(" ").filter(Boolean);

  if (palabras.length <= 4 && /^(hola|buenas|buenos dias|buenas tardes|buenas noches|hey|ey|que tal|saludos)\b/.test(q)) return { tipo: "saludo" };
  if (/\b(que puedes hacer|como funcionas|quien eres|que eres|que sabes|como te uso|en que me puedes ayudar)\b/.test(q) || q === "ayuda") return { tipo: "ayuda" };
  if (palabras.length <= 4 && /^(gracias|muchas gracias|genial|perfecto|ok gracias|vale gracias|mil gracias)\b/.test(q)) return { tipo: "gracias" };

  const norma = detectarNorma(q, fuentes);
  const clave = detectarPrecepto(q, norma !== null);

  if (RE_TEST.test(q)) {
    return { tipo: "test", norma: norma ?? (clave ? contexto.ultimaNorma ?? null : null), clave };
  }

  if (clave) {
    if (norma) return { tipo: "precepto", norma, clave, normaSupuesta: false };
    if (contexto.ultimaNorma) return { tipo: "precepto", norma: contexto.ultimaNorma, clave, normaSupuesta: true };
    return { tipo: "precepto", norma: null, clave, normaSupuesta: true };
  }

  if (contexto.ultimoPrecepto !== undefined && /\b(siguiente|el proximo|y el proximo|continua|sigue)\b/.test(q) && palabras.length <= 5) return { tipo: "desplazar", paso: 1 };
  if (contexto.ultimoPrecepto !== undefined && /\b(anterior|el de antes)\b/.test(q) && palabras.length <= 5) return { tipo: "desplazar", paso: -1 };

  if (RE_LISTA.test(q)) return { tipo: "listaOposiciones", filtros: filtrosLista(q) };

  const oposicion = detectarOposicion(q, catalogo);
  const hablaDeOposicion = /\b(oposicion|oposiciones|opositar|opositor|plazas|convocatoria|requisitos|temario|examen|titulacion|grupo|subgrupo|como acceder|como entrar|sueldo)\b/.test(q);
  if (oposicion && (hablaDeOposicion || !norma)) {
    // Si además nombra una norma y la pregunta no es sobre la oposición
    // («ministerio fiscal» es norma y también carrera), manda la norma.
    if (!(norma && !hablaDeOposicion)) return { tipo: "oposicion", id: oposicion, aspecto: aspectoDe(q), explicita: hablaDeOposicion };
  }

  const sinNorma = norma ? q : "";
  if (norma && (RE_NORMA_INFO.test(q) || palabras.length <= 4)) {
    // «ley 39/2015», «estructura de la LOPJ», «qué es el TREBEP»: ficha de la norma,
    // salvo que pregunte algo concreto («qué es el silencio en la ley 39/2015»).
    const resto = sinNorma.replace(/\b(que es|estructura|de que trata|indice|esquema|resumen|contenido|hablame|explicame|de la|del|de|la|el|ley|los|las)\b/g, " ").trim();
    const fuente = fuentes.find((f) => f.clave === norma)!;
    const aliasRestantes = fuente.alias.reduce((s, a) => s.replace(a, " "), resto).replace(/\s+/g, " ").trim();
    if (!aliasRestantes || aliasRestantes.split(" ").length <= 1) return { tipo: "norma", norma };
  }

  return {
    tipo: "busqueda",
    norma,
    matiz: matizDe(q),
    comparar: /\b(diferencia|diferencias|distingue|distinguir|comparar|compara|versus|vs|frente a)\b/.test(q),
  };
}
