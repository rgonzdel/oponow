// Ensambla el banco oficial por oposición: preguntas nuevas de cada bloque
// normativo (POOLS) más preguntas del banco BOE de TAI que corresponden a
// temas de otras oposiciones (REUTILIZADAS: la misma Constitución entra en
// el tema 1 de Auxiliar, Administrativo y TAI). La posición de la respuesta
// correcta se rota dentro de cada oposición para que quede equilibrada.
import type { PreguntaBancoTai } from "../tai-banco-preguntas";
import { TAI_BANCO_BOE, type PreguntaBoe } from "../tai-banco-boe";
import { NORMAS_OFICIALES, type Destino, type PreguntaOficial } from "./tipos";
import { POOLS } from "./pools";

export { NORMAS_OFICIALES } from "./tipos";
export type { Destino, PreguntaOficial } from "./tipos";

const T = (prefijo: string) => TAI_BANCO_BOE.filter((p) => p.id.startsWith(prefijo)).map((p) => p.id);

/** Preguntas del banco BOE de TAI que también van a temas de otras oposiciones. */
const REUTILIZADAS: { ids: string[]; destino: Destino }[] = [
  { ids: T("tai-boe-t01-"), destino: ["auxiliar-administrativo", 1] },
  { ids: [...T("tai-boe-t03-"), ...T("tai-boe-t10-"), ...T("tai-boe-t11-")], destino: ["auxiliar-administrativo", 2] },
  { ids: T("tai-boe-t04-"), destino: ["auxiliar-administrativo", 3] },
  { ids: T("tai-boe-t01-"), destino: ["administrativo-estado", 1] },
  { ids: T("tai-boe-t04-"), destino: ["administrativo-estado", 3] },
  { ids: ["tai-boe-t05-17", "tai-boe-t05-18"], destino: ["administrativo-estado", 16] },
  { ids: ["tai-boe-t08-07", "tai-boe-t08-08", "tai-boe-t08-11", "tai-boe-t08-12", "tai-boe-t08-13"], destino: ["administrativo-estado", 33] },
  { ids: T("tai-boe-t16-0").slice(0, 6), destino: ["gestion-sistemas-informacion", 5] },
];

/**
 * Bloques del banco oficial que también entran en el temario de TAI: se
 * añaden como destino extra (mismas preguntas, ya verificadas). No repiten
 * los artículos que pregunta el banco BOE de TAI (Ley 39/2015 arts. 13 y 53,
 * Ley 40/2015 arts. 3 y 140, LGP arts. 32, 34 y 37, ENS arts. 5, 6, 12, 31 y
 * 40, LOPDGDD arts. 5, 7, 32 y 37).
 */
const FIRMA_TAI = new Set(["of-fi-07", "of-fi-08", "of-fi-09", "of-fi-10", "of-fi-11", "of-fi-12", "of-fi-13", "of-fi-14", "of-fi-15", "of-fi-16", "of-fi-17", "of-fi-41", "of-fi-42", "of-fi-44", "of-fi-46", "of-fi-47"]);
function destinoTai(id: string): Destino | null {
  if (id.startsWith("of-lpac-") || id.startsWith("of-at-") || FIRMA_TAI.has(id)) return ["tai", 2];
  if (id.startsWith("of-age-") || ["of-fu-19", "of-fu-20", "of-fu-21"].includes(id)) return ["tai", 5];
  if (id.startsWith("of-gp-")) return ["tai", 8];
  if (id.startsWith("of-dp-")) return ["tai", 4];
  if (id.startsWith("of-ci-") || id.startsWith("of-pd-")) return ["tai", 16];
  return null;
}

function desdeTai(p: PreguntaBoe, destinos: Destino[]): PreguntaOficial {
  const { tema: _tema, ...resto } = p;
  return { ...resto, destinos };
}

/**
 * Ampliación al programa de la convocatoria BOE-A-2025-26262: preguntas ya
 * verificadas (del banco oficial o del banco BOE de TAI) que también entran
 * en otros temas de Auxiliar y Administrativo (ver temas-oficiales.ts). Van
 * en una lista aparte, al final de cada oposición, para que la rotación de la
 * respuesta correcta de las preguntas ya importadas no cambie.
 */
const AUX = "auxiliar-administrativo";
const ADM = "administrativo-estado";
const num = (id: string) => Number(id.slice(id.lastIndexOf("-") + 1));
function ampliacion(p: { id: string; norma: string; art: string }): Destino[] {
  const { id, norma } = p;
  const d: Destino[] = [];
  const pre = (x: string) => id.startsWith(x);
  if (pre("t3-tc-") || id === "t3-cg-13") d.push([AUX, 2], [ADM, 1]);
  if (pre("tai-boe-t10-") || pre("tai-boe-t11-") || pre("of-dp-")) d.push([ADM, 1]);
  if (pre("tai-boe-t03-")) d.push([ADM, 2]);
  if (pre("t3-ce-")) d.push([AUX, 3], [ADM, 3]);
  if (pre("t3-pj-") || pre("tai-boe-t07-")) d.push([AUX, 4], [ADM, 4]);
  if (pre("t3-lg-") || (pre("t3-cg-") && num(id) <= 3)) d.push([AUX, 5], [ADM, 5]);
  if (pre("tai-boe-t05-") && norma !== "LG") d.push([AUX, 5], [ADM, 5]);
  if ((pre("t3-cg-") && num(id) >= 6 && num(id) <= 12) || pre("tai-boe-t06-") || pre("t3-ae-")) d.push([ADM, 5]);
  if (pre("of-c3-") && norma === "LTRANSP") d.push([AUX, 7], [ADM, 7]);
  if (pre("of-age-")) d.push([ADM, 8]);
  if (pre("t3-te-") || pre("tai-boe-t09-")) d.push([AUX, 9], norma === "LBRL" ? [ADM, 10] : [ADM, 9]);
  if (pre("of-at-")) d.push([ADM, 12]);
  if (pre("of-pd-") || (pre("tai-boe-t16-") && norma === "LOPDGDD")) d.push([AUX, 12], [ADM, 15]);
  if (pre("of-gp-") || pre("t3-gp-") || (pre("tai-boe-t08-") && (norma === "LGP" || p.art === "Artículo 134"))) d.push([AUX, 15]);
  if (pre("t3-gp-")) d.push([ADM, 33]);
  if (pre("of-c3-") && norma === "LOIGUALDAD") d.push([AUX, 16], [ADM, 22]);
  if (pre("of-fi-") && (norma === "RD203" || (norma === "LRJSP" && ["Artículo 38", "Artículo 39"].includes(p.art)) || (norma === "LPAC" && num(id) <= 6))) d.push([AUX, 20], [ADM, 14]);
  return d;
}

function bancoBase(): PreguntaOficial[] {
  const extra = new Map<string, Destino[]>();
  for (const r of REUTILIZADAS) for (const id of r.ids) extra.set(id, [...(extra.get(id) ?? []), r.destino]);
  const reutilizadas = TAI_BANCO_BOE.filter((p) => extra.has(p.id)).map((p) => desdeTai(p, extra.get(p.id)!));
  const pools = POOLS.map((p) => {
    const tai = destinoTai(p.id);
    return tai ? { ...p, destinos: [...p.destinos, tai] } : p;
  });
  return [...pools, ...reutilizadas];
}

const clave = (d: Destino) => d.join(":");

/** Copias de las preguntas que se amplían, solo con sus destinos nuevos. */
function ampliados(base: PreguntaOficial[]): PreguntaOficial[] {
  const ya = new Map(base.map((p) => [p.id, new Set(p.destinos.map(clave))]));
  const candidatos = [...base, ...TAI_BANCO_BOE.filter((p) => !ya.has(p.id)).map((p) => desdeTai(p, []))];
  return candidatos.flatMap((p) => {
    const d = ampliacion(p).filter((x) => !ya.get(p.id)?.has(clave(x)));
    return d.length ? [{ ...p, destinos: d }] : [];
  });
}

/** Todas las preguntas del banco oficial (nuevas, reutilizadas de TAI y ampliadas). */
export function bancoOficial(): PreguntaOficial[] {
  const base = bancoBase();
  const porId = new Map(base.map((p) => [p.id, p]));
  for (const a of ampliados(base)) {
    const p = porId.get(a.id);
    porId.set(a.id, p ? { ...p, destinos: [...p.destinos, ...a.destinos] } : a);
  }
  return [...porId.values()];
}

export const SLUGS_OFICIALES = ["auxiliar-administrativo", "administrativo-estado", "gestion-sistemas-informacion", "correos", "tai"] as const;

/** Preguntas de una oposición, listas para importar (con su tema). */
export function preguntasDe(slug: string): PreguntaBancoTai[] {
  const base = bancoBase();
  const lista = [...base, ...ampliados(base)].flatMap((p) =>
    p.destinos.filter(([s]) => s === slug).map(([, tema]) => ({ p, tema })),
  );
  return lista.map(({ p, tema }, i) => {
    const posicion = i % 4;
    const opciones = [...p.mal];
    opciones.splice(posicion, 0, p.ok);
    const norma = NORMAS_OFICIALES[p.norma];
    const articulo = p.art.charAt(0).toLowerCase() + p.art.slice(1);
    return {
      id: p.id,
      temaOrden: tema,
      fuente: `${norma.corto} ${articulo} (${norma.boeId})`,
      enunciado: p.e,
      opciones,
      respuestaCorrecta: posicion,
      justificacionIa: `${p.j ? p.j + " " : ""}El ${articulo} ${norma.nombre.startsWith("el ") ? "del " + norma.nombre.slice(3) : "de " + norma.nombre} dispone: «${p.cita.replace(/\.$/, "")}».`,
      mnemotecnia: p.m ?? "",
      dificultad: p.d,
    };
  });
}
