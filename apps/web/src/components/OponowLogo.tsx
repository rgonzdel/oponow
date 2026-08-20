// El anillo abierto + cuña sustituye la "O" de Oponow: un test casi
// completo, empujando hacia delante ("now"). Tal cual el sistema de marca.
// Las letras de "ponow" salen animadas desde la cuña al montar el logo.
const LETTERS = "ponow".split("");

export function OponowLogo({
  size = 28,
  className,
  animate = true,
}: {
  size?: number;
  className?: string;
  animate?: boolean;
}) {
  return (
    <div className={`flex items-center gap-[1px] ${className ?? ""}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 44 44"
        fill="none"
        className="flex-none"
      >
        <path
          d="M37.98 27.82 A17 17 0 1 1 37.98 16.18"
          stroke="currentColor"
          strokeWidth={4.5}
          strokeLinecap="round"
          fill="none"
        />
        <path d="M34 15 L44 22 L34 29 Z" fill="currentColor" />
      </svg>
      <span
        className="font-medium tracking-tight"
        style={{ fontSize: size * 0.82 }}
      >
        {LETTERS.map((letter, i) => (
          <span
            key={i}
            className={animate ? "oponow-letter" : undefined}
            style={animate ? { animationDelay: `${80 + i * 55}ms` } : undefined}
          >
            {letter}
          </span>
        ))}
      </span>
    </div>
  );
}
