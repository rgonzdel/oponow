// Genera preguntas tipo test a partir del texto LITERAL de un precepto: se
// oculta un dato (plazo, número, mayoría) y se ofrecen distractores que NO
// aparecen en ese mismo precepto con la misma unidad, para que ninguno
// pueda ser también correcto. Si el precepto no tiene datos así, se pregunta
// por su rúbrica frente a las de otros artículos de la misma norma.
import type { FuenteRespuesta, PreguntaGenerada } from "../tipos";
import { frases, leerNumero, normalizar, numeroAPalabras } from "../texto";

interface Familia {
  re: RegExp;
  singular: string;
  plural: string;
  femenina: boolean;
  valores: number[];
}

const FAMILIAS: Familia[] = [
  { re: /^d[ií]as? h[aá]biles$/i, singular: "día hábil", plural: "días hábiles", femenina: false, valores: [3, 5, 10, 15, 20, 30] },
  { re: /^d[ií]as? naturales$/i, singular: "día natural", plural: "días naturales", femenina: false, valores: [3, 5, 10, 15, 20, 30] },
  { re: /^d[ií]as?$/i, singular: "día", plural: "días", femenina: false, valores: [3, 5, 10, 15, 20, 30, 60] },
  { re: /^mes(es)?$/i, singular: "mes", plural: "meses", femenina: false, valores: [1, 2, 3, 4, 6, 12] },
  { re: /^años?$/i, singular: "año", plural: "años", femenina: false, valores: [1, 2, 3, 4, 5, 9, 10, 15, 20] },
  { re: /^horas?$/i, singular: "hora", plural: "horas", femenina: true, valores: [12, 24, 48, 72, 96] },
  { re: /^semanas?$/i, singular: "semana", plural: "semanas", femenina: true, valores: [1, 2, 4, 6, 8, 16] },
  { re: /^miembros$/i, singular: "miembro", plural: "miembros", femenina: false, valores: [] },
  { re: /^Diputados$/, singular: "Diputado", plural: "Diputados", femenina: false, valores: [] },
  { re: /^Senadores$/, singular: "Senador", plural: "Senadores", femenina: false, valores: [] },
  { re: /^vocales$/i, singular: "vocal", plural: "vocales", femenina: false, valores: [] },
  { re: /^por ciento$/i, singular: "por ciento", plural: "por ciento", femenina: false, valores: [10, 20, 25, 30, 40, 50, 60, 75] },
];

const PALABRAS_NUM = Array.from({ length: 100 }, (_, i) => numeroAPalabras(i + 1))
  .concat(["un", "una", "cien"])
  .sort((a, b) => b.length - a.length)
  .map((p) => p.replace(/[áéíóú]/g, (c) => `[${c}${"aeiou"["áéíóú".indexOf(c)]}]`));

const RE_DATO = new RegExp(
  `\\b(\\d{1,3}|${PALABRAS_NUM.join("|")})\\s+(d[ií]as? h[aá]biles|d[ií]as? naturales|d[ií]as?|meses|mes|años?|horas?|semanas?|miembros|Diputados|Senadores|vocales|por ciento)\\b`,
  "gi",
);
const MAYORIAS = ["mayoría absoluta", "mayoría simple", "tres quintos", "dos tercios"];
const RE_MAYORIA = /\b(mayor[ií]a absoluta|mayor[ií]a simple|tres quintos|dos tercios)\b/gi;

/** PRNG determinista (mismas preguntas para el mismo precepto). */
function aleatorio(semilla: string) {
  let h = 2166136261;
  for (const c of semilla) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  return () => {
    h = Math.imul(h ^ (h >>> 15), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return ((h ^= h >>> 16) >>> 0) / 4294967296;
  };
}

function barajar<T>(lista: T[], rnd: () => number): T[] {
  const r = [...lista];
  for (let i = r.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [r[i], r[j]] = [r[j], r[i]];
  }
  return r;
}

function formatear(n: number, familia: Familia, enCifras: boolean): string {
  const unidad = n === 1 ? familia.singular : familia.plural;
  if (enCifras) return `${n} ${unidad}`;
  const num = n === 1 ? (familia.femenina ? "una" : "un") : numeroAPalabras(n);
  return `${num} ${unidad}`;
}

function recortar(frase: string, marca: string): string {
  if (frase.length <= 340) return frase;
  const i = frase.indexOf(marca);
  const ini = Math.max(0, i - 200);
  const fin = Math.min(frase.length, i + marca.length + 120);
  return `${ini > 0 ? "…" : ""}${frase.slice(ini, fin)}${fin < frase.length ? "…" : ""}`;
}

export interface PreceptoParaTest {
  nombre: string;
  etiquetaNorma: string;
  rubrica: string | null;
  parrafos: string[];
  fuente: FuenteRespuesta;
  /** Rúbricas de otros preceptos de la misma norma, para el plan B. */
  otrasRubricas: string[];
}

export function generarPreguntas(p: PreceptoParaTest, maximo = 3): PreguntaGenerada[] {
  const rnd = aleatorio(p.fuente.url);
  const texto = p.parrafos.join(" ");
  const preguntas: PreguntaGenerada[] = [];
  const cabecera = `Según el ${p.nombre.toLowerCase().startsWith("art") ? p.nombre.replace(/^Art[íi]culo/i, "artículo") : p.nombre} (${p.etiquetaNorma})`;

  // Valores que ya aparecen en el precepto, por unidad: nunca serán distractores.
  const presentes = new Map<Familia, Set<number>>();
  for (const m of texto.matchAll(RE_DATO)) {
    const familia = FAMILIAS.find((f) => f.re.test(m[2]));
    const n = leerNumero(m[1]);
    if (familia && n !== null) {
      if (!presentes.has(familia)) presentes.set(familia, new Set());
      presentes.get(familia)!.add(n);
    }
  }
  const mayoriasPresentes = new Set([...texto.matchAll(RE_MAYORIA)].map((m) => normalizar(m[1])));

  const candidatos: PreguntaGenerada[] = [];
  for (const parrafo of p.parrafos) {
    for (const frase of frases(parrafo)) {
      for (const m of frase.matchAll(RE_DATO)) {
        const familia = FAMILIAS.find((f) => f.re.test(m[2]));
        const n = leerNumero(m[1]);
        if (!familia || n === null) continue;
        const enCifras = /^\d/.test(m[1]);
        const usados = presentes.get(familia) ?? new Set();
        let posibles = familia.valores.length
          ? familia.valores
          : [n - 4, n - 2, n + 2, n + 3, n + 5, n * 2].filter((v) => v > 0);
        posibles = posibles.filter((v) => v !== n && !usados.has(v));
        if (posibles.length < 3) continue;
        const distractores = barajar(posibles, rnd).slice(0, 3);
        const correcta = formatear(n, familia, enCifras);
        const opciones = barajar([correcta, ...distractores.map((v) => formatear(v, familia, enCifras))], rnd);
        candidatos.push({
          enunciado: `${cabecera}: «${recortar(frase.replace(m[0], "_____"), "_____")}»`,
          opciones,
          correcta: opciones.indexOf(correcta),
          explicacion: frase,
          fuente: p.fuente,
        });
      }
      for (const m of frase.matchAll(RE_MAYORIA)) {
        const real = m[1];
        const otras = MAYORIAS.filter((x) => !mayoriasPresentes.has(normalizar(x)));
        if (otras.length < 3) continue;
        const opciones = barajar([real, ...barajar(otras, rnd).slice(0, 3)], rnd);
        candidatos.push({
          enunciado: `${cabecera}: «${recortar(frase.replace(m[0], "_____"), "_____")}»`,
          opciones,
          correcta: opciones.indexOf(real),
          explicacion: frase,
          fuente: p.fuente,
        });
      }
    }
  }
  preguntas.push(...barajar(candidatos, rnd).slice(0, maximo));

  // Plan B: ¿de qué trata este artículo?
  if (!preguntas.length && p.rubrica) {
    const otras = barajar(
      [...new Set(p.otrasRubricas.filter((r) => normalizar(r) !== normalizar(p.rubrica!)))],
      rnd,
    ).slice(0, 3);
    if (otras.length === 3) {
      const opciones = barajar([p.rubrica, ...otras], rnd);
      preguntas.push({
        enunciado: `¿Qué regula el ${p.nombre.replace(/^Art[íi]culo/i, "artículo")} (${p.etiquetaNorma})?`,
        opciones,
        correcta: opciones.indexOf(p.rubrica),
        explicacion: `${p.nombre}. ${p.rubrica} ${p.parrafos[0] ?? ""}`.slice(0, 400),
        fuente: p.fuente,
      });
    }
  }
  return preguntas;
}
