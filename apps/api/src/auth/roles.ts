// Roles de Oponow y lo que puede hacer cada uno. Fuente única: la API los
// aplica (PermisoGuard) y el panel los muestra (GET /admin/roles). Las
// políticas RLS (packages/db/src/rls/policies.sql) refuerzan lo esencial
// con app.current_role.

export const ROLES = ["opositor", "admin", "editor", "soporte", "lectura", "contabilidad"] as const;
export type Rol = (typeof ROLES)[number];

export const PERMISOS = {
  panel: "Entrar en el panel de administración",
  ver_estadisticas: "Ver las estadísticas de usuarios y suscripciones",
  ver_usuarios: "Ver la lista de usuarios y su ficha",
  ver_suscripciones: "Ver las suscripciones de cada usuario",
  cambiar_plan: "Cambiar el plan de un usuario",
  asignar_roles: "Asignar y quitar roles del equipo",
  asignar_oposiciones: "Dar o quitar a un usuario el acceso a una oposición sin pasar por el pago",
  ver_contenido: "Acceso completo al temario, tests y flashcards de todas las oposiciones",
  ver_contabilidad: "Ver la contabilidad: ventas, comisiones, IVA e ingresos previstos (Stripe)",
} as const;
export type Permiso = keyof typeof PERMISOS;

export const DEFINICION_ROLES: Record<Rol, { nombre: string; descripcion: string; permisos: Permiso[] }> = {
  admin: {
    nombre: "Administrador",
    descripcion: "Acceso total: usuarios, planes, roles, oposiciones asignadas y contenido.",
    permisos: ["panel", "ver_estadisticas", "ver_usuarios", "ver_suscripciones", "cambiar_plan", "asignar_roles", "asignar_oposiciones", "ver_contenido", "ver_contabilidad"],
  },
  soporte: {
    nombre: "Soporte",
    descripcion: "Atiende a los opositores: ve usuarios y suscripciones y puede cambiar planes.",
    permisos: ["panel", "ver_estadisticas", "ver_usuarios", "ver_suscripciones", "cambiar_plan"],
  },
  lectura: {
    nombre: "Solo lectura",
    descripcion: "Consulta estadísticas, usuarios y suscripciones sin poder cambiar nada.",
    permisos: ["panel", "ver_estadisticas", "ver_usuarios", "ver_suscripciones"],
  },
  contabilidad: {
    nombre: "Contabilidad",
    descripcion: "Consulta las ventas, comisiones, IVA e ingresos previstos de Stripe. No ve datos personales de los usuarios.",
    permisos: ["panel", "ver_contabilidad"],
  },
  editor: {
    nombre: "Editor de contenido",
    descripcion: "Revisa el temario, los tests y las flashcards de todas las oposiciones. No ve datos de usuarios ni pagos.",
    permisos: ["panel", "ver_contenido"],
  },
  opositor: {
    nombre: "Opositor",
    descripcion: "Usuario normal de Oponow.",
    permisos: [],
  },
};

export function esRol(valor: unknown): valor is Rol {
  return typeof valor === "string" && (ROLES as readonly string[]).includes(valor);
}

export function permisosDe(rol: Rol): Permiso[] {
  return DEFINICION_ROLES[rol].permisos;
}
