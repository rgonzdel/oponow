import { BadRequestException, ConflictException, Injectable, Logger, NotFoundException } from "@nestjs/common";
import { and, count, countDistinct, eq, gte, ilike, ne, sql } from "drizzle-orm";
import { schema } from "@oponow/db";
import { getRequestDb } from "../database/request-context";
import { DEFINICION_ROLES, PERMISOS, ROLES, type Rol } from "../auth/roles";
import type { ListUsuariosQueryDto } from "./dto/list-usuarios-query.dto";
import type { UpdatePlanDto } from "./dto/update-plan.dto";

const DEFAULT_PAGE_SIZE = 20;
// Orden en el panel: de más a menos permisos, y el opositor al final.
const ORDEN_ROLES: Rol[] = ["admin", "soporte", "lectura", "editor", "opositor"];
const DIA_MS = 86_400_000;

/**
 * Panel de administración. Qué filas ve cada rol lo deciden las políticas
 * RLS (usuarios_equipo_read, suscripciones_oposicion_equipo_read y las de
 * contenido con app.current_role); qué rutas puede usar, PermisoGuard.
 */
@Injectable()
export class AdminService {
  private readonly logger = new Logger(AdminService.name);

  async resumen() {
    const db = getRequestDb();
    const ahora = Date.now();
    const [porPlan, porRol, [altas7], [altas30], porEstado] = await Promise.all([
      db.select({ plan: schema.usuarios.plan, n: count() }).from(schema.usuarios).groupBy(schema.usuarios.plan),
      db.select({ rol: schema.usuarios.rol, n: count() }).from(schema.usuarios).groupBy(schema.usuarios.rol),
      db.select({ n: count() }).from(schema.usuarios).where(gte(schema.usuarios.createdAt, new Date(ahora - 7 * DIA_MS))),
      db.select({ n: count() }).from(schema.usuarios).where(gte(schema.usuarios.createdAt, new Date(ahora - 30 * DIA_MS))),
      db
        .select({ estado: schema.suscripcionesOposicion.estado, n: count() })
        .from(schema.suscripcionesOposicion)
        .where(eq(schema.suscripcionesOposicion.activa, true))
        .groupBy(schema.suscripcionesOposicion.estado),
    ]);
    const plan = (p: string) => porPlan.find((x) => x.plan === p)?.n ?? 0;
    const estado = (e: string) => porEstado.find((x) => x.estado === e)?.n ?? 0;
    return {
      usuarios: porPlan.reduce((n, x) => n + x.n, 0),
      porPlan: { free: plan("free"), lite: plan("lite"), vip: plan("vip") },
      equipo: Object.fromEntries(ROLES.filter((r) => r !== "opositor").map((r) => [r, porRol.find((x) => x.rol === r)?.n ?? 0])),
      altas: { dias7: altas7?.n ?? 0, dias30: altas30?.n ?? 0 },
      suscripciones: {
        activas: estado("active"),
        enPrueba: estado("trialing"),
        pagoPendiente: estado("past_due"),
      },
    };
  }

  /** Roles con sus permisos y cuántas personas tienen cada uno. */
  async roles(incluirMiembros: boolean) {
    const db = getRequestDb();
    const recuento = incluirMiembros
      ? await db.select({ rol: schema.usuarios.rol, n: count() }).from(schema.usuarios).groupBy(schema.usuarios.rol)
      : [];
    return {
      permisos: PERMISOS,
      roles: ORDEN_ROLES.map((rol) => ({
          rol,
          ...DEFINICION_ROLES[rol],
          miembros: incluirMiembros ? (recuento.find((x) => x.rol === rol)?.n ?? 0) : null,
        })),
    };
  }

  /** Cuánto contenido hay por oposición (para el equipo de contenido). */
  async contenido() {
    const db = getRequestDb();
    const oposiciones = await db
      .select({ id: schema.oposiciones.id, slug: schema.oposiciones.slug, nombre: schema.oposiciones.nombre })
      .from(schema.oposiciones)
      .orderBy(schema.oposiciones.nombre);
    const [temas, bloques, preguntas, flashcards] = await Promise.all([
      db.select({ op: schema.temas.oposicionId, n: count() }).from(schema.temas).groupBy(schema.temas.oposicionId),
      db
        .select({ op: schema.temas.oposicionId, n: count() })
        .from(schema.bloquesContenido)
        .innerJoin(schema.temas, eq(schema.temas.id, schema.bloquesContenido.temaId))
        .groupBy(schema.temas.oposicionId),
      db
        .select({ op: schema.temas.oposicionId, n: count() })
        .from(schema.preguntas)
        .innerJoin(schema.temas, eq(schema.temas.id, schema.preguntas.temaId))
        .groupBy(schema.temas.oposicionId),
      db
        .select({ op: schema.temas.oposicionId, n: countDistinct(schema.flashcardsTemas.flashcardId) })
        .from(schema.flashcardsTemas)
        .innerJoin(schema.temas, eq(schema.temas.id, schema.flashcardsTemas.temaId))
        .groupBy(schema.temas.oposicionId),
    ]);
    const de = (lista: { op: string; n: number }[], id: string) => lista.find((x) => x.op === id)?.n ?? 0;
    // Temas sin ninguna pregunta: lo primero que conviene completar.
    const temasSinPreguntas = await db
      .select({ op: schema.temas.oposicionId, orden: schema.temas.orden, titulo: schema.temas.titulo })
      .from(schema.temas)
      .where(sql`not exists (select 1 from ${schema.preguntas} p where p.tema_id = ${schema.temas.id})`)
      .orderBy(schema.temas.orden);
    return oposiciones.map((o) => ({
      slug: o.slug,
      nombre: o.nombre,
      temas: de(temas, o.id),
      bloques: de(bloques, o.id),
      preguntas: de(preguntas, o.id),
      flashcards: de(flashcards, o.id),
      temasSinPreguntas: temasSinPreguntas.filter((t) => t.op === o.id).map((t) => ({ orden: t.orden, titulo: t.titulo })),
    }));
  }

  async listUsuarios(query: ListUsuariosQueryDto) {
    const db = getRequestDb();
    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? DEFAULT_PAGE_SIZE;
    const filtros = [
      query.q ? ilike(schema.usuarios.email, `%${query.q}%`) : undefined,
      query.rol ? eq(schema.usuarios.rol, query.rol) : undefined,
    ].filter(Boolean);
    const where = filtros.length ? and(...filtros) : undefined;

    const [usuarios, [{ total }]] = await Promise.all([
      db
        .select({
          id: schema.usuarios.id,
          email: schema.usuarios.email,
          plan: schema.usuarios.plan,
          rol: schema.usuarios.rol,
          planExpira: schema.usuarios.planExpira,
          emailVerified: schema.usuarios.emailVerified,
          createdAt: schema.usuarios.createdAt,
        })
        .from(schema.usuarios)
        .where(where)
        .orderBy(schema.usuarios.createdAt)
        .limit(pageSize)
        .offset((page - 1) * pageSize),
      db.select({ total: count() }).from(schema.usuarios).where(where),
    ]);

    return { usuarios, total, page, pageSize };
  }

  async getUsuario(id: string, conSuscripciones: boolean) {
    const db = getRequestDb();
    const [usuario] = await db
      .select({
        id: schema.usuarios.id,
        email: schema.usuarios.email,
        plan: schema.usuarios.plan,
        rol: schema.usuarios.rol,
        planExpira: schema.usuarios.planExpira,
        emailVerified: schema.usuarios.emailVerified,
        createdAt: schema.usuarios.createdAt,
      })
      .from(schema.usuarios)
      .where(eq(schema.usuarios.id, id))
      .limit(1);
    if (!usuario) throw new NotFoundException("Usuario no encontrado");

    const suscripciones = conSuscripciones
      ? await db
          .select({
            id: schema.suscripcionesOposicion.id,
            oposicionNombre: schema.oposiciones.nombre,
            activa: schema.suscripcionesOposicion.activa,
            estado: schema.suscripcionesOposicion.estado,
            fechaInicio: schema.suscripcionesOposicion.fechaInicio,
            fechaFin: schema.suscripcionesOposicion.fechaFin,
          })
          .from(schema.suscripcionesOposicion)
          .innerJoin(schema.oposiciones, eq(schema.oposiciones.id, schema.suscripcionesOposicion.oposicionId))
          .where(eq(schema.suscripcionesOposicion.usuarioId, id))
      : null;

    return { ...usuario, suscripciones };
  }

  async updatePlan(id: string, dto: UpdatePlanDto) {
    const db = getRequestDb();
    const [usuario] = await db
      .update(schema.usuarios)
      .set({ plan: dto.plan })
      .where(eq(schema.usuarios.id, id))
      .returning({ id: schema.usuarios.id, email: schema.usuarios.email, plan: schema.usuarios.plan });
    if (!usuario) throw new NotFoundException("Usuario no encontrado");
    return usuario;
  }

  /**
   * Asigna un rol. Salvaguardas: nadie cambia su propio rol (no puede
   * quedarse fuera por error) y siempre queda al menos un administrador.
   * El cambio se aplica en la siguiente renovación de su sesión (≤ 15 min).
   */
  async updateRol(actorId: string, id: string, rol: Rol) {
    if (actorId === id) throw new BadRequestException("No puedes cambiar tu propio rol");
    const db = getRequestDb();
    const [actual] = await db
      .select({ rol: schema.usuarios.rol, email: schema.usuarios.email })
      .from(schema.usuarios)
      .where(eq(schema.usuarios.id, id))
      .limit(1);
    if (!actual) throw new NotFoundException("Usuario no encontrado");
    if (actual.rol === "admin" && rol !== "admin") {
      const [{ n }] = await db
        .select({ n: count() })
        .from(schema.usuarios)
        .where(and(eq(schema.usuarios.rol, "admin"), ne(schema.usuarios.id, id)));
      if (n === 0) throw new ConflictException("Tiene que quedar al menos un administrador");
    }
    const [usuario] = await db
      .update(schema.usuarios)
      .set({ rol, esAdmin: rol === "admin" })
      .where(eq(schema.usuarios.id, id))
      .returning({ id: schema.usuarios.id, email: schema.usuarios.email, rol: schema.usuarios.rol });
    this.logger.log(`Rol cambiado por ${actorId}: ${actual.email ?? id} ${actual.rol} → ${rol}`);
    return usuario;
  }
}
