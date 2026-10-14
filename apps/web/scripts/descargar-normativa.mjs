// Descarga el texto consolidado VIGENTE de cada norma de
// src/asistente/normativa/fuentes.json desde la API de datos abiertos del
// BOE y lo guarda en src/asistente/normativa/textos/<clave>.json, que es lo
// único que lee el asistente (Temis) en el navegador: en tiempo de ejecución
// no se consulta ninguna API.
//
// Uso:  node scripts/descargar-normativa.mjs            (todas)
//       node scripts/descargar-normativa.mjs ce lpac    (solo esas claves)
//
// Se comprueba que el título oficial que devuelve el BOE contiene el
// `titulo` esperado en fuentes.json, para no guardar una norma equivocada si
// un identificador estuviera mal.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const raiz = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const dirNormativa = resolve(raiz, "src/asistente/normativa");
const dirTextos = resolve(dirNormativa, "textos");
const API = "https://www.boe.es/datosabiertos/api/legislacion-consolidada/id";

const fuentes = JSON.parse(readFileSync(resolve(dirNormativa, "fuentes.json"), "utf8"));
const soloClaves = process.argv.slice(2);
const hoy = new Date().toISOString().slice(0, 10).replace(/-/g, "");

const ENTIDADES = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " " };

function textoPlano(html) {
  return html
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<\/(td|th)>/gi, " | ")
    .replace(/<[^>]+>/g, "")
    .replace(/&(#x?[0-9a-f]+|[a-z]+);/gi, (m, e) => {
      if (e[0] === "#") {
        const cp = e[1] === "x" || e[1] === "X" ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10);
        return String.fromCodePoint(cp);
      }
      return ENTIDADES[e.toLowerCase()] ?? m;
    })
    .replace(/\s+/g, " ")
    .trim();
}

function normalizarComparacion(s) {
  return s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}

async function pedir(url) {
  for (let intento = 1; intento <= 3; intento++) {
    const res = await fetch(url, { headers: { Accept: "application/xml" } });
    if (res.ok) return res.text();
    if (intento === 3) throw new Error(`${url} respondió ${res.status}`);
    await new Promise((r) => setTimeout(r, 1500 * intento));
  }
}

/** Versión vigente de un bloque: la más reciente con fecha_vigencia <= hoy. */
function versionVigente(bloqueXml) {
  const versiones = [...bloqueXml.matchAll(/<version\b([^>]*)>([\s\S]*?)<\/version>/g)].map((m) => ({
    vigencia: /fecha_vigencia="(\d{8})"/.exec(m[1])?.[1] ?? "00000000",
    cuerpo: m[2],
  }));
  const vigentes = versiones.filter((v) => v.vigencia <= hoy);
  return (vigentes.length ? vigentes : versiones).at(-1)?.cuerpo ?? "";
}

function parrafos(cuerpoXml) {
  // Las notas editoriales del BOE («Téngase en cuenta…», «Redacción
  // anterior: …» con el texto ya derogado) van en <blockquote class="…">
  // (soloTexto, noDesdeAAAAMMDD…) y no forman parte de la norma vigente.
  const cuerpo = cuerpoXml.replace(/<blockquote\b[^>]*\bclass="[^"]*"[^>]*>[\s\S]*?<\/blockquote>/g, "");
  // `<p class="parrafo"/>` (vacío, autocerrado) aparece en algunas versiones:
  // sin tratarlo aparte, el patrón se tragaría hasta el siguiente </p>, que
  // suele ser una nota editorial («Se modifica por…», «Téngase en cuenta…»).
  return [...cuerpo.matchAll(/<p\b([^>]*?)(?:\/>|>([\s\S]*?)<\/p>)/g)]
    .map((m) => ({ clase: /class="([^"]*)"/.exec(m[1])?.[1] ?? "", texto: textoPlano(m[2] ?? "") }))
    .filter((p) => p.texto && !p.clase.startsWith("nota_pie"));
}

const NIVEL_ENCABEZADO = [
  [/^LIBRO\b/i, 0],
  [/^PARTE\b/i, 0],
  [/^T[IÍ]TULO\b/i, 1],
  [/^CAP[IÍ]TULO\b/i, 2],
  [/^SECCI[OÓ]N\b/i, 3],
  [/^SUBSECCI[OÓ]N\b/i, 4],
];

function nivelDe(titulo) {
  for (const [re, nivel] of NIVEL_ENCABEZADO) if (re.test(titulo)) return nivel;
  return 1;
}

async function descargar(fuente) {
  const metaXml = await pedir(`${API}/${fuente.id}/metadatos`);
  const tituloOficial = textoPlano(/<titulo>([\s\S]*?)<\/titulo>/.exec(metaXml)?.[1] ?? "");
  if (!normalizarComparacion(tituloOficial).includes(normalizarComparacion(fuente.titulo))) {
    throw new Error(`${fuente.clave}: el BOE devuelve «${tituloOficial}», no contiene «${fuente.titulo}»`);
  }
  const actualizado = /<fecha_actualizacion>(\d{8})/.exec(metaXml)?.[1] ?? null;

  const xml = await pedir(`${API}/${fuente.id}/texto`);
  const encabezados = [];
  const preceptos = [];
  // Pila de encabezados abiertos (índices en `encabezados`) por nivel.
  const pila = [];

  for (const m of xml.matchAll(/<bloque\b([^>]*)>([\s\S]*?)<\/bloque>/g)) {
    const attrs = m[1];
    const tipo = /tipo="([^"]*)"/.exec(attrs)?.[1];
    const id = /\bid="([^"]*)"/.exec(attrs)?.[1] ?? "";
    const tituloBloque = textoPlano(/titulo="([^"]*)"/.exec(attrs)?.[1] ?? "");
    const ps = parrafos(versionVigente(m[2]));

    if (tipo === "encabezado") {
      const texto = ps.map((p) => p.texto).join(". ") || tituloBloque;
      const nivel = nivelDe(tituloBloque || texto);
      pila.length = Math.min(pila.length, nivel);
      while (pila.length < nivel) pila.push(null);
      encabezados.push(texto);
      pila[nivel] = encabezados.length - 1;
      continue;
    }
    if (tipo !== "precepto") continue;

    // Primer párrafo de clase "articulo": "Artículo 24. Silencio administrativo..."
    let rubrica = null;
    let cuerpo = ps;
    if (ps[0]?.clase === "articulo") {
      const cabecera = ps[0].texto;
      const resto = cabecera.startsWith(tituloBloque) ? cabecera.slice(tituloBloque.length) : "";
      rubrica = resto.replace(/^[\s.:–-]+/, "").trim() || null;
      cuerpo = ps.slice(1);
    }
    preceptos.push({
      b: id,
      n: tituloBloque,
      r: rubrica,
      e: pila.filter((x) => x !== null && x !== undefined),
      p: cuerpo.map((p) => p.texto),
    });
  }

  if (preceptos.length === 0) throw new Error(`${fuente.clave}: no se ha encontrado ningún precepto`);

  const salida = {
    clave: fuente.clave,
    id: fuente.id,
    tituloOficial,
    actualizado,
    descargado: hoy,
    encabezados,
    preceptos,
  };
  writeFileSync(resolve(dirTextos, `${fuente.clave}.json`), JSON.stringify(salida));
  return { preceptos: preceptos.length, kb: Math.round(JSON.stringify(salida).length / 1024) };
}

mkdirSync(dirTextos, { recursive: true });
let errores = 0;
for (const fuente of fuentes) {
  if (soloClaves.length && !soloClaves.includes(fuente.clave)) continue;
  try {
    const r = await descargar(fuente);
    console.log(`✓ ${fuente.clave.padEnd(16)} ${String(r.preceptos).padStart(5)} preceptos ${String(r.kb).padStart(6)} KB`);
  } catch (e) {
    errores++;
    console.error(`✗ ${fuente.clave}: ${e.message}`);
  }
}
if (errores) process.exit(1);
