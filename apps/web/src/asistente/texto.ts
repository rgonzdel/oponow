// Utilidades de texto en español para Silvia: normalización, tokens, raíces
// y lectura de números escritos con letra («ciento ochenta y dos»), que es
// como numeran sus artículos la LOPJ, la LOTC o el EOMF.

export function normalizar(texto: string): string {
  return texto
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[º°ª]/g, "")
    .replace(/[«»“”"'’]/g, " ");
}

const STOPWORDS = new Set(
  (
    "a al algo algun alguna algunas alguno algunos ante antes aquel aquella aquello aqui asi aun cada como con " +
    "contra cual cuales cualquier cuando cuanto cuanta cuantos cuantas de del desde donde dos e el ella ellas ello " +
    "ellos en entre era eran es esa esas ese eso esos esta estan estas este esto estos fue fueron ha han hasta hay " +
    "la las le les lo los mas me mi mis muy ni no nos nosotros o os otra otras otro otros para pero poco por porque " +
    "que quien quienes se sea sean segun ser si sido siempre sin sino sobre son su sus tambien tan tanto te tiene " +
    "tienen toda todas todo todos tu tus un una unas uno unos y ya yo " +
    // Muletillas de pregunta que no aportan al buscar en normativa.
    "dime explica explicame dice dicen puedes podrias quiero saber sabes cual es seria hacer hace " +
    "pregunta preguntas respuesta ayuda favor gracias hola oye vale ok"
  ).split(/\s+/),
);

export function tokenizar(texto: string): string[] {
  return normalizar(texto)
    .split(/[^a-z0-9ñ/]+/)
    .filter((t) => t.length > 1 || /\d/.test(t));
}

/**
 * Raíz aproximada para búsqueda: quita el plural y recorta. No es un
 * lematizador, pero hace que «plazos», «plazo», «recursos» y «recurrir»
 * caigan en la misma raíz con suficiente frecuencia para un buscador.
 */
export function raiz(token: string): string {
  if (/\d/.test(token)) return token;
  let t = token;
  if (t.length > 4 && /[^aeiou]es$/.test(t)) t = t.slice(0, -2);
  else if (t.length > 3 && t.endsWith("s")) t = t.slice(0, -1);
  return t.length > 7 ? t.slice(0, 7) : t;
}

/** Tokens con significado (sin stopwords) ya reducidos a raíz. */
export function terminos(texto: string): string[] {
  return tokenizar(texto)
    .filter((t) => !STOPWORDS.has(t))
    .map(raiz);
}

/**
 * Arregla erratas de tecleo que rompen palabras clave: un cero en lugar de
 * una «o» dentro de una palabra («articul0», «c0nstitucion»).
 */
export function corregirTecleo(textoNormalizado: string): string {
  return textoNormalizado.replace(/([a-z])0(?=[a-z]|\b)/g, "$1o").replace(/\b0(?=[a-z])/g, "o");
}

/** Distancia de edición (Levenshtein) con corte: devuelve max+1 si la supera. */
export function distancia(a: string, b: string, max: number): number {
  if (Math.abs(a.length - b.length) > max) return max + 1;
  let previa = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const actual = [i];
    let minimo = i;
    for (let j = 1; j <= b.length; j++) {
      const v = Math.min(previa[j] + 1, actual[j - 1] + 1, previa[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
      actual.push(v);
      if (v < minimo) minimo = v;
    }
    if (minimo > max) return max + 1;
    previa = actual;
  }
  return previa[b.length];
}

// ===== Números escritos con letra =====

const UNIDADES: Record<string, number> = {
  cero: 0, un: 1, uno: 1, una: 1, dos: 2, tres: 3, cuatro: 4, cinco: 5, seis: 6, siete: 7, ocho: 8, nueve: 9,
  diez: 10, once: 11, doce: 12, trece: 13, catorce: 14, quince: 15, dieciseis: 16, diecisiete: 17,
  dieciocho: 18, diecinueve: 19, veinte: 20, veintiun: 21, veintiuno: 21, veintiuna: 21, veintidos: 22,
  veintitres: 23, veinticuatro: 24, veinticinco: 25, veintiseis: 26, veintisiete: 27, veintiocho: 28,
  veintinueve: 29,
};
const DECENAS: Record<string, number> = {
  treinta: 30, cuarenta: 40, cincuenta: 50, sesenta: 60, setenta: 70, ochenta: 80, noventa: 90,
};
const CENTENAS: Record<string, number> = {
  cien: 100, ciento: 100, doscientos: 200, doscientas: 200, trescientos: 300, trescientas: 300,
  cuatrocientos: 400, cuatrocientas: 400, quinientos: 500, quinientas: 500, seiscientos: 600,
  seiscientas: 600, setecientos: 700, setecientas: 700, ochocientos: 800, ochocientas: 800,
  novecientos: 900, novecientas: 900,
};

const ORDINALES_UNIDAD: [RegExp, number][] = [
  [/^primer[oa]?$/, 1], [/^segund[oa]$/, 2], [/^tercer[oa]?$/, 3], [/^cuart[oa]$/, 4], [/^quint[oa]$/, 5],
  [/^sext[oa]$/, 6], [/^se?p?tim[oa]$/, 7], [/^octav[oa]$/, 8], [/^(noven[oa]|non[oa])$/, 9],
];
const ORDINALES_DECENA: [string, number][] = [
  ["undecim", 11], ["duodecim", 12], ["decim", 10], ["vigesim", 20], ["trigesim", 30], ["cuadragesim", 40],
  ["quincuagesim", 50], ["sexagesim", 60], ["septuagesim", 70], ["octogesim", 80], ["nonagesim", 90],
  ["centesim", 100],
];

function ordinalSimple(palabra: string): number | null {
  for (const [re, n] of ORDINALES_UNIDAD) if (re.test(palabra)) return n;
  return null;
}

/** «decimotercera» → 13, «trigesima segunda» → 32, «vigesimo» → 20. */
function ordinal(palabras: string[]): number | null {
  let total = 0;
  let algo = false;
  for (const palabra of palabras) {
    let resto = palabra;
    const decena = ORDINALES_DECENA.find(([pref]) => resto.startsWith(pref));
    if (decena) {
      total += decena[1];
      algo = true;
      resto = resto.slice(decena[0].length);
      // «decimo|tercera» lleva vocal de enlace; «decim|octava» no.
      if (resto === "o" || resto === "a" || !resto) continue;
      if (ordinalSimple(resto) === null) resto = resto.replace(/^[oa]/, "");
    }
    const unidad = ordinalSimple(resto);
    if (unidad === null) return algo ? total : null;
    total += unidad;
    algo = true;
  }
  return algo ? total : null;
}

/** «ciento ochenta y dos» → 182; «mil novecientos» → 1900. */
function cardinal(palabras: string[]): number | null {
  let total = 0;
  let actual = 0;
  let algo = false;
  for (const palabra of palabras) {
    if (palabra === "y") continue;
    if (palabra in UNIDADES) actual += UNIDADES[palabra];
    else if (palabra in DECENAS) actual += DECENAS[palabra];
    else if (palabra in CENTENAS) actual += CENTENAS[palabra];
    else if (palabra === "mil") {
      total += (actual || 1) * 1000;
      actual = 0;
    } else return null;
    algo = true;
  }
  return algo ? total + actual : null;
}

/** Interpreta un número escrito con cifras, con letra (cardinal) u ordinal. */
export function leerNumero(texto: string): number | null {
  const limpio = normalizar(texto).trim();
  if (/^\d+$/.test(limpio)) return Number(limpio);
  const palabras = limpio.split(/[\s-]+/).filter(Boolean);
  if (!palabras.length) return null;
  return cardinal(palabras) ?? ordinal(palabras);
}

const PALABRAS_HASTA_29 = [
  "cero", "uno", "dos", "tres", "cuatro", "cinco", "seis", "siete", "ocho", "nueve", "diez", "once", "doce",
  "trece", "catorce", "quince", "dieciséis", "diecisiete", "dieciocho", "diecinueve", "veinte", "veintiuno",
  "veintidós", "veintitrés", "veinticuatro", "veinticinco", "veintiséis", "veintisiete", "veintiocho",
  "veintinueve",
];
const PALABRAS_DECENAS = ["", "", "", "treinta", "cuarenta", "cincuenta", "sesenta", "setenta", "ochenta", "noventa"];

/** 72 → «setenta y dos». Solo hasta 99 (suficiente para plazos y mayorías). */
export function numeroAPalabras(n: number): string {
  if (n < 30) return PALABRAS_HASTA_29[n];
  if (n < 100) {
    const d = Math.floor(n / 10);
    const u = n % 10;
    return u ? `${PALABRAS_DECENAS[d]} y ${PALABRAS_HASTA_29[u]}` : PALABRAS_DECENAS[d];
  }
  return String(n);
}

// ===== Referencias a preceptos =====

export type TipoPrecepto = "art" | "da" | "dt" | "dd" | "df" | "otro";

export interface ClavePrecepto {
  tipo: TipoPrecepto;
  numero: number | null;
  /** bis, ter, quater… */
  sufijo: string;
}

const SUFIJOS = ["bis", "ter", "quater", "quinquies", "sexies", "septies", "octies", "nonies", "decies"];

function tipoDeNombre(n: string): TipoPrecepto {
  // El Código Civil del BOE nombra sus artículos «Art 1», «Art 2»…
  if (/^art(iculo)?\b/.test(n)) return "art";
  if (/^disposicion(es)? adicional/.test(n)) return "da";
  if (/^disposicion(es)? transitoria/.test(n)) return "dt";
  if (/^disposicion(es)? derogatoria/.test(n)) return "dd";
  if (/^disposicion(es)? final/.test(n)) return "df";
  return "otro";
}

/** «Artículo ciento ochenta y dos bis» → { art, 182, "bis" }. */
export function claveDeNombre(nombre: string): ClavePrecepto {
  const n = normalizar(nombre).replace(/[.:]/g, " ").replace(/\s+/g, " ").trim();
  const tipo = tipoDeNombre(n);
  const resto = n
    .replace(/^art(iculo)?\s*/, "")
    .replace(/^disposicion(es)?\s+(adicional|transitoria|derogatoria|final)(es)?\s*/, "")
    .replace(/\[sic\]/g, "")
    .trim();
  const palabras = resto.split(" ").filter(Boolean);
  // «Artículo único» / «Disposición derogatoria única»: sin número propio.
  if (palabras.length === 1 && /^unic[oa]$/.test(palabras[0])) return { tipo, numero: null, sufijo: "unico" };
  let sufijo = "";
  if (palabras.length && SUFIJOS.includes(palabras[palabras.length - 1])) sufijo = palabras.pop()!;
  const numero = palabras.length ? leerNumero(palabras.join(" ")) : tipo === "art" ? null : 1;
  return { tipo, numero, sufijo };
}

export function mismaClave(a: ClavePrecepto, b: ClavePrecepto): boolean {
  return a.tipo === b.tipo && a.numero === b.numero && a.sufijo === b.sufijo;
}

/** Nombre corto para mostrar: «Art. 182 bis», «DA 1.ª». */
export function nombreCorto(clave: ClavePrecepto, nombreOriginal: string): string {
  if (clave.numero === null) return nombreOriginal;
  const s = clave.sufijo ? ` ${clave.sufijo}` : "";
  switch (clave.tipo) {
    case "art":
      return `Art. ${clave.numero}${s}`;
    case "da":
      return `DA ${clave.numero}.ª${s}`;
    case "dt":
      return `DT ${clave.numero}.ª${s}`;
    case "dd":
      return `DD ${clave.numero}.ª${s}`;
    case "df":
      return `DF ${clave.numero}.ª${s}`;
    default:
      return nombreOriginal;
  }
}

export function urlBoe(idNorma: string, bloque?: string): string {
  return `https://www.boe.es/buscar/act.php?id=${idNorma}${bloque ? `#${bloque}` : ""}`;
}

/** Divide en frases sin romper abreviaturas habituales del BOE («art.», «núm.»). */
export function frases(parrafo: string): string[] {
  return parrafo
    .replace(/\b(art|arts|núm|apdo|pág|Sr|Sra|Excmo|Ilmo|etc)\./gi, "$1\u0000")
    .split(/(?<=[.;:])\s+(?=[A-ZÁÉÍÓÚÑ0-9«(])/)
    .map((f) => f.replace(/\u0000/g, ".").trim())
    .filter(Boolean);
}
