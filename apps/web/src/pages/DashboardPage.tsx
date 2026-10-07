import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../auth/AuthContext";
import { OponowLogo } from "../components/OponowLogo";
import { buttonClass } from "../components/button";
import { ResumenWidget } from "../components/ResumenWidget";
import { MiniCalendar } from "../components/MiniCalendar";
import { DescargarInforme } from "../components/DescargarInforme";
import { listMySubscriptions } from "../lib/billing-client";

const PLAN_LABEL: Record<string, string> = {
  free: "Free",
  lite: "Lite",
  vip: "VIP",
};

export function DashboardPage() {
  const { user, logout } = useAuth();

  // Lite y VIP están igual de atados a la oposición concreta que eligieron
  // al suscribirse (VIP es solo la versión ya pagada de esa misma
  // suscripción, no acceso a todas las oposiciones) — solo Free, sin
  // ninguna suscripción activa, ve el catálogo completo.
  const subscriptionsQuery = useQuery({
    queryKey: ["billing", "subscriptions", "mine"],
    queryFn: listMySubscriptions,
    enabled: user?.plan === "lite" || user?.plan === "vip",
  });
  const miOposicion = subscriptionsQuery.data?.[0];

  return (
    <div>
      <header className="border-b border-ink-divider">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-6 py-4">
          <Link to="/" className="text-accent">
            <OponowLogo animacion="entrada" />
          </Link>
          <div className="flex items-center gap-2">
            <Link to="/cuenta" className={buttonClass("ghost")}>
              Mi cuenta
            </Link>
            <button onClick={() => logout()} className={buttonClass("ghost")}>
              Cerrar sesión
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[300px_1fr] lg:items-start">
          <div className="lg:order-2">
            <div className="rounded-lg border border-ink-divider bg-ink-surface p-6">
              <p className="text-ink-text">
                Sesión activa · plan{" "}
                <span className="rounded-md bg-accent-800 px-2 py-0.5 text-xs font-medium text-accent-100">
                  {user ? (PLAN_LABEL[user.plan] ?? user.plan) : "…"}
                </span>
              </p>
              {miOposicion ? (
                <Link
                  to={`/oposiciones/${miOposicion.oposicionSlug}/temario`}
                  className={buttonClass("primary", "mt-4 w-full")}
                >
                  Ir al temario de {miOposicion.oposicionNombre}
                </Link>
              ) : (
                <Link to="/oposiciones" className={buttonClass("primary", "mt-4 w-full")}>
                  Ver oposiciones
                </Link>
              )}
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <Link
                to={miOposicion ? `/oposiciones/${miOposicion.oposicionSlug}/flashcards` : "/flashcards"}
                className="rounded-lg border border-ink-divider bg-ink-surface p-5 transition-colors hover:border-accent"
              >
                <h2 className="text-sm font-medium text-ink-text">Flashcards</h2>
                <p className="mt-1 text-xs text-neutral-500">
                  Memoriza la normativa con tarjetas y repaso espaciado.
                </p>
              </Link>
              <Link
                to="/fallos"
                className="rounded-lg border border-ink-divider bg-ink-surface p-5 transition-colors hover:border-accent"
              >
                <h2 className="text-sm font-medium text-ink-text">Seguimiento de fallos</h2>
                <p className="mt-1 text-xs text-neutral-500">
                  Repasa las preguntas que has fallado, filtradas por fecha.
                </p>
              </Link>
              <Link
                to="/agenda"
                className="rounded-lg border border-ink-divider bg-ink-surface p-5 transition-colors hover:border-accent"
              >
                <h2 className="text-sm font-medium text-ink-text">Agenda de estudio</h2>
                <p className="mt-1 text-xs text-neutral-500">
                  Crea tareas y sincronízalas con Google Calendar o Apple Calendar.
                </p>
              </Link>
              {user?.isAdmin && (
                <Link
                  to="/admin"
                  className="rounded-lg border border-ink-divider bg-ink-surface p-5 transition-colors hover:border-accent"
                >
                  <h2 className="text-sm font-medium text-ink-text">Panel de administración</h2>
                  <p className="mt-1 text-xs text-neutral-500">
                    Ver y gestionar los usuarios registrados.
                  </p>
                </Link>
              )}
            </div>
          </div>

          <div className="space-y-4 lg:order-1">
            <ResumenWidget />
            <DescargarInforme />
          </div>
        </div>

        {/* A lo ancho: las casillas necesitan sitio para previsualizar las
            tareas de cada día, en una columna estrecha no caben. */}
        <div className="mt-6">
          <MiniCalendar />
        </div>
      </main>
    </div>
  );
}
