// Correo del código de acceso (MFA). HTML de correo: tablas y estilos en
// línea, que es lo único que respetan todos los clientes (Gmail, Outlook,
// Apple Mail). El bloque <style> solo añade el modo oscuro y el ajuste a
// móvil en los clientes que lo admiten; sin él, el correo se ve igual de bien.

export const CID_CABECERA = "cabecera-oponow@oponow.com";
export const CID_ESCUDO = "escudo-oponow@oponow.com";
export const CID_RELOJ = "reloj-oponow@oponow.com";
export const WEB = "https://www.oponow.com";

export const C = {
  fondo: "#eef0f8",
  tarjeta: "#ffffff",
  cabecera: "#161826",
  texto: "#292b31",
  suave: "#595d6c",
  tenue: "#75798c",
  borde: "#e4e7f5",
  acento: "#9184d9",
  acentoOscuro: "#5d5294",
  codigoFondo: "#f5f4ff",
  codigoBorde: "#d2cefd",
  avisoFondo: "#fff8eb",
  avisoBorde: "#f5b544",
};
export const FUENTE = "Inter,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif";
const FUENTE_CODIGO = "'SF Mono',SFMono-Regular,Menlo,Consolas,'Liberation Mono',monospace";

export interface DatosCodigoAcceso {
  codigo: string;
  minutosValidez: number;
  email: string;
  /** User-Agent del intento de acceso, para que el usuario lo reconozca. */
  userAgent?: string;
  fecha?: Date;
}

export function asuntoCodigoAcceso(codigo: string): string {
  // El código en el asunto permite leerlo en la notificación del móvil.
  return `${codigo} es tu código de acceso a Oponow`;
}

export function textoCodigoAcceso(d: DatosCodigoAcceso): string {
  return [
    "Confirma que eres tú",
    "",
    "Se ha introducido la contraseña de tu cuenta de Oponow en un navegador o dispositivo nuevo. Para terminar de iniciar sesión, usa este código:",
    "",
    `    ${d.codigo}`,
    "",
    `Caduca en ${d.minutosValidez} minutos y solo sirve una vez.`,
    "",
    `Dispositivo: ${describirDispositivo(d.userAgent)}`,
    `Fecha: ${formatearFecha(d.fecha ?? new Date())}`,
    `Cuenta: ${d.email}`,
    "",
    "¿No has sido tú? Alguien conoce tu contraseña. No compartas este código con nadie (el equipo de Oponow nunca te lo pedirá) y responde a este correo para que te ayudemos a proteger tu cuenta.",
    "",
    "Al introducir el código, no te lo volveremos a pedir en ese navegador durante 30 días.",
    "",
    "—",
    "Oponow · Preparación de oposiciones · https://www.oponow.com",
    `Política de privacidad: ${WEB}/legal/privacidad`,
    "Has recibido este correo porque se ha iniciado sesión en tu cuenta de Oponow.",
  ].join("\n");
}

export function htmlCodigoAcceso(d: DatosCodigoAcceso): string {
  const dispositivo = escapar(describirDispositivo(d.userAgent));
  const fecha = escapar(formatearFecha(d.fecha ?? new Date()));
  const email = escapar(d.email);
  const codigo = escapar(d.codigo);
  const digitos = [...codigo].map((c) => `<span class="digito">${c}</span>`).join("");
  const fila = (etiqueta: string, valor: string) => `
            <tr>
              <td style="padding:6px 0;font-family:${FUENTE};font-size:13px;color:${C.tenue};width:96px;vertical-align:top;">${etiqueta}</td>
              <td class="t-texto" style="padding:6px 0;font-family:${FUENTE};font-size:13px;color:${C.texto};vertical-align:top;">${valor}</td>
            </tr>`;

  return `<!doctype html>
<html lang="es" xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<meta name="color-scheme" content="light" />
<meta name="supported-color-schemes" content="light" />
<title>Tu código de acceso a Oponow</title>
<style>
  @media (max-width: 540px) {
    .contenedor { padding: 16px 10px !important; }
    .cuerpo { padding: 28px 22px !important; }
    .codigo { font-size: 32px !important; letter-spacing: 8px !important; }
  }
  /* Animaciones CSS: solo las ejecuta Apple Mail (iPhone, iPad, Mac). Gmail y
     Outlook las ignoran y muestran todo quieto; ahí se mueven los GIF. */
  @keyframes aparecer { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }
  @keyframes digito { 0% { opacity: 0; transform: translateY(12px) scale(.6); } 70% { transform: translateY(-3px) scale(1.08); } 100% { opacity: 1; transform: none; } }
  @keyframes latido { 0%, 100% { box-shadow: 0 0 0 0 rgba(245,181,68,0); } 50% { box-shadow: 0 0 0 4px rgba(245,181,68,.22); } }
  @keyframes resplandor { 0%, 100% { box-shadow: 0 0 0 0 rgba(145,132,217,0); } 50% { box-shadow: 0 0 0 6px rgba(145,132,217,.16); } }
  .entra-1 { animation: aparecer .6s ease-out .15s both; }
  .entra-2 { animation: aparecer .6s ease-out .3s both; }
  .entra-3 { animation: aparecer .6s ease-out .45s both, resplandor 2.4s ease-in-out 1.6s infinite; }
  .entra-4 { animation: aparecer .6s ease-out .9s both; }
  .entra-5 { animation: aparecer .6s ease-out 1.05s both, latido 2.4s ease-in-out 2s 3; }
  .digito { display: inline-block; animation: digito .5s cubic-bezier(.2,.9,.3,1.3) both; }
  .digito:nth-child(1) { animation-delay: .6s; } .digito:nth-child(2) { animation-delay: .68s; }
  .digito:nth-child(3) { animation-delay: .76s; } .digito:nth-child(4) { animation-delay: .84s; }
  .digito:nth-child(5) { animation-delay: .92s; } .digito:nth-child(6) { animation-delay: 1s; }
  @media (prefers-reduced-motion: reduce) {
    .entra-1, .entra-2, .entra-3, .entra-4, .entra-5, .digito { animation: none !important; }
  }
</style>
</head>
<body class="fondo" style="margin:0;padding:0;background:${C.fondo};-webkit-text-size-adjust:100%;">
  <!-- Texto de vista previa en la bandeja de entrada (oculto en el correo). -->
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;mso-hide:all;">
    Tu código es ${codigo}. Caduca en ${d.minutosValidez} minutos.&#8199;&#65279;&#847;&#8199;&#65279;&#847;&#8199;&#65279;&#847;&#8199;&#65279;&#847;&#8199;&#65279;&#847;
  </div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" class="fondo" style="background:${C.fondo};">
    <tr>
      <td align="center" class="contenedor" style="padding:32px 16px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" class="tarjeta" style="max-width:520px;background:${C.tarjeta};border-radius:16px;overflow:hidden;">
          <tr>
            <!-- Cabecera animada (GIF): el anillo gira con un brillo, la cuña empuja,
                 las letras hacen una ola, un destello recorre la palabra y salen
                 chispas. El primer fotograma es el logo completo: Outlook de
                 escritorio solo muestra ese. -->
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
              <h1 class="t-titulo entra-1" style="margin:0 0 12px;font-family:${FUENTE};font-size:22px;line-height:1.3;font-weight:600;color:${C.cabecera};">Confirma que eres tú</h1>
              <p class="t-suave entra-2" style="margin:0 0 24px;font-family:${FUENTE};font-size:15px;line-height:1.6;color:${C.suave};">
                Se ha introducido la contraseña de tu cuenta de Oponow en un navegador o dispositivo nuevo. Para terminar de iniciar sesión, usa este código:
              </p>

              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="center" class="caja-codigo entra-3" style="background:${C.codigoFondo};border:1px solid ${C.codigoBorde};border-radius:12px;padding:22px 12px 18px;">
                    <div class="codigo" style="font-family:${FUENTE_CODIGO};font-size:38px;line-height:1;font-weight:700;letter-spacing:10px;color:${C.cabecera};padding-left:10px;">${digitos}</div>
                    <div class="t-suave" style="margin-top:12px;font-family:${FUENTE};font-size:12px;line-height:18px;color:${C.suave};"><img src="cid:${CID_RELOJ}" width="18" height="18" alt="" style="display:inline-block;border:0;width:18px;height:18px;vertical-align:-4px;margin-right:6px;" />Caduca en ${d.minutosValidez} minutos · Solo sirve una vez</div>
                  </td>
                </tr>
              </table>

              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" class="detalles entra-4" style="margin-top:24px;border-top:1px solid ${C.borde};border-bottom:1px solid ${C.borde};">
                <tr><td colspan="2" style="padding:12px 0 2px;font-family:${FUENTE};font-size:11px;font-weight:600;letter-spacing:0.06em;text-transform:uppercase;color:${C.acentoOscuro};">Detalles del intento</td></tr>${fila("Dispositivo", dispositivo)}${fila("Fecha", fecha)}${fila("Cuenta", email)}
                <tr><td colspan="2" style="padding:0 0 8px;"></td></tr>
              </table>

              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:24px;">
                <tr>
                  <td class="aviso entra-5" style="background:${C.avisoFondo};border-left:4px solid ${C.avisoBorde};border-radius:8px;padding:14px 16px;">
                    <p class="t-texto" style="margin:0 0 4px;font-family:${FUENTE};font-size:14px;font-weight:600;color:${C.texto};">¿No has sido tú?</p>
                    <p class="t-suave" style="margin:0;font-family:${FUENTE};font-size:13px;line-height:1.55;color:${C.suave};">
                      Alguien conoce tu contraseña. No compartas este código con nadie (el equipo de Oponow nunca te lo pedirá) y responde a este correo para que te ayudemos a proteger tu cuenta.
                    </p>
                  </td>
                </tr>
              </table>

              <p class="t-suave" style="margin:24px 0 0;font-family:${FUENTE};font-size:13px;line-height:1.55;color:${C.suave};">
                Al introducir el código, no te lo volveremos a pedir en ese navegador durante 30 días.
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
              Has recibido este correo porque se ha iniciado sesión en tu cuenta de Oponow.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/** "Chrome en Windows", "Safari en iPhone", "la app de Oponow"… */
export function describirDispositivo(ua?: string): string {
  if (!ua) return "Dispositivo desconocido";
  // La app móvil (Expo/React Native) no manda un User-Agent de navegador.
  if (/okhttp|CFNetwork|Expo|Darwin\//i.test(ua) && !/Mozilla/i.test(ua)) return "La app de Oponow";

  const navegador =
    /Edg\//.test(ua) ? "Edge"
    : /OPR\/|Opera/.test(ua) ? "Opera"
    : /SamsungBrowser/.test(ua) ? "Samsung Internet"
    : /Firefox\//.test(ua) ? "Firefox"
    : /Chrome\/|CriOS\//.test(ua) ? "Chrome"
    : /Safari\//.test(ua) ? "Safari"
    : "Un navegador";
  const sistema =
    /iPhone/.test(ua) ? "iPhone"
    : /iPad/.test(ua) ? "iPad"
    : /Android/.test(ua) ? "Android"
    : /Windows/.test(ua) ? "Windows"
    : /Mac OS X|Macintosh/.test(ua) ? "Mac"
    : /CrOS/.test(ua) ? "Chromebook"
    : /Linux/.test(ua) ? "Linux"
    : null;
  return sistema ? `${navegador} en ${sistema}` : navegador;
}

export function formatearFecha(fecha: Date): string {
  const texto = new Intl.DateTimeFormat("es-ES", {
    timeZone: "Europe/Madrid",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(fecha);
  return `${texto} (hora peninsular)`;
}

export function escapar(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
