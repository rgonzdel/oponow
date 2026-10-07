import { useEffect, useRef, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useAuth } from "../auth/AuthContext";
import { ApiError } from "../lib/api-client";
import { cargarScript, getProveedores } from "../lib/acceso-externo";

function mensajeError(e: unknown, porDefecto: string) {
  return e instanceof ApiError ? e.message : porDefecto;
}

/**
 * Botones de Google y Facebook para las pantallas de acceso. Solo
 * aparece cada uno si la API lo tiene configurado (GET /auth/proveedores).
 * `onSuccess` se llama cuando ya hay sesión iniciada.
 */
export function AccesoAlternativo({
  modo,
  onSuccess,
}: {
  modo: "signin" | "signup";
  onSuccess: () => void;
}) {
  const proveedores = useQuery({
    queryKey: ["auth", "proveedores"],
    queryFn: getProveedores,
    staleTime: Infinity,
    retry: false,
  });
  const [error, setError] = useState<string | null>(null);

  const p = proveedores.data;
  if (!p || (!p.google && !p.facebook)) return null;

  return (
    <div className="auth-stagger space-y-3">
      <div className="flex items-center gap-3 text-xs text-neutral-500">
        <span className="h-px flex-1 bg-ink-divider" />o continúa con
        <span className="h-px flex-1 bg-ink-divider" />
      </div>

      {p.google && (
        <BotonGoogle clientId={p.google} modo={modo} onSuccess={onSuccess} onError={setError} />
      )}
      {p.facebook && <BotonFacebook appId={p.facebook} onSuccess={onSuccess} onError={setError} />}

      {error && <p className="text-sm text-red-400">{error}</p>}
    </div>
  );
}

// Botón propio (blanco, con hover y la G animada) en lugar del botón que
// pinta Google en un iframe, que no se puede estilar. Abre la misma ventana
// emergente de Google con el flujo de código de autorización: la API canjea
// el código por el ID token y lo verifica igual que antes.
function BotonGoogle({
  clientId,
  modo,
  onSuccess,
  onError,
}: {
  clientId: string;
  modo: "signin" | "signup";
  onSuccess: () => void;
  onError: (m: string | null) => void;
}) {
  const { loginCon } = useAuth();
  const cliente = useRef<{ requestCode(): void } | null>(null);
  const [listo, setListo] = useState(false);
  const [entrando, setEntrando] = useState(false);
  // Los callbacks de Google se registran una sola vez; con la ref siempre
  // ven las funciones actuales.
  const callbacks = useRef({ loginCon, onSuccess, onError });
  callbacks.current = { loginCon, onSuccess, onError };

  useEffect(() => {
    let cancelado = false;
    cargarScript("https://accounts.google.com/gsi/client")
      .then(() => {
        const oauth2 = window.google?.accounts.oauth2;
        if (cancelado || !oauth2) return;
        cliente.current = oauth2.initCodeClient({
          client_id: clientId,
          scope: "openid email profile",
          ux_mode: "popup",
          callback: (r) => {
            const c = callbacks.current;
            if (!r.code) {
              setEntrando(false);
              if (r.error && r.error !== "access_denied") c.onError("No se ha podido entrar con Google");
              return;
            }
            c.loginCon("/auth/google", { code: r.code })
              .then(c.onSuccess)
              .catch((e) => c.onError(mensajeError(e, "No se ha podido entrar con Google")))
              .finally(() => setEntrando(false));
          },
          error_callback: (e) => {
            setEntrando(false);
            // Cerrar la ventana de Google no es un error que haya que mostrar.
            if (e.type !== "popup_closed") callbacks.current.onError("No se ha podido abrir la ventana de Google");
          },
        });
        setListo(true);
      })
      .catch(() => onError("No se ha podido cargar el acceso con Google"));
    return () => {
      cancelado = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clientId]);

  return (
    <button
      type="button"
      disabled={!listo || entrando}
      onClick={() => {
        onError(null);
        setEntrando(true);
        cliente.current?.requestCode();
      }}
      className="boton-google"
    >
      <span className="boton-google__g" aria-hidden>
        <LogoGoogle />
      </span>
      <span>{entrando ? "Conectando con Google…" : modo === "signup" ? "Registrarse con Google" : "Continuar con Google"}</span>
    </button>
  );
}

// Logo oficial de Google (colores y proporciones sin modificar).
function LogoGoogle() {
  return (
    <svg viewBox="0 0 48 48" width="20" height="20">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
    </svg>
  );
}

function BotonFacebook({
  appId,
  onSuccess,
  onError,
}: {
  appId: string;
  onSuccess: () => void;
  onError: (m: string | null) => void;
}) {
  const { loginCon } = useAuth();
  const [listo, setListo] = useState(false);
  const mutation = useMutation({
    mutationFn: (accessToken: string) => loginCon("/auth/facebook", { accessToken }),
    onSuccess,
    onError: (e) => onError(mensajeError(e, "No se ha podido entrar con Facebook")),
  });

  useEffect(() => {
    cargarScript("https://connect.facebook.net/es_ES/sdk.js")
      .then(() => {
        window.FB?.init({ appId, version: "v21.0", cookie: false, xfbml: false });
        setListo(true);
      })
      .catch(() => onError("No se ha podido cargar el acceso con Facebook"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appId]);

  return (
    <button
      type="button"
      disabled={!listo || mutation.isPending}
      onClick={() => {
        onError(null);
        window.FB?.login(
          (r) => {
            if (r.authResponse?.accessToken) mutation.mutate(r.authResponse.accessToken);
          },
          { scope: "public_profile,email" },
        );
      }}
      // Azul y logotipo oficiales de Facebook (guía de marca de Meta).
      className="inline-flex w-full items-center justify-center gap-2.5 rounded-md bg-[#1877F2] px-4 py-2.5 text-sm font-medium text-white transition-[filter,transform] hover:brightness-110 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-45"
    >
      <svg aria-hidden viewBox="0 0 24 24" className="h-[18px] w-[18px] fill-current">
        <path d="M24 12.07C24 5.41 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.04V9.41c0-3.02 1.8-4.7 4.54-4.7 1.31 0 2.68.24 2.68.24v2.97h-1.5c-1.5 0-1.96.93-1.96 1.89v2.26h3.32l-.53 3.5h-2.8V24C19.62 23.1 24 18.1 24 12.07" />
      </svg>
      {mutation.isPending ? "Entrando…" : "Continuar con Facebook"}
    </button>
  );
}
