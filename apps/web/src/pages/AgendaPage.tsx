import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { SiteHeader } from "../components/SiteHeader";
import { LoadingScreen } from "../components/LoadingScreen";
import { buttonClass } from "../components/button";
import { ApiError } from "../lib/api-client";
import {
  createTarea,
  deleteTarea,
  disconnectGoogle,
  getGoogleAuthUrl,
  getGoogleStatus,
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
  const [searchParams, setSearchParams] = useSearchParams();
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [fecha, setFecha] = useState("");

  const googleResultado = searchParams.get("google");
  useEffect(() => {
    if (!googleResultado) return;
    queryClient.invalidateQueries({ queryKey: ["agenda", "google-status"] });
    const next = new URLSearchParams(searchParams);
    next.delete("google");
    setSearchParams(next, { replace: true });
    // Solo al aterrizar desde el callback de Google — no depende de nada
    // que cambie en cada render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const tareasQuery = useQuery({ queryKey: ["agenda", "tareas"], queryFn: listTareas });
  const googleStatusQuery = useQuery({
    queryKey: ["agenda", "google-status"],
    queryFn: getGoogleStatus,
  });

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

  const conectarMutation = useMutation({
    mutationFn: async () => {
      const { url } = await getGoogleAuthUrl();
      window.location.href = url;
    },
  });

  const desconectarMutation = useMutation({
    mutationFn: disconnectGoogle,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["agenda", "google-status"] }),
  });

  if (tareasQuery.isLoading) return <LoadingScreen />;

  const tareas = tareasQuery.data ?? [];
  const conectado = googleStatusQuery.data?.connected ?? false;

  return (
    <div>
      <SiteHeader />

      <main className="mx-auto max-w-2xl px-6 py-12">
        <h1 className="text-2xl font-medium tracking-tight text-ink-text">
          Agenda de estudio
        </h1>
        <p className="mt-2 text-sm text-neutral-400">
          Crea tareas de estudio y sincronízalas con tu Google Calendar.
        </p>

        {googleResultado === "connected" && (
          <p className="mt-4 rounded-md border border-emerald-400/30 bg-emerald-400/10 px-3 py-2 text-sm text-emerald-400">
            Google Calendar conectado.
          </p>
        )}
        {googleResultado === "error" && (
          <p className="mt-4 rounded-md border border-red-400/30 bg-red-400/10 px-3 py-2 text-sm text-red-400">
            No se pudo conectar con Google Calendar, inténtalo de nuevo.
          </p>
        )}

        <div className="mt-6 flex items-center justify-between rounded-lg border border-ink-divider bg-ink-surface p-5">
          <div>
            <h2 className="text-sm font-medium text-ink-text">Google Calendar</h2>
            <p className="mt-1 text-xs text-neutral-500">
              {conectado
                ? "Tus tareas se crean también como eventos en tu calendario de Google."
                : "Conéctalo para que cada tarea aparezca automáticamente en tu Google Calendar."}
            </p>
          </div>
          {conectado ? (
            <button
              type="button"
              onClick={() => desconectarMutation.mutate()}
              disabled={desconectarMutation.isPending}
              className={buttonClass("secondary")}
            >
              {desconectarMutation.isPending ? "Desconectando…" : "Desconectar"}
            </button>
          ) : (
            <button
              type="button"
              onClick={() => conectarMutation.mutate()}
              disabled={conectarMutation.isPending}
              className={buttonClass("primary")}
            >
              Conectar con Google
            </button>
          )}
        </div>

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

        <Link to="/dashboard" className="mt-8 inline-block text-sm text-neutral-500 hover:text-ink-text">
          ← Volver al dashboard
        </Link>
      </main>
    </div>
  );
}
