import { Injectable, UnauthorizedException } from "@nestjs/common";
import { and, desc, eq, inArray, sql } from "drizzle-orm";
import { schema } from "@oponow/db";
import { getRequestDb } from "../database/request-context";
import {
  anclaDeClave,
  calcularRacha,
  claveDeAncla,
  claveDeDia,
  diaAnterior,
} from "../quiz/quiz.service";
import { generarInformePdf } from "./informe-pdf.util";

export type PeriodoInforme = 7 | 30 | 90 | 0; // 0 = desde el principio

// Un tema necesita algunas respuestas para que su porcentaje signifique algo
// al compararlo con otros (con 1 respuesta, un 100 % no dice nada).
const MIN_RESPUESTAS_RANKING = 5;
const MAS_FALLADAS = 5;

export interface TemaInforme {
  oposicion: string;
  orden: number;
  titulo: string;
  tests: number;
  respondidas: number;
  aciertos: number;
  fallos: number;
  porcentaje: number;
  notaMedia: number | null;
}

export interface DatosInforme {
  email: string;
  generado: Date;
  dias: PeriodoInforme;
  /** Primer día del periodo (YYYY-MM-DD) y último (hoy). */
  desde: string | null;
  hasta: string;
  oposiciones: string[];
  kpis: {
    tests: number;
    respondidas: number;
    aciertos: number;
    fallos: number;
    porcentaje: number | null;
    notaMedia: number | null;
    racha: number;
    diasActivos: number;
  };
  temas: TemaInforme[];
  mejores: TemaInforme[];
  peores: TemaInforme[];
  agrupacion: "dia" | "mes";
  actividad: { clave: string; tests: number; aciertos: number; fallos: number }[];
  /** null si el plan no incluye el seguimiento de fallos. */
  masFalladas: { enunciado: string; tema: string; veces: number; correcta: string }[] | null;
  flashcards: { estudiadas: number; dominadas: number; pendientes: number } | null;
}

@Injectable()
export class InformeService {
  async generarPdf(userId: string, dias: PeriodoInforme): Promise<{ pdf: Buffer; nombre: string }> {
    const datos = await this.datos(userId, dias);
    const pdf = await generarInformePdf(datos);
    return { pdf, nombre: `informe-oponow-${datos.hasta}.pdf` };
  }

  async datos(userId: string, dias: PeriodoInforme): Promise<DatosInforme> {
    const db = getRequestDb();
    const [user] = await db
      .select({ email: schema.usuarios.email, plan: schema.usuarios.plan })
      .from(schema.usuarios)
      .where(eq(schema.usuarios.id, userId))
      .limit(1);
    if (!user) throw new UnauthorizedException();

    const hoy = claveDeDia(new Date());
    // Días del periodo, del más antiguo a hoy (días naturales españoles,
    // igual que la racha y el resumen del panel).
    const clavesPeriodo: string[] = [];
    if (dias > 0) {
      let ancla = anclaDeClave(hoy);
      for (let i = 0; i < dias; i++) {
        clavesPeriodo.unshift(claveDeAncla(ancla));
        ancla = diaAnterior(ancla);
      }
    }
    const enPeriodo = (fecha: Date) => dias === 0 || clavesPeriodo.includes(claveDeDia(fecha));

    // Intentos completados (RLS: solo los del propio usuario).
    const intentos = await db
      .select({
        id: schema.intentosTest.id,
        fecha: schema.intentosTest.fecha,
        puntuacion: schema.intentosTest.puntuacion,
        temaId: schema.intentosTest.temaId,
        examenId: schema.intentosTest.examenId,
      })
      .from(schema.intentosTest)
      .where(and(eq(schema.intentosTest.usuarioId, userId), eq(schema.intentosTest.estado, "completado")))
      .orderBy(desc(schema.intentosTest.fecha));
    const racha = calcularRacha(new Set(intentos.map((i) => claveDeDia(i.fecha))));
    const intentosPeriodo = intentos.filter((i) => enPeriodo(i.fecha));
    // Un examen de varios temas deja un intento por tema: en los totales y en
    // la actividad diaria cuenta como un solo test.
    const contarTests = (lista: typeof intentos) => new Set(lista.map((i) => i.examenId ?? i.id)).size;

    const respuestas = (
      await db
        .select({
          fecha: schema.respuestasUsuario.fecha,
          esCorrecta: schema.respuestasUsuario.esCorrecta,
          preguntaId: schema.respuestasUsuario.preguntaId,
          intentoId: schema.respuestasUsuario.intentoId,
          temaId: schema.intentosTest.temaId,
        })
        .from(schema.respuestasUsuario)
        .innerJoin(schema.intentosTest, eq(schema.intentosTest.id, schema.respuestasUsuario.intentoId))
        .where(eq(schema.intentosTest.usuarioId, userId))
    ).filter((r) => enPeriodo(r.fecha));

    // Datos de los temas implicados. Se leen con el rol de la petición: si
    // el usuario ya no tiene acceso a un tema, se muestra sin título.
    const temaIds = [...new Set([...intentosPeriodo.map((i) => i.temaId), ...respuestas.map((r) => r.temaId)])];
    const infoTemas = temaIds.length
      ? await db
          .select({
            id: schema.temas.id,
            orden: schema.temas.orden,
            titulo: schema.temas.titulo,
            oposicion: schema.oposiciones.nombre,
          })
          .from(schema.temas)
          .innerJoin(schema.oposiciones, eq(schema.oposiciones.id, schema.temas.oposicionId))
          .where(inArray(schema.temas.id, temaIds))
      : [];
    const temaPorId = new Map(infoTemas.map((t) => [t.id, t]));

    const temas: TemaInforme[] = temaIds
      .map((id) => {
        const info = temaPorId.get(id);
        const resp = respuestas.filter((r) => r.temaId === id);
        const tests = intentosPeriodo.filter((i) => i.temaId === id);
        const aciertos = resp.filter((r) => r.esCorrecta).length;
        const notas = tests.map((t) => Number(t.puntuacion)).filter((n) => Number.isFinite(n));
        return {
          oposicion: info?.oposicion ?? "",
          orden: info?.orden ?? 0,
          titulo: info?.titulo ?? "Tema no disponible en tu plan actual",
          tests: tests.length,
          respondidas: resp.length,
          aciertos,
          fallos: resp.length - aciertos,
          porcentaje: resp.length ? Math.round((aciertos / resp.length) * 100) : 0,
          notaMedia: notas.length ? redondear(notas.reduce((a, b) => a + b, 0) / notas.length) : null,
        };
      })
      .filter((t) => t.respondidas > 0 || t.tests > 0)
      .sort((a, b) => a.oposicion.localeCompare(b.oposicion) || a.orden - b.orden);

    // Mejor y peor: entre los temas con respuestas suficientes (o, si no hay
    // ninguno, entre todos los que tienen alguna respuesta).
    const conDatos = temas.filter((t) => t.respondidas > 0);
    const comparables = conDatos.filter((t) => t.respondidas >= MIN_RESPUESTAS_RANKING);
    const base = comparables.length >= 2 ? comparables : conDatos;
    const ordenados = [...base].sort((a, b) => b.porcentaje - a.porcentaje || b.respondidas - a.respondidas);
    const n = Math.min(3, Math.floor(ordenados.length / 2) || (ordenados.length ? 1 : 0));
    // Un tema flojo no es "lo que mejor llevas" aunque sea el único: los
    // mejores necesitan al menos un 50 % y los peores estar por debajo del 70 %.
    const mejores = ordenados.slice(0, Math.max(n, 1)).filter((t) => t.porcentaje >= 50).slice(0, 3);
    const peores = [...ordenados]
      .reverse()
      .filter((t) => t.porcentaje < 70 && !mejores.includes(t))
      .slice(0, Math.max(n, 1));

    // Actividad: por día (periodos de hasta 90 días) o por mes (todo).
    const agrupacion = dias === 0 ? "mes" : "dia";
    const claveDe = (fecha: Date) => (agrupacion === "mes" ? claveDeDia(fecha).slice(0, 7) : claveDeDia(fecha));
    const claves =
      agrupacion === "dia" ? clavesPeriodo : mesesEntre(intentos.at(-1)?.fecha ?? new Date(), new Date());
    const actividad = claves.map((clave) => {
      const resp = respuestas.filter((r) => claveDe(r.fecha) === clave);
      const aciertos = resp.filter((r) => r.esCorrecta).length;
      return {
        clave,
        tests: contarTests(intentosPeriodo.filter((i) => claveDe(i.fecha) === clave)),
        aciertos,
        fallos: resp.length - aciertos,
      };
    });

    // Preguntas más falladas: como el seguimiento de fallos de la web, solo
    // con una suscripción activa.
    let masFalladas: DatosInforme["masFalladas"] = null;
    if (user.plan !== "free") {
      const veces = new Map<string, number>();
      for (const r of respuestas) if (!r.esCorrecta) veces.set(r.preguntaId, (veces.get(r.preguntaId) ?? 0) + 1);
      const top = [...veces.entries()].sort((a, b) => b[1] - a[1]).slice(0, MAS_FALLADAS);
      const preguntas = top.length
        ? await db
            .select({
              id: schema.preguntas.id,
              enunciado: schema.preguntas.enunciado,
              opciones: schema.preguntas.opciones,
              correcta: schema.preguntas.respuestaCorrecta,
              tema: schema.temas.titulo,
            })
            .from(schema.preguntas)
            .innerJoin(schema.temas, eq(schema.temas.id, schema.preguntas.temaId))
            .where(inArray(schema.preguntas.id, top.map(([id]) => id)))
        : [];
      masFalladas = top.flatMap(([id, n]) => {
        const p = preguntas.find((x) => x.id === id);
        return p ? [{ enunciado: p.enunciado, tema: p.tema, veces: n, correcta: p.opciones[p.correcta] ?? "" }] : [];
      });
    }

    const [fc] = await db
      .select({
        estudiadas: sql<number>`count(*)::int`,
        dominadas: sql<number>`count(*) filter (where ${schema.flashcardsProgreso.caja} >= 4)::int`,
        pendientes: sql<number>`count(*) filter (where ${schema.flashcardsProgreso.proximaRevision} <= now())::int`,
      })
      .from(schema.flashcardsProgreso)
      .where(eq(schema.flashcardsProgreso.usuarioId, userId));

    const aciertos = respuestas.filter((r) => r.esCorrecta).length;
    const notas = intentosPeriodo.map((i) => Number(i.puntuacion)).filter((x) => Number.isFinite(x));
    return {
      email: user.email ?? "",
      generado: new Date(),
      dias,
      desde: dias > 0 ? clavesPeriodo[0] : intentos.length ? claveDeDia(intentos.at(-1)!.fecha) : null,
      hasta: hoy,
      oposiciones: [...new Set(temas.map((t) => t.oposicion).filter(Boolean))],
      kpis: {
        tests: contarTests(intentosPeriodo),
        respondidas: respuestas.length,
        aciertos,
        fallos: respuestas.length - aciertos,
        porcentaje: respuestas.length ? Math.round((aciertos / respuestas.length) * 100) : null,
        notaMedia: notas.length ? redondear(notas.reduce((a, b) => a + b, 0) / notas.length) : null,
        racha,
        diasActivos: new Set(intentosPeriodo.map((i) => claveDeDia(i.fecha))).size,
      },
      temas,
      mejores,
      peores,
      agrupacion,
      actividad,
      masFalladas,
      flashcards: fc && fc.estudiadas > 0 ? fc : null,
    };
  }
}

function redondear(n: number): number {
  return Math.round(n * 10) / 10;
}

/** Meses "YYYY-MM" desde el de `desde` hasta el de `hasta`, ambos incluidos. */
function mesesEntre(desde: Date, hasta: Date): string[] {
  const inicio = claveDeDia(desde).slice(0, 7);
  const fin = claveDeDia(hasta).slice(0, 7);
  const meses: string[] = [];
  let [a, m] = inicio.split("-").map(Number);
  for (let i = 0; i < 120; i++) {
    const clave = `${a}-${String(m).padStart(2, "0")}`;
    meses.push(clave);
    if (clave >= fin) break;
    m += 1;
    if (m > 12) { m = 1; a += 1; }
  }
  return meses;
}
