/**
 * Convierte `bloques_contenido.contenido` (texto plano; párrafos separados
 * por línea en blanco; un párrafo que empieza por "## " se trata como
 * encabezado de sección) en el HTML semántico que se sirve al cliente. Sin
 * estilos inline — la presentación vive en el frontend (ver
 * apps/web/src/index.css, clase `.tema-content`), esto solo aporta
 * estructura (`<h3>` / `<p>`).
 */
export function renderContent(contenido: string): string {
  const blocks = contenido
    .split(/\n{2,}/)
    .map((b) => b.trim())
    .filter(Boolean);

  return blocks
    .map((block) => {
      if (!block.startsWith("## ")) return `<p>${escapeHtml(block)}</p>`;

      // Un bloque de encabezado lleva el título en su primera línea y el
      // párrafo (opcional) en el resto — solo el título va en el <h3>.
      const newlineIndex = block.indexOf("\n");
      const heading = newlineIndex === -1 ? block.slice(3) : block.slice(3, newlineIndex);
      const body = newlineIndex === -1 ? "" : block.slice(newlineIndex + 1).trim();

      const headingHtml = `<h3>${escapeHtml(heading.trim())}</h3>`;
      return body ? headingHtml + `<p>${escapeHtml(body)}</p>` : headingHtml;
    })
    .join("");
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
