import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useRef, useState } from "react";
import { SiteHeader } from "../components/SiteHeader";
import { LoadingScreen } from "../components/LoadingScreen";
import { buttonClass } from "../components/button";
import { listTemas, listBloques, getBloque } from "../lib/temario-client";
import { OPOSICIONES } from "@oponow/shared-types";

const WORDS_PER_MINUTE = 200;

function estimateMinutes(html: string): number {
  const words = html
    .replace(/<[^>]+>/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}

function firstHeading(html: string): string | null {
  return html.match(/<h3>(.*?)<\/h3>/)?.[1] ?? null;
}

export function TemaReaderPage() {
  const { slug = "", temaId = "" } = useParams();
  const op = OPOSICIONES.find((o) => o.slug === slug);
  const [activeId, setActiveId] = useState<string | null>(null);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

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
  const bloques = useMemo(() => contenidoQuery.data ?? [], [contenidoQuery.data]);

  const totalMinutos = useMemo(
    () => bloques.reduce((sum, b) => sum + estimateMinutes(b.contenidoHtml), 0),
    [bloques],
  );

  useEffect(() => {
    if (bloques.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((entry) => entry.isIntersecting);
        if (visible) setActiveId(visible.target.id);
      },
      { rootMargin: "-15% 0px -70% 0px" },
    );
    for (const bloque of bloques) {
      const el = sectionRefs.current[bloque.id];
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [bloques]);

  if (temasQuery.isLoading || contenidoQuery.isLoading) return <LoadingScreen />;

  return (
    <div>
      <SiteHeader />

      <div className="mx-auto max-w-5xl px-6 py-10 lg:grid lg:grid-cols-[240px_minmax(0,1fr)] lg:items-start lg:gap-14">
        <aside className="pb-8 lg:sticky lg:top-6 lg:max-h-[calc(100vh-3rem)] lg:self-start lg:overflow-y-auto">
          <Link
            to={`/oposiciones/${slug}/temario`}
            className="text-sm text-neutral-500 hover:text-ink-text"
          >
            ← {op?.siglas ?? "Temario"}
          </Link>

          {tema && (
            <h1 className="mt-4 text-[15px] font-medium leading-snug text-ink-text">
              {tema.titulo}
            </h1>
          )}
          {bloques.length > 0 && (
            <p className="mt-1 text-xs text-neutral-500">
              {bloques.length} bloque{bloques.length === 1 ? "" : "s"} · {totalMinutos} min
              de lectura
            </p>
          )}

          {bloques.length > 1 && (
            <>
              <div className="mt-5 h-px bg-ink-divider" />
              <ol className="mt-4 flex flex-col gap-1">
                {bloques.map((bloque, index) => {
                  const label = firstHeading(bloque.contenidoHtml) ?? `Bloque ${index + 1}`;
                  const isActive = activeId === bloque.id;
                  return (
                    <li key={bloque.id}>
                      <a
                        href={`#bloque-${bloque.id}`}
                        className={`-mx-2.5 flex gap-2.5 rounded-md px-2.5 py-2 text-[13px] leading-snug transition-colors ${
                          isActive
                            ? "bg-accent-900 text-ink-text"
                            : "text-neutral-400 hover:text-ink-text"
                        }`}
                      >
                        <span
                          className={`mt-0.5 flex h-[17px] w-[17px] flex-none items-center justify-center rounded-full text-[9px] font-semibold ${
                            isActive
                              ? "border border-accent text-accent"
                              : "border border-ink-divider text-neutral-500"
                          }`}
                        >
                          {index + 1}
                        </span>
                        <span>{label}</span>
                      </a>
                    </li>
                  );
                })}
              </ol>
            </>
          )}
        </aside>

        <main className="mt-10 max-w-[720px] lg:mt-0">
          {op && (
            <p className="mb-8 border-b border-ink-divider pb-6 text-sm text-neutral-500">
              {op.nombre} — contenido de estudio Oponow, no oficial, no sustituye al BOE
              ni a la convocatoria vigente.
            </p>
          )}

          {contenidoQuery.isError ? (
            <p className="text-sm text-red-400">
              No se pudo cargar el contenido de este tema — puede que no tengas acceso
              con tu plan actual.
            </p>
          ) : (
            <div className="tema-content">
              {bloques.map((bloque, index) => (
                <section
                  key={bloque.id}
                  id={`bloque-${bloque.id}`}
                  ref={(el) => {
                    sectionRefs.current[bloque.id] = el;
                  }}
                  className={index > 0 ? "mt-16" : undefined}
                >
                  {bloques.length > 1 && (
                    <div className="mb-2 flex items-center gap-3">
                      <span className="text-[11px] font-semibold uppercase tracking-wide text-accent">
                        Bloque {index + 1} de {bloques.length}
                      </span>
                      <span
                        className="h-px flex-1"
                        style={{
                          background: "linear-gradient(90deg, rgba(233,233,237,0.16), transparent)",
                        }}
                      />
                      <span className="text-[11px] text-neutral-500">
                        {estimateMinutes(bloque.contenidoHtml)} min
                      </span>
                    </div>
                  )}
                  <div dangerouslySetInnerHTML={{ __html: bloque.contenidoHtml }} />
                </section>
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
    </div>
  );
}
