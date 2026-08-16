import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { eq } from "drizzle-orm";
import { createDb, schema, type Database, type Sql } from "@oponow/db";
import { AUTH_DATABASE_POOL } from "../database/database.module";
import { getRequestDb } from "../database/request-context";
import { generarFeedIcs } from "./ics.util";
import type { CreateTareaDto } from "./dto/create-tarea.dto";
import type { UpdateTareaDto } from "./dto/update-tarea.dto";

@Injectable()
export class AgendaService {
  private readonly authDb: Database;

  constructor(
    private readonly configService: ConfigService,
    @Inject(AUTH_DATABASE_POOL) authPool: Sql,
  ) {
    this.authDb = createDb(authPool);
  }

  async listTareas(userId: string) {
    const db = getRequestDb();
    return db
      .select()
      .from(schema.tareasAgenda)
      .where(eq(schema.tareasAgenda.usuarioId, userId))
      .orderBy(schema.tareasAgenda.fecha);
  }

  async createTarea(userId: string, dto: CreateTareaDto) {
    const db = getRequestDb();
    const [tarea] = await db
      .insert(schema.tareasAgenda)
      .values({
        usuarioId: userId,
        titulo: dto.titulo,
        descripcion: dto.descripcion ?? null,
        fecha: new Date(dto.fecha),
      })
      .returning();
    return tarea;
  }

  async updateTarea(id: string, dto: UpdateTareaDto) {
    const db = getRequestDb();
    // RLS (tareas_agenda_self) restringe el UPDATE a las filas del usuario
    // actual — si el id no es suyo (o no existe), esto afecta 0 filas.
    const [tarea] = await db
      .update(schema.tareasAgenda)
      .set({
        ...(dto.titulo !== undefined && { titulo: dto.titulo }),
        ...(dto.descripcion !== undefined && { descripcion: dto.descripcion }),
        ...(dto.fecha !== undefined && { fecha: new Date(dto.fecha) }),
        ...(dto.completada !== undefined && { completada: dto.completada }),
      })
      .where(eq(schema.tareasAgenda.id, id))
      .returning();
    if (!tarea) throw new NotFoundException("Tarea no encontrada");
    return tarea;
  }

  async deleteTarea(id: string): Promise<void> {
    const db = getRequestDb();
    const [tarea] = await db
      .delete(schema.tareasAgenda)
      .where(eq(schema.tareasAgenda.id, id))
      .returning({ id: schema.tareasAgenda.id });
    if (!tarea) throw new NotFoundException("Tarea no encontrada");
  }

  async getFeedUrl(userId: string): Promise<{ url: string }> {
    const db = getRequestDb();
    const [user] = await db
      .select({ token: schema.usuarios.agendaFeedToken })
      .from(schema.usuarios)
      .where(eq(schema.usuarios.id, userId))
      .limit(1);
    if (!user) throw new NotFoundException("Usuario no encontrado");

    const baseUrl = this.configService.get<string>(
      "PUBLIC_API_URL",
      "http://localhost:3000",
    );
    return { url: `${baseUrl}/agenda/feed/${user.token}.ics` };
  }

  /**
   * Sin JWT: la llamada un cliente de calendario (Google/Apple), que no
   * manda cabeceras de autorización al suscribirse a una URL. La identidad
   * se resuelve por el token opaco vía el rol auth_service — mismo patrón
   * que login/refresh (ver auth.service.ts) — y de ahí en adelante se lee
   * con la política tareas_agenda_auth_service.
   */
  async getFeedIcs(token: string): Promise<string> {
    const [user] = await this.authDb
      .select({ id: schema.usuarios.id })
      .from(schema.usuarios)
      .where(eq(schema.usuarios.agendaFeedToken, token))
      .limit(1);
    if (!user) throw new NotFoundException("Feed no encontrado");

    const tareas = await this.authDb
      .select()
      .from(schema.tareasAgenda)
      .where(eq(schema.tareasAgenda.usuarioId, user.id))
      .orderBy(schema.tareasAgenda.fecha);

    return generarFeedIcs(tareas);
  }
}
