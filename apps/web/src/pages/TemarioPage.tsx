import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { SiteHeader } from "../components/SiteHeader";
import { LoadingScreen } from "../components/LoadingScreen";
import { listTemas } from "../lib/temario-client";
import { OPOSICIONES } from "../data/oposiciones";

export function TemarioPage() {
  const { slug = "" } = useParams();
  const op = OPOSICIONES.find((o) => o.slug === slug);

  const temasQuery = useQuery({
    queryKey: ["temario", "temas", slug],
    queryFn: () => listTemas(slug),
    enabled: Boolean(slug),
  });

  if (temasQuery.isLoading) return <LoadingScreen />;

  return (
    <div>
      <SiteHeader />

      <main className="mx-auto max-w-2xl px-6 py-12">
        <h1 className="text-2xl font-medium tracking-tight text-ink-text">
          Temario{op ? ` · ${op.siglas}` : ""}
        </h1>
        <p className="mt-2 text-sm text-neutral-400">
          Solo se muestran los temas a los que tienes acceso con tu plan
          actual.
        </p>

        <ul className="mt-8 divide-y divide-ink-divider overflow-hidden rounded-lg border border-ink-divider">
          {temasQuery.data?.map((tema) => (
            <li key={tema.id}>
              <Link
                to={`/oposiciones/${slug}/temario/${tema.id}`}
                className="flex items-center justify-between gap-4 bg-ink-surface px-5 py-4 transition-colors hover:bg-ink"
              >
                <span className="text-sm text-ink-text">{tema.titulo}</span>
                {tema.esGratuito && (
                  <span className="whitespace-nowrap rounded-md bg-accent-800 px-2 py-0.5 text-[11px] font-medium text-accent-100">
                    Gratis
                  </span>
                )}
              </Link>
            </li>
          ))}
          {temasQuery.data?.length === 0 && (
            <li className="bg-ink-surface px-5 py-6 text-center text-sm text-neutral-500">
              Todavía no hay temas publicados para esta oposición.
            </li>
          )}
        </ul>
      </main>
    </div>
  );
}
