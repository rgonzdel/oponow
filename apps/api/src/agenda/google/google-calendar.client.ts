// Wrapper fino sobre OAuth2 + Calendar API v3 de Google con fetch nativo
// (Node 20+ ya lo trae) — evita añadir la dependencia googleapis solo para
// las 5 llamadas que necesitamos.

const AUTH_BASE = "https://accounts.google.com/o/oauth2/v2/auth";
const TOKEN_URL = "https://oauth2.googleapis.com/token";
const REVOKE_URL = "https://oauth2.googleapis.com/revoke";
const CALENDAR_EVENTS_URL = "https://www.googleapis.com/calendar/v3/calendars/primary/events";

const SCOPE = "https://www.googleapis.com/auth/calendar.events";

export interface GoogleTokens {
  access_token: string;
  refresh_token?: string;
  expires_in: number;
}

export interface GoogleEventInput {
  titulo: string;
  descripcion: string | null;
  fecha: Date;
  completada: boolean;
  oponowTareaId: string;
}

function toGoogleEventBody(event: GoogleEventInput) {
  return {
    summary: event.completada ? `✓ ${event.titulo}` : event.titulo,
    description: event.descripcion ?? undefined,
    start: { dateTime: event.fecha.toISOString() },
    // Evento de 30 min por defecto — Oponow no modela duración, solo fecha.
    end: { dateTime: new Date(event.fecha.getTime() + 30 * 60_000).toISOString() },
    extendedProperties: { private: { oponowTareaId: event.oponowTareaId } },
  };
}

export function buildGoogleAuthUrl(params: {
  clientId: string;
  redirectUri: string;
  state: string;
}): string {
  const qs = new URLSearchParams({
    client_id: params.clientId,
    redirect_uri: params.redirectUri,
    response_type: "code",
    scope: SCOPE,
    access_type: "offline",
    // Fuerza a Google a devolver refresh_token también en reconexiones
    // (si no, solo lo manda la primerísima vez que el usuario autoriza).
    prompt: "consent",
    state: params.state,
  });
  return `${AUTH_BASE}?${qs.toString()}`;
}

async function postForm<T>(url: string, body: Record<string, string>): Promise<T> {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams(body),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Google OAuth error (${res.status}): ${text}`);
  }
  return res.json() as Promise<T>;
}

export function exchangeCodeForTokens(params: {
  code: string;
  clientId: string;
  clientSecret: string;
  redirectUri: string;
}): Promise<GoogleTokens> {
  return postForm<GoogleTokens>(TOKEN_URL, {
    code: params.code,
    client_id: params.clientId,
    client_secret: params.clientSecret,
    redirect_uri: params.redirectUri,
    grant_type: "authorization_code",
  });
}

export function refreshAccessToken(params: {
  refreshToken: string;
  clientId: string;
  clientSecret: string;
}): Promise<GoogleTokens> {
  return postForm<GoogleTokens>(TOKEN_URL, {
    refresh_token: params.refreshToken,
    client_id: params.clientId,
    client_secret: params.clientSecret,
    grant_type: "refresh_token",
  });
}

export async function revokeGoogleToken(token: string): Promise<void> {
  await fetch(`${REVOKE_URL}?token=${encodeURIComponent(token)}`, { method: "POST" }).catch(
    () => {
      // Best-effort: si Google no responde, igualmente borramos la
      // conexión localmente (ver GoogleCalendarService.disconnect).
    },
  );
}

export async function createGoogleEvent(
  accessToken: string,
  event: GoogleEventInput,
): Promise<{ id: string }> {
  const res = await fetch(CALENDAR_EVENTS_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(toGoogleEventBody(event)),
  });
  if (!res.ok) throw new Error(`Google Calendar create error (${res.status})`);
  return res.json() as Promise<{ id: string }>;
}

export async function updateGoogleEvent(
  accessToken: string,
  eventId: string,
  event: GoogleEventInput,
): Promise<void> {
  const res = await fetch(`${CALENDAR_EVENTS_URL}/${eventId}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(toGoogleEventBody(event)),
  });
  if (!res.ok) throw new Error(`Google Calendar update error (${res.status})`);
}

export async function deleteGoogleEvent(accessToken: string, eventId: string): Promise<void> {
  const res = await fetch(`${CALENDAR_EVENTS_URL}/${eventId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  // 404/410: el evento ya no existe en Google (borrado a mano por el
  // usuario) — no es un fallo real, seguimos igual.
  if (!res.ok && res.status !== 404 && res.status !== 410) {
    throw new Error(`Google Calendar delete error (${res.status})`);
  }
}
