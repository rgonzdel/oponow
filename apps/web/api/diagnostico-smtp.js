// TEMPORAL: comprueba si desde Vercel se puede llegar a smtp.hostinger.com
// por los puertos de correo (desde Render están bloqueados). Solo abre la
// conexión y lee el saludo; no envía nada. Se eliminará con el resultado.
import { connect } from "node:net";

const HOST = "smtp.hostinger.com";
const PUERTOS = [465, 587];

function probar(puerto) {
  return new Promise((resolve) => {
    const inicio = Date.now();
    const s = connect({ host: HOST, port: puerto });
    let hecho = false;
    const fin = (estado, detalle) => {
      if (hecho) return;
      hecho = true;
      s.destroy();
      resolve({ puerto, estado, ms: Date.now() - inicio, detalle });
    };
    s.setTimeout(6000, () => fin("sin respuesta"));
    s.on("connect", () => { if (puerto === 465) fin("abierto", "conexión TCP establecida"); });
    s.on("data", (d) => fin("abierto", d.toString().trim().slice(0, 80)));
    s.on("error", (e) => fin("error", e.code ?? e.message));
  });
}

export default async function handler(_req, res) {
  res.setHeader("Cache-Control", "no-store");
  res.status(200).json(await Promise.all(PUERTOS.map(probar)));
}
