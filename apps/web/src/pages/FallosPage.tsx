import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { SiteHeader } from "../components/SiteHeader";
import { LoadingScreen } from "../components/LoadingScreen";
import { buttonClass } from "../components/button";
import { ApiError } from "../lib/api-client";
import { getFallos, type FallosGroupBy } from "../lib/quiz-client";

const GROUP_LABELS: Record<FallosGroupBy, string> = {
  day: "Día",
  month: "Mes",
  year: "Año",
};

function formatFecha(iso: string) {
  return new Date(iso).toLocaleString("es-ES", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function FallosPage() {
  const [groupBy, setGroupBy] = useState<FallosGroupBy>("day");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const fallosQuery = useQuery({
    queryKey: ["quiz", "fallos", groupBy, from, to],
    queryFn: () =>
      getFallos({
        groupBy,
        from: from || undefined,
        to: to || undefined,
      }),
    retry: false,
  });

  const gated =
    fallosQuery.error instanceof ApiError && fallosQuery.error.status === 403;

  if (fallosQuery.isLoading) return <LoadingScreen />;

  if (gated) {
    return (
      <div>
        <SiteHeader />
        <main className="mx-auto max-w-md px-6 py-16 text-center">
          <h1 className="text-xl font-medium tracking-tight text-ink-text">
            Seguimiento de fallos
          </h1>
          <p className="mt-3 text-sm text-neutral-400">
            Esta sección es solo para usuarios con una suscripción activa.
          </p>
          <Link to="/oposiciones" className={buttonClass("primary", "mt-6 w-full")}>
            Ver planes
          </Link>
        </main>
      </div>
    );
  }

  const fallos = fallosQuery.data?.fallos ?? [];
  const porPeriodo = fallosQuery.data?.porPeriodo ?? [];
  const max = Math.max(1, ...porPeriodo.map((p) => p.total));

  return (
    <div>
      <SiteHeader />

      <main className="mx-auto max-w-3xl px-6 py-12">
        <h1 className="text-2xl font-medium tracking-tight text-ink-text">
          Seguimiento de fallos
        </h1>
        <p className="mt-2 text-sm text-neutral-400">
          Todas las preguntas que has fallado en tus tests, agrupadas por
          periodo.
        </p>

        <div className="mt-6 flex flex-wrap items-end gap-4">
          <div className="flex rounded-md border border-ink-divider p-1">
            {(Object.keys(GROUP_LABELS) as FallosGroupBy[]).map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => setGroupBy(g)}
                className={`rounded px-3 py-1.5 text-sm font-medium transition-colors ${
                  groupBy === g
                    ? "bg-accent text-ink"
                    : "text-neutral-400 hover:text-ink-text"
                }`}
              >
                {GROUP_LABELS[g]}
              </button>
            ))}
          </div>

          <label className="flex flex-col gap-1 text-xs text-neutral-500">
            Desde
            <input
              type="date"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="rounded-md border border-ink-divider bg-ink px-2 py-1.5 text-sm text-ink-text"
            />
          </label>
          <label className="flex flex-col gap-1 text-xs text-neutral-500">
            Hasta
            <input
              type="date"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="rounded-md border border-ink-divider bg-ink px-2 py-1.5 text-sm text-ink-text"
            />
          </label>
          {(from || to) && (
            <button
              type="button"
              onClick={() => {
                setFrom("");
                setTo("");
              }}
              className="text-xs text-neutral-500 hover:text-ink-text"
            >
              Limpiar
            </button>
          )}
        </div>

        {porPeriodo.length > 0 && (
          <div className="mt-8 space-y-1.5">
            {porPeriodo.map((p) => (
              <div key={p.periodo} className="flex items-center gap-3 text-xs">
                <span className="w-20 flex-none text-neutral-500">{p.periodo}</span>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-ink-surface">
                  <div
                    className="h-full rounded-full bg-accent"
                    style={{ width: `${(p.total / max) * 100}%` }}
                  />
                </div>
                <span className="w-6 flex-none text-right text-neutral-400">
                  {p.total}
                </span>
              </div>
            ))}
          </div>
        )}

        <ul className="mt-8 divide-y divide-ink-divider overflow-hidden rounded-lg border border-ink-divider">
          {fallos.map((f) => (
            <li key={f.id} className="bg-ink-surface px-5 py-4">
              <div className="flex items-center justify-between text-xs text-neutral-500">
                <span>{f.temaTitulo}</span>
                <span>{formatFecha(f.fecha)}</span>
              </div>
              <p className="mt-2 text-sm text-ink-text">{f.enunciado}</p>
              <p className="mt-2 text-xs text-red-400">
                Tu respuesta: {f.opciones[f.opcionElegida]}
              </p>
              <p className="text-xs text-emerald-400">
                Correcta: {f.opciones[f.respuestaCorrecta]}
              </p>
            </li>
          ))}
          {fallos.length === 0 && (
            <li className="bg-ink-surface px-5 py-8 text-center text-sm text-neutral-500">
              No hay fallos registrados en este rango — ¡bien!
            </li>
          )}
        </ul>
      </main>
    </div>
  );
}
