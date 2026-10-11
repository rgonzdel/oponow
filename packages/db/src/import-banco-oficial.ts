import path from "node:path";
import { config } from "dotenv";
import { and, eq, inArray } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";
import { preguntasDe, SLUGS_OFICIALES } from "./content/banco-oficial";
import { bloquesOficiales, TEMAS_OFICIALES } from "./content/banco-oficial/temas-oficiales";
import { verificarBancoOficial } from "./verificar-banco-oficial";
import { sslModeFor } from "./ssl";

config({ path: path.resolve(__dirname, "../../../.env") });

// Importa el banco oficial (content/banco-oficial) en los temas ya sembrados
// de cada oposición. Igual que import-banco-tai.ts: no crea temas (si falta
// alguno, aborta sin escribir nada) salvo los del programa oficial listados en
// temas-oficiales.ts, que crea con un bloque de contenido (epígrafe literal y
// texto literal del BOE de los preceptos que preguntan) y regenera en cada
// importación. Es idempotente por (tema_id, enunciado) y antes comprueba todo
// el banco contra el BOE.
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
    const planes: {
      slug: string;
      oposicionId: string;
      filas: { temaId: string; p: ReturnType<typeof preguntasDe>[number]; id?: string }[];
      bloques: { orden: number; contenidos: string[] }[];
    }[] = [];
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
      const oficiales = TEMAS_OFICIALES[slug] ?? {};
      const crear = ordenes.filter((o) => !temaIdPorOrden.has(o) && oficiales[o]);
      for (const o of crear) temaIdPorOrden.set(o, `nuevo:${o}`);
      const faltan = ordenes.filter((o) => !temaIdPorOrden.has(o));
      if (faltan.length) throw new Error(`Faltan temas de ${slug}: ${faltan.join(", ")}`);
      const existentes = temas.length
        ? await db
            .select({ id: schema.preguntas.id, temaId: schema.preguntas.temaId, enunciado: schema.preguntas.enunciado })
            .from(schema.preguntas)
            .where(inArray(schema.preguntas.temaId, temas.map((t) => t.id)))
        : [];
      const idExistente = new Map(existentes.map((e) => [`${e.temaId}|${e.enunciado}`, e.id]));
      const filas = banco.map((p) => {
        const temaId = temaIdPorOrden.get(p.temaOrden)!;
        return { temaId, p, id: idExistente.get(`${temaId}|${p.enunciado}`) };
      });
      const bloques = Object.keys(oficiales).map(Number).filter((o) => ordenes.includes(o)).map((o) => ({ orden: o, contenidos: [] as string[] }));
      for (const b of bloques) b.contenidos = await bloquesOficiales(slug, b.orden);
      planes.push({ slug, filas, oposicionId: op.id, bloques });
      for (const o of crear) console.log(`  (se crea el tema ${o}: ${oficiales[o].titulo})`);
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
      for (const { slug, oposicionId, filas, bloques } of planes) {
        const idReal = new Map<string, string>();
        for (const { orden, contenidos } of bloques) {
          const { titulo } = TEMAS_OFICIALES[slug][orden];
          let [tema] = await tx.select({ id: schema.temas.id }).from(schema.temas)
            .where(and(eq(schema.temas.oposicionId, oposicionId), eq(schema.temas.orden, orden))).limit(1);
          if (!tema) [tema] = await tx.insert(schema.temas).values({ oposicionId, orden, titulo, esGratuito: false }).returning({ id: schema.temas.id });
          idReal.set(`nuevo:${orden}`, tema.id);
          const previos = await tx.select({ id: schema.bloquesContenido.id, orden: schema.bloquesContenido.orden })
            .from(schema.bloquesContenido).where(eq(schema.bloquesContenido.temaId, tema.id));
          const porOrden = new Map(previos.map((b) => [b.orden, b.id]));
          for (const [i, contenido] of contenidos.entries()) {
            const id = porOrden.get(i + 1);
            if (id) await tx.update(schema.bloquesContenido).set({ contenido }).where(eq(schema.bloquesContenido.id, id));
            else await tx.insert(schema.bloquesContenido).values({ temaId: tema.id, orden: i + 1, contenido });
          }
          const sobran = previos.filter((b) => b.orden > contenidos.length).map((b) => b.id);
          if (sobran.length) await tx.delete(schema.bloquesContenido).where(inArray(schema.bloquesContenido.id, sobran));
        }
        for (const { temaId: t, p, id } of filas) {
          const temaId = idReal.get(t) ?? t;
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
