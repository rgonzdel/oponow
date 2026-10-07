// Verificación del ID token (JWT RS256) que devuelve "Sign in with Google"
// en el navegador, con crypto nativo de Node en vez de google-auth-library:
// solo hace falta comprobar la firma contra las claves públicas de Google y
// los claims estándar.
import { createPublicKey, verify, type JsonWebKey } from "node:crypto";

const JWKS_URL = "https://www.googleapis.com/oauth2/v3/certs";
const EMISORES = new Set(["accounts.google.com", "https://accounts.google.com"]);
const MARGEN_RELOJ_S = 60;

export interface PerfilGoogle {
  sujeto: string;
  email: string | null;
  emailVerificado: boolean;
}

let cache: { claves: Map<string, JsonWebKey>; caduca: number } | null = null;

async function clavePublica(kid: string): Promise<JsonWebKey | undefined> {
  if (!cache || cache.caduca < Date.now() || !cache.claves.has(kid)) {
    const res = await fetch(JWKS_URL);
    if (!res.ok) throw new Error(`Google JWKS respondió ${res.status}`);
    const { keys } = (await res.json()) as { keys: (JsonWebKey & { kid: string })[] };
    // Google rota las claves y anuncia cuánto cachearlas en Cache-Control.
    const maxAge = Number(/max-age=(\d+)/.exec(res.headers.get("cache-control") ?? "")?.[1] ?? 3600);
    cache = { claves: new Map(keys.map((k) => [k.kid, k])), caduca: Date.now() + maxAge * 1000 };
  }
  return cache.claves.get(kid);
}

function decodificar<T>(parte: string): T {
  return JSON.parse(Buffer.from(parte, "base64url").toString("utf8")) as T;
}

/** Devuelve el perfil si el token es válido para `clientId`; null si no. */
export async function verificarIdTokenGoogle(
  token: string,
  clientId: string,
): Promise<PerfilGoogle | null> {
  const partes = token.split(".");
  if (partes.length !== 3) return null;
  const [cabeceraB64, cuerpoB64, firmaB64] = partes;

  let cabecera: { alg?: string; kid?: string };
  let claims: {
    iss?: string;
    aud?: string;
    exp?: number;
    sub?: string;
    email?: string;
    email_verified?: boolean | string;
  };
  try {
    cabecera = decodificar(cabeceraB64);
    claims = decodificar(cuerpoB64);
  } catch {
    return null;
  }
  if (cabecera.alg !== "RS256" || !cabecera.kid) return null;

  const jwk = await clavePublica(cabecera.kid);
  if (!jwk) return null;
  const firmaOk = verify(
    "RSA-SHA256",
    Buffer.from(`${cabeceraB64}.${cuerpoB64}`),
    createPublicKey({ key: jwk, format: "jwk" }),
    Buffer.from(firmaB64, "base64url"),
  );
  if (!firmaOk) return null;

  const ahora = Math.floor(Date.now() / 1000);
  if (!claims.iss || !EMISORES.has(claims.iss)) return null;
  if (claims.aud !== clientId) return null;
  if (!claims.exp || claims.exp + MARGEN_RELOJ_S < ahora) return null;
  if (!claims.sub) return null;

  return {
    sujeto: claims.sub,
    email: claims.email?.toLowerCase() ?? null,
    emailVerificado: claims.email_verified === true || claims.email_verified === "true",
  };
}
