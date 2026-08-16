import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { OponowLogo } from "./OponowLogo";
import { buttonClass } from "./button";

const NAV_LINKS = [{ to: "/oposiciones", label: "Oposiciones" }];

export function SiteHeader() {
  const { status } = useAuth();
  const isAuthenticated = status === "authenticated";

  return (
    <header className="border-b border-ink-divider">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-8">
          <Link to="/" className="text-accent">
            <OponowLogo />
          </Link>
          <nav className="hidden items-center gap-6 sm:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-sm text-neutral-400 transition-colors hover:text-ink-text"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {isAuthenticated ? (
          <Link to="/dashboard" className={buttonClass("primary")}>
            Ir al dashboard
          </Link>
        ) : (
          <div className="flex items-center gap-2">
            <Link to="/login" className={buttonClass("ghost")}>
              Entrar
            </Link>
            <Link to="/register" className={buttonClass("primary")}>
              Regístrate
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
