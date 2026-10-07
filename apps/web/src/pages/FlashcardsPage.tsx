import { Link, Navigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { OPOSICIONES } from "@oponow/shared-types";
import { SiteHeader } from "../components/SiteHeader";
import { LoadingScreen } from "../components/LoadingScreen";
import { buttonClass } from "../components/button";
import { getResumenFlashcards, type TemaFlashcards } from "../lib/flashcards-client";

/** Flashcards de una oposición: temas con tarjetas y su estado de repaso. */
export function FlashcardsPage() {
  const { slug = "" } = useParams();
  const op = OPOSICIONES.find((o) => o.slug === slug);

  const resumen = useQuery({
    queryKey: ["flashcards", "resumen", slug],
    queryFn: () => getResumenFlashcards(slug),
    enabled: Boolean(op),
  });

  if (!op) return <Navigate to="/flashcards" replace />;
  if (resumen.isLoading) return <LoadingScreen />;

  const temas = resumen.data?.temas ?? [];
  const suma = (k: keyof Pick<TemaFlashcards, "total" | "nuevas" | "pendientes" | "dominadas">) =>
    temas.reduce((n, t) => n + t[k], 0);
  const total = suma("total");
  const porRepasar = suma("pendientes") + suma("nuevas");
  const dominadas = suma("dominadas");

  return (
    <div>
      <SiteHeader />
      <main className="mx-auto max-w-2xl px-6 py-12">
        <Link to="/flashcards" className="text-sm text-neutral-500 transition-colors hover:text-ink-text">
          ← Flashcards
        </Link>
        <h1 className="mt-3 text-2xl font-medium tracking-tight text-ink-text">Flashcards · {op.siglas}</h1>
        <p className="mt-2 text-sm text-neutral-400">
          Tarjetas de pregunta y respuesta con la cita literal del BOE. Las que falles volverán antes; las que
          domines se irán espaciando.
        </p>

        {total > 0 && (
          <div className="mt-6 rounded-lg border border-ink-divider bg-ink-surface p-5">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-sm text-ink-text">
                  <span className="text-2xl font-medium">{porRepasar}</span>{" "}
                  <span className="text-neutral-400">por repasar hoy</span>
                </p>
                <p className="mt-1 text-xs text-neutral-500">
                  {dominadas} de {total} tarjetas dominadas
                </p>
              </div>
              <div className="flex gap-2">
                <Link
                  to={`/oposiciones/${slug}/flashcards/repaso?modo=todas`}
                  className={buttonClass("ghost")}
                >
                  Al azar
                </Link>
                <Link
                  to={`/oposiciones/${slug}/flashcards/repaso`}
                  className={buttonClass("primary")}
                  aria-disabled={porRepasar === 0}
                >
                  Repasar ahora
                </Link>
              </div>
            </div>
            <BarraDominio total={total} dominadas={dominadas} />
          </div>
        )}

        <ul className="mt-6 space-y-2.5">
          {temas.map((tema) => (
            <li key={tema.id}>
              <Link
                to={`/oposiciones/${slug}/flashcards/repaso?tema=${tema.id}`}
                className="group flex items-center gap-4 rounded-lg border border-ink-divider bg-ink-surface p-4 transition-colors hover:border-accent"
              >
                <span className="flex h-9 w-9 flex-none items-center justify-center rounded-full border border-ink-divider text-sm font-medium text-accent">
                  {tema.orden}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm text-ink-text">{tema.titulo}</span>
                  <span className="mt-0.5 block text-xs text-neutral-500">
                    {tema.total} tarjetas · {tema.dominadas} dominadas
                  </span>
                </span>
                {tema.pendientes + tema.nuevas > 0 ? (
                  <span className="flex-none whitespace-nowrap rounded-md bg-accent-800 px-2 py-0.5 text-[11px] font-medium text-accent-100">
                    {tema.pendientes + tema.nuevas} por repasar
                  </span>
                ) : (
                  <span className="flex-none whitespace-nowrap rounded-md bg-green-500/15 px-2 py-0.5 text-[11px] font-medium text-green-400">
                    Al día
                  </span>
                )}
              </Link>
            </li>
          ))}
          {temas.length === 0 && (
            <li className="rounded-lg border border-ink-divider bg-ink-surface px-5 py-10 text-center text-sm text-neutral-500">
              Todavía no hay flashcards disponibles para tu plan en esta oposición.
            </li>
          )}
        </ul>
      </main>
    </div>
  );
}

function BarraDominio({ total, dominadas }: { total: number; dominadas: number }) {
  const pct = total > 0 ? (dominadas / total) * 100 : 0;
  return (
    <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-ink">
      <div className="h-full rounded-full bg-accent transition-[width] duration-700" style={{ width: `${pct}%` }} />
    </div>
  );
}

/** /flashcards: elegir oposición. */
export function FlashcardsOposicionesPage() {
  const disponibles = OPOSICIONES.filter((o) => o.disponible);
  return (
    <div>
      <SiteHeader />
      <main className="mx-auto max-w-2xl px-6 py-12">
        <Link to="/dashboard" className="text-sm text-neutral-500 transition-colors hover:text-ink-text">
          ← Panel
        </Link>
        <h1 className="mt-3 text-2xl font-medium tracking-tight text-ink-text">Flashcards</h1>
        <p className="mt-2 text-sm text-neutral-400">Elige la oposición que quieres repasar.</p>
        <ul className="mt-6 space-y-2.5">
          {disponibles.map((op) => (
            <li key={op.slug}>
              <Link
                to={`/oposiciones/${op.slug}/flashcards`}
                className="flex items-center gap-4 rounded-lg border border-ink-divider bg-ink-surface p-4 transition-colors hover:border-accent"
              >
                <span className="flex h-9 min-w-[2.25rem] flex-none items-center justify-center rounded-md border border-ink-divider px-1.5 text-xs font-medium text-accent">
                  {op.siglas}
                </span>
                <span className="min-w-0 flex-1 truncate text-sm text-ink-text">{op.nombre}</span>
              </Link>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
