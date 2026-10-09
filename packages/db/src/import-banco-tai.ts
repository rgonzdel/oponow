import path from "node:path";
import { config } from "dotenv";
import { and, eq, inArray } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";
import { TAI_BANCO_PREGUNTAS as BANCO_1 } from "./content/tai-banco-preguntas";
import { TAI_BANCO_BOE_PREGUNTAS } from "./content/tai-banco-boe";
import { verificarBancoTaiBoe } from "./verificar-banco-tai-boe";
import { sslModeFor } from "./ssl";

config({ path: path.resolve(__dirname, "../../../.env") });

const TAI_BANCO_PREGUNTAS = [...BANCO_1, ...TAI_BANCO_BOE_PREGUNTAS];

// Importa los dos bancos de TAI (tai-banco-preguntas.ts y tai-banco-boe.ts) en los temas ya sembrados de la
// oposición "tai". No crea temas: si falta alguno, aborta sin escribir nada.
// Idempotente por (tema_id, enunciado), igual que upsertPreguntas de seed.ts.
//
// Sin argumentos solo informa de lo que haría; con --apply escribe, todo en
// una única transacción. Antes de nada comprueba el segundo banco contra el
// BOE (verificar-banco-tai-boe.ts) y no sigue si hay algún error.
async function main() {
  const aplicar = process.argv.includes("--apply");
  const { total, errores } = await verificarBancoTaiBoe();
  if (errores.length) {
    for (const e of errores) console.error("✗", e);
    throw new Error(`El banco BOE tiene ${errores.length} errores: no se importa nada`);
  }
  console.log(`Banco BOE verificado contra el BOE: ${total} preguntas, 0 errores`);
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL no está definida (revisa tu .env)");

  const client = postgres(url, { max: 1, ssl: sslModeFor(url) });
  const db = drizzle(client, { schema });

  try {
    const [tai] = await db
      .select({ id: schema.oposiciones.id })
      .from(schema.oposiciones)
      .where(eq(schema.oposiciones.slug, "tai"))
      .limit(1);
    if (!tai) throw new Error('No existe la oposición "tai" (ejecuta antes el seed)');

    const ordenes = [...new Set(TAI_BANCO_PREGUNTAS.map((p) => p.temaOrden))];
    const temas = await db
      .select({ id: schema.temas.id, orden: schema.temas.orden })
      .from(schema.temas)
      .where(and(eq(schema.temas.oposicionId, tai.id), inArray(schema.temas.orden, ordenes)));
    const temaIdPorOrden = new Map(temas.map((t) => [t.orden, t.id]));
    const faltan = ordenes.filter((o) => !temaIdPorOrden.has(o));
    if (faltan.length) throw new Error(`Faltan los temas de TAI: ${faltan.join(", ")}`);

    const existentes = await db
      .select({ id: schema.preguntas.id, temaId: schema.preguntas.temaId, enunciado: schema.preguntas.enunciado })
      .from(schema.preguntas)
      .where(inArray(schema.preguntas.temaId, [...temaIdPorOrden.values()]));
    const idExistente = new Map(existentes.map((e) => [`${e.temaId}|${e.enunciado}`, e.id]));

    const nuevas = TAI_BANCO_PREGUNTAS.filter(
      (p) => !idExistente.has(`${temaIdPorOrden.get(p.temaOrden)}|${p.enunciado}`),
    );
    console.log(`Preguntas en el banco: ${TAI_BANCO_PREGUNTAS.length}`);
    console.log(`Ya existentes (se actualizarán): ${TAI_BANCO_PREGUNTAS.length - nuevas.length}`);
    console.log(`Nuevas (se insertarán): ${nuevas.length}`);
    for (const orden of ordenes.sort((a, b) => a - b)) {
      const temaId = temaIdPorOrden.get(orden)!;
      const antes = existentes.filter((e) => e.temaId === temaId).length;
      const suman = nuevas.filter((p) => p.temaOrden === orden).length;
      console.log(`  Tema ${orden}: ${antes} en BD + ${suman} nuevas`);
    }

    if (!aplicar) {
      console.log("\nSimulación: no se ha escrito nada. Repite con --apply para importar.");
      return;
    }

    await db.transaction(async (tx) => {
      for (const p of TAI_BANCO_PREGUNTAS) {
        const temaId = temaIdPorOrden.get(p.temaOrden)!;
        const datos = {
          opciones: p.opciones,
          respuestaCorrecta: p.respuestaCorrecta,
          justificacionIa: p.justificacionIa,
          mnemotecnia: p.mnemotecnia || null,
          dificultad: p.dificultad,
        };
        const id = idExistente.get(`${temaId}|${p.enunciado}`);
        if (id) {
          await tx.update(schema.preguntas).set(datos).where(eq(schema.preguntas.id, id));
        } else {
          await tx.insert(schema.preguntas).values({ temaId, enunciado: p.enunciado, ...datos });
        }
      }
    });
    console.log(`\nImportación completada: ${nuevas.length} insertadas, ${TAI_BANCO_PREGUNTAS.length - nuevas.length} actualizadas.`);
  } finally {
    await client.end();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
