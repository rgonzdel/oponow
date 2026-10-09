import { useEffect, useState, type ReactNode } from "react";
import { Link, Navigate, useSearchParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../auth/AuthContext";
import { SiteHeader } from "../components/SiteHeader";
import { LoadingScreen } from "../components/LoadingScreen";
import { buttonClass } from "../components/button";
import { ApiError } from "../lib/api-client";
import {
  getContenido,
  getResumen,
  getRoles,
  asignarOposicion,
  getUsuario,
  listOposiciones,
  listUsuarios,
  quitarOposicion,
  updatePlan,
  updateRol,
  type Permiso,
  type PlanTipo,
  type Rol,
} from "../lib/admin-client";

const PLAN_LABEL: Record<PlanTipo, string> = { free: "Gratis", lite: "Lite", vip: "VIP" };
const ROL_LABEL: Record<Rol, string> = {
  admin: "Administrador",
  contabilidad: "Contabilidad",
  soporte: "Soporte",
  lectura: "Solo lectura",
  editor: "Editor de contenido",
  opositor: "Opositor",
};
const ROL_CHIP: Record<Rol, string> = {
  admin: "bg-accent-800 text-accent-100",
  contabilidad: "bg-emerald-500/15 text-emerald-300",
  soporte: "bg-sky-500/15 text-sky-300",
  lectura: "bg-neutral-500/20 text-neutral-300",
  editor: "bg-amber-400/15 text-amber-300",
  opositor: "border border-ink-divider text-neutral-500",
};

const ROL_PLURAL: Record<Exclude<Rol, "opositor">, [string, string]> = {
  admin: ["administrador", "administradores"],
  contabilidad: ["de contabilidad", "de contabilidad"],
  soporte: ["de soporte", "de soporte"],
  lectura: ["de solo lectura", "de solo lectura"],
  editor: ["editor", "editores"],
};

type Pestana = "resumen" | "usuarios" | "roles" | "contenido";
const PESTANAS: { id: Pestana; texto: string; permiso: Permiso }[] = [
  { id: "resumen", texto: "Resumen", permiso: "ver_estadisticas" },
  { id: "usuarios", texto: "Usuarios", permiso: "ver_usuarios" },
  { id: "roles", texto: "Roles", permiso: "panel" },
  { id: "contenido", texto: "Contenido", permiso: "ver_contenido" },
];

const fecha = (iso: string) =>
  new Date(iso).toLocaleDateString("es-ES", { day: "2-digit", month: "short", year: "numeric" });
const mensaje = (e: unknown, d: string) => (e instanceof ApiError ? e.message : d);

/** Panel del equipo: cada pestaña aparece solo si el rol tiene su permiso. */
export function AdminPage() {
  const { user, status } = useAuth();
  const [params, setParams] = useSearchParams();

  if (status === "loading") return <LoadingScreen />;
  if (status === "anonymous" || !user?.permisos?.includes("panel")) return <Navigate to="/dashboard" replace />;

  const visibles = PESTANAS.filter((p) => user.permisos.includes(p.permiso));
  const pedida = params.get("seccion") as Pestana | null;
  const actual = visibles.find((p) => p.id === pedida)?.id ?? visibles[0].id;

  return (
    <div>
      <SiteHeader />
      <main className="mx-auto max-w-5xl px-6 py-10">
        <Link to="/dashboard" className="text-sm text-neutral-500 transition-colors hover:text-ink-text">
          ← Panel
        </Link>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-2xl font-medium tracking-tight text-ink-text">Administración</h1>
          <span className={`rounded-md px-2 py-0.5 text-xs font-medium ${ROL_CHIP[user.rol]}`}>Tu rol: {ROL_LABEL[user.rol]}</span>
        </div>

        <nav className="mt-6 flex gap-1 overflow-x-auto border-b border-ink-divider" aria-label="Secciones del panel">
          {visibles.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setParams({ seccion: p.id }, { replace: true })}
              className={`-mb-px whitespace-nowrap border-b-2 px-4 py-2.5 text-sm transition-colors ${
                actual === p.id ? "border-accent text-ink-text" : "border-transparent text-neutral-500 hover:text-ink-text"
              }`}
              aria-current={actual === p.id ? "page" : undefined}
            >
              {p.texto}
            </button>
          ))}
        </nav>

        <div className="mt-6">
          {actual === "resumen" && <SeccionResumen />}
          {actual === "usuarios" && (
            <SeccionUsuarios key={params.get("rol") ?? ""} permisos={user.permisos} miId={user.id} rolInicial={(params.get("rol") as Rol | null) ?? ""} />
          )}
          {actual === "roles" && <SeccionRoles verMiembros={user.permisos.includes("ver_usuarios")} />}
          {actual === "contenido" && <SeccionContenido />}
        </div>
      </main>
    </div>
  );
}

function SeccionResumen() {
  const resumen = useQuery({ queryKey: ["admin", "resumen"], queryFn: getResumen });
  if (resumen.isLoading) return <p className="text-sm text-neutral-500">Cargando…</p>;
  if (!resumen.data) return <p className="text-sm text-red-400">No se ha podido cargar el resumen.</p>;
  const r = resumen.data;
  return (
    <div className="space-y-6">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Cifra valor={r.usuarios} texto="Usuarios" pista={`${r.altas.dias7} nuevos esta semana · ${r.altas.dias30} en 30 días`} />
        <Cifra valor={r.suscripciones.activas} texto="Suscripciones de pago" pista={`${r.suscripciones.enPrueba} en prueba gratuita`} />
        <Cifra valor={r.suscripciones.pagoPendiente} texto="Pagos pendientes" pista="Cobro fallido: conviene avisarles" tono={r.suscripciones.pagoPendiente ? "aviso" : undefined} />
        <Cifra valor={Object.values(r.equipo).reduce((a, b) => a + b, 0)} texto="Personas del equipo" pista={Object.entries(r.equipo).filter(([, n]) => n > 0).map(([rol, n]) => `${n} ${ROL_PLURAL[rol as Exclude<Rol, "opositor">][n === 1 ? 0 : 1]}`).join(" · ") || "—"} />
      </div>
      <Tarjeta titulo="Usuarios por plan">
        <div className="space-y-2">
          {(Object.keys(PLAN_LABEL) as PlanTipo[]).map((p) => {
            const pct = r.usuarios ? (r.porPlan[p] / r.usuarios) * 100 : 0;
            return (
              <div key={p} className="flex items-center gap-3 text-sm">
                <span className="w-16 text-neutral-400">{PLAN_LABEL[p]}</span>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-ink">
                  <div className="h-full rounded-full bg-accent" style={{ width: `${pct}%` }} />
                </div>
                <span className="w-10 text-right tabular-nums text-ink-text">{r.porPlan[p]}</span>
              </div>
            );
          })}
        </div>
      </Tarjeta>
    </div>
  );
}

function SeccionUsuarios({ permisos, miId, rolInicial }: { permisos: Permiso[]; miId: string; rolInicial: Rol | "" }) {
  const queryClient = useQueryClient();
  const [q, setQ] = useState("");
  const [filtroRol, setFiltroRol] = useState<Rol | "">(rolInicial in ROL_LABEL ? rolInicial : "");
  const [page, setPage] = useState(1);
  const [seleccionado, setSeleccionado] = useState<string | null>(null);

  const usuarios = useQuery({
    queryKey: ["admin", "usuarios", q, filtroRol, page],
    queryFn: () => listUsuarios({ q: q || undefined, rol: filtroRol || undefined, page }),
  });
  const total = usuarios.data?.total ?? 0;
  const paginas = Math.max(1, Math.ceil(total / (usuarios.data?.pageSize ?? 20)));

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
      <div>
        <div className="flex flex-wrap gap-2">
          <input
            type="search"
            value={q}
            onChange={(e) => { setQ(e.target.value); setPage(1); }}
            placeholder="Buscar por email…"
            className="min-w-0 flex-1 rounded-md border border-ink-divider bg-ink-surface px-3 py-2 text-sm text-ink-text placeholder-neutral-600 outline-none focus:border-accent"
          />
          <select
            value={filtroRol}
            onChange={(e) => { setFiltroRol(e.target.value as Rol | ""); setPage(1); }}
            className="rounded-md border border-ink-divider bg-ink-surface px-3 py-2 text-sm text-ink-text outline-none focus:border-accent"
            aria-label="Filtrar por rol"
          >
            <option value="">Todos los roles</option>
            {(Object.keys(ROL_LABEL) as Rol[]).map((r) => (
              <option key={r} value={r}>{ROL_LABEL[r]}</option>
            ))}
          </select>
        </div>
        <div className="mt-3 overflow-x-auto rounded-lg border border-ink-divider">
          <table className="w-full text-left text-sm">
            <thead className="bg-ink-surface text-xs text-neutral-500">
              <tr>
                <th className="px-4 py-2 font-medium">Email</th>
                <th className="px-4 py-2 font-medium">Plan</th>
                <th className="px-4 py-2 font-medium">Rol</th>
                <th className="px-4 py-2 font-medium">Alta</th>
              </tr>
            </thead>
            <tbody>
              {(usuarios.data?.usuarios ?? []).map((u) => (
                <tr
                  key={u.id}
                  onClick={() => setSeleccionado(u.id)}
                  className={`cursor-pointer border-t border-ink-divider transition-colors hover:bg-ink-surface ${seleccionado === u.id ? "bg-ink-surface" : ""}`}
                >
                  <td className="max-w-[220px] truncate px-4 py-2.5 text-ink-text">{u.email ?? "(sin email)"}</td>
                  <td className="px-4 py-2.5 text-neutral-300">{PLAN_LABEL[u.plan]}</td>
                  <td className="px-4 py-2.5">
                    <span className={`whitespace-nowrap rounded-md px-2 py-0.5 text-[11px] font-medium ${ROL_CHIP[u.rol]}`}>{ROL_LABEL[u.rol]}</span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-2.5 text-neutral-500">{fecha(u.createdAt)}</td>
                </tr>
              ))}
              {usuarios.data && usuarios.data.usuarios.length === 0 && (
                <tr><td colSpan={4} className="px-4 py-8 text-center text-sm text-neutral-500">No hay usuarios con ese filtro.</td></tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="mt-3 flex items-center justify-between text-xs text-neutral-500">
          <span>{total} usuarios</span>
          <div className="flex items-center gap-2">
            <button type="button" disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className={buttonClass("ghost")}>Anterior</button>
            <span className="tabular-nums">{page} / {paginas}</span>
            <button type="button" disabled={page >= paginas} onClick={() => setPage((p) => p + 1)} className={buttonClass("ghost")}>Siguiente</button>
          </div>
        </div>
      </div>

      <div>
        {seleccionado ? (
          <FichaUsuario
            key={seleccionado}
            id={seleccionado}
            permisos={permisos}
            esYo={seleccionado === miId}
            onCambio={() => queryClient.invalidateQueries({ queryKey: ["admin"] })}
          />
        ) : (
          <Tarjeta><p className="text-sm text-neutral-500">Elige un usuario para ver su ficha.</p></Tarjeta>
        )}
      </div>
    </div>
  );
}

function FichaUsuario({ id, permisos, esYo, onCambio }: { id: string; permisos: Permiso[]; esYo: boolean; onCambio: () => void }) {
  const detalle = useQuery({ queryKey: ["admin", "usuario", id], queryFn: () => getUsuario(id) });
  const [plan, setPlan] = useState<PlanTipo>("free");
  const [rol, setRol] = useState<Rol>("opositor");
  const [confirmarRol, setConfirmarRol] = useState(false);
  useEffect(() => {
    if (detalle.data) {
      setPlan(detalle.data.plan);
      setRol(detalle.data.rol);
    }
  }, [detalle.data]);

  const cambiarPlan = useMutation({ mutationFn: () => updatePlan(id, plan), onSuccess: onCambio });
  const cambiarRol = useMutation({ mutationFn: () => updateRol(id, rol), onSuccess: () => { setConfirmarRol(false); onCambio(); } });

  if (detalle.isLoading) return <Tarjeta><p className="text-sm text-neutral-500">Cargando…</p></Tarjeta>;
  if (!detalle.data) return <Tarjeta><p className="text-sm text-red-400">No se ha podido cargar el usuario.</p></Tarjeta>;
  const u = detalle.data;

  return (
    <Tarjeta>
      <p className="break-all text-sm font-medium text-ink-text">{u.email ?? "(sin email)"}</p>
      <p className="mt-1 text-xs text-neutral-500">
        Alta el {fecha(u.createdAt)} · {u.emailVerified ? "email verificado" : "email sin verificar"}
      </p>

      <div className="mt-4 space-y-4">
        <Campo titulo="Plan">
          {permisos.includes("cambiar_plan") ? (
            <div className="flex gap-2">
              <select value={plan} onChange={(e) => { setPlan(e.target.value as PlanTipo); cambiarPlan.reset(); }} className="flex-1 rounded-md border border-ink-divider bg-ink px-2 py-1.5 text-sm text-ink-text outline-none focus:border-accent">
                {(Object.keys(PLAN_LABEL) as PlanTipo[]).map((p) => <option key={p} value={p}>{PLAN_LABEL[p]}</option>)}
              </select>
              <button type="button" disabled={plan === u.plan || cambiarPlan.isPending} onClick={() => cambiarPlan.mutate()} className={buttonClass("primary")}>
                Guardar
              </button>
            </div>
          ) : (
            <span className="text-sm text-ink-text">{PLAN_LABEL[u.plan]}</span>
          )}
          {cambiarPlan.isSuccess && <p className="mt-1 text-xs text-green-400">Plan actualizado.</p>}
          {cambiarPlan.isError && <p className="mt-1 text-xs text-red-400">{mensaje(cambiarPlan.error, "No se ha podido cambiar el plan")}</p>}
        </Campo>

        <Campo titulo="Rol">
          {permisos.includes("asignar_roles") && !esYo ? (
            <>
              <div className="flex gap-2">
                <select value={rol} onChange={(e) => { setRol(e.target.value as Rol); setConfirmarRol(false); cambiarRol.reset(); }} className="flex-1 rounded-md border border-ink-divider bg-ink px-2 py-1.5 text-sm text-ink-text outline-none focus:border-accent">
                  {(Object.keys(ROL_LABEL) as Rol[]).map((r) => <option key={r} value={r}>{ROL_LABEL[r]}</option>)}
                </select>
                <button type="button" disabled={rol === u.rol || cambiarRol.isPending} onClick={() => setConfirmarRol(true)} className={buttonClass("primary")}>
                  Asignar
                </button>
              </div>
              {confirmarRol && (
                <div className="mt-2 rounded-md border border-accent/40 bg-accent-900/40 p-3 text-xs text-neutral-300">
                  <p>
                    ¿Cambiar de <b className="text-ink-text">{ROL_LABEL[u.rol]}</b> a <b className="text-ink-text">{ROL_LABEL[rol]}</b>? Se aplicará en
                    su próxima renovación de sesión (en menos de 15 minutos).
                  </p>
                  <div className="mt-2 flex gap-2">
                    <button type="button" onClick={() => cambiarRol.mutate()} disabled={cambiarRol.isPending} className={buttonClass("primary")}>
                      {cambiarRol.isPending ? "Guardando…" : "Sí, cambiar"}
                    </button>
                    <button type="button" onClick={() => { setConfirmarRol(false); setRol(u.rol); }} className={buttonClass("ghost")}>Cancelar</button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <span className={`inline-block rounded-md px-2 py-0.5 text-[11px] font-medium ${ROL_CHIP[u.rol]}`}>{ROL_LABEL[u.rol]}</span>
          )}
          {esYo && permisos.includes("asignar_roles") && <p className="mt-1 text-xs text-neutral-500">No puedes cambiar tu propio rol.</p>}
          {cambiarRol.isSuccess && <p className="mt-1 text-xs text-green-400">Rol asignado.</p>}
          {cambiarRol.isError && <p className="mt-1 text-xs text-red-400">{mensaje(cambiarRol.error, "No se ha podido cambiar el rol")}</p>}
        </Campo>

        {u.suscripciones && permisos.includes("asignar_oposiciones") && (
          <OposicionesUsuario usuarioId={id} suscripciones={u.suscripciones} onCambio={onCambio} />
        )}

        {u.suscripciones && !permisos.includes("asignar_oposiciones") && (
          <Campo titulo="Suscripciones">
            {u.suscripciones.length === 0 ? (
              <p className="text-sm text-neutral-500">Ninguna.</p>
            ) : (
              <ul className="space-y-1.5">
                {u.suscripciones.map((s) => (
                  <li key={s.id} className="text-sm text-ink-text">
                    {s.oposicionNombre}
                    <span className="ml-2 text-xs text-neutral-500">
                      {s.activa ? (s.asignadaPorEquipo ? "asignada por el equipo" : s.estado) : "inactiva"} · desde {fecha(s.fechaInicio)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </Campo>
        )}
      </div>
    </Tarjeta>
  );
}

/**
 * Oposiciones del usuario con la opción de darle acceso a otra sin pasar por
 * el pago, o de retirar una que se le dio desde aquí. Las de pago se ven pero
 * no se tocan: se gestionan en Stripe.
 */
function OposicionesUsuario({
  usuarioId,
  suscripciones,
  onCambio,
}: {
  usuarioId: string;
  suscripciones: NonNullable<Awaited<ReturnType<typeof getUsuario>>["suscripciones"]>;
  onCambio: () => void;
}) {
  const queryClient = useQueryClient();
  const catalogo = useQuery({ queryKey: ["admin", "oposiciones"], queryFn: listOposiciones });
  const [elegida, setElegida] = useState("");
  const [quitando, setQuitando] = useState<string | null>(null);

  const actualizar = (datos: Awaited<ReturnType<typeof getUsuario>>) => {
    queryClient.setQueryData(["admin", "usuario", usuarioId], datos);
    onCambio();
  };
  const asignar = useMutation({
    mutationFn: () => asignarOposicion(usuarioId, elegida),
    onSuccess: (datos) => {
      setElegida("");
      actualizar(datos);
    },
  });
  const quitar = useMutation({
    mutationFn: (suscripcionId: string) => quitarOposicion(usuarioId, suscripcionId),
    onSuccess: (datos) => {
      setQuitando(null);
      actualizar(datos);
    },
  });

  const activas = new Set(suscripciones.filter((s) => s.activa).map((s) => s.oposicionId));
  const disponibles = (catalogo.data ?? []).filter((o) => !activas.has(o.id));
  const ordenadas = [...suscripciones].sort((a, b) => Number(b.activa) - Number(a.activa));

  return (
    <Campo titulo="Oposiciones">
      {ordenadas.length === 0 ? (
        <p className="text-sm text-neutral-500">No tiene acceso a ninguna oposición de pago.</p>
      ) : (
        <ul className="space-y-2">
          {ordenadas.map((s) => (
            <li key={s.id} className="rounded-md border border-ink-divider px-3 py-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className={`text-sm ${s.activa ? "text-ink-text" : "text-neutral-500 line-through"}`}>{s.oposicionNombre}</span>
                {s.activa && s.asignadaPorEquipo && quitando !== s.id && (
                  <button type="button" onClick={() => { setQuitando(s.id); quitar.reset(); }} className="text-xs text-neutral-400 hover:text-red-300">
                    Quitar
                  </button>
                )}
              </div>
              <p className="mt-0.5 text-xs text-neutral-500">
                {!s.activa
                  ? `Sin acceso${s.fechaFin ? ` desde el ${fecha(s.fechaFin)}` : ""}`
                  : s.asignadaPorEquipo
                    ? `Asignada por el equipo el ${fecha(s.fechaInicio)} · sin coste`
                    : `Suscripción de pago (${s.estado}) desde el ${fecha(s.fechaInicio)} · se gestiona en Stripe`}
              </p>
              {quitando === s.id && (
                <div className="mt-2 rounded-md border border-red-400/40 bg-red-500/10 p-2 text-xs text-neutral-300">
                  <p>¿Quitarle el acceso a {s.oposicionNombre}? Conserva su progreso, pero deja de ver los temas de pago.</p>
                  <div className="mt-2 flex gap-2">
                    <button type="button" disabled={quitar.isPending} onClick={() => quitar.mutate(s.id)} className="rounded-md border border-red-400/60 px-3 py-1 text-red-300 hover:bg-red-500/15">
                      {quitar.isPending ? "Quitando…" : "Sí, quitar"}
                    </button>
                    <button type="button" onClick={() => setQuitando(null)} className={buttonClass("ghost")}>Cancelar</button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
      {quitar.isError && <p className="mt-1 text-xs text-red-400">{mensaje(quitar.error, "No se ha podido quitar la oposición")}</p>}

      <div className="mt-3 flex gap-2">
        <select
          value={elegida}
          onChange={(e) => { setElegida(e.target.value); asignar.reset(); }}
          disabled={!disponibles.length}
          aria-label="Oposición a asignar"
          className="min-w-0 flex-1 rounded-md border border-ink-divider bg-ink px-2 py-1.5 text-sm text-ink-text outline-none focus:border-accent"
        >
          <option value="">{catalogo.isLoading ? "Cargando…" : disponibles.length ? "Elige una oposición…" : "Ya tiene todas"}</option>
          {disponibles.map((o) => <option key={o.id} value={o.id}>{o.nombre}</option>)}
        </select>
        <button type="button" disabled={!elegida || asignar.isPending} onClick={() => asignar.mutate()} className={buttonClass("primary")}>
          {asignar.isPending ? "Asignando…" : "Asignar"}
        </button>
      </div>
      <p className="mt-1 text-xs text-neutral-500">
        Le da acceso completo a esa oposición al momento y sin pago, hasta que se lo quites.
      </p>
      {asignar.isSuccess && <p className="mt-1 text-xs text-green-400">Oposición asignada.</p>}
      {asignar.isError && <p className="mt-1 text-xs text-red-400">{mensaje(asignar.error, "No se ha podido asignar la oposición")}</p>}
    </Campo>
  );
}

function SeccionRoles({ verMiembros }: { verMiembros: boolean }) {
  const roles = useQuery({ queryKey: ["admin", "roles"], queryFn: getRoles });
  if (roles.isLoading) return <p className="text-sm text-neutral-500">Cargando…</p>;
  if (!roles.data) return <p className="text-sm text-red-400">No se han podido cargar los roles.</p>;
  const { permisos, roles: lista } = roles.data;
  return (
    <div className="space-y-4">
      <p className="text-sm text-neutral-400">
        Los roles vienen definidos con sus permisos. Para dar o quitar un rol, ve a «Usuarios», abre la ficha de la persona y elige su rol.
      </p>
      <div className="grid gap-4 md:grid-cols-2">
        {lista.map((r) => (
          <section key={r.rol} className="rounded-lg border border-ink-divider bg-ink-surface p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className={`rounded-md px-2 py-0.5 text-xs font-medium ${ROL_CHIP[r.rol]}`}>{r.nombre}</span>
              {verMiembros && r.miembros !== null && (
                <Link
                  to={`/admin?seccion=usuarios&rol=${r.rol}`}
                  className="text-xs text-neutral-500 hover:text-accent"
                >
                  {r.miembros} {r.miembros === 1 ? "persona" : "personas"}
                </Link>
              )}
            </div>
            <p className="mt-2 text-sm text-neutral-400">{r.descripcion}</p>
            <ul className="mt-3 space-y-1.5">
              {(Object.keys(permisos) as Permiso[]).map((p) => {
                const tiene = r.permisos.includes(p);
                return (
                  <li key={p} className={`flex items-start gap-2 text-xs ${tiene ? "text-ink-text" : "text-neutral-600"}`}>
                    <span aria-hidden className={tiene ? "text-green-400" : "text-neutral-700"}>{tiene ? "✓" : "–"}</span>
                    <span>
                      <span className="sr-only">{tiene ? "Puede: " : "No puede: "}</span>
                      {permisos[p]}
                    </span>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}

function SeccionContenido() {
  const contenido = useQuery({ queryKey: ["admin", "contenido"], queryFn: getContenido });
  if (contenido.isLoading) return <p className="text-sm text-neutral-500">Cargando…</p>;
  if (!contenido.data) return <p className="text-sm text-red-400">No se ha podido cargar el contenido.</p>;
  return (
    <div className="space-y-4">
      <p className="text-sm text-neutral-400">
        Con tu rol ves todo el temario, los tests y las flashcards de cada oposición, sin límite diario, para revisarlos.
      </p>
      {contenido.data.map((o) => (
        <section key={o.slug} className="rounded-lg border border-ink-divider bg-ink-surface p-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-sm font-medium text-ink-text">{o.nombre}</h2>
            <div className="flex gap-3 text-xs">
              <Link to={`/oposiciones/${o.slug}/temario`} className="text-accent hover:underline">Temario</Link>
              <Link to={`/oposiciones/${o.slug}/flashcards`} className="text-accent hover:underline">Flashcards</Link>
            </div>
          </div>
          <dl className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {([["Temas", o.temas], ["Bloques de texto", o.bloques], ["Preguntas", o.preguntas], ["Flashcards", o.flashcards]] as const).map(([t, n]) => (
              <div key={t}>
                <dt className="text-xs text-neutral-500">{t}</dt>
                <dd className="mt-0.5 text-lg font-medium tabular-nums text-ink-text">{n}</dd>
              </div>
            ))}
          </dl>
          {o.temasSinPreguntas.length > 0 && (
            <p className="mt-3 text-xs text-amber-300">
              Sin preguntas: {o.temasSinPreguntas.map((t) => `tema ${t.orden}`).join(", ")}
            </p>
          )}
        </section>
      ))}
    </div>
  );
}

function Tarjeta({ titulo, children }: { titulo?: string; children: ReactNode }) {
  return (
    <section className="rounded-lg border border-ink-divider bg-ink-surface p-5">
      {titulo && <h2 className="mb-3 text-sm font-medium text-ink-text">{titulo}</h2>}
      {children}
    </section>
  );
}

function Campo({ titulo, children }: { titulo: string; children: ReactNode }) {
  return (
    <div>
      <p className="mb-1.5 text-xs text-neutral-500">{titulo}</p>
      {children}
    </div>
  );
}

function Cifra({ valor, texto, pista, tono }: { valor: number; texto: string; pista: string; tono?: "aviso" }) {
  return (
    <div className="rounded-lg border border-ink-divider bg-ink-surface p-4">
      <p className={`text-2xl font-medium tabular-nums ${tono === "aviso" ? "text-amber-300" : "text-ink-text"}`}>{valor}</p>
      <p className="mt-0.5 text-sm text-neutral-300">{texto}</p>
      <p className="mt-1 text-xs text-neutral-500">{pista}</p>
    </div>
  );
}
