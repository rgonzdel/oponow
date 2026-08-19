import { createElement as h } from "react";
import {
  Document,
  Page,
  Path,
  Rect,
  StyleSheet,
  Svg,
  Text,
  View,
  renderToBuffer,
} from "@react-pdf/renderer";
import { parseContentToBlocks, type ContentBlock } from "./content-blocks.util";

// Nota: se usa React.createElement en vez de JSX a propósito. Este es el
// único archivo de todo apps/api que necesita React (para describir el
// documento con @react-pdf/renderer) — evitar JSX aquí evita tener que
// activar el compilador JSX de TypeScript para un backend que, por lo
// demás, no tiene nada que ver con React.
//
// Los componentes de @react-pdf/renderer se pasan a createElement como
// `any`: en este monorepo (apps/web en React 18, apps/mobile en React 19)
// pnpm puede resolver más de una instancia física de @types/react, y
// createElement exige que el componente extienda EXACTAMENTE la misma
// clase Component que el propio import de "react" — dos instancias
// nominalmente distintas del mismo React 18.3.1 rompen esa comprobación
// aunque el código sea correcto en tiempo de ejecución. react-pdf valida
// las props igualmente al renderizar.
const AnyDocument = Document as any;
const AnyPage = Page as any;
const AnyView = View as any;
const AnyText = Text as any;
const AnySvg = Svg as any;
const AnyPath = Path as any;
const AnyRect = Rect as any;

// Tokens literales del sistema de marca "Nocturne" (mismos hex que
// apps/web/tailwind.config.js) — el PDF usa el mismo fondo oscuro y el
// mismo acento que el resto de la app, nada de blanco genérico.
const COLOR = {
  ink: "#161826",
  inkText: "#e9e9ed",
  inkDivider: "#3a3d4d",
  accent: "#9184d9",
  accent100: "#f5f4ff",
  neutral400: "#b2b6ca",
  neutral500: "#9397ab",
};

const styles = StyleSheet.create({
  page: {
    backgroundColor: COLOR.ink,
    color: COLOR.inkText,
    paddingTop: 70,
    paddingBottom: 56,
    paddingHorizontal: 48,
    fontSize: 10.5,
    lineHeight: 1.5,
  },
  topBar: {
    position: "absolute",
    top: 24,
    left: 48,
    right: 48,
    flexDirection: "row",
    alignItems: "center",
  },
  brandText: { fontSize: 11, fontWeight: 700, color: COLOR.inkText, marginLeft: 6 },
  title: { fontSize: 20, fontWeight: 700, color: COLOR.inkText, marginBottom: 4 },
  subtitle: {
    fontSize: 10,
    color: COLOR.neutral500,
    marginBottom: 22,
    borderBottomWidth: 1,
    borderBottomColor: COLOR.inkDivider,
    paddingBottom: 16,
  },
  headingRow: { flexDirection: "row", alignItems: "center", marginTop: 16, marginBottom: 6 },
  heading: { fontSize: 13, fontWeight: 700, color: COLOR.inkText, marginLeft: 6 },
  paragraph: { color: COLOR.neutral400, marginBottom: 8, textAlign: "justify" },
  footer: {
    position: "absolute",
    bottom: 24,
    left: 48,
    right: 48,
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 8,
    color: COLOR.neutral500,
  },
});

function logoMark(size = 14) {
  return h(
    AnySvg,
    { width: size, height: size, viewBox: "0 0 44 44" },
    h(AnyPath, {
      d: "M37.98 27.82 A17 17 0 1 1 37.98 16.18",
      stroke: COLOR.accent,
      strokeWidth: 5,
      strokeLinecap: "round",
      fill: "none",
    }),
    h(AnyPath, { d: "M34 15 L44 22 L34 29 Z", fill: COLOR.accent }),
  );
}

function sectionMark() {
  return h(
    AnySvg,
    { width: 8, height: 8, viewBox: "0 0 8 8" },
    h(AnyRect, { x: 0, y: 0, width: 8, height: 8, rx: 2, fill: COLOR.accent }),
  );
}

function contentBlockNodes(blocks: ContentBlock[]) {
  return blocks.map((block, i) =>
    block.type === "heading"
      ? h(
          AnyView,
          { key: i, style: styles.headingRow },
          sectionMark(),
          h(AnyText, { style: styles.heading }, block.text),
        )
      : h(AnyText, { key: i, style: styles.paragraph }, block.text),
  );
}

export interface TemaPdfInput {
  oposicionNombre: string;
  temaTitulo: string;
  /** Contenido crudo de cada bloque_contenido del tema, en orden. */
  bloques: string[];
}

export async function generarTemaPdf(input: TemaPdfInput): Promise<Buffer> {
  const blocks = input.bloques.flatMap((raw) => parseContentToBlocks(raw));

  const doc = h(
    AnyDocument,
    { title: `${input.temaTitulo} — Oponow`, author: "Oponow" },
    h(
      AnyPage,
      { size: "A4", style: styles.page, wrap: true },
      h(
        AnyView,
        { style: styles.topBar, fixed: true },
        logoMark(),
        h(AnyText, { style: styles.brandText }, "ponow"),
      ),
      h(AnyText, { style: styles.title }, input.temaTitulo),
      h(
        AnyText,
        { style: styles.subtitle },
        `${input.oposicionNombre} — contenido de estudio Oponow, no oficial, no sustituye al BOE ni a la convocatoria vigente.`,
      ),
      ...contentBlockNodes(blocks),
      h(
        AnyView,
        { style: styles.footer, fixed: true },
        h(AnyText, {}, "oponow.com"),
        h(AnyText, {
          render: ({ pageNumber, totalPages }: { pageNumber: number; totalPages: number }) =>
            `${pageNumber} / ${totalPages}`,
        }),
      ),
    ),
  );

  return renderToBuffer(doc);
}
