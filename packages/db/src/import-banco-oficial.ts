import path from "node:path";
import { config } from "dotenv";
import { and, eq, inArray } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";
import { preguntasDe, SLUGS_OFICIALES } from "./content/banco-oficial";
import { verificarBancoOficial } from "./verificar-banco-oficial";
import { sslModeFor } from "./ssl";

config({ path: path.resolve(__dirname, "../../../.env") });

// Importa el banco oficial (content/banco-oficial) en los temas ya sembrados
// de cada oposición. Igual que import-banco-tai.ts: no crea temas (si falta
// alguno, aborta sin escribir nada), es idempotente por (tema_id, enunciado)
// y antes comprueba todo el banco contra el BOE.
//   sin argumentos: simulación;  --apply: escribe (una transacción);
//   --slug <oposición>: solo esa oposición.
async function main() {
  const aplicar = process.argv.includes("--apply");
  const i = process.argv.indexOf("--slug");
  const slugs = i > 0 ? [process.argv[i + 1]] : [...SLUGS_OFICIALES];
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL no está definida (revisa tu .env)");

  const { total, errores } = await verificarBancoOficial();
  if (errores.length) {
    for (const e of errores) console.error("✗", e);
    throw new Error(`El banco oficial tiene ${errores.length} errores: no se importa nada`);
  }
  console.log(`Banco oficial verificado contra el BOE: ${total} preguntas distintas, 0 errores`);

  const client = postgres(url, { max: 1, ssl: sslModeFor(url) });
  const db = drizzle(client, { schema });
  try {
    const planes: { slug: string; filas: { temaId: string; p: ReturnType<typeof preguntasDe>[number]; id?: string }[] }[] = [];
    for (const slug of slugs) {
      const banco = preguntasDe(slug);
      const [op] = await db.select({ id: schema.oposiciones.id }).from(schema.oposiciones).where(eq(schema.oposiciones.slug, slug)).limit(1);
      if (!op) throw new Error(`No existe la oposición "${slug}"`);
      const ordenes = [...new Set(banco.map((p) => p.temaOrden))];
      const temas = ordenes.length
        ? await db
            .select({ id: schema.temas.id, orden: schema.temas.orden })
            .from(schema.temas)
            .where(and(eq(schema.temas.oposicionId, op.id), inArray(schema.temas.orden, ordenes)))
        : [];
      const temaIdPorOrden = new Map(temas.map((t) => [t.orden, t.id]));
      const faltan = ordenes.filter((o) => !temaIdPorOrden.has(o));
      if (faltan.length) throw new Error(`Faltan temas de ${slug}: ${faltan.join(", ")}`);
      const existentes = temas.length
        ? await db
            .select({ id: schema.preguntas.id, temaId: schema.preguntas.temaId, enunciado: schema.preguntas.enunciado })
            .from(schema.preguntas)
            .where(inArray(schema.preguntas.temaId, [...temaIdPorOrden.values()]))
        : [];
      const idExistente = new Map(existentes.map((e) => [`${e.temaId}|${e.enunciado}`, e.id]));
      const filas = banco.map((p) => {
        const temaId = temaIdPorOrden.get(p.temaOrden)!;
        return { temaId, p, id: idExistente.get(`${temaId}|${p.enunciado}`) };
      });
      planes.push({ slug, filas });
      console.log(`\n${slug}: ${banco.length} en el banco, ${filas.filter((f) => !f.id).length} nuevas`);
      for (const orden of ordenes.sort((a, b) => a - b)) {
        const temaId = temaIdPorOrden.get(orden)!;
        const antes = existentes.filter((e) => e.temaId === temaId).length;
        const suman = filas.filter((f) => f.temaId === temaId && !f.id).length;
        console.log(`  Tema ${orden}: ${antes} en BD + ${suman} nuevas`);
      }
    }

    if (!aplicar) {
      console.log("\nSimulación: no se ha escrito nada. Repite con --apply para importar.");
      return;
    }
    await db.transaction(async (tx) => {
      for (const { filas } of planes) {
        for (const { temaId, p, id } of filas) {
          const datos = {
            opciones: p.opciones,
            respuestaCorrecta: p.respuestaCorrecta,
            justificacionIa: p.justificacionIa,
            mnemotecnia: p.mnemotecnia || null,
            dificultad: p.dificultad,
          };
          if (id) await tx.update(schema.preguntas).set(datos).where(eq(schema.preguntas.id, id));
          else await tx.insert(schema.preguntas).values({ temaId, enunciado: p.enunciado, ...datos });
        }
      }
    });
    console.log("\nImportación completada.");
  } finally {
    await client.end();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
