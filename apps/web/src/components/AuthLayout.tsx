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
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-lg border border-ink-divider bg-ink-surface p-8 shadow-[0_6px_18px_rgba(0,0,0,0.55)]">
        <Link to="/" className="mb-1 flex justify-center text-accent">
          <OponowLogo />
        </Link>
        <h2 className="mb-6 text-center text-sm text-neutral-400">{title}</h2>
        {children}
      </div>
    </div>
  );
}
