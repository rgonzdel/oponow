import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { and, desc, eq, gte, inArray, sql } from "drizzle-orm";
import { schema } from "@oponow/db";
import { getRequestDb } from "../database/request-context";

// Tipos de la respuesta (los mismos que ExamenEstado y compañía en
// @oponow/shared-types, que usa la web; la API no depende de ese paquete).
export type MotivoEntregaExamen = "usuario" | "tiempo" | "salidas";

export interface CrearExamen {
  temaIds: string[];
  numPreguntas: number;
  duracionMinutos: number;
  modoAvanzado: boolean;
  maxSalidas: number;
}

export interface ExamenRespuesta {
  opcionElegida: number | null;
  marcada: boolean;
}

export interface ExamenResultado {
  correctas: number;
  incorrectas: number;
  enBlanco: number;
  puntuacion: number;
  motivoEntrega: MotivoEntregaExamen;
  salidas: number;
  segundosFuera: number;
  segundosUsados: number;
}

export interface ExamenPregunta {
  id: string;
  enunciado: string;
  opciones: string[];
  revision?: {
    respuestaCorrecta: number;
    justificacionIa: string | null;
    mnemotecnia: string | null;
    temaTitulo: string;
  };
}

export interface ExamenEstado {
  id: string;
  oposicionSlug: string;
  estado: "en_progreso" | "entregado";
  preguntas: ExamenPregunta[];
  respuestas: Record<string, ExamenRespuesta>;
  duracionSegundos: number;
  segundosRestantes: number;
  modoAvanzado: boolean;
  maxSalidas: number;
  salidas: number;
  resultado: ExamenResultado | null;
}

export interface ExamenOpciones {
  temas: { id: string; orden: number; titulo: string; preguntas: number }[];
  activoId: string | null;
  historial: {
    id: string;
    inicio: string;
    numPreguntas: number;
    puntuacion: number | null;
    motivoEntrega: MotivoEntregaExamen | null;
    modoAvanzado: boolean;
  }[];
}

export interface ExamenSalida {
  salidas: number;
  maxSalidas: number;
  entregado: boolean;
}

/**
 * Margen para la latencia de red: una respuesta enviada en el último segundo
 * no se rechaza por llegar un instante tarde.
 */
const MARGEN_MS = 5_000;

function inicioDeHoy(): Date {
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  return hoy;
}

/** Misma fórmula que el examen real y que QuizService: cada fallo resta 1/3. */
export function puntuar(correctas: number, incorrectas: number, total: number): number {
  if (total <= 0) return 0;
  const nota = Math.max(0, ((correctas - incorrectas / 3) / total) * 10);
  return Math.round(nota * 100) / 100;
}

function barajar<T>(lista: T[]): T[] {
  const copia = [...lista];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}

type FilaExamen = typeof schema.examenes.$inferSelect;

@Injectable()
export class ExamenService {
  private async oposicionId(slug: string): Promise<string> {
    const db = getRequestDb();
    const [op] = await db
      .select({ id: schema.oposiciones.id })
      .from(schema.oposiciones)
      .where(eq(schema.oposiciones.slug, slug))
      .limit(1);
    if (!op) throw new NotFoundException("Oposición no encontrada");
    return op.id;
  }

  /**
   * Temas con preguntas para configurar el examen. Las preguntas ya vienen
   * filtradas por RLS (`preguntas_visibles`): un usuario free solo cuenta las
   * de los temas gratuitos.
   */
  async opciones(userId: string, slug: string): Promise<ExamenOpciones> {
    const db = getRequestDb();
    const oposicionId = await this.oposicionId(slug);

    const temas = await db
      .select({
        id: schema.temas.id,
        orden: schema.temas.orden,
        titulo: schema.temas.titulo,
        preguntas: sql<number>`count(${schema.preguntas.id})::int`,
      })
      .from(schema.temas)
      .innerJoin(schema.preguntas, eq(schema.preguntas.temaId, schema.temas.id))
      .where(eq(schema.temas.oposicionId, oposicionId))
      .groupBy(schema.temas.id, schema.temas.orden, schema.temas.titulo)
      .orderBy(schema.temas.orden);

    const listar = () =>
      db
        .select()
        .from(schema.examenes)
        .where(and(eq(schema.examenes.usuarioId, userId), eq(schema.examenes.oposicionId, oposicionId)))
        .orderBy(desc(schema.examenes.inicio))
        .limit(20);
    let examenes = await listar();
    const caducado = examenes.find((e) => this.caducado(e));
    if (caducado) {
      await this.entregar(userId, caducado, "tiempo");
      examenes = await listar();
    }

    const activoId = examenes.find((e) => e.estado === "en_progreso")?.id ?? null;
    const historial = examenes
      .filter((e) => e.estado === "completado")
      .map((e) => ({
        id: e.id,
        inicio: e.inicio.toISOString(),
        numPreguntas: e.preguntaIds.length,
        puntuacion: e.puntuacion === null ? null : Number(e.puntuacion),
        motivoEntrega: e.motivoEntrega,
        modoAvanzado: e.modoAvanzado,
      }));

    return { temas, activoId, historial };
  }

  async crear(
    userId: string,
    plan: string,
    slug: string,
    dto: CrearExamen,
    sinLimite: boolean,
  ): Promise<{ id: string }> {
    const db = getRequestDb();
    const oposicionId = await this.oposicionId(slug);

    const [enCurso] = await db
      .select()
      .from(schema.examenes)
      .where(and(eq(schema.examenes.usuarioId, userId), eq(schema.examenes.estado, "en_progreso")))
      .limit(1);
    if (enCurso) {
      if (!this.caducado(enCurso)) {
        throw new ConflictException("Ya tienes un examen en curso: termínalo o entrégalo antes de empezar otro.");
      }
      await this.entregar(userId, enCurso, "tiempo");
    }

    // Plan free: el examen ocupa su test gratuito del día, igual que un test
    // de tema (y viceversa, ver QuizService.iniciarIntento).
    if (plan === "free" && !sinLimite) {
      const hoy = inicioDeHoy();
      const [testHoy] = await db
        .select({ id: schema.intentosTest.id })
        .from(schema.intentosTest)
        .where(
          and(
            eq(schema.intentosTest.usuarioId, userId),
            eq(schema.intentosTest.esDiario, true),
            gte(schema.intentosTest.fecha, hoy),
          ),
        )
        .limit(1);
      const [examenHoy] = await db
        .select({ id: schema.examenes.id })
        .from(schema.examenes)
        .where(and(eq(schema.examenes.usuarioId, userId), gte(schema.examenes.inicio, hoy)))
        .limit(1);
      if (testHoy || examenHoy) {
        throw new ForbiddenException(
          "Ya has hecho tu test gratuito de hoy — vuelve mañana o hazte con el plan completo.",
        );
      }
    }

    const filtroTemas = dto.temaIds.length
      ? and(eq(schema.temas.oposicionId, oposicionId), inArray(schema.temas.id, dto.temaIds))
      : eq(schema.temas.oposicionId, oposicionId);
    const disponibles = await db
      .select({ id: schema.preguntas.id })
      .from(schema.preguntas)
      .innerJoin(schema.temas, eq(schema.temas.id, schema.preguntas.temaId))
      .where(filtroTemas);
    if (disponibles.length < 5) {
      throw new BadRequestException("No hay suficientes preguntas en los temas elegidos (mínimo 5).");
    }

    const preguntaIds = barajar(disponibles.map((p) => p.id)).slice(0, dto.numPreguntas);
    const [examen] = await db
      .insert(schema.examenes)
      .values({
        usuarioId: userId,
        oposicionId,
        preguntaIds,
        duracionSegundos: dto.duracionMinutos * 60,
        modoAvanzado: dto.modoAvanzado,
        maxSalidas: dto.maxSalidas,
      })
      .returning({ id: schema.examenes.id });
    return { id: examen.id };
  }

  private async cargar(examenId: string): Promise<FilaExamen> {
    const db = getRequestDb();
    // RLS (examenes_self): el examen de otro usuario ni siquiera llega.
    const [examen] = await db
      .select()
      .from(schema.examenes)
      .where(eq(schema.examenes.id, examenId))
      .limit(1);
    if (!examen) throw new NotFoundException("Examen no encontrado");
    return examen;
  }

  private finPrevisto(examen: FilaExamen): number {
    return examen.inicio.getTime() + examen.duracionSegundos * 1000;
  }

  private caducado(examen: FilaExamen): boolean {
    return examen.estado === "en_progreso" && Date.now() > this.finPrevisto(examen) + MARGEN_MS;
  }

  /** Carga el examen en curso; si se ha pasado el tiempo, lo entrega y avisa. */
  private async enCurso(userId: string, examenId: string): Promise<FilaExamen> {
    const examen = await this.cargar(examenId);
    if (examen.estado !== "en_progreso") throw new ConflictException("Este examen ya está entregado");
    if (this.caducado(examen)) {
      await this.entregar(userId, examen, "tiempo");
      throw new ConflictException("Se ha acabado el tiempo: el examen se ha entregado");
    }
    return examen;
  }

  async estado(userId: string, examenId: string): Promise<ExamenEstado> {
    const db = getRequestDb();
    let examen = await this.cargar(examenId);
    if (this.caducado(examen)) {
      await this.entregar(userId, examen, "tiempo");
      examen = await this.cargar(examenId);
    }
    const entregado = examen.estado === "completado";

    const filas = examen.preguntaIds.length
      ? await db
          .select({
            id: schema.preguntas.id,
            enunciado: schema.preguntas.enunciado,
            opciones: schema.preguntas.opciones,
            respuestaCorrecta: schema.preguntas.respuestaCorrecta,
            justificacionIa: schema.preguntas.justificacionIa,
            mnemotecnia: schema.preguntas.mnemotecnia,
            temaTitulo: schema.temas.titulo,
          })
          .from(schema.preguntas)
          .innerJoin(schema.temas, eq(schema.temas.id, schema.preguntas.temaId))
          .where(inArray(schema.preguntas.id, examen.preguntaIds))
      : [];
    const porId = new Map(filas.map((f) => [f.id, f]));
    // Mientras dura el examen, ni la respuesta correcta ni la explicación
    // salen del servidor.
    const preguntas = examen.preguntaIds
      .map((id) => porId.get(id))
      .filter((f) => f !== undefined)
      .map((f) => ({
        id: f.id,
        enunciado: f.enunciado,
        opciones: f.opciones,
        ...(entregado
          ? {
              revision: {
                respuestaCorrecta: f.respuestaCorrecta,
                justificacionIa: f.justificacionIa,
                mnemotecnia: f.mnemotecnia,
                temaTitulo: f.temaTitulo,
              },
            }
          : {}),
      }));

    const respuestas: Record<string, ExamenRespuesta> = {};
    const filasRespuestas = await db
      .select()
      .from(schema.respuestasExamen)
      .where(eq(schema.respuestasExamen.examenId, examen.id));
    for (const r of filasRespuestas) {
      respuestas[r.preguntaId] = { opcionElegida: r.opcionElegida, marcada: r.marcada };
    }

    const slug = await db
      .select({ slug: schema.oposiciones.slug })
      .from(schema.oposiciones)
      .where(eq(schema.oposiciones.id, examen.oposicionId))
      .limit(1);

    return {
      id: examen.id,
      oposicionSlug: slug[0]?.slug ?? "",
      estado: entregado ? "entregado" : "en_progreso",
      preguntas,
      respuestas,
      duracionSegundos: examen.duracionSegundos,
      segundosRestantes: entregado ? 0 : Math.max(0, Math.round((this.finPrevisto(examen) - Date.now()) / 1000)),
      modoAvanzado: examen.modoAvanzado,
      maxSalidas: examen.maxSalidas,
      salidas: examen.salidas,
      resultado: entregado ? this.resultado(examen) : null,
    };
  }

  private resultado(examen: FilaExamen): ExamenResultado {
    const fin = examen.entregadoEn ?? new Date();
    return {
      correctas: examen.correctas ?? 0,
      incorrectas: examen.incorrectas ?? 0,
      enBlanco: examen.enBlanco ?? 0,
      puntuacion: Number(examen.puntuacion ?? 0),
      motivoEntrega: examen.motivoEntrega ?? "usuario",
      salidas: examen.salidas,
      segundosFuera: examen.segundosFuera,
      segundosUsados: Math.min(
        examen.duracionSegundos,
        Math.max(0, Math.round((fin.getTime() - examen.inicio.getTime()) / 1000)),
      ),
    };
  }

  async responder(
    userId: string,
    examenId: string,
    preguntaId: string,
    respuesta: ExamenRespuesta,
  ): Promise<void> {
    const examen = await this.enCurso(userId, examenId);
    if (!examen.preguntaIds.includes(preguntaId)) {
      throw new BadRequestException("La pregunta no pertenece a este examen");
    }
    const db = getRequestDb();
    if (respuesta.opcionElegida !== null) {
      const [pregunta] = await db
        .select({ opciones: schema.preguntas.opciones })
        .from(schema.preguntas)
        .where(eq(schema.preguntas.id, preguntaId))
        .limit(1);
      if (!pregunta || respuesta.opcionElegida >= pregunta.opciones.length) {
        throw new BadRequestException("Opción no válida");
      }
    }
    await db
      .insert(schema.respuestasExamen)
      .values({ examenId, preguntaId, ...respuesta })
      .onConflictDoUpdate({
        target: [schema.respuestasExamen.examenId, schema.respuestasExamen.preguntaId],
        set: { ...respuesta, actualizadoEn: new Date() },
      });
  }

  /**
   * Modo avanzado: el navegador avisa al salir de la pantalla del examen
   * (`fase: "salida"`, cuenta una salida) y al volver (`fase: "vuelta"`, suma
   * el tiempo que ha estado fuera). Al llegar al máximo de salidas se entrega.
   */
  async salida(
    userId: string,
    examenId: string,
    fase: "salida" | "vuelta",
    segundosFuera: number,
  ): Promise<ExamenSalida> {
    const examen = await this.enCurso(userId, examenId);
    if (!examen.modoAvanzado) throw new BadRequestException("Este examen no está en modo avanzado");
    const db = getRequestDb();

    const [actualizado] = await db
      .update(schema.examenes)
      .set(
        fase === "salida"
          ? { salidas: sql`${schema.examenes.salidas} + 1` }
          : {
              segundosFuera: sql`${schema.examenes.segundosFuera} + ${Math.min(segundosFuera, examen.duracionSegundos)}`,
            },
      )
      .where(and(eq(schema.examenes.id, examenId), eq(schema.examenes.estado, "en_progreso")))
      .returning();
    if (!actualizado) throw new ConflictException("Este examen ya está entregado");

    let entregado = false;
    if (fase === "salida" && actualizado.salidas >= actualizado.maxSalidas) {
      await this.entregar(userId, actualizado, "salidas");
      entregado = true;
    }
    return { salidas: actualizado.salidas, maxSalidas: actualizado.maxSalidas, entregado };
  }

  async entregarPorUsuario(userId: string, plan: string, examenId: string): Promise<ExamenResultado> {
    const examen = await this.cargar(examenId);
    if (examen.estado === "en_progreso") {
      await this.entregar(userId, examen, this.caducado(examen) ? "tiempo" : "usuario", plan);
    }
    return this.resultado(await this.cargar(examenId));
  }

  /**
   * Corrige y cierra el examen. Es idempotente: solo la petición que consigue
   * pasar el examen de "en_progreso" a "completado" vuelca las respuestas al
   * historial de tests, así que dos entregas simultáneas no lo duplican.
   */
  private async entregar(
    userId: string,
    examen: FilaExamen,
    motivo: MotivoEntregaExamen,
    plan?: string,
  ): Promise<void> {
    const db = getRequestDb();

    const respuestas = await db
      .select({
        preguntaId: schema.respuestasExamen.preguntaId,
        opcionElegida: schema.respuestasExamen.opcionElegida,
        actualizadoEn: schema.respuestasExamen.actualizadoEn,
      })
      .from(schema.respuestasExamen)
      .where(eq(schema.respuestasExamen.examenId, examen.id));
    // Cuenta lo respondido dentro del tiempo (más el margen de red).
    const limite = this.finPrevisto(examen) + MARGEN_MS;
    const contestadas = respuestas.filter(
      (r) => r.opcionElegida !== null && r.actualizadoEn.getTime() <= limite,
    );

    const preguntas = examen.preguntaIds.length
      ? await db
          .select({
            id: schema.preguntas.id,
            temaId: schema.preguntas.temaId,
            respuestaCorrecta: schema.preguntas.respuestaCorrecta,
          })
          .from(schema.preguntas)
          .where(inArray(schema.preguntas.id, examen.preguntaIds))
      : [];
    const preguntaPorId = new Map(preguntas.map((p) => [p.id, p]));

    const corregidas = contestadas
      .filter((r) => preguntaPorId.has(r.preguntaId))
      .map((r) => {
        const p = preguntaPorId.get(r.preguntaId)!;
        return { ...r, temaId: p.temaId, esCorrecta: r.opcionElegida === p.respuestaCorrecta };
      });
    const total = examen.preguntaIds.length;
    const correctas = corregidas.filter((r) => r.esCorrecta).length;
    const incorrectas = corregidas.length - correctas;
    const puntuacion = puntuar(correctas, incorrectas, total);
    const ahora = new Date();

    const [cerrado] = await db
      .update(schema.examenes)
      .set({
        estado: "completado",
        motivoEntrega: motivo,
        entregadoEn: new Date(Math.min(ahora.getTime(), this.finPrevisto(examen))),
        correctas,
        incorrectas,
        enBlanco: total - corregidas.length,
        puntuacion: puntuacion.toFixed(2),
      })
      .where(and(eq(schema.examenes.id, examen.id), eq(schema.examenes.estado, "en_progreso")))
      .returning({ id: schema.examenes.id });
    if (!cerrado) return;

    // Un intento por tema, para que el examen cuente en la racha, los fallos
    // y el informe como cualquier test (examen_id permite contarlo una vez).
    let planActual = plan;
    if (!planActual) {
      const [u] = await db
        .select({ plan: schema.usuarios.plan })
        .from(schema.usuarios)
        .where(eq(schema.usuarios.id, userId))
        .limit(1);
      planActual = u?.plan ?? "free";
    }
    const porTema = new Map<string, { total: number; respuestas: typeof corregidas }>();
    for (const p of preguntas) {
      const t = porTema.get(p.temaId) ?? { total: 0, respuestas: [] };
      t.total += 1;
      porTema.set(p.temaId, t);
    }
    for (const r of corregidas) porTema.get(r.temaId)!.respuestas.push(r);

    for (const [temaId, datos] of porTema) {
      const bien = datos.respuestas.filter((r) => r.esCorrecta).length;
      const [intento] = await db
        .insert(schema.intentosTest)
        .values({
          usuarioId: userId,
          temaId,
          fecha: ahora,
          esDiario: planActual === "free",
          estado: "completado",
          puntuacion: puntuar(bien, datos.respuestas.length - bien, datos.total).toFixed(2),
          examenId: examen.id,
        })
        .returning({ id: schema.intentosTest.id });
      if (datos.respuestas.length) {
        await db.insert(schema.respuestasUsuario).values(
          datos.respuestas.map((r) => ({
            intentoId: intento.id,
            preguntaId: r.preguntaId,
            opcionElegida: r.opcionElegida!,
            esCorrecta: r.esCorrecta,
            fecha: ahora,
          })),
        );
      }
    }
  }
}
