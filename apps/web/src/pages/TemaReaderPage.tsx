import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { SiteHeader } from "../components/SiteHeader";
import { LoadingScreen } from "../components/LoadingScreen";
import { buttonClass } from "../components/button";
import { listTemas, listBloques, getBloque } from "../lib/temario-client";
import { OPOSICIONES } from "@oponow/shared-types";

export function TemaReaderPage() {
  const { slug = "", temaId = "" } = useParams();
  const op = OPOSICIONES.find((o) => o.slug === slug);

  const temasQuery = useQuery({
    queryKey: ["temario", "temas", slug],
    queryFn: () => listTemas(slug),
    enabled: Boolean(slug),
  });
  const tema = temasQuery.data?.find((t) => t.id === temaId);

  const contenidoQuery = useQuery({
    queryKey: ["temario", "bloques", temaId],
    queryFn: async () => {
      const bloques = await listBloques(temaId);
      return Promise.all(bloques.map((bloque) => getBloque(bloque.id)));
    },
    enabled: Boolean(temaId),
  });

  if (temasQuery.isLoading || contenidoQuery.isLoading) return <LoadingScreen />;

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

        {tema && (
          <h1 className="mt-4 text-[28px] font-medium leading-tight tracking-tight text-ink-text">
            {tema.titulo}
          </h1>
        )}
        {op && (
          <p className="mt-2 border-b border-ink-divider pb-8 text-sm text-neutral-500">
            {op.nombre} — contenido de estudio Oponow, no oficial, no sustituye
            al BOE ni a la convocatoria vigente.
          </p>
        )}

        {contenidoQuery.isError ? (
          <p className="mt-8 text-sm text-red-400">
            No se pudo cargar el contenido de este tema — puede que no tengas
            acceso con tu plan actual.
          </p>
        ) : (
          <div className="tema-content mt-8">
            {contenidoQuery.data?.map((bloque, index) => (
              <div key={bloque.id} className={index > 0 ? "mt-16" : undefined}>
                {contenidoQuery.data.length > 1 && (
                  <div className="flex items-center gap-3">
                    <span className="text-[11px] font-semibold uppercase tracking-wide text-accent">
                      Bloque {index + 1} de {contenidoQuery.data.length}
                    </span>
                    <span
                      className="h-px flex-1"
                      style={{
                        background:
                          "linear-gradient(90deg, rgba(233,233,237,0.16), transparent)",
                      }}
                    />
                  </div>
                )}
                <div dangerouslySetInnerHTML={{ __html: bloque.contenidoHtml }} />
              </div>
            ))}
          </div>
        )}

        {tema && (
          <Link
            to={`/oposiciones/${slug}/temario/${temaId}/test`}
            className={buttonClass("primary", "mt-10 w-full")}
          >
            Hacer test de este tema
          </Link>
        )}
      </main>
    </div>
  );
}
