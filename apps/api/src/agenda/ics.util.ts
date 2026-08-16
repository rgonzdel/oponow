export interface IcsTarea {
  id: string;
  titulo: string;
  descripcion: string | null;
  fecha: Date;
  completada: boolean;
  createdAt: Date;
}

// Escapado literal de RFC 5545 (§3.3.11): backslash, coma, punto y coma y
// saltos de línea van escapados dentro de un valor de texto.
function escapeIcsText(value: string): string {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\n/g, "\\n");
}

function formatIcsDate(date: Date): string {
  return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
}

/**
 * Genera un feed iCalendar (RFC 5545) con un VEVENT por tarea. Se usa
 * VEVENT (no VTODO) a propósito: Google Calendar no renderiza VTODO al
 * suscribirse a un feed externo, y VEVENT sí lo soportan tanto Google
 * Calendar como Apple Calendar por igual — es el mínimo común denominador
 * que pidió el usuario ("que se sincronice con Google o con Apple").
 */
export function generarFeedIcs(tareas: IcsTarea[]): string {
  const lineas = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Oponow//Agenda de estudio//ES",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "X-WR-CALNAME:Agenda Oponow",
  ];

  for (const tarea of tareas) {
    lineas.push(
      "BEGIN:VEVENT",
      `UID:oponow-tarea-${tarea.id}@oponow.com`,
      `DTSTAMP:${formatIcsDate(tarea.createdAt)}`,
      `DTSTART:${formatIcsDate(tarea.fecha)}`,
      `SUMMARY:${escapeIcsText(tarea.completada ? `✓ ${tarea.titulo}` : tarea.titulo)}`,
    );
    if (tarea.descripcion) {
      lineas.push(`DESCRIPTION:${escapeIcsText(tarea.descripcion)}`);
    }
    lineas.push(`STATUS:${tarea.completada ? "COMPLETED" : "CONFIRMED"}`, "END:VEVENT");
  }

  lineas.push("END:VCALENDAR");
  // RFC 5545 exige terminadores de línea CRLF.
  return lineas.join("\r\n") + "\r\n";
}
