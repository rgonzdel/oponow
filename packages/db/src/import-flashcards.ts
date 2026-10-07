import path from "node:path";
import { config } from "dotenv";
import { inArray, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";
import { FLASHCARDS, GRUPOS, NORMAS } from "./content/flashcards";
import { verificarFlashcards } from "./verificar-flashcards";
import { sslModeFor } from "./ssl";

config({ path: path.resolve(__dirname, "../../../.env") });

// Importa el banco de flashcards. Antes de tocar la base de datos verifica
// cada cita contra el texto consolidado del BOE: si una sola falla, no
// importa nada. Idempotente por `clave` (actualiza las que ya existen y
// rehace sus temas). No crea temas: si falta alguno, aborta.
//
// Sin argumentos solo informa; con --apply escribe, en una transacción.
async function main() {
  const aplicar = process.argv.includes("--apply");
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL no está definida (revisa tu .env)");

  console.log("Verificando las citas contra el BOE…");
  const { total, errores } = await verificarFlashcards();
  if (errores.length) {
    for (const e of errores) console.error("✗", e);
    throw new Error(`${errores.length} de ${total} tarjetas no superan la verificación: no se importa nada`);
  }
  console.log(`✓ ${total} tarjetas verificadas contra el BOE`);

  const client = postgres(url, { max: 1, ssl: sslModeFor(url) });
  const db = drizzle(client, { schema });
  try {
    const temas = await db
      .select({ id: schema.temas.id, orden: schema.temas.orden, slug: schema.oposiciones.slug })
      .from(schema.temas)
      .innerJoin(schema.oposiciones, sql`${schema.oposiciones.id} = ${schema.temas.oposicionId}`);
    const temaId = new Map(temas.map((t) => [`${t.slug}#${t.orden}`, t.id]));
    const faltan = Object.values(GRUPOS)
      .flat()
      .map(([slug, orden]) => `${slug}#${orden}`)
      .filter((k) => !temaId.has(k));
    if (faltan.length) throw new Error(`Faltan temas en la base de datos: ${[...new Set(faltan)].join(", ")}`);

    const filas = FLASHCARDS.map((f) => ({
      clave: f.clave,
      anverso: f.anverso,
      reverso: f.reverso,
      cita: f.cita,
      referencia: `${NORMAS[f.norma].corta}, art. ${f.apartado}`,
      boeId: NORMAS[f.norma].boeId,
      temas: [...new Set(f.grupos.flatMap((g) => GRUPOS[g].map(([slug, orden]) => temaId.get(`${slug}#${orden}`)!)))],
    }));

    const existentes = await db
      .select({ clave: schema.flashcards.clave })
      .from(schema.flashcards)
      .where(inArray(schema.flashcards.clave, filas.map((f) => f.clave)));
    console.log(`Nuevas: ${filas.length - existentes.length} · ya existentes (se actualizan): ${existentes.length}`);
    const porTema = new Map<string, number>();
    for (const f of filas) for (const t of f.temas) porTema.set(t, (porTema.get(t) ?? 0) + 1);
    for (const t of temas.filter((t) => porTema.has(t.id)).sort((a, b) => a.slug.localeCompare(b.slug) || a.orden - b.orden)) {
      console.log(`  ${t.slug} · tema ${t.orden}: ${porTema.get(t.id)} tarjetas`);
    }

    if (!aplicar) {
      console.log("\nSimulación: no se ha escrito nada. Ejecuta con --apply para importar.");
      return;
    }

    await db.transaction(async (tx) => {
      for (const { temas: ids, ...f } of filas) {
        const [fila] = await tx
          .insert(schema.flashcards)
          .values(f)
          .onConflictDoUpdate({
            target: schema.flashcards.clave,
            set: { anverso: f.anverso, reverso: f.reverso, cita: f.cita, referencia: f.referencia, boeId: f.boeId },
          })
          .returning({ id: schema.flashcards.id });
        await tx.delete(schema.flashcardsTemas).where(sql`${schema.flashcardsTemas.flashcardId} = ${fila.id}`);
        await tx.insert(schema.flashcardsTemas).values(ids.map((temaId) => ({ flashcardId: fila.id, temaId })));
      }
    });
    console.log(`\n✓ Importadas ${filas.length} flashcards`);
  } finally {
    await client.end();
  }
}

main().catch((e) => {
  console.error(e instanceof Error ? e.message : e);
  process.exit(1);
});
