// Mismos tokens literales que apps/web/tailwind.config.js (sistema de
// marca "Nocturne") — sin NativeWind aquí, solo StyleSheet + estas
// constantes, para no añadir el toolchain de Tailwind/Babel a un SDK de
// Expo recién salido (57) que no he podido probar en un simulador real.
export const colors = {
  ink: "#161826",
  inkSurface: "#232532",
  inkText: "#e9e9ed",
  inkDivider: "rgba(233, 233, 237, 0.16)",
  accent: "#9184d9",
  accent100: "#f5f4ff",
  accent800: "#423a6a",
  accent900: "#2b2741",
  neutral400: "#b2b6ca",
  neutral500: "#9397ab",
  neutral600: "#75798c",
  red400: "#f87171",
  emerald400: "#34d399",
} as const;

export const radii = {
  md: 8,
  lg: 14,
} as const;

export const spacing = (n: number) => n * 4;
