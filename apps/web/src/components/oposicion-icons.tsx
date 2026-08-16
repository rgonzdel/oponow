import type { ReactNode } from "react";

function Icon({ children }: { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {children}
    </svg>
  );
}

export const OPOSICION_ICONS = {
  descripcion: (
    <Icon>
      <path d="M4 21V7l8-4 8 4v14" />
      <path d="M9 21v-6h6v6" />
      <path d="M9 11h.01M15 11h.01M9 15h.01M15 15h.01" />
    </Icon>
  ),
  requisitos: (
    <Icon>
      <path d="M12 3l7 3.5v5c0 4.5-3 7-7 9.5-4-2.5-7-5-7-9.5v-5L12 3z" />
      <path d="M9 12l2 2 4-4" />
    </Icon>
  ),
  examen: (
    <Icon>
      <path d="M6 3h9l3 3v15H6z" />
      <path d="M9 9h6M9 13h6M9 17h3" />
    </Icon>
  ),
  temario: (
    <Icon>
      <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H12v18H6.5A2.5 2.5 0 0 1 4 18.5z" />
      <path d="M20 5.5A2.5 2.5 0 0 0 17.5 3H12v18h5.5a2.5 2.5 0 0 0 2.5-2.5z" />
    </Icon>
  ),
  plazas: (
    <Icon>
      <circle cx="9" cy="8" r="3" />
      <path d="M2 20c0-3.3 3-5.5 7-5.5s7 2.2 7 5.5" />
      <path d="M16 4.2c1.8.4 3 1.8 3 3.8s-1.2 3.4-3 3.8" />
      <path d="M18 14.6c2.4.6 4 2.5 4 5.4" />
    </Icon>
  ),
  retribucion: (
    <Icon>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v10M9.5 9.3c0-1.3 1.1-2.3 2.5-2.3s2.5.8 2.5 2c0 2.3-5 1.5-5 3.8 0 1.2 1.1 2.2 2.5 2.2s2.5-1 2.5-2.3" />
    </Icon>
  ),
  fuente: (
    <Icon>
      <path d="M4 19.5V6a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v13" />
      <path d="M4 19.5A2.5 2.5 0 0 0 6.5 22H19" />
      <path d="M8 7h7M8 10.5h7" />
    </Icon>
  ),
  todoIncluido: (
    <Icon>
      <rect x="3" y="6" width="18" height="14" rx="2" />
      <path d="M3 10h18" />
      <path d="M7 15h4" />
    </Icon>
  ),
  precio: (
    <Icon>
      <path d="M12 2 3 7v2c0 6 4 10 9 12 5-2 9-6 9-12V7z" />
      <path d="M9.5 12.3c0-1.3 1.1-2.3 2.5-2.3s2.5.8 2.5 1.8c0 2.1-5 1.4-5 3.5 0 1 1.1 1.8 2.5 1.8s2.5-1 2.5-2.1" />
    </Icon>
  ),
  pregunta: (
    <Icon>
      <circle cx="12" cy="12" r="9" />
      <path d="M9.5 9.2c0-1.4 1.1-2.4 2.5-2.4s2.5.9 2.5 2.2c0 1.8-2.5 1.9-2.5 3.8" />
      <path d="M12 17h.01" />
    </Icon>
  ),
};
