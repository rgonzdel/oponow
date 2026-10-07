// Comprueba las flashcards contra el texto consolidado OFICIAL del BOE
// (API de datos abiertos): cada cita debe aparecer literalmente en la
// versión vigente del artículo indicado. Lo usa import-flashcards.ts antes
// de importar nada; también se puede ejecutar solo:
//   pnpm --filter @oponow/db verificar-flashcards
import { FLASHCARDS, GRUPOS, NORMAS, type FlashcardSeed } from "./content/flashcards";

const API = "https://www.boe.es/datosabiertos/api/legislacion-consolidada/id";

const ENTIDADES: Record<string, string> = { "&lt;": "<", "&gt;": ">", "&quot;": '"', "&apos;": "'", "&amp;": "&" };

function textoPlano(html: string): string {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&(lt|gt|quot|apos|amp);/g, (m) => ENTIDADES[m])
    .replace(/&#(\d+);/g, (_, n: string) => String.fromCodePoint(Number(n)));
}

/** Compara sin depender de saltos de línea, espacios ni comillas tipográficas. */
export function normalizar(s: string): string {
  return s
    .replace(/[ \s]+/g, " ")
    .replace(/[«»“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .trim();
}

/** Texto vigente (última versión) de cada precepto, por su título. */
async function preceptos(boeId: string): Promise<Map<string, string>> {
  const res = await fetch(`${API}/${boeId}/texto`, { headers: { Accept: "application/xml" } });
  if (!res.ok) throw new Error(`BOE respondió ${res.status} para ${boeId}`);
  const xml = await res.text();
  const mapa = new Map<string, string>();
  for (const m of xml.matchAll(/<bloque id="[^"]+" tipo="precepto" titulo="([^"]*)">([\s\S]*?)<\/bloque>/g)) {
    const versiones = [...m[2].matchAll(/<version[^>]*>([\s\S]*?)<\/version>/g)];
    if (versiones.length) mapa.set(normalizar(m[1]), normalizar(textoPlano(versiones.at(-1)![1])));
  }
  return mapa;
}

export interface ResultadoVerificacion {
  total: number;
  errores: string[];
}

export async function verificarFlashcards(tarjetas: FlashcardSeed[] = FLASHCARDS): Promise<ResultadoVerificacion> {
  const errores: string[] = [];

  const claves = new Set<string>();
  for (const t of tarjetas) {
    if (claves.has(t.clave)) errores.push(`${t.clave}: clave duplicada`);
    claves.add(t.clave);
    if (!t.grupos.length) errores.push(`${t.clave}: no está asociada a ningún tema`);
    for (const g of t.grupos) if (!(g in GRUPOS)) errores.push(`${t.clave}: grupo desconocido ${g}`);
    if (!t.anverso.trim() || !t.reverso.trim()) errores.push(`${t.clave}: anverso o reverso vacío`);
  }

  const normas = [...new Set(tarjetas.map((t) => t.norma))];
  const textos = new Map<string, Map<string, string>>();
  for (const n of normas) textos.set(n, await preceptos(NORMAS[n].boeId));

  for (const t of tarjetas) {
    const articulo = textos.get(t.norma)!.get(normalizar(t.articulo));
    if (!articulo) {
      errores.push(`${t.clave}: no existe "${t.articulo}" en ${NORMAS[t.norma].boeId}`);
    } else if (!articulo.includes(normalizar(t.cita))) {
      errores.push(`${t.clave}: la cita no aparece literal en ${t.articulo} (${NORMAS[t.norma].boeId})`);
    }
  }
  return { total: tarjetas.length, errores };
}

if (require.main === module) {
  verificarFlashcards().then(({ total, errores }) => {
    for (const e of errores) console.error("✗", e);
    console.log(`${total} tarjetas, ${errores.length} errores`);
    process.exit(errores.length ? 1 : 0);
  });
}
