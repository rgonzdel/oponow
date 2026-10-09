import { useCallback, useEffect, useRef, useState } from "react";
import { buttonClass } from "./button";

export interface PreguntaExamen {
  id: string;
  enunciado: string;
  opciones: string[];
}

export interface RespuestaExamen {
  opcionElegida: number | null;
  marcada: boolean;
}

interface Props {
  titulo: string;
  subtitulo?: string;
  preguntas: PreguntaExamen[];
  respuestasIniciales: Record<string, RespuestaExamen>;
  /** Segundos que quedan en el momento de montar el componente. */
  segundosRestantes: number;
  /** Duración total del examen, para avisar con el reloj en proporción. */
  duracionSegundos: number;
  modoAvanzado: boolean;
  maxSalidas: number;
  salidasIniciales: number;
  guardar: (preguntaId: string, respuesta: RespuestaExamen) => Promise<void>;
  registrarSalida: (fase: "salida" | "vuelta", segundosFuera: number) => Promise<{ salidas: number; entregado: boolean }>;
  entregar: (motivo: "usuario" | "tiempo") => Promise<void>;
  /** Se llama cuando el examen ya está entregado (por cualquier motivo). */
  alTerminar: () => void;
}

const VACIA: RespuestaExamen = { opcionElegida: null, marcada: false };

export function formatearTiempo(segundos: number) {
  const s = Math.max(0, Math.round(segundos));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const ss = s % 60;
  const dos = (n: number) => String(n).padStart(2, "0");
  return h > 0 ? `${h}:${dos(m)}:${dos(ss)}` : `${dos(m)}:${dos(ss)}`;
}

const puedePantallaCompleta = () =>
  typeof document !== "undefined" && typeof document.documentElement.requestFullscreen === "function";

async function entrarPantallaCompleta() {
  if (!puedePantallaCompleta() || document.fullscreenElement) return;
  try {
    await document.documentElement.requestFullscreen({ navigationUI: "hide" });
  } catch {
    // El navegador puede negarlo (p. ej. iOS): el examen sigue igualmente.
  }
}

function salirPantallaCompleta() {
  if (document.fullscreenElement) document.exitFullscreen().catch(() => undefined);
}

/**
 * Pantalla de examen cronometrado, común al examen generado (datos en la API)
 * y al simulacro oficial (datos locales): temporizador, hoja de respuestas,
 * preguntas marcadas para revisar y, en modo avanzado, pantalla completa
 * obligatoria con control de salidas. Durante el examen no se muestra si una
 * respuesta es correcta.
 */
export function ExamenRunner(props: Props) {
  const { preguntas, modoAvanzado, maxSalidas } = props;
  const [indice, setIndice] = useState(0);
  const [respuestas, setRespuestas] = useState(props.respuestasIniciales);
  const [ahora, setAhora] = useState(() => Date.now());
  const fin = useRef(Date.now() + props.segundosRestantes * 1000);
  const [empezado, setEmpezado] = useState(!modoAvanzado);
  const [salidas, setSalidas] = useState(props.salidasIniciales);
  const [fuera, setFuera] = useState(false);
  const fueraDesde = useRef<number | null>(null);
  const [confirmando, setConfirmando] = useState(false);
  const [entregando, setEntregando] = useState(false);
  const terminado = useRef(false);
  const [aviso, setAviso] = useState("");

  const restante = Math.max(0, Math.ceil((fin.current - ahora) / 1000));

  const terminar = useCallback(() => {
    if (terminado.current) return;
    terminado.current = true;
    salirPantallaCompleta();
    props.alTerminar();
  }, [props]);

  const entregar = useCallback(
    async (motivo: "usuario" | "tiempo") => {
      if (terminado.current || entregando) return;
      setEntregando(true);
      try {
        await props.entregar(motivo);
      } catch {
        // Si falla (p. ej. ya estaba entregado), la vista de resultado lo aclara.
      }
      terminar();
    },
    [entregando, props, terminar],
  );

  // Reloj: el fin lo fija el servidor; aquí solo se cuenta hacia atrás.
  useEffect(() => {
    const id = window.setInterval(() => setAhora(Date.now()), 500);
    return () => window.clearInterval(id);
  }, []);
  useEffect(() => {
    if (restante === 0) void entregar("tiempo");
  }, [restante, entregar]);

  // Aviso del navegador si se intenta cerrar o recargar la página.
  useEffect(() => {
    const avisar = (e: BeforeUnloadEvent) => {
      if (terminado.current) return;
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", avisar);
    return () => window.removeEventListener("beforeunload", avisar);
  }, []);

  // Modo avanzado: cualquier salida de la pantalla del examen cuenta una vez
  // (cambiar de pestaña, minimizar, Alt+Tab o salir de pantalla completa).
  useEffect(() => {
    if (!modoAvanzado || !empezado) return;
    const salir = () => {
      if (terminado.current || fueraDesde.current !== null) return;
      fueraDesde.current = Date.now();
      setFuera(true);
      // Se cuenta ya en pantalla; el servidor confirma el número real.
      setSalidas((n) => n + 1);
      props
        .registrarSalida("salida", 0)
        .then((r) => {
          setSalidas(r.salidas);
          if (r.entregado) terminar();
        })
        .catch(() => undefined);
    };
    const alCambiarVisibilidad = () => {
      if (document.visibilityState === "hidden") salir();
    };
    const alCambiarPantallaCompleta = () => {
      if (puedePantallaCompleta() && !document.fullscreenElement) salir();
    };
    document.addEventListener("visibilitychange", alCambiarVisibilidad);
    window.addEventListener("blur", salir);
    document.addEventListener("fullscreenchange", alCambiarPantallaCompleta);
    return () => {
      document.removeEventListener("visibilitychange", alCambiarVisibilidad);
      window.removeEventListener("blur", salir);
      document.removeEventListener("fullscreenchange", alCambiarPantallaCompleta);
    };
  }, [modoAvanzado, empezado, props, terminar]);

  // Modo avanzado: sin copiar, cortar, pegar ni menú contextual.
  useEffect(() => {
    if (!modoAvanzado) return;
    const bloquear = (e: Event) => e.preventDefault();
    const eventos = ["copy", "cut", "paste", "contextmenu", "dragstart"] as const;
    for (const ev of eventos) document.addEventListener(ev, bloquear);
    return () => {
      for (const ev of eventos) document.removeEventListener(ev, bloquear);
    };
  }, [modoAvanzado]);

  // Al desmontar (entregado, o si se navega fuera) se sale de pantalla completa.
  useEffect(() => () => salirPantallaCompleta(), []);

  const volver = async () => {
    await entrarPantallaCompleta();
    const desde = fueraDesde.current;
    fueraDesde.current = null;
    setFuera(false);
    if (desde !== null && !terminado.current) {
      props.registrarSalida("vuelta", Math.round((Date.now() - desde) / 1000)).catch(() => undefined);
    }
  };

  const actual = preguntas[indice];
  const respuestaActual = (actual && respuestas[actual.id]) || VACIA;

  const cambiar = (preguntaId: string, cambio: Partial<RespuestaExamen>) => {
    const nueva = { ...(respuestas[preguntaId] ?? VACIA), ...cambio };
    setRespuestas((prev) => ({ ...prev, [preguntaId]: nueva }));
    setAviso("");
    props.guardar(preguntaId, nueva).catch((err: unknown) => {
      const status = (err as { status?: number })?.status;
      if (status === 409) terminar();
      else setAviso("No se ha podido guardar la última respuesta. Revisa tu conexión y vuelve a marcarla.");
    });
  };

  const elegir = (opcion: number) => {
    if (!actual) return;
    // Pulsar otra vez la opción elegida la deja en blanco.
    cambiar(actual.id, { opcionElegida: respuestaActual.opcionElegida === opcion ? null : opcion });
  };

  // Atajos: a-d para responder, flechas para moverse.
  useEffect(() => {
    if (!empezado || fuera || confirmando) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      if (e.key === "ArrowRight") setIndice((i) => Math.min(preguntas.length - 1, i + 1));
      else if (e.key === "ArrowLeft") setIndice((i) => Math.max(0, i - 1));
      else {
        const n = "abcdefgh".indexOf(e.key.toLowerCase());
        if (n >= 0 && actual && n < actual.opciones.length) elegir(n);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const contestadas = preguntas.filter((p) => respuestas[p.id]?.opcionElegida != null).length;
  const marcadas = preguntas.filter((p) => respuestas[p.id]?.marcada).length;
  const enBlanco = preguntas.length - contestadas;

  const colorReloj =
    restante <= Math.min(120, props.duracionSegundos * 0.05) ? "border-red-400/60 text-red-400" : restante <= Math.min(600, props.duracionSegundos * 0.2) ? "border-amber-400/60 text-amber-400" : "border-ink-divider text-ink-text";

  if (!empezado) {
    return (
      <main className="mx-auto max-w-xl px-6 py-12">
        <div className="rounded-lg border border-ink-divider bg-ink-surface p-6">
          <span className="text-xs font-medium uppercase tracking-wide text-accent">Modo avanzado</span>
          <h1 className="mt-2 text-xl font-medium text-ink-text">{props.titulo}</h1>
          <ul className="mt-4 space-y-2 text-sm text-neutral-300">
            <li>· El examen se hace en pantalla completa.</li>
            <li>
              · Cambiar de pestaña, minimizar, usar Alt+Tab o salir de pantalla completa cuenta como una salida. Con{" "}
              {maxSalidas} {maxSalidas === 1 ? "salida" : "salidas"} el examen se entrega automáticamente.
            </li>
            <li>· No se puede copiar, pegar ni usar el clic derecho.</li>
            <li>· El tiempo ya está corriendo: quedan {formatearTiempo(restante)}.</li>
          </ul>
          {!puedePantallaCompleta() && (
            <p className="mt-4 rounded-md border border-amber-400/30 bg-amber-400/10 px-3 py-2 text-xs text-amber-400">
              Este navegador no permite la pantalla completa: se controlarán igualmente los cambios de pestaña y de app.
            </p>
          )}
          <button
            type="button"
            onClick={() => {
              void entrarPantallaCompleta().then(() => setEmpezado(true));
            }}
            className={buttonClass("primary", "mt-6 w-full")}
          >
            {puedePantallaCompleta() ? "Empezar en pantalla completa" : "Empezar"}
          </button>
        </div>
      </main>
    );
  }

  return (
    <div className={modoAvanzado ? "select-none" : undefined}>
      <div className="sticky top-0 z-20 border-b border-ink-divider bg-ink-surface/95 backdrop-blur" style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}>
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-6 py-3">
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-ink-text">{props.titulo}</p>
            {props.subtitulo && <p className="truncate text-xs text-neutral-500">{props.subtitulo}</p>}
          </div>
          <div className="ml-auto flex items-center gap-3">
            {modoAvanzado && (
              <span className="text-xs text-neutral-500" title="Salidas de la pantalla del examen">
                Salidas {salidas}/{maxSalidas}
              </span>
            )}
            <div
              className={`rounded-md border bg-ink px-3 py-1.5 text-sm font-medium tabular-nums ${colorReloj}`}
              role="timer"
              aria-live="off"
            >
              {formatearTiempo(restante)}
            </div>
          </div>
        </div>
      </div>

      <main className="mx-auto grid max-w-6xl gap-8 px-6 py-8 lg:grid-cols-[1fr_300px] lg:items-start">
        <div>
          <div className="flex items-baseline justify-between">
            <span className="text-xs font-medium uppercase tracking-wide text-accent">Modo examen</span>
            <span className="text-xs tabular-nums text-neutral-500">
              Pregunta {indice + 1} de {preguntas.length}
            </span>
          </div>
          <div className="mt-2 h-1 overflow-hidden rounded-full bg-ink-surface">
            <div className="h-full rounded-full bg-accent transition-[width]" style={{ width: `${(contestadas / Math.max(1, preguntas.length)) * 100}%` }} />
          </div>

          {actual && (
            <div className="mt-6 rounded-lg border border-ink-divider bg-ink-surface p-6">
              <p className="text-[15px] leading-relaxed text-ink-text">{actual.enunciado}</p>
              <div className="mt-5 space-y-2">
                {actual.opciones.map((opcion, i) => {
                  const elegida = respuestaActual.opcionElegida === i;
                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() => elegir(i)}
                      className={`flex w-full items-start gap-3 rounded-md border px-4 py-2.5 text-left text-sm transition-colors ${
                        elegida ? "border-accent bg-accent/10" : "border-ink-divider bg-ink hover:border-accent/50"
                      }`}
                    >
                      <span
                        className={`flex h-5 w-5 flex-none items-center justify-center rounded border text-[11px] font-semibold ${
                          elegida ? "border-accent bg-accent text-ink" : "border-ink-divider text-neutral-500"
                        }`}
                      >
                        {String.fromCharCode(97 + i)}
                      </span>
                      <span className="text-neutral-200">{opcion}</span>
                    </button>
                  );
                })}
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => cambiar(actual.id, { marcada: !respuestaActual.marcada })}
                  className={buttonClass("ghost", respuestaActual.marcada ? "text-amber-400" : "")}
                  aria-pressed={respuestaActual.marcada}
                >
                  {respuestaActual.marcada ? "★ Marcada" : "☆ Marcar para revisar"}
                </button>
                {respuestaActual.opcionElegida !== null && (
                  <button type="button" onClick={() => cambiar(actual.id, { opcionElegida: null })} className={buttonClass("ghost")}>
                    Dejar en blanco
                  </button>
                )}
              </div>
              <div className="mt-3 flex items-center justify-between gap-3">
                <button type="button" disabled={indice === 0} onClick={() => setIndice((i) => i - 1)} className={buttonClass("secondary")}>
                  Anterior
                </button>
                <button
                  type="button"
                  onClick={() => (indice === preguntas.length - 1 ? setConfirmando(true) : setIndice((i) => i + 1))}
                  className={buttonClass("primary")}
                >
                  {indice === preguntas.length - 1 ? "Revisar y entregar" : "Siguiente"}
                </button>
              </div>
            </div>
          )}
          {aviso && <p className="mt-3 text-xs text-red-400">{aviso}</p>}
          <p className="mt-3 hidden text-xs text-neutral-600 sm:block">Atajos: teclas a–d para responder, flechas para cambiar de pregunta.</p>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-24">
          <div className="rounded-lg border border-ink-divider bg-ink-surface p-4">
            <div className="flex items-baseline justify-between">
              <p className="text-xs text-neutral-500">Hoja de respuestas</p>
              <p className="text-xs tabular-nums text-neutral-500">
                {contestadas}/{preguntas.length}
              </p>
            </div>
            <div className="mt-3 grid max-h-[50vh] grid-cols-8 gap-1.5 overflow-y-auto">
              {preguntas.map((p, i) => {
                const r = respuestas[p.id];
                let clases = "border-ink-divider bg-ink text-neutral-500";
                if (r?.opcionElegida != null) clases = "border-accent/50 bg-accent/10 text-accent";
                if (r?.marcada) clases += " !border-amber-400/70";
                if (i === indice) clases += " ring-1 ring-accent";
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setIndice(i)}
                    className={`relative aspect-square rounded border text-[10px] font-medium tabular-nums ${clases}`}
                    aria-label={`Pregunta ${i + 1}${r?.opcionElegida != null ? ", contestada" : ""}${r?.marcada ? ", marcada" : ""}`}
                  >
                    {i + 1}
                    {r?.marcada && <span className="absolute right-0.5 top-0 text-[8px] text-amber-400">★</span>}
                  </button>
                );
              })}
            </div>
            <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-neutral-500">
              <span>
                <span className="text-accent">■</span> contestada
              </span>
              <span>
                <span className="text-amber-400">★</span> marcada
              </span>
              <span>□ en blanco</span>
            </div>
          </div>

          <button type="button" onClick={() => setConfirmando(true)} className={buttonClass("primary", "w-full")}>
            Entregar examen
          </button>
          <p className="text-xs text-neutral-500">
            Cada fallo resta un tercio de acierto; las preguntas en blanco no puntúan. Al acabarse el tiempo, el examen se
            entrega solo.
          </p>
        </aside>
      </main>

      {confirmando && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 px-4" role="dialog" aria-modal="true">
          <div className="w-full max-w-sm rounded-lg border border-ink-divider bg-ink-surface p-6">
            <h2 className="text-lg font-medium text-ink-text">¿Entregar el examen?</h2>
            <p className="mt-2 text-sm text-neutral-400">
              {contestadas} contestadas · {enBlanco} en blanco{marcadas ? ` · ${marcadas} marcadas para revisar` : ""}. Quedan{" "}
              {formatearTiempo(restante)}. Una vez entregado no se puede cambiar.
            </p>
            <div className="mt-6 flex gap-2">
              <button type="button" onClick={() => setConfirmando(false)} className={buttonClass("secondary", "flex-1")}>
                Seguir
              </button>
              <button
                type="button"
                disabled={entregando}
                onClick={() => void entregar("usuario")}
                className={buttonClass("primary", "flex-1")}
              >
                {entregando ? "Entregando…" : "Entregar"}
              </button>
            </div>
          </div>
        </div>
      )}

      {fuera && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink px-4" role="alertdialog" aria-modal="true">
          <div className="w-full max-w-sm rounded-lg border border-red-400/40 bg-ink-surface p-6 text-center">
            <h2 className="text-lg font-medium text-ink-text">Has salido del examen</h2>
            <p className="mt-2 text-sm text-neutral-400">
              Salida {salidas} de {maxSalidas}.{" "}
              {salidas >= maxSalidas
                ? "Has llegado al máximo: el examen se ha entregado."
                : `Si llegas a ${maxSalidas}, el examen se entregará automáticamente. El tiempo sigue corriendo.`}
            </p>
            <button type="button" onClick={() => void volver()} className={buttonClass("primary", "mt-6 w-full")}>
              Volver al examen
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
