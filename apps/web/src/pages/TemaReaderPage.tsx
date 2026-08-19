import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { SiteHeader } from "../components/SiteHeader";
import { LoadingScreen } from "../components/LoadingScreen";
import { PdfViewer } from "../components/PdfViewer";
import { buttonClass } from "../components/button";
import { listTemas } from "../lib/temario-client";

export function TemaReaderPage() {
  const { slug = "", temaId = "" } = useParams();

  const temasQuery = useQuery({
    queryKey: ["temario", "temas", slug],
    queryFn: () => listTemas(slug),
    enabled: Boolean(slug),
  });
  const tema = temasQuery.data?.find((t) => t.id === temaId);

  if (temasQuery.isLoading) return <LoadingScreen />;

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
          <h1 className="mt-4 text-xl font-medium tracking-tight text-ink-text">
            {tema.titulo}
          </h1>
        )}

        <div className="mt-6">
          <PdfViewer temaId={temaId} />
        </div>

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
