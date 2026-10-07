// Correo de "He olvidado mi contraseña": un botón con el enlace de un solo
// uso. Misma estructura y estilo que plantilla-codigo-acceso.ts (tablas y
// estilos en línea; las animaciones CSS solo las ejecuta Apple Mail).

import {
  C,
  CID_CABECERA,
  CID_ESCUDO,
  CID_RELOJ,
  FUENTE,
  WEB,
  describirDispositivo,
  escapar,
  formatearFecha,
} from "./plantilla-codigo-acceso";

export interface DatosRestablecerContrasena {
  email: string;
  /** Enlace a la página de nueva contraseña, con el token. */
  enlace: string;
  minutosValidez: number;
  /** User-Agent de quien lo pidió, para que el usuario lo reconozca. */
  userAgent?: string;
  fecha?: Date;
}

export const ASUNTO_RESTABLECER_CONTRASENA = "Restablece tu contraseña de Oponow";

export function textoRestablecerContrasena(d: DatosRestablecerContrasena): string {
  return [
    "Restablece tu contraseña",
    "",
    "Hemos recibido una solicitud para cambiar la contraseña de tu cuenta de Oponow. Abre este enlace para elegir una nueva:",
    "",
    d.enlace,
    "",
    `Caduca en ${d.minutosValidez} minutos y solo sirve una vez.`,
    "",
    `Solicitado desde: ${describirDispositivo(d.userAgent)}`,
    `Fecha: ${formatearFecha(d.fecha ?? new Date())}`,
    `Cuenta: ${d.email}`,
    "",
    "¿No lo has pedido tú? Ignora este correo: tu contraseña no cambiará. Si recibes muchos, responde a este correo y lo revisamos.",
    "",
    "Al cambiar la contraseña se cerrará la sesión en el resto de dispositivos.",
    "",
    "—",
    "Oponow · Preparación de oposiciones · https://www.oponow.com",
    `Política de privacidad: ${WEB}/legal/privacidad`,
    "Has recibido este correo porque se ha pedido restablecer la contraseña de tu cuenta de Oponow.",
  ].join("\n");
}

export function htmlRestablecerContrasena(d: DatosRestablecerContrasena): string {
  const dispositivo = escapar(describirDispositivo(d.userAgent));
  const fecha = escapar(formatearFecha(d.fecha ?? new Date()));
  const email = escapar(d.email);
  const enlace = escapar(d.enlace);
  const fila = (etiqueta: string, valor: string) => `
            <tr>
              <td style="padding:6px 0;font-family:${FUENTE};font-size:13px;color:${C.tenue};width:96px;vertical-align:top;">${etiqueta}</td>
              <td style="padding:6px 0;font-family:${FUENTE};font-size:13px;color:${C.texto};vertical-align:top;">${valor}</td>
            </tr>`;

  return `<!doctype html>
<html lang="es" xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<meta name="color-scheme" content="light" />
<meta name="supported-color-schemes" content="light" />
<title>Restablece tu contraseña de Oponow</title>
<style>
  @media (max-width: 540px) {
    .contenedor { padding: 16px 10px !important; }
    .cuerpo { padding: 28px 22px !important; }
  }
  /* Animaciones CSS: solo Apple Mail. En Gmail y Outlook se mueven los GIF. */
  @keyframes aparecer { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }
  @keyframes latido { 0%, 100% { box-shadow: 0 0 0 0 rgba(245,181,68,0); } 50% { box-shadow: 0 0 0 4px rgba(245,181,68,.22); } }
  @keyframes resplandor { 0%, 100% { box-shadow: 0 0 0 0 rgba(145,132,217,0); } 50% { box-shadow: 0 0 0 7px rgba(145,132,217,.22); } }
  .entra-1 { animation: aparecer .6s ease-out .15s both; }
  .entra-2 { animation: aparecer .6s ease-out .3s both; }
  .entra-3 { animation: aparecer .6s ease-out .45s both; }
  .boton { animation: resplandor 2.4s ease-in-out 1.4s infinite; }
  .entra-4 { animation: aparecer .6s ease-out .75s both; }
  .entra-5 { animation: aparecer .6s ease-out .9s both, latido 2.4s ease-in-out 1.8s 3; }
  @media (prefers-reduced-motion: reduce) {
    .entra-1, .entra-2, .entra-3, .entra-4, .entra-5, .boton { animation: none !important; }
  }
</style>
</head>
<body style="margin:0;padding:0;background:${C.fondo};-webkit-text-size-adjust:100%;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;mso-hide:all;">
    Pulsa el botón para elegir una contraseña nueva. El enlace caduca en ${d.minutosValidez} minutos.&#8199;&#65279;&#847;&#8199;&#65279;&#847;&#8199;&#65279;&#847;&#8199;&#65279;&#847;&#8199;&#65279;&#847;
  </div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${C.fondo};">
    <tr>
      <td align="center" class="contenedor" style="padding:32px 16px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:520px;background:${C.tarjeta};border-radius:16px;overflow:hidden;">
          <tr>
            <td style="background:${C.cabecera};padding:0;line-height:0;font-size:0;">
              <a href="${WEB}" style="text-decoration:none;display:block;">
                <img src="cid:${CID_CABECERA}" width="520" alt="Oponow · Preparación de oposiciones" style="display:block;border:0;outline:none;width:100%;max-width:520px;height:auto;color:${C.acento};font-family:${FUENTE};font-size:22px;font-weight:600;line-height:84px;text-indent:32px;" />
              </a>
            </td>
          </tr>
          <tr><td style="height:3px;line-height:3px;font-size:0;background:${C.acento};">&nbsp;</td></tr>
          <tr>
            <td class="cuerpo" style="padding:36px 32px 28px;">
              <img class="entra-1" src="cid:${CID_ESCUDO}" width="72" height="72" alt="" style="display:block;border:0;outline:none;width:72px;height:72px;margin:-6px 0 10px -8px;" />
              <h1 class="entra-1" style="margin:0 0 12px;font-family:${FUENTE};font-size:22px;line-height:1.3;font-weight:600;color:${C.cabecera};">Restablece tu contraseña</h1>
              <p class="entra-2" style="margin:0 0 26px;font-family:${FUENTE};font-size:15px;line-height:1.6;color:${C.suave};">
                Hemos recibido una solicitud para cambiar la contraseña de tu cuenta de Oponow. Pulsa el botón para elegir una nueva:
              </p>

              <!-- Botón "a prueba de balas": celda con fondo + enlace con padding,
                   se ve como botón en todos los clientes (también Outlook). -->
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center" class="entra-3">
                <tr>
                  <td align="center" class="boton" style="border-radius:10px;background:${C.acento};">
                    <a href="${enlace}" target="_blank" style="display:inline-block;padding:15px 34px;font-family:${FUENTE};font-size:16px;font-weight:600;line-height:1;color:#ffffff;text-decoration:none;border-radius:10px;">Crear contraseña nueva</a>
                  </td>
                </tr>
              </table>
              <p class="entra-3" style="margin:14px 0 0;text-align:center;font-family:${FUENTE};font-size:12px;line-height:18px;color:${C.suave};"><img src="cid:${CID_RELOJ}" width="18" height="18" alt="" style="display:inline-block;border:0;width:18px;height:18px;vertical-align:-4px;margin-right:6px;" />Caduca en ${d.minutosValidez} minutos · Solo sirve una vez</p>

              <p class="entra-4" style="margin:22px 0 0;font-family:${FUENTE};font-size:12px;line-height:1.55;color:${C.tenue};">
                ¿El botón no funciona? Copia este enlace en el navegador:<br />
                <a href="${enlace}" target="_blank" style="color:${C.acentoOscuro};word-break:break-all;">${enlace}</a>
              </p>

              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" class="entra-4" style="margin-top:22px;border-top:1px solid ${C.borde};border-bottom:1px solid ${C.borde};">
                <tr><td colspan="2" style="padding:12px 0 2px;font-family:${FUENTE};font-size:11px;font-weight:600;letter-spacing:0.06em;text-transform:uppercase;color:${C.acentoOscuro};">Detalles de la solicitud</td></tr>${fila("Dispositivo", dispositivo)}${fila("Fecha", fecha)}${fila("Cuenta", email)}
                <tr><td colspan="2" style="padding:0 0 8px;"></td></tr>
              </table>

              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:24px;">
                <tr>
                  <td class="entra-5" style="background:${C.avisoFondo};border-left:4px solid ${C.avisoBorde};border-radius:8px;padding:14px 16px;">
                    <p style="margin:0 0 4px;font-family:${FUENTE};font-size:14px;font-weight:600;color:${C.texto};">¿No lo has pedido tú?</p>
                    <p style="margin:0;font-family:${FUENTE};font-size:13px;line-height:1.55;color:${C.suave};">
                      Ignora este correo: tu contraseña no cambiará. Si recibes muchos, responde a este correo y lo revisamos.
                    </p>
                  </td>
                </tr>
              </table>

              <p style="margin:24px 0 0;font-family:${FUENTE};font-size:13px;line-height:1.55;color:${C.suave};">
                Al cambiar la contraseña se cerrará la sesión en el resto de dispositivos.
              </p>
            </td>
          </tr>
        </table>

        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:520px;">
          <tr>
            <td align="center" style="padding:22px 24px 8px;font-family:${FUENTE};font-size:12px;line-height:1.6;color:${C.tenue};">
              <a href="${WEB}" style="color:${C.acentoOscuro};text-decoration:none;font-weight:600;">Oponow</a> · Preparación de oposiciones<br />
              <a href="${WEB}/legal/privacidad" style="color:${C.tenue};text-decoration:underline;">Privacidad</a> ·
              <a href="${WEB}/legal/terminos" style="color:${C.tenue};text-decoration:underline;">Términos</a> ·
              <a href="${WEB}/legal/aviso-legal" style="color:${C.tenue};text-decoration:underline;">Aviso legal</a><br />
              Has recibido este correo porque se ha pedido restablecer la contraseña de tu cuenta de Oponow.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
