// Comprueba el banco TAI_BANCO_BOE contra el texto consolidado OFICIAL del
// BOE (API de datos abiertos), igual que verificar-flashcards.ts:
// - la cita aparece literal en la última versión del artículo indicado;
// - la clave está en la cita y en la opción correcta, y en ningún distractor;
// - cuatro opciones distintas, ids y enunciados únicos (también frente al
//   primer banco de TAI).
// Lo usa import-banco-tai.ts antes de importar; también se puede ejecutar solo:
//   pnpm --filter @oponow/db verificar-banco-tai-boe
import { NORMAS_BANCO, TAI_BANCO_BOE, type PreguntaBoe } from "./content/tai-banco-boe";
import { TAI_BANCO_PREGUNTAS } from "./content/tai-banco-preguntas";
import { normalizar, preceptos, type ResultadoVerificacion } from "./verificar-flashcards";

const plano = (s: string) => normalizar(s).toLowerCase();

export async function verificarBancoTaiBoe(banco: PreguntaBoe[] = TAI_BANCO_BOE): Promise<ResultadoVerificacion> {
  const errores: string[] = [];
  const ids = new Set(TAI_BANCO_PREGUNTAS.map((p) => p.id));
  const enunciados = new Set(TAI_BANCO_PREGUNTAS.map((p) => plano(p.enunciado)));

  for (const p of banco) {
    if (ids.has(p.id)) errores.push(`${p.id}: id duplicado`);
    ids.add(p.id);
    if (enunciados.has(plano(p.e))) errores.push(`${p.id}: enunciado duplicado`);
    enunciados.add(plano(p.e));
    const opciones = [p.ok, ...p.mal].map(plano);
    if (new Set(opciones).size !== 4 || opciones.some((o) => !o)) errores.push(`${p.id}: opciones vacías o repetidas`);
    const clave = plano(p.clave);
    if (!plano(p.cita).includes(clave)) errores.push(`${p.id}: la clave no está en la cita`);
    if (!plano(p.ok).includes(clave)) errores.push(`${p.id}: la clave no está en la opción correcta`);
    for (const m of p.mal) if (plano(m).includes(clave)) errores.push(`${p.id}: la clave aparece en el distractor «${m}»`);
  }

  const textos = new Map<string, Map<string, string>>();
  for (const n of new Set(banco.map((p) => p.norma))) textos.set(n, await preceptos(NORMAS_BANCO[n].boeId));
  for (const p of banco) {
    const boeId = NORMAS_BANCO[p.norma].boeId;
    const articulo = textos.get(p.norma)!.get(normalizar(p.art));
    if (!articulo) errores.push(`${p.id}: no existe "${p.art}" en ${boeId}`);
    else if (!articulo.includes(normalizar(p.cita))) errores.push(`${p.id}: la cita no aparece literal en ${p.art} (${boeId})`);
  }
  return { total: banco.length, errores };
}

if (require.main === module) {
  verificarBancoTaiBoe().then(({ total, errores }) => {
    for (const e of errores) console.error("✗", e);
    const porTema = new Map<number, number>();
    for (const p of TAI_BANCO_BOE) porTema.set(p.tema, (porTema.get(p.tema) ?? 0) + 1);
    console.log("Por tema:", Object.fromEntries([...porTema].sort((a, b) => a[0] - b[0])));
    console.log(`${total} preguntas, ${errores.length} errores`);
    process.exit(errores.length ? 1 : 0);
  });
}
