import { apiFetch, apiFetchBlob } from "./api-client";

// Refleja apps/api/src/contabilidad/contabilidad.service.ts. Importes en céntimos.
export interface VentaMes { mes: string; bruto: number; iva: number; comisiones: number; neto: number; facturas: number; reembolsos: number }
export interface PrevisionMes { mes: string; importe: number; cobros: number }
export interface MovimientoMes { mes: string; altas: number; bajas: number }
export interface FacturaContable {
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
  ultimasFacturas: FacturaContable[];
}

export function getResumenContabilidad() {
  return apiFetch<ResumenContabilidad>("/contabilidad/resumen");
}

export function descargarFacturasCsv() {
  return apiFetchBlob("/contabilidad/facturas.csv");
}
