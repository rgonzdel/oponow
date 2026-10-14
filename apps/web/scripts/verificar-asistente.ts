// Verifica el conocimiento de Silvia contra el texto del BOE descargado
// (src/asistente/normativa/textos). Falla si:
//  - una cita no aparece LITERALMENTE en el precepto que dice citar;
//  - un precepto o una norma citada no existe;
//  - una oposición se marca como verificada sin cita que lo respalde;
//  - una ficha relaciona con otra que no existe o repite id.
//
// Uso: node scripts/verificar-asistente.ts   (Node 22.6+ ejecuta TypeScript)
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const raiz = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const cargar = (ruta: string) => import(pathToFileURL(resolve(raiz, ruta)).href);

const { FICHAS } = await cargar("src/asistente/conocimiento/fichas.ts");
const { OPOSICIONES_CATALOGO } = await cargar("src/asistente/conocimiento/oposiciones.ts");
const fuentes: { clave: string }[] = JSON.parse(readFileSync(resolve(raiz, "src/asistente/normativa/fuentes.json"), "utf8"));

interface Cita { norma: string; precepto: string; fragmento: string }

const textos = new Map<string, Map<string, string>>();
function texto(norma: string, precepto: string): string | null {
  if (!textos.has(norma)) {
    if (!fuentes.some((f) => f.clave === norma)) return null;
    const d = JSON.parse(readFileSync(resolve(raiz, `src/asistente/normativa/textos/${norma}.json`), "utf8"));
    textos.set(norma, new Map(d.preceptos.map((p: { b: string; p: string[] }) => [p.b, p.p.join("\n")])));
  }
  return textos.get(norma)!.get(precepto) ?? null;
}

const errores: string[] = [];
let citasOk = 0;

function comprobarCitas(origen: string, citas: Cita[]) {
  for (const c of citas) {
    const t = texto(c.norma, c.precepto);
    if (t === null) {
      errores.push(`${origen}: no existe ${c.norma}:${c.precepto}`);
      continue;
    }
    // Comparación literal; solo se toleran diferencias de espacios en blanco.
    const norm = (s: string) => s.replace(/\s+/g, " ").trim();
    if (!norm(t).includes(norm(c.fragmento))) {
      errores.push(`${origen}: la cita no aparece literal en ${c.norma}:${c.precepto}\n    «${c.fragmento}»`);
    } else citasOk++;
  }
}

const ids = new Set<string>();
for (const f of FICHAS) {
  if (ids.has(f.id)) errores.push(`ficha duplicada: ${f.id}`);
  ids.add(f.id);
  if (!f.citas.length) errores.push(`ficha ${f.id}: sin citas`);
  comprobarCitas(`ficha ${f.id}`, f.citas);
}
for (const f of FICHAS) {
  for (const r of f.relacionadas ?? []) if (!ids.has(r)) errores.push(`ficha ${f.id}: relacionada inexistente ${r}`);
}

const idsOp = new Set<string>();
for (const o of OPOSICIONES_CATALOGO) {
  if (idsOp.has(o.id)) errores.push(`oposición duplicada: ${o.id}`);
  idsOp.add(o.id);
  if ((o.grupoVerificado || o.titulacionVerificada) && !o.citas.length) {
    errores.push(`oposición ${o.id}: marcada como verificada sin citas`);
  }
  for (const n of o.normasClave) if (!fuentes.some((f) => f.clave === n)) errores.push(`oposición ${o.id}: norma desconocida ${n}`);
  comprobarCitas(`oposición ${o.id}`, o.citas);
}

console.log(`Fichas: ${FICHAS.length} · Oposiciones: ${OPOSICIONES_CATALOGO.length} · Citas literales comprobadas: ${citasOk}`);
if (errores.length) {
  console.error(`\n${errores.length} error(es):\n- ${errores.join("\n- ")}`);
  process.exit(1);
}
console.log("Todo el conocimiento de Silvia coincide con el texto consolidado del BOE.");
