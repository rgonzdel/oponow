import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { createTransport, type Transporter } from "nodemailer";
import {
  CID_CABECERA,
  CID_ESCUDO,
  CID_RELOJ,
  asuntoCodigoAcceso,
  htmlCodigoAcceso,
  textoCodigoAcceso,
  type DatosCodigoAcceso,
} from "./plantilla-codigo-acceso";
import {
  ASUNTO_RESTABLECER_CONTRASENA,
  htmlRestablecerContrasena,
  textoRestablecerContrasena,
  type DatosRestablecerContrasena,
} from "./plantilla-restablecer-contrasena";

interface Mensaje {
  to: string;
  subject: string;
  text: string;
  html: string;
}

/**
 * Envío de correo transaccional por SMTP con el buzón propio del dominio
 * (info@oponow.com en Hostinger). Sin plataforma de envío de terceros: si
 * algún día se cambia de proveedor, basta con cambiar las variables SMTP_*.
 */
@Injectable()
export class CorreoService {
  private readonly logger = new Logger(CorreoService.name);
  private readonly transporte: Transporter | null;
  private readonly remitente: string;
  private readonly responderA: string | undefined;
  // Reenvío por HTTPS (apps/web/api/enviar-correo.js en Vercel): Render, en
  // el plan gratuito, bloquea el SMTP saliente. Si está configurado, se usa
  // en lugar de la conexión SMTP directa.
  private readonly reenvio: { url: string; clave: string } | null;
  // GIF animados en línea (cid). nest-cli.json los copia a dist/ junto a
  // este fichero. Los genera la animación HTML descrita en cada plantilla.
  private readonly imagenes = cargarImagenes([
    { archivo: "cabecera-animada.gif", cid: CID_CABECERA },
    { archivo: "escudo-animado.gif", cid: CID_ESCUDO },
    { archivo: "reloj-animado.gif", cid: CID_RELOJ },
  ]);

  constructor(config: ConfigService) {
    const host = config.get<string>("SMTP_HOST");
    const user = config.get<string>("SMTP_USER");
    const pass = config.get<string>("SMTP_PASS");
    const port = Number(config.get<string>("SMTP_PORT") ?? 465);
    this.remitente = config.get<string>("MAIL_FROM") ?? (user ? `Oponow <${user}>` : "Oponow");
    // Las respuestas llegan al buzón real: el correo invita a responder si
    // el intento de acceso no lo hizo el usuario.
    this.responderA = user;
    const urlReenvio = config.get<string>("CORREO_RELAY_URL");
    const claveReenvio = config.get<string>("CORREO_RELAY_SECRET");
    this.reenvio = urlReenvio && claveReenvio ? { url: urlReenvio, clave: claveReenvio } : null;
    this.transporte =
      host && user && pass
        ? createTransport({
            host,
            port,
            // 465 = TLS directo; 587 = STARTTLS.
            secure: port === 465,
            auth: { user, pass },
            // Sin límites, si el servidor SMTP no responde (p. ej. el
            // proveedor de hosting bloquea el puerto de salida) nodemailer
            // espera minutos y el inicio de sesión se queda colgado.
            connectionTimeout: 8_000,
            greetingTimeout: 8_000,
            socketTimeout: 10_000,
          })
        : null;
  }

  get configurado(): boolean {
    return this.reenvio !== null || this.transporte !== null;
  }

  async enviarCodigoAcceso(datos: DatosCodigoAcceso): Promise<void> {
    await this.enviar(
      {
        to: datos.email,
        subject: asuntoCodigoAcceso(datos.codigo),
        text: textoCodigoAcceso(datos),
        html: htmlCodigoAcceso(datos),
      },
      // Solo para desarrollo local: sin SMTP, el código se ve en el log.
      `Código de acceso para ${datos.email}: ${datos.codigo}`,
    );
  }

  async enviarRestablecerContrasena(datos: DatosRestablecerContrasena): Promise<void> {
    await this.enviar(
      {
        to: datos.email,
        subject: ASUNTO_RESTABLECER_CONTRASENA,
        text: textoRestablecerContrasena(datos),
        html: htmlRestablecerContrasena(datos),
      },
      `Enlace para restablecer la contraseña de ${datos.email}: ${datos.enlace}`,
    );
  }

  /** `sinSmtp`: lo que se escribe en el log cuando no hay forma de enviar
   * (desarrollo local), para poder seguir el flujo igualmente. */
  private async enviar(datos: Mensaje, sinSmtp: string): Promise<void> {
    const mensaje = { ...datos, replyTo: this.responderA };
    if (this.reenvio) {
      const res = await fetch(this.reenvio.url, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${this.reenvio.clave}` },
        body: JSON.stringify({
          ...mensaje,
          attachments: this.imagenes.map(({ archivo, cid, contenido }) => ({
            filename: archivo,
            content: contenido.toString("base64"),
            contentType: "image/gif",
            cid,
          })),
        }),
        signal: AbortSignal.timeout(20_000),
      });
      if (!res.ok) throw new Error(`Reenvío de correo respondió ${res.status}: ${await res.text().catch(() => "")}`);
      return;
    }
    if (!this.transporte) {
      this.logger.warn(`SMTP sin configurar. ${sinSmtp}`);
      return;
    }
    await this.transporte.sendMail({
      from: this.remitente,
      ...mensaje,
      // Imágenes en línea (cid): se muestran aunque el cliente bloquee
      // imágenes externas y no aparecen como adjuntos.
      attachments: this.imagenes.map(({ archivo, cid, contenido }) => ({
        filename: archivo,
        content: contenido,
        contentType: "image/gif",
        cid,
        contentDisposition: "inline" as const,
      })),
    });
  }
}

function cargarImagenes(lista: { archivo: string; cid: string }[]) {
  return lista.flatMap(({ archivo, cid }) => {
    try {
      return [{ archivo, cid, contenido: readFileSync(join(__dirname, archivo)) }];
    } catch {
      // Sin la imagen, el correo muestra su texto alternativo.
      new Logger(CorreoService.name).warn(`No se encuentra ${archivo}`);
      return [];
    }
  });
}
