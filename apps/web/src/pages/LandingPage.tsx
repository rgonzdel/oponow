import { Link } from "react-router-dom";
import { SiteHeader } from "../components/SiteHeader";
import { buttonClass } from "../components/button";
import { OPOSICIONES } from "../data/oposiciones";
import { AHORRO_ANUAL_PORCENTAJE, PLAN_PRECIO } from "../data/pricing";

const DIFERENCIADORES = [
  {
    titulo: "Exámenes reales, no simulados",
    cuerpo: "Los tests se basan en preguntas literales de convocatorias oficiales, con las anuladas marcadas igual que en la plantilla del tribunal.",
  },
  {
    titulo: "Todo incluido, sin letra pequeña",
    cuerpo: "Temario completo y tests ilimitados en un único precio. Nada de comprar el temario aparte.",
  },
  {
    titulo: "Precio simple",
    cuerpo: "Un solo plan de pago, sin niveles que comparar. Cancelas cuando quieras.",
  },
];

export function LandingPage() {
  const disponibles = OPOSICIONES.filter((o) => o.disponible);
  const proximamente = OPOSICIONES.filter((o) => !o.disponible);

  return (
    <div>
      <SiteHeader />

      <main>
        {/* ---------- Hero ---------- */}
        <section className="mx-auto max-w-3xl px-6 pb-14 pt-20 text-center">
          <h1 className="text-4xl font-medium leading-tight tracking-tight text-ink-text">
            Prepara tu oposición sin perder el tiempo
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-neutral-400">
            Temarios digitales interactivos y un banco de tests hecho con
            exámenes oficiales reales, no preguntas genéricas.
          </p>
          <a href="#oposiciones" className={buttonClass("primary", "mt-7")}>
            Ver oposiciones disponibles
          </a>
        </section>

        {/* ---------- Oposiciones ---------- */}
        <section id="oposiciones" className="scroll-mt-16 border-y border-ink-divider bg-ink-surface/40">
          <div className="mx-auto max-w-5xl px-6 py-16">
            <h2 className="text-2xl font-medium tracking-tight text-ink-text">
              Oposiciones disponibles
            </h2>
            <p className="mt-2 max-w-xl text-sm text-neutral-400">
              Cada oposición tiene su propio temario y su propio banco de
              tests. Elige la tuya para ver el temario oficial, la estructura
              del examen y un cuestionario real de prueba.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {disponibles.map((op) => {
                const totalTemas = op.bloques.reduce((n, b) => n + b.temas, 0);
                return (
                  <Link
                    key={op.slug}
                    to={`/oposiciones/${op.slug}`}
                    className="flex flex-col gap-4 rounded-lg border border-ink-divider bg-ink-surface p-6 transition-colors hover:border-accent"
                  >
                    <div className="flex items-center justify-between">
                      <span className="rounded-md bg-accent-800 px-2 py-0.5 text-[11px] font-medium text-accent-100">
                        Grupo {op.grupo}
                      </span>
                      <span className="text-xs text-neutral-500">
                        {op.organismo}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium text-ink-text">
                        {op.nombre}{" "}
                        <span className="text-neutral-500">({op.siglas})</span>
                      </h3>
                      <p className="mt-1 text-sm text-neutral-400">
                        {op.resumen}
                      </p>
                    </div>

                    <dl className="flex flex-wrap gap-x-5 gap-y-1 border-t border-ink-divider pt-3 text-xs text-neutral-500">
                      <div>
                        <dt className="inline text-neutral-300">{totalTemas}</dt>{" "}
                        temas
                      </div>
                      <div>
                        <dt className="inline text-neutral-300">
                          {op.totalPreguntas}
                        </dt>{" "}
                        preguntas reales
                      </div>
                      <div>
                        <dt className="inline text-neutral-300">
                          {op.aniosExamenes.length}
                        </dt>{" "}
                        convocatorias
                      </div>
                    </dl>

                    <span className="text-sm font-medium text-accent">
                      Ver oposición →
                    </span>
                  </Link>
                );
              })}

              {proximamente.map((op) => (
                <div
                  key={op.slug}
                  className="flex flex-col gap-3 rounded-lg border border-dashed border-ink-divider p-6 opacity-60"
                >
                  <div className="flex items-center justify-between">
                    <span className="rounded-md bg-ink px-2 py-0.5 text-[11px] font-medium text-neutral-500">
                      Grupo {op.grupo}
                    </span>
                    <span className="text-xs text-neutral-500">
                      Próximamente
                    </span>
                  </div>
                  <h3 className="text-lg font-medium text-neutral-400">
                    {op.nombre}{" "}
                    <span className="text-neutral-600">({op.siglas})</span>
                  </h3>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ---------- Diferenciadores ---------- */}
        <section className="mx-auto max-w-5xl px-6 py-16">
          <div className="grid gap-6 sm:grid-cols-3">
            {DIFERENCIADORES.map((item) => (
              <div key={item.titulo}>
                <h3 className="text-sm font-medium text-ink-text">
                  {item.titulo}
                </h3>
                <p className="mt-2 text-sm text-neutral-400">{item.cuerpo}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ---------- Precio (breve, al final) ---------- */}
        <section className="border-t border-ink-divider bg-ink-surface/40">
          <div className="mx-auto max-w-3xl px-6 py-14 text-center">
            <h2 className="text-xl font-medium tracking-tight text-ink-text">
              Precio simple
            </h2>
            <p className="mt-2 text-sm text-neutral-400">
              Empieza gratis. Cuando quieras el temario completo de tu
              oposición, un único plan desde {PLAN_PRECIO.mensual.valor}
              {PLAN_PRECIO.mensual.sufijo} — o en anual con {AHORRO_ANUAL_PORCENTAJE}%
              de descuento.
            </p>
            {disponibles[0] && (
              <Link
                to={`/oposiciones/${disponibles[0].slug}`}
                className={buttonClass("secondary", "mt-6")}
              >
                Ver precio y detalle →
              </Link>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
