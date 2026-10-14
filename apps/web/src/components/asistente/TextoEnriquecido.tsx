import { Fragment } from "react";
import { normalizar, raiz } from "../../asistente/texto";

/** Renderiza `**negrita**` sin usar HTML crudo (las respuestas nunca se inyectan como HTML). */
export function TextoEnriquecido({ texto }: { texto: string }) {
  const partes = texto.split(/(\*\*[^*]+\*\*)/g);
  return (
    <>
      {partes.map((p, i) =>
        p.startsWith("**") && p.endsWith("**") ? (
          <strong key={i} className="font-medium text-ink-text">
            {p.slice(2, -2)}
          </strong>
        ) : (
          <Fragment key={i}>{p}</Fragment>
        ),
      )}
    </>
  );
}

/**
 * Resalta dentro de un párrafo del BOE: si `resaltar` trae frases (citas de
 * una ficha) marca esas frases exactas; si trae raíces de búsqueda, marca las
 * palabras cuya raíz coincide.
 */
export function TextoResaltado({ texto, resaltar }: { texto: string; resaltar?: string[] }) {
  if (!resaltar?.length) return <>{texto}</>;

  const frases = resaltar.filter((r) => r.includes(" "));
  if (frases.length) {
    const tramos: { ini: number; fin: number }[] = [];
    for (const f of frases) {
      const i = texto.indexOf(f);
      if (i >= 0) tramos.push({ ini: i, fin: i + f.length });
    }
    if (!tramos.length) return <>{texto}</>;
    tramos.sort((a, b) => a.ini - b.ini);
    const nodos: React.ReactNode[] = [];
    let cursor = 0;
    tramos.forEach((t, k) => {
      if (t.ini < cursor) return;
      nodos.push(texto.slice(cursor, t.ini));
      nodos.push(
        <mark key={k} className="rounded-sm bg-accent/20 px-0.5 text-ink-text">
          {texto.slice(t.ini, t.fin)}
        </mark>,
      );
      cursor = t.fin;
    });
    nodos.push(texto.slice(cursor));
    return <>{nodos}</>;
  }

  const raices = new Set(resaltar);
  return (
    <>
      {texto.split(/(\s+)/).map((palabra, i) => {
        const limpia = normalizar(palabra).replace(/[^a-z0-9ñ/]/g, "");
        return limpia.length > 2 && raices.has(raiz(limpia)) ? (
          <mark key={i} className="rounded-sm bg-accent/20 px-0.5 text-ink-text">
            {palabra}
          </mark>
        ) : (
          <Fragment key={i}>{palabra}</Fragment>
        );
      })}
    </>
  );
}
