// Datos de demostración para el panel de contabilidad, SOLO en modo prueba:
// clientes con suscripciones sobre "relojes de prueba" de Stripe que se
// adelantan mes a mes, para tener cobros de los últimos meses.
//   node apps/api/scripts/stripe-demo-contabilidad.mjs           → crea
//   node apps/api/scripts/stripe-demo-contabilidad.mjs --borrar  → borra todo
// Borrar un reloj de prueba elimina sus clientes, suscripciones y facturas.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");
const env = Object.fromEntries(fs.readFileSync(path.join(raiz, ".env"), "utf8").split(/\r?\n/).filter((l) => /^[A-Z_]+=/.test(l)).map((l) => [l.slice(0, l.indexOf("=")), l.slice(l.indexOf("=") + 1)]));
const CLAVE = process.env.STRIPE_SECRET_KEY ?? env.STRIPE_SECRET_KEY;
if (!CLAVE?.startsWith("sk_test_")) throw new Error("Solo se ejecuta con una clave de PRUEBA (sk_test_…)");

function form(obj, prefijo = "", salida = new URLSearchParams()) {
  for (const [k, v] of Object.entries(obj)) {
    const clave = prefijo ? `${prefijo}[${k}]` : k;
    if (Array.isArray(v)) v.forEach((x, i) => (x && typeof x === "object" ? form(x, `${clave}[${i}]`, salida) : salida.append(`${clave}[${i}]`, String(x))));
    else if (v && typeof v === "object") form(v, clave, salida);
    else if (v !== undefined) salida.append(clave, String(v));
  }
  return salida;
}
async function stripe(metodo, ruta, datos) {
  const res = await fetch(`https://api.stripe.com/v1${ruta}`, {
    method: metodo,
    headers: { Authorization: `Bearer ${CLAVE}`, "Content-Type": "application/x-www-form-urlencoded" },
    body: datos ? form(datos) : undefined,
  });
  const json = await res.json();
  if (json.error) throw new Error(`${metodo} ${ruta}: ${json.error.message}`);
  return json;
}
const esperar = (ms) => new Promise((r) => setTimeout(r, ms));
async function listo(reloj) {
  for (let i = 0; i < 120; i++) {
    const r = await stripe("GET", `/test_helpers/test_clocks/${reloj}`);
    if (r.status === "ready") return r;
    if (r.status === "internal_failure") throw new Error("El reloj de prueba ha fallado");
    await esperar(2000);
  }
  throw new Error("El reloj de prueba no termina");
}

const relojes = await stripe("GET", "/test_helpers/test_clocks?limit=100");
const demos = relojes.data.filter((r) => r.name?.startsWith("Oponow demo contabilidad"));
if (process.argv.includes("--borrar")) {
  for (const r of demos) {
    await stripe("DELETE", `/test_helpers/test_clocks/${r.id}`);
    console.log("✓ borrado", r.name);
  }
  console.log(demos.length ? "Datos de demostración eliminados." : "No había datos de demostración.");
  process.exit(0);
}
if (demos.length) {
  console.log("Ya hay datos de demostración (usa --borrar para quitarlos).");
  process.exit(0);
}

const precios = await stripe("GET", "/prices?lookup_keys[]=oponow_mensual&lookup_keys[]=oponow_anual");
const precio = Object.fromEntries(precios.data.map((p) => [p.lookup_key === "oponow_anual" ? "anual" : "mensual", p.id]));
const MES = 30 * 86_400;
const ahora = Math.floor(Date.now() / 1000);
const inicio = ahora - 7 * MES;

// Quién se suscribe, cuándo (meses después del inicio) y qué pasa después.
const CLIENTES = [
  { nombre: "Lucía (demo)", op: "tai", ciclo: "mensual", mes: 0 },
  { nombre: "Marcos (demo)", op: "auxiliar-administrativo", ciclo: "mensual", mes: 1 },
  { nombre: "Sara (demo)", op: "tai", ciclo: "anual", mes: 1 },
  { nombre: "Iván (demo)", op: "correos", ciclo: "mensual", mes: 2, bajaMes: 5 },
  { nombre: "Elena (demo)", op: "administrativo-estado", ciclo: "mensual", mes: 3 },
  { nombre: "Pablo (demo)", op: "auxiliar-administrativo", ciclo: "anual", mes: 4 },
  { nombre: "Nuria (demo)", op: "tai", ciclo: "mensual", mes: 5, cancelarAlFinal: true },
];

// Un reloj por cliente: cada uno empieza su suscripción en su mes.
for (const c of CLIENTES) {
  const alta = inicio + c.mes * MES;
  const reloj = await stripe("POST", "/test_helpers/test_clocks", { frozen_time: alta, name: `Oponow demo contabilidad · ${c.nombre}` });
  const email = `demo.contabilidad+${c.nombre.split(" ")[0].toLowerCase()}@oponow.com`;
  const cliente = await stripe("POST", "/customers", { name: c.nombre, email, test_clock: reloj.id, payment_method: "pm_card_visa", invoice_settings: { default_payment_method: "pm_card_visa" }, metadata: { demo: "contabilidad" } });
  const sub = await stripe("POST", "/subscriptions", {
    customer: cliente.id,
    items: [{ price: precio[c.ciclo] }],
    trial_period_days: 7,
    metadata: { oposicionSlug: c.op, ciclo: c.ciclo, demo: "contabilidad" },
  });
  // Se adelanta el reloj hasta hoy (de dos en dos meses, que es lo que
  // admite Stripe con suscripciones mensuales), dando de baja a mitad si toca.
  let t = alta;
  let bajaHecha = false;
  while (t < ahora) {
    t = Math.min(ahora, t + 2 * MES - 86_400);
    if (c.bajaMes && !bajaHecha && t >= inicio + c.bajaMes * MES) {
      bajaHecha = true;
      await stripe("POST", `/test_helpers/test_clocks/${reloj.id}/advance`, { frozen_time: inicio + c.bajaMes * MES });
      await listo(reloj.id);
      await stripe("DELETE", `/subscriptions/${sub.id}`);
      t = Math.max(t, inicio + c.bajaMes * MES);
      if (t >= ahora) break;
    }
    await stripe("POST", `/test_helpers/test_clocks/${reloj.id}/advance`, { frozen_time: t });
    await listo(reloj.id);
  }
  if (c.cancelarAlFinal) await stripe("POST", `/subscriptions/${sub.id}`, { cancel_at_period_end: true });
  console.log(`✓ ${c.nombre}: ${c.ciclo} (${c.op})${c.bajaMes ? ", baja" : ""}${c.cancelarAlFinal ? ", cancelación programada" : ""}`);
}
console.log("Datos de demostración creados.");
