// Pre-renderizado de las páginas legales. La web es una SPA: sin esto, el
// HTML que recibe un navegador o un robot (p. ej. el revisor de Google OAuth)
// para /legal/privacidad es un <div id="root"></div> vacío. Este script se
// ejecuta tras `vite build` y escribe dist/legal/<slug>.html con el texto ya
// dentro de #root; al cargar el JS, React monta la página encima (mismo
// componente LegalDocumento, así que se ve igual). vercel.json sirve
// /legal/<slug> con ese fichero.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { renderToStaticMarkup } from "react-dom/server";
import { LegalDocumento } from "../src/components/LegalDocumento";
import { OponowLogo } from "../src/components/OponowLogo";
import { LEGAL_PAGINAS } from "../src/data/legal";

const dist = resolve(process.cwd(), "dist");
const plantilla = readFileSync(resolve(dist, "index.html"), "utf8");
const ROOT_VACIO = '<div id="root"></div>';
if (!plantilla.includes(ROOT_VACIO)) {
  throw new Error(`dist/index.html no contiene ${ROOT_VACIO}`);
}

const escaparAtributo = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

mkdirSync(resolve(dist, "legal"), { recursive: true });
for (const pagina of Object.values(LEGAL_PAGINAS)) {
  const cuerpo = renderToStaticMarkup(
    <div>
      {/* Cabecera mínima: SiteHeader depende del router y de la sesión. */}
      <header className="border-b border-ink-divider">
        <div className="mx-auto flex h-14 max-w-6xl items-center px-6">
          <a href="/" className="text-accent" aria-label="Oponow, ir al inicio">
            <OponowLogo />
          </a>
        </div>
      </header>
      <LegalDocumento pagina={pagina} />
    </div>,
  );

  const html = plantilla
    .replace(/<title>[^<]*<\/title>/, `<title>${pagina.titulo} · Oponow</title>`)
    .replace(
      "</head>",
      `  <meta name="description" content="${escaparAtributo(pagina.descripcion)}" />\n  </head>`,
    )
    .replace(ROOT_VACIO, `<div id="root">${cuerpo}</div>`);

  const destino = resolve(dist, "legal", `${pagina.slug}.html`);
  writeFileSync(destino, html, "utf8");
  console.log(`prerender: dist/legal/${pagina.slug}.html (${Math.round(html.length / 1024)} KB)`);
}
