import type { ReactNode } from "react";
import { LEGAL_PAGINAS, type LegalBloque, type LegalPagina } from "../data/legal";

// Componente puro (sin router ni contexto): lo usan tanto LegalPage como
// scripts/prerender-legal.tsx, que lo renderiza a HTML estático en el build
// para que el texto esté en el HTML que recibe cualquier navegador o robot.
export function LegalDocumento({ pagina }: { pagina: LegalPagina }) {
  return (
    <main className="mx-auto max-w-2xl px-6 py-12">
      <h1 className="text-2xl font-medium tracking-tight text-ink-text">{pagina.titulo}</h1>
      <p className="mt-2 text-xs text-neutral-500">Última actualización: {pagina.actualizado}</p>

      <div className="mt-8 space-y-8">
        {pagina.secciones.map((seccion) => (
          <section key={seccion.titulo}>
            <h2 className="text-base font-medium text-ink-text">{seccion.titulo}</h2>
            <div className="mt-2 space-y-2">
              {seccion.bloques.map((bloque, i) => (
                <Bloque key={i} bloque={bloque} />
              ))}
            </div>
          </section>
        ))}
      </div>

      <nav aria-label="Información legal" className="mt-12 flex flex-wrap gap-x-5 gap-y-2 border-t border-ink-divider pt-6 text-xs text-neutral-500">
        <a href="/" className="hover:text-ink-text">Oponow · Inicio</a>
        {Object.values(LEGAL_PAGINAS)
          .filter((p) => p.slug !== pagina.slug)
          .map((p) => (
            <a key={p.slug} href={`/legal/${p.slug}`} className="hover:text-ink-text">
              {p.titulo}
            </a>
          ))}
      </nav>
    </main>
  );
}

function Bloque({ bloque }: { bloque: LegalBloque }) {
  if (typeof bloque === "string") {
    return <p className="text-sm leading-relaxed text-neutral-400">{conEnlaces(bloque)}</p>;
  }
  return (
    <ul className="list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-neutral-400 marker:text-accent">
      {bloque.lista.map((item, i) => (
        <li key={i}>{conEnlaces(item)}</li>
      ))}
    </ul>
  );
}

// [texto](url) o una URL suelta (https://…) → enlace.
const ENLACE = /\[([^\]]+)\]\(([^)\s]+)\)|(https?:\/\/[^\s)]+[^\s).,;:])/g;

function conEnlaces(texto: string): ReactNode[] {
  const partes: ReactNode[] = [];
  let ultimo = 0;
  for (const m of texto.matchAll(ENLACE)) {
    const inicio = m.index ?? 0;
    if (inicio > ultimo) partes.push(texto.slice(ultimo, inicio));
    const href = m[2] ?? m[3];
    const etiqueta = m[1] ?? m[3];
    const externo = href.startsWith("http");
    partes.push(
      <a
        key={inicio}
        href={href}
        className="text-accent underline-offset-2 hover:underline"
        {...(externo ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {etiqueta}
      </a>,
    );
    ultimo = inicio + m[0].length;
  }
  if (ultimo < texto.length) partes.push(texto.slice(ultimo));
  return partes;
}
