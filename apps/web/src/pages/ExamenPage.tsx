import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { SiteHeader } from "../components/SiteHeader";
import { LoadingScreen } from "../components/LoadingScreen";
import { buttonClass } from "../components/button";
import { ExamenRunner, formatearTiempo } from "../components/ExamenRunner";
import {
  entregarExamen,
  getExamen,
  guardarRespuesta,
  registrarSalida,
  type ExamenEstado,
  type MotivoEntregaExamen,
} from "../lib/examen-client";
import { ApiError } from "../lib/api-client";

const MOTIVO: Record<MotivoEntregaExamen, string> = {
  usuario: "Entregado por ti",
  tiempo: "Entregado al acabarse el tiempo",
  salidas: "Entregado automáticamente por salir de la pantalla del examen",
};

export function ExamenPage() {
  const { id = "" } = useParams();
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: ["examen", id],
    queryFn: () => getExamen(id),
    // El reloj y las respuestas se cargan una vez: después manda el componente.
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    retry: false,
  });

  if (query.isLoading) return <LoadingScreen />;
  if (query.isError || !query.data) {
    return (
      <div>
        <SiteHeader />
        <main className="mx-auto max-w-md px-6 py-16 text-center">
          <p className="text-ink-text">
            {query.error instanceof ApiError ? query.error.message : "No se ha podido cargar el examen."}
          </p>
          <Link to="/dashboard" className={buttonClass("primary", "mt-6 w-full")}>
            Volver al panel
          </Link>
        </main>
      </div>
    );
  }

  const examen = query.data;
  const recargar = () => queryClient.invalidateQueries({ queryKey: ["examen", id] });

  if (examen.estado === "en_progreso") {
    return (
      <ExamenRunner
        key={examen.id}
        titulo={`Examen · ${examen.preguntas.length} preguntas`}
        subtitulo={examen.modoAvanzado ? "Modo avanzado" : undefined}
        preguntas={examen.preguntas}
        respuestasIniciales={examen.respuestas}
        segundosRestantes={examen.segundosRestantes}
        duracionSegundos={examen.duracionSegundos}
        modoAvanzado={examen.modoAvanzado}
        maxSalidas={examen.maxSalidas}
        salidasIniciales={examen.salidas}
        guardar={(preguntaId, r) => guardarRespuesta(examen.id, preguntaId, r)}
        registrarSalida={(fase, s) => registrarSalida(examen.id, fase, s)}
        entregar={async () => {
          await entregarExamen(examen.id);
        }}
        alTerminar={() => void recargar()}
      />
    );
  }

  return <ResultadoExamen examen={examen} />;
}

type Filtro = "todas" | "falladas" | "blanco" | "acertadas";

function ResultadoExamen({ examen }: { examen: ExamenEstado }) {
  const r = examen.resultado!;
  const [filtro, setFiltro] = useState<Filtro>("todas");

  const estadoDe = (preguntaId: string, correcta: number) => {
    const elegida = examen.respuestas[preguntaId]?.opcionElegida ?? null;
    if (elegida === null) return "blanco" as const;
    return elegida === correcta ? ("acertadas" as const) : ("falladas" as const);
  };
  const visibles = examen.preguntas.filter(
    (p) => filtro === "todas" || estadoDe(p.id, p.revision?.respuestaCorrecta ?? -1) === filtro,
  );

  return (
    <div>
      <SiteHeader />
      <main className="mx-auto max-w-4xl px-6 py-10">
        <div className="rounded-lg border border-accent bg-ink-surface p-6">
          <p className="text-xs font-medium uppercase tracking-wide text-accent">Resultado del examen</p>
          <div className="mt-3 flex flex-wrap items-end gap-x-8 gap-y-4">
            <p className="text-5xl font-medium tracking-tight text-ink-text">
              {r.puntuacion.toFixed(2)}
              <span className="text-xl text-neutral-500">/10</span>
            </p>
            <dl className="grid grid-cols-3 gap-6 text-sm">
              <div>
                <dt className="text-xs text-neutral-500">Aciertos</dt>
                <dd className="text-lg font-medium text-emerald-400">{r.correctas}</dd>
              </div>
              <div>
                <dt className="text-xs text-neutral-500">Fallos</dt>
                <dd className="text-lg font-medium text-red-400">{r.incorrectas}</dd>
              </div>
              <div>
                <dt className="text-xs text-neutral-500">En blanco</dt>
                <dd className="text-lg font-medium text-neutral-300">{r.enBlanco}</dd>
              </div>
            </dl>
          </div>
          <p className="mt-4 text-sm text-neutral-400">
            {MOTIVO[r.motivoEntrega]} · tiempo usado {formatearTiempo(r.segundosUsados)} de{" "}
            {formatearTiempo(examen.duracionSegundos)}
          </p>
          {examen.modoAvanzado && (
            <p className={`mt-1 text-sm ${r.salidas ? "text-amber-400" : "text-neutral-400"}`}>
              Modo avanzado: {r.salidas} {r.salidas === 1 ? "salida" : "salidas"} de la pantalla del examen
              {r.segundosFuera ? `, ${formatearTiempo(r.segundosFuera)} fuera` : ""}.
            </p>
          )}
          <p className="mt-3 text-xs text-neutral-500">
            Nota = (aciertos − fallos ÷ 3) ÷ preguntas × 10. El examen cuenta en tu racha, tus fallos y tu informe.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <Link to={`/oposiciones/${examen.oposicionSlug}/examen`} className={buttonClass("primary")}>
              Nuevo examen
            </Link>
            <Link to="/fallos" className={buttonClass("secondary")}>
              Ver mis fallos
            </Link>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-medium text-ink-text">Revisión</h2>
          <div className="flex flex-wrap gap-1 text-xs">
            {(
              [
                ["todas", "Todas"],
                ["falladas", "Falladas"],
                ["blanco", "En blanco"],
                ["acertadas", "Acertadas"],
              ] as const
            ).map(([valor, texto]) => (
              <button
                key={valor}
                type="button"
                onClick={() => setFiltro(valor)}
                className={`rounded-md border px-3 py-1.5 ${
                  filtro === valor ? "border-accent bg-accent/10 text-accent" : "border-ink-divider text-neutral-400"
                }`}
              >
                {texto}
              </button>
            ))}
          </div>
        </div>

        <ol className="mt-4 space-y-4">
          {visibles.map((p) => {
            const numero = examen.preguntas.indexOf(p) + 1;
            const rev = p.revision;
            const elegida = examen.respuestas[p.id]?.opcionElegida ?? null;
            const estado = estadoDe(p.id, rev?.respuestaCorrecta ?? -1);
            return (
              <li key={p.id} className="rounded-lg border border-ink-divider bg-ink-surface p-5">
                <div className="flex flex-wrap items-baseline justify-between gap-2 text-xs">
                  <span className="text-neutral-500">
                    Pregunta {numero}
                    {rev ? ` · ${rev.temaTitulo}` : ""}
                  </span>
                  <span
                    className={
                      estado === "acertadas" ? "text-emerald-400" : estado === "falladas" ? "text-red-400" : "text-neutral-400"
                    }
                  >
                    {estado === "acertadas" ? "Acierto" : estado === "falladas" ? "Fallo" : "En blanco"}
                  </span>
                </div>
                <p className="mt-2 text-[15px] leading-relaxed text-ink-text">{p.enunciado}</p>
                <div className="mt-4 space-y-2">
                  {p.opciones.map((opcion, i) => {
                    let clases = "border-ink-divider bg-ink opacity-70";
                    if (rev && i === rev.respuestaCorrecta) clases = "border-emerald-400/60 bg-emerald-400/10";
                    else if (i === elegida) clases = "border-red-400/60 bg-red-400/10";
                    return (
                      <div key={i} className={`flex items-start gap-3 rounded-md border px-4 py-2.5 text-sm ${clases}`}>
                        <span className="w-4 flex-none text-[11px] font-semibold text-neutral-500">
                          {String.fromCharCode(97 + i)}
                        </span>
                        <span className="text-neutral-200">
                          {opcion}
                          {i === elegida && <span className="ml-2 text-xs text-neutral-500">(tu respuesta)</span>}
                        </span>
                      </div>
                    );
                  })}
                </div>
                {rev?.justificacionIa && (
                  <p className="mt-4 text-sm leading-relaxed text-neutral-300">{rev.justificacionIa}</p>
                )}
                {rev?.mnemotecnia && <p className="mt-2 text-sm text-accent">💡 {rev.mnemotecnia}</p>}
              </li>
            );
          })}
          {visibles.length === 0 && <p className="text-sm text-neutral-500">No hay preguntas en este filtro.</p>}
        </ol>
      </main>
    </div>
  );
}
