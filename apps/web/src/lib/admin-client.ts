import { apiFetch } from "./api-client";

export type PlanTipo = "free" | "lite" | "vip";

export interface UsuarioResumen {
  id: string;
  email: string;
  plan: PlanTipo;
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
  suscripciones: SuscripcionResumen[];
}

export function listUsuarios(params: { q?: string; page?: number }) {
  const qs = new URLSearchParams();
  if (params.q) qs.set("q", params.q);
  if (params.page) qs.set("page", String(params.page));
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
