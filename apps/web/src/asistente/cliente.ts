// Puente entre la página y el worker de Temis.
import type { ContextoConversacion, MensajeDelWorker, Respuesta } from "./tipos";

export interface Progreso {
  cargadas: number;
  total: number;
  preceptos: number;
}

export class ClienteTemis {
  private readonly worker: Worker;
  private siguienteId = 1;
  private readonly pendientes = new Map<number, { resolver: (r: Respuesta) => void; rechazar: (e: Error) => void }>();

  constructor(onProgreso: (p: Progreso) => void) {
    this.worker = new Worker(new URL("./asistente.worker.ts", import.meta.url), { type: "module" });
    this.worker.onmessage = (e: MessageEvent<MensajeDelWorker>) => {
      const m = e.data;
      if (m.tipo === "progreso") {
        onProgreso({ cargadas: m.cargadas, total: m.total, preceptos: m.preceptos });
        return;
      }
      const p = this.pendientes.get(m.id);
      if (!p) return;
      this.pendientes.delete(m.id);
      if (m.tipo === "respuesta") p.resolver(m.respuesta);
      else p.rechazar(new Error(m.mensaje));
    };
  }

  preguntar(texto: string, contexto: ContextoConversacion): Promise<Respuesta> {
    const id = this.siguienteId++;
    return new Promise((resolver, rechazar) => {
      this.pendientes.set(id, { resolver, rechazar });
      this.worker.postMessage({ tipo: "consulta", id, texto, contexto });
    });
  }

  cerrar() {
    this.worker.terminate();
    for (const p of this.pendientes.values()) p.rechazar(new Error("Asistente cerrado"));
    this.pendientes.clear();
  }
}
