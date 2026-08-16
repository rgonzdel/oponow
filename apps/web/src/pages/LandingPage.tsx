import { Link } from "react-router-dom";
import { SiteHeader } from "../components/SiteHeader";
import { QuestionPreviewCard } from "../components/QuestionPreviewCard";
import { OPOSICION_ICONS } from "../components/oposicion-icons";
import { buttonClass } from "../components/button";
import { AHORRO_ANUAL_PORCENTAJE, OPOSICIONES, PLAN_FEATURES, PLAN_PRECIO } from "@oponow/shared-types";

const TRIAL_DAYS = 7;

const PASOS = [
  {
    icon: OPOSICION_ICONS.descripcion,
    titulo: "Elige tu oposición",
    cuerpo: "Consulta el temario oficial, la estructura del examen y las plazas antes de pagar nada.",
  },
  {
    icon: OPOSICION_ICONS.temario,
    titulo: "Estudia el temario",
    cuerpo: "Bloques organizados igual que en el BOE, con una lectura pensada para no perderte.",
  },
  {
    icon: OPOSICION_ICONS.examen,
    titulo: "Practica con exámenes reales",
    cuerpo: "Preguntas literales de convocatorias oficiales, con las anuladas marcadas igual que el tribunal.",
  },
  {
    icon: OPOSICION_ICONS.progreso,
    titulo: "Sigue tu progreso",
    cuerpo: "Repite tests, detecta tus puntos débiles y mejora convocatoria a convocatoria.",
  },
];

const DIFERENCIADORES = [
  {
    icon: OPOSICION_ICONS.fuente,
    titulo: "Exámenes reales, no simulados",
    cuerpo: "Los tests se basan en preguntas literales de convocatorias oficiales, con las anuladas marcadas igual que en la plantilla del tribunal.",
  },
  {
    icon: OPOSICION_ICONS.todoIncluido,
    titulo: "Todo incluido, sin letra pequeña",
    cuerpo: "Temario completo y tests ilimitados en un único precio. Nada de comprar el temario aparte.",
  },
  {
    icon: OPOSICION_ICONS.precio,
    titulo: "Precio simple",
    cuerpo: "Un solo plan de pago, sin niveles que comparar. Cancelas cuando quieras.",
  },
];

export function LandingPage() {
  const disponibles = OPOSICIONES.filter((o) => o.disponible);
  const proximamente = OPOSICIONES.filter((o) => !o.disponible);
  const destacada = disponibles[0];

  const totalPreguntas = disponibles.reduce((n, o) => n + o.totalPreguntas, 0);
  const totalTemas = disponibles.reduce(
    (n, o) => n + o.bloques.reduce((m, b) => m + b.temas, 0),
    0,
  );
  const convocatorias = new Set(disponibles.flatMap((o) => o.aniosExamenes)).size;

  return (
    <div>
      <SiteHeader />

      <main>
        {/* ---------- Hero ---------- */}
        <section className="mx-auto grid max-w-5xl gap-12 px-6 py-16 lg:grid-cols-[1fr_400px] lg:items-center lg:py-24">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-accent">
              Oposiciones de la Administración General del Estado
            </p>
            <h1 className="mt-3 text-4xl font-medium leading-tight tracking-tight text-ink-text">
              Aprueba tu oposición con exámenes reales, no genéricos
            </h1>
            <p className="mt-4 text-neutral-400">
              Temario oficial estructurado como el BOE y un banco de tests
              hecho con preguntas literales de convocatorias reales —
              anuladas incluidas, marcadas igual que en la plantilla del
              tribunal.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link to="/register" className={buttonClass("primary")}>
                Empieza gratis
              </Link>
              <a href="#oposiciones" className={buttonClass("secondary")}>
                Ver oposiciones disponibles
              </a>
            </div>

            <dl className="mt-10 grid grid-cols-2 gap-x-6 gap-y-4 border-t border-ink-divider pt-6 sm:grid-cols-4">
              {[
                [String(totalPreguntas), "preguntas reales"],
                [String(totalTemas), "temas oficiales"],
                [String(convocatorias), "convocatorias"],
                [`${TRIAL_DAYS} días`, "de prueba gratis"],
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

          {destacada && <QuestionPreviewCard siglas={destacada.siglas} />}
        </section>

        {/* ---------- Cómo funciona ---------- */}
        <section className="border-y border-ink-divider bg-ink-surface/40">
          <div className="mx-auto max-w-5xl px-6 py-16">
            <h2 className="text-center text-2xl font-medium tracking-tight text-ink-text">
              Cómo funciona
            </h2>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {PASOS.map((paso, i) => (
                <div key={paso.titulo} className="relative">
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 flex-none items-center justify-center rounded-md border border-ink-divider text-accent">
                      {paso.icon}
                    </span>
                    <span className="text-xs font-medium text-neutral-500">
                      Paso {i + 1}
                    </span>
                  </div>
                  <h3 className="mt-3 text-sm font-medium text-ink-text">
                    {paso.titulo}
                  </h3>
                  <p className="mt-2 text-sm text-neutral-400">{paso.cuerpo}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ---------- Oposiciones ---------- */}
        <section id="oposiciones" className="scroll-mt-16">
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
                const totalTemasOp = op.bloques.reduce((n, b) => n + b.temas, 0);
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
                        <dt className="inline text-neutral-300">{totalTemasOp}</dt>{" "}
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
        <section className="border-t border-ink-divider bg-ink-surface/40">
          <div className="mx-auto max-w-5xl px-6 py-16">
            <h2 className="text-center text-2xl font-medium tracking-tight text-ink-text">
              Por qué Oponow
            </h2>
            <div className="mt-10 grid gap-6 sm:grid-cols-3">
              {DIFERENCIADORES.map((item) => (
                <div
                  key={item.titulo}
                  className="rounded-lg border border-ink-divider bg-ink p-6"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-md border border-ink-divider text-accent">
                    {item.icon}
                  </span>
                  <h3 className="mt-4 text-sm font-medium text-ink-text">
                    {item.titulo}
                  </h3>
                  <p className="mt-2 text-sm text-neutral-400">{item.cuerpo}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ---------- Precio ---------- */}
        <section className="mx-auto max-w-sm px-6 py-16">
          <h2 className="text-center text-2xl font-medium tracking-tight text-ink-text">
            Un precio, sin sorpresas
          </h2>
          <p className="mt-2 text-center text-sm text-neutral-400">
            Empieza con {TRIAL_DAYS} días gratis. Cancela antes y no pagas
            nada.
          </p>

          <div className="mt-8 flex flex-col gap-4 rounded-lg border border-accent bg-ink-surface p-6 shadow-[0_0_0_1px_theme(colors.accent.DEFAULT)]">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-ink-text">
                Plan único
              </h3>
              <span className="rounded-md bg-accent-800 px-2 py-0.5 text-[11px] font-medium text-accent-100">
                {TRIAL_DAYS} días gratis
              </span>
            </div>
            <p className="text-ink-text">
              <span className="text-3xl font-medium tracking-tight">
                {PLAN_PRECIO.mensual.valor}
              </span>
              <span className="text-sm text-neutral-500">
                {PLAN_PRECIO.mensual.sufijo}
              </span>
            </p>
            <p className="text-xs text-neutral-500">
              O {PLAN_PRECIO.anual.valor}
              {PLAN_PRECIO.anual.sufijo} en anual — ahorra {AHORRO_ANUAL_PORCENTAJE}%.
            </p>
            <ul className="flex-1 space-y-2 text-sm text-neutral-300">
              {PLAN_FEATURES.map((f) => (
                <li key={f} className="flex gap-2">
                  <span className="text-accent">✓</span>
                  {f}
                </li>
              ))}
            </ul>
            {destacada && (
              <Link
                to={`/oposiciones/${destacada.slug}`}
                className={buttonClass("primary", "w-full")}
              >
                Ver precio y detalle →
              </Link>
            )}
          </div>
        </section>

        {/* ---------- CTA final ---------- */}
        <section className="border-t border-ink-divider">
          <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 px-6 py-16 text-center">
            <h2 className="text-2xl font-medium tracking-tight text-ink-text">
              Empieza a preparar tu oposición hoy
            </h2>
            <p className="max-w-md text-sm text-neutral-400">
              {TRIAL_DAYS} días gratis, sin compromiso. Después,{" "}
              {PLAN_PRECIO.mensual.valor}
              {PLAN_PRECIO.mensual.sufijo}.
            </p>
            <Link to="/register" className={buttonClass("primary")}>
              Empieza gratis
            </Link>
          </div>
        </section>
      </main>

      {/* ---------- Footer ---------- */}
      <footer className="border-t border-ink-divider">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 px-6 py-10 text-center sm:flex-row sm:justify-between sm:text-left">
          <p className="text-sm text-neutral-500">
            © {new Date().getFullYear()} Oponow. Contenido no oficial, no
            sustituye al BOE ni a la convocatoria vigente.
          </p>
          <div className="flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm text-neutral-400">
            <Link to="/legal/aviso-legal" className="hover:text-ink-text">
              Aviso legal
            </Link>
            <Link to="/legal/privacidad" className="hover:text-ink-text">
              Privacidad
            </Link>
            <Link to="/legal/cookies" className="hover:text-ink-text">
              Cookies
            </Link>
            <Link to="/legal/terminos" className="hover:text-ink-text">
              Términos y condiciones
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
