import { useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { SiteHeader } from "../components/SiteHeader";
import { Accordion, AccordionItem } from "../components/Accordion";
import { OPOSICION_ICONS } from "../components/oposicion-icons";
import { QuestionPreviewCard } from "../components/QuestionPreviewCard";
import { buttonClass } from "../components/button";
import {
  AHORRO_ANUAL_PORCENTAJE,
  OPOSICIONES,
  PLAN_FEATURES,
  PLAN_PRECIO,
  type BillingCycle,
} from "@oponow/shared-types";

export function OposicionLandingPage() {
  const { slug = "" } = useParams();
  const { status } = useAuth();
  const isAuthenticated = status === "authenticated";

  const [ciclo, setCiclo] = useState<BillingCycle>("mensual");

  const op = OPOSICIONES.find((o) => o.slug === slug);
  if (!op || !op.disponible) {
    return <Navigate to="/oposiciones" replace />;
  }

  const totalTemas = op.bloques.reduce((n, b) => n + b.temas, 0);
  const checkoutTarget = `/checkout?oposicion=${op.slug}&ciclo=${ciclo}`;
  const checkoutHref = isAuthenticated
    ? checkoutTarget
    : `/register?next=${encodeURIComponent(checkoutTarget)}`;

  return (
    <div>
      <SiteHeader />

      <main>
        {/* ---------- Hero ---------- */}
        <section className="mx-auto grid max-w-5xl gap-12 px-6 py-16 lg:grid-cols-[1fr_400px] lg:items-center lg:py-24">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-accent">
              Grupo {op.grupo} · {op.organismo}
            </p>
            <h1 className="mt-3 text-4xl font-medium leading-tight tracking-tight text-ink-text">
              El temario y los tests del {op.siglas}, con los exámenes reales
              de {op.aniosExamenes.join(", ")}
            </h1>
            <p className="mt-4 text-neutral-400">
              {op.totalPreguntas} preguntas oficiales, tal cual salieron en
              el examen — anuladas incluidas, marcadas igual que en la
              plantilla del tribunal. Nada de preguntas genéricas.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link to={checkoutHref} className={buttonClass("primary")}>
                Empezar prueba gratis de 7 días
              </Link>
              {op.simulacroDisponible && (
                <Link
                  to={`/oposiciones/${op.slug}/simulacro`}
                  className={buttonClass("secondary")}
                >
                  Probar un cuestionario real
                </Link>
              )}
            </div>

            <dl className="mt-10 grid grid-cols-2 gap-x-6 gap-y-4 border-t border-ink-divider pt-6 sm:grid-cols-4">
              {[
                [String(op.totalPreguntas), "preguntas reales"],
                [String(totalTemas), "temas oficiales"],
                [String(op.aniosExamenes.length), "convocatorias"],
                ["7 días", "de prueba gratis"],
              ].map(([value, label]) => (
                <div key={label}>
                  <dt className="text-xl font-medium tracking-tight text-ink-text">
                    {value}
                  </dt>
                  <dd className="text-xs text-neutral-500">{label}</dd>
                </div>
              ))}
            </dl>
          </div>

          <QuestionPreviewCard siglas={op.siglas} />
        </section>

        {/* ---------- Diferenciadores ---------- */}
        <section className="border-y border-ink-divider bg-ink-surface/40">
          <div className="mx-auto max-w-5xl px-6 py-14">
            <h2 className="text-center text-2xl font-medium tracking-tight text-ink-text">
              Por qué Oponow
            </h2>
            <div className="mt-10 grid gap-6 sm:grid-cols-3">
              {[
                {
                  icon: OPOSICION_ICONS.fuente,
                  title: "Exámenes reales, no simulados",
                  body: `Preguntas literales de las convocatorias ${op.aniosExamenes.join(", ")}, con las anuladas marcadas exactamente igual que en la plantilla oficial.`,
                },
                {
                  icon: OPOSICION_ICONS.todoIncluido,
                  title: "Todo incluido, sin letra pequeña",
                  body: "Temario completo y tests ilimitados en un único precio. Nada de comprar el temario aparte ni complementos sueltos.",
                },
                {
                  icon: OPOSICION_ICONS.precio,
                  title: "Precio simple",
                  body: "Un precio, sin porcentajes de 'ahorro' inflados ni permanencia. Cancelas cuando quieras.",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="rounded-lg border border-ink-divider bg-ink-surface p-6"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-md border border-ink-divider text-accent">
                    {item.icon}
                  </span>
                  <h3 className="mt-4 text-sm font-medium text-ink-text">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm text-neutral-400">{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ---------- Detalle de la oposición ---------- */}
        <section className="mx-auto max-w-3xl px-6 py-16">
          <h2 className="text-2xl font-medium tracking-tight text-ink-text">
            Todo sobre el {op.siglas}
          </h2>

          <Accordion>
            <AccordionItem
              title={`Qué hace un ${op.siglas}`}
              icon={OPOSICION_ICONS.descripcion}
              defaultOpen
            >
              {op.descripcion}
            </AccordionItem>

            <AccordionItem
              title="Requisitos de acceso"
              icon={OPOSICION_ICONS.requisitos}
            >
              {op.requisitos}
            </AccordionItem>

            <AccordionItem title="Estructura del examen" icon={OPOSICION_ICONS.examen}>
              <ul className="space-y-2">
                {op.estructuraExamen.map((linea) => (
                  <li key={linea} className="flex gap-2">
                    <span className="mt-1 flex-none text-accent">•</span>
                    {linea}
                  </li>
                ))}
              </ul>
            </AccordionItem>

            <AccordionItem
              title="Temario"
              meta={`${totalTemas} temas en ${op.bloques.length} bloques`}
              icon={OPOSICION_ICONS.temario}
            >
              <ul className="divide-y divide-ink-divider overflow-hidden rounded-lg border border-ink-divider">
                {op.bloques.map((bloque) => (
                  <li
                    key={bloque.numero}
                    className="flex items-center justify-between gap-4 bg-ink px-4 py-3"
                  >
                    <span className="text-ink-text">
                      <span className="text-neutral-500">
                        Bloque {bloque.numero}.
                      </span>{" "}
                      {bloque.nombre}
                    </span>
                    <span className="whitespace-nowrap text-xs text-neutral-500">
                      {bloque.temas} temas
                    </span>
                  </li>
                ))}
              </ul>
            </AccordionItem>

            <AccordionItem title="Plazas" icon={OPOSICION_ICONS.plazas}>
              {op.plazasInfo}
            </AccordionItem>

            <AccordionItem
              title="Retribución orientativa"
              icon={OPOSICION_ICONS.retribucion}
            >
              {op.sueldoInfo}
            </AccordionItem>
          </Accordion>
        </section>

        {/* ---------- Precio ---------- */}
        <section className="border-y border-ink-divider bg-ink-surface/40">
          <div className="mx-auto max-w-sm px-6 py-16">
            <h2 className="text-center text-2xl font-medium tracking-tight text-ink-text">
              Un precio, sin sorpresas
            </h2>
            <p className="mt-2 text-center text-sm text-neutral-400">
              Empieza con 7 días gratis. Cancela antes y no pagas nada.
            </p>

            <div className="mx-auto mt-8 flex w-fit rounded-md border border-ink-divider p-1">
              {(["mensual", "anual"] as const).map((opcion) => (
                <button
                  key={opcion}
                  type="button"
                  onClick={() => setCiclo(opcion)}
                  className={`rounded px-4 py-1.5 text-sm font-medium transition-colors ${
                    ciclo === opcion
                      ? "bg-accent text-ink"
                      : "text-neutral-400 hover:text-ink-text"
                  }`}
                >
                  {opcion === "mensual" ? "Mensual" : `Anual · ahorra ${AHORRO_ANUAL_PORCENTAJE}%`}
                </button>
              ))}
            </div>

            <div className="mt-6 flex flex-col gap-4 rounded-lg border border-accent bg-ink-surface p-6 shadow-[0_0_0_1px_theme(colors.accent.DEFAULT)]">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-ink-text">
                  {op.siglas}
                </h3>
                <span className="rounded-md bg-accent-800 px-2 py-0.5 text-[11px] font-medium text-accent-100">
                  7 días gratis
                </span>
              </div>
              <p className="text-sm text-neutral-400">
                Todo el {op.siglas}, sin límites
              </p>
              <p className="text-ink-text">
                <span className="text-3xl font-medium tracking-tight">
                  {PLAN_PRECIO[ciclo].valor}
                </span>
                <span className="text-sm text-neutral-500">
                  {PLAN_PRECIO[ciclo].sufijo}
                </span>
              </p>
              <ul className="flex-1 space-y-2 text-sm text-neutral-300">
                {[
                  `Temario completo de ${op.siglas}`,
                  ...PLAN_FEATURES.slice(1),
                ].map((f) => (
                  <li key={f} className="flex gap-2">
                    <span className="text-accent">✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <Link to={checkoutHref} className={buttonClass("primary", "w-full")}>
                Empezar prueba gratis
              </Link>
            </div>
          </div>
        </section>

        {/* ---------- FAQ ---------- */}
        <section className="mx-auto max-w-3xl px-6 py-16">
          <h2 className="text-2xl font-medium tracking-tight text-ink-text">
            Preguntas frecuentes
          </h2>
          <Accordion>
            <AccordionItem
              title="¿Necesito tarjeta para la prueba gratuita?"
              icon={OPOSICION_ICONS.pregunta}
              defaultOpen
            >
              Sí. Te pedimos los datos de pago al empezar, pero no se te
              cobra nada durante los 7 días de prueba. Si cancelas antes de
              que acaben, no pagas nada.
            </AccordionItem>
            <AccordionItem
              title="¿El temario está incluido o hay que comprarlo aparte?"
              icon={OPOSICION_ICONS.pregunta}
            >
              Incluido. La suscripción te da el temario completo de la
              oposición que elijas y tests ilimitados por un único precio —
              sin complementos ni extras que pagar aparte.
            </AccordionItem>
            <AccordionItem
              title="¿De dónde salen las preguntas de los tests?"
              icon={OPOSICION_ICONS.pregunta}
            >
              El banco actual se basa en las preguntas reales de los
              exámenes oficiales de {op.aniosExamenes.join(", ")} (
              {op.totalPreguntas} preguntas, incluidas las anuladas). Iremos
              ampliando la cobertura de cada tema con más convocatorias y
              contenido propio.
            </AccordionItem>
            <AccordionItem
              title="¿Puedo cancelar cuando quiera?"
              icon={OPOSICION_ICONS.pregunta}
            >
              Sí, sin permanencia. Cancelas desde tu cuenta cuando quieras;
              si cancelas durante la prueba gratuita no se te cobra nada.
            </AccordionItem>
            <AccordionItem
              title="¿Puedo pagar anual?"
              icon={OPOSICION_ICONS.pregunta}
            >
              Sí — {PLAN_PRECIO.anual.valor}
              {PLAN_PRECIO.anual.sufijo}, un {AHORRO_ANUAL_PORCENTAJE}% más
              barato que pagando mes a mes. Se renueva automáticamente cada
              año hasta que canceles.
            </AccordionItem>
          </Accordion>
        </section>

        {/* ---------- CTA final ---------- */}
        <section className="border-t border-ink-divider">
          <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 px-6 py-16 text-center">
            <h2 className="text-2xl font-medium tracking-tight text-ink-text">
              Empieza a preparar el {op.siglas} hoy
            </h2>
            <p className="max-w-md text-sm text-neutral-400">
              7 días gratis, sin compromiso. Después, {PLAN_PRECIO.mensual.valor}
              {PLAN_PRECIO.mensual.sufijo}.
            </p>
            <Link to={checkoutHref} className={buttonClass("primary")}>
              Empezar prueba gratis de 7 días
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
