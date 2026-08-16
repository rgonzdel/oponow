import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { SiteHeader } from "../components/SiteHeader";
import { LoadingScreen } from "../components/LoadingScreen";
import { buttonClass } from "../components/button";
import { listTemas } from "../lib/temario-client";
import {
  finalizarIntento,
  iniciarIntento,
  responder,
  type PreguntaTest,
  type ResumenIntento,
} from "../lib/quiz-client";
import { ApiError } from "../lib/api-client";

interface RespuestaLocal {
  opcionElegida: number;
  esCorrecta: boolean;
  respuestaCorrecta: number;
}

export function TestPage() {
  const { slug = "", temaId = "" } = useParams();

  const temasQuery = useQuery({
    queryKey: ["temario", "temas", slug],
    queryFn: () => listTemas(slug),
    enabled: Boolean(slug),
  });
  const tema = temasQuery.data?.find((t) => t.id === temaId);

  const [estado, setEstado] = useState<"cargando" | "en-curso" | "finalizado" | "error">("cargando");
  const [errorMsg, setErrorMsg] = useState("");
  const [intentoId, setIntentoId] = useState<string | null>(null);
  const [preguntas, setPreguntas] = useState<PreguntaTest[]>([]);
  const [index, setIndex] = useState(0);
  const [respuestas, setRespuestas] = useState<Record<string, RespuestaLocal>>({});
  const [resumen, setResumen] = useState<ResumenIntento | null>(null);
  const [enviando, setEnviando] = useState(false);

  const startedRef = useRef(false);
  useEffect(() => {
    if (startedRef.current || !temaId) return;
    startedRef.current = true;
    iniciarIntento(temaId)
      .then((data) => {
        setIntentoId(data.intentoId);
        setPreguntas(data.preguntas);
        setEstado("en-curso");
      })
      .catch((err) => {
        setErrorMsg(
          err instanceof ApiError ? err.message : "No se pudo iniciar el test",
        );
        setEstado("error");
      });
  }, [temaId]);

  if (estado === "cargando") return <LoadingScreen />;

  if (estado === "error") {
    return (
      <div>
        <SiteHeader />
        <main className="mx-auto max-w-md px-6 py-16 text-center">
          <p className="text-ink-text">{errorMsg}</p>
          <Link to={`/oposiciones/${slug}/temario`} className={buttonClass("primary", "mt-6 w-full")}>
            Volver al temario
          </Link>
        </main>
      </div>
    );
  }

  const current = preguntas[index];
  const respuestaActual = current ? respuestas[current.id] : undefined;
  const answeredCount = Object.keys(respuestas).length;

  async function elegirOpcion(i: number) {
    if (!intentoId || !current || respuestaActual || enviando) return;
    setEnviando(true);
    try {
      const { esCorrecta, respuestaCorrecta } = await responder(intentoId, current.id, i);
      setRespuestas((prev) => ({
        ...prev,
        [current.id]: { opcionElegida: i, esCorrecta, respuestaCorrecta },
      }));
    } catch {
      setErrorMsg("No se pudo guardar tu respuesta, inténtalo de nuevo.");
    } finally {
      setEnviando(false);
    }
  }

  async function finalizar() {
    if (!intentoId) return;
    setEnviando(true);
    try {
      const data = await finalizarIntento(intentoId);
      setResumen(data);
      setEstado("finalizado");
    } catch {
      setErrorMsg("No se pudo finalizar el test, inténtalo de nuevo.");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div>
      <SiteHeader />

      <main className="mx-auto grid max-w-5xl gap-8 px-6 py-10 lg:grid-cols-[1fr_260px] lg:items-start">
        <div>
          <div className="flex items-baseline justify-between">
            <span className="text-xs font-medium uppercase tracking-wide text-accent">
              {tema?.titulo ?? "Test"}
            </span>
            {estado === "en-curso" && (
              <span className="text-xs tabular-nums text-neutral-500">
                Pregunta {index + 1} de {preguntas.length}
              </span>
            )}
          </div>

          {estado === "en-curso" && current && (
            <>
              <div className="mt-2 h-1 overflow-hidden rounded-full bg-ink-surface">
                <div
                  className="h-full rounded-full bg-accent transition-[width]"
                  style={{ width: `${((index + 1) / preguntas.length) * 100}%` }}
                />
              </div>

              <div className="mt-6 rounded-lg border border-ink-divider bg-ink-surface p-6">
                <p className="text-[15px] leading-relaxed text-ink-text">
                  {current.enunciado}
                </p>

                <div className="mt-5 space-y-2">
                  {current.opciones.map((opcion, i) => {
                    let stateClasses = "border-ink-divider bg-ink hover:border-accent/50";
                    if (respuestaActual) {
                      if (i === respuestaActual.respuestaCorrecta) {
                        stateClasses = "border-emerald-400/60 bg-emerald-400/10";
                      } else if (i === respuestaActual.opcionElegida) {
                        stateClasses = "border-red-400/60 bg-red-400/10";
                      } else {
                        stateClasses = "border-ink-divider bg-ink opacity-70";
                      }
                    }

                    return (
                      <button
                        key={opcion}
                        type="button"
                        disabled={Boolean(respuestaActual) || enviando}
                        onClick={() => elegirOpcion(i)}
                        className={`flex w-full items-start gap-3 rounded-md border px-4 py-2.5 text-left text-sm transition-colors ${stateClasses}`}
                      >
                        <span
                          className={`flex h-5 w-5 flex-none items-center justify-center rounded border text-[11px] font-semibold ${
                            respuestaActual && i === respuestaActual.opcionElegida
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

                {errorMsg && (
                  <p className="mt-4 text-sm text-red-400">{errorMsg}</p>
                )}

                <div className="mt-6 flex items-center justify-between">
                  <button
                    type="button"
                    disabled={index === 0}
                    onClick={() => setIndex((i) => Math.max(0, i - 1))}
                    className={buttonClass("secondary")}
                  >
                    Anterior
                  </button>
                  {index < preguntas.length - 1 ? (
                    <button
                      type="button"
                      onClick={() => setIndex((i) => Math.min(preguntas.length - 1, i + 1))}
                      className={buttonClass("primary")}
                    >
                      Siguiente
                    </button>
                  ) : (
                    <button
                      type="button"
                      disabled={enviando}
                      onClick={finalizar}
                      className={buttonClass("primary")}
                    >
                      Finalizar test
                    </button>
                  )}
                </div>
              </div>
            </>
          )}

          {estado === "finalizado" && resumen && (
            <div className="mt-6 rounded-lg border border-accent bg-ink-surface p-6 text-center">
              <p className="text-xs text-neutral-500">Puntuación</p>
              <p className="mt-1 text-3xl font-medium tracking-tight text-ink-text">
                {resumen.puntuacion.toFixed(2)}
                <span className="text-base text-neutral-500">/10</span>
              </p>
              <p className="mt-2 text-sm text-neutral-400">
                {resumen.correctas} aciertos · {resumen.incorrectas} fallos ·{" "}
                {resumen.enBlanco} en blanco
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <Link to={`/oposiciones/${slug}/temario`} className={buttonClass("secondary")}>
                  Volver al temario
                </Link>
                <Link to="/fallos" className={buttonClass("primary")}>
                  Ver mis fallos
                </Link>
              </div>
            </div>
          )}
        </div>

        {estado === "en-curso" && (
          <aside className="space-y-4 lg:sticky lg:top-6">
            <div className="rounded-lg border border-ink-divider bg-ink-surface p-5">
              <p className="text-xs text-neutral-500">Progreso</p>
              <p className="mt-1 text-2xl font-medium tracking-tight text-ink-text">
                {answeredCount}
                <span className="text-base text-neutral-500">/{preguntas.length}</span>
              </p>
            </div>

            <div className="rounded-lg border border-ink-divider bg-ink-surface p-4">
              <div className="grid grid-cols-6 gap-1.5">
                {preguntas.map((p, i) => {
                  const r = respuestas[p.id];
                  let cellClasses = "border-ink-divider bg-ink text-neutral-500";
                  if (r) {
                    cellClasses = r.esCorrecta
                      ? "border-emerald-400/40 bg-emerald-400/10 text-emerald-400"
                      : "border-red-400/40 bg-red-400/10 text-red-400";
                  }
                  if (i === index) cellClasses += " ring-1 ring-accent";
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setIndex(i)}
                      className={`aspect-square rounded text-[10px] font-medium tabular-nums transition-colors ${cellClasses}`}
                    >
                      {i + 1}
                    </button>
                  );
                })}
              </div>
            </div>
          </aside>
        )}
      </main>
    </div>
  );
}
