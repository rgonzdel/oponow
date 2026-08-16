import { z } from "zod";

// Reflejan las reglas de apps/api/src/auth/dto/{login,register}.dto.ts.
export const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(1, "La contraseña es obligatoria"),
});

export const registerSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(8, "Mínimo 8 caracteres").max(72),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;

// Refleja apps/api/src/billing/dto/subscribe.dto.ts. El número de tarjeta
// se valida ya sin espacios (el formulario los quita al enviar).
export const checkoutSchema = z.object({
  cardName: z.string().min(1, "Indica el nombre del titular"),
  cardNumber: z
    .string()
    .min(1, "Indica el número de tarjeta")
    .transform((v) => v.replace(/\s+/g, ""))
    .refine((v) => /^\d{13,19}$/.test(v), "Número de tarjeta inválido"),
  cardExpiry: z
    .string()
    .regex(/^\d{2}\/\d{2}$/, "Formato MM/AA"),
  cardCvc: z.string().regex(/^\d{3,4}$/, "CVC inválido"),
});

export type CheckoutFormValues = z.infer<typeof checkoutSchema>;
