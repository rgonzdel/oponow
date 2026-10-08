import { Injectable, Logger, ServiceUnavailableException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import Stripe from "stripe";

// Fuente de verdad: Stripe (facturas, movimientos de saldo y suscripciones).
// Importes en céntimos de euro. Los meses se agrupan en hora peninsular.
const ZONA = "Europe/Madrid";
const MESES_HISTORICO = 12;
const MESES_PREVISION = 12;
const CACHE_MS = 2 * 60_000;

const mesDe = new Intl.DateTimeFormat("en-CA", { timeZone: ZONA, year: "numeric", month: "2-digit" });
const claveMes = (segundos: number) => mesDe.format(new Date(segundos * 1000)).slice(0, 7);

/** Claves "YYYY-MM" desde `desde` (incluido) avanzando `n` meses. */
function meses(desde: string, n: number): string[] {
  let [a, m] = desde.split("-").map(Number);
  const lista: string[] = [];
  for (let i = 0; i < n; i++) {
    lista.push(`${a}-${String(m).padStart(2, "0")}`);
    m += 1;
    if (m > 12) { m = 1; a += 1; }
  }
  return lista;
}
function restarMeses(clave: string, n: number): string {
  let [a, m] = clave.split("-").map(Number);
  m -= n;
  while (m < 1) { m += 12; a -= 1; }
  return `${a}-${String(m).padStart(2, "0")}`;
}

export interface VentaMes { mes: string; bruto: number; iva: number; comisiones: number; neto: number; facturas: number; reembolsos: number }
export interface PrevisionMes { mes: string; importe: number; cobros: number }
export interface MovimientoMes { mes: string; altas: number; bajas: number }
export interface Factura {
  numero: string | null;
  fecha: string;
  email: string | null;
  oposicion: string | null;
  importe: number;
  iva: number;
  estado: string;
  url: string | null;
}

export interface ResumenContabilidad {
  modo: "prueba" | "real";
  moneda: "eur";
  generado: string;
  kpis: {
    mrr: number;
    arr: number;
    mrrPotencial: number;
    ingresosMes: number;
    ingresosMesAnterior: number;
    ingresos12m: number;
    neto12m: number;
    comisiones12m: number;
    iva12m: number;
    suscripcionesPago: number;
    enPrueba: number;
    pagoPendiente: number;
    cancelacionesProgramadas: number;
    mensuales: number;
    anuales: number;
    ticketMedio: number;
    bajas30d: number;
    conversionPrueba: number | null;
  };
  ventasPorMes: VentaMes[];
  previsionPorMes: PrevisionMes[];
  movimientosPorMes: MovimientoMes[];
  porOposicion: { oposicion: string; suscripciones: number; mrr: number }[];
  ultimasFacturas: Factura[];
}

@Injectable()
export class ContabilidadService {
  private readonly logger = new Logger(ContabilidadService.name);
  private readonly stripe: Stripe | null;
  private cache: { hasta: number; datos: Promise<Datos> } | null = null;

  constructor(config: ConfigService) {
    const clave = config.get<string>("STRIPE_SECRET_KEY");
    this.stripe = clave ? new Stripe(clave) : null;
  }

  async resumen(): Promise<ResumenContabilidad> {
    const d = await this.datos();
    const ahora = Math.floor(Date.now() / 1000);
    const mesActual = claveMes(ahora);
    const historico = meses(restarMeses(mesActual, MESES_HISTORICO - 1), MESES_HISTORICO);

    // Ventas cobradas por mes (facturas pagadas) con IVA, comisiones y neto.
    const ventas = new Map<string, VentaMes>(historico.map((m) => [m, { mes: m, bruto: 0, iva: 0, comisiones: 0, neto: 0, facturas: 0, reembolsos: 0 }]));
    for (const f of d.facturas) {
      if (f.status !== "paid" || f.amount_paid <= 0) continue;
      const v = ventas.get(claveMes(f.status_transitions?.paid_at ?? f.created));
      if (!v) continue;
      v.bruto += f.amount_paid;
      v.iva += (f.total_taxes ?? []).reduce((n, t) => n + t.amount, 0);
      v.facturas += 1;
    }
    for (const t of d.movimientos) {
      // Al mes del cobro que la origina (en simulaciones con relojes de
      // prueba el movimiento lleva la hora real, no la simulada).
      const origen = t.source && typeof t.source === "object" && "created" in t.source ? (t.source as { created: number }).created : t.created;
      const v = ventas.get(claveMes(origen));
      if (!v) continue;
      v.comisiones += t.fee;
      if (t.type === "refund" || t.reporting_category === "refund") v.reembolsos += -t.amount;
    }
    for (const v of ventas.values()) v.neto = v.bruto - v.iva - v.comisiones - v.reembolsos;

    // Suscripciones vivas: MRR y previsión de cobros futuros.
    const vivas = d.suscripciones.filter((s) => ["active", "trialing", "past_due"].includes(s.status));
    const futuro = meses(restarMeses(mesActual, 0), MESES_PREVISION);
    const prevision = new Map<string, PrevisionMes>(futuro.map((m) => [m, { mes: m, importe: 0, cobros: 0 }]));
    const horizonte = new Date();
    horizonte.setMonth(horizonte.getMonth() + MESES_PREVISION);
    let mrr = 0;
    let mrrPotencial = 0;
    let mensuales = 0;
    let anuales = 0;
    const porOposicion = new Map<string, { oposicion: string; suscripciones: number; mrr: number }>();
    for (const s of vivas) {
      const item = s.items.data[0];
      if (!item?.price.unit_amount || !item.price.recurring) continue;
      const importe = item.price.unit_amount * (item.quantity ?? 1);
      const anual = item.price.recurring.interval === "year";
      const mensual = anual ? Math.round(importe / 12) : importe;
      if (anual) anuales += 1; else mensuales += 1;
      if (!s.cancel_at_period_end && !s.cancel_at) mrrPotencial += mensual;
      if (s.status === "active" && !s.cancel_at_period_end && !s.cancel_at) mrr += mensual;
      const op = s.metadata?.oposicionSlug || "sin oposición";
      const fila = porOposicion.get(op) ?? { oposicion: op, suscripciones: 0, mrr: 0 };
      fila.suscripciones += 1;
      if (!s.cancel_at_period_end && !s.cancel_at) fila.mrr += mensual;
      porOposicion.set(op, fila);

      // Cobros futuros mientras la suscripción siga: primero al acabar la
      // prueba o el periodo actual y luego cada mes o año, hasta su
      // cancelación programada (si la hay) o el horizonte.
      let cobro = new Date(((s.status === "trialing" && s.trial_end) || item.current_period_end) * 1000);
      const fin = s.cancel_at ? new Date(s.cancel_at * 1000) : s.cancel_at_period_end ? new Date(item.current_period_end * 1000) : null;
      while (cobro <= horizonte && (!fin || cobro < fin)) {
        const p = prevision.get(claveMes(Math.floor(cobro.getTime() / 1000)));
        if (p) { p.importe += importe; p.cobros += 1; }
        cobro = new Date(cobro);
        if (anual) cobro.setFullYear(cobro.getFullYear() + 1); else cobro.setMonth(cobro.getMonth() + 1);
      }
    }

    // Altas y bajas de suscripciones por mes.
    const movimientos = new Map<string, MovimientoMes>(historico.map((m) => [m, { mes: m, altas: 0, bajas: 0 }]));
    for (const s of d.suscripciones) {
      const alta = movimientos.get(claveMes(s.start_date));
      if (alta) alta.altas += 1;
      const baja = s.ended_at ?? (s.status === "canceled" ? s.canceled_at : null);
      if (baja) {
        const m = movimientos.get(claveMes(baja));
        if (m) m.bajas += 1;
      }
    }

    // Conversión de prueba a pago: de las pruebas que ya terminaron, cuántas pagaron.
    const pruebasTerminadas = d.suscripciones.filter((s) => s.trial_end && s.trial_end < ahora);
    const convertidas = pruebasTerminadas.filter((s) => s.status === "active" || s.status === "past_due" || (s.status === "canceled" && (s.ended_at ?? 0) > (s.trial_end ?? 0) + 86_400));
    const pagadas = d.facturas.filter((f) => f.status === "paid" && f.amount_paid > 0);
    const venta = (m: string) => ventas.get(m)?.bruto ?? 0;
    const lista = [...ventas.values()];

    return {
      modo: d.real ? "real" : "prueba",
      moneda: "eur",
      generado: new Date(d.generado).toISOString(),
      kpis: {
        mrr,
        arr: mrr * 12,
        mrrPotencial,
        ingresosMes: venta(mesActual),
        ingresosMesAnterior: venta(restarMeses(mesActual, 1)),
        ingresos12m: lista.reduce((n, v) => n + v.bruto, 0),
        neto12m: lista.reduce((n, v) => n + v.neto, 0),
        comisiones12m: lista.reduce((n, v) => n + v.comisiones, 0),
        iva12m: lista.reduce((n, v) => n + v.iva, 0),
        suscripcionesPago: vivas.filter((s) => s.status === "active").length,
        enPrueba: vivas.filter((s) => s.status === "trialing").length,
        pagoPendiente: vivas.filter((s) => s.status === "past_due").length,
        cancelacionesProgramadas: vivas.filter((s) => s.cancel_at_period_end || s.cancel_at).length,
        mensuales,
        anuales,
        ticketMedio: pagadas.length ? Math.round(pagadas.reduce((n, f) => n + f.amount_paid, 0) / pagadas.length) : 0,
        bajas30d: d.suscripciones.filter((s) => (s.ended_at ?? 0) > ahora - 30 * 86_400).length,
        conversionPrueba: pruebasTerminadas.length ? Math.round((convertidas.length / pruebasTerminadas.length) * 100) : null,
      },
      ventasPorMes: lista,
      previsionPorMes: [...prevision.values()],
      movimientosPorMes: [...movimientos.values()],
      porOposicion: [...porOposicion.values()].sort((a, b) => b.mrr - a.mrr),
      ultimasFacturas: d.facturas.filter((f) => f.total > 0).slice(0, 25).map((f) => this.factura(f)),
    };
  }

  /** CSV de facturas (último año) para la gestoría. */
  async facturasCsv(): Promise<string> {
    const d = await this.datos();
    const euros = (c: number) => (c / 100).toFixed(2).replace(".", ",");
    const celda = (v: string | null) => `"${(v ?? "").replace(/"/g, '""')}"`;
    // Las de 0 € (alta en periodo de prueba) no aportan nada a la contabilidad.
    const filas = d.facturas.filter((f) => f.total > 0).map((f) => {
      const x = this.factura(f);
      return [x.numero, x.fecha.slice(0, 10), x.email, x.oposicion, euros(x.importe - x.iva), euros(x.iva), euros(x.importe), x.estado, x.url].map((v) => celda(v)).join(";");
    });
    // Separador ";" y coma decimal: así lo abre Excel en español sin tocar nada.
    return "﻿" + ["Número;Fecha;Cliente;Oposición;Base imponible;IVA;Total;Estado;Enlace", ...filas].join("\r\n");
  }

  private factura(f: Stripe.Invoice): Factura {
    const linea = f.lines?.data?.[0] as (Stripe.InvoiceLineItem & { metadata?: Record<string, string> }) | undefined;
    return {
      numero: f.number,
      fecha: new Date((f.status_transitions?.paid_at ?? f.created) * 1000).toISOString(),
      email: f.customer_email,
      oposicion: (f.parent?.subscription_details?.metadata?.oposicionSlug as string | undefined) ?? linea?.metadata?.oposicionSlug ?? null,
      importe: f.status === "paid" ? f.amount_paid : f.total,
      iva: (f.total_taxes ?? []).reduce((n, t) => n + t.amount, 0),
      estado: f.status ?? "draft",
      url: f.hosted_invoice_url ?? null,
    };
  }

  // Lecturas de Stripe, cacheadas un par de minutos: el panel hace una sola
  // ronda de llamadas aunque se recargue varias veces.
  private datos(): Promise<Datos> {
    if (!this.stripe) throw new ServiceUnavailableException("Stripe no está configurado en este entorno");
    if (this.cache && this.cache.hasta > Date.now()) return this.cache.datos;
    const datos = this.cargar(this.stripe).catch((e) => {
      this.cache = null;
      this.logger.error(`No se pudo leer Stripe: ${e instanceof Error ? e.message : String(e)}`);
      throw new ServiceUnavailableException("No se ha podido leer la información de Stripe. Inténtalo en unos minutos.");
    });
    this.cache = { hasta: Date.now() + CACHE_MS, datos };
    return datos;
  }

  private async cargar(stripe: Stripe): Promise<Datos> {
    const desde = Math.floor(Date.now() / 1000) - (MESES_HISTORICO + 1) * 31 * 86_400;
    const facturas: Stripe.Invoice[] = [];
    for await (const f of stripe.invoices.list({ created: { gte: desde }, limit: 100 })) facturas.push(f);
    const movimientos: Stripe.BalanceTransaction[] = [];
    for await (const t of stripe.balanceTransactions.list({ created: { gte: desde }, limit: 100, expand: ["data.source"] })) movimientos.push(t);
    const suscripciones: Stripe.Subscription[] = [];
    for await (const s of stripe.subscriptions.list({ status: "all", limit: 100 })) suscripciones.push(s);
    const real = (await stripe.balance.retrieve()).livemode;
    // En modo prueba, Stripe no incluye en los listados lo creado con
    // "relojes de prueba" (simulaciones de meses): se piden reloj a reloj.
    // En modo real no existen relojes.
    if (!real) {
      for await (const reloj of stripe.testHelpers.testClocks.list({ limit: 100 })) {
        for await (const c of stripe.customers.list({ test_clock: reloj.id, limit: 100 })) {
          for await (const f of stripe.invoices.list({ customer: c.id, created: { gte: desde }, limit: 100 })) facturas.push(f);
        }
        for await (const s of stripe.subscriptions.list({ test_clock: reloj.id, status: "all", limit: 100 })) suscripciones.push(s);
      }
      facturas.sort((a, b) => (b.status_transitions?.paid_at ?? b.created) - (a.status_transitions?.paid_at ?? a.created));
    }
    return { facturas, movimientos, suscripciones, real, generado: Date.now() };
  }
}

interface Datos {
  facturas: Stripe.Invoice[];
  movimientos: Stripe.BalanceTransaction[];
  suscripciones: Stripe.Subscription[];
  real: boolean;
  generado: number;
}
