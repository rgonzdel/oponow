import { createElement as h, type ReactNode } from "react";
import { Circle, Document, Page, StyleSheet, Svg, Text, View, renderToBuffer } from "@react-pdf/renderer";
import type { DatosInforme, TemaInforme } from "./informe.service";

// Mismo patrón que temario/pdf/temario-pdf.util.ts: createElement en vez de
// JSX y componentes como `any` (varias instancias de @types/react en el
// monorepo).
const Doc = Document as any;
const Pag = Page as any;
const V = View as any;
const T = Text as any;
const S = Svg as any;
const C = Circle as any;

// Informe pensado para leerse e imprimirse: fondo claro, cabecera con los
// colores de marca (Nocturne) y un semáforo verde / ámbar / rojo para los
// porcentajes. Helvetica (WinAnsi): sin caracteres fuera de esa tabla
// (nada de "≥", flechas ni emojis).
const COLOR = {
  ink: "#161826",
  texto: "#1f2130",
  suave: "#5f6378",
  tenue: "#8a8ea3",
  borde: "#e4e7f5",
  fondoSuave: "#f6f6fc",
  acento: "#9184d9",
  acentoOscuro: "#5d5294",
  acentoTinte: "#efedfb",
  verde: "#16a34a",
  verdeTinte: "#e8f6ee",
  ambar: "#d97706",
  ambarTinte: "#fdf3e4",
  rojo: "#dc2626",
  rojoTinte: "#fdecec",
};

const ANCHO_UTIL = 595 - 2 * 40;

const s = StyleSheet.create({
  // Sin lineHeight a nivel de página: con él, react-pdf deja de pintar los
  // elementos fijos (el pie). Cada texto largo lleva el suyo.
  pagina: { paddingTop: 0, paddingBottom: 54, paddingHorizontal: 40, fontSize: 9.5, color: COLOR.texto },
  cabecera: { backgroundColor: COLOR.ink, marginHorizontal: -40, paddingHorizontal: 40, paddingTop: 26, paddingBottom: 22, marginBottom: 18 },
  marca: { flexDirection: "row", alignItems: "center", marginBottom: 14 },
  marcaTexto: { fontSize: 12, fontFamily: "Helvetica-Bold", color: "#e9e9ed", marginLeft: 4 },
  titulo: { fontSize: 22, lineHeight: 1.2, fontFamily: "Helvetica-Bold", color: "#ffffff" },
  subtitulo: { fontSize: 10, lineHeight: 1.3, color: "#b2b6ca", marginTop: 4 },
  meta: { flexDirection: "row", marginTop: 12 },
  metaItem: { marginRight: 22 },
  metaEtiqueta: { fontSize: 7, color: "#8a8ea3", textTransform: "uppercase", letterSpacing: 0.6 },
  metaValor: { fontSize: 9.5, color: "#e9e9ed", marginTop: 2 },
  seccion: { marginTop: 18 },
  seccionTitulo: { fontSize: 12.5, lineHeight: 1.3, fontFamily: "Helvetica-Bold", color: COLOR.ink, marginBottom: 2 },
  seccionNota: { fontSize: 8.5, lineHeight: 1.4, color: COLOR.suave, marginBottom: 8 },
  vistazo: { backgroundColor: COLOR.acentoTinte, borderLeftWidth: 3, borderLeftColor: COLOR.acento, borderRadius: 4, padding: 10 },
  vistazoTitulo: { fontSize: 8, fontFamily: "Helvetica-Bold", color: COLOR.acentoOscuro, textTransform: "uppercase", letterSpacing: 0.6, marginBottom: 3 },
  vistazoTexto: { fontSize: 10, color: COLOR.texto, lineHeight: 1.5 },
  kpis: { flexDirection: "row", flexWrap: "wrap", marginHorizontal: -4, marginTop: 12 },
  kpi: { width: "33.33%", padding: 4 },
  kpiCaja: { borderWidth: 1, borderColor: COLOR.borde, borderRadius: 6, padding: 10, backgroundColor: "#ffffff" },
  kpiValor: { fontSize: 20, lineHeight: 1.15, fontFamily: "Helvetica-Bold", color: COLOR.ink },
  kpiEtiqueta: { fontSize: 8.5, color: COLOR.suave, marginTop: 2 },
  kpiPista: { fontSize: 7.5, color: COLOR.tenue, marginTop: 1 },
  columnas: { flexDirection: "row", marginHorizontal: -5 },
  columna: { flex: 1, paddingHorizontal: 5 },
  tarjeta: { borderRadius: 6, padding: 10, borderWidth: 1 },
  tarjetaTitulo: { fontSize: 9.5, fontFamily: "Helvetica-Bold", marginBottom: 6 },
  filaTema: { marginBottom: 7 },
  filaTemaCabecera: { flexDirection: "row", justifyContent: "space-between", marginBottom: 3 },
  filaTemaNombre: { fontSize: 8.5, lineHeight: 1.3, color: COLOR.texto, flex: 1, paddingRight: 6 },
  filaTemaPct: { fontSize: 8.5, fontFamily: "Helvetica-Bold" },
  barraFondo: { height: 5, borderRadius: 3, backgroundColor: "#ffffff" },
  vacio: { fontSize: 8.5, color: COLOR.suave, fontStyle: "italic" },
  tabla: { borderWidth: 1, borderColor: COLOR.borde, borderRadius: 6 },
  tablaCabecera: { flexDirection: "row", backgroundColor: COLOR.fondoSuave, borderBottomWidth: 1, borderBottomColor: COLOR.borde, paddingVertical: 6, paddingHorizontal: 8 },
  tablaFila: { flexDirection: "row", alignItems: "center", paddingVertical: 6, paddingHorizontal: 8, borderBottomWidth: 1, borderBottomColor: COLOR.borde },
  th: { fontSize: 7, fontFamily: "Helvetica-Bold", color: COLOR.suave, textTransform: "uppercase", letterSpacing: 0.4 },
  td: { fontSize: 8.5, lineHeight: 1.35, color: COLOR.texto },
  pregunta: { borderWidth: 1, borderColor: COLOR.borde, borderRadius: 6, padding: 9, marginBottom: 6 },
  preguntaCabecera: { flexDirection: "row", justifyContent: "space-between", marginBottom: 3 },
  etiqueta: { fontSize: 7, fontFamily: "Helvetica-Bold", borderRadius: 3, paddingHorizontal: 5, paddingVertical: 1.5 },
  leyenda: { flexDirection: "row", alignItems: "center", marginRight: 12 },
  punto: { width: 7, height: 7, borderRadius: 3.5, marginRight: 4 },
  pie: { position: "absolute", bottom: 22, left: 40, right: 40, flexDirection: "row", justifyContent: "space-between", fontSize: 7.5, color: COLOR.tenue, borderTopWidth: 1, borderTopColor: COLOR.borde, paddingTop: 6 },
});

const FECHA_LARGA = new Intl.DateTimeFormat("es-ES", { timeZone: "Europe/Madrid", day: "numeric", month: "long", year: "numeric" });
const FECHA_HORA = new Intl.DateTimeFormat("es-ES", { timeZone: "Europe/Madrid", day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" });
const FECHA_CORTA = new Intl.DateTimeFormat("es-ES", { timeZone: "UTC", day: "numeric", month: "short" });
const MES = new Intl.DateTimeFormat("es-ES", { timeZone: "UTC", month: "short", year: "2-digit" });

/** "YYYY-MM-DD" → fecha a mediodía UTC (sin saltos por zona horaria). */
const deClave = (clave: string) => new Date(`${clave.length === 7 ? `${clave}-01` : clave}T12:00:00Z`);

function colorPct(pct: number) {
  if (pct >= 70) return { color: COLOR.verde, tinte: COLOR.verdeTinte };
  if (pct >= 50) return { color: COLOR.ambar, tinte: COLOR.ambarTinte };
  return { color: COLOR.rojo, tinte: COLOR.rojoTinte };
}

const fmt = (n: number) => n.toLocaleString("es-ES");
const fmtNota = (n: number | null) => (n === null ? "-" : n.toLocaleString("es-ES", { minimumFractionDigits: 1, maximumFractionDigits: 1 }));

function logo(tam = 14) {
  return h(S, { width: tam, height: tam, viewBox: "0 0 44 44" },
    h(C, { cx: 22, cy: 22, r: 18, fill: COLOR.acento }),
    h(C, { cx: 22, cy: 22, r: 11.5, fill: COLOR.ink }));
}

function seccion(titulo: string, nota: string | null, ...hijos: ReactNode[]) {
  return seccionCon(false, titulo, nota, ...hijos);
}

/** Igual que seccion(), pero sin partir entre páginas (gráficos). */
function seccionJunta(titulo: string, nota: string | null, ...hijos: ReactNode[]) {
  return seccionCon(true, titulo, nota, ...hijos);
}

function seccionCon(junta: boolean, titulo: string, nota: string | null, ...hijos: ReactNode[]) {
  return h(V, { style: s.seccion, wrap: !junta },
    h(V, { wrap: false, minPresenceAhead: 60 },
      h(T, { style: s.seccionTitulo }, titulo),
      nota ? h(T, { style: s.seccionNota }, nota) : h(V, { style: { height: 6 } })),
    ...hijos);
}

function barra(pct: number, color: string, fondo = "#ffffff", alto = 5) {
  return h(V, { style: [s.barraFondo, { backgroundColor: fondo, height: alto }] },
    h(V, { style: { width: `${Math.max(2, Math.min(100, pct))}%`, height: alto, borderRadius: alto / 2, backgroundColor: color } }));
}

function kpi(valor: string, etiqueta: string, pista: string, color: string = COLOR.ink) {
  return h(V, { style: s.kpi },
    h(V, { style: s.kpiCaja },
      h(T, { style: [s.kpiValor, { color }] }, valor),
      h(T, { style: s.kpiEtiqueta }, etiqueta),
      h(T, { style: s.kpiPista }, pista)));
}

function nombreTema(t: TemaInforme, conOposicion: boolean) {
  return conOposicion && t.oposicion ? `${t.titulo} (${t.oposicion})` : t.titulo;
}

function listaTemas(temas: TemaInforme[], conOposicion: boolean, siVacia: string): ReactNode[] {
  if (!temas.length) return [h(T, { key: "vacio", style: s.vacio }, siVacia)];
  return temas.map((t, i) => {
    const { color } = colorPct(t.porcentaje);
    return h(V, { key: i, style: s.filaTema },
      h(V, { style: s.filaTemaCabecera },
        h(T, { style: s.filaTemaNombre }, nombreTema(t, conOposicion)),
        h(T, { style: [s.filaTemaPct, { color }] }, `${t.porcentaje} %`)),
      barra(t.porcentaje, color),
      h(T, { style: { fontSize: 7.5, color: COLOR.suave, marginTop: 2 } },
        `${fmt(t.aciertos)} de ${fmt(t.respondidas)} preguntas acertadas`));
  });
}

/** Gráfico de barras hecho con cajas (más fiable que SVG en react-pdf). */
function grafico(
  datos: DatosInforme,
  valor: (a: DatosInforme["actividad"][number]) => { total: number; partes?: { v: number; color: string }[] },
  alto = 92,
) {
  const n = datos.actividad.length;
  const max = Math.max(1, ...datos.actividad.map((a) => valor(a).total));
  const ejeY = 22;
  const ancho = ANCHO_UTIL - ejeY;
  const col = ancho / Math.max(1, n);
  const hueco = n > 45 ? 0.6 : n > 20 ? 1.5 : 4;
  const cadaCuanto = n <= 7 ? 1 : n <= 31 ? 5 : n <= 92 ? 15 : Math.ceil(n / 8);
  const etiqueta = (clave: string) => (datos.agrupacion === "mes" ? MES.format(deClave(clave)) : FECHA_CORTA.format(deClave(clave)));
  const lineas = [0, 0.5, 1];

  return h(V, { wrap: false },
    h(V, { style: { flexDirection: "row", height: alto } },
      // Eje Y: máximo, mitad y cero.
      h(V, { style: { width: ejeY, height: alto, position: "relative" } },
        ...lineas.map((f, i) => h(T, { key: i, style: { position: "absolute", top: alto - f * alto - 4, right: 4, fontSize: 6.5, color: COLOR.tenue } },
          f === 0.5 && max % 2 ? "" : fmt(Math.round(max * f))))),
      h(V, { style: { width: ancho, height: alto, position: "relative" } },
        ...lineas.map((f, i) => h(V, { key: `l${i}`, style: { position: "absolute", left: 0, right: 0, top: alto - f * alto, borderTopWidth: f === 0 ? 1 : 0.5, borderTopColor: f === 0 ? "#cfd3e5" : COLOR.borde } })),
        h(V, { style: { position: "absolute", left: 0, right: 0, bottom: 0, height: alto, flexDirection: "row", alignItems: "flex-end" } },
          ...datos.actividad.map((a, i) => {
            const { total, partes } = valor(a);
            const altura = (total / max) * (alto - 2);
            return h(V, { key: i, style: { width: col, paddingHorizontal: hueco / 2, height: alto, justifyContent: "flex-end" } },
              total > 0
                ? h(V, { style: { height: altura, borderTopLeftRadius: 1.5, borderTopRightRadius: 1.5, overflow: "hidden", flexDirection: "column-reverse" } },
                    ...(partes ?? [{ v: total, color: COLOR.acento }]).map((p, j) =>
                      h(V, { key: j, style: { height: (p.v / total) * altura, backgroundColor: p.color } })))
                : null);
          })))),
    // Eje X: fechas espaciadas.
    h(V, { style: { flexDirection: "row", marginLeft: ejeY, height: 12, position: "relative" } },
      ...datos.actividad.map((a, i) =>
        i % cadaCuanto === 0 || i === n - 1
          ? h(T, { key: i, style: { position: "absolute", left: Math.min(ancho - 40, Math.max(0, (i + 0.5) * col - 20)), width: 40, top: 3, fontSize: 6.5, color: COLOR.tenue, textAlign: "center" } }, etiqueta(a.clave))
          : null)));
}

function leyenda(items: { color: string; texto: string }[]) {
  return h(V, { style: { flexDirection: "row", marginTop: 6 } },
    ...items.map((it, i) => h(V, { key: i, style: s.leyenda },
      h(V, { style: [s.punto, { backgroundColor: it.color }] }),
      h(T, { style: { fontSize: 7.5, color: COLOR.suave } }, it.texto))));
}

function textoPeriodo(d: DatosInforme) {
  if (d.dias === 0) return d.desde ? `Desde el ${FECHA_LARGA.format(deClave(d.desde))}` : "Todo el historial";
  return `Últimos ${d.dias} días (${FECHA_CORTA.format(deClave(d.desde!))} - ${FECHA_CORTA.format(deClave(d.hasta))})`;
}

function deUnVistazo(d: DatosInforme): string {
  const k = d.kpis;
  if (k.tests === 0 && k.respondidas === 0) {
    return "En este periodo todavía no has hecho ningún test. Haz tu primer test desde el temario y este informe empezará a mostrar tu evolución tema a tema.";
  }
  const partes = [
    `Has hecho ${fmt(k.tests)} ${k.tests === 1 ? "test" : "tests"} y respondido ${fmt(k.respondidas)} preguntas, con un ${k.porcentaje ?? 0} % de aciertos.`,
  ];
  if (d.mejores[0]) partes.push(`Tu punto fuerte es "${d.mejores[0].titulo}" (${d.mejores[0].porcentaje} %).`);
  if (d.peores[0]) partes.push(`Donde más te conviene insistir: "${d.peores[0].titulo}" (${d.peores[0].porcentaje} %).`);
  if (k.racha > 1) partes.push(`Llevas ${k.racha} días seguidos estudiando: sigue así.`);
  return partes.join(" ");
}

export async function generarInformePdf(d: DatosInforme): Promise<Buffer> {
  const k = d.kpis;
  const variasOposiciones = d.oposiciones.length > 1;
  const pct = k.porcentaje;
  const colorAcierto = pct === null ? COLOR.ink : colorPct(pct).color;
  const hayActividad = d.actividad.some((a) => a.tests > 0 || a.aciertos + a.fallos > 0);
  const unidad = d.agrupacion === "mes" ? "mes" : "día";

  const doc = h(Doc, { title: "Informe de progreso - Oponow", author: "Oponow", subject: d.email },
    h(Pag, { size: "A4", style: s.pagina, wrap: true },
      // Pie
      h(V, { style: s.pie, fixed: true },
        h(T, {}, `Oponow · Informe de progreso de ${d.email}`),
        h(T, { render: ({ pageNumber, totalPages }: { pageNumber: number; totalPages: number }) => `Página ${pageNumber} de ${totalPages}` })),

      // Cabecera
      h(V, { style: s.cabecera },
        h(V, { style: s.marca }, logo(), h(T, { style: s.marcaTexto }, "ponow")),
        h(T, { style: s.titulo }, "Informe de progreso"),
        h(T, { style: s.subtitulo }, d.oposiciones.length ? d.oposiciones.join(" · ") : "Preparación de oposiciones"),
        h(V, { style: s.meta },
          h(V, { style: s.metaItem }, h(T, { style: s.metaEtiqueta }, "Opositor"), h(T, { style: s.metaValor }, d.email || "-")),
          h(V, { style: s.metaItem }, h(T, { style: s.metaEtiqueta }, "Periodo"), h(T, { style: s.metaValor }, textoPeriodo(d))),
          h(V, { style: s.metaItem }, h(T, { style: s.metaEtiqueta }, "Generado"), h(T, { style: s.metaValor }, FECHA_HORA.format(d.generado))))),

      // De un vistazo
      h(V, { style: s.vistazo, wrap: false },
        h(T, { style: s.vistazoTitulo }, "De un vistazo"),
        h(T, { style: s.vistazoTexto }, deUnVistazo(d))),

      // Cifras clave
      h(V, { style: s.kpis, wrap: false },
        kpi(fmt(k.tests), "Tests realizados", `${k.diasActivos} ${k.diasActivos === 1 ? "día" : "días"} con actividad`),
        kpi(pct === null ? "-" : `${pct} %`, "Aciertos", pct === null ? "Sin respuestas todavía" : pct >= 70 ? "Buen nivel" : pct >= 50 ? "Vas por buen camino" : "Hay margen de mejora", colorAcierto),
        kpi(`${fmtNota(k.notaMedia)}`, "Nota media (sobre 10)", "Cada fallo resta 1/3, como en el examen"),
        kpi(fmt(k.respondidas), "Preguntas respondidas", `${fmt(k.aciertos)} aciertos · ${fmt(k.fallos)} fallos`),
        kpi(fmt(k.fallos), "Fallos", k.respondidas ? `${100 - (pct ?? 0)} % de las respuestas` : "-", k.fallos ? COLOR.rojo : COLOR.ink),
        kpi(`${k.racha}`, k.racha === 1 ? "Día de racha" : "Días de racha", "Días seguidos haciendo tests")),

      // Mejor / peor
      seccion("Temas: lo que mejor y peor llevas", `Según tu porcentaje de aciertos en el periodo (temas con al menos 5 preguntas respondidas cuando es posible).`,
        h(V, { style: s.columnas, wrap: false },
          h(V, { style: s.columna },
            h(V, { style: [s.tarjeta, { backgroundColor: COLOR.verdeTinte, borderColor: "#c9ebd6" }] },
              h(T, { style: [s.tarjetaTitulo, { color: COLOR.verde }] }, "Lo que mejor llevas"),
              ...listaTemas(d.mejores, variasOposiciones, d.temas.some((t) => t.respondidas) ? "Todavía ningún tema llega al 50 % de aciertos." : "Aún no hay datos suficientes."))),
          h(V, { style: s.columna },
            h(V, { style: [s.tarjeta, { backgroundColor: COLOR.rojoTinte, borderColor: "#f6cfcf" }] },
              h(T, { style: [s.tarjetaTitulo, { color: COLOR.rojo }] }, "Lo que más te cuesta"),
              ...listaTemas(d.peores, variasOposiciones, d.temas.some((t) => t.respondidas) ? "Ningún tema por debajo del 70 %. Buen trabajo." : "Aún no hay datos suficientes."))))),

      // Actividad
      seccionJunta(`Tests realizados por ${unidad}`, hayActividad ? null : "Sin actividad en este periodo.",
        hayActividad
          ? h(V, { wrap: false }, grafico(d, (a) => ({ total: a.tests })), leyenda([{ color: COLOR.acento, texto: `Tests completados cada ${unidad}` }]))
          : null),
      hayActividad
        ? seccionJunta(`Aciertos y fallos por ${unidad}`, null,
            h(V, { wrap: false },
              grafico(d, (a) => ({ total: a.aciertos + a.fallos, partes: [{ v: a.aciertos, color: "#4ade80" }, { v: a.fallos, color: "#f87171" }] }), 80),
              leyenda([{ color: "#4ade80", texto: "Aciertos" }, { color: "#f87171", texto: "Fallos" }])))
        : null,

      // Rendimiento por tema
      seccion("Rendimiento por tema", "Todos los temas en los que has hecho algún test en el periodo.",
        d.temas.length
          ? h(V, { style: s.tabla },
              h(V, { style: s.tablaCabecera, fixed: false, wrap: false },
                h(T, { style: [s.th, { flex: 1 }] }, "Tema"),
                h(T, { style: [s.th, { width: 34, textAlign: "right" }] }, "Tests"),
                h(T, { style: [s.th, { width: 44, textAlign: "right" }] }, "Aciertos"),
                h(T, { style: [s.th, { width: 38, textAlign: "right" }] }, "Fallos"),
                h(T, { style: [s.th, { width: 110, paddingLeft: 12 }] }, "% de aciertos"),
                h(T, { style: [s.th, { width: 34, textAlign: "right" }] }, "Nota")),
              ...d.temas.map((t, i) => {
                const { color, tinte } = colorPct(t.porcentaje);
                return h(V, { key: i, style: [s.tablaFila, i === d.temas.length - 1 ? { borderBottomWidth: 0 } : {}], wrap: false },
                  h(V, { style: { flex: 1, paddingRight: 6, flexDirection: "row", alignItems: "center" } },
                    h(V, { style: [s.punto, { backgroundColor: t.respondidas ? color : COLOR.tenue }] }),
                    h(T, { style: [s.td, { flex: 1 }] }, nombreTema(t, variasOposiciones))),
                  h(T, { style: [s.td, { width: 34, textAlign: "right" }] }, fmt(t.tests)),
                  h(T, { style: [s.td, { width: 44, textAlign: "right", color: COLOR.verde }] }, fmt(t.aciertos)),
                  h(T, { style: [s.td, { width: 38, textAlign: "right", color: t.fallos ? COLOR.rojo : COLOR.texto }] }, fmt(t.fallos)),
                  h(V, { style: { width: 110, paddingLeft: 12, flexDirection: "row", alignItems: "center" } },
                    h(V, { style: { flex: 1 } }, barra(t.porcentaje, color, tinte, 6)),
                    h(T, { style: [s.td, { width: 30, textAlign: "right", fontFamily: "Helvetica-Bold", color }] }, t.respondidas ? `${t.porcentaje} %` : "-")),
                  h(T, { style: [s.td, { width: 34, textAlign: "right" }] }, fmtNota(t.notaMedia)));
              }))
          : h(T, { style: s.vacio }, "Todavía no hay tests en este periodo.")),

      // Fallos
      seccion("Resumen de fallos", null,
        h(V, { style: s.columnas, wrap: false },
          h(V, { style: s.columna },
            h(V, { style: [s.tarjeta, { borderColor: COLOR.borde }] },
              h(T, { style: [s.kpiValor, { color: k.fallos ? COLOR.rojo : COLOR.ink }] }, fmt(k.fallos)),
              h(T, { style: s.kpiEtiqueta }, "Preguntas falladas en el periodo"))),
          h(V, { style: s.columna },
            h(V, { style: [s.tarjeta, { borderColor: COLOR.borde }] },
              (() => {
                const peor = [...d.temas].sort((a, b) => b.fallos - a.fallos)[0];
                return peor && peor.fallos
                  ? [h(T, { key: "a", style: [s.td, { fontFamily: "Helvetica-Bold" }] }, peor.titulo),
                     h(T, { key: "b", style: s.kpiEtiqueta }, `Tema con más fallos (${fmt(peor.fallos)})`)]
                  : [h(T, { key: "a", style: s.vacio }, "Sin fallos en este periodo.")];
              })()))),
        h(V, { style: { marginTop: 10 } },
          h(T, { style: [s.tarjetaTitulo, { color: COLOR.ink }] }, "Preguntas que más se te resisten"),
          ...(d.masFalladas === null
            ? [h(T, { key: "x", style: s.vacio }, "El detalle de las preguntas falladas está incluido en los planes Lite y VIP.")]
            : d.masFalladas.length === 0
              ? [h(T, { key: "x", style: s.vacio }, "Ninguna: no has fallado preguntas en este periodo.")]
              : d.masFalladas.map((p, i) =>
                  h(V, { key: i, style: s.pregunta, wrap: false },
                    h(V, { style: s.preguntaCabecera },
                      h(T, { style: { fontSize: 7.5, color: COLOR.suave, flex: 1, paddingRight: 8 } }, p.tema),
                      h(T, { style: [s.etiqueta, { color: COLOR.rojo, backgroundColor: COLOR.rojoTinte }] }, p.veces === 1 ? "Fallada 1 vez" : `Fallada ${p.veces} veces`)),
                    h(T, { style: [s.td, { marginBottom: 3 }] }, p.enunciado),
                    h(T, { style: { fontSize: 8, color: COLOR.verde } }, `Respuesta correcta: ${p.correcta}`)))))),

      // Flashcards
      d.flashcards
        ? seccionJunta("Flashcards", "Tarjetas de repaso espaciado.",
            h(V, { style: [s.kpis, { marginTop: 0 }], wrap: false },
              kpi(fmt(d.flashcards.estudiadas), "Tarjetas estudiadas", "Al menos una vez"),
              kpi(fmt(d.flashcards.dominadas), "Dominadas", "Repaso a 16 días o más", COLOR.verde),
              kpi(fmt(d.flashcards.pendientes), "Pendientes de repasar", "Ya toca volver a verlas", d.flashcards.pendientes ? COLOR.ambar : COLOR.ink)))
        : null,

      // Cómo leer el informe
      h(V, { style: [s.seccion, { backgroundColor: COLOR.fondoSuave, borderRadius: 6, padding: 10 }], wrap: false },
        h(T, { style: [s.tarjetaTitulo, { color: COLOR.ink, marginBottom: 4 }] }, "Cómo leer este informe"),
        leyenda([
          { color: COLOR.verde, texto: "70 % de aciertos o más: dominado" },
          { color: COLOR.ambar, texto: "Del 50 al 69 %: repasar" },
          { color: COLOR.rojo, texto: "Menos del 50 %: prioridad" },
        ]),
        h(T, { style: { fontSize: 7.5, color: COLOR.suave, marginTop: 6 } },
          "La nota sobre 10 se calcula como en el examen: cada fallo resta un tercio de acierto y las preguntas en blanco no puntúan. Los días se cuentan en hora peninsular española."))));

  return renderToBuffer(doc);
}
