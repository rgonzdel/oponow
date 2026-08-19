import { Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { eq } from "drizzle-orm";
import { schema } from "@oponow/db";
import { getRequestDb } from "../database/request-context";
import { renderContent } from "./watermark.util";
import { generarTemaPdf } from "./pdf/temario-pdf.util";

export interface TemaSummary {
  id: string;
  orden: number;
  titulo: string;
  esGratuito: boolean;
}

export interface BloqueSummary {
  id: string;
  orden: number;
}

export interface BloqueContenido {
  id: string;
  orden: number;
  contenidoHtml: string;
}

@Injectable()
export class TemarioService {
  /**
   * La lista solo contiene los temas que la política RLS `temas_visibles`
   * deja pasar para el plan/suscripción del usuario actual — un free-plan
   * nunca ve aquí un tema no gratuito, no porque el servicio lo filtre,
   * sino porque la fila ni siquiera llega desde Postgres.
   */
  async listTemas(oposicionSlug: string): Promise<TemaSummary[]> {
    const db = getRequestDb();

    const [oposicion] = await db
      .select({ id: schema.oposiciones.id })
      .from(schema.oposiciones)
      .where(eq(schema.oposiciones.slug, oposicionSlug))
      .limit(1);
    if (!oposicion) throw new NotFoundException("Oposición no encontrada");

    return db
      .select({
        id: schema.temas.id,
        orden: schema.temas.orden,
        titulo: schema.temas.titulo,
        esGratuito: schema.temas.esGratuito,
      })
      .from(schema.temas)
      .where(eq(schema.temas.oposicionId, oposicion.id))
      .orderBy(schema.temas.orden);
  }

  async listBloques(temaId: string): Promise<BloqueSummary[]> {
    const db = getRequestDb();
    return db
      .select({ id: schema.bloquesContenido.id, orden: schema.bloquesContenido.orden })
      .from(schema.bloquesContenido)
      .where(eq(schema.bloquesContenido.temaId, temaId))
      .orderBy(schema.bloquesContenido.orden);
  }

  async getBloque(
    bloqueId: string,
    userId: string,
    ip: string,
  ): Promise<BloqueContenido> {
    const db = getRequestDb();

    // Si el bloque no es visible para el plan/suscripción actual, la
    // política RLS `bloques_contenido_visibles` ya lo excluye del SELECT
    // — llega aquí como "no encontrado" indistinguible de "no existe",
    // que es justo lo que queremos (no revelar qué contenido de pago hay
    // detrás del muro).
    const [bloque] = await db
      .select({ id: schema.bloquesContenido.id, orden: schema.bloquesContenido.orden, contenido: schema.bloquesContenido.contenido })
      .from(schema.bloquesContenido)
      .where(eq(schema.bloquesContenido.id, bloqueId))
      .limit(1);
    if (!bloque) throw new NotFoundException("Contenido no encontrado");

    const [user] = await db
      .select({ email: schema.usuarios.email })
      .from(schema.usuarios)
      .where(eq(schema.usuarios.id, userId))
      .limit(1);
    if (!user) throw new UnauthorizedException();

    // Registro interno de acceso (no visible en el contenido servido).
    await db.insert(schema.sesionesLectura).values({
      usuarioId: userId,
      bloqueId: bloque.id,
      ip,
      emailSnapshot: user.email,
      timestamp: new Date(),
    });

    return {
      id: bloque.id,
      orden: bloque.orden,
      contenidoHtml: renderContent(bloque.contenido),
    };
  }

  /**
   * PDF del tema completo (todos sus bloques, en orden) para el visor de
   * apps/web. Misma protección que getBloque: si el tema/sus bloques no
   * son visibles para el plan/suscripción actual, las políticas RLS
   * `temas_visibles`/`bloques_contenido_visibles` ya los excluyen de los
   * SELECT — de ahí que un tema sin filas se trate como "no encontrado".
   * No lleva marca de agua personal (email/IP) a propósito.
   */
  async getTemaPdf(temaId: string, userId: string, ip: string): Promise<Buffer> {
    const db = getRequestDb();

    const [tema] = await db
      .select({
        titulo: schema.temas.titulo,
        oposicionId: schema.temas.oposicionId,
      })
      .from(schema.temas)
      .where(eq(schema.temas.id, temaId))
      .limit(1);
    if (!tema) throw new NotFoundException("Tema no encontrado");

    const [oposicion] = await db
      .select({ nombre: schema.oposiciones.nombre })
      .from(schema.oposiciones)
      .where(eq(schema.oposiciones.id, tema.oposicionId))
      .limit(1);

    const bloques = await db
      .select({ id: schema.bloquesContenido.id, contenido: schema.bloquesContenido.contenido })
      .from(schema.bloquesContenido)
      .where(eq(schema.bloquesContenido.temaId, temaId))
      .orderBy(schema.bloquesContenido.orden);
    if (bloques.length === 0) throw new NotFoundException("Contenido no encontrado");

    const [user] = await db
      .select({ email: schema.usuarios.email })
      .from(schema.usuarios)
      .where(eq(schema.usuarios.id, userId))
      .limit(1);
    if (!user) throw new UnauthorizedException();

    // Registro interno de acceso (auditoría), uno por bloque servido —
    // igual que getBloque, aunque el PDF no lleve marca de agua visible.
    await db.insert(schema.sesionesLectura).values(
      bloques.map((b) => ({
        usuarioId: userId,
        bloqueId: b.id,
        ip,
        emailSnapshot: user.email,
        timestamp: new Date(),
      })),
    );

    return generarTemaPdf({
      oposicionNombre: oposicion?.nombre ?? "",
      temaTitulo: tema.titulo,
      bloques: bloques.map((b) => b.contenido),
    });
  }
}
