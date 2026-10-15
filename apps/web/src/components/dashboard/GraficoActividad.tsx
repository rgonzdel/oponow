import { useState } from "react";

export interface DiaActividad {
  dia: string;
  tests: number;
  notaMedia: number | null;
}

const ALTO = 120;
const MARGEN_SUP = 8;
const GAP = 2;

function fechaCorta(dia: string, conDiaSemana = false) {
  const [a, m, d] = dia.split("-").map(Number);
  return new Date(a, m - 1, d).toLocaleDateString("es-ES", {
    ...(conDiaSemana ? { weekday: "short" as const } : {}),
    day: "numeric",
    month: "short",
  });
}

/** Barra con los extremos de datos redondeados (4px) y anclada a la base. */
function barra(x: number, y: number, ancho: number, alto: number) {
  const r = Math.min(4, ancho / 2, alto);
  return `M${x},${ALTO} V${y + r} Q${x},${y} ${x + r},${y} H${x + ancho - r} Q${x + ancho},${y} ${x + ancho},${y + r} V${ALTO} Z`;
}

/**
 * Tests completados por día. Una sola serie (el título la nombra, sin
 * leyenda), barras finas, rejilla recesiva y tooltip por barra; la tabla
 * equivalente queda disponible para lectores de pantalla.
 */
export function GraficoActividad({ datos }: { datos: DiaActividad[] }) {
  const [activo, setActivo] = useState<number | null>(null);
  const max = Math.max(1, ...datos.map((d) => d.tests));
  const tope = max <= 4 ? max : Math.ceil(max / 2) * 2;
  const n = datos.length;
  const anchoCelda = 100 / n;
  const total = datos.reduce((s, d) => s + d.tests, 0);
  const hoverDato = activo !== null ? datos[activo] : null;

  return (
    <figure className="relative">
      <div className="relative" onMouseLeave={() => setActivo(null)}>
        <svg
          viewBox={`0 0 100 ${ALTO}`}
          preserveAspectRatio="none"
          className="block h-44 w-full overflow-visible"
          role="img"
          aria-label={`Tests completados por día: ${total} en ${n} días`}
        >
          {/* Rejilla recesiva: base y mitad. */}
          <line x1="0" x2="100" y1={ALTO} y2={ALTO} stroke="rgba(233,233,237,0.16)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
          <line x1="0" x2="100" y1={MARGEN_SUP + (ALTO - MARGEN_SUP) / 2} y2={MARGEN_SUP + (ALTO - MARGEN_SUP) / 2} stroke="rgba(233,233,237,0.07)" strokeWidth="1" strokeDasharray="2 3" vectorEffect="non-scaling-stroke" />
          {datos.map((d, i) => {
            const h = d.tests ? Math.max(3, ((ALTO - MARGEN_SUP) * d.tests) / tope) : 0;
            const x = i * anchoCelda + GAP / 2;
            const w = Math.max(0.5, anchoCelda - GAP);
            return (
              <g key={d.dia}>
                {h > 0 && (
                  <path
                    d={barra(x, ALTO - h, w, h)}
                    fill="#9184d9"
                    opacity={activo === null || activo === i ? 1 : 0.45}
                  />
                )}
                {/* Zona de hover más grande que la marca. */}
                <rect
                  x={i * anchoCelda}
                  y={0}
                  width={anchoCelda}
                  height={ALTO}
                  fill="transparent"
                  onMouseEnter={() => setActivo(i)}
                  onFocus={() => setActivo(i)}
                  tabIndex={-1}
                />
              </g>
            );
          })}
        </svg>
        <span className="pointer-events-none absolute -top-1 left-0 text-[10px] tabular-nums text-neutral-500">{tope}</span>

        {hoverDato && activo !== null && (
          <div
            className="pointer-events-none absolute -top-2 z-10 -translate-x-1/2 -translate-y-full whitespace-nowrap rounded-md border border-ink-divider bg-ink px-2.5 py-1.5 text-xs shadow-lg"
            style={{ left: `${(activo + 0.5) * anchoCelda}%` }}
          >
            <p className="font-medium text-ink-text">{fechaCorta(hoverDato.dia, true)}</p>
            <p className="text-neutral-300">
              {hoverDato.tests} {hoverDato.tests === 1 ? "test" : "tests"}
              {hoverDato.notaMedia !== null && <> · nota media {hoverDato.notaMedia.toFixed(1).replace(".", ",")}</>}
            </p>
          </div>
        )}
      </div>

      <div className="mt-1.5 flex justify-between text-[10px] text-neutral-500">
        <span>{fechaCorta(datos[0]?.dia ?? "")}</span>
        {n > 2 && <span>{fechaCorta(datos[Math.floor(n / 2)].dia)}</span>}
        <span>Hoy</span>
      </div>

      <table className="sr-only">
        <caption>Tests completados por día</caption>
        <thead>
          <tr>
            <th>Día</th>
            <th>Tests</th>
            <th>Nota media</th>
          </tr>
        </thead>
        <tbody>
          {datos.map((d) => (
            <tr key={d.dia}>
              <td>{fechaCorta(d.dia, true)}</td>
              <td>{d.tests}</td>
              <td>{d.notaMedia ?? "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
}
