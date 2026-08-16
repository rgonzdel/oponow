// Clases compartidas por <button> y <Link> (los CTA de la landing son
// enlaces, los de los formularios son botones) — de ahí que sea una función
// de clases y no un componente con una sola etiqueta fija.
export type ButtonVariant = "primary" | "secondary" | "ghost";

const BASE =
  "inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-45";

const VARIANTS: Record<ButtonVariant, string> = {
  primary:
    "border border-accent text-accent hover:bg-accent/10 active:bg-accent/20",
  secondary:
    "border border-ink-divider text-ink-text hover:bg-white/5 active:bg-white/10",
  ghost: "text-accent hover:bg-accent/10 active:bg-accent/20",
};

export function buttonClass(variant: ButtonVariant = "primary", extra = "") {
  return `${BASE} ${VARIANTS[variant]} ${extra}`.trim();
}
