// Verificación del access token de "Iniciar sesión con Facebook" contra la
// Graph API. debug_token confirma que el token lo emitió NUESTRA app (y no
// otra app cualquiera cuyo token nos quieran colar) antes de pedir el perfil.
const GRAPH = "https://graph.facebook.com/v21.0";

export interface PerfilFacebook {
  sujeto: string;
  email: string | null;
  // Facebook solo devuelve el email si la persona lo ha confirmado en su
  // cuenta, así que se trata como verificado a efectos de vincular cuentas.
  emailVerificado: boolean;
}

export async function verificarTokenFacebook(
  token: string,
  appId: string,
  appSecret: string,
): Promise<PerfilFacebook | null> {
  const debug = await fetch(
    `${GRAPH}/debug_token?input_token=${encodeURIComponent(token)}&access_token=${encodeURIComponent(`${appId}|${appSecret}`)}`,
  );
  if (!debug.ok) return null;
  const { data } = (await debug.json()) as {
    data?: { app_id?: string; is_valid?: boolean; user_id?: string };
  };
  if (!data?.is_valid || data.app_id !== appId || !data.user_id) return null;

  const me = await fetch(
    `${GRAPH}/me?fields=id,email&access_token=${encodeURIComponent(token)}`,
  );
  if (!me.ok) return null;
  const perfil = (await me.json()) as { id?: string; email?: string };
  if (perfil.id !== data.user_id) return null;

  const email = perfil.email?.toLowerCase() ?? null;
  return { sujeto: perfil.id, email, emailVerificado: email !== null };
}
