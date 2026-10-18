import { useEffect, useState, type ReactNode } from "react";
import { Link, Navigate, useSearchParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../auth/AuthContext";
import { SiteHeader } from "../components/SiteHeader";
import { LoadingScreen } from "../components/LoadingScreen";
import { buttonClass } from "../components/button";
import { ApiError } from "../lib/api-client";
import {
  crearCuentaPrueba,
  updateAcceso,
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

const PLAN_LABEL: Record<PlanTipo, string> = { free: "Gratis", lite: "Lite", vip: "VIP", prueba: "Prueba y testeo" };
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
const fechaHora = (iso: string) =>
  new Date(iso).toLocaleString("es-ES", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
const caducada = (iso: string | null) => !!iso && new Date(iso).getTime() <= Date.now();
/** Valor para un <input type="datetime-local"> en la hora local del navegador. */
const aInputLocal = (d: Date) => {
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`;
};
const DURACIONES = [1, 3, 7, 15, 30, 90] as const;

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
  const [creando, setCreando] = useState(false);

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
            placeholder="Buscar por email o usuario…"
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
          {permisos.includes("crear_usuarios") && (
            <button type="button" onClick={() => setCreando((v) => !v)} className={buttonClass(creando ? "ghost" : "primary")}>
              {creando ? "Cerrar" : "Nueva cuenta de prueba"}
            </button>
          )}
        </div>
        {creando && (
          <NuevaCuentaPrueba
            onCreada={(id) => {
              setSeleccionado(id);
              queryClient.invalidateQueries({ queryKey: ["admin"] });
            }}
          />
        )}
        <div className="mt-3 overflow-x-auto rounded-lg border border-ink-divider">
          <table className="w-full text-left text-sm">
            <thead className="bg-ink-surface text-xs text-neutral-500">
              <tr>
                <th className="px-4 py-2 font-medium">Email o usuario</th>
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
                  <td className="max-w-[220px] truncate px-4 py-2.5 text-ink-text">{u.email ?? u.usuario ?? "(sin email)"}</td>
                  <td className="px-4 py-2.5 text-neutral-300">
                    {PLAN_LABEL[u.plan]}
                    {u.accesoExpira && (
                      <span className={`block text-[11px] ${caducada(u.accesoExpira) ? "text-red-400" : "text-neutral-500"}`}>
                        {caducada(u.accesoExpira) ? "Caducada" : `Hasta ${fecha(u.accesoExpira)}`}
                      </span>
                    )}
                  </td>
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
      <p className="break-all text-sm font-medium text-ink-text">{u.email ?? u.usuario ?? "(sin email)"}</p>
      <p className="mt-1 text-xs text-neutral-500">
        Alta el {fecha(u.createdAt)} ·{" "}
        {u.email ? (u.emailVerified ? "email verificado" : "email sin verificar") : u.usuario ? "entra con usuario y contraseña" : "sin email"}
      </p>

      <div className="mt-4 space-y-4">
        {u.plan === "prueba" && (
          <CaducidadCuenta key={u.accesoExpira ?? ""} usuarioId={id} accesoExpira={u.accesoExpira} editable={permisos.includes("crear_usuarios")} onCambio={onCambio} />
        )}
        <Campo titulo="Plan">
          {permisos.includes("cambiar_plan") ? (
            <div className="flex gap-2">
              <select value={plan} onChange={(e) => { setPlan(e.target.value as PlanTipo); cambiarPlan.reset(); }} className="flex-1 rounded-md border border-ink-divider bg-ink px-2 py-1.5 text-sm text-ink-text outline-none focus:border-accent">
                {/* "Prueba y testeo" solo se da al crear la cuenta (necesita usuario y caducidad). */}
                {(Object.keys(PLAN_LABEL) as PlanTipo[])
                  .filter((p) => p !== "prueba" || u.plan === "prueba")
                  .map((p) => <option key={p} value={p}>{PLAN_LABEL[p]}</option>)}
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

/**
 * Alta de una cuenta de prueba y testeo: usuario corto y contraseña (sin
 * email), oposiciones con acceso completo y fecha de caducidad. No paga nada.
 */
function NuevaCuentaPrueba({ onCreada }: { onCreada: (id: string) => void }) {
  const catalogo = useQuery({ queryKey: ["admin", "oposiciones"], queryFn: listOposiciones });
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [oposiciones, setOposiciones] = useState<string[]>([]);
  const [duracion, setDuracion] = useState("7");
  const [fechaLibre, setFechaLibre] = useState(() => aInputLocal(new Date(Date.now() + 7 * 86_400_000)));
  const [creada, setCreada] = useState<{ usuario: string; password: string; expira: string } | null>(null);

  const expira = duracion === "otra" ? new Date(fechaLibre) : new Date(Date.now() + Number(duracion) * 86_400_000);
  const usuarioValido = /^[a-z0-9._-]{3,30}$/.test(usuario);
  const listo = usuarioValido && password.length >= 8 && !Number.isNaN(expira.getTime()) && expira.getTime() > Date.now();

  const crear = useMutation({
    mutationFn: () => crearCuentaPrueba({ usuario, password, oposicionIds: oposiciones, accesoExpira: expira.toISOString() }),
    onSuccess: (datos) => {
      setCreada({ usuario, password, expira: datos.accesoExpira ?? expira.toISOString() });
      setUsuario("");
      setPassword("");
      setOposiciones([]);
      onCreada(datos.id);
    },
  });

  function generarContrasena() {
    const letras = "abcdefghjkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    const azar = crypto.getRandomValues(new Uint32Array(10));
    setPassword(Array.from(azar, (n) => letras[n % letras.length]).join(""));
    crear.reset();
  }

  const campo = "w-full rounded-md border border-ink-divider bg-ink px-2 py-1.5 text-sm text-ink-text outline-none focus:border-accent";

  return (
    <section className="mt-3 rounded-lg border border-accent/40 bg-ink-surface p-5">
      <h2 className="text-sm font-medium text-ink-text">Nueva cuenta de prueba y testeo</h2>
      <p className="mt-1 text-xs text-neutral-500">
        Entra con usuario y contraseña, sin email. No paga nada y deja de poder entrar cuando caduca.
      </p>
      <form
        className="mt-4 space-y-4"
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          if (listo) crear.mutate();
        }}
      >
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1.5 block text-xs text-neutral-400">Usuario</span>
            <input
              value={usuario}
              onChange={(e) => { setUsuario(e.target.value.trim().toLowerCase()); crear.reset(); }}
              autoComplete="off"
              autoCapitalize="none"
              spellCheck={false}
              maxLength={30}
              placeholder="p. ej. prueba1"
              className={campo}
            />
            {usuario && !usuarioValido && (
              <span className="mt-1 block text-xs text-amber-300">3-30 caracteres: letras, números, punto, guion o guion bajo.</span>
            )}
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs text-neutral-400">Contraseña</span>
            <span className="flex gap-2">
              <input
                value={password}
                onChange={(e) => { setPassword(e.target.value); crear.reset(); }}
                autoComplete="new-password"
                spellCheck={false}
                maxLength={72}
                className={campo}
              />
              <button type="button" onClick={generarContrasena} className={buttonClass("ghost")}>Generar</button>
            </span>
            {password && password.length < 8 && <span className="mt-1 block text-xs text-amber-300">Mínimo 8 caracteres.</span>}
          </label>
        </div>

        <fieldset>
          <legend className="mb-1.5 text-xs text-neutral-400">Oposiciones con acceso completo</legend>
          {catalogo.isLoading ? (
            <p className="text-sm text-neutral-500">Cargando…</p>
          ) : (
            <div className="grid gap-1.5 sm:grid-cols-2">
              {(catalogo.data ?? []).map((o) => (
                <label key={o.id} className="flex items-center gap-2 text-sm text-ink-text">
                  <input
                    type="checkbox"
                    checked={oposiciones.includes(o.id)}
                    onChange={(e) => setOposiciones((prev) => (e.target.checked ? [...prev, o.id] : prev.filter((x) => x !== o.id)))}
                    className="accent-accent"
                  />
                  {o.nombre}
                </label>
              ))}
            </div>
          )}
        </fieldset>

        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1.5 block text-xs text-neutral-400">Caduca</span>
            <select value={duracion} onChange={(e) => setDuracion(e.target.value)} className={campo}>
              {DURACIONES.map((d) => <option key={d} value={String(d)}>Dentro de {d} {d === 1 ? "día" : "días"}</option>)}
              <option value="otra">Elegir fecha y hora…</option>
            </select>
          </label>
          {duracion === "otra" ? (
            <label className="block">
              <span className="mb-1.5 block text-xs text-neutral-400">Fecha y hora de caducidad</span>
              <input type="datetime-local" value={fechaLibre} min={aInputLocal(new Date())} onChange={(e) => setFechaLibre(e.target.value)} className={campo} />
            </label>
          ) : (
            <p className="self-end pb-2 text-xs text-neutral-500">Hasta el {fechaHora(expira.toISOString())}</p>
          )}
        </div>

        {crear.isError && <p className="text-xs text-red-400">{mensaje(crear.error, "No se ha podido crear la cuenta")}</p>}
        <button type="submit" disabled={!listo || crear.isPending} className={buttonClass("primary")}>
          {crear.isPending ? "Creando…" : "Crear cuenta"}
        </button>
      </form>

      {creada && (
        <div className="mt-4 rounded-md border border-green-500/40 bg-green-500/10 p-3 text-sm text-neutral-300">
          <p className="font-medium text-green-400">Cuenta creada. Pásale estos datos para entrar:</p>
          <dl className="mt-2 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1">
            <dt className="text-neutral-500">Usuario</dt>
            <dd className="font-mono text-ink-text">{creada.usuario}</dd>
            <dt className="text-neutral-500">Contraseña</dt>
            <dd className="break-all font-mono text-ink-text">{creada.password}</dd>
            <dt className="text-neutral-500">Caduca</dt>
            <dd className="text-ink-text">{fechaHora(creada.expira)}</dd>
          </dl>
          <p className="mt-2 text-xs text-neutral-500">La contraseña no se vuelve a mostrar: cópiala ahora.</p>
        </div>
      )}
    </section>
  );
}

/** Caducidad de una cuenta de prueba, con opción de alargarla o adelantarla. */
function CaducidadCuenta({
  usuarioId,
  accesoExpira,
  editable,
  onCambio,
}: {
  usuarioId: string;
  accesoExpira: string | null;
  editable: boolean;
  onCambio: () => void;
}) {
  const queryClient = useQueryClient();
  const [valor, setValor] = useState(() => aInputLocal(accesoExpira ? new Date(accesoExpira) : new Date(Date.now() + 7 * 86_400_000)));
  const guardar = useMutation({
    mutationFn: () => updateAcceso(usuarioId, new Date(valor).toISOString()),
    onSuccess: (datos) => {
      queryClient.setQueryData(["admin", "usuario", usuarioId], datos);
      onCambio();
    },
  });
  const vencida = caducada(accesoExpira);

  return (
    <Campo titulo="Caducidad de la cuenta">
      <p className={`text-sm ${vencida ? "text-red-400" : "text-ink-text"}`}>
        {accesoExpira ? `${vencida ? "Caducó el" : "Hasta el"} ${fechaHora(accesoExpira)}` : "Sin caducidad"}
      </p>
      {editable && (
        <>
          <div className="mt-2 flex gap-2">
            <input
              type="datetime-local"
              value={valor}
              min={aInputLocal(new Date())}
              onChange={(e) => { setValor(e.target.value); guardar.reset(); }}
              aria-label="Nueva fecha de caducidad"
              className="min-w-0 flex-1 rounded-md border border-ink-divider bg-ink px-2 py-1.5 text-sm text-ink-text outline-none focus:border-accent"
            />
            <button type="button" disabled={!valor || guardar.isPending} onClick={() => guardar.mutate()} className={buttonClass("primary")}>
              Guardar
            </button>
          </div>
          {guardar.isError && <p className="mt-1 text-xs text-red-400">{mensaje(guardar.error, "No se ha podido cambiar la caducidad")}</p>}
        </>
      )}
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
