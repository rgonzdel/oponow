// El HTML que sirve la API es deliberadamente mínimo (solo <h3>/<p>, sin
// estilos inline — ver apps/api/src/temario/watermark.util.ts), así que no
// hace falta un WebView ni un parser HTML completo: basta con extraer estos
// dos tipos de bloque y renderizarlos como <Text> nativos con el tema RN.
export interface ContentBlock {
  type: "h3" | "p";
  text: string;
}

function unescapeHtml(value: string): string {
  return value
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&");
}

export function parseContentBlocks(html: string): ContentBlock[] {
  const matches = [...html.matchAll(/<(h3|p)>([\s\S]*?)<\/\1>/g)];
  return matches.map((m) => ({
    type: m[1] as "h3" | "p",
    text: unescapeHtml(m[2]),
  }));
}
