import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getResumen } from "../lib/quiz-client";

const OPCIONES_DIAS = [7, 14, 30] as const;

export function ResumenWidget() {
  const [dias, setDias] = useState<7 | 14 | 30>(7);

  const resumenQuery = useQuery({
    queryKey: ["quiz", "resumen", dias],
    queryFn: () => getResumen(dias),
  });

  const resumen = resumenQuery.data;

  return (
    <div className="rounded-lg border border-ink-divider bg-ink-surface p-5">
      <h2 className="text-sm font-medium text-ink-text">Tu seguimiento</h2>

      <div className="mt-4 flex items-center gap-2">
        <span className="text-3xl font-semibold text-accent">
          {resumen ? resumen.streak : "…"}
        </span>
        <span className="text-xs text-neutral-400">
          {resumen?.streak === 1 ? "día seguido haciendo test" : "días seguidos haciendo test"}
        </span>
      </div>

      <div className="mt-5 flex rounded-md border border-ink-divider p-1">
        {OPCIONES_DIAS.map((d) => (
          <button
            key={d}
            type="button"
            onClick={() => setDias(d)}
            className={`flex-1 rounded px-2 py-1 text-xs font-medium transition-colors ${
              dias === d
                ? "bg-accent text-ink"
                : "text-neutral-400 hover:text-ink-text"
            }`}
          >
            {d}d
          </button>
        ))}
      </div>

      <dl className="mt-4 space-y-3">
        <div className="flex items-baseline justify-between">
          <dt className="text-xs text-neutral-400">Tests realizados</dt>
          <dd className="text-sm font-medium text-ink-text">
            {resumen ? resumen.testsRealizados : "…"}
          </dd>
        </div>
        <div className="flex items-baseline justify-between">
          <dt className="text-xs text-neutral-400">Fallos</dt>
          <dd className="text-sm font-medium text-ink-text">
            {resumen && resumen.fallos !== null ? (
              resumen.fallos
            ) : resumen ? (
              <Link to="/oposiciones" className="text-xs font-normal text-accent hover:underline">
                Solo con plan de pago
              </Link>
            ) : (
              "…"
            )}
          </dd>
        </div>
      </dl>

      <Link
        to="/fallos"
        className="mt-4 inline-block text-xs text-accent hover:underline"
      >
        Ver detalle de fallos
      </Link>
    </div>
  );
}
