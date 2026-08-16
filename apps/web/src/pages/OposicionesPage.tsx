import { Link } from "react-router-dom";
import { SiteHeader } from "../components/SiteHeader";
import { OPOSICIONES } from "@oponow/shared-types";

export function OposicionesPage() {
  const disponibles = OPOSICIONES.filter((o) => o.disponible);
  const proximamente = OPOSICIONES.filter((o) => !o.disponible);

  return (
    <div>
      <SiteHeader />

      <main className="mx-auto max-w-5xl px-6 py-16">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-4xl font-medium tracking-tight text-ink-text">
            Elige tu oposición
          </h1>
          <p className="mt-4 text-neutral-400">
            Cada oposición tiene su propio temario digital y su propio banco
            de tests. Elige la tuya para ver el detalle y el precio.
          </p>
        </div>

        <div className="mt-14 grid gap-4 sm:grid-cols-2">
          {disponibles.map((op) => (
            <Link
              key={op.slug}
              to={`/oposiciones/${op.slug}`}
              className="flex flex-col gap-3 rounded-lg border border-ink-divider bg-ink-surface p-6 transition-colors hover:border-accent"
            >
              <div className="flex items-center justify-between">
                <span className="rounded-md bg-accent-800 px-2 py-0.5 text-[11px] font-medium text-accent-100">
                  Grupo {op.grupo}
                </span>
                <span className="text-xs text-neutral-500">
                  {op.organismo}
                </span>
              </div>
              <h3 className="text-lg font-medium text-ink-text">
                {op.nombre}{" "}
                <span className="text-neutral-500">({op.siglas})</span>
              </h3>
              <p className="text-sm text-neutral-400">{op.resumen}</p>
              <span className="text-sm font-medium text-accent">
                Ver detalle →
              </span>
            </Link>
          ))}

          {proximamente.map((op) => (
            <div
              key={op.slug}
              className="flex flex-col gap-3 rounded-lg border border-dashed border-ink-divider p-6 opacity-60"
            >
              <div className="flex items-center justify-between">
                <span className="rounded-md bg-ink px-2 py-0.5 text-[11px] font-medium text-neutral-500">
                  Grupo {op.grupo}
                </span>
                <span className="text-xs text-neutral-500">Próximamente</span>
              </div>
              <h3 className="text-lg font-medium text-neutral-400">
                {op.nombre}{" "}
                <span className="text-neutral-600">({op.siglas})</span>
              </h3>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
