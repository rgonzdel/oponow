import { apiFetch } from "./api-client";

export type PlanTipo = "free" | "lite" | "vip";
// Refleja apps/api/src/auth/roles.ts.
export type Rol = "opositor" | "admin" | "editor" | "soporte" | "lectura" | "contabilidad";
export type Permiso =
  | "panel"
  | "ver_estadisticas"
  | "ver_usuarios"
  | "ver_suscripciones"
  | "cambiar_plan"
  | "asignar_roles"
  | "ver_contenido"
  | "ver_contabilidad";

export interface UsuarioResumen {
  id: string;
  email: string | null;
  plan: PlanTipo;
  rol: Rol;
  planExpira: string | null;
  emailVerified: boolean;
  createdAt: string;
}

export interface UsuariosPagina {
  usuarios: UsuarioResumen[];
  total: number;
  page: number;
  pageSize: number;
}

export interface SuscripcionResumen {
  id: string;
  oposicionNombre: string;
  activa: boolean;
  estado: string;
  fechaInicio: string;
  fechaFin: string | null;
}

export interface UsuarioDetalle extends UsuarioResumen {
  /** null si el rol no permite ver suscripciones. */
  suscripciones: SuscripcionResumen[] | null;
}

export interface ResumenPanel {
  usuarios: number;
  porPlan: Record<PlanTipo, number>;
  equipo: Record<Exclude<Rol, "opositor">, number>;
  altas: { dias7: number; dias30: number };
  suscripciones: { activas: number; enPrueba: number; pagoPendiente: number };
}

export interface RolesPanel {
  permisos: Record<Permiso, string>;
  roles: { rol: Rol; nombre: string; descripcion: string; permisos: Permiso[]; miembros: number | null }[];
}

export interface ContenidoOposicion {
  slug: string;
  nombre: string;
  temas: number;
  bloques: number;
  preguntas: number;
  flashcards: number;
  temasSinPreguntas: { orden: number; titulo: string }[];
}

export function listUsuarios(params: { q?: string; page?: number; rol?: Rol }) {
  const qs = new URLSearchParams();
  if (params.q) qs.set("q", params.q);
  if (params.page) qs.set("page", String(params.page));
  if (params.rol) qs.set("rol", params.rol);
  const suffix = qs.toString() ? `?${qs.toString()}` : "";
  return apiFetch<UsuariosPagina>(`/admin/usuarios${suffix}`);
}

export function getUsuario(id: string) {
  return apiFetch<UsuarioDetalle>(`/admin/usuarios/${id}`);
}

export function updatePlan(id: string, plan: PlanTipo) {
  return apiFetch<UsuarioResumen>(`/admin/usuarios/${id}/plan`, {
    method: "PATCH",
    body: JSON.stringify({ plan }),
  });
}

export function updateRol(id: string, rol: Rol) {
  return apiFetch<{ id: string; email: string | null; rol: Rol }>(`/admin/usuarios/${id}/rol`, {
    method: "PATCH",
    body: JSON.stringify({ rol }),
  });
}

export function getResumen() {
  return apiFetch<ResumenPanel>("/admin/resumen");
}

export function getRoles() {
  return apiFetch<RolesPanel>("/admin/roles");
}

export function getContenido() {
  return apiFetch<ContenidoOposicion[]>("/admin/contenido");
}
