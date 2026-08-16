import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { OponowLogo } from "../components/OponowLogo";
import { buttonClass } from "../components/button";

const PLAN_LABEL: Record<string, string> = {
  free: "Free",
  lite: "Lite",
  vip: "VIP",
};

export function DashboardPage() {
  const { user, logout } = useAuth();

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
          <p className="mt-3 text-sm text-neutral-500">
            Los tests con corrección todavía no están conectados aquí — solo
            el temario, servido con marca de agua por bloques.
          </p>
          <Link to="/oposiciones/tai/temario" className={buttonClass("primary", "mt-4 w-full")}>
            Ir al temario de TAI
          </Link>
        </div>
      </main>
    </div>
  );
}
