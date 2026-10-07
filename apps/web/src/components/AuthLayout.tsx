import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { OponowLogo } from "./OponowLogo";

export function AuthLayout({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="relative isolate flex min-h-screen items-center justify-center px-4 py-10">
      <div className="auth-fondo" aria-hidden />
      <div className="auth-card w-full max-w-sm rounded-lg border border-ink-divider bg-ink-surface/85 p-8 shadow-[0_6px_18px_rgba(0,0,0,0.55),0_0_0_1px_rgba(145,132,217,0.06)] backdrop-blur-md">
        <Link to="/" className="mb-1 flex justify-center text-accent">
          <OponowLogo animacion="bucle" />
        </Link>
        <h2 className="mb-6 text-center text-sm text-neutral-400">{title}</h2>
        {children}
      </div>
    </div>
  );
}
