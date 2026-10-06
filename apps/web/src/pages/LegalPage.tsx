import { Navigate, useParams } from "react-router-dom";
import { SiteHeader } from "../components/SiteHeader";
import { LegalDocumento } from "../components/LegalDocumento";
import { LEGAL_PAGINAS } from "../data/legal";

export function LegalPage() {
  const { slug = "" } = useParams();
  // /legal/privacidad.html es el fichero pre-renderizado (scripts/prerender-legal.tsx):
  // si alguien abre esa URL directamente, que muestre la misma página.
  const pagina = LEGAL_PAGINAS[slug.replace(/\.html$/, "")];

  if (!pagina) return <Navigate to="/" replace />;

  return (
    <div>
      <SiteHeader />
      <LegalDocumento pagina={pagina} />
    </div>
  );
}
