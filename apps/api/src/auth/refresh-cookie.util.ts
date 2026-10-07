import type { Response } from "express";

/** Alcance a /auth: el navegador no manda esta cookie a ninguna otra ruta,
 * reduciendo la superficie expuesta si algún otro endpoint tuviera un bug. */
export const REFRESH_COOKIE_NAME = "oponow_refresh_token";
const REFRESH_COOKIE_PATH = "/auth";

export function setRefreshCookie(
  res: Response,
  token: string,
  maxAgeMs: number,
) {
  res.cookie(REFRESH_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: REFRESH_COOKIE_PATH,
    maxAge: maxAgeMs,
  });
}

export function clearRefreshCookie(res: Response) {
  res.clearCookie(REFRESH_COOKIE_NAME, { path: REFRESH_COOKIE_PATH });
}

/** Navegador de confianza tras pasar el MFA por correo (ver
 * AuthService.verificarMfa). Mismo alcance /auth que la de refresh: solo la
 * necesita /auth/login. */
export const DISPOSITIVO_COOKIE_NAME = "oponow_dispositivo";
const DISPOSITIVO_MAX_AGE_MS = 30 * 86_400_000;

export function setDispositivoCookie(res: Response, token: string) {
  res.cookie(DISPOSITIVO_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: REFRESH_COOKIE_PATH,
    maxAge: DISPOSITIVO_MAX_AGE_MS,
  });
}

export function clearDispositivoCookie(res: Response) {
  res.clearCookie(DISPOSITIVO_COOKIE_NAME, { path: REFRESH_COOKIE_PATH });
}
