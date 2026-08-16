import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { SiteHeader } from "../components/SiteHeader";
import { LoadingScreen } from "../components/LoadingScreen";
import { buttonClass } from "../components/button";
import { listBloques, listTemas, getBloque } from "../lib/temario-client";
import { ApiError } from "../lib/api-client";

export function TemaReaderPage() {
  const { slug = "", temaId = "" } = useParams();
  const [bloqueIndex, setBloqueIndex] = useState(0);

  const temasQuery = useQuery({
    queryKey: ["temario", "temas", slug],
    queryFn: () => listTemas(slug),
    enabled: Boolean(slug),
  });
  const tema = temasQuery.data?.find((t) => t.id === temaId);

  const bloquesQuery = useQuery({
    queryKey: ["temario", "bloques", temaId],
    queryFn: () => listBloques(temaId),
    enabled: Boolean(temaId),
  });

  const bloqueId = bloquesQuery.data?.[bloqueIndex]?.id;

  const contenidoQuery = useQuery({
    queryKey: ["temario", "bloque", bloqueId],
    queryFn: () => getBloque(bloqueId as string),
    enabled: Boolean(bloqueId),
  });

  if (bloquesQuery.isLoading) return <LoadingScreen />;

  const totalBloques = bloquesQuery.data?.length ?? 0;

  return (
    <div>
      <SiteHeader />

      <main className="mx-auto max-w-2xl px-6 py-12">
        <Link
          to={`/oposiciones/${slug}/temario`}
          className="text-sm text-neutral-500 hover:text-ink-text"
        >
          ← Volver al temario
        </Link>

        <div className="mt-4">
          {tema && (
            <h1 className="text-xl font-medium tracking-tight text-ink-text">
              {tema.titulo}
            </h1>
          )}
          {totalBloques > 1 && (
            <div className="mt-3">
              <div className="flex items-center justify-between text-xs text-neutral-500">
                <span>
                  Bloque {bloqueIndex + 1} de {totalBloques}
                </span>
              </div>
              <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-ink-surface">
                <div
                  className="h-full rounded-full bg-accent transition-[width]"
                  style={{ width: `${((bloqueIndex + 1) / totalBloques) * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {contenidoQuery.isError && (
          <div className="mt-6 rounded-lg border border-ink-divider bg-ink-surface p-6 text-sm">
            {contenidoQuery.error instanceof ApiError &&
            contenidoQuery.error.status === 404 ? (
              <>
                <p className="text-ink-text">
                  No tienes acceso a este contenido con tu plan actual.
                </p>
                <Link
                  to="/oposiciones"
                  className={buttonClass("primary", "mt-4 w-full")}
                >
                  Ver planes
                </Link>
              </>
            ) : (
              <p className="text-red-400">No se pudo cargar el contenido.</p>
            )}
          </div>
        )}

        {contenidoQuery.data && (
          <article
            className="tema-content mt-6 rounded-lg border border-ink-divider bg-ink-surface px-7 py-9 sm:px-10 sm:py-10"
            dangerouslySetInnerHTML={{ __html: contenidoQuery.data.contenidoHtml }}
          />
        )}

        {totalBloques > 1 && (
          <div className="mt-6 flex items-center justify-between">
            <button
              type="button"
              disabled={bloqueIndex === 0}
              onClick={() => setBloqueIndex((i) => Math.max(0, i - 1))}
              className={buttonClass("secondary")}
            >
              Anterior
            </button>
            <button
              type="button"
              disabled={bloqueIndex === totalBloques - 1}
              onClick={() =>
                setBloqueIndex((i) => Math.min(totalBloques - 1, i + 1))
              }
              className={buttonClass("primary")}
            >
              Siguiente
            </button>
          </div>
        )}

        {tema && (
          <Link
            to={`/oposiciones/${slug}/temario/${temaId}/test`}
            className={buttonClass("primary", "mt-8 w-full")}
          >
            Hacer test de este tema
          </Link>
        )}
      </main>
    </div>
  );
}
