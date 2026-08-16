import { Navigate, useParams } from "react-router-dom";
import { SiteHeader } from "../components/SiteHeader";
import { LEGAL_PAGINAS } from "../data/legal";

export function LegalPage() {
  const { slug = "" } = useParams();
  const pagina = LEGAL_PAGINAS[slug];

  if (!pagina) return <Navigate to="/" replace />;

  return (
    <div>
      <SiteHeader />

      <main className="mx-auto max-w-2xl px-6 py-12">
        <h1 className="text-2xl font-medium tracking-tight text-ink-text">
          {pagina.titulo}
        </h1>

        <p className="mt-3 rounded-md border border-amber-400/30 bg-amber-400/10 px-3 py-2 text-xs text-amber-400">
          Borrador pendiente de revisión legal. Los datos entre corchetes
          (razón social, NIF, domicilio, email de contacto) están sin
          rellenar todavía.
        </p>

        <div className="mt-8 space-y-8">
          {pagina.secciones.map((seccion) => (
            <section key={seccion.titulo}>
              <h2 className="text-sm font-medium text-ink-text">
                {seccion.titulo}
              </h2>
              <div className="mt-2 space-y-2">
                {seccion.parrafos.map((p, i) => (
                  <p key={i} className="text-sm leading-relaxed text-neutral-400">
                    {p}
                  </p>
                ))}
              </div>
            </section>
          ))}
        </div>
      </main>
    </div>
  );
}
