import { useState } from "react";
import type { PreguntaGenerada } from "../../asistente/tipos";

export function TestInteractivo({ preguntas }: { preguntas: PreguntaGenerada[] }) {
  const [elegidas, setElegidas] = useState<Record<number, number>>({});
  const respondidas = Object.keys(elegidas).length;
  const aciertos = preguntas.filter((p, i) => elegidas[i] === p.correcta).length;

  return (
    <div className="space-y-4">
      {preguntas.map((p, i) => {
        const elegida = elegidas[i];
        const resuelta = elegida !== undefined;
        return (
          <div key={i} className="rounded-md border border-ink-divider bg-ink p-4">
            <p className="text-sm leading-relaxed text-ink-text">
              <span className="mr-1.5 font-medium text-accent">{i + 1}.</span>
              {p.enunciado}
            </p>
            <div className="mt-3 space-y-1.5">
              {p.opciones.map((o, j) => {
                let estado = "border-ink-divider hover:border-accent/50";
                if (resuelta) {
                  if (j === p.correcta) estado = "border-emerald-400/60 bg-emerald-400/10";
                  else if (j === elegida) estado = "border-red-400/60 bg-red-400/10";
                  else estado = "border-ink-divider opacity-60";
                }
                return (
                  <button
                    key={j}
                    type="button"
                    disabled={resuelta}
                    onClick={() => setElegidas((e) => ({ ...e, [i]: j }))}
                    className={`flex w-full items-start gap-2.5 rounded-md border px-3 py-2 text-left text-sm transition-colors ${estado}`}
                  >
                    <span className="mt-px flex h-5 w-5 flex-none items-center justify-center rounded border border-ink-divider text-[11px] font-semibold text-neutral-400">
                      {String.fromCharCode(97 + j)}
                    </span>
                    <span className="text-neutral-200">{o}</span>
                  </button>
                );
              })}
            </div>
            {resuelta && (
              <div className="mt-3 rounded-md border border-ink-divider bg-ink-surface p-3 text-xs leading-relaxed text-neutral-300">
                <span className={elegida === p.correcta ? "font-medium text-emerald-400" : "font-medium text-red-400"}>
                  {elegida === p.correcta ? "Correcto. " : `Incorrecto: era la ${String.fromCharCode(97 + p.correcta)}). `}
                </span>
                Texto literal: «{p.explicacion}»{" "}
                <a href={p.fuente.url} target="_blank" rel="noreferrer" className="text-accent hover:underline">
                  {p.fuente.etiqueta} ↗
                </a>
              </div>
            )}
          </div>
        );
      })}
      {respondidas === preguntas.length && (
        <p className="text-sm text-ink-text">
          Resultado: <span className="font-medium text-accent">{aciertos}</span> de {preguntas.length} aciertos.
        </p>
      )}
    </div>
  );
}
