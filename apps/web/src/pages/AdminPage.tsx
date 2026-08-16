import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../auth/AuthContext";
import { SiteHeader } from "../components/SiteHeader";
import { LoadingScreen } from "../components/LoadingScreen";
import { buttonClass } from "../components/button";
import {
  getUsuario,
  listUsuarios,
  updatePlan,
  type PlanTipo,
} from "../lib/admin-client";

const PLAN_LABEL: Record<PlanTipo, string> = {
  free: "Free",
  lite: "Lite",
  vip: "VIP",
};

function formatFecha(iso: string) {
  return new Date(iso).toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function AdminPage() {
  const { user, status } = useAuth();
  const queryClient = useQueryClient();
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const usuariosQuery = useQuery({
    queryKey: ["admin", "usuarios", q, page],
    queryFn: () => listUsuarios({ q: q || undefined, page }),
  });

  const detalleQuery = useQuery({
    queryKey: ["admin", "usuario", selectedId],
    queryFn: () => getUsuario(selectedId as string),
    enabled: Boolean(selectedId),
  });

  const [nuevoPlan, setNuevoPlan] = useState<PlanTipo>("free");

  const planMutation = useMutation({
    mutationFn: () => updatePlan(selectedId as string, nuevoPlan),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "usuarios"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "usuario", selectedId] });
    },
  });

  if (status === "loading") return <LoadingScreen />;
  if (status === "anonymous" || !user?.isAdmin) return <Navigate to="/" replace />;

  const usuarios = usuariosQuery.data?.usuarios ?? [];
  const total = usuariosQuery.data?.total ?? 0;
  const pageSize = usuariosQuery.data?.pageSize ?? 20;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div>
      <SiteHeader />

      <main className="mx-auto max-w-4xl px-6 py-10">
        <h1 className="text-2xl font-medium tracking-tight text-ink-text">
          Usuarios
        </h1>

        <input
          type="text"
          placeholder="Buscar por email…"
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setPage(1);
          }}
          className="mt-4 w-full max-w-sm rounded-md border border-ink-divider bg-ink-surface px-3 py-2 text-sm text-ink-text placeholder:text-neutral-500"
        />

        <div className="mt-4 overflow-hidden rounded-lg border border-ink-divider">
          <table className="w-full text-left text-sm">
            <thead className="bg-ink-surface text-xs text-neutral-500">
              <tr>
                <th className="px-4 py-2 font-medium">Email</th>
                <th className="px-4 py-2 font-medium">Plan</th>
                <th className="px-4 py-2 font-medium">Registrado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-divider">
              {usuarios.map((u) => (
                <tr
                  key={u.id}
                  onClick={() => {
                    setSelectedId(u.id);
                    setNuevoPlan(u.plan);
                  }}
                  className={`cursor-pointer bg-ink-surface transition-colors hover:bg-ink ${
                    selectedId === u.id ? "bg-ink" : ""
                  }`}
                >
                  <td className="px-4 py-2.5 text-ink-text">{u.email}</td>
                  <td className="px-4 py-2.5">
                    <span className="rounded-md bg-accent-800 px-2 py-0.5 text-[11px] font-medium text-accent-100">
                      {PLAN_LABEL[u.plan]}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-neutral-500">{formatFecha(u.createdAt)}</td>
                </tr>
              ))}
              {usuarios.length === 0 && (
                <tr>
                  <td colSpan={3} className="bg-ink-surface px-4 py-8 text-center text-neutral-500">
                    Sin resultados
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="mt-3 flex items-center justify-between text-xs text-neutral-500">
            <button
              type="button"
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="disabled:opacity-40"
            >
              ← Anterior
            </button>
            <span>
              Página {page} de {totalPages} · {total} usuarios
            </span>
            <button
              type="button"
              disabled={page === totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="disabled:opacity-40"
            >
              Siguiente →
            </button>
          </div>
        )}

        {selectedId && detalleQuery.data && (
          <div className="mt-8 rounded-lg border border-ink-divider bg-ink-surface p-6">
            <h2 className="text-sm font-medium text-ink-text">
              {detalleQuery.data.email}
            </h2>
            <p className="mt-1 text-xs text-neutral-500">
              Registrado el {formatFecha(detalleQuery.data.createdAt)} ·{" "}
              {detalleQuery.data.emailVerified ? "email verificado" : "email sin verificar"}
            </p>

            <div className="mt-4 flex items-center gap-3">
              <select
                value={nuevoPlan}
                onChange={(e) => setNuevoPlan(e.target.value as PlanTipo)}
                className="rounded-md border border-ink-divider bg-ink px-3 py-1.5 text-sm text-ink-text"
              >
                {(Object.keys(PLAN_LABEL) as PlanTipo[]).map((p) => (
                  <option key={p} value={p}>
                    {PLAN_LABEL[p]}
                  </option>
                ))}
              </select>
              <button
                type="button"
                disabled={nuevoPlan === detalleQuery.data.plan || planMutation.isPending}
                onClick={() => planMutation.mutate()}
                className={buttonClass("primary")}
              >
                {planMutation.isPending ? "Guardando…" : "Cambiar plan"}
              </button>
              {planMutation.isSuccess && (
                <span className="text-xs text-emerald-400">Actualizado ✓</span>
              )}
            </div>

            <h3 className="mt-6 text-xs font-medium uppercase tracking-wide text-neutral-500">
              Suscripciones
            </h3>
            <ul className="mt-2 divide-y divide-ink-divider overflow-hidden rounded-md border border-ink-divider">
              {detalleQuery.data.suscripciones.map((s) => (
                <li key={s.id} className="flex items-center justify-between bg-ink px-4 py-2.5 text-sm">
                  <span className="text-ink-text">{s.oposicionNombre}</span>
                  <span className="text-xs text-neutral-500">
                    {s.estado} · desde {formatFecha(s.fechaInicio)}
                  </span>
                </li>
              ))}
              {detalleQuery.data.suscripciones.length === 0 && (
                <li className="bg-ink px-4 py-3 text-center text-xs text-neutral-500">
                  Sin suscripciones
                </li>
              )}
            </ul>
          </div>
        )}
      </main>
    </div>
  );
}
