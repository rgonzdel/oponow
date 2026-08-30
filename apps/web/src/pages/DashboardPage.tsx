import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../auth/AuthContext";
import { OponowLogo } from "../components/OponowLogo";
import { buttonClass } from "../components/button";
import { listMySubscriptions } from "../lib/billing-client";

const PLAN_LABEL: Record<string, string> = {
  free: "Free",
  lite: "Lite",
  vip: "VIP",
};

export function DashboardPage() {
  const { user, logout } = useAuth();

  // Solo el plan Lite tiene una única oposición elegida; Free y VIP ven el
  // catálogo completo (Free por sus temas gratuitos sueltos, VIP porque ya
  // tiene acceso a todas).
  const subscriptionsQuery = useQuery({
    queryKey: ["billing", "subscriptions", "mine"],
    queryFn: listMySubscriptions,
    enabled: user?.plan === "lite",
  });
  const liteOposicion = subscriptionsQuery.data?.[0];

  return (
    <div>
      <header className="border-b border-ink-divider">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-6 py-4">
          <Link to="/" className="text-accent">
            <OponowLogo />
          </Link>
          <button onClick={() => logout()} className={buttonClass("ghost")}>
            Cerrar sesión
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-6 py-10">
        <div className="rounded-lg border border-ink-divider bg-ink-surface p-6">
          <p className="text-ink-text">
            Sesión activa · plan{" "}
            <span className="rounded-md bg-accent-800 px-2 py-0.5 text-xs font-medium text-accent-100">
              {user ? (PLAN_LABEL[user.plan] ?? user.plan) : "…"}
            </span>
          </p>
          {liteOposicion ? (
            <Link
              to={`/oposiciones/${liteOposicion.oposicionSlug}/temario`}
              className={buttonClass("primary", "mt-4 w-full")}
            >
              Ir al temario de {liteOposicion.oposicionNombre}
            </Link>
          ) : (
            <Link to="/oposiciones" className={buttonClass("primary", "mt-4 w-full")}>
              Ver oposiciones
            </Link>
          )}
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
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
      </main>
    </div>
  );
}
