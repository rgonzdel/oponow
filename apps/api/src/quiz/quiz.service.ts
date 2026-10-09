import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { and, desc, eq, gte } from "drizzle-orm";
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
  justificacionIa: string | null;
  mnemotecnia: string | null;
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

export interface ResumenDashboard {
  streak: number;
  testsRealizados: number;
  fallos: number | null;
  dias: 7 | 14 | 30;
}

function inicioDeHoy(): Date {
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  return hoy;
}

// La API corre en UTC (Render), pero los días de estudio de un opositor son
// días naturales españoles: sin fijar la zona, un test hecho a la 1 de la
// madrugada contaría para el día anterior y rompería la racha.
const ZONA_HORARIA = "Europe/Madrid";
const MS_POR_DIA = 24 * 60 * 60 * 1000;

// "en-CA" produce directamente el formato YYYY-MM-DD.
const formateadorDeDia = new Intl.DateTimeFormat("en-CA", {
  timeZone: ZONA_HORARIA,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

/** Día natural español ("YYYY-MM-DD") al que pertenece un instante. */
export function claveDeDia(fecha: Date): string {
  return formateadorDeDia.format(fecha);
}

/**
 * Ancla un día natural al mediodía UTC de esa fecha. Restar 24 h a un
 * mediodía siempre cae en el mediodía del día anterior, también en los dos
 * domingos del año en que cambia la hora — que es justo lo que rompería un
 * recorrido hecho a base de medianoches.
 */
export function anclaDeClave(clave: string): Date {
  const [anio, mes, dia] = clave.split("-").map(Number);
  return new Date(Date.UTC(anio, mes - 1, dia, 12));
}

export function claveDeAncla(ancla: Date): string {
  return ancla.toISOString().slice(0, 10);
}

export function diaAnterior(ancla: Date): Date {
  return new Date(ancla.getTime() - MS_POR_DIA);
}

function claveDePeriodo(fecha: Date, groupBy: FallosGroupBy): string {
  const dia = claveDeDia(fecha);
  if (groupBy === "year") return dia.slice(0, 4);
  if (groupBy === "month") return dia.slice(0, 7);
  return dia;
}

/**
 * Racha de días consecutivos con al menos un intento completado, contando
 * hacia atrás desde hoy. Si hoy todavía no tiene ningún intento pero ayer sí,
 * la racha sigue "viva" (no se corta hasta que se salta un día entero).
 */
export function calcularRacha(diasConIntento: Set<string>): number {
  let cursor = anclaDeClave(claveDeDia(new Date()));
  if (!diasConIntento.has(claveDeAncla(cursor))) {
    cursor = diaAnterior(cursor);
    if (!diasConIntento.has(claveDeAncla(cursor))) return 0;
  }

  let racha = 0;
  while (diasConIntento.has(claveDeAncla(cursor))) {
    racha += 1;
    cursor = diaAnterior(cursor);
  }
  return racha;
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
    /** Administración y editores revisan contenido: sin límite diario. */
    sinLimite = false,
  ): Promise<IntentoIniciado> {
    const db = getRequestDb();

    const [tema] = await db
      .select({ id: schema.temas.id })
      .from(schema.temas)
      .where(eq(schema.temas.id, temaId))
      .limit(1);
    if (!tema) throw new NotFoundException("Tema no encontrado");

    const esDiario = plan === "free" && !sinLimite;

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
      // Un examen (modo examen) también gasta el test gratuito del día.
      const [examenHoy] = await db
        .select({ id: schema.examenes.id })
        .from(schema.examenes)
        .where(and(eq(schema.examenes.usuarioId, userId), gte(schema.examenes.inicio, hoy)))
        .limit(1);
      if (examenHoy || intentosHoy.some((i) => i.fecha >= hoy)) {
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
        justificacionIa: schema.preguntas.justificacionIa,
        mnemotecnia: schema.preguntas.mnemotecnia,
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

    return {
      esCorrecta,
      respuestaCorrecta: pregunta.respuestaCorrecta,
      justificacionIa: pregunta.justificacionIa,
      mnemotecnia: pregunta.mnemotecnia,
    };
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

  /**
   * Racha y tests son visibles para todos los planes (el test diario
   * gratuito también cuenta) — solo el conteo de fallos se reserva a
   * usuarios con una suscripción activa, igual que en getFallos, pero aquí
   * se devuelve `null` en vez de un 403 para no tumbar el resto del widget.
   */
  async getResumen(userId: string, dias: 7 | 14 | 30 = 7): Promise<ResumenDashboard> {
    const db = getRequestDb();

    const [user] = await db
      .select({ plan: schema.usuarios.plan })
      .from(schema.usuarios)
      .where(eq(schema.usuarios.id, userId))
      .limit(1);

    // Ventana de `dias` días naturales españoles terminando hoy. A SQL se le
    // pide una cota inferior holgada (un día más) y el recorte fino lo hace
    // la clave de día, para que tests y fallos cuenten exactamente el mismo
    // periodo que la racha.
    const clavesVentana = new Set<string>();
    let ancla = anclaDeClave(claveDeDia(new Date()));
    for (let i = 0; i < dias; i += 1) {
      clavesVentana.add(claveDeAncla(ancla));
      ancla = diaAnterior(ancla);
    }
    const cotaInferior = ancla;

    const intentosCompletados = await db
      .select({ fecha: schema.intentosTest.fecha })
      .from(schema.intentosTest)
      .where(
        and(
          eq(schema.intentosTest.usuarioId, userId),
          eq(schema.intentosTest.estado, "completado"),
        ),
      )
      .orderBy(desc(schema.intentosTest.fecha))
      .limit(400);

    const diasConIntento = new Set(intentosCompletados.map((i) => claveDeDia(i.fecha)));
    const streak = calcularRacha(diasConIntento);
    const testsRealizados = intentosCompletados.filter((i) =>
      clavesVentana.has(claveDeDia(i.fecha)),
    ).length;

    let fallos: number | null = null;
    if (user && user.plan !== "free") {
      const filasFallos = await db
        .select({ fecha: schema.respuestasUsuario.fecha })
        .from(schema.respuestasUsuario)
        .innerJoin(
          schema.intentosTest,
          eq(schema.intentosTest.id, schema.respuestasUsuario.intentoId),
        )
        .where(
          and(
            eq(schema.intentosTest.usuarioId, userId),
            eq(schema.respuestasUsuario.esCorrecta, false),
            gte(schema.respuestasUsuario.fecha, cotaInferior),
          ),
        );
      fallos = filasFallos.filter((f) => clavesVentana.has(claveDeDia(f.fecha))).length;
    }

    return { streak, testsRealizados, fallos, dias };
  }
}
