import { useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createTarea,
  deleteTarea,
  getGoogleStatus,
  listGoogleEventos,
  listTareas,
  updateTarea,
} from "../lib/agenda-client";
import { ApiError } from "../lib/api-client";
import { buttonClass } from "./button";

const DIAS_SEMANA = ["L", "M", "X", "J", "V", "S", "D"];
// Cuántas tareas se listan dentro de la casilla antes de resumir en "+N".
const MAX_VISIBLES = 3;

interface ItemDia {
  tipo: "tarea" | "google";
  id: string;
  titulo: string;
  inicio: string;
  completada: boolean;
  todoElDia: boolean;
}

function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

// Clave de día natural en hora local del navegador — la misma convención que
// usa la racha en la API (día español), no el día UTC.
function dayKey(d: Date): string {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

function addDays(d: Date, n: number): Date {
  const r = new Date(d);
  r.setDate(r.getDate() + n);
  return r;
}

function startOfDay(d: Date): Date {
  const r = new Date(d);
  r.setHours(0, 0, 0, 0);
  return r;
}

function horaCorta(item: ItemDia): string {
  if (item.todoElDia) return "Todo el día";
  return new Date(item.inicio).toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function tituloLargoDeDia(clave: string): string {
  const [anio, mes, dia] = clave.split("-").map(Number);
  const fecha = new Date(anio, mes - 1, dia);
  const texto = fecha.toLocaleDateString("es-ES", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}

export function MiniCalendar() {
  const queryClient = useQueryClient();
  const hoy = new Date();
  const claveHoy = dayKey(hoy);

  const [cursor, setCursor] = useState({ year: hoy.getFullYear(), month: hoy.getMonth() });
  const [seleccionado, setSeleccionado] = useState(claveHoy);
  const [titulo, setTitulo] = useState("");
  const [hora, setHora] = useState("09:00");

  const primerDiaMes = new Date(cursor.year, cursor.month, 1);
  // Semana empezando en lunes: getDay() es 0=domingo..6=sábado.
  const indiceLunes = (primerDiaMes.getDay() + 6) % 7;
  const diasEnMes = new Date(cursor.year, cursor.month + 1, 0).getDate();
  const totalCeldas = Math.ceil((indiceLunes + diasEnMes) / 7) * 7;
  const gridStart = addDays(primerDiaMes, -indiceLunes);
  const celdas = Array.from({ length: totalCeldas }, (_, i) => addDays(gridStart, i));
  const gridEnd = celdas[celdas.length - 1];

  const desdeIso = startOfDay(gridStart).toISOString();
  const hastaIso = addDays(startOfDay(gridEnd), 1).toISOString();

  const statusQuery = useQuery({
    queryKey: ["agenda", "google-status"],
    queryFn: getGoogleStatus,
  });
  const conectado = statusQuery.data?.connected ?? false;

  const tareasQuery = useQuery({
    queryKey: ["agenda", "tareas"],
    queryFn: listTareas,
  });

  const eventosQuery = useQuery({
    queryKey: ["agenda", "google", "eventos", desdeIso, hastaIso],
    queryFn: () => listGoogleEventos(desdeIso, hastaIso),
    enabled: conectado,
  });

  const tareas = tareasQuery.data ?? [];
  const idsLocal = new Set(tareas.map((t) => t.id));
  // Un evento de Google que ya viene de una tarea de Oponow no se duplica —
  // esa tarea local ya se pinta con sus propios controles de edición.
  const eventosGoogle = (eventosQuery.data ?? []).filter(
    (e) => !e.oponowTareaId || !idsLocal.has(e.oponowTareaId),
  );

  const itemsPorDia = new Map<string, ItemDia[]>();
  function añadirItem(clave: string, item: ItemDia) {
    itemsPorDia.set(clave, [...(itemsPorDia.get(clave) ?? []), item]);
  }
  for (const t of tareas) {
    añadirItem(dayKey(new Date(t.fecha)), {
      tipo: "tarea",
      id: t.id,
      titulo: t.titulo,
      inicio: t.fecha,
      completada: t.completada,
      todoElDia: false,
    });
  }
  for (const e of eventosGoogle) {
    if (!e.inicio) continue;
    añadirItem(dayKey(new Date(e.inicio)), {
      tipo: "google",
      id: e.id,
      titulo: e.titulo,
      inicio: e.inicio,
      completada: false,
      todoElDia: e.todoElDia,
    });
  }
  for (const lista of itemsPorDia.values()) {
    lista.sort((a, b) => a.inicio.localeCompare(b.inicio));
  }

  const itemsSeleccionado = itemsPorDia.get(seleccionado) ?? [];

  const invalidarAgenda = () => {
    queryClient.invalidateQueries({ queryKey: ["agenda", "tareas"] });
    queryClient.invalidateQueries({ queryKey: ["agenda", "google", "eventos"] });
  };

  const crearMutation = useMutation({
    mutationFn: () => {
      const [anio, mes, dia] = seleccionado.split("-").map(Number);
      const [hh, mm] = hora.split(":").map(Number);
      return createTarea({
        titulo: titulo.trim(),
        fecha: new Date(anio, mes - 1, dia, hh, mm).toISOString(),
      });
    },
    onSuccess: () => {
      setTitulo("");
      invalidarAgenda();
    },
  });

  const toggleMutation = useMutation({
    mutationFn: ({ id, completada }: { id: string; completada: boolean }) =>
      updateTarea(id, { completada }),
    onSuccess: invalidarAgenda,
  });

  const eliminarMutation = useMutation({
    mutationFn: (id: string) => deleteTarea(id),
    onSuccess: invalidarAgenda,
  });

  const tituloMes = primerDiaMes.toLocaleDateString("es-ES", {
    month: "long",
    year: "numeric",
  });
  const tituloCapitalizado = tituloMes.charAt(0).toUpperCase() + tituloMes.slice(1);

  function irMesAnterior() {
    setCursor((c) => (c.month === 0 ? { year: c.year - 1, month: 11 } : { year: c.year, month: c.month - 1 }));
  }

  function irMesSiguiente() {
    setCursor((c) => (c.month === 11 ? { year: c.year + 1, month: 0 } : { year: c.year, month: c.month + 1 }));
  }

  function seleccionarDia(fecha: Date) {
    setSeleccionado(dayKey(fecha));
    // Si pulsas un día de relleno (del mes anterior o siguiente), el
    // calendario salta a ese mes en vez de dejarte el día fuera de vista.
    if (fecha.getMonth() !== cursor.month || fecha.getFullYear() !== cursor.year) {
      setCursor({ year: fecha.getFullYear(), month: fecha.getMonth() });
    }
  }

  return (
    <div className="rounded-lg border border-ink-divider bg-ink-surface p-5">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium text-ink-text">{tituloCapitalizado}</h2>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => {
              setCursor({ year: hoy.getFullYear(), month: hoy.getMonth() });
              setSeleccionado(claveHoy);
            }}
            className="rounded px-2 py-1 text-xs text-neutral-400 hover:text-ink-text"
          >
            Hoy
          </button>
          <button
            type="button"
            onClick={irMesAnterior}
            aria-label="Mes anterior"
            className="rounded px-2 py-1 text-xs text-neutral-400 hover:text-ink-text"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={irMesSiguiente}
            aria-label="Mes siguiente"
            className="rounded px-2 py-1 text-xs text-neutral-400 hover:text-ink-text"
          >
            ›
          </button>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-7 gap-1 text-center text-[11px] text-neutral-500">
        {DIAS_SEMANA.map((d) => (
          <span key={d}>{d}</span>
        ))}
      </div>

      <div className="mt-1 grid grid-cols-7 gap-1">
        {celdas.map((fecha) => {
          const clave = dayKey(fecha);
          const enMesActual = fecha.getMonth() === cursor.month;
          const esHoy = clave === claveHoy;
          const esSeleccionado = clave === seleccionado;
          const items = itemsPorDia.get(clave) ?? [];

          return (
            <button
              key={clave}
              type="button"
              onClick={() => seleccionarDia(fecha)}
              aria-pressed={esSeleccionado}
              aria-label={`${tituloLargoDeDia(clave)} — ${items.length} ${items.length === 1 ? "tarea" : "tareas"}`}
              className={`flex min-h-[3.25rem] flex-col items-stretch gap-1 rounded-md border p-1 text-left transition-colors sm:min-h-[6.25rem] ${
                esSeleccionado
                  ? "border-accent bg-accent/10"
                  : "border-transparent hover:border-ink-divider"
              } ${enMesActual ? "" : "opacity-40"}`}
            >
              <span
                className={`self-center text-xs tabular-nums sm:self-start sm:px-1 ${
                  esHoy
                    ? "rounded-full bg-accent px-1.5 font-medium text-ink"
                    : enMesActual
                      ? "text-ink-text"
                      : "text-neutral-500"
                }`}
              >
                {fecha.getDate()}
              </span>

              {/* Móvil: no cabe el título, se resume en puntos. */}
              {items.length > 0 && (
                <span className="flex justify-center gap-0.5 sm:hidden">
                  {items.slice(0, MAX_VISIBLES).map((item) => (
                    <span
                      key={item.id}
                      className={`h-1 w-1 rounded-full ${
                        item.tipo === "tarea" ? "bg-accent" : "bg-neutral-400"
                      }`}
                    />
                  ))}
                </span>
              )}

              {/* Escritorio: previsualización real de qué hay ese día. */}
              <span className="hidden flex-col gap-0.5 sm:flex">
                {items.slice(0, MAX_VISIBLES).map((item) => (
                  <span
                    key={item.id}
                    title={`${horaCorta(item)} · ${item.titulo}`}
                    className={`truncate rounded px-1 py-0.5 text-[10px] leading-tight ${
                      item.tipo === "tarea"
                        ? "bg-accent-800 text-accent-100"
                        : "bg-ink text-neutral-400"
                    } ${item.completada ? "line-through opacity-60" : ""}`}
                  >
                    {item.titulo}
                  </span>
                ))}
                {items.length > MAX_VISIBLES && (
                  <span className="px-1 text-[10px] text-neutral-500">
                    +{items.length - MAX_VISIBLES} más
                  </span>
                )}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-5 border-t border-ink-divider pt-4">
        <h3 className="text-sm font-medium text-ink-text">
          {tituloLargoDeDia(seleccionado)}
        </h3>

        {itemsSeleccionado.length > 0 ? (
          <ul className="mt-3 space-y-2">
            {itemsSeleccionado.map((item) => (
              <li key={item.id} className="flex items-start gap-2.5">
                {item.tipo === "tarea" ? (
                  <input
                    type="checkbox"
                    checked={item.completada}
                    onChange={() =>
                      toggleMutation.mutate({ id: item.id, completada: !item.completada })
                    }
                    aria-label={`Marcar "${item.titulo}" como completada`}
                    className="mt-0.5 h-3.5 w-3.5 flex-none accent-accent"
                  />
                ) : (
                  <span className="mt-1.5 h-1.5 w-1.5 flex-none rounded-full bg-neutral-400" />
                )}
                <div className="min-w-0 flex-1">
                  <p
                    className={`truncate text-xs ${
                      item.completada ? "text-neutral-500 line-through" : "text-ink-text"
                    }`}
                  >
                    {item.titulo}
                  </p>
                  <p className="text-[11px] text-neutral-500">
                    {horaCorta(item)}
                    {item.tipo === "google" && " · Google Calendar"}
                  </p>
                </div>
                {item.tipo === "tarea" && (
                  <button
                    type="button"
                    onClick={() => eliminarMutation.mutate(item.id)}
                    className="text-[11px] text-neutral-500 hover:text-red-400"
                  >
                    Eliminar
                  </button>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-2 text-xs text-neutral-500">Nada planificado este día.</p>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (titulo.trim()) crearMutation.mutate();
          }}
          className="mt-4 flex flex-wrap items-center gap-2"
        >
          <input
            type="text"
            required
            placeholder="Nueva tarea — p. ej. Repasar Tema 1"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            className="min-w-0 flex-1 rounded-md border border-ink-divider bg-ink px-3 py-2 text-xs text-ink-text placeholder:text-neutral-500"
          />
          <input
            type="time"
            required
            value={hora}
            onChange={(e) => setHora(e.target.value)}
            aria-label="Hora de la tarea"
            className="rounded-md border border-ink-divider bg-ink px-2 py-2 text-xs text-ink-text"
          />
          <button
            type="submit"
            disabled={crearMutation.isPending}
            className={buttonClass("primary")}
          >
            {crearMutation.isPending ? "Añadiendo…" : "Añadir"}
          </button>
        </form>

        {crearMutation.isError && (
          <p className="mt-2 text-xs text-red-400">
            {crearMutation.error instanceof ApiError
              ? crearMutation.error.message
              : "No se pudo crear la tarea"}
          </p>
        )}

        <p className="mt-3 text-[11px] text-neutral-500">
          {conectado ? (
            "Cada tarea que crees aquí se añade también a tu Google Calendar."
          ) : (
            <>
              <Link to="/agenda" className="text-accent hover:underline">
                Conecta Google Calendar
              </Link>{" "}
              para ver aquí tus eventos y sincronizar tus tareas.
            </>
          )}
        </p>
      </div>
    </div>
  );
}
