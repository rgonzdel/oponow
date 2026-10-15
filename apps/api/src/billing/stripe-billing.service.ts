import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
  ServiceUnavailableException,
  UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { and, eq, sql as dsql } from "drizzle-orm";
import Stripe from "stripe";
import { schema } from "@oponow/db";
import { getRequestDb } from "../database/request-context";
import { CorreoService } from "../correo/correo.service";

const TRIAL_DAYS = 7;
// Claves de los precios en Stripe (ver scripts/stripe-configurar.mjs): así
// no hay que copiar ids de precio a variables de entorno.
const LOOKUP = { mensual: "oponow_mensual", anual: "oponow_anual" } as const;
const MARCAS: Record<string, string> = {
  visa: "Visa",
  mastercard: "Mastercard",
  amex: "American Express",
  discover: "Discover",
  diners: "Diners Club",
  jcb: "JCB",
  unionpay: "UnionPay",
  cartes_bancaires: "Cartes Bancaires",
};

type Ciclo = "mensual" | "anual";
type Estado = "trialing" | "active" | "past_due" | "canceled";

/**
 * Cobro real con Stripe: página de pago alojada en Stripe (Checkout) y
 * portal de cliente para cambiar la tarjeta, ver facturas o cancelar. El
 * número de tarjeta nunca pasa por Oponow: solo guardamos lo que Stripe
 * expone (marca, 4 últimos dígitos y caducidad).
 *
 * Fuente de verdad: la suscripción en Stripe. Cada evento del webhook (y la
 * vuelta del checkout) la vuelve a leer y la copia en suscripciones_oposicion.
 */
@Injectable()
export class StripeBillingService {
  private readonly logger = new Logger(StripeBillingService.name);
  private readonly stripe: Stripe | null;
  private readonly secretoWebhook: string | undefined;
  private readonly web: string;
  /** Clave publicable (pk_…): la usa Stripe.js en la web para el pago integrado. */
  readonly clavePublica: string | null;
  // Managed Payments: Stripe actúa como vendedor legal y gestiona e ingresa
  // el IVA (con comisión adicional). Activado por decisión de negocio; se
  // puede apagar con STRIPE_MANAGED_PAYMENTS=false. Requiere que el producto
  // tenga tax_code (lo asigna scripts/stripe-configurar.mjs).
  private readonly managedPayments: boolean;
  private precios: Partial<Record<Ciclo, string>> = {};

  constructor(
    config: ConfigService,
    private readonly correo: CorreoService,
  ) {
    const clave = config.get<string>("STRIPE_SECRET_KEY");
    this.stripe = clave ? new Stripe(clave) : null;
    this.secretoWebhook = config.get<string>("STRIPE_WEBHOOK_SECRET");
    this.web = config.get<string>("WEB_ORIGIN", "https://www.oponow.com").replace(/\/$/, "");
    this.managedPayments = config.get<string>("STRIPE_MANAGED_PAYMENTS") !== "false";
    this.clavePublica = config.get<string>("STRIPE_PUBLISHABLE_KEY") || null;
  }

  get configurado(): boolean {
    return this.stripe !== null;
  }

  private cliente(): Stripe {
    if (!this.stripe) throw new ServiceUnavailableException("El pago con tarjeta no está disponible ahora mismo");
    return this.stripe;
  }

/**
   * Sesión de pago de Stripe para suscribirse a una oposición. "integrado":
   * el formulario de Stripe se pinta en una ventana dentro de Oponow
   * (Stripe.js con el clientSecret); si no, página de pago aparte (url).
   */
  async crearCheckout(
    userId: string,
    oposicionSlug: string,
    ciclo: Ciclo,
    integrado = false,
  ): Promise<{ url: string } | { clientSecret: string; sessionId: string }> {
    const stripe = this.cliente();
    const db = getRequestDb();
    const [user] = await db
      .select({ email: schema.usuarios.email })
      .from(schema.usuarios)
      .where(eq(schema.usuarios.id, userId))
      .limit(1);
    if (!user) throw new UnauthorizedException();
    const oposicion = await this.oposicion(oposicionSlug);

    const anteriores = await db
      .select({ activa: schema.suscripcionesOposicion.activa, oposicionId: schema.suscripcionesOposicion.oposicionId, externa: schema.suscripcionesOposicion.stripeSubscriptionId })
      .from(schema.suscripcionesOposicion)
      .where(eq(schema.suscripcionesOposicion.usuarioId, userId));
    if (anteriores.some((s) => s.activa && s.oposicionId === oposicion.id)) {
      throw new ConflictException("Ya tienes esta oposición activa");
    }
    // La prueba gratuita, una vez por oposición.
    const yaProbo = anteriores.some((s) => s.oposicionId === oposicion.id);
    const cliente = await this.clienteExistente(anteriores.map((s) => s.externa));

    const metadata = { usuarioId: userId, oposicionId: oposicion.id, oposicionSlug, ciclo };
    const sesion = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: await this.precio(ciclo), quantity: 1 }],
      ...(cliente ? { customer: cliente } : user.email ? { customer_email: user.email } : {}),
      client_reference_id: userId,
      metadata,
      subscription_data: { metadata, ...(yaProbo ? {} : { trial_period_days: TRIAL_DAYS }) },
      locale: "es",
      managed_payments: { enabled: this.managedPayments },
      ...(integrado && this.clavePublica
        ? // Sin redirección al terminar: la web cierra la ventana y confirma.
          { ui_mode: "embedded_page" as const, redirect_on_completion: "never" as const }
        : {
            success_url: `${this.web}/checkout/exito?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${this.web}/checkout?oposicion=${encodeURIComponent(oposicionSlug)}&ciclo=${ciclo}`,
          }),
    });
    if (integrado && this.clavePublica) {
      if (!sesion.client_secret) throw new ServiceUnavailableException("Stripe no ha devuelto el formulario de pago");
      return { clientSecret: sesion.client_secret, sessionId: sesion.id };
    }
    if (!sesion.url) throw new ServiceUnavailableException("Stripe no ha devuelto la página de pago");
    return { url: sesion.url };
  }

  /** Vuelta del checkout: aplica la suscripción sin esperar al webhook. */
  async confirmarCheckout(userId: string, sessionId: string): Promise<{ oposicionSlug: string }> {
    const sesion = await this.cliente().checkout.sessions.retrieve(sessionId);
    if (sesion.client_reference_id !== userId) throw new NotFoundException("Pago no encontrado");
    const subId = typeof sesion.subscription === "string" ? sesion.subscription : sesion.subscription?.id;
    if (!subId) throw new BadRequestException("El pago todavía no se ha completado");
    await this.sincronizar(subId);
    return { oposicionSlug: sesion.metadata?.oposicionSlug ?? "" };
  }

  /** Portal de Stripe: cambiar tarjeta, ver facturas, cancelar. */
  async crearPortal(userId: string): Promise<{ url: string }> {
    const stripe = this.cliente();
    const subs = await getRequestDb()
      .select({ externa: schema.suscripcionesOposicion.stripeSubscriptionId })
      .from(schema.suscripcionesOposicion)
      .where(eq(schema.suscripcionesOposicion.usuarioId, userId));
    const cliente = await this.clienteExistente(subs.map((s) => s.externa));
    if (!cliente) throw new NotFoundException("No tienes ningún pago con tarjeta registrado");
    const configuracion = await this.configuracionPortal();
    const sesion = await stripe.billingPortal.sessions.create({
      customer: cliente,
      return_url: `${this.web}/cuenta`,
      locale: "es",
      ...(configuracion ? { configuration: configuracion } : {}),
    });
    return { url: sesion.url };
  }

  /** Cancelar desde Mi cuenta: al final del periodo ya pagado (como en el portal). */
  async cancelarAlFinal(stripeSubscriptionId: string): Promise<void> {
    await this.cliente().subscriptions.update(stripeSubscriptionId, { cancel_at_period_end: true });
    await this.sincronizar(stripeSubscriptionId);
  }

  async procesarWebhook(cuerpo: Buffer | undefined, firma: string | undefined): Promise<void> {
    const stripe = this.cliente();
    if (!this.secretoWebhook) throw new ServiceUnavailableException("Webhook de Stripe sin configurar");
    if (!cuerpo || !firma) throw new BadRequestException("Falta la firma de Stripe");
    let evento: Stripe.Event;
    try {
      evento = stripe.webhooks.constructEvent(cuerpo, firma, this.secretoWebhook);
    } catch {
      throw new BadRequestException("Firma de Stripe no válida");
    }

    const obj = evento.data.object as { id?: string; subscription?: string | { id: string } | null; customer?: string | { id: string } | null };
    switch (evento.type) {
      case "checkout.session.completed": {
        const subId = typeof obj.subscription === "string" ? obj.subscription : obj.subscription?.id;
        if (subId) {
          await this.sincronizar(subId);
          if (this.primeraVez(evento.id)) await this.avisar(subId, "contratacion");
        }
        break;
      }
      case "customer.subscription.trial_will_end":
        if (obj.id) {
          await this.sincronizar(obj.id);
          if (this.primeraVez(evento.id)) await this.avisar(obj.id, "fin-prueba");
        }
        break;
      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted":
        if (obj.id) await this.sincronizar(obj.id);
        break;
      case "customer.updated":
      case "invoice.paid":
      case "invoice.payment_failed": {
        // Tarjeta por defecto cambiada o cobro hecho/fallido: se releen
        // todas las suscripciones del cliente.
        const cliente = typeof obj.customer === "string" ? obj.customer : obj.customer?.id ?? (evento.type === "customer.updated" ? obj.id : undefined);
        if (cliente) {
          const subs = await stripe.subscriptions.list({ customer: cliente, status: "all", limit: 20 });
          for (const s of subs.data) await this.sincronizar(s.id);
        }
        break;
      }
      default:
        break;
    }
  }

  /** Copia el estado de una suscripción de Stripe a la base de datos. */
  async sincronizar(subscriptionId: string): Promise<void> {
    const stripe = this.cliente();
    const sub = await stripe.subscriptions.retrieve(subscriptionId, {
      expand: ["default_payment_method", "customer.invoice_settings.default_payment_method"],
    });
    const { usuarioId, oposicionId } = sub.metadata ?? {};
    if (!usuarioId || !oposicionId) {
      this.logger.warn(`Suscripción ${sub.id} sin metadatos de Oponow: se ignora`);
      return;
    }

    const estado = mapearEstado(sub.status);
    if (!estado) return; // "incomplete": el primer pago aún no se ha completado.
    const activa = estado !== "canceled";
    const item = sub.items.data[0];
    const ciclo: Ciclo = item?.price.recurring?.interval === "year" ? "anual" : "mensual";
    const finPeriodo = item?.current_period_end ?? null;
    const proximoCobro =
      !activa || sub.cancel_at_period_end || sub.cancel_at
        ? null
        : sub.status === "trialing" && sub.trial_end
          ? new Date(sub.trial_end * 1000)
          : finPeriodo
            ? new Date(finPeriodo * 1000)
            : null;
    const fechaFin = sub.ended_at
      ? new Date(sub.ended_at * 1000)
      : sub.cancel_at
        ? new Date(sub.cancel_at * 1000)
        : null;

    const metodo = metodoPago(sub);
    const datos = {
      activa,
      estado,
      trialEndsAt: sub.trial_end ? new Date(sub.trial_end * 1000) : null,
      fechaFin,
      stripeSubscriptionId: sub.id,
      ciclo,
      importeCentimos: item?.price.unit_amount ?? null,
      proximoCobro,
      metodoPago: metodo ? ("tarjeta" as const) : null,
      tarjetaMarca: metodo?.marca ?? null,
      tarjetaUltimos4: metodo?.ultimos4 ?? null,
      tarjetaCaducidad: metodo?.caducidad ?? null,
      bizumTelefonoUltimos: null,
    };

    // Sin sesión de usuario (webhook): se fija su identidad para RLS.
    const db = getRequestDb();
    await db.execute(dsql`SELECT set_config('app.current_user_id', ${usuarioId}, false)`);
    await db
      .insert(schema.suscripcionesOposicion)
      .values({ usuarioId, oposicionId, fechaInicio: new Date(sub.start_date * 1000), ...datos })
      .onConflictDoUpdate({
        target: [schema.suscripcionesOposicion.usuarioId, schema.suscripcionesOposicion.oposicionId],
        set: datos,
      });

    // Plan: Lite con alguna suscripción activa, Free sin ninguna. VIP no se toca.
    const [user] = await db.select({ plan: schema.usuarios.plan }).from(schema.usuarios).where(eq(schema.usuarios.id, usuarioId)).limit(1);
    const activas = await db
      .select({ id: schema.suscripcionesOposicion.id })
      .from(schema.suscripcionesOposicion)
      .where(and(eq(schema.suscripcionesOposicion.usuarioId, usuarioId), eq(schema.suscripcionesOposicion.activa, true)));
    if (user?.plan === "free" && activas.length > 0) {
      await db.update(schema.usuarios).set({ plan: "lite" }).where(eq(schema.usuarios.id, usuarioId));
    } else if (user?.plan === "lite" && activas.length === 0) {
      await db.update(schema.usuarios).set({ plan: "free" }).where(eq(schema.usuarios.id, usuarioId));
    }
    this.logger.log(`Suscripción ${sub.id} sincronizada: ${estado}${proximoCobro ? `, próximo cobro ${proximoCobro.toISOString().slice(0, 10)}` : ""}`);
  }

  private async precio(ciclo: Ciclo): Promise<string> {
    if (!this.precios[ciclo]) {
      const lista = await this.cliente().prices.list({ lookup_keys: [LOOKUP[ciclo]], active: true, limit: 1 });
      if (!lista.data[0]) throw new ServiceUnavailableException(`Falta el precio ${LOOKUP[ciclo]} en Stripe`);
      this.precios[ciclo] = lista.data[0].id;
    }
    return this.precios[ciclo]!;
  }

  private async clienteExistente(idsSuscripcion: (string | null)[]): Promise<string | null> {
    for (const id of idsSuscripcion) {
      if (!id || !id.startsWith("sub_")) continue;
      try {
        const sub = await this.cliente().subscriptions.retrieve(id);
        return typeof sub.customer === "string" ? sub.customer : sub.customer.id;
      } catch {
        // Suscripción de otro modo (prueba/real) o borrada: se sigue buscando.
      }
    }
    return null;
  }

  private configPortal: string | null | undefined;
  private async configuracionPortal(): Promise<string | null> {
    if (this.configPortal === undefined) {
      const lista = await this.cliente().billingPortal.configurations.list({ limit: 100 });
      this.configPortal = lista.data.find((c) => c.metadata?.app === "oponow")?.id ?? null;
    }
    return this.configPortal;
  }

  /** Stripe reintenta los webhooks: evita mandar el mismo correo dos veces
   * por el mismo evento mientras el proceso siga vivo (mejor esfuerzo). */
  private readonly eventosAvisados = new Set<string>();
  private primeraVez(eventoId: string): boolean {
    if (this.eventosAvisados.has(eventoId)) return false;
    this.eventosAvisados.add(eventoId);
    if (this.eventosAvisados.size > 5_000) this.eventosAvisados.clear();
    return true;
  }

  /**
   * Correos propios de la contratación, además de los recibos y facturas que
   * envía Link (Stripe): la confirmación en soporte duradero con las
   * condiciones (art. 98.7 TRLGDCU) y el recordatorio de fin de la prueba,
   * que Stripe no envía en pruebas de 7 días o menos. Un fallo de envío no
   * debe tumbar el webhook: se registra y se sigue.
   */
  private async avisar(subscriptionId: string, tipo: "contratacion" | "fin-prueba"): Promise<void> {
    try {
      const sub = await this.cliente().subscriptions.retrieve(subscriptionId, { expand: ["customer"] });
      const cliente = sub.customer as Stripe.Customer | Stripe.DeletedCustomer;
      const email = "email" in cliente ? cliente.email : null;
      if (!email) return;
      const slug = sub.metadata?.oposicionSlug;
      const nombre = slug ? (await this.oposicion(slug).catch(() => null))?.nombre ?? slug : "tu oposición";
      const item = sub.items.data[0];
      const anual = item?.price.recurring?.interval === "year";
      const importe = item?.price.unit_amount != null ? (item.price.unit_amount / 100).toFixed(2).replace(".", ",") : null;
      const precio = importe ? `${importe} € ${anual ? "al año" : "al mes"} (IVA incluido)` : "el precio del plan contratado";
      const fecha = (s: number) => new Date(s * 1000).toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric", timeZone: "Europe/Madrid" });
      const finPrueba = sub.status === "trialing" && sub.trial_end ? fecha(sub.trial_end) : null;
      const terminos = `${this.web}/legal/terminos`;

      if (tipo === "contratacion") {
        await this.correo.enviarAviso({
          email,
          asunto: `Confirmación de tu suscripción a Oponow — ${nombre}`,
          titulo: "Tu suscripción está activa",
          parrafos: [
            `Has contratado el plan ${anual ? "anual" : "mensual"} de Oponow para ${nombre}.`,
            finPrueba
              ? `Estás en el periodo de prueba gratuito hasta el ${finPrueba}. Si no cancelas antes, ese día se cobrarán ${precio} y la suscripción se renovará automáticamente cada ${anual ? "año" : "mes"}.`
              : `Precio: ${precio}. La suscripción se renueva automáticamente cada ${anual ? "año" : "mes"}.`,
            "Puedes cancelar cuando quieras desde «Mi cuenta», sin permanencia: la cancelación surte efecto al final del periodo ya pagado.",
            "Tienes 14 días naturales desde hoy para desistir del contrato sin dar explicaciones: escríbenos a info@oponow.com y te devolveremos íntegramente lo cobrado.",
            "Los pagos los gestiona Link (Stripe), que te enviará por separado el recibo y la factura. Estas son las condiciones aplicables a tu contratación:",
          ],
          boton: { texto: "Ver los Términos y condiciones", enlace: terminos },
          motivo: "Has recibido este correo porque has contratado una suscripción en Oponow.",
        });
      } else if (finPrueba) {
        await this.correo.enviarAviso({
          email,
          asunto: `Tu prueba gratuita de Oponow termina el ${finPrueba}`,
          titulo: "Tu prueba gratuita termina pronto",
          parrafos: [
            `Tu periodo de prueba de ${nombre} termina el ${finPrueba}.`,
            `Si quieres seguir, no tienes que hacer nada: ese día se cobrarán ${precio} y la suscripción se renovará automáticamente cada ${anual ? "año" : "mes"}.`,
            "Si no quieres continuar, cancela antes de esa fecha desde «Mi cuenta» y no se te cobrará nada.",
          ],
          boton: { texto: "Ir a Mi cuenta", enlace: `${this.web}/cuenta` },
          motivo: "Has recibido este correo porque tienes una prueba gratuita activa en Oponow.",
        });
      }
    } catch (e) {
      this.logger.warn(`No se pudo enviar el correo de ${tipo} de la suscripción ${subscriptionId}: ${e instanceof Error ? e.message : String(e)}`);
    }
  }

  private async oposicion(slug: string) {
    const [o] = await getRequestDb()
      .select({ id: schema.oposiciones.id, nombre: schema.oposiciones.nombre })
      .from(schema.oposiciones)
      .where(eq(schema.oposiciones.slug, slug))
      .limit(1);
    if (!o) throw new NotFoundException("Oposición no encontrada");
    return o;
  }
}

function mapearEstado(status: Stripe.Subscription.Status): Estado | null {
  switch (status) {
    case "trialing":
      return "trialing";
    case "active":
      return "active";
    case "past_due":
    case "unpaid":
    case "paused":
      return "past_due";
    case "canceled":
    case "incomplete_expired":
      return "canceled";
    default:
      return null;
  }
}

function metodoPago(sub: Stripe.Subscription): { marca: string; ultimos4: string; caducidad: string } | null {
  const cliente = typeof sub.customer === "object" && !("deleted" in sub.customer && sub.customer.deleted) ? (sub.customer as Stripe.Customer) : null;
  const pm =
    (typeof sub.default_payment_method === "object" ? sub.default_payment_method : null) ??
    (typeof cliente?.invoice_settings?.default_payment_method === "object" ? cliente.invoice_settings.default_payment_method : null);
  const tarjeta = pm?.card;
  if (!tarjeta) return null;
  return {
    marca: MARCAS[tarjeta.brand] ?? tarjeta.brand,
    ultimos4: tarjeta.last4,
    caducidad: `${String(tarjeta.exp_month).padStart(2, "0")}/${String(tarjeta.exp_year).slice(-2)}`,
  };
}
