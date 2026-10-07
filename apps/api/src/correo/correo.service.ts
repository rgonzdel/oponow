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
    this.transporte =
      host && user && pass
        ? createTransport({
            host,
            port,
            // 465 = TLS directo; 587 = STARTTLS.
            secure: port === 465,
            auth: { user, pass },
          })
        : null;
  }

  get configurado(): boolean {
    return this.transporte !== null;
  }

  async enviarCodigoAcceso(datos: DatosCodigoAcceso): Promise<void> {
    if (!this.transporte) {
      // Solo para desarrollo local: sin SMTP, el código se ve en el log.
      this.logger.warn(`SMTP sin configurar. Código de acceso para ${datos.email}: ${datos.codigo}`);
      return;
    }
    await this.transporte.sendMail({
      from: this.remitente,
      replyTo: this.responderA,
      to: datos.email,
      subject: asuntoCodigoAcceso(datos.codigo),
      text: textoCodigoAcceso(datos),
      html: htmlCodigoAcceso(datos),
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
