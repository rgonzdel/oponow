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
import { StripeBillingService } from "./stripe-billing.service";

const TRIAL_DAYS = 7;
// Mismos precios que packages/shared-types/src/pricing.ts (PLAN_PRECIO), en
// céntimos. Si cambian allí, cambiarlos aquí.
const PRECIO_CENTIMOS = { mensual: 499, anual: 3999 } as const;

export type MetodoPago =
  | { tipo: "tarjeta"; marca: string | null; ultimos4: string | null; caducidad: string | null }
  | { tipo: "bizum"; telefonoUltimos: string | null };

export interface SubscriptionStatus {
  oposicionSlug: string;
  oposicionNombre: string;
  subscribed: boolean;
  estado: string | null;
  trialEndsAt: Date | null;
  ciclo?: "mensual" | "anual";
  /** Importe de cada cobro, en céntimos. */
  importeCentimos?: number | null;
  proximoPago?: Date | null;
  metodoPago?: MetodoPago | null;
  /** Si está programada su cancelación: fecha en que dejará de tener acceso. */
  cancelaEl?: Date | null;
  /** Acceso dado por el equipo desde el panel (sin pago). */
  asignadaPorEquipo?: boolean;
}

@Injectable()
export class BillingService {
  constructor(
    @Inject(PAYMENT_GATEWAY) private readonly gateway: PaymentGateway,
    private readonly stripe: StripeBillingService,
  ) {}

  async listActive(userId: string): Promise<SubscriptionStatus[]> {
    const db = getRequestDb();

    const rows = await db
      .select({
        oposicionSlug: schema.oposiciones.slug,
        oposicionNombre: schema.oposiciones.nombre,
        estado: schema.suscripcionesOposicion.estado,
        trialEndsAt: schema.suscripcionesOposicion.trialEndsAt,
        ciclo: schema.suscripcionesOposicion.ciclo,
        importeCentimos: schema.suscripcionesOposicion.importeCentimos,
        proximoCobro: schema.suscripcionesOposicion.proximoCobro,
        metodoPago: schema.suscripcionesOposicion.metodoPago,
        tarjetaMarca: schema.suscripcionesOposicion.tarjetaMarca,
        tarjetaUltimos4: schema.suscripcionesOposicion.tarjetaUltimos4,
        tarjetaCaducidad: schema.suscripcionesOposicion.tarjetaCaducidad,
        bizumTelefonoUltimos: schema.suscripcionesOposicion.bizumTelefonoUltimos,
        fechaFin: schema.suscripcionesOposicion.fechaFin,
        externa: schema.suscripcionesOposicion.stripeSubscriptionId,
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

    return rows.map((r) => ({
      oposicionSlug: r.oposicionSlug,
      oposicionNombre: r.oposicionNombre,
      subscribed: true,
      estado: r.estado,
      trialEndsAt: r.trialEndsAt,
      ciclo: r.ciclo,
      // Suscripciones anteriores a guardar estos datos: se deducen.
      importeCentimos: r.importeCentimos ?? PRECIO_CENTIMOS[r.ciclo],
      proximoPago: r.proximoCobro ?? (r.estado === "trialing" && !r.fechaFin ? r.trialEndsAt : null),
      metodoPago:
        r.metodoPago === "bizum"
          ? { tipo: "bizum", telefonoUltimos: r.bizumTelefonoUltimos }
          : r.metodoPago === "tarjeta"
            ? { tipo: "tarjeta", marca: r.tarjetaMarca, ultimos4: r.tarjetaUltimos4, caducidad: r.tarjetaCaducidad }
            : null,
      cancelaEl: r.fechaFin,
      // Asignada desde el panel: sin cobros ni método de pago.
      ...(r.externa
        ? {}
        : { asignadaPorEquipo: true, importeCentimos: null, proximoPago: null, metodoPago: null, cancelaEl: null }),
    }));
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
    const ciclo = dto.ciclo ?? "mensual";
    const importeCentimos = PRECIO_CENTIMOS[ciclo];
    const { externalSubscriptionId, trialEndsAt, proximoCobro, metodo } =
      await this.gateway.chargeAndSubscribe({
        customerId: userId,
        customerEmail: user.email,
        planLabel: `Oponow ${ciclo === "anual" ? "anual" : "mensual"} — ${oposicion.nombre}`,
        trialDays: TRIAL_DAYS,
        importeCentimos,
        ciclo,
        cardNumber: dto.cardNumber,
        cardExpiry: dto.cardExpiry,
        cardCvc: dto.cardCvc,
        cardName: dto.cardName,
      });

    const facturacion = {
      ciclo,
      importeCentimos,
      proximoCobro,
      metodoPago: metodo.tipo,
      tarjetaMarca: metodo.tipo === "tarjeta" ? metodo.marca : null,
      tarjetaUltimos4: metodo.tipo === "tarjeta" ? metodo.ultimos4 : null,
      tarjetaCaducidad: metodo.tipo === "tarjeta" ? metodo.caducidad : null,
      bizumTelefonoUltimos: metodo.tipo === "bizum" ? metodo.telefonoUltimos : null,
    };

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
          ...facturacion,
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
        ...facturacion,
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

  /**
   * Cancela la suscripción de una oposición: deja de cobrarse y se pierde el
   * acceso a sus temas de pago. Si era la última y el plan es Lite, vuelve a
   * Free (VIP se gestiona aparte y no se toca).
   */
  async cancel(userId: string, oposicionSlug: string): Promise<SubscriptionStatus> {
    const db = getRequestDb();
    const oposicion = await this.findOposicionBySlug(oposicionSlug);
    const [sub] = await db
      .select({ id: schema.suscripcionesOposicion.id, externa: schema.suscripcionesOposicion.stripeSubscriptionId })
      .from(schema.suscripcionesOposicion)
      .where(
        and(
          eq(schema.suscripcionesOposicion.usuarioId, userId),
          eq(schema.suscripcionesOposicion.oposicionId, oposicion.id),
          eq(schema.suscripcionesOposicion.activa, true),
        ),
      )
      .limit(1);
    if (!sub) throw new NotFoundException("No tienes una suscripción activa a esta oposición");

    if (sub.externa?.startsWith("sub_") && this.stripe.configurado) {
      await this.stripe.cancelarAlFinal(sub.externa);
      return { oposicionSlug, oposicionNombre: oposicion.nombre, subscribed: true, estado: null, trialEndsAt: null };
    }
    if (sub.externa) await this.gateway.cancelSubscription(sub.externa);
    await db
      .update(schema.suscripcionesOposicion)
      .set({ activa: false, estado: "canceled", fechaFin: new Date(), proximoCobro: null })
      .where(eq(schema.suscripcionesOposicion.id, sub.id));

    const quedan = await this.listActive(userId);
    const [user] = await db
      .select({ plan: schema.usuarios.plan })
      .from(schema.usuarios)
      .where(eq(schema.usuarios.id, userId))
      .limit(1);
    if (user?.plan === "lite" && quedan.length === 0) {
      await db.update(schema.usuarios).set({ plan: "free" }).where(eq(schema.usuarios.id, userId));
    }
    return { oposicionSlug, oposicionNombre: oposicion.nombre, subscribed: false, estado: "canceled", trialEndsAt: null };
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
