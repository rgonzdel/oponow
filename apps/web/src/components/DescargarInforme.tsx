import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { ApiError, apiFetchBlob } from "../lib/api-client";
import { buttonClass } from "./button";

const PERIODOS = [
  { dias: 7, texto: "7 días" },
  { dias: 30, texto: "30 días" },
  { dias: 90, texto: "90 días" },
  { dias: 0, texto: "Todo" },
] as const;

/** Descarga el informe de progreso en PDF (temas fuertes y débiles,
 * aciertos, fallos y tests por día). */
export function DescargarInforme() {
  const [dias, setDias] = useState<number>(30);

  const descargar = useMutation({
    mutationFn: async () => {
      const pdf = await apiFetchBlob(`/informe/progreso.pdf?dias=${dias}`);
      const url = URL.createObjectURL(pdf);
      const enlace = document.createElement("a");
      enlace.href = url;
      enlace.download = `informe-oponow-${new Date().toISOString().slice(0, 10)}.pdf`;
      document.body.appendChild(enlace);
      enlace.click();
      enlace.remove();
      setTimeout(() => URL.revokeObjectURL(url), 10_000);
    },
  });

  return (
    <div className="rounded-lg border border-ink-divider bg-ink-surface p-5">
      <div className="flex items-start gap-3">
        <span className="flex h-9 w-9 flex-none items-center justify-center rounded-md border border-ink-divider text-accent">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
            <path d="M14 3v5h5M9 17v-3M12 17v-6M15 17v-2" />
          </svg>
        </span>
        <div className="min-w-0">
          <h2 className="text-sm font-medium text-ink-text">Informe de progreso</h2>
          <p className="mt-1 text-xs text-neutral-500">
            PDF con los temas que mejor y peor llevas, aciertos, fallos y tests por día.
          </p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2" role="radiogroup" aria-label="Periodo del informe">
        {PERIODOS.map((p) => (
          <button
            key={p.dias}
            type="button"
            role="radio"
            aria-checked={dias === p.dias}
            onClick={() => setDias(p.dias)}
            className={`rounded-md border px-2.5 py-1 text-xs transition-colors ${
              dias === p.dias
                ? "border-accent bg-accent-800 text-accent-100"
                : "border-ink-divider text-neutral-400 hover:border-accent hover:text-ink-text"
            }`}
          >
            {p.texto}
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={() => descargar.mutate()}
        disabled={descargar.isPending}
        className={buttonClass("primary", "mt-4 w-full")}
      >
        {descargar.isPending ? "Generando el PDF…" : "Descargar informe PDF"}
      </button>
      {descargar.isError && (
        <p className="mt-2 text-xs text-red-400">
          {descargar.error instanceof ApiError ? descargar.error.message : "No se ha podido generar el informe"}
        </p>
      )}
    </div>
  );
}
