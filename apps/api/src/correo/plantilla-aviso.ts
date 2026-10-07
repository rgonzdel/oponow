// Correos de aviso de la cuenta (contraseña cambiada, email cambiado,
// confirmación de email nuevo, cuenta eliminada). Misma estructura y estilo
// que plantilla-codigo-acceso.ts, con contenido variable.

import { C, CID_CABECERA, CID_ESCUDO, FUENTE, WEB, escapar, formatearFecha } from "./plantilla-codigo-acceso";

export interface DatosAviso {
  email: string;
  asunto: string;
  titulo: string;
  /** Párrafos de texto plano (se escapan). */
  parrafos: string[];
  boton?: { texto: string; enlace: string; nota?: string };
  /** Recuadro "¿No has sido tú?" con este texto. */
  siNoHasSidoTu?: string;
  /** Pie: por qué recibe este correo. */
  motivo: string;
  fecha?: Date;
}

export function textoAviso(d: DatosAviso): string {
  return [
    d.titulo,
    "",
    ...d.parrafos.flatMap((p) => [p, ""]),
    ...(d.boton ? [`${d.boton.texto}: ${d.boton.enlace}`, ...(d.boton.nota ? [d.boton.nota] : []), ""] : []),
    `Fecha: ${formatearFecha(d.fecha ?? new Date())}`,
    "",
    ...(d.siNoHasSidoTu ? ["¿No has sido tú?", d.siNoHasSidoTu, ""] : []),
    "—",
    "Oponow · Preparación de oposiciones · https://www.oponow.com",
    `Política de privacidad: ${WEB}/legal/privacidad`,
    d.motivo,
  ].join("\n");
}

export function htmlAviso(d: DatosAviso): string {
  const fecha = escapar(formatearFecha(d.fecha ?? new Date()));
  const parrafos = d.parrafos
    .map((p) => `<p style="margin:0 0 14px;font-family:${FUENTE};font-size:15px;line-height:1.6;color:${C.suave};">${escapar(p)}</p>`)
    .join("");
  const boton = d.boton
    ? `
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center" style="margin:10px auto 0;">
                <tr>
                  <td align="center" style="border-radius:10px;background:${C.acento};">
                    <a href="${escapar(d.boton.enlace)}" target="_blank" style="display:inline-block;padding:15px 34px;font-family:${FUENTE};font-size:16px;font-weight:600;line-height:1;color:#ffffff;text-decoration:none;border-radius:10px;">${escapar(d.boton.texto)}</a>
                  </td>
                </tr>
              </table>
              ${d.boton.nota ? `<p style="margin:12px 0 0;text-align:center;font-family:${FUENTE};font-size:12px;color:${C.suave};">${escapar(d.boton.nota)}</p>` : ""}
              <p style="margin:18px 0 0;font-family:${FUENTE};font-size:12px;line-height:1.55;color:${C.tenue};">
                ¿El botón no funciona? Copia este enlace en el navegador:<br />
                <a href="${escapar(d.boton.enlace)}" target="_blank" style="color:${C.acentoOscuro};word-break:break-all;">${escapar(d.boton.enlace)}</a>
              </p>`
    : "";
  const aviso = d.siNoHasSidoTu
    ? `
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:24px;">
                <tr>
                  <td style="background:${C.avisoFondo};border-left:4px solid ${C.avisoBorde};border-radius:8px;padding:14px 16px;">
                    <p style="margin:0 0 4px;font-family:${FUENTE};font-size:14px;font-weight:600;color:${C.texto};">¿No has sido tú?</p>
                    <p style="margin:0;font-family:${FUENTE};font-size:13px;line-height:1.55;color:${C.suave};">${escapar(d.siNoHasSidoTu)}</p>
                  </td>
                </tr>
              </table>`
    : "";

  return `<!doctype html>
<html lang="es" xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<meta name="color-scheme" content="light" />
<meta name="supported-color-schemes" content="light" />
<title>${escapar(d.asunto)}</title>
<style>
  @media (max-width: 540px) {
    .contenedor { padding: 16px 10px !important; }
    .cuerpo { padding: 28px 22px !important; }
  }
</style>
</head>
<body style="margin:0;padding:0;background:${C.fondo};-webkit-text-size-adjust:100%;">
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
              <img src="cid:${CID_ESCUDO}" width="72" height="72" alt="" style="display:block;border:0;outline:none;width:72px;height:72px;margin:-6px 0 10px -8px;" />
              <h1 style="margin:0 0 14px;font-family:${FUENTE};font-size:22px;line-height:1.3;font-weight:600;color:${C.cabecera};">${escapar(d.titulo)}</h1>
              ${parrafos}${boton}
              <p style="margin:20px 0 0;font-family:${FUENTE};font-size:12px;color:${C.tenue};">${fecha}</p>${aviso}
            </td>
          </tr>
        </table>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:520px;">
          <tr>
            <td align="center" style="padding:22px 24px 8px;font-family:${FUENTE};font-size:12px;line-height:1.6;color:${C.tenue};">
              <a href="${WEB}" style="color:${C.acentoOscuro};text-decoration:none;font-weight:600;">Oponow</a> · Preparación de oposiciones<br />
              <a href="${WEB}/legal/privacidad" style="color:${C.tenue};text-decoration:underline;">Privacidad</a> ·
              <a href="${WEB}/legal/terminos" style="color:${C.tenue};text-decoration:underline;">Términos</a><br />
              ${escapar(d.motivo)}
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
