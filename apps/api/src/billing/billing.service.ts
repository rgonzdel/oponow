import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { and, eq } from "drizzle-orm";
import { schema } from "@oponow/db";
import { getRequestDb } from "../database/request-context";
import { PAYMENT_GATEWAY, type PaymentGateway } from "./gateway/payment-gateway";
import type { SubscribeDto } from "./dto/subscribe.dto";

const TRIAL_DAYS = 7;

export interface SubscriptionStatus {
  oposicionSlug: string;
  oposicionNombre: string;
  subscribed: boolean;
  estado: string | null;
  trialEndsAt: Date | null;
}

@Injectable()
export class BillingService {
  constructor(
    @Inject(PAYMENT_GATEWAY) private readonly gateway: PaymentGateway,
  ) {}

  async listActive(userId: string): Promise<SubscriptionStatus[]> {
    const db = getRequestDb();

    const rows = await db
      .select({
        oposicionSlug: schema.oposiciones.slug,
        oposicionNombre: schema.oposiciones.nombre,
        estado: schema.suscripcionesOposicion.estado,
        trialEndsAt: schema.suscripcionesOposicion.trialEndsAt,
      })
      .from(schema.suscripcionesOposicion)
      .innerJoin(
        schema.oposiciones,
        eq(schema.oposiciones.id, schema.suscripcionesOposicion.oposicionId),
      )
      .where(
        and(
          eq(schema.suscripcionesOposicion.usuarioId, userId),
          eq(schema.suscripcionesOposicion.activa, true),
        ),
      );

    return rows.map((row) => ({ ...row, subscribed: true }));
  }

  async getStatus(
    userId: string,
    oposicionSlug: string,
  ): Promise<SubscriptionStatus> {
    const db = getRequestDb();
    const oposicion = await this.findOposicionBySlug(oposicionSlug);

    const [sub] = await db
      .select({
        activa: schema.suscripcionesOposicion.activa,
        estado: schema.suscripcionesOposicion.estado,
        trialEndsAt: schema.suscripcionesOposicion.trialEndsAt,
      })
      .from(schema.suscripcionesOposicion)
      .where(
        and(
          eq(schema.suscripcionesOposicion.usuarioId, userId),
          eq(schema.suscripcionesOposicion.oposicionId, oposicion.id),
        ),
      )
      .limit(1);

    return {
      oposicionSlug,
      oposicionNombre: oposicion.nombre,
      subscribed: sub?.activa ?? false,
      estado: sub?.estado ?? null,
      trialEndsAt: sub?.trialEndsAt ?? null,
    };
  }

  async subscribeWithTrial(
    userId: string,
    dto: SubscribeDto,
  ): Promise<SubscriptionStatus> {
    const db = getRequestDb();

    const [user] = await db
      .select({ email: schema.usuarios.email, plan: schema.usuarios.plan })
      .from(schema.usuarios)
      .where(eq(schema.usuarios.id, userId))
      .limit(1);
    if (!user) throw new UnauthorizedException();

    const oposicion = await this.findOposicionBySlug(dto.oposicionSlug);

    const [existing] = await db
      .select()
      .from(schema.suscripcionesOposicion)
      .where(
        and(
          eq(schema.suscripcionesOposicion.usuarioId, userId),
          eq(schema.suscripcionesOposicion.oposicionId, oposicion.id),
        ),
      )
      .limit(1);

    if (existing?.activa) {
      throw new ConflictException("Ya tienes esta oposición activa");
    }

    // La pasarela (hoy MockPaymentGateway, mañana Stripe) valida y "cobra"
    // la tarjeta antes de que activemos nada — así el orden de operaciones
    // ya es el correcto para cuando esto hable con Stripe de verdad.
    const { externalSubscriptionId, trialEndsAt } =
      await this.gateway.chargeAndSubscribe({
        customerId: userId,
        customerEmail: user.email,
        planLabel: `Oponow LITE — ${oposicion.nombre}`,
        trialDays: TRIAL_DAYS,
        cardNumber: dto.cardNumber,
        cardExpiry: dto.cardExpiry,
        cardCvc: dto.cardCvc,
        cardName: dto.cardName,
      });

    if (existing) {
      await db
        .update(schema.suscripcionesOposicion)
        .set({
          activa: true,
          estado: "trialing",
          trialEndsAt,
          fechaInicio: new Date(),
          fechaFin: null,
          stripeSubscriptionId: externalSubscriptionId,
        })
        .where(eq(schema.suscripcionesOposicion.id, existing.id));
    } else {
      await db.insert(schema.suscripcionesOposicion).values({
        usuarioId: userId,
        oposicionId: oposicion.id,
        activa: true,
        estado: "trialing",
        trialEndsAt,
        stripeSubscriptionId: externalSubscriptionId,
      });
    }

    // VIP ya incluye todas las oposiciones — no lo degradamos a LITE.
    if (user.plan === "free") {
      await db
        .update(schema.usuarios)
        .set({ plan: "lite" })
        .where(eq(schema.usuarios.id, userId));
    }

    return {
      oposicionSlug: dto.oposicionSlug,
      oposicionNombre: oposicion.nombre,
      subscribed: true,
      estado: "trialing",
      trialEndsAt,
    };
  }

  private async findOposicionBySlug(slug: string) {
    const db = getRequestDb();
    const [oposicion] = await db
      .select({ id: schema.oposiciones.id, nombre: schema.oposiciones.nombre })
      .from(schema.oposiciones)
      .where(eq(schema.oposiciones.slug, slug))
      .limit(1);

    if (!oposicion) {
      throw new NotFoundException("Oposición no encontrada");
    }
    return oposicion;
  }
}
