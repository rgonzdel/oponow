import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getGoogleStatus, listGoogleEventos, listTareas } from "../lib/agenda-client";

const DIAS_SEMANA = ["L", "M", "X", "J", "V", "S", "D"];

function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

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

export function MiniCalendar() {
  const hoy = new Date();
  const [cursor, setCursor] = useState({ year: hoy.getFullYear(), month: hoy.getMonth() });

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
    queryKey: ["agenda", "google", "status"],
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

  const tareasPorDia = new Map<string, typeof tareas>();
  for (const t of tareas) {
    const clave = dayKey(new Date(t.fecha));
    tareasPorDia.set(clave, [...(tareasPorDia.get(clave) ?? []), t]);
  }

  const eventosPorDia = new Map<string, typeof eventosGoogle>();
  for (const e of eventosGoogle) {
    if (!e.inicio) continue;
    const clave = dayKey(new Date(e.inicio));
    eventosPorDia.set(clave, [...(eventosPorDia.get(clave) ?? []), e]);
  }

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

  return (
    <div className="rounded-lg border border-ink-divider bg-ink-surface p-5">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium text-ink-text">{tituloCapitalizado}</h2>
        <div className="flex gap-1">
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
          const esHoy = clave === dayKey(hoy);
          const tareasDia = tareasPorDia.get(clave) ?? [];
          const eventosDia = eventosPorDia.get(clave) ?? [];

          return (
            <div
              key={clave}
              className={`flex h-9 flex-col items-center justify-center rounded-md text-xs ${
                enMesActual ? "text-ink-text" : "text-neutral-700"
              } ${esHoy ? "border border-accent bg-accent/10 font-medium text-accent" : ""}`}
            >
              <span>{fecha.getDate()}</span>
              {(tareasDia.length > 0 || eventosDia.length > 0) && (
                <span className="flex gap-0.5">
                  {tareasDia.length > 0 && <span className="h-1 w-1 rounded-full bg-accent" />}
                  {eventosDia.length > 0 && <span className="h-1 w-1 rounded-full bg-neutral-400" />}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {!conectado && (
        <p className="mt-4 text-xs text-neutral-500">
          <Link to="/agenda" className="text-accent hover:underline">
            Conecta Google Calendar
          </Link>{" "}
          para ver aquí tus eventos.
        </p>
      )}
    </div>
  );
}
