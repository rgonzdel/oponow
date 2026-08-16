export type BillingCycle = "mensual" | "anual";

// Un único plan de pago (antes "LITE" y "VIP" — VIP se retiró: un solo
// precio, sin niveles que comparar, más fácil de entender de un vistazo).
export const PLAN_PRECIO = {
  mensual: { valor: "4,99€", sufijo: "/mes" },
  anual: { valor: "39,99€", sufijo: "/año" },
} as const;

const MENSUAL_NUM = 4.99;
const ANUAL_NUM = 39.99;

export const AHORRO_ANUAL_PORCENTAJE = Math.round(
  (1 - ANUAL_NUM / (MENSUAL_NUM * 12)) * 100,
);

export const PLAN_FEATURES = [
  "Temario completo de la oposición que elijas",
  "Tests ilimitados",
  "Las preguntas reales de examen incluidas",
];
