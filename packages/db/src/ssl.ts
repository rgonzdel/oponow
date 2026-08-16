/**
 * Postgres local (Docker) no tiene SSL habilitado; un proveedor gestionado
 * externo (Render, Supabase, etc.) normalmente lo exige. `require` cifra la
 * conexión sin verificar la cadena de certificados — suficiente aquí porque
 * la amenaza que nos importa es la escucha pasiva en la red, no MITM activo
 * contra el propio proveedor de la base de datos.
 */
export function sslModeFor(connectionString: string): "require" | false {
  try {
    const { hostname } = new URL(connectionString);
    return hostname === "localhost" || hostname === "127.0.0.1"
      ? false
      : "require";
  } catch {
    return false;
  }
}
