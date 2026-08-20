import { Link, Navigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { SiteHeader } from "../components/SiteHeader";
import { LoadingScreen } from "../components/LoadingScreen";
import { OPOSICION_ICONS } from "../components/oposicion-icons";
import { listTemas } from "../lib/temario-client";
import { OPOSICIONES } from "@oponow/shared-types";

function ChevronRightIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="flex-none text-neutral-500 transition-colors group-hover:text-accent"
    >
      <path d="M9 6l6 6-6 6" />
    </svg>
  );
}

export function TemarioPage() {
  const { slug = "" } = useParams();
  const op = OPOSICIONES.find((o) => o.slug === slug);

  const temasQuery = useQuery({
    queryKey: ["temario", "temas", slug],
    queryFn: () => listTemas(slug),
    enabled: Boolean(slug),
  });

  if (slug && !op) return <Navigate to="/oposiciones" replace />;
  if (temasQuery.isLoading) return <LoadingScreen />;

  const temas = temasQuery.data ?? [];
  const totalOficial = op?.bloques.reduce((n, b) => n + b.temas, 0) ?? 0;
  const progreso = totalOficial > 0 ? Math.min(100, (temas.length / totalOficial) * 100) : 0;

  return (
    <div>
      <SiteHeader />

      <main className="mx-auto max-w-2xl px-6 py-12">
        {op && (
          <Link
            to={`/oposiciones/${slug}`}
            className="text-sm text-neutral-500 transition-colors hover:text-ink-text"
          >
            ← {op.nombre}
          </Link>
        )}

        <h1 className="mt-3 text-2xl font-medium tracking-tight text-ink-text">
          Temario{op ? ` · ${op.siglas}` : ""}
        </h1>
        <p className="mt-2 text-sm text-neutral-400">
          Solo se muestran los temas a los que tienes acceso con tu plan
          actual. Vamos ampliando el temario progresivamente.
        </p>

        {totalOficial > 0 && (
          <div className="mt-6 flex items-center gap-4 rounded-lg border border-ink-divider bg-ink-surface p-4">
            <span className="flex h-9 w-9 flex-none items-center justify-center rounded-md border border-ink-divider text-accent">
              {OPOSICION_ICONS.progreso}
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm text-ink-text">
                <span className="font-medium">{temas.length}</span> de{" "}
                {totalOficial} temas del programa oficial
              </p>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-ink">
                <div
                  className="h-full rounded-full bg-accent transition-[width]"
                  style={{ width: `${progreso}%` }}
                />
              </div>
            </div>
          </div>
        )}

        <ul className="mt-6 space-y-2.5">
          {temas.map((tema) => (
            <li key={tema.id}>
              <Link
                to={`/oposiciones/${slug}/temario/${tema.id}`}
                className="group flex items-center gap-4 rounded-lg border border-ink-divider bg-ink-surface p-4 transition-colors hover:border-accent"
              >
                <span className="flex h-9 w-9 flex-none items-center justify-center rounded-full border border-ink-divider text-sm font-medium text-accent">
                  {tema.orden}
                </span>
                <span className="min-w-0 flex-1 truncate text-sm text-ink-text">
                  {tema.titulo}
                </span>
                {tema.esGratuito && (
                  <span className="flex-none whitespace-nowrap rounded-md bg-accent-800 px-2 py-0.5 text-[11px] font-medium text-accent-100">
                    Gratis
                  </span>
                )}
                <ChevronRightIcon />
              </Link>
            </li>
          ))}
          {temas.length === 0 && (
            <li className="flex flex-col items-center gap-3 rounded-lg border border-ink-divider bg-ink-surface px-5 py-10 text-center">
              <span className="flex h-10 w-10 items-center justify-center rounded-md border border-ink-divider text-accent">
                {OPOSICION_ICONS.temario}
              </span>
              <p className="text-sm text-neutral-500">
                Todavía no hay temas publicados para esta oposición.
              </p>
            </li>
          )}
        </ul>
      </main>
    </div>
  );
}
