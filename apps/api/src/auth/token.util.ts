import { createHash, randomBytes } from "node:crypto";

/** Token opaco de refresco: no es un JWT, es un secreto aleatorio que el
 * cliente guarda y el servidor solo conoce por su hash (igual que una
 * contraseña, pero comparado por hash exacto, no argon2). */
export function generateRefreshToken(): string {
  return randomBytes(32).toString("base64url");
}

export function hashRefreshToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

const DURATION_UNITS_MS: Record<string, number> = {
  s: 1_000,
  m: 60_000,
  h: 3_600_000,
  d: 86_400_000,
};

/** Convierte duraciones estilo "30d" / "15m" (mismo formato que usa
 * @nestjs/jwt) a milisegundos, para calcular expires_at en refresh_tokens. */
export function parseDurationToMs(duration: string): number {
  const match = /^(\d+)\s*(s|m|h|d)$/.exec(duration.trim());
  if (!match) {
    throw new Error(`Formato de duración inválido: "${duration}"`);
  }
  const [, amount, unit] = match;
  return Number(amount) * DURATION_UNITS_MS[unit];
}
