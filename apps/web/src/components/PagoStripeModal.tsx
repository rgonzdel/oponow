import { useEffect, useRef, useState } from "react";
import { loadStripe, type Stripe, type StripeEmbeddedCheckout } from "@stripe/stripe-js";
import { ApiError } from "../lib/api-client";
import { crearCheckoutIntegrado } from "../lib/billing-client";

// Stripe.js se descarga una sola vez por clave publicable.
const cargas = new Map<string, Promise<Stripe | null>>();
function stripeDe(clave: string) {
  if (!cargas.has(clave)) cargas.set(clave, loadStripe(clave));
  return cargas.get(clave)!;
}

// Stripe solo admite un formulario integrado a la vez: cada apertura espera
// a que el anterior se haya creado y destruido (React puede montar y
// desmontar la ventana dos veces seguidas en desarrollo).
let ultimo: Promise<StripeEmbeddedCheckout | null> = Promise.resolve(null);

/**
 * Ventana con el formulario de pago de Stripe dentro de Oponow (Embedded
 * Checkout). El formulario lo sirve Stripe en un iframe: la tarjeta nunca
 * pasa por Oponow. Al terminar el pago llama a onCompletado con el id de la
 * sesión, que la página de éxito confirma.
 */
export function PagoStripeModal({
  clavePublica,
  oposicionSlug,
  ciclo,
  onCerrar,
  onCompletado,
}: {
  clavePublica: string;
  oposicionSlug: string;
  ciclo: "mensual" | "anual";
  onCerrar: () => void;
  onCompletado: (sessionId: string) => void;
}) {
  const contenedor = useRef<HTMLDivElement>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // Los callbacks cambian en cada render; Stripe solo admite uno al crear.
  const alCompletar = useRef(onCompletado);
  alCompletar.current = onCompletado;

  useEffect(() => {
    let cancelado = false;
    let sesion = "";
    const anterior = ultimo;
    const propio = (async (): Promise<StripeEmbeddedCheckout | null> => {
      (await anterior.catch(() => null))?.destroy();
      if (cancelado) return null;
      try {
        const stripe = await stripeDe(clavePublica);
        if (!stripe) throw new Error("No se ha podido cargar Stripe");
        if (cancelado) return null;
        const checkout = await stripe.createEmbeddedCheckoutPage({
          fetchClientSecret: async () => {
            const r = await crearCheckoutIntegrado(oposicionSlug, ciclo);
            sesion = r.sessionId;
            return r.clientSecret;
          },
          onComplete: () => alCompletar.current(sesion),
        });
        if (cancelado) {
          checkout.destroy();
          return null;
        }
        if (contenedor.current) checkout.mount(contenedor.current);
        setCargando(false);
        return checkout;
      } catch (e) {
        console.error("Pago integrado de Stripe:", e);
        if (!cancelado) {
          setError(e instanceof ApiError ? e.message : "No se ha podido abrir el pago. Inténtalo de nuevo.");
          setCargando(false);
        }
        return null;
      }
    })();
    ultimo = propio;
    // Al cerrar la ventana se destruye su formulario.
    return () => {
      cancelado = true;
      void propio.then((c) => c?.destroy());
    };
  }, [clavePublica, oposicionSlug, ciclo]);

  // Escape cierra y el fondo no se desplaza mientras está abierta.
  useEffect(() => {
    const alPulsar = (e: KeyboardEvent) => e.key === "Escape" && onCerrar();
    window.addEventListener("keydown", alPulsar);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", alPulsar);
      document.body.style.overflow = overflow;
    };
  }, [onCerrar]);

  return (
    <div
      className="pago-modal fixed inset-0 z-50 flex items-center justify-center bg-black/65 px-3 py-4 backdrop-blur-sm sm:px-4 sm:py-6"
      role="dialog"
      aria-modal="true"
      aria-label="Pago seguro con Stripe"
      onMouseDown={(e) => e.target === e.currentTarget && onCerrar()}
    >
      {/* Altura limitada a la pantalla y desplazamiento dentro: la barra con
          el botón de cerrar siempre queda a la vista. */}
      <div className="pago-modal__ventana flex max-h-full w-full max-w-[520px] flex-col overflow-hidden rounded-xl bg-white shadow-[0_24px_60px_rgba(0,0,0,0.5)]">
        <div className="flex flex-none items-center justify-between border-b border-neutral-200 px-4 py-3">
          <span className="flex items-center gap-2 text-sm font-medium text-neutral-800">
            <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <rect x="5" y="11" width="14" height="10" rx="2" />
              <path d="M8 11V7a4 4 0 0 1 8 0v4" />
            </svg>
            Pago seguro
          </span>
          <button
            type="button"
            onClick={onCerrar}
            className="rounded-md p-1.5 text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-800"
            aria-label="Cerrar el pago"
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" aria-hidden>
              <path d="M6 6l12 12M18 6 6 18" />
            </svg>
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
        {cargando && (
          <div className="flex flex-col items-center gap-3 px-6 py-16 text-sm text-neutral-500">
            <span className="h-6 w-6 animate-spin rounded-full border-2 border-neutral-300 border-t-[#5d5294]" aria-hidden />
            Cargando el pago seguro…
          </div>
        )}
        {error && (
          <div className="px-6 py-10 text-center">
            <p className="text-sm text-red-600">{error}</p>
            <button type="button" onClick={onCerrar} className="mt-4 text-sm font-medium text-[#5d5294] hover:underline">
              Volver
            </button>
          </div>
        )}
        <div ref={contenedor} className="min-h-[1px]" />
        </div>
      </div>
    </div>
  );
}
