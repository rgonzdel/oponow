/// <reference lib="webworker" />
// Silvia corre en un Web Worker para no bloquear la interfaz mientras indexa
// ~13.000 preceptos. Las normas son JSON del propio bundle (import.meta.glob
// las convierte en chunks estáticos de la web): no se llama a ninguna API.
import fuentesJson from "./normativa/fuentes.json";
import type { FuenteNorma, MensajeAlWorker, MensajeDelWorker, TextoNorma } from "./tipos";
import { Motor } from "./motor/motor";

declare const self: DedicatedWorkerGlobalScope;

const fuentes = fuentesJson as FuenteNorma[];
const cargadores = import.meta.glob<TextoNorma>("./normativa/textos/*.json", { import: "default" });

/** Lo más preguntado en casi cualquier oposición se carga primero. */
const PRIORIDAD = ["ce", "lpac", "lrjsp", "trebep", "lopj", "lgob", "lotc", "eomf", "loigualdad", "lovg", "ltransparencia", "lopdgdd", "lodp", "lotcu", "loreg", "lec", "lecrim", "ljca", "cp"];
const orden = [...PRIORIDAD, ...fuentes.map((f) => f.clave).filter((c) => !PRIORIDAD.includes(c))];

const enCurso = new Map<string, Promise<void>>();
const cargadas = new Set<string>();

function enviar(m: MensajeDelWorker) {
  self.postMessage(m);
}

const motor = new Motor(fuentes, cargar, () => orden.filter((c) => !cargadas.has(c)));

function cargar(clave: string): Promise<void> {
  if (cargadas.has(clave)) return Promise.resolve();
  let p = enCurso.get(clave);
  if (!p) {
    const cargador = cargadores[`./normativa/textos/${clave}.json`];
    if (!cargador) return Promise.reject(new Error(`Norma desconocida: ${clave}`));
    p = cargador().then((texto) => {
      motor.agregarNorma(texto);
      cargadas.add(clave);
      enviar({ tipo: "progreso", cargadas: cargadas.size, total: orden.length, preceptos: motor.preceptosIndexados });
    });
    enCurso.set(clave, p);
  }
  return p;
}

// Carga en segundo plano, de una en una, para que las consultas que pidan una
// norma concreta puedan colarse entre medias.
(async () => {
  for (const clave of orden) {
    try {
      await cargar(clave);
    } catch (e) {
      console.error(e);
    }
  }
})();

self.onmessage = async (e: MessageEvent<MensajeAlWorker>) => {
  const m = e.data;
  if (m.tipo !== "consulta") return;
  try {
    // El núcleo (Constitución) debe estar antes de responder nada.
    await cargar("ce");
    const respuesta = await motor.responder(m.texto, m.contexto);
    enviar({ tipo: "respuesta", id: m.id, respuesta });
  } catch (err) {
    enviar({ tipo: "error", id: m.id, mensaje: err instanceof Error ? err.message : String(err) });
  }
};
