import { Injectable, NotFoundException } from "@nestjs/common";
import { eq } from "drizzle-orm";
import { schema } from "@oponow/db";
import { getRequestDb } from "../database/request-context";
import { GoogleCalendarService } from "./google/google-calendar.service";
import type { CreateTareaDto } from "./dto/create-tarea.dto";
import type { UpdateTareaDto } from "./dto/update-tarea.dto";

@Injectable()
export class AgendaService {
  constructor(private readonly googleCalendarService: GoogleCalendarService) {}

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

    await this.googleCalendarService.syncCreate(userId, tarea);
    return tarea;
  }

  async updateTarea(userId: string, id: string, dto: UpdateTareaDto) {
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

    await this.googleCalendarService.syncUpdate(userId, tarea);
    return tarea;
  }

  async deleteTarea(userId: string, id: string): Promise<void> {
    const db = getRequestDb();
    const [tarea] = await db
      .delete(schema.tareasAgenda)
      .where(eq(schema.tareasAgenda.id, id))
      .returning({ googleEventId: schema.tareasAgenda.googleEventId });
    if (!tarea) throw new NotFoundException("Tarea no encontrada");

    await this.googleCalendarService.syncDelete(userId, tarea.googleEventId);
  }
}
