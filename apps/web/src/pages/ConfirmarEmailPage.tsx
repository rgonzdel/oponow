import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../auth/AuthContext";
import { AuthLayout } from "../components/AuthLayout";
import { buttonClass } from "../components/button";
import { IconoEstado } from "../components/IconoEstado";
import { ApiError } from "../lib/api-client";
import { confirmarCambioEmail } from "../lib/cuenta-client";

/** Página del enlace "Confirma tu nuevo email". */
export function ConfirmarEmailPage() {
  const { status } = useAuth();
  // Como en restablecer contraseña: el token se lee una vez y se quita de la URL.
  const [token] = useState(() => new URLSearchParams(window.location.search).get("token") ?? "");
  useEffect(() => {
    if (window.location.search) window.history.replaceState(window.history.state, "", window.location.pathname);
  }, []);

  const confirmar = useQuery({
    queryKey: ["confirmar-email", token],
    queryFn: () => confirmarCambioEmail(token),
    enabled: token.length > 0,
    retry: false,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });

  const estado = !token || confirmar.isError ? "error" : confirmar.isSuccess ? "ok" : "espera";
  const destino = status === "authenticated" ? "/cuenta" : "/login";

  return (
    <AuthLayout title={estado === "ok" ? "Email confirmado" : estado === "error" ? "Enlace no válido" : "Confirmando…"}>
      <div className="auth-pop space-y-4 text-center">
        <div className="flex justify-center">
          <IconoEstado estado={estado} etiquetas={{ espera: "Confirmando", ok: "Email confirmado", error: "Enlace no válido" }} />
        </div>
        <p className="text-sm text-neutral-300" aria-live="polite">
          {estado === "ok" ? (
            <>
              Desde ahora tu cuenta usa
              <span className="mt-0.5 block font-medium text-ink-text">{confirmar.data?.email}</span>
            </>
          ) : estado === "error" ? (
            confirmar.error instanceof ApiError
              ? confirmar.error.message
              : "El enlace no es válido o ha caducado. Vuelve a pedir el cambio desde Mi cuenta."
          ) : (
            "Comprobando el enlace…"
          )}
        </p>
        {estado !== "espera" && (
          <Link to={destino} className={buttonClass("primary", "w-full")}>
            {status === "authenticated" ? "Ir a Mi cuenta" : "Iniciar sesión"}
          </Link>
        )}
      </div>
    </AuthLayout>
  );
}
