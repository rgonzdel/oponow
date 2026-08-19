import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Document, Page, pdfjs } from "react-pdf";
import { API_URL, getAccessToken } from "../lib/api-client";
import { buttonClass } from "./button";

// Vite: referencia el worker de pdf.js como asset propio en vez de un CDN
// externo — pdfjs-dist está fijado a la misma versión exacta que exige
// react-pdf (ver apps/web/package.json) para que este URL resuelva al
// archivo correcto.
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url,
).toString();

interface PdfViewerProps {
  temaId: string;
}

export function PdfViewer({ temaId }: PdfViewerProps) {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageWidth, setPageWidth] = useState<number>(680);
  const [loadError, setLoadError] = useState(false);

  const token = getAccessToken();
  const file = useMemo(
    () => ({ url: `${API_URL}/temario/temas/${temaId}/pdf` }),
    [temaId],
  );
  // react-pdf pide memoizar `options` (referencia estable) para no
  // recargar el documento en cada render.
  const options = useMemo(
    () => (token ? { httpHeaders: { Authorization: `Bearer ${token}` } } : undefined),
    [token],
  );

  return (
    <div>
      <div
        // Fricción básica ante la descarga casual: sin menú contextual y
        // sin selección de texto. No es infranqueable (nunca lo es un PDF
        // "solo visualización" — captura de pantalla, imprimir a PDF...
        // siguen siendo posibles), es la misma filosofía que ya usa el
        // resto de la app con la marca de agua del HTML.
        onContextMenu={(e) => e.preventDefault()}
        style={{ userSelect: "none" }}
        className="overflow-hidden rounded-lg border border-ink-divider bg-ink-surface"
        ref={(node) => {
          if (node) setPageWidth(Math.min(680, node.clientWidth - 2));
        }}
      >
        {loadError ? (
          <div className="p-10 text-center text-sm">
            <p className="text-red-400">
              No se pudo cargar el documento — puede que no tengas acceso con
              tu plan actual, o haya fallado la conexión.
            </p>
            <Link to="/oposiciones" className={buttonClass("primary", "mt-4")}>
              Ver planes
            </Link>
          </div>
        ) : (
          <Document
            file={file}
            options={options}
            onLoadSuccess={({ numPages: n }) => {
              setNumPages(n);
              setPageNumber(1);
            }}
            onLoadError={() => setLoadError(true)}
            loading={
              <div className="flex h-[400px] items-center justify-center text-sm text-neutral-500">
                Cargando…
              </div>
            }
          >
            <Page
              pageNumber={pageNumber}
              width={pageWidth}
              renderTextLayer={false}
              renderAnnotationLayer={false}
            />
          </Document>
        )}
      </div>

      {numPages && numPages > 1 && (
        <div className="mt-4 flex items-center justify-between">
          <button
            type="button"
            disabled={pageNumber === 1}
            onClick={() => setPageNumber((p) => Math.max(1, p - 1))}
            className={buttonClass("secondary")}
          >
            Anterior
          </button>
          <span className="text-xs text-neutral-500">
            Página {pageNumber} de {numPages}
          </span>
          <button
            type="button"
            disabled={pageNumber === numPages}
            onClick={() => setPageNumber((p) => Math.min(numPages, p + 1))}
            className={buttonClass("secondary")}
          >
            Siguiente
          </button>
        </div>
      )}
    </div>
  );
}
