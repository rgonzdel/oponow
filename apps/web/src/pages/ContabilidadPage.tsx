import { type ReactNode } from "react";
import { Link, Navigate } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { OPOSICIONES } from "@oponow/shared-types";
import { useAuth } from "../auth/AuthContext";
import { SiteHeader } from "../components/SiteHeader";
import { LoadingScreen } from "../components/LoadingScreen";
import { buttonClass } from "../components/button";
import { ApiError } from "../lib/api-client";
import { descargarFacturasCsv, getResumenContabilidad, type ResumenContabilidad } from "../lib/contabilidad-client";

const EUR = new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" });
const EUR0 = new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });
const eur = (c: number) => EUR.format(c / 100);
const MES_CORTO = new Intl.DateTimeFormat("es-ES", { month: "short", timeZone: "UTC" });
const MES_LARGO = new Intl.DateTimeFormat("es-ES", { month: "long", year: "numeric", timeZone: "UTC" });
const HORA = new Intl.DateTimeFormat("es-ES", { hour: "2-digit", minute: "2-digit" });
const FECHA = new Intl.DateTimeFormat("es-ES", { day: "2-digit", month: "short", year: "numeric" });
const deMes = (m: string) => new Date(`${m}-01T12:00:00Z`);
const etiquetaMes = (m: string) => MES_CORTO.format(deMes(m)).replace(".", "");
const nombreOposicion = (slug: string) => OPOSICIONES.find((o) => o.slug === slug)?.siglas ?? slug;

const COLOR = { neto: "#9184d9", comisiones: "#f5b544", iva: "#60a5fa", reembolsos: "#f87171", prevision: "#4ade80", altas: "#4ade80", bajas: "#f87171" };

/** Panel de contabilidad (datos de Stripe): solo con el permiso ver_contabilidad. */
export function ContabilidadPage() {
  const { user, status } = useAuth();
  const resumen = useQuery({
    queryKey: ["contabilidad", "resumen"],
    queryFn: getResumenContabilidad,
    enabled: !!user?.permisos?.includes("ver_contabilidad"),
    staleTime: 60_000,
  });
  const csv = useMutation({
    mutationFn: async () => {
      const blob = await descargarFacturasCsv();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `facturas-oponow-${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 10_000);
    },
  });

  if (status === "loading") return <LoadingScreen />;
  if (!user?.permisos?.includes("ver_contabilidad")) return <Navigate to="/dashboard" replace />;

  return (
    <div>
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-6 py-10">
        <Link to="/dashboard" className="text-sm text-neutral-500 transition-colors hover:text-ink-text">
          ← Panel
        </Link>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-medium tracking-tight text-ink-text">Contabilidad</h1>
            {resumen.data && (
              <span
                className={`rounded-md px-2 py-0.5 text-xs font-medium ${resumen.data.modo === "prueba" ? "bg-amber-400/15 text-amber-300" : "bg-green-500/15 text-green-400"}`}
              >
                {resumen.data.modo === "prueba" ? "Stripe en modo prueba" : "Datos reales de Stripe"}
              </span>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {resumen.data && <span className="text-xs text-neutral-500">Actualizado a las {HORA.format(new Date(resumen.data.generado))}</span>}
            <button type="button" onClick={() => resumen.refetch()} disabled={resumen.isFetching} className={buttonClass("ghost")}>
              {resumen.isFetching ? "Actualizando…" : "Actualizar"}
            </button>
            <button type="button" onClick={() => csv.mutate()} disabled={csv.isPending} className={buttonClass("primary")}>
              {csv.isPending ? "Preparando…" : "Descargar facturas (CSV)"}
            </button>
          </div>
        </div>
        {csv.isError && <p className="mt-2 text-sm text-red-400">{csv.error instanceof ApiError ? csv.error.message : "No se ha podido descargar el CSV"}</p>}

        {resumen.isLoading && <p className="mt-8 text-sm text-neutral-500">Leyendo Stripe…</p>}
        {resumen.isError && (
          <p className="mt-8 text-sm text-red-400">
            {resumen.error instanceof ApiError ? resumen.error.message : "No se ha podido cargar la contabilidad."}
          </p>
        )}
        {resumen.data && <Panel r={resumen.data} />}
      </main>
    </div>
  );
}

function Panel({ r }: { r: ResumenContabilidad }) {
  const k = r.kpis;
  const variacion = k.ingresosMesAnterior > 0 ? Math.round(((k.ingresosMes - k.ingresosMesAnterior) / k.ingresosMesAnterior) * 100) : null;
  const previsto12 = r.previsionPorMes.reduce((n, m) => n + m.importe, 0);
  const mesActual = r.ventasPorMes.at(-1)?.mes ?? "";

  return (
    <div className="mt-6 space-y-6">
      {/* Cifras clave */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Cifra titulo="Ingresos recurrentes mensuales (MRR)" valor={eur(k.mrr)} pista={`${eur(k.arr)} al año (ARR)`} destacada />
        <Cifra
          titulo={`Cobrado en ${mesActual ? MES_LARGO.format(deMes(mesActual)) : "este mes"}`}
          valor={eur(k.ingresosMes)}
          pista={variacion === null ? `Mes anterior: ${eur(k.ingresosMesAnterior)}` : `${variacion >= 0 ? "▲" : "▼"} ${Math.abs(variacion)} % frente al mes anterior (${eur(k.ingresosMesAnterior)})`}
          tono={variacion === null ? undefined : variacion >= 0 ? "ok" : "mal"}
        />
        <Cifra titulo="Ingresos últimos 12 meses" valor={eur(k.ingresos12m)} pista={`Neto tras comisiones e IVA: ${eur(k.neto12m)}`} />
        <Cifra titulo="Previsto próximos 12 meses" valor={eur(previsto12)} pista="Si las suscripciones actuales se mantienen" tono="ok" />
        <Cifra titulo="Suscripciones de pago" valor={String(k.suscripcionesPago)} pista={`${k.mensuales} mensuales · ${k.anuales} anuales`} />
        <Cifra titulo="En prueba gratuita" valor={String(k.enPrueba)} pista={k.conversionPrueba === null ? "Aún no hay pruebas terminadas" : `${k.conversionPrueba} % de las pruebas acaban pagando`} />
        <Cifra
          titulo="Bajas y avisos"
          valor={String(k.bajas30d)}
          pista={`bajas en 30 días · ${k.cancelacionesProgramadas} cancelación${k.cancelacionesProgramadas === 1 ? "" : "es"} programada${k.cancelacionesProgramadas === 1 ? "" : "s"} · ${k.pagoPendiente} pago${k.pagoPendiente === 1 ? "" : "s"} pendiente${k.pagoPendiente === 1 ? "" : "s"}`}
          tono={k.pagoPendiente ? "mal" : undefined}
        />
        <Cifra titulo="Comisiones Stripe (12 meses)" valor={eur(k.comisiones12m)} pista={`IVA repercutido: ${eur(k.iva12m)} · ticket medio ${eur(k.ticketMedio)}`} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Tarjeta titulo="Ventas por mes" nota="Lo cobrado cada mes, desglosado. La altura total de cada barra es el importe cobrado.">
          <Barras
            meses={r.ventasPorMes.map((v) => v.mes)}
            series={[
              { nombre: "Neto", color: COLOR.neto, valores: r.ventasPorMes.map((v) => Math.max(0, v.neto)) },
              { nombre: "Comisiones", color: COLOR.comisiones, valores: r.ventasPorMes.map((v) => v.comisiones) },
              { nombre: "IVA", color: COLOR.iva, valores: r.ventasPorMes.map((v) => v.iva) },
              { nombre: "Reembolsos", color: COLOR.reembolsos, valores: r.ventasPorMes.map((v) => v.reembolsos) },
            ]}
            formato={eur}
          />
        </Tarjeta>
        <Tarjeta titulo="Ingresos previstos" nota="Cobros que llegarán cada mes si nadie cancela. No incluye nuevas altas; los picos son renovaciones anuales.">
          <Barras
            meses={r.previsionPorMes.map((v) => v.mes)}
            series={[{ nombre: "Previsto", color: COLOR.prevision, valores: r.previsionPorMes.map((v) => v.importe) }]}
            formato={eur}
            detalle={(i) => `${r.previsionPorMes[i].cobros} cobro${r.previsionPorMes[i].cobros === 1 ? "" : "s"}`}
          />
        </Tarjeta>
        <Tarjeta titulo="Altas y bajas de suscripciones" nota="Nuevas suscripciones (incluidas las que empiezan en prueba) frente a bajas, por mes.">
          <Barras
            meses={r.movimientosPorMes.map((v) => v.mes)}
            series={[
              { nombre: "Altas", color: COLOR.altas, valores: r.movimientosPorMes.map((v) => v.altas) },
              { nombre: "Bajas", color: COLOR.bajas, valores: r.movimientosPorMes.map((v) => v.bajas) },
            ]}
            agrupadas
            formato={(n) => String(n)}
          />
        </Tarjeta>
        <Tarjeta titulo="De dónde vienen los ingresos recurrentes" nota="MRR por oposición (las anuales cuentan su doceava parte).">
          {r.porOposicion.length === 0 ? (
            <p className="text-sm text-neutral-500">Todavía no hay suscripciones activas.</p>
          ) : (
            <div className="space-y-3">
              {r.porOposicion.map((o) => {
                const max = Math.max(...r.porOposicion.map((x) => x.mrr), 1);
                return (
                  <div key={o.oposicion}>
                    <div className="flex items-baseline justify-between gap-3 text-sm">
                      <span className="text-ink-text">{nombreOposicion(o.oposicion)}</span>
                      <span className="tabular-nums text-neutral-400">
                        {eur(o.mrr)} <span className="text-xs text-neutral-500">· {o.suscripciones} sus.</span>
                      </span>
                    </div>
                    <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-ink">
                      <div className="h-full rounded-full" style={{ width: `${(o.mrr / max) * 100}%`, background: COLOR.neto }} />
                    </div>
                  </div>
                );
              })}
              <div className="flex gap-4 border-t border-ink-divider pt-3 text-xs text-neutral-500">
                <span>Mensuales: <b className="text-ink-text">{r.kpis.mensuales}</b></span>
                <span>Anuales: <b className="text-ink-text">{r.kpis.anuales}</b></span>
              </div>
            </div>
          )}
        </Tarjeta>
      </div>

      <Tarjeta titulo="Últimas facturas cobradas" nota="Facturas de Stripe con importe (las de 0 € del alta en prueba no aparecen). El CSV incluye las del último año.">
        {r.ultimasFacturas.length === 0 ? (
          <p className="text-sm text-neutral-500">Todavía no hay facturas.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-xs text-neutral-500">
                <tr>
                  <th className="py-2 pr-4 font-medium">Fecha</th>
                  <th className="py-2 pr-4 font-medium">Factura</th>
                  <th className="py-2 pr-4 font-medium">Cliente</th>
                  <th className="py-2 pr-4 font-medium">Oposición</th>
                  <th className="py-2 pr-4 text-right font-medium">IVA</th>
                  <th className="py-2 pr-4 text-right font-medium">Total</th>
                  <th className="py-2 font-medium">Estado</th>
                </tr>
              </thead>
              <tbody>
                {r.ultimasFacturas.map((f, i) => (
                  <tr key={`${f.numero}-${i}`} className="border-t border-ink-divider">
                    <td className="whitespace-nowrap py-2 pr-4 text-neutral-400">{FECHA.format(new Date(f.fecha))}</td>
                    <td className="whitespace-nowrap py-2 pr-4">
                      {f.url ? (
                        <a href={f.url} target="_blank" rel="noreferrer" className="text-accent hover:underline">{f.numero ?? "Ver"}</a>
                      ) : (
                        <span className="text-neutral-400">{f.numero ?? "—"}</span>
                      )}
                    </td>
                    <td className="max-w-[220px] truncate py-2 pr-4 text-ink-text">{f.email ?? "—"}</td>
                    <td className="py-2 pr-4 text-neutral-400">{f.oposicion ? nombreOposicion(f.oposicion) : "—"}</td>
                    <td className="py-2 pr-4 text-right tabular-nums text-neutral-400">{eur(f.iva)}</td>
                    <td className="py-2 pr-4 text-right tabular-nums text-ink-text">{eur(f.importe)}</td>
                    <td className="py-2">
                      <span className={`rounded-md px-2 py-0.5 text-[11px] font-medium ${f.estado === "paid" ? "bg-green-500/15 text-green-400" : f.estado === "open" ? "bg-amber-400/15 text-amber-300" : "bg-neutral-500/20 text-neutral-300"}`}>
                        {f.estado === "paid" ? "Cobrada" : f.estado === "open" ? "Pendiente" : f.estado === "void" ? "Anulada" : f.estado === "uncollectible" ? "Impagada" : f.estado}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Tarjeta>

      <p className="text-xs text-neutral-500">
        Datos leídos de Stripe en el momento (se guardan 2 minutos). Las anuales cuentan 1/12 de su precio en el MRR. Con
        Managed Payments, Stripe actúa como vendedor y gestiona el IVA: aquí se muestra el IVA que figura en cada factura.
      </p>
    </div>
  );
}

/** Gráfico de barras sin librerías: apiladas por defecto o agrupadas. */
function Barras({
  meses,
  series,
  formato,
  agrupadas = false,
  detalle,
}: {
  meses: string[];
  series: { nombre: string; color: string; valores: number[] }[];
  formato: (n: number) => string;
  agrupadas?: boolean;
  detalle?: (i: number) => string;
}) {
  const totales = meses.map((_, i) => (agrupadas ? Math.max(...series.map((s) => s.valores[i])) : series.reduce((n, s) => n + s.valores[i], 0)));
  const max = Math.max(1, ...totales);
  const alto = 170;
  const marcas = [1, 0.5, 0];
  const visibles = series.filter((s) => s.valores.some((v) => v > 0));

  return (
    <div>
      <div className="flex gap-2">
        <div className="relative w-14 flex-none" style={{ height: alto }}>
          {marcas.map((f) => (
            <span key={f} className="absolute right-0 -translate-y-1/2 text-[10px] tabular-nums text-neutral-500" style={{ top: alto - f * alto }}>
              {agrupadas ? Math.round(max * f) : EUR0.format((max * f) / 100)}
            </span>
          ))}
        </div>
        <div className="relative flex-1" style={{ height: alto }}>
          {marcas.map((f) => (
            <div key={f} className="absolute inset-x-0 border-t border-ink-divider" style={{ top: alto - f * alto }} />
          ))}
          <div className="absolute inset-0 flex items-end gap-[3%] px-[1%]">
            {meses.map((m, i) => (
              <div
                key={m}
                className="group relative flex h-full flex-1 items-end justify-center gap-[2px]"
                title={`${MES_LARGO.format(deMes(m))}\n${series.map((s) => `${s.nombre}: ${formato(s.valores[i])}`).join("\n")}${detalle ? `\n${detalle(i)}` : ""}`}
              >
                {agrupadas ? (
                  series.map((s) => (
                    <div key={s.nombre} className="w-1/2 rounded-t-sm transition-opacity group-hover:opacity-80" style={{ height: `${(s.valores[i] / max) * 100}%`, background: s.color, minHeight: s.valores[i] ? 2 : 0 }} />
                  ))
                ) : (
                  <div className="flex w-full flex-col-reverse overflow-hidden rounded-t-sm transition-opacity group-hover:opacity-80" style={{ height: `${(totales[i] / max) * 100}%` }}>
                    {series.map((s) => (
                      <div key={s.nombre} style={{ height: totales[i] ? `${(s.valores[i] / totales[i]) * 100}%` : 0, background: s.color }} />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="ml-16 mt-1.5 flex gap-[3%] px-[1%]">
        {meses.map((m, i) => (
          <span key={m} className={`flex-1 text-center text-[10px] text-neutral-500 ${i % 2 ? "max-sm:invisible" : ""}`}>
            {etiquetaMes(m)}
          </span>
        ))}
      </div>
      {visibles.length > 1 || agrupadas ? (
        <div className="mt-3 flex flex-wrap gap-4">
          {(agrupadas ? series : visibles).map((s) => (
            <span key={s.nombre} className="flex items-center gap-1.5 text-xs text-neutral-400">
              <span className="h-2.5 w-2.5 rounded-sm" style={{ background: s.color }} />
              {s.nombre}
            </span>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function Tarjeta({ titulo, nota, children }: { titulo: string; nota?: string; children: ReactNode }) {
  return (
    <section className="rounded-lg border border-ink-divider bg-ink-surface p-5">
      <h2 className="text-sm font-medium text-ink-text">{titulo}</h2>
      {nota && <p className="mt-1 text-xs text-neutral-500">{nota}</p>}
      <div className="mt-4">{children}</div>
    </section>
  );
}

function Cifra({ titulo, valor, pista, tono, destacada }: { titulo: string; valor: string; pista: string; tono?: "ok" | "mal"; destacada?: boolean }) {
  return (
    <div className={`rounded-lg border p-4 ${destacada ? "border-accent/50 bg-accent-900/30" : "border-ink-divider bg-ink-surface"}`}>
      <p className="text-xs text-neutral-500">{titulo}</p>
      <p className={`mt-1 text-2xl font-medium tabular-nums ${tono === "ok" ? "text-green-400" : tono === "mal" ? "text-red-400" : "text-ink-text"}`}>{valor}</p>
      <p className="mt-1 text-xs text-neutral-500">{pista}</p>
    </div>
  );
}
