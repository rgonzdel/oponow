import { Injectable, NotFoundException } from "@nestjs/common";
import { count, eq, ilike } from "drizzle-orm";
import { schema } from "@oponow/db";
import { getRequestDb } from "../database/request-context";
import type { ListUsuariosQueryDto } from "./dto/list-usuarios-query.dto";
import type { UpdatePlanDto } from "./dto/update-plan.dto";

const DEFAULT_PAGE_SIZE = 20;

@Injectable()
export class AdminService {
  /**
   * Ve TODAS las filas de usuarios (no solo la propia) gracias a la
   * política RLS usuarios_admin_read, activa cuando app.is_admin='true'
   * (fijado por RlsContextMiddleware a partir de usuarios.es_admin en el
   * JWT). No necesita bypass ni un rol de Postgres aparte.
   */
  async listUsuarios(query: ListUsuariosQueryDto) {
    const db = getRequestDb();
    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? DEFAULT_PAGE_SIZE;
    const where = query.q ? ilike(schema.usuarios.email, `%${query.q}%`) : undefined;

    const [usuarios, [{ total }]] = await Promise.all([
      db
        .select({
          id: schema.usuarios.id,
          email: schema.usuarios.email,
          plan: schema.usuarios.plan,
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

  async getUsuario(id: string) {
    const db = getRequestDb();
    const [usuario] = await db
      .select({
        id: schema.usuarios.id,
        email: schema.usuarios.email,
        plan: schema.usuarios.plan,
        planExpira: schema.usuarios.planExpira,
        emailVerified: schema.usuarios.emailVerified,
        createdAt: schema.usuarios.createdAt,
      })
      .from(schema.usuarios)
      .where(eq(schema.usuarios.id, id))
      .limit(1);
    if (!usuario) throw new NotFoundException("Usuario no encontrado");

    const suscripciones = await db
      .select({
        id: schema.suscripcionesOposicion.id,
        oposicionNombre: schema.oposiciones.nombre,
        activa: schema.suscripcionesOposicion.activa,
        estado: schema.suscripcionesOposicion.estado,
        fechaInicio: schema.suscripcionesOposicion.fechaInicio,
        fechaFin: schema.suscripcionesOposicion.fechaFin,
      })
      .from(schema.suscripcionesOposicion)
      .innerJoin(
        schema.oposiciones,
        eq(schema.oposiciones.id, schema.suscripcionesOposicion.oposicionId),
      )
      .where(eq(schema.suscripcionesOposicion.usuarioId, id));

    return { ...usuario, suscripciones };
  }

  async updatePlan(id: string, dto: UpdatePlanDto) {
    const db = getRequestDb();
    const [usuario] = await db
      .update(schema.usuarios)
      .set({ plan: dto.plan })
      .where(eq(schema.usuarios.id, id))
      .returning({
        id: schema.usuarios.id,
        email: schema.usuarios.email,
        plan: schema.usuarios.plan,
      });
    if (!usuario) throw new NotFoundException("Usuario no encontrado");
    return usuario;
  }
}
