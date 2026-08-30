/**
 * Convierte `bloques_contenido.contenido` — un mini-lenguaje de marcado en
 * texto plano — en el HTML semántico que se sirve al cliente. Sin estilos
 * inline: la presentación vive en el frontend (apps/web/src/index.css,
 * clase `.tema-content`), esto solo aporta estructura.
 *
 * Bloques separados por línea en blanco. Tipos reconocidos por el primer
 * carácter/patrón de cada bloque:
 *
 *   ## Título              -> <h3>Título</h3> (+ <p> si el bloque trae más
 *                             líneas tras el título)
 *   #### Título            -> <h4>Título</h4> (+ <p>), salvo que el título
 *                             sea uno de los especiales de abajo
 *   #### Para recordar     -> caja de aviso (todo el contenido hasta el
 *   #### Mnemotecnia          siguiente encabezado queda dentro de la caja)
 *   #### Caso práctico     -> caja con el enunciado; una línea suelta "---"
 *   #### Pregunta de repaso   separa el enunciado de la respuesta, que queda
 *                             oculta tras un <details>
 *   - texto                -> <li> de una <ul> (una línea por elemento)
 *   1. texto               -> <li> de una <ol>
 *   | a | b | c |          -> fila de <table> (la primera es la cabecera;
 *                             una fila de solo guiones se descarta)
 *   cualquier otra cosa    -> <p>
 *
 * Dentro de cualquier texto: `**negrita**` -> <strong>, `*énfasis*` -> <em>.
 */

const CALLOUT_TITLES = new Set(["para recordar", "mnemotecnia"]);
const CASE_TITLES = new Set(["caso práctico", "pregunta de repaso"]);

type BoxType = "para recordar" | "mnemotecnia" | "caso práctico" | "pregunta de repaso";

interface OpenBox {
  type: BoxType;
  promptHtml: string[];
  answerHtml: string[];
  inAnswer: boolean;
}

export function renderContent(contenido: string): string {
  const rawBlocks = contenido
    .split(/\n{2,}/)
    .map((b) => b.trim())
    .filter(Boolean);

  const out: string[] = [];
  let box: OpenBox | null = null;

  const closeBox = () => {
    if (!box) return;
    out.push(renderBox(box));
    box = null;
  };

  for (const raw of rawBlocks) {
    if (raw === "---") {
      // Separador enunciado/respuesta dentro de una caja de caso o pregunta.
      if (box) box.inAnswer = true;
      continue;
    }

    const heading = parseHeading(raw);
    if (heading) {
      const normalized = heading.title.toLowerCase();
      if (heading.level === 4 && (CALLOUT_TITLES.has(normalized) || CASE_TITLES.has(normalized))) {
        closeBox();
        box = {
          type: normalized as BoxType,
          promptHtml: heading.body ? [renderPlainBlock(heading.body)] : [],
          answerHtml: [],
          inAnswer: false,
        };
        continue;
      }

      closeBox();
      const tag = heading.level === 3 ? "h3" : "h4";
      out.push(`<${tag}>${inline(heading.title)}</${tag}>`);
      // El cuerpo tras el título puede ser un párrafo, pero también una
      // lista o una tabla si el autor no dejó línea en blanco de por medio
      // (p. ej. "#### Tabla · ...\n| a | b |") — se despacha igual que
      // cualquier otro bloque, no siempre como <p>.
      if (heading.body) out.push(renderPlainBlock(heading.body));
      continue;
    }

    const html = renderPlainBlock(raw);
    if (box) {
      (box.inAnswer ? box.answerHtml : box.promptHtml).push(html);
    } else {
      out.push(html);
    }
  }

  closeBox();
  return out.join("");
}

function parseHeading(block: string): { level: 3 | 4; title: string; body: string } | null {
  const prefix = block.startsWith("#### ") ? "#### " : block.startsWith("## ") ? "## " : null;
  if (!prefix) return null;

  const newlineIndex = block.indexOf("\n");
  const title = newlineIndex === -1 ? block.slice(prefix.length) : block.slice(prefix.length, newlineIndex);
  const body = newlineIndex === -1 ? "" : block.slice(newlineIndex + 1).trim();
  return { level: prefix === "## " ? 3 : 4, title: title.trim(), body };
}

function renderPlainBlock(block: string): string {
  const lines = block.split("\n").map((l) => l.trim());

  if (lines.every((l) => l.startsWith("- "))) {
    return `<ul>${lines.map((l) => `<li>${inline(l.slice(2))}</li>`).join("")}</ul>`;
  }
  if (lines.every((l) => /^\d+\.\s/.test(l))) {
    return `<ol>${lines.map((l) => `<li>${inline(l.replace(/^\d+\.\s/, ""))}</li>`).join("")}</ol>`;
  }
  if (lines.every((l) => l.startsWith("|"))) {
    return renderTable(lines);
  }
  return `<p>${inline(block.replace(/\n/g, " "))}</p>`;
}

function renderTable(lines: string[]): string {
  const rows = lines
    .map((line) => line.replace(/^\||\|$/g, "").split("|").map((cell) => cell.trim()))
    .filter((cells) => !cells.every((cell) => /^-+$/.test(cell)));

  const [headerRow, ...bodyRows] = rows;
  const thead = `<thead><tr>${headerRow.map((cell) => `<th>${inline(cell)}</th>`).join("")}</tr></thead>`;
  const tbody = `<tbody>${bodyRows
    .map((cells) => `<tr>${cells.map((cell) => `<td>${inline(cell)}</td>`).join("")}</tr>`)
    .join("")}</tbody>`;
  return `<table>${thead}${tbody}</table>`;
}

function renderBox(box: OpenBox): string {
  const isCase = CASE_TITLES.has(box.type);
  const label = box.type.replace(/^./, (c) => c.toUpperCase());
  const variant =
    box.type === "mnemotecnia"
      ? "mnemotecnia"
      : box.type === "caso práctico"
        ? "caso"
        : box.type === "pregunta de repaso"
          ? "pregunta"
          : "recordar";

  const body = isCase
    ? box.promptHtml.join("") +
      (box.answerHtml.length
        ? `<details><summary>Ver ${box.type === "caso práctico" ? "solución razonada" : "respuesta"}</summary>${box.answerHtml.join("")}</details>`
        : "")
    : box.promptHtml.join("");

  return `<div class="tema-box tema-box--${variant}"><span class="tema-box__label">${escapeHtml(label)}</span>${body}</div>`;
}

function inline(text: string): string {
  return escapeHtml(text)
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/(?<!\*)\*([^*]+)\*(?!\*)/g, "<em>$1</em>");
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
