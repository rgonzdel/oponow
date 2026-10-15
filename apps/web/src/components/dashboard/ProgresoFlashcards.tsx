import { Link } from "react-router-dom";
import type { TemaFlashcards } from "../../lib/flashcards-client";

// Un solo tono (el acento de la marca) en dos pasos ordenados: más claro =
// más avanzado. Validado como escala ordinal contra la superficie oscura
// (#232532) y la pista (#161826): ambos pasos superan 3:1. Las tarjetas
// nuevas son la pista vacía.
const DOMINADAS = "#b5abfc";
const PENDIENTES = "#796cbf";

function Leyenda() {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-neutral-400">
      <span className="flex items-center gap-1.5">
        <span className="h-2 w-2 rounded-sm" style={{ background: DOMINADAS }} /> Dominadas
      </span>
      <span className="flex items-center gap-1.5">
        <span className="h-2 w-2 rounded-sm" style={{ background: PENDIENTES }} /> Por repasar
      </span>
      <span className="flex items-center gap-1.5">
        <span className="h-2 w-2 rounded-sm border border-ink-divider bg-ink" /> Nuevas
      </span>
    </div>
  );
}

export function ProgresoFlashcards({ slug, temas }: { slug: string; temas: TemaFlashcards[] }) {
  const conTarjetas = temas.filter((t) => t.total > 0);
  const total = conTarjetas.reduce((s, t) => s + t.total, 0);
  const dominadas = conTarjetas.reduce((s, t) => s + t.dominadas, 0);
  const pendientes = conTarjetas.reduce((s, t) => s + t.pendientes, 0);

  if (!conTarjetas.length) {
    return <p className="text-sm text-neutral-500">Esta oposición todavía no tiene flashcards.</p>;
  }

  return (
    <div>
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className="text-sm text-neutral-300">
          <span className="text-2xl font-medium tabular-nums text-ink-text">{Math.round((dominadas / total) * 100)} %</span>{" "}
          dominado · {dominadas} de {total} tarjetas
        </p>
        <Leyenda />
      </div>

      <ul className="mt-4 space-y-2.5">
        {conTarjetas.map((t) => {
          const pDom = (t.dominadas / t.total) * 100;
          const pPend = (t.pendientes / t.total) * 100;
          return (
            <li key={t.id}>
              <Link
                to={`/oposiciones/${slug}/flashcards`}
                className="group grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 gap-y-1"
                title={`${t.titulo}: ${t.dominadas} dominadas, ${t.pendientes} por repasar, ${t.nuevas} nuevas`}
              >
                <span className="truncate text-xs text-neutral-300 group-hover:text-ink-text">
                  <span className="mr-1.5 tabular-nums text-neutral-500">{t.orden}</span>
                  {t.titulo.replace(/^Tema \d+ · /, "")}
                </span>
                <span className="text-[11px] tabular-nums text-neutral-500">
                  {t.dominadas}/{t.total}
                </span>
                <span className="col-span-2 flex h-2 overflow-hidden rounded-full border border-ink-divider bg-ink">
                  {pDom > 0 && <span style={{ width: `${pDom}%`, background: DOMINADAS }} className="h-full" />}
                  {pPend > 0 && (
                    <span
                      style={{ width: `${pPend}%`, background: PENDIENTES, marginLeft: pDom > 0 ? 2 : 0 }}
                      className="h-full"
                    />
                  )}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
      {pendientes > 0 && (
        <p className="mt-3 text-xs text-neutral-500">
          Tienes {pendientes} {pendientes === 1 ? "tarjeta" : "tarjetas"} por repasar hoy.
        </p>
      )}
    </div>
  );
}
