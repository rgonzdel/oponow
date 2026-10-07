import { Injectable, NotFoundException } from "@nestjs/common";
import { and, asc, eq, inArray, sql } from "drizzle-orm";
import { schema } from "@oponow/db";
import { getRequestDb } from "../database/request-context";

// Repaso espaciado (Leitner): días hasta el siguiente repaso según la caja.
// Caja 0 = "no la sabía": vuelve en esta misma sesión y está pendiente ya.
export const INTERVALOS_DIAS = [0, 1, 3, 7, 16, 35] as const;
const CAJA_MAX = INTERVALOS_DIAS.length - 1;
// A partir de esta caja (repaso a 16 días o más) se considera dominada.
const CAJA_DOMINADA = 4;
const TAMANO_SESION = 20;

export type Calificacion = "otra" | "dificil" | "bien";
export type ModoSesion = "repaso" | "todas";

export interface TemaFlashcards {
  id: string;
  orden: number;
  titulo: string;
  total: number;
  nuevas: number;
  pendientes: number;
  dominadas: number;
}

export interface ResumenFlashcards {
  oposicion: { slug: string; nombre: string };
  temas: TemaFlashcards[];
}

export interface Flashcard {
  id: string;
  anverso: string;
  reverso: string;
  cita: string;
  referencia: string;
  boeUrl: string;
  /** null = todavía no estudiada. */
  caja: number | null;
}

export interface ResultadoRespuesta {
  caja: number;
  proximaRevision: string;
}

@Injectable()
export class FlashcardsService {
  /** Temas de la oposición con tarjetas visibles para el plan del usuario
   * (RLS filtra temas y tarjetas) y su estado de estudio. */
  async resumen(slug: string): Promise<ResumenFlashcards> {
    const db = getRequestDb();
    const oposicion = await this.oposicion(slug);

    const filas = await db
      .select({
        id: schema.temas.id,
        orden: schema.temas.orden,
        titulo: schema.temas.titulo,
        total: sql<number>`count(*)::int`,
        nuevas: sql<number>`count(*) filter (where ${schema.flashcardsProgreso.flashcardId} is null)::int`,
        pendientes: sql<number>`count(*) filter (where ${schema.flashcardsProgreso.proximaRevision} <= now())::int`,
        dominadas: sql<number>`count(*) filter (where ${schema.flashcardsProgreso.caja} >= ${CAJA_DOMINADA})::int`,
      })
      .from(schema.temas)
      .innerJoin(schema.flashcardsTemas, eq(schema.flashcardsTemas.temaId, schema.temas.id))
      .innerJoin(schema.flashcards, eq(schema.flashcards.id, schema.flashcardsTemas.flashcardId))
      // RLS (flashcards_progreso_self) solo deja ver las filas del propio usuario.
      .leftJoin(schema.flashcardsProgreso, eq(schema.flashcardsProgreso.flashcardId, schema.flashcards.id))
      .where(eq(schema.temas.oposicionId, oposicion.id))
      .groupBy(schema.temas.id, schema.temas.orden, schema.temas.titulo)
      .orderBy(asc(schema.temas.orden));

    return { oposicion: { slug, nombre: oposicion.nombre }, temas: filas };
  }

  /**
   * Tarjetas para una sesión. En modo "repaso": primero las pendientes (las
   * que más tiempo llevan esperando) y después las nuevas. En modo "todas":
   * una selección al azar, estén como estén.
   */
  async sesion(slug: string, temaId: string | undefined, modo: ModoSesion): Promise<Flashcard[]> {
    const db = getRequestDb();
    const oposicion = await this.oposicion(slug);

    const temas = await db
      .select({ id: schema.temas.id })
      .from(schema.temas)
      .where(
        temaId
          ? and(eq(schema.temas.oposicionId, oposicion.id), eq(schema.temas.id, temaId))
          : eq(schema.temas.oposicionId, oposicion.id),
      );
    if (temaId && temas.length === 0) throw new NotFoundException("Tema no encontrado");
    if (temas.length === 0) return [];

    const pendiente = sql`${schema.flashcardsProgreso.proximaRevision} <= now()`;
    const nueva = sql`${schema.flashcardsProgreso.flashcardId} is null`;
    const filas = await db
      .selectDistinctOn([schema.flashcards.id], {
        id: schema.flashcards.id,
        anverso: schema.flashcards.anverso,
        reverso: schema.flashcards.reverso,
        cita: schema.flashcards.cita,
        referencia: schema.flashcards.referencia,
        boeId: schema.flashcards.boeId,
        caja: schema.flashcardsProgreso.caja,
        proximaRevision: schema.flashcardsProgreso.proximaRevision,
      })
      .from(schema.flashcards)
      .innerJoin(schema.flashcardsTemas, eq(schema.flashcardsTemas.flashcardId, schema.flashcards.id))
      .leftJoin(schema.flashcardsProgreso, eq(schema.flashcardsProgreso.flashcardId, schema.flashcards.id))
      .where(
        and(
          inArray(schema.flashcardsTemas.temaId, temas.map((t) => t.id)),
          modo === "repaso" ? sql`(${pendiente} or ${nueva})` : undefined,
        ),
      );

    const ordenadas =
      modo === "repaso"
        ? [
            ...filas
              .filter((f) => f.proximaRevision)
              .sort((a, b) => a.proximaRevision!.getTime() - b.proximaRevision!.getTime()),
            ...barajar(filas.filter((f) => !f.proximaRevision)),
          ]
        : barajar(filas);

    return ordenadas.slice(0, TAMANO_SESION).map((f) => ({
      id: f.id,
      anverso: f.anverso,
      reverso: f.reverso,
      cita: f.cita,
      referencia: f.referencia,
      boeUrl: `https://www.boe.es/buscar/act.php?id=${f.boeId}`,
      caja: f.caja,
    }));
  }

  async responder(userId: string, flashcardId: string, calificacion: Calificacion): Promise<ResultadoRespuesta> {
    const db = getRequestDb();
    // Solo se puede puntuar una tarjeta visible para el plan del usuario.
    const [tarjeta] = await db
      .select({ id: schema.flashcards.id })
      .from(schema.flashcards)
      .where(eq(schema.flashcards.id, flashcardId))
      .limit(1);
    if (!tarjeta) throw new NotFoundException("Tarjeta no encontrada");

    const [actual] = await db
      .select({ caja: schema.flashcardsProgreso.caja })
      .from(schema.flashcardsProgreso)
      .where(eq(schema.flashcardsProgreso.flashcardId, flashcardId))
      .limit(1);
    const caja = siguienteCaja(actual?.caja ?? null, calificacion);
    const proximaRevision = new Date(Date.now() + INTERVALOS_DIAS[caja] * 86_400_000);
    const acierto = calificacion === "bien" ? 1 : 0;
    const fallo = calificacion === "otra" ? 1 : 0;

    await db
      .insert(schema.flashcardsProgreso)
      .values({ usuarioId: userId, flashcardId, caja, proximaRevision, aciertos: acierto, fallos: fallo })
      .onConflictDoUpdate({
        target: [schema.flashcardsProgreso.usuarioId, schema.flashcardsProgreso.flashcardId],
        set: {
          caja,
          proximaRevision,
          aciertos: sql`${schema.flashcardsProgreso.aciertos} + ${acierto}`,
          fallos: sql`${schema.flashcardsProgreso.fallos} + ${fallo}`,
          actualizadoEn: new Date(),
        },
      });

    return { caja, proximaRevision: proximaRevision.toISOString() };
  }

  private async oposicion(slug: string) {
    const [oposicion] = await getRequestDb()
      .select({ id: schema.oposiciones.id, nombre: schema.oposiciones.nombre })
      .from(schema.oposiciones)
      .where(eq(schema.oposiciones.slug, slug))
      .limit(1);
    if (!oposicion) throw new NotFoundException("Oposición no encontrada");
    return oposicion;
  }
}

/** "No la sabía" vuelve a empezar; "dudé" baja una caja (mínimo la 1);
 * "la sabía" sube una. Una tarjeta nueva parte de la caja 0. */
export function siguienteCaja(caja: number | null, calificacion: Calificacion): number {
  const actual = caja ?? 0;
  if (calificacion === "otra") return 0;
  if (calificacion === "dificil") return Math.max(1, actual - 1);
  return Math.min(CAJA_MAX, actual + 1);
}

function barajar<T>(lista: T[]): T[] {
  const copia = [...lista];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}
