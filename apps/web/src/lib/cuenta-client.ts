import { apiFetch } from "./api-client";

// Refleja DatosCuenta de apps/api/src/auth/auth.service.ts.
export interface DatosCuenta {
  email: string | null;
  emailVerificado: boolean;
  plan: string;
  planExpira: string | null;
  creadaEn: string;
  tieneContrasena: boolean;
  proveedores: string[];
  sesionesActivas: number;
  dispositivosConfianza: number;
}

interface Tokens {
  accessToken: string;
}

export function getCuenta() {
  return apiFetch<DatosCuenta>("/auth/cuenta");
}

export function cambiarContrasena(actual: string, nueva: string) {
  return apiFetch<Tokens>("/auth/cuenta/contrasena", { method: "POST", body: JSON.stringify({ actual, nueva }) });
}

export function cerrarOtrasSesiones() {
  return apiFetch<Tokens>("/auth/cuenta/cerrar-sesiones", { method: "POST" });
}

export function pedirCambioEmail(email: string, password: string) {
  return apiFetch<void>("/auth/cuenta/email", { method: "POST", body: JSON.stringify({ email, password }) });
}

export function confirmarCambioEmail(token: string) {
  return apiFetch<{ email: string }>("/auth/cuenta/email/confirmar", {
    method: "POST",
    skipAuth: true,
    body: JSON.stringify({ token }),
  });
}

export function borrarCuenta(password?: string) {
  return apiFetch<void>("/auth/cuenta", { method: "DELETE", body: JSON.stringify(password ? { password } : {}) });
}

/** Cuentas sin contraseña (solo Google): reciben el enlace para crearla. */
export function pedirEnlaceContrasena(email: string) {
  return apiFetch<void>("/auth/contrasena/olvidada", { method: "POST", skipAuth: true, body: JSON.stringify({ email }) });
}
