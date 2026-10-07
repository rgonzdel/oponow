import { useState, type CSSProperties } from "react";

// El anillo abierto + cuña sustituye la "O" de Oponow: un test casi
// completo, empujando hacia delante ("now"). Tal cual el sistema de marca.
//
// Animación (la misma que la cabecera de los correos, ver
// apps/api/src/correo/cabecera-animada.gif): el anillo gira con un brillo,
// la cuña empuja, las letras hacen una ola, un destello recorre la palabra y
// salen chispas. Los keyframes están en index.css (.logo-op).
//   - "bucle": se repite cada 4,2 s (pantallas de acceso).
//   - "entrada": una vez al cargar y otra cada vez que se pasa el ratón.
//   - "ninguna": estático.
export type AnimacionLogo = "bucle" | "entrada" | "ninguna";

const LETRAS = [..."ponow"];

export function OponowLogo({
  size = 28,
  className,
  animacion = "ninguna",
}: {
  size?: number;
  className?: string;
  animacion?: AnimacionLogo;
}) {
  // Cambiar la key vuelve a montar el contenido y reinicia las animaciones CSS.
  const [ciclo, setCiclo] = useState(0);
  const [animando, setAnimando] = useState(animacion === "entrada");

  return (
    <div
      className={`logo-op relative flex items-center gap-[1px] ${className ?? ""}`}
      data-animacion={animacion === "entrada" ? (animando ? "entrada" : "quieto") : animacion}
      style={{ "--logo-size": `${size}px` } as CSSProperties}
      onMouseEnter={() => {
        if (animacion === "entrada" && !animando) {
          setCiclo((c) => c + 1);
          setAnimando(true);
        }
      }}
      onAnimationEnd={(e) => {
        // La última animación en terminar es la del destello de la última letra.
        if (animacion === "entrada" && e.animationName === "logo-op-destello") setAnimando(false);
      }}
    >
      <span key={`brillo-${ciclo}`} className="logo-op__brillo" aria-hidden />
      {[0, 1, 2].map((i) => (
        <svg key={`chispa-${i}-${ciclo}`} className={`logo-op__chispa logo-op__chispa--${i}`} viewBox="0 0 20 20" aria-hidden>
          <path d="M10 0 C11 7 13 9 20 10 C13 11 11 13 10 20 C9 13 7 11 0 10 C7 9 9 7 10 0Z" fill="currentColor" />
        </svg>
      ))}
      <svg
        key={`icono-${ciclo}`}
        width={size}
        height={size}
        viewBox="0 0 44 44"
        fill="none"
        className="logo-op__icono flex-none overflow-visible"
      >
        <path
          d="M37.98 27.82 A17 17 0 1 1 37.98 16.18"
          stroke="currentColor"
          strokeWidth={4.5}
          strokeLinecap="round"
          fill="none"
        />
        <g className="logo-op__cuna">
          <path d="M34 15 L44 22 L34 29 Z" fill="currentColor" />
        </g>
      </svg>
      <span
        key={`texto-${ciclo}`}
        className="font-medium tracking-tight"
        style={{ fontSize: size * 0.82 }}
        aria-label="ponow"
      >
        {LETRAS.map((letra, i) => (
          <span key={i} className="logo-op__letra" style={{ "--i": i } as CSSProperties} aria-hidden>
            {letra}
          </span>
        ))}
      </span>
    </div>
  );
}
