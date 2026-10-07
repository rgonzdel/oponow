// Prepara la cuenta de Stripe para Oponow: producto, precios (mensual y
// anual) y portal de cliente. Se puede ejecutar las veces que haga falta
// (no duplica nada) y sirve igual para modo prueba que para modo real:
//   node apps/api/scripts/stripe-configurar.mjs
// Lee STRIPE_SECRET_KEY del .env de la raíz.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");
const env = Object.fromEntries(
  fs.readFileSync(path.join(raiz, ".env"), "utf8").split(/\r?\n/).filter((l) => /^[A-Z_]+=/.test(l)).map((l) => [l.slice(0, l.indexOf("=")), l.slice(l.indexOf("=") + 1)]),
);
const CLAVE = process.env.STRIPE_SECRET_KEY ?? env.STRIPE_SECRET_KEY;
if (!CLAVE) throw new Error("Falta STRIPE_SECRET_KEY en el .env");
const WEB = process.env.WEB_PUBLICA ?? "https://www.oponow.com";

// Mismos precios que packages/shared-types/src/pricing.ts (IVA incluido).
// Código fiscal del producto (catálogo de Stripe): formación de autoestudio
// por internet. Lo exige Managed Payments (Stripe como vendedor legal).
const TAX_CODE = "txcd_20060058"; // Training Services - Self-study Web-based

const PRECIOS = [
  { lookup: "oponow_mensual", importe: 499, intervalo: "month", nombre: "Mensual" },
  { lookup: "oponow_anual", importe: 3999, intervalo: "year", nombre: "Anual" },
];

function form(obj, prefijo = "", salida = new URLSearchParams()) {
  for (const [k, v] of Object.entries(obj)) {
    const clave = prefijo ? `${prefijo}[${k}]` : k;
    if (v && typeof v === "object") form(v, clave, salida);
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
  if (json.error) throw new Error(`${ruta}: ${json.error.message}`);
  return json;
}

const modo = CLAVE.startsWith("sk_live_") ? "REAL" : "prueba";
console.log(`Stripe en modo ${modo}`);

// Producto (uno solo: "Oponow"). Se localiza por sus precios o recorriendo
// la lista: la búsqueda de Stripe tarda unos segundos en indexar uno nuevo
// y daría lugar a duplicados.
const existentes = await stripe("GET", "/prices?" + PRECIOS.map((p) => `lookup_keys[]=${p.lookup}`).join("&"));
let producto = existentes.data[0] ? await stripe("GET", `/products/${existentes.data[0].product}`) : null;
if (!producto) {
  const lista = await stripe("GET", "/products?limit=100&active=true");
  producto = lista.data.find((p) => p.metadata?.app === "oponow") ?? null;
}
if (!producto) {
  producto = await stripe("POST", "/products", {
    name: "Oponow",
    tax_code: TAX_CODE,
    description: "Temario completo, tests ilimitados y preguntas reales de examen de la oposición que elijas.",
    metadata: { app: "oponow" },
  });
  console.log("✓ producto creado:", producto.id);
} else {
  if (producto.tax_code !== TAX_CODE) await stripe("POST", `/products/${producto.id}`, { tax_code: TAX_CODE });
  console.log("· producto ya existía:", producto.id, "(código fiscal", TAX_CODE + ")");
}

// Precios, identificados por lookup_key (la API los busca por esa clave).
for (const p of PRECIOS) {
  const ya = existentes.data.find((x) => x.lookup_key === p.lookup);
  if (ya && ya.unit_amount === p.importe && ya.recurring?.interval === p.intervalo) {
    console.log(`· precio ${p.lookup} ya existía: ${ya.id}`);
    continue;
  }
  const nuevo = await stripe("POST", "/prices", {
    product: producto.id,
    currency: "eur",
    unit_amount: p.importe,
    tax_behavior: "inclusive",
    recurring: { interval: p.intervalo },
    nickname: p.nombre,
    lookup_key: p.lookup,
    // Si el precio cambia, la clave pasa al nuevo y el antiguo queda para
    // las suscripciones que ya lo usan.
    transfer_lookup_key: true,
  });
  console.log(`✓ precio ${p.lookup} creado: ${nuevo.id} (${p.importe / 100} €/${p.intervalo === "month" ? "mes" : "año"})`);
}

// Portal de cliente: cambiar tarjeta, ver facturas y cancelar al final del
// periodo pagado. El email lo gestiona Oponow ("Mi cuenta"), no Stripe.
const portal = {
  business_profile: {
    headline: "Gestiona tu suscripción a Oponow",
    privacy_policy_url: `${WEB}/legal/privacidad`,
    terms_of_service_url: `${WEB}/legal/terminos`,
  },
  default_return_url: `${WEB}/cuenta`,
  features: {
    customer_update: { enabled: false },
    invoice_history: { enabled: true },
    payment_method_update: { enabled: true },
    subscription_cancel: {
      enabled: true,
      mode: "at_period_end",
      cancellation_reason: {
        enabled: true,
        options: ["too_expensive", "unused", "switched_service", "other"],
      },
    },
  },
  metadata: { app: "oponow" },
};
const configs = await stripe("GET", "/billing_portal/configurations?limit=100");
const propia = configs.data.find((c) => c.metadata?.app === "oponow");
if (propia) {
  await stripe("POST", `/billing_portal/configurations/${propia.id}`, portal);
  console.log("· portal de cliente actualizado:", propia.id);
} else {
  const nueva = await stripe("POST", "/billing_portal/configurations", portal);
  console.log("✓ portal de cliente creado:", nueva.id);
}
// Webhook (opcional): node stripe-configurar.mjs --webhook <url>
// Lo crea si no existe y guarda su secreto de firma en el .env (sin
// mostrarlo): hay que copiarlo a Render como STRIPE_WEBHOOK_SECRET.
const i = process.argv.indexOf("--webhook");
if (i > 0) {
  const url = process.argv[i + 1];
  const eventos = [
    "checkout.session.completed",
    "customer.subscription.created",
    "customer.subscription.updated",
    "customer.subscription.deleted",
    "customer.subscription.trial_will_end",
    "customer.updated",
    "invoice.paid",
    "invoice.payment_failed",
  ];
  const lista = await stripe("GET", "/webhook_endpoints?limit=100");
  const ya = lista.data.find((w) => w.url === url);
  if (ya) {
    await stripe("POST", `/webhook_endpoints/${ya.id}`, { enabled_events: eventos });
    console.log("· webhook ya existía (eventos actualizados):", ya.id, "— su secreto no se puede volver a leer por API; está en el panel de Stripe.");
  } else {
    const w = await stripe("POST", "/webhook_endpoints", { url, enabled_events: eventos, description: "Oponow: suscripciones" });
    const rutaEnv = path.join(raiz, ".env");
    const contenido = fs.readFileSync(rutaEnv, "utf8");
    const linea = `STRIPE_WEBHOOK_SECRET=${w.secret}`;
    fs.writeFileSync(rutaEnv, /^STRIPE_WEBHOOK_SECRET=.*$/m.test(contenido) ? contenido.replace(/^STRIPE_WEBHOOK_SECRET=.*$/m, linea) : `${contenido.trimEnd()}\n${linea}\n`);
    console.log(`✓ webhook creado: ${w.id} → ${url}. Secreto guardado en .env (STRIPE_WEBHOOK_SECRET).`);
  }
}
console.log("Listo.");
