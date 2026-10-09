import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { OPOSICIONES } from "@oponow/shared-types";
import { SiteHeader } from "../components/SiteHeader";
import { LoadingScreen } from "../components/LoadingScreen";
import { buttonClass } from "../components/button";
import { crearExamen, getOpcionesExamen, type MotivoEntregaExamen } from "../lib/examen-client";
import { ApiError } from "../lib/api-client";

const TAMANOS = [10, 25, 50, 100];
/** Ritmo del primer ejercicio de TAI: 90 minutos para 100 preguntas. */
const SEGUNDOS_POR_PREGUNTA = 54;

const MOTIVO_CORTO: Record<MotivoEntregaExamen, string> = {
  usuario: "Entregado",
  tiempo: "Fin del tiempo",
  salidas: "Por salidas",
};

export function ExamenConfigPage() {
  const { slug = "" } = useParams();
  const op = OPOSICIONES.find((o) => o.slug === slug);
  const navigate = useNavigate();
  const query = useQuery({ queryKey: ["examen", "opciones", slug], queryFn: () => getOpcionesExamen(slug) });

  const [seleccion, setSeleccion] = useState<Set<string> | null>(null);
  const [numPreguntas, setNumPreguntas] = useState(25);
  const [minutos, setMinutos] = useState(Math.round((25 * SEGUNDOS_POR_PREGUNTA) / 60));
  const [minutosTocados, setMinutosTocados] = useState(false);
  const [modoAvanzado, setModoAvanzado] = useState(false);
  const [maxSalidas, setMaxSalidas] = useState(3);
  const [creando, setCreando] = useState(false);
  const [error, setError] = useState("");

  const temas = query.data?.temas ?? [];
  const elegidos = seleccion ?? new Set(temas.map((t) => t.id));
  const disponibles = useMemo(
    () => temas.filter((t) => elegidos.has(t.id)).reduce((s, t) => s + t.preguntas, 0),
    [temas, elegidos],
  );
  const preguntasFinales = Math.min(numPreguntas, disponibles);

  // La duración sigue al número de preguntas hasta que se cambia a mano.
  useEffect(() => {
    if (!minutosTocados) setMinutos(Math.max(5, Math.round((preguntasFinales * SEGUNDOS_POR_PREGUNTA) / 60)));
  }, [preguntasFinales, minutosTocados]);

  if (query.isLoading) return <LoadingScreen />;

  const alternar = (id: string) => {
    const nuevo = new Set(elegidos);
    if (nuevo.has(id)) nuevo.delete(id);
    else nuevo.add(id);
    setSeleccion(nuevo);
  };

  const empezar = async () => {
    setError("");
    setCreando(true);
    try {
      const todos = elegidos.size === temas.length;
      const { id } = await crearExamen(slug, {
        temaIds: todos ? [] : [...elegidos],
        numPreguntas: preguntasFinales,
        duracionMinutos: minutos,
        modoAvanzado,
        maxSalidas,
      });
      navigate(`/examen/${id}`);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "No se ha podido crear el examen.");
      setCreando(false);
    }
  };

  return (
    <div>
      <SiteHeader />
      <main className="mx-auto max-w-4xl px-6 py-10">
        <Link to="/dashboard" className="text-xs text-neutral-500 hover:text-accent">
          ← Panel
        </Link>
        <h1 className="mt-3 text-2xl font-medium tracking-tight text-ink-text">Modo examen{op ? ` · ${op.siglas}` : ""}</h1>
        <p className="mt-2 max-w-2xl text-sm text-neutral-400">
          Un examen cronometrado como el real: sin ver las soluciones hasta entregarlo, con penalización por fallo y
          entrega automática al acabarse el tiempo. Si recargas o cierras la página, el tiempo sigue corriendo.
        </p>

        {query.isError && (
          <p className="mt-6 text-sm text-red-400">
            {query.error instanceof ApiError ? query.error.message : "No se han podido cargar los temas."}
          </p>
        )}

        {query.data?.activoId && (
          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-amber-400/40 bg-amber-400/10 p-4">
            <p className="text-sm text-amber-300">Tienes un examen sin entregar y su tiempo sigue corriendo.</p>
            <Link to={`/examen/${query.data.activoId}`} className={buttonClass("primary")}>
              Continuar examen
            </Link>
          </div>
        )}

        {slug === "tai" && (
          <Link
            to={`/oposiciones/${slug}/simulacro?modo=examen`}
            className="mt-6 block rounded-lg border border-ink-divider bg-ink-surface p-5 transition-colors hover:border-accent"
          >
            <p className="text-xs font-medium uppercase tracking-wide text-accent">Simulacro oficial</p>
            <p className="mt-1 text-sm text-ink-text">Primera parte de TAI 2024 · 90 minutos</p>
            <p className="mt-1 text-xs text-neutral-500">Las preguntas reales del examen, en modo examen.</p>
          </Link>
        )}

        <section className="mt-8 rounded-lg border border-ink-divider bg-ink-surface p-6">
          <h2 className="text-sm font-medium text-ink-text">Examen con preguntas del banco</h2>

          <div className="mt-5">
            <div className="flex items-baseline justify-between">
              <p className="text-xs text-neutral-500">Temas ({elegidos.size} de {temas.length})</p>
              <div className="flex gap-3 text-xs">
                <button type="button" className="text-accent" onClick={() => setSeleccion(new Set(temas.map((t) => t.id)))}>
                  Todos
                </button>
                <button type="button" className="text-neutral-400" onClick={() => setSeleccion(new Set())}>
                  Ninguno
                </button>
              </div>
            </div>
            <div className="mt-2 grid max-h-72 gap-1 overflow-y-auto sm:grid-cols-2">
              {temas.map((t) => (
                <label
                  key={t.id}
                  className="flex cursor-pointer items-start gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-ink"
                >
                  <input type="checkbox" checked={elegidos.has(t.id)} onChange={() => alternar(t.id)} className="mt-1 accent-[#9184d9]" />
                  <span className="text-neutral-300">
                    {t.orden}. {t.titulo} <span className="text-xs text-neutral-500">({t.preguntas})</span>
                  </span>
                </label>
              ))}
              {temas.length === 0 && !query.isError && (
                <p className="text-sm text-neutral-500">No hay preguntas disponibles para tu plan en esta oposición.</p>
              )}
            </div>
          </div>

          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            <div>
              <p className="text-xs text-neutral-500">Número de preguntas</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {TAMANOS.map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setNumPreguntas(n)}
                    disabled={n > disponibles && n !== TAMANOS[0]}
                    className={`rounded-md border px-3 py-1.5 text-sm disabled:opacity-40 ${
                      numPreguntas === n ? "border-accent bg-accent/10 text-accent" : "border-ink-divider text-neutral-300"
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
              <p className="mt-2 text-xs text-neutral-500">
                {disponibles} disponibles en los temas elegidos
                {numPreguntas > disponibles && disponibles > 0 ? ` · se usarán ${disponibles}` : ""}.
              </p>
            </div>
            <div>
              <label htmlFor="minutos" className="text-xs text-neutral-500">
                Duración (minutos)
              </label>
              <input
                id="minutos"
                type="number"
                min={5}
                max={240}
                value={minutos}
                onChange={(e) => {
                  setMinutosTocados(true);
                  setMinutos(Math.min(240, Math.max(5, Number(e.target.value) || 5)));
                }}
                className="mt-2 block w-28 rounded-md border border-ink-divider bg-ink px-3 py-1.5 text-sm text-ink-text"
              />
              <p className="mt-2 text-xs text-neutral-500">Por defecto, el ritmo del examen real: 90 minutos por cada 100 preguntas.</p>
            </div>
          </div>

          <div className="mt-6 rounded-md border border-ink-divider bg-ink p-4">
            <label className="flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                checked={modoAvanzado}
                onChange={(e) => setModoAvanzado(e.target.checked)}
                className="mt-1 accent-[#9184d9]"
              />
              <span>
                <span className="text-sm font-medium text-ink-text">Modo avanzado</span>
                <span className="mt-1 block text-xs text-neutral-400">
                  Pantalla completa obligatoria. Cambiar de pestaña, minimizar o salir de pantalla completa cuenta como
                  una salida y, al llegar al máximo, el examen se entrega solo. Sin copiar, pegar ni clic derecho. El
                  navegador no permite bloquear otros programas, pero cualquier salida queda registrada.
                </span>
              </span>
            </label>
            {modoAvanzado && (
              <div className="mt-3 flex items-center gap-2 pl-7 text-sm text-neutral-300">
                <label htmlFor="salidas">Entregar al llegar a</label>
                <select
                  id="salidas"
                  value={maxSalidas}
                  onChange={(e) => setMaxSalidas(Number(e.target.value))}
                  className="rounded-md border border-ink-divider bg-ink-surface px-2 py-1 text-sm text-ink-text"
                >
                  {[1, 2, 3, 4, 5].map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
                <span>{maxSalidas === 1 ? "salida" : "salidas"}</span>
              </div>
            )}
          </div>

          {error && <p className="mt-4 text-sm text-red-400">{error}</p>}
          <button
            type="button"
            disabled={creando || disponibles < 5 || Boolean(query.data?.activoId)}
            onClick={() => void empezar()}
            className={buttonClass("primary", "mt-6 w-full sm:w-auto")}
          >
            {creando ? "Preparando…" : `Empezar examen · ${preguntasFinales} preguntas · ${minutos} min`}
          </button>
          {query.data?.activoId && (
            <p className="mt-2 text-xs text-neutral-500">Entrega el examen en curso antes de empezar otro.</p>
          )}
        </section>

        {Boolean(query.data?.historial.length) && (
          <section className="mt-10">
            <h2 className="text-sm font-medium text-ink-text">Tus últimos exámenes</h2>
            <div className="mt-3 overflow-x-auto">
              <table className="w-full min-w-[480px] text-left text-sm">
                <thead className="text-xs text-neutral-500">
                  <tr>
                    <th className="py-2 font-normal">Fecha</th>
                    <th className="py-2 font-normal">Preguntas</th>
                    <th className="py-2 font-normal">Nota</th>
                    <th className="py-2 font-normal">Entrega</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {query.data!.historial.map((h) => (
                    <tr key={h.id} className="border-t border-ink-divider">
                      <td className="py-2 text-neutral-300">
                        {new Date(h.inicio).toLocaleString("es-ES", { dateStyle: "short", timeStyle: "short" })}
                      </td>
                      <td className="py-2 text-neutral-300">
                        {h.numPreguntas}
                        {h.modoAvanzado && <span className="ml-2 text-xs text-accent">avanzado</span>}
                      </td>
                      <td className="py-2 font-medium text-ink-text">{h.puntuacion?.toFixed(2) ?? "—"}</td>
                      <td className="py-2 text-neutral-400">{h.motivoEntrega ? MOTIVO_CORTO[h.motivoEntrega] : "—"}</td>
                      <td className="py-2 text-right">
                        <Link to={`/examen/${h.id}`} className="text-xs text-accent">
                          Revisar
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
