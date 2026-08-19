export const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

// Access token SOLO en memoria (nunca localStorage/sessionStorage): si un
// script inyectado (XSS) puede leer memoria de proceso ya ha ganado de
// todas formas, pero al menos no dejamos un secreto de larga vida tirado en
// storage persistente. El refresh token vive en una cookie httpOnly que JS
// no puede leer en absoluto (ver apps/api/src/auth/refresh-cookie.util.ts).
let accessToken: string | null = null;

export function setAccessToken(token: string | null) {
  accessToken = token;
}

export function getAccessToken() {
  return accessToken;
}

export class ApiError extends Error {
  status: number;

  constructor(status: number, body: unknown) {
    super(extractMessage(body));
    this.status = status;
  }
}

function extractMessage(body: unknown): string {
  if (body && typeof body === "object" && "message" in body) {
    const msg = (body as { message: unknown }).message;
    if (Array.isArray(msg)) return msg.join(", ");
    if (typeof msg === "string") return msg;
  }
  return "Ha ocurrido un error inesperado";
}

interface ApiFetchOptions extends RequestInit {
  /** Rutas de auth públicas (login/register/refresh): no adjuntan el bearer
   * ni disparan el flujo de refresh-y-reintento en un 401. */
  skipAuth?: boolean;
}

async function rawFetch(path: string, options: ApiFetchOptions): Promise<Response> {
  const headers = new Headers(options.headers);
  if (options.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  if (accessToken && !options.skipAuth) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }
  return fetch(`${API_URL}${path}`, {
    ...options,
    headers,
    // Imprescindible: es lo que hace que la cookie httpOnly de refresh
    // viaje en cada petición (login/register/refresh/logout).
    credentials: "include",
  });
}

// Varias requests pueden recibir un 401 a la vez si el access token caducó
// mientras el usuario tenía varias peticiones en vuelo; nos aseguramos de
// lanzar una única llamada a /auth/refresh y que todas esperen la misma.
let refreshPromise: Promise<boolean> | null = null;

async function tryRefresh(): Promise<boolean> {
  if (!refreshPromise) {
    refreshPromise = (async () => {
      try {
        const res = await rawFetch("/auth/refresh", {
          method: "POST",
          skipAuth: true,
        });
        if (!res.ok) return false;
        const data = (await res.json()) as { accessToken: string };
        setAccessToken(data.accessToken);
        return true;
      } catch {
        return false;
      } finally {
        refreshPromise = null;
      }
    })();
  }
  return refreshPromise;
}

export async function apiFetch<T>(
  path: string,
  options: ApiFetchOptions = {},
): Promise<T> {
  let res = await rawFetch(path, options);

  if (res.status === 401 && !options.skipAuth) {
    const refreshed = await tryRefresh();
    if (refreshed) {
      res = await rawFetch(path, options);
    }
  }

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new ApiError(res.status, body);
  }

  if (res.status === HTTP_NO_CONTENT) return undefined as T;
  return res.json() as Promise<T>;
}

const HTTP_NO_CONTENT = 204;
