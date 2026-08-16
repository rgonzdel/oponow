import * as SecureStore from "expo-secure-store";

const API_URL = process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:3000";
const REFRESH_TOKEN_KEY = "oponow_refresh_token";

// Igual que en apps/web: el access token SOLO en memoria, nunca en
// almacenamiento persistente. El refresh token sí necesita persistir entre
// aperturas de la app — aquí no hay cookie httpOnly (eso es solo para
// navegador), así que usamos el keychain/keystore del sistema operativo
// vía expo-secure-store (cifrado en reposo por el propio SO).
let accessToken: string | null = null;

export function setAccessToken(token: string | null) {
  accessToken = token;
}

export function getAccessToken() {
  return accessToken;
}

export function getStoredRefreshToken() {
  return SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
}

export async function setStoredRefreshToken(token: string | null) {
  if (token) await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, token);
  else await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
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
  // Sin `credentials: 'include'`: no hay cookies en React Native, el
  // refresh token viaja siempre en el body (ver auth.controller.ts,
  // acepta cookie O body — móvil usa la segunda vía).
  return fetch(`${API_URL}${path}`, { ...options, headers });
}

let refreshPromise: Promise<boolean> | null = null;

async function tryRefresh(): Promise<boolean> {
  if (!refreshPromise) {
    refreshPromise = (async () => {
      try {
        const stored = await getStoredRefreshToken();
        if (!stored) return false;

        const res = await rawFetch("/auth/refresh", {
          method: "POST",
          skipAuth: true,
          body: JSON.stringify({ refreshToken: stored }),
        });
        if (!res.ok) return false;

        const data = (await res.json()) as { accessToken: string; refreshToken: string };
        setAccessToken(data.accessToken);
        // Rotación: el refresh token viejo ya se revocó en el backend, hay
        // que sobreescribir el guardado con el nuevo.
        await setStoredRefreshToken(data.refreshToken);
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
