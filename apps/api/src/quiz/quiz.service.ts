import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { and, eq } from "drizzle-orm";
import { schema } from "@oponow/db";
import { getRequestDb } from "../database/request-context";
import type { ResponderDto } from "./dto/responder.dto";
import type { FallosGroupBy, FallosQueryDto } from "./dto/fallos-query.dto";

export interface PreguntaParaTest {
  id: string;
  enunciado: string;
  opciones: string[];
}

export interface IntentoIniciado {
  intentoId: string;
  preguntas: PreguntaParaTest[];
}

export interface RespuestaResultado {
  esCorrecta: boolean;
  respuestaCorrecta: number;
}

export interface ResumenIntento {
  correctas: number;
  incorrectas: number;
  enBlanco: number;
  puntuacion: number;
}

export interface FalloDetalle {
  id: string;
  fecha: Date;
  temaTitulo: string;
  enunciado: string;
  opciones: string[];
  opcionElegida: number;
  respuestaCorrecta: number;
}

export interface FallosResumen {
  fallos: FalloDetalle[];
  porPeriodo: { periodo: string; total: number }[];
}

function inicioDeHoy(): Date {
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  return hoy;
}

function claveDePeriodo(fecha: Date, groupBy: FallosGroupBy): string {
  const iso = fecha.toISOString();
  if (groupBy === "year") return iso.slice(0, 4);
  if (groupBy === "month") return iso.slice(0, 7);
  return iso.slice(0, 10);
}

@Injectable()
export class QuizService {
  /**
   * Las preguntas visibles aquí ya vienen filtradas por la política RLS
   * `preguntas_visibles` (heredada de `temas_visibles`) — un usuario free
   * intentando un tema de pago simplemente no ve preguntas y recibe 404,
   * igual que TemarioService.getBloque con contenido fuera de su plan.
   */
  async iniciarIntento(
    userId: string,
    plan: string,
    temaId: string,
  ): Promise<IntentoIniciado> {
    const db = getRequestDb();

    const [tema] = await db
      .select({ id: schema.temas.id })
      .from(schema.temas)
      .where(eq(schema.temas.id, temaId))
      .limit(1);
    if (!tema) throw new NotFoundException("Tema no encontrado");

    const esDiario = plan === "free";

    const preguntas = await db
      .select({
        id: schema.preguntas.id,
        enunciado: schema.preguntas.enunciado,
        opciones: schema.preguntas.opciones,
      })
      .from(schema.preguntas)
      .where(eq(schema.preguntas.temaId, temaId));
    if (preguntas.length === 0) {
      throw new NotFoundException("Este tema todavía no tiene preguntas");
    }

    if (esDiario) {
      const hoy = inicioDeHoy();
      const intentosHoy = await db
        .select({ id: schema.intentosTest.id, fecha: schema.intentosTest.fecha })
        .from(schema.intentosTest)
        .where(
          and(
            eq(schema.intentosTest.usuarioId, userId),
            eq(schema.intentosTest.esDiario, true),
          ),
        );
      if (intentosHoy.some((i) => i.fecha >= hoy)) {
        throw new ForbiddenException(
          "Ya has hecho tu test gratuito de hoy — vuelve mañana o hazte con el plan completo.",
        );
      }
    }

    const [intento] = await db
      .insert(schema.intentosTest)
      .values({ usuarioId: userId, temaId, esDiario })
      .returning({ id: schema.intentosTest.id });

    return { intentoId: intento.id, preguntas };
  }

  async responder(
    intentoId: string,
    dto: ResponderDto,
  ): Promise<RespuestaResultado> {
    const db = getRequestDb();

    // RLS (intentos_test_self) ya impide ver intentos de otro usuario: si el
    // intento no es tuyo, la fila ni siquiera llega y esto es un 404.
    const [intento] = await db
      .select({ id: schema.intentosTest.id, estado: schema.intentosTest.estado })
      .from(schema.intentosTest)
      .where(eq(schema.intentosTest.id, intentoId))
      .limit(1);
    if (!intento) throw new NotFoundException("Intento no encontrado");
    if (intento.estado === "completado") {
      throw new ConflictException("Este intento ya está finalizado");
    }

    const [pregunta] = await db
      .select({
        id: schema.preguntas.id,
        respuestaCorrecta: schema.preguntas.respuestaCorrecta,
      })
      .from(schema.preguntas)
      .where(eq(schema.preguntas.id, dto.preguntaId))
      .limit(1);
    if (!pregunta) throw new NotFoundException("Pregunta no encontrada");

    const esCorrecta = dto.opcionElegida === pregunta.respuestaCorrecta;

    const [existente] = await db
      .select({ id: schema.respuestasUsuario.id })
      .from(schema.respuestasUsuario)
      .where(
        and(
          eq(schema.respuestasUsuario.intentoId, intentoId),
          eq(schema.respuestasUsuario.preguntaId, dto.preguntaId),
        ),
      )
      .limit(1);

    if (existente) {
      await db
        .update(schema.respuestasUsuario)
        .set({ opcionElegida: dto.opcionElegida, esCorrecta, fecha: new Date() })
        .where(eq(schema.respuestasUsuario.id, existente.id));
    } else {
      await db.insert(schema.respuestasUsuario).values({
        intentoId,
        preguntaId: dto.preguntaId,
        opcionElegida: dto.opcionElegida,
        esCorrecta,
      });
    }

    return { esCorrecta, respuestaCorrecta: pregunta.respuestaCorrecta };
  }

  async finalizar(intentoId: string): Promise<ResumenIntento> {
    const db = getRequestDb();

    const [intento] = await db
      .select({ id: schema.intentosTest.id, temaId: schema.intentosTest.temaId })
      .from(schema.intentosTest)
      .where(eq(schema.intentosTest.id, intentoId))
      .limit(1);
    if (!intento) throw new NotFoundException("Intento no encontrado");

    const preguntasTema = await db
      .select({ id: schema.preguntas.id })
      .from(schema.preguntas)
      .where(eq(schema.preguntas.temaId, intento.temaId));

    const respuestas = await db
      .select({ esCorrecta: schema.respuestasUsuario.esCorrecta })
      .from(schema.respuestasUsuario)
      .where(eq(schema.respuestasUsuario.intentoId, intentoId));

    const correctas = respuestas.filter((r) => r.esCorrecta).length;
    const incorrectas = respuestas.length - correctas;
    const total = preguntasTema.length;
    const enBlanco = Math.max(0, total - respuestas.length);

    const raw = correctas - incorrectas / 3;
    const puntuacion = total > 0 ? Math.max(0, (raw / total) * 10) : 0;
    const puntuacionRedondeada = Math.round(puntuacion * 100) / 100;

    await db
      .update(schema.intentosTest)
      .set({ estado: "completado", puntuacion: puntuacionRedondeada.toFixed(2) })
      .where(eq(schema.intentosTest.id, intentoId));

    return { correctas, incorrectas, enBlanco, puntuacion: puntuacionRedondeada };
  }

  /**
   * Solo para usuarios con alguna suscripción activa (plan !== 'free') —
   * se comprueba el plan fresco en BD, no el del JWT (puede tener hasta 15
   * minutos de desfase si el usuario acaba de suscribirse).
   */
  async getFallos(userId: string, query: FallosQueryDto): Promise<FallosResumen> {
    const db = getRequestDb();

    const [user] = await db
      .select({ plan: schema.usuarios.plan })
      .from(schema.usuarios)
      .where(eq(schema.usuarios.id, userId))
      .limit(1);
    if (!user || user.plan === "free") {
      throw new ForbiddenException(
        "El seguimiento de fallos es solo para usuarios con una suscripción activa",
      );
    }

    const groupBy = query.groupBy ?? "day";
    const from = query.from ? new Date(query.from) : new Date(0);
    const to = query.to ? new Date(query.to) : new Date();

    const filas = await db
      .select({
        id: schema.respuestasUsuario.id,
        fecha: schema.respuestasUsuario.fecha,
        temaTitulo: schema.temas.titulo,
        enunciado: schema.preguntas.enunciado,
        opciones: schema.preguntas.opciones,
        opcionElegida: schema.respuestasUsuario.opcionElegida,
        respuestaCorrecta: schema.preguntas.respuestaCorrecta,
      })
      .from(schema.respuestasUsuario)
      .innerJoin(schema.preguntas, eq(schema.preguntas.id, schema.respuestasUsuario.preguntaId))
      .innerJoin(schema.temas, eq(schema.temas.id, schema.preguntas.temaId))
      .innerJoin(schema.intentosTest, eq(schema.intentosTest.id, schema.respuestasUsuario.intentoId))
      .where(
        and(
          eq(schema.intentosTest.usuarioId, userId),
          eq(schema.respuestasUsuario.esCorrecta, false),
        ),
      )
      .orderBy(schema.respuestasUsuario.fecha);

    const fallos = filas.filter((f) => f.fecha >= from && f.fecha <= to);

    const conteoPorPeriodo = new Map<string, number>();
    for (const fallo of fallos) {
      const clave = claveDePeriodo(fallo.fecha, groupBy);
      conteoPorPeriodo.set(clave, (conteoPorPeriodo.get(clave) ?? 0) + 1);
    }
    const porPeriodo = [...conteoPorPeriodo.entries()]
      .map(([periodo, total]) => ({ periodo, total }))
      .sort((a, b) => a.periodo.localeCompare(b.periodo));

    return { fallos: fallos.reverse(), porPeriodo };
  }
}
