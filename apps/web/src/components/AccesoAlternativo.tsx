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
  const contenedor = useRef<HTMLDivElement>(null);
  // El callback de Google se registra una sola vez; con la ref siempre ve
  // las funciones actuales.
  const callbacks = useRef({ loginCon, onSuccess, onError });
  callbacks.current = { loginCon, onSuccess, onError };

  useEffect(() => {
    let cancelado = false;
    cargarScript("https://accounts.google.com/gsi/client")
      .then(() => {
        const el = contenedor.current;
        if (cancelado || !el || !window.google) return;
        window.google.accounts.id.initialize({
          client_id: clientId,
          ux_mode: "popup",
          context: modo,
          callback: ({ credential }) => {
            const c = callbacks.current;
            c.onError(null);
            c.loginCon("/auth/google", { credential })
              .then(c.onSuccess)
              .catch((e) => c.onError(mensajeError(e, "No se ha podido entrar con Google")));
          },
        });
        window.google.accounts.id.renderButton(el, {
          type: "standard",
          theme: "filled_black",
          size: "large",
          shape: "rectangular",
          text: modo === "signup" ? "signup_with" : "continue_with",
          logo_alignment: "center",
          locale: "es",
          width: el.clientWidth || 320,
        });
      })
      .catch(() => onError("No se ha podido cargar el acceso con Google"));
    return () => {
      cancelado = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clientId, modo]);

  // Altura reservada para que el botón de Google no haga saltar el layout al cargar.
  return <div ref={contenedor} className="flex h-10 w-full justify-center overflow-hidden rounded-md" />;
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
