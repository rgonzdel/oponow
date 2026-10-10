// Comprueba el banco oficial (content/banco-oficial) contra el texto
// consolidado OFICIAL del BOE, con las mismas reglas que
// verificar-banco-tai-boe.ts: cita literal en la última versión del
// artículo, clave en la cita y en la opción correcta y en ningún distractor,
// cuatro opciones distintas, ids únicos y enunciados únicos por oposición.
//   pnpm --filter @oponow/db verificar-banco-oficial
import { NORMAS_OFICIALES, bancoOficial, preguntasDe, SLUGS_OFICIALES } from "./content/banco-oficial";
import { normalizar, preceptos, type ResultadoVerificacion } from "./verificar-flashcards";

const plano = (s: string) => normalizar(s).toLowerCase();

export async function verificarBancoOficial(): Promise<ResultadoVerificacion> {
  const banco = bancoOficial();
  const errores: string[] = [];
  const ids = new Set<string>();
  for (const p of banco) {
    if (ids.has(p.id)) errores.push(`${p.id}: id duplicado`);
    ids.add(p.id);
    if (!p.destinos.length) errores.push(`${p.id}: sin destino`);
    const opciones = [p.ok, ...p.mal].map(plano);
    if (new Set(opciones).size !== 4 || opciones.some((o) => !o)) errores.push(`${p.id}: opciones vacías o repetidas`);
    const clave = plano(p.clave);
    if (!plano(p.cita).includes(clave)) errores.push(`${p.id}: la clave no está en la cita`);
    if (!plano(p.ok).includes(clave)) errores.push(`${p.id}: la clave no está en la opción correcta`);
    for (const m of p.mal) if (plano(m).includes(clave)) errores.push(`${p.id}: la clave aparece en el distractor «${m}»`);
  }
  for (const slug of SLUGS_OFICIALES) {
    const vistos = new Set<string>();
    for (const p of preguntasDe(slug)) {
      if (vistos.has(plano(p.enunciado))) errores.push(`${slug}/${p.id}: enunciado repetido en la oposición`);
      vistos.add(plano(p.enunciado));
    }
  }

  const textos = new Map<string, Map<string, string>>();
  for (const n of new Set(banco.map((p) => p.norma))) textos.set(n, await preceptos(NORMAS_OFICIALES[n].boeId));
  for (const p of banco) {
    const boeId = NORMAS_OFICIALES[p.norma].boeId;
    const articulo = textos.get(p.norma)!.get(normalizar(p.art));
    if (!articulo) errores.push(`${p.id}: no existe "${p.art}" en ${boeId}`);
    else if (!articulo.includes(normalizar(p.cita))) errores.push(`${p.id}: la cita no aparece literal en ${p.art} (${boeId})`);
  }
  return { total: banco.length, errores };
}

if (require.main === module) {
  verificarBancoOficial().then(({ total, errores }) => {
    for (const e of errores) console.error("✗", e);
    for (const slug of SLUGS_OFICIALES) {
      const ps = preguntasDe(slug);
      const porTema = new Map<number, number>();
      for (const p of ps) porTema.set(p.temaOrden, (porTema.get(p.temaOrden) ?? 0) + 1);
      console.log(`${slug}: ${ps.length}`, Object.fromEntries([...porTema].sort((a, b) => a[0] - b[0])));
    }
    console.log(`${total} preguntas distintas, ${errores.length} errores`);
    process.exit(errores.length ? 1 : 0);
  });
}
