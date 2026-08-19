export interface ContentBlock {
  type: "heading" | "paragraph";
  text: string;
}

/**
 * Mismo criterio de parseo que watermark.util.ts (renderContent): bloques
 * separados por línea en blanco, un bloque que empieza por "## " es un
 * encabezado de sección (primera línea = título, resto = párrafo). Aquí
 * devuelve datos estructurados en vez de HTML, para alimentar el PDF.
 */
export function parseContentToBlocks(contenido: string): ContentBlock[] {
  const rawBlocks = contenido
    .split(/\n{2,}/)
    .map((b) => b.trim())
    .filter(Boolean);

  const blocks: ContentBlock[] = [];
  for (const raw of rawBlocks) {
    if (!raw.startsWith("## ")) {
      blocks.push({ type: "paragraph", text: raw });
      continue;
    }
    const newlineIndex = raw.indexOf("\n");
    const heading = newlineIndex === -1 ? raw.slice(3) : raw.slice(3, newlineIndex);
    const body = newlineIndex === -1 ? "" : raw.slice(newlineIndex + 1).trim();
    blocks.push({ type: "heading", text: heading.trim() });
    if (body) blocks.push({ type: "paragraph", text: body });
  }
  return blocks;
}
