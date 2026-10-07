// TEMPORAL: comprueba desde el servidor qué puertos SMTP de Hostinger son
// alcanzables (el plan gratuito de Render parece bloquear el 465). Solo abre
// y cierra una conexión TCP y lee el saludo del servidor; no envía nada.
// Se eliminará en cuanto se tenga el resultado.
import { connect } from "node:net";

const HOST = "smtp.hostinger.com";
const PUERTOS = [465, 587, 2525, 25];

export interface ResultadoPuerto {
  puerto: number;
  estado: "abierto" | "sin respuesta" | "rechazado" | "error";
  ms: number;
  detalle?: string;
}

function probar(puerto: number): Promise<ResultadoPuerto> {
  return new Promise((resolve) => {
    const inicio = Date.now();
    const s = connect({ host: HOST, port: puerto });
    let hecho = false;
    const fin = (estado: ResultadoPuerto["estado"], detalle?: string) => {
      if (hecho) return;
      hecho = true;
      s.destroy();
      resolve({ puerto, estado, ms: Date.now() - inicio, detalle });
    };
    s.setTimeout(6000, () => fin("sin respuesta"));
    // En 587/2525/25 el servidor saluda en claro ("220 ..."); en 465 hay que
    // negociar TLS, así que basta con que la conexión TCP se establezca.
    s.on("connect", () => {
      if (puerto === 465) fin("abierto", "conexión TCP establecida");
    });
    s.on("data", (d) => fin("abierto", d.toString().trim().slice(0, 80)));
    s.on("error", (e: NodeJS.ErrnoException) =>
      fin(e.code === "ECONNREFUSED" ? "rechazado" : "error", e.code ?? e.message),
    );
  });
}

export async function diagnosticoSmtp(): Promise<ResultadoPuerto[]> {
  return Promise.all(PUERTOS.map(probar));
}
