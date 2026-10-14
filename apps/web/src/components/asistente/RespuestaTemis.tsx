import { useState } from "react";
import { Link } from "react-router-dom";
import type { Bloque, Respuesta } from "../../asistente/tipos";
import { TextoEnriquecido, TextoResaltado } from "./TextoEnriquecido";
import { TestInteractivo } from "./TestInteractivo";

function BloqueVista({ bloque, onConsulta }: { bloque: Bloque; onConsulta: (q: string) => void }) {
  switch (bloque.tipo) {
    case "parrafo":
      return bloque.texto ? (
        <p className="text-[15px] leading-relaxed text-neutral-200">
          <TextoEnriquecido texto={bloque.texto} />
        </p>
      ) : null;

    case "cita":
      return (
        <figure className="rounded-md border border-ink-divider border-l-accent bg-ink px-4 py-3" style={{ borderLeftWidth: 3 }}>
          <figcaption className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
            <span className="text-xs font-semibold uppercase tracking-wide text-accent">
              {bloque.precepto} · {bloque.norma}
            </span>
            <a href={bloque.url} target="_blank" rel="noreferrer" className="text-xs text-neutral-500 hover:text-accent">
              Ver en el BOE ↗
            </a>
          </figcaption>
          {bloque.rubrica && <p className="mt-1 text-sm font-medium text-ink-text">{bloque.rubrica}</p>}
          {bloque.ruta.length > 0 && <p className="mt-0.5 text-[11px] text-neutral-500">{bloque.ruta.join(" › ")}</p>}
          <div className="mt-2 space-y-1.5 text-sm leading-relaxed text-neutral-300">
            {bloque.parrafos.map((p, i) => (
              <p key={i}>
                <TextoResaltado texto={p} resaltar={bloque.resaltar} />
              </p>
            ))}
          </div>
        </figure>
      );

    case "lista":
      return (
        <div>
          {bloque.titulo && <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-neutral-500">{bloque.titulo}</p>}
          <ul className="list-disc space-y-1 pl-5 text-sm leading-relaxed text-neutral-300 marker:text-accent">
            {bloque.items.map((it, i) => (
              <li key={i}>
                <TextoEnriquecido texto={it} />
              </li>
            ))}
          </ul>
        </div>
      );

    case "claves":
      return (
        <div className="rounded-md border border-accent/30 bg-accent-900/40 px-4 py-3">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-accent-300">{bloque.titulo}</p>
          <ul className="mt-1.5 space-y-1 text-sm leading-relaxed text-neutral-200">
            {bloque.items.map((it, i) => (
              <li key={i} className="flex gap-2">
                <span className="text-accent">›</span>
                <span>
                  <TextoEnriquecido texto={it} />
                </span>
              </li>
            ))}
          </ul>
        </div>
      );

    case "aviso":
      return <p className="text-xs leading-relaxed text-neutral-500">{bloque.texto}</p>;

    case "tabla":
      return (
        <div className="overflow-x-auto rounded-md border border-ink-divider">
          <table className="w-full text-left text-sm">
            {bloque.cabecera.some(Boolean) && (
              <thead className="bg-ink text-xs text-neutral-500">
                <tr>
                  {bloque.cabecera.map((c, i) => (
                    <th key={i} className="px-3 py-2 font-medium">
                      {c}
                    </th>
                  ))}
                </tr>
              </thead>
            )}
            <tbody className="divide-y divide-ink-divider">
              {bloque.filas.map((f, i) => (
                <tr key={i}>
                  {f.map((c, j) => (
                    <td key={j} className={`px-3 py-2 align-top ${j === 0 ? "text-neutral-400" : "text-neutral-200"}`}>
                      {c}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );

    case "resultados":
      return (
        <div>
          <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-neutral-500">{bloque.titulo}</p>
          <ul className="divide-y divide-ink-divider overflow-hidden rounded-md border border-ink-divider">
            {bloque.items.map((r, i) => (
              <li key={i}>
                <button
                  type="button"
                  onClick={() => onConsulta(r.consulta)}
                  className="block w-full px-3 py-2 text-left transition-colors hover:bg-white/5"
                >
                  <span className="text-xs font-medium text-accent">
                    {r.precepto} · {r.norma}
                  </span>
                  {r.rubrica && <span className="ml-1.5 text-xs text-neutral-400">{r.rubrica}</span>}
                  <span className="mt-0.5 block text-xs leading-relaxed text-neutral-500">{r.extracto}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      );

    case "test":
      return <TestInteractivo preguntas={bloque.preguntas} />;

    case "enlace":
      return (
        <Link to={bloque.to} className="inline-flex text-sm text-accent hover:underline">
          {bloque.texto} →
        </Link>
      );
  }
}

export function RespuestaTemis({
  respuesta,
  onConsulta,
  mostrarSugerencias,
}: {
  respuesta: Respuesta;
  onConsulta: (q: string) => void;
  mostrarSugerencias: boolean;
}) {
  const [verFuentes, setVerFuentes] = useState(false);
  return (
    <div className="rounded-lg border border-ink-divider bg-ink-surface p-5">
      {respuesta.titulo && <h2 className="mb-3 text-base font-medium leading-snug text-ink-text">{respuesta.titulo}</h2>}
      <div className="space-y-4">
        {respuesta.bloques.map((b, i) => (
          <BloqueVista key={i} bloque={b} onConsulta={onConsulta} />
        ))}
      </div>

      {respuesta.fuentes.length > 0 && (
        <div className="mt-4 border-t border-ink-divider pt-3">
          <button type="button" onClick={() => setVerFuentes((v) => !v)} className="text-xs text-neutral-500 hover:text-ink-text">
            {verFuentes ? "▾" : "▸"} Fuentes ({respuesta.fuentes.length})
          </button>
          {verFuentes && (
            <ul className="mt-2 space-y-1">
              {respuesta.fuentes.map((f) => (
                <li key={f.url}>
                  <a href={f.url} target="_blank" rel="noreferrer" className="text-xs text-accent hover:underline">
                    {f.etiqueta} ↗
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {mostrarSugerencias && respuesta.sugerencias.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {respuesta.sugerencias.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => onConsulta(s)}
              className="rounded-full border border-ink-divider px-3 py-1 text-xs text-neutral-300 transition-colors hover:border-accent hover:text-ink-text"
            >
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
