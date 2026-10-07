export type EstadoIcono = "espera" | "ok" | "error";

/**
 * Icono (sobre o candado) que se transforma en check (verde) o en X (rojo).
 * No hay fundidos: los trazos del icono base se "desdibujan" mientras se
 * dibujan los del nuevo (stroke-dashoffset), y el resultado se queda fijo.
 * Estilos en index.css (.icono-mfa).
 */
export function IconoEstado({
  estado,
  base = "sobre",
  etiquetas,
}: {
  estado: EstadoIcono;
  base?: "sobre" | "candado";
  etiquetas: Record<EstadoIcono, string>;
}) {
  return (
    <span className="icono-mfa" data-estado={estado} role="img" aria-label={etiquetas[estado]}>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
        {base === "sobre" ? (
          <>
            <rect className="icono-mfa__sobre" x="3" y="5" width="18" height="14" rx="2.5" pathLength={1} />
            <path className="icono-mfa__sobre icono-mfa__sobre--solapa" d="m4 7 8 6 8-6" pathLength={1} />
          </>
        ) : (
          <>
            <rect className="icono-mfa__sobre" x="5" y="10.5" width="14" height="10" rx="2.2" pathLength={1} />
            <path className="icono-mfa__sobre icono-mfa__sobre--solapa" d="M8.5 10.5V7.5a3.5 3.5 0 0 1 7 0v3" pathLength={1} />
          </>
        )}
        <path className="icono-mfa__check" d="M5.5 12.5 10 17l8.5-9.5" strokeWidth={2.2} pathLength={1} />
        <path className="icono-mfa__x icono-mfa__x--1" d="M7 7l10 10" strokeWidth={2.2} pathLength={1} />
        <path className="icono-mfa__x icono-mfa__x--2" d="M17 7 7 17" strokeWidth={2.2} pathLength={1} />
      </svg>
    </span>
  );
}
