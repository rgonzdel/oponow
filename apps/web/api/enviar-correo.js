// Reenvío de correo transaccional. La API de Oponow está en Render, cuyo plan
// gratuito bloquea el SMTP saliente; Vercel no, así que la API llama aquí por
// HTTPS y esta función envía el correo con el buzón propio de Hostinger
// (info@oponow.com). Solo acepta peticiones con la clave compartida
// CORREO_RELAY_SECRET y siempre envía desde MAIL_FROM a un único destinatario.
import { timingSafeEqual } from "node:crypto";
import { createTransport } from "nodemailer";

const TAM_MAXIMO = 2_000_000; // bytes del cuerpo JSON (los GIF van en base64)
const EMAIL = /^[^\s@<>,;]+@[^\s@<>,;]+\.[^\s@<>,;]+$/;

function claveValida(cabecera) {
  const esperada = process.env.CORREO_RELAY_SECRET;
  if (!esperada || typeof cabecera !== "string" || !cabecera.startsWith("Bearer ")) return false;
  const a = Buffer.from(cabecera.slice(7));
  const b = Buffer.from(esperada);
  return a.length === b.length && timingSafeEqual(a, b);
}

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "POST") return res.status(405).json({ error: "Método no permitido" });
  if (!claveValida(req.headers.authorization)) return res.status(401).json({ error: "No autorizado" });

  let cuerpo = req.body;
  try {
    if (typeof cuerpo === "string") cuerpo = JSON.parse(cuerpo);
  } catch {
    return res.status(400).json({ error: "JSON no válido" });
  }
  if (!cuerpo || JSON.stringify(cuerpo).length > TAM_MAXIMO) {
    return res.status(413).json({ error: "Demasiado grande" });
  }
  const { to, subject, text, html, replyTo, attachments = [] } = cuerpo;
  if (typeof to !== "string" || !EMAIL.test(to) || typeof subject !== "string" || typeof html !== "string") {
    return res.status(400).json({ error: "Datos del correo no válidos" });
  }

  const { SMTP_HOST, SMTP_USER, SMTP_PASS } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) return res.status(503).json({ error: "SMTP sin configurar" });
  const puerto = Number(process.env.SMTP_PORT ?? 465);
  const transporte = createTransport({
    host: SMTP_HOST,
    port: puerto,
    secure: puerto === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
    connectionTimeout: 8_000,
    greetingTimeout: 8_000,
    socketTimeout: 10_000,
  });

  try {
    await transporte.sendMail({
      from: process.env.MAIL_FROM ?? `Oponow <${SMTP_USER}>`,
      to,
      replyTo: typeof replyTo === "string" ? replyTo : undefined,
      subject,
      text: typeof text === "string" ? text : undefined,
      html,
      attachments: (Array.isArray(attachments) ? attachments : [])
        .filter((a) => a && typeof a.content === "string" && typeof a.cid === "string")
        .slice(0, 5)
        .map((a) => ({
          filename: String(a.filename ?? "imagen"),
          content: Buffer.from(a.content, "base64"),
          contentType: String(a.contentType ?? "application/octet-stream"),
          cid: a.cid,
          contentDisposition: "inline",
        })),
    });
    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error("enviar-correo:", e instanceof Error ? e.message : e);
    return res.status(502).json({ error: "No se ha podido enviar el correo" });
  } finally {
    transporte.close();
  }
}
