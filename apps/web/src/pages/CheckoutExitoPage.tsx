import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../auth/AuthContext";
import { AuthLayout } from "../components/AuthLayout";
import { buttonClass } from "../components/button";
import { IconoEstado } from "../components/IconoEstado";
import { ApiError } from "../lib/api-client";
import { confirmarCheckout } from "../lib/billing-client";

/** Vuelta desde la página de pago de Stripe. */
export function CheckoutExitoPage() {
  const { refreshSession } = useAuth();
  const [sesion] = useState(() => new URLSearchParams(window.location.search).get("session_id") ?? "");

  const confirmar = useQuery({
    queryKey: ["checkout-exito", sesion],
    queryFn: async () => {
      const r = await confirmarCheckout(sesion);
      // El plan viaja en el access token: hay que renovarlo.
      await refreshSession().catch(() => {});
      return r;
    },
    enabled: sesion.length > 0,
    retry: 2,
    retryDelay: 2000,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });

  const estado = !sesion || confirmar.isError ? "error" : confirmar.isSuccess ? "ok" : "espera";
  const slug = confirmar.data?.oposicionSlug;

  return (
    <AuthLayout title={estado === "ok" ? "¡Suscripción activada!" : estado === "error" ? "No hemos podido confirmar el pago" : "Confirmando el pago…"}>
      <div className="auth-pop space-y-4 text-center">
        <div className="flex justify-center">
          <IconoEstado estado={estado} base="candado" etiquetas={{ espera: "Confirmando", ok: "Suscripción activada", error: "Error" }} />
        </div>
        <p className="text-sm text-neutral-300" aria-live="polite">
          {estado === "ok"
            ? "Ya tienes acceso a todo el temario y tests ilimitados. Te enviaremos las facturas por correo."
            : estado === "error"
              ? confirmar.error instanceof ApiError
                ? confirmar.error.message
                : "Si se ha completado el pago, la suscripción aparecerá en Mi cuenta en unos minutos."
              : "Un momento, estamos activando tu suscripción."}
        </p>
        {estado !== "espera" && (
          <div className="grid gap-2">
            {estado === "ok" && slug && (
              <Link to={`/oposiciones/${slug}/temario`} className={buttonClass("primary", "w-full")}>
                Ir al temario
              </Link>
            )}
            <Link to="/cuenta" className={buttonClass(estado === "ok" ? "ghost" : "primary", "w-full")}>
              Ver Mi cuenta
            </Link>
          </div>
        )}
      </div>
    </AuthLayout>
  );
}
