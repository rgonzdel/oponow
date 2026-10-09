import { useEffect, useMemo, useRef, useState } from "react";
import { Link, Navigate, useParams, useSearchParams } from "react-router-dom";
import { ExamenRunner, formatearTiempo, type RespuestaExamen } from "../components/ExamenRunner";
import { useAuth } from "../auth/AuthContext";
import { SiteHeader } from "../components/SiteHeader";
import { buttonClass } from "../components/button";
import { OPOSICIONES } from "@oponow/shared-types";
import simulacroData from "../data/tai-simulacro-2024.json";

interface Pregunta {
  n: number;
  enunciado: string;
  opciones: string[];
  correcta: number | null;
  anulada?: boolean;
}

interface Entry extends Pregunta {
  pool: "principal" | "reserva";
  key: string;
}

const DATA = simulacroData as {
  examen: string;
  preguntas: Pregunta[];
  reserva: Pregunta[];
};

const ALL: Entry[] = [
  ...DATA.preguntas.map((q): Entry => ({ ...q, pool: "principal", key: `principal-${q.n}` })),
  ...DATA.reserva.map((q): Entry => ({ ...q, pool: "reserva", key: `reserva-${q.n}` })),
];

const TOTAL_SECONDS = 90 * 60;

// ── Modo examen del simulacro ────────────────────────────────────────────
// Es público (sin cuenta), así que la sesión vive en el navegador: el fin del
// tiempo se guarda como instante, de modo que recargar no lo detiene.

interface SesionExamen {
  fin: number;
  inicio: number;
  respuestas: Record<string, RespuestaExamen>;
  modoAvanzado: boolean;
  maxSalidas: number;
  salidas: number;
  segundosFuera: number;
}

interface InfoExamenSimulacro {
  motivo: "usuario" | "tiempo" | "salidas";
  segundosUsados: number;
  modoAvanzado: boolean;
  salidas: number;
  segundosFuera: number;
}

const CLAVE_SESION = (slug: string) => `oponow:simulacro-examen:${slug}`;

function leerSesion(slug: string): SesionExamen | null {
  try {
    const raw = localStorage.getItem(CLAVE_SESION(slug));
    return raw ? (JSON.parse(raw) as SesionExamen) : null;
  } catch {
    return null;
  }
}

function guardarSesion(slug: string, sesion: SesionExamen | null) {
  try {
    if (sesion) localStorage.setItem(CLAVE_SESION(slug), JSON.stringify(sesion));
    else localStorage.removeItem(CLAVE_SESION(slug));
  } catch {
    // Sin almacenamiento (modo privado): el examen funciona igual, sin poder retomarlo.
  }
}

const PREGUNTAS_EXAMEN = DATA.preguntas.map((q) => ({
  id: `principal-${q.n}`,
  enunciado: q.enunciado,
  opciones: q.opciones,
}));

function SimulacroExamen({
  slug,
  titulo,
  onTerminar,
}: {
  slug: string;
  titulo: string;
  onTerminar: (respuestas: Record<string, number>, info: InfoExamenSimulacro) => void;
}) {
  const [sesion, setSesion] = useState<SesionExamen | null>(() => leerSesion(slug));
  const [modoAvanzado, setModoAvanzado] = useState(false);
  const motivoFinal = useRef<InfoExamenSimulacro["motivo"]>("usuario");

  if (!sesion) {
    return (
      <div>
      <SiteHeader />
      <main className="mx-auto max-w-xl px-6 py-12">
        <div className="rounded-lg border border-ink-divider bg-ink-surface p-6">
          <span className="text-xs font-medium uppercase tracking-wide text-accent">Modo examen</span>
          <h1 className="mt-2 text-xl font-medium text-ink-text">{titulo}</h1>
          <p className="mt-3 text-sm text-neutral-400">
            {PREGUNTAS_EXAMEN.length} preguntas en 90 minutos. No verás las soluciones hasta entregarlo; cada fallo resta
            un tercio de acierto y, al acabarse el tiempo, el examen se entrega solo.
          </p>
          <label className="mt-5 flex cursor-pointer items-start gap-3 rounded-md border border-ink-divider bg-ink p-4">
            <input
              type="checkbox"
              checked={modoAvanzado}
              onChange={(e) => setModoAvanzado(e.target.checked)}
              className="mt-1 accent-[#9184d9]"
            />
            <span>
              <span className="text-sm font-medium text-ink-text">Modo avanzado</span>
              <span className="mt-1 block text-xs text-neutral-400">
                Pantalla completa obligatoria; con 3 salidas (cambiar de pestaña, minimizar, salir de pantalla
                completa) el examen se entrega solo. Sin copiar ni pegar.
              </span>
            </span>
          </label>
          <button
            type="button"
            onClick={() => {
              const nueva: SesionExamen = {
                inicio: Date.now(),
                fin: Date.now() + TOTAL_SECONDS * 1000,
                respuestas: {},
                modoAvanzado,
                maxSalidas: 3,
                salidas: 0,
                segundosFuera: 0,
              };
              guardarSesion(slug, nueva);
              setSesion(nueva);
            }}
            className={buttonClass("primary", "mt-6 w-full")}
          >
            Empezar examen
          </button>
          <Link to={`/oposiciones/${slug}/simulacro`} className="mt-3 block text-center text-xs text-neutral-500 hover:text-accent">
            Prefiero practicar sin tiempo límite
          </Link>
        </div>
      </main>
      </div>
    );
  }

  const actualizar = (cambio: (s: SesionExamen) => SesionExamen) => {
    const nueva = cambio(leerSesion(slug) ?? sesion);
    guardarSesion(slug, nueva);
    return nueva;
  };

  const terminar = () => {
    const final = leerSesion(slug) ?? sesion;
    guardarSesion(slug, null);
    const respuestas: Record<string, number> = {};
    for (const [id, r] of Object.entries(final.respuestas)) {
      if (r.opcionElegida !== null) respuestas[id] = r.opcionElegida;
    }
    onTerminar(respuestas, {
      motivo: motivoFinal.current,
      segundosUsados: Math.min(TOTAL_SECONDS, Math.round((Math.min(Date.now(), final.fin) - final.inicio) / 1000)),
      modoAvanzado: final.modoAvanzado,
      salidas: final.salidas,
      segundosFuera: final.segundosFuera,
    });
  };

  return (
    <ExamenRunner
      titulo={titulo}
      subtitulo={sesion.modoAvanzado ? "Simulacro oficial · modo avanzado" : "Simulacro oficial"}
      preguntas={PREGUNTAS_EXAMEN}
      respuestasIniciales={sesion.respuestas}
      segundosRestantes={Math.max(0, Math.round((sesion.fin - Date.now()) / 1000))}
      duracionSegundos={TOTAL_SECONDS}
      modoAvanzado={sesion.modoAvanzado}
      maxSalidas={sesion.maxSalidas}
      salidasIniciales={sesion.salidas}
      guardar={async (id, r) => {
        actualizar((s) => ({ ...s, respuestas: { ...s.respuestas, [id]: r } }));
      }}
      registrarSalida={async (fase, segundos) => {
        const s = actualizar((x) =>
          fase === "salida" ? { ...x, salidas: x.salidas + 1 } : { ...x, segundosFuera: x.segundosFuera + segundos },
        );
        const entregado = s.salidas >= s.maxSalidas;
        if (entregado) motivoFinal.current = "salidas";
        return { salidas: s.salidas, entregado };
      }}
      entregar={async (motivo) => {
        motivoFinal.current = motivo;
      }}
      alTerminar={terminar}
    />
  );
}

function formatTime(totalSeconds: number) {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m < 10 ? "0" : ""}${m}:${s < 10 ? "0" : ""}${s}`;
}

export function SimulacroPage() {
  const { slug = "" } = useParams();
  const op = OPOSICIONES.find((o) => o.slug === slug);
  const { status } = useAuth();
  const isAuthenticated = status === "authenticated";

  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [finished, setFinished] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(TOTAL_SECONDS);
  const [params, setParams] = useSearchParams();
  const [infoExamen, setInfoExamen] = useState<InfoExamenSimulacro | null>(null);

  useEffect(() => {
    if (finished) return;
    const id = setInterval(
      () => setSecondsLeft((s) => Math.max(0, s - 1)),
      1000,
    );
    return () => clearInterval(id);
  }, [finished]);

  const current = ALL[index];
  const poolQuestions = useMemo(
    () => ALL.filter((e) => e.pool === current.pool),
    [current.pool],
  );
  const posInPool = poolQuestions.findIndex((e) => e.key === current.key) + 1;

  const { correct, wrong, blank, score } = useMemo(() => {
    let correctCount = 0;
    let wrongCount = 0;
    let blankCount = 0;
    let valid = 0;
    for (const q of DATA.preguntas) {
      if (q.anulada) continue;
      valid++;
      const a = answers[`principal-${q.n}`];
      if (a === undefined) blankCount++;
      else if (a === q.correcta) correctCount++;
      else wrongCount++;
    }
    const raw = correctCount - wrongCount / 3;
    const computedScore = valid > 0 ? Math.max(0, (raw / valid) * 10) : 0;
    return { correct: correctCount, wrong: wrongCount, blank: blankCount, score: computedScore };
  }, [answers]);

  if (!op || !op.disponible) {
    return <Navigate to="/oposiciones" replace />;
  }

  if (params.get("modo") === "examen" && !finished) {
    return (
      <SimulacroExamen
        slug={op.slug}
        titulo={`${op.siglas} · Primera parte · convocatoria 2024`}
        onTerminar={(respuestas, info) => {
          setAnswers(respuestas);
          setFinished(true);
          setIndex(0);
          setInfoExamen(info);
          setParams({}, { replace: true });
        }}
      />
    );
  }

  const answeredCount = DATA.preguntas.filter(
    (q) => answers[`principal-${q.n}`] !== undefined,
  ).length;

  return (
    <div>
      <SiteHeader />

      <div className="border-b border-ink-divider bg-ink-surface">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-3 px-6 py-3">
          <span className="text-xs font-medium uppercase tracking-wide text-accent">
            Prueba gratuita — sin necesidad de cuenta
          </span>
          <span className="text-xs text-neutral-500">
            {op.siglas} · Primera parte · convocatoria 2024
          </span>
          <div className="ml-auto flex items-center gap-2 rounded-md border border-ink-divider bg-ink px-3 py-1.5 text-xs font-medium tabular-nums text-neutral-300">
            {formatTime(Math.max(secondsLeft, 0))}
          </div>
        </div>
      </div>

      <main className="mx-auto grid max-w-5xl gap-8 px-6 py-10 lg:grid-cols-[1fr_300px] lg:items-start">
        <div>
          <div className="flex items-baseline justify-between">
            <span className="text-xs font-medium uppercase tracking-wide text-accent">
              {current.pool === "reserva" ? "Pregunta de reserva" : "Primera parte"}
            </span>
            <span className="text-xs tabular-nums text-neutral-500">
              Pregunta {posInPool} de {poolQuestions.length}
            </span>
          </div>
          <div className="mt-2 h-1 overflow-hidden rounded-full bg-ink-surface">
            <div
              className="h-full rounded-full bg-accent transition-[width]"
              style={{ width: `${(posInPool / poolQuestions.length) * 100}%` }}
            />
          </div>

          <div className="mt-6 rounded-lg border border-ink-divider bg-ink-surface p-6">
            {finished && current.anulada && (
              <p className="mb-4 rounded-md border border-amber-400/30 bg-amber-400/10 px-3 py-2 text-xs font-medium text-amber-400">
                Pregunta anulada por el tribunal — no computa en la corrección
              </p>
            )}
            <p className="text-[15px] leading-relaxed text-ink-text">
              {current.enunciado}
            </p>

            <div className="mt-5 space-y-2">
              {current.opciones.map((opcion, i) => {
                const selected = answers[current.key] === i;
                let stateClasses =
                  "border-ink-divider bg-ink hover:border-accent/50";
                if (finished) {
                  if (!current.anulada && i === current.correcta) {
                    stateClasses = "border-emerald-400/60 bg-emerald-400/10";
                  } else if (selected && i !== current.correcta) {
                    stateClasses = "border-red-400/60 bg-red-400/10";
                  } else {
                    stateClasses = "border-ink-divider bg-ink opacity-70";
                  }
                } else if (selected) {
                  stateClasses = "border-accent bg-accent/10";
                }

                return (
                  <button
                    key={opcion}
                    type="button"
                    disabled={finished}
                    onClick={() =>
                      setAnswers((prev) => ({ ...prev, [current.key]: i }))
                    }
                    className={`flex w-full items-start gap-3 rounded-md border px-4 py-2.5 text-left text-sm transition-colors ${stateClasses}`}
                  >
                    <span
                      className={`flex h-5 w-5 flex-none items-center justify-center rounded border text-[11px] font-semibold ${
                        selected
                          ? "border-accent bg-accent text-ink"
                          : "border-ink-divider text-neutral-500"
                      }`}
                    >
                      {String.fromCharCode(97 + i)}
                    </span>
                    <span className="text-neutral-200">{opcion}</span>
                  </button>
                );
              })}
            </div>

            <div className="mt-6 flex items-center justify-between">
              <button
                type="button"
                disabled={index === 0}
                onClick={() => setIndex((i) => Math.max(0, i - 1))}
                className={buttonClass("secondary")}
              >
                Anterior
              </button>
              <button
                type="button"
                onClick={() => setIndex((i) => (i + 1) % ALL.length)}
                className={buttonClass("primary")}
              >
                {index === ALL.length - 1 ? "Ir a la primera" : "Siguiente"}
              </button>
            </div>
          </div>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-6">
          {finished ? (
            <div className="rounded-lg border border-accent bg-ink-surface p-5">
              <p className="text-xs text-neutral-500">Puntuación estimada</p>
              <p className="mt-1 text-3xl font-medium tracking-tight text-ink-text">
                {score.toFixed(2)}
                <span className="text-base text-neutral-500">/10</span>
              </p>
              <p className="mt-2 text-xs text-neutral-500">
                {correct} aciertos · {wrong} fallos · {blank} en blanco
              </p>
              {infoExamen && (
                <p className="mt-2 text-xs text-neutral-400">
                  Modo examen ·{" "}
                  {infoExamen.motivo === "tiempo"
                    ? "entregado al acabarse el tiempo"
                    : infoExamen.motivo === "salidas"
                      ? "entregado por salir de la pantalla"
                      : "entregado por ti"}{" "}
                  · {formatearTiempo(infoExamen.segundosUsados)} usados
                  {infoExamen.modoAvanzado ? ` · ${infoExamen.salidas} salidas` : ""}
                </p>
              )}
            </div>
          ) : (
            <div className="rounded-lg border border-ink-divider bg-ink-surface p-5">
              <p className="text-xs text-neutral-500">Progreso</p>
              <p className="mt-1 text-2xl font-medium tracking-tight text-ink-text">
                {answeredCount}
                <span className="text-base text-neutral-500">
                  /{DATA.preguntas.length}
                </span>
              </p>
            </div>
          )}

          <div className="rounded-lg border border-ink-divider bg-ink-surface p-4">
            <div className="grid grid-cols-8 gap-1.5">
              {DATA.preguntas.map((q) => {
                const key = `principal-${q.n}`;
                const isCurrent = current.key === key;
                const answered = answers[key] !== undefined;
                let cellClasses = "border-ink-divider bg-ink text-neutral-500";
                if (finished) {
                  if (q.anulada) cellClasses = "border-amber-400/40 bg-amber-400/10 text-amber-400";
                  else if (answered) {
                    cellClasses =
                      answers[key] === q.correcta
                        ? "border-emerald-400/40 bg-emerald-400/10 text-emerald-400"
                        : "border-red-400/40 bg-red-400/10 text-red-400";
                  }
                } else if (answered) {
                  cellClasses = "border-accent/50 bg-accent/10 text-accent";
                }
                if (isCurrent) cellClasses += " ring-1 ring-accent";

                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setIndex(ALL.findIndex((e) => e.key === key))}
                    className={`aspect-square rounded text-[10px] font-medium tabular-nums transition-colors ${cellClasses}`}
                  >
                    {q.n}
                  </button>
                );
              })}
            </div>
          </div>

          {!finished && (
            <Link to="?modo=examen" className={buttonClass("secondary", "w-full")}>
              Hacerlo en modo examen
            </Link>
          )}

          {!finished ? (
            <button
              type="button"
              onClick={() => setFinished(true)}
              className={buttonClass("primary", "w-full")}
            >
              Finalizar test
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                setFinished(false);
                setAnswers({});
                setIndex(0);
                setSecondsLeft(TOTAL_SECONDS);
                setInfoExamen(null);
              }}
              className={buttonClass("secondary", "w-full")}
            >
              Repetir
            </button>
          )}

          <div className="rounded-lg border border-ink-divider bg-ink-surface p-4 text-xs text-neutral-400">
            <p>
              Esto es un extracto de la Primera Parte de 2024 (85 preguntas).
              Con una cuenta accedes a las {op.totalPreguntas} preguntas
              reales de {op.aniosExamenes.join(", ")}, más el temario
              completo.
            </p>
            <Link
              to={
                isAuthenticated
                  ? `/checkout?oposicion=${op.slug}`
                  : `/register?next=${encodeURIComponent(`/checkout?oposicion=${op.slug}`)}`
              }
              className={buttonClass("primary", "mt-3 w-full")}
            >
              Empezar prueba gratis de 7 días
            </Link>
          </div>
        </aside>
      </main>
    </div>
  );
}
