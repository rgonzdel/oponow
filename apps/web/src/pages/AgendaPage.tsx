import { useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { SiteHeader } from "../components/SiteHeader";
import { LoadingScreen } from "../components/LoadingScreen";
import { buttonClass } from "../components/button";
import { ApiError } from "../lib/api-client";
import {
  createTarea,
  deleteTarea,
  getFeedUrl,
  listTareas,
  updateTarea,
} from "../lib/agenda-client";

function formatFecha(iso: string) {
  return new Date(iso).toLocaleString("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function AgendaPage() {
  const queryClient = useQueryClient();
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [fecha, setFecha] = useState("");
  const [copiado, setCopiado] = useState(false);

  const tareasQuery = useQuery({ queryKey: ["agenda", "tareas"], queryFn: listTareas });
  const feedQuery = useQuery({ queryKey: ["agenda", "feed-url"], queryFn: getFeedUrl });

  const crearMutation = useMutation({
    mutationFn: () =>
      createTarea({
        titulo,
        descripcion: descripcion || undefined,
        fecha: new Date(fecha).toISOString(),
      }),
    onSuccess: () => {
      setTitulo("");
      setDescripcion("");
      setFecha("");
      queryClient.invalidateQueries({ queryKey: ["agenda", "tareas"] });
    },
  });

  const toggleMutation = useMutation({
    mutationFn: ({ id, completada }: { id: string; completada: boolean }) =>
      updateTarea(id, { completada }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["agenda", "tareas"] }),
  });

  const eliminarMutation = useMutation({
    mutationFn: (id: string) => deleteTarea(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["agenda", "tareas"] }),
  });

  if (tareasQuery.isLoading) return <LoadingScreen />;

  const tareas = tareasQuery.data ?? [];

  async function copiarFeed() {
    if (!feedQuery.data) return;
    await navigator.clipboard.writeText(feedQuery.data.url);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  }

  return (
    <div>
      <SiteHeader />

      <main className="mx-auto max-w-2xl px-6 py-12">
        <h1 className="text-2xl font-medium tracking-tight text-ink-text">
          Agenda de estudio
        </h1>
        <p className="mt-2 text-sm text-neutral-400">
          Crea tareas de estudio y suscríbete a tu calendario para verlas en
          Google Calendar o Apple Calendar.
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (titulo && fecha) crearMutation.mutate();
          }}
          className="mt-6 space-y-3 rounded-lg border border-ink-divider bg-ink-surface p-5"
        >
          <input
            type="text"
            required
            placeholder="Título — p. ej. Repasar Bloque II"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            className="w-full rounded-md border border-ink-divider bg-ink px-3 py-2 text-sm text-ink-text placeholder:text-neutral-500"
          />
          <textarea
            placeholder="Descripción (opcional)"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            rows={2}
            className="w-full resize-none rounded-md border border-ink-divider bg-ink px-3 py-2 text-sm text-ink-text placeholder:text-neutral-500"
          />
          <div className="flex flex-wrap items-center gap-3">
            <input
              type="datetime-local"
              required
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              className="rounded-md border border-ink-divider bg-ink px-3 py-2 text-sm text-ink-text"
            />
            <button
              type="submit"
              disabled={crearMutation.isPending}
              className={buttonClass("primary")}
            >
              {crearMutation.isPending ? "Añadiendo…" : "Añadir tarea"}
            </button>
          </div>
          {crearMutation.isError && (
            <p className="text-sm text-red-400">
              {crearMutation.error instanceof ApiError
                ? crearMutation.error.message
                : "No se pudo crear la tarea"}
            </p>
          )}
        </form>

        <ul className="mt-6 divide-y divide-ink-divider overflow-hidden rounded-lg border border-ink-divider">
          {tareas.map((t) => (
            <li key={t.id} className="flex items-start gap-3 bg-ink-surface px-5 py-4">
              <input
                type="checkbox"
                checked={t.completada}
                onChange={() => toggleMutation.mutate({ id: t.id, completada: !t.completada })}
                className="mt-1 h-4 w-4 accent-accent"
              />
              <div className="flex-1">
                <p className={`text-sm ${t.completada ? "text-neutral-500 line-through" : "text-ink-text"}`}>
                  {t.titulo}
                </p>
                {t.descripcion && (
                  <p className="mt-0.5 text-xs text-neutral-500">{t.descripcion}</p>
                )}
                <p className="mt-1 text-xs text-neutral-500">{formatFecha(t.fecha)}</p>
              </div>
              <button
                type="button"
                onClick={() => eliminarMutation.mutate(t.id)}
                className="text-xs text-neutral-500 hover:text-red-400"
              >
                Eliminar
              </button>
            </li>
          ))}
          {tareas.length === 0 && (
            <li className="bg-ink-surface px-5 py-8 text-center text-sm text-neutral-500">
              Todavía no tienes tareas — añade la primera arriba.
            </li>
          )}
        </ul>

        <div className="mt-8 rounded-lg border border-ink-divider bg-ink-surface p-5">
          <h2 className="text-sm font-medium text-ink-text">
            Sincronizar con Google Calendar o Apple Calendar
          </h2>
          <p className="mt-2 text-xs text-neutral-400">
            Copia este enlace y añádelo como calendario "por URL" en Google
            Calendar (Otros calendarios → Desde URL) o en Apple Calendar
            (Archivo → Nueva suscripción de calendario). Se actualizará solo
            cuando añadas o edites tareas — el calendario tarda un rato en
            volver a comprobarlo, no es al instante.
          </p>
          {feedQuery.data && (
            <div className="mt-3 flex items-center gap-2">
              <input
                readOnly
                value={feedQuery.data.url}
                onFocus={(e) => e.currentTarget.select()}
                className="flex-1 truncate rounded-md border border-ink-divider bg-ink px-3 py-2 text-xs text-neutral-300"
              />
              <button
                type="button"
                onClick={copiarFeed}
                className={buttonClass("secondary")}
              >
                {copiado ? "Copiado ✓" : "Copiar"}
              </button>
            </div>
          )}
        </div>

        <Link to="/dashboard" className="mt-8 inline-block text-sm text-neutral-500 hover:text-ink-text">
          ← Volver al dashboard
        </Link>
      </main>
    </div>
  );
}
