// Banco de pruebas de Silvia en Node: carga todas las normas desde disco y
// lanza preguntas típicas de opositor, mostrando intención, título y primer
// bloque de cada respuesta. Sirve para revisar a ojo la calidad de las
// respuestas tras tocar fichas, reglas o plantillas.
//
// Uso: pnpm --filter @oponow/web probar-asistente ["pregunta" ...]
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { Motor } from "../src/asistente/motor/motor";
import type { Bloque, ContextoConversacion, FuenteNorma, TextoNorma } from "../src/asistente/tipos";

const raiz = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const fuentes: FuenteNorma[] = JSON.parse(readFileSync(resolve(raiz, "src/asistente/normativa/fuentes.json"), "utf8"));
const cargadas = new Set<string>();
const motor: Motor = new Motor(
  fuentes,
  async (clave) => {
    if (cargadas.has(clave)) return;
    const t: TextoNorma = JSON.parse(readFileSync(resolve(raiz, `src/asistente/normativa/textos/${clave}.json`), "utf8"));
    motor.agregarNorma(t);
    cargadas.add(clave);
  },
  () => [],
);

const PREGUNTAS = process.argv.slice(2).length
  ? process.argv.slice(2)
  : [
      "hola",
      "¿cuál es el plazo del recurso de alzada?",
      "artículo 24 de la constitución",
      "siguiente",
      "art. 182 LOPJ",
      "artículo ciento ochenta y tres de la LOPJ",
      "disposición adicional primera de la LO 3/2007",
      "¿cuándo es positivo el silencio administrativo?",
      "diferencia entre recurso de alzada y reposición",
      "¿quién nombra al Fiscal General del Estado?",
      "¿cómo se compone el CGPJ?",
      "plazo para recurrir en apelación una sentencia civil",
      "¿cuándo prescriben los delitos leves?",
      "estructura de la LOPJ",
      "requisitos de tramitación procesal",
      "temario de policía nacional",
      "¿qué oposiciones hay con bachillerato?",
      "oposiciones de justicia",
      "hazme un test del artículo 116 de la constitución",
      "ponme a prueba con la ley 39/2015",
      "¿qué es la legítima en el código civil?",
      "plazo para interponer recurso de casación penal",
      "competencias exclusivas de la comunidad de madrid en el estatuto",
      "¿qué dice el artículo 2000 del código civil?",
      "requisitos auxiliar administrativo galicia",
      "¿cuántos días de vacaciones tiene un funcionario?",
      "quien elige al defensor del pueblo",
      // Erratas: deben entenderse igual.
      "cual es el articul0 55 de la CE",
      "que dice el 103 de la constitucon",
      "plazo del recuso de alzda",
      "silenzio administrativo positibo",
      "hazme un tets del articulo 116 ce",
    ];

function resumen(b: Bloque): string {
  switch (b.tipo) {
    case "parrafo": return b.texto;
    case "cita": return `[cita ${b.precepto} ${b.norma}] ${b.parrafos.join(" ").slice(0, 160)}`;
    case "lista": case "claves": return `[${b.tipo}] ${b.items.slice(0, 2).join(" | ")}`;
    case "tabla": return `[tabla ${b.filas.length} filas] ${b.filas.slice(0, 3).map((f) => f.join(" / ")).join(" ; ")}`;
    case "test": return `[test ${b.preguntas.length}] ${b.preguntas[0]?.enunciado.slice(0, 160)} → ${b.preguntas[0]?.opciones.join(" | ")}`;
    case "resultados": return `[resultados] ${b.items.map((i) => `${i.precepto} ${i.norma}`).join(", ")}`;
    case "aviso": return `[aviso] ${b.texto}`;
    default: return `[${b.tipo}]`;
  }
}

let contexto: ContextoConversacion = {};
const t0 = Date.now();
for (const c of fuentes) await (async () => { if (!cargadas.has(c.clave)) { const t: TextoNorma = JSON.parse(readFileSync(resolve(raiz, `src/asistente/normativa/textos/${c.clave}.json`), "utf8")); motor.agregarNorma(t); cargadas.add(c.clave); } })();
console.log(`Indexado: ${motor.preceptosIndexados} preceptos de ${motor.normasCargadas} normas en ${Date.now() - t0} ms\n`);

for (const q of PREGUNTAS) {
  const r = await motor.responder(q, contexto);
  contexto = r.contexto;
  console.log(`▶ ${q}\n  [${r.intencion}] ${r.titulo ?? ""}`);
  for (const b of r.bloques.slice(0, 3)) console.log(`   · ${resumen(b).replace(/\s+/g, " ").slice(0, 260)}`);
  console.log("");
}
