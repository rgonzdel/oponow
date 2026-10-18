import { useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../auth/AuthContext";
import { OponowLogo } from "../components/OponowLogo";
import { buttonClass } from "../components/button";
import { MiniCalendar } from "../components/MiniCalendar";
import { DescargarInforme } from "../components/DescargarInforme";
import { GraficoActividad } from "../components/dashboard/GraficoActividad";
import { ProgresoFlashcards } from "../components/dashboard/ProgresoFlashcards";
import { listMySubscriptions } from "../lib/billing-client";
import { getResumen } from "../lib/quiz-client";
import { getResumenFlashcards } from "../lib/flashcards-client";

const PLAN_LABEL: Record<string, string> = {
  free: "Free",
  lite: "Lite",
  vip: "VIP",
  prueba: "Prueba y testeo",
};

const PERIODOS = [7, 14, 30] as const;

// Iconos de trazo fino, del mismo estilo que oposicion-icons.tsx.
function Icono({ children }: { children: ReactNode }) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      {children}
    </svg>
  );
}
const ICONOS = {
  test: (
    <Icono>
      <path d="M9 11l2 2 4-4" />
      <rect x="4" y="3" width="16" height="18" rx="2" />
    </Icono>
  ),
  flashcards: (
    <Icono>
      <rect x="3" y="6" width="14" height="14" rx="2" />
      <path d="M7 6V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-2" />
    </Icono>
  ),
  examen: (
    <Icono>
      <circle cx="12" cy="13" r="8" />
      <path d="M12 9v4l2.5 2.5M9 2h6" />
    </Icono>
  ),
  fallos: (
    <Icono>
      <path d="M12 9v4M12 17h.01" />
      <path d="M10.3 3.9 2.4 18a2 2 0 0 0 1.7 3h15.8a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z" />
    </Icono>
  ),
  agenda: (
    <Icono>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M16 3v4M8 3v4M3 11h18" />
    </Icono>
  ),
  racha: (
    <Icono>
      <path d="M12 3c1 3.5 5 5.5 5 10a5 5 0 0 1-10 0c0-2 1-3.5 2-4.5 0 2 1 3 2 3 0-3-1-5.5 1-8.5z" />
    </Icono>
  ),
  admin: (
    <Icono>
      <path d="M12 3l8 4v5c0 5-3.5 8-8 9-4.5-1-8-4-8-9V7z" />
    </Icono>
  ),
  contabilidad: (
    <Icono>
      <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />
    </Icono>
  ),
};

function Kpi({ etiqueta, valor, detalle, icono }: { etiqueta: string; valor: ReactNode; detalle?: ReactNode; icono: ReactNode }) {
  return (
    <div className="rounded-lg border border-ink-divider bg-ink-surface p-4">
      <div className="flex items-center justify-between text-neutral-500">
        <span className="text-xs">{etiqueta}</span>
        <span className="text-accent/80">{icono}</span>
      </div>
      <p className="mt-2 text-2xl font-medium tabular-nums text-ink-text">{valor}</p>
      {detalle && <p className="mt-0.5 text-xs text-neutral-500">{detalle}</p>}
    </div>
  );
}

function Acceso({ to, titulo, texto, icono }: { to: string; titulo: string; texto: string; icono: ReactNode }) {
  return (
    <Link
      to={to}
      className="group flex gap-3 rounded-lg border border-ink-divider bg-ink-surface p-4 transition-colors hover:border-accent"
    >
      <span className="flex h-9 w-9 flex-none items-center justify-center rounded-md border border-ink-divider text-accent transition-colors group-hover:border-accent/60">
        {icono}
      </span>
      <span className="min-w-0">
        <span className="block text-sm font-medium text-ink-text">{titulo}</span>
        <span className="mt-0.5 block text-xs leading-relaxed text-neutral-500">{texto}</span>
      </span>
    </Link>
  );
}

function saludo() {
  const h = new Date().getHours();
  return h < 6 ? "Buenas noches" : h < 14 ? "Buenos días" : h < 21 ? "Buenas tardes" : "Buenas noches";
}

export function DashboardPage() {
  const { user, logout } = useAuth();
  const [dias, setDias] = useState<7 | 14 | 30>(14);

  // Lite y VIP están atados a la oposición que eligieron al suscribirse;
  // solo Free, sin suscripción activa, ve el catálogo completo.
  const subscriptionsQuery = useQuery({
    queryKey: ["billing", "subscriptions", "mine"],
    queryFn: listMySubscriptions,
    enabled: user?.plan === "lite" || user?.plan === "vip" || user?.plan === "prueba",
  });
  const miOposicion = subscriptionsQuery.data?.[0];
  const slug = miOposicion?.oposicionSlug;

  const resumenQuery = useQuery({
    queryKey: ["quiz", "resumen", dias],
    queryFn: () => getResumen(dias),
  });
  const resumen = resumenQuery.data;

  const flashcardsQuery = useQuery({
    queryKey: ["flashcards", "resumen", slug],
    queryFn: () => getResumenFlashcards(slug!),
    enabled: Boolean(slug),
  });
  const temasFlash = flashcardsQuery.data?.temas ?? [];
  const porRepasar = temasFlash.reduce((s, t) => s + t.pendientes, 0);

  const diasActivos = resumen?.actividad.filter((d) => d.tests > 0).length ?? 0;
  const notas = resumen?.actividad.filter((d) => d.notaMedia !== null) ?? [];
  const notaMedia = notas.length
    ? notas.reduce((s, d) => s + d.notaMedia! * d.tests, 0) / notas.reduce((s, d) => s + d.tests, 0)
    : null;

  return (
    <div>
      <header className="border-b border-ink-divider">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link to="/" className="text-accent">
            <OponowLogo animacion="entrada" />
          </Link>
          <div className="flex items-center gap-2">
            <Link to="/cuenta" className={buttonClass("ghost")}>
              Mi cuenta
            </Link>
            <button onClick={() => logout()} className={buttonClass("ghost")}>
              Cerrar sesión
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-8">
        {/* ---------- Bienvenida ---------- */}
        <section className="relative overflow-hidden rounded-lg border border-ink-divider bg-ink-surface p-6 sm:p-8">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full opacity-40 blur-3xl"
            style={{ background: "radial-gradient(circle, rgba(145,132,217,0.35), transparent 70%)" }}
          />
          <div className="relative flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-accent">
                {saludo()} · plan {user ? (PLAN_LABEL[user.plan] ?? user.plan) : "…"}
              </p>
              <h1 className="mt-2 text-2xl font-medium tracking-tight text-ink-text sm:text-3xl">
                {miOposicion ? miOposicion.oposicionNombre : "Elige tu oposición y empieza a practicar"}
              </h1>
              <p className="mt-2 max-w-xl text-sm text-neutral-400">
                {resumen && resumen.streak > 0
                  ? `Llevas ${resumen.streak} ${resumen.streak === 1 ? "día" : "días"} seguidos haciendo tests. Haz uno hoy para no perder la racha.`
                  : "Un test al día, aunque sea corto, es la forma más eficaz de fijar el temario."}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {miOposicion ? (
                <>
                  <Link to={`/oposiciones/${slug}/temario`} className={buttonClass("primary")}>
                    Practicar tests
                  </Link>
                  <Link to={`/oposiciones/${slug}/flashcards`} className={buttonClass("secondary")}>
                    Repasar flashcards{porRepasar > 0 ? ` (${porRepasar})` : ""}
                  </Link>
                </>
              ) : (
                <Link to="/oposiciones" className={buttonClass("primary")}>
                  Ver oposiciones
                </Link>
              )}
            </div>
          </div>
        </section>

        {/* ---------- Métricas ---------- */}
        <section className="mt-6">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-medium text-ink-text">Tu progreso</h2>
            <div className="flex rounded-md border border-ink-divider p-0.5" role="group" aria-label="Periodo">
              {PERIODOS.map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDias(d)}
                  aria-pressed={dias === d}
                  className={`rounded px-2.5 py-1 text-xs font-medium transition-colors ${
                    dias === d ? "bg-accent text-ink" : "text-neutral-400 hover:text-ink-text"
                  }`}
                >
                  {d} días
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <Kpi
              etiqueta="Racha"
              icono={ICONOS.racha}
              valor={resumen ? resumen.streak : "…"}
              detalle={resumen?.streak === 1 ? "día seguido" : "días seguidos"}
            />
            <Kpi
              etiqueta="Tests realizados"
              icono={ICONOS.test}
              valor={resumen ? resumen.testsRealizados : "…"}
              detalle={`${diasActivos} de ${dias} días con actividad`}
            />
            <Kpi
              etiqueta="Nota media"
              icono={ICONOS.examen}
              valor={notaMedia !== null ? notaMedia.toFixed(1).replace(".", ",") : "—"}
              detalle="sobre 10, con penalización por fallo"
            />
            <Kpi
              etiqueta="Fallos"
              icono={ICONOS.fallos}
              valor={resumen ? (resumen.fallos ?? "—") : "…"}
              detalle={
                resumen && resumen.fallos === null ? (
                  <Link to="/oposiciones" className="text-accent hover:underline">
                    Solo con plan de pago
                  </Link>
                ) : (
                  <Link to="/fallos" className="text-accent hover:underline">
                    Repasar mis fallos
                  </Link>
                )
              }
            />
          </div>

          <div className="mt-3 grid gap-3 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
            <div className="rounded-lg border border-ink-divider bg-ink-surface p-5">
              <h3 className="text-sm font-medium text-ink-text">Tests por día</h3>
              <p className="mt-0.5 text-xs text-neutral-500">Últimos {dias} días · pasa el ratón por una barra para ver el detalle</p>
              <div className="mt-6">
                {resumen ? (
                  resumen.testsRealizados > 0 ? (
                    <>
                      <GraficoActividad datos={resumen.actividad} />
                      <dl className="mt-5 grid grid-cols-3 gap-3 border-t border-ink-divider pt-4">
                        <div>
                          <dt className="text-[11px] text-neutral-500">Media diaria</dt>
                          <dd className="mt-0.5 text-sm font-medium tabular-nums text-ink-text">
                            {(resumen.testsRealizados / dias).toFixed(1).replace(".", ",")} tests
                          </dd>
                        </div>
                        <div>
                          <dt className="text-[11px] text-neutral-500">Mejor día</dt>
                          <dd className="mt-0.5 text-sm font-medium tabular-nums text-ink-text">
                            {Math.max(...resumen.actividad.map((d) => d.tests))} tests
                          </dd>
                        </div>
                        <div>
                          <dt className="text-[11px] text-neutral-500">Días sin test</dt>
                          <dd className="mt-0.5 text-sm font-medium tabular-nums text-ink-text">{dias - diasActivos}</dd>
                        </div>
                      </dl>
                    </>
                  ) : (
                    <div className="flex h-32 flex-col items-center justify-center gap-2 text-center text-sm text-neutral-500">
                      Todavía no has hecho tests en este periodo.
                      {slug && (
                        <Link to={`/oposiciones/${slug}/temario`} className="text-accent hover:underline">
                          Haz tu primer test
                        </Link>
                      )}
                    </div>
                  )
                ) : (
                  <div className="h-32 animate-pulse rounded-md bg-ink" />
                )}
              </div>
            </div>

            <div className="rounded-lg border border-ink-divider bg-ink-surface p-5">
              <h3 className="text-sm font-medium text-ink-text">Flashcards por tema</h3>
              <div className="mt-4">
                {slug ? (
                  flashcardsQuery.data ? (
                    <ProgresoFlashcards slug={slug} temas={temasFlash} />
                  ) : (
                    <div className="h-32 animate-pulse rounded-md bg-ink" />
                  )
                ) : (
                  <p className="text-sm text-neutral-500">
                    Con un plan de pago verás aquí cuánto dominas cada tema.{" "}
                    <Link to="/flashcards" className="text-accent hover:underline">
                      Probar flashcards
                    </Link>
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ---------- Accesos ---------- */}
        <section className="mt-8">
          <h2 className="mb-3 text-sm font-medium text-ink-text">Herramientas</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <Acceso
              to={slug ? `/oposiciones/${slug}/temario` : "/oposiciones"}
              titulo="Tests por tema"
              texto="Practica cada tema del programa con preguntas corregidas al momento."
              icono={ICONOS.test}
            />
            <Acceso
              to={`/oposiciones/${slug ?? "tai"}/examen`}
              titulo="Modo examen"
              texto="Simulacros cronometrados como el real, con modo anti-distracciones."
              icono={ICONOS.examen}
            />
            <Acceso
              to={slug ? `/oposiciones/${slug}/flashcards` : "/flashcards"}
              titulo="Flashcards"
              texto="Memoriza la normativa con tarjetas y repaso espaciado."
              icono={ICONOS.flashcards}
            />
            <Acceso to="/fallos" titulo="Seguimiento de fallos" texto="Repasa las preguntas que has fallado, filtradas por fecha." icono={ICONOS.fallos} />
            <Acceso to="/agenda" titulo="Agenda de estudio" texto="Planifica tus tareas y sincronízalas con tu calendario." icono={ICONOS.agenda} />
            {user?.permisos?.includes("ver_contabilidad") && (
              <Acceso to="/contabilidad" titulo="Contabilidad" texto="Ventas, comisiones, IVA e ingresos previstos de Stripe." icono={ICONOS.contabilidad} />
            )}
            {user?.permisos?.includes("panel") && (
              <Acceso to="/admin" titulo="Panel de administración" texto="Usuarios, roles y contenido, según los permisos de tu rol." icono={ICONOS.admin} />
            )}
          </div>
        </section>

        {/* ---------- Agenda e informe ---------- */}
        <section className="mt-8 grid gap-3 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-start">
          {/* A lo ancho: las casillas necesitan sitio para previsualizar las tareas de cada día. */}
          <MiniCalendar />
          <DescargarInforme />
        </section>
      </main>
    </div>
  );
}
