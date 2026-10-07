import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, Navigate, useParams, useSearchParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { OPOSICIONES } from "@oponow/shared-types";
import { SiteHeader } from "../components/SiteHeader";
import { LoadingScreen } from "../components/LoadingScreen";
import { buttonClass } from "../components/button";
import { IconoEstado } from "../components/IconoEstado";
import {
  getSesionFlashcards,
  responderFlashcard,
  type Calificacion,
  type Flashcard,
  type ModoSesion,
} from "../lib/flashcards-client";

const BOTONES: { calificacion: Calificacion; texto: string; tecla: string; clase: string }[] = [
  { calificacion: "otra", texto: "No la sabía", tecla: "1", clase: "flashcard-boton--otra" },
  { calificacion: "dificil", texto: "Dudé", tecla: "2", clase: "flashcard-boton--dificil" },
  { calificacion: "bien", texto: "La sabía", tecla: "3", clase: "flashcard-boton--bien" },
];

/** Sesión de repaso: tarjeta que se gira y se puntúa. */
export function FlashcardsSesionPage() {
  const { slug = "" } = useParams();
  const [params] = useSearchParams();
  const temaId = params.get("tema");
  const modo: ModoSesion = params.get("modo") === "todas" ? "todas" : "repaso";
  const op = OPOSICIONES.find((o) => o.slug === slug);
  const queryClient = useQueryClient();

  // Cada visita es una sesión nueva (no se reutiliza la caché).
  const [intento, setIntento] = useState(0);
  const sesion = useQuery({
    queryKey: ["flashcards", "sesion", slug, temaId, modo, intento],
    queryFn: () => getSesionFlashcards(slug, temaId, modo),
    enabled: Boolean(op),
    staleTime: Infinity,
    gcTime: 0,
    refetchOnWindowFocus: false,
  });

  // Cola de la sesión: las que se fallan vuelven al final.
  const [cola, setCola] = useState<Flashcard[]>([]);
  const [hechas, setHechas] = useState(0);
  const [recuento, setRecuento] = useState<Record<Calificacion, number>>({ otra: 0, dificil: 0, bien: 0 });
  const [girada, setGirada] = useState(false);
  const [saliendo, setSaliendo] = useState<Calificacion | null>(null);
  const [vista, setVista] = useState(0); // fuerza la animación de entrada de cada tarjeta

  useEffect(() => {
    if (sesion.data) {
      setCola(sesion.data);
      setHechas(0);
      setRecuento({ otra: 0, dificil: 0, bien: 0 });
      setGirada(false);
      setSaliendo(null);
    }
  }, [sesion.data]);

  const responder = useMutation({
    mutationFn: ({ id, calificacion }: { id: string; calificacion: Calificacion }) =>
      responderFlashcard(id, calificacion),
  });

  const actual = cola[0];
  const unicas = useMemo(() => new Set(sesion.data?.map((f) => f.id)).size, [sesion.data]);

  const calificar = useCallback(
    (calificacion: Calificacion) => {
      if (!actual || !girada || saliendo) return;
      responder.mutate({ id: actual.id, calificacion });
      setRecuento((r) => ({ ...r, [calificacion]: r[calificacion] + 1 }));
      setSaliendo(calificacion);
      // Deja ver la salida de la tarjeta antes de pasar a la siguiente.
      setTimeout(() => {
        setCola((c) => {
          const [primera, ...resto] = c;
          return calificacion === "otra" ? [...resto, primera] : resto;
        });
        if (calificacion !== "otra") setHechas((n) => n + 1);
        setGirada(false);
        setSaliendo(null);
        setVista((v) => v + 1);
      }, 380);
    },
    [actual, girada, saliendo, responder],
  );

  // Teclado: espacio/intro gira; 1, 2, 3 puntúan.
  useEffect(() => {
    function alPulsar(e: KeyboardEvent) {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key === " " || e.key === "Enter") {
        // Sobre un botón o enlace, el propio navegador ya lo activa.
        if (e.target instanceof HTMLElement && e.target.closest("a, button")) return;
        e.preventDefault();
        if (!saliendo) setGirada((g) => !g);
        return;
      }
      const boton = BOTONES.find((b) => b.tecla === e.key);
      if (boton) calificar(boton.calificacion);
    }
    window.addEventListener("keydown", alPulsar);
    return () => window.removeEventListener("keydown", alPulsar);
  }, [calificar, saliendo]);

  if (!op) return <Navigate to="/flashcards" replace />;
  if (sesion.isLoading) return <LoadingScreen />;

  const volver = `/oposiciones/${slug}/flashcards`;
  const terminada = sesion.data && sesion.data.length > 0 && cola.length === 0;

  return (
    <div>
      <SiteHeader />
      <main className="mx-auto max-w-xl px-6 py-10">
        <div className="flex items-center justify-between gap-4">
          <Link to={volver} className="text-sm text-neutral-500 transition-colors hover:text-ink-text">
            ← Flashcards · {op.siglas}
          </Link>
          {unicas > 0 && !terminada && (
            <span className="text-xs tabular-nums text-neutral-500">
              {Math.min(hechas + 1, unicas)} / {unicas}
            </span>
          )}
        </div>
        {unicas > 0 && (
          <div className="mt-3 h-1 overflow-hidden rounded-full bg-ink-surface">
            <div
              className="h-full rounded-full bg-accent transition-[width] duration-500"
              style={{ width: `${(hechas / unicas) * 100}%` }}
            />
          </div>
        )}

        {sesion.isError && (
          <p className="mt-10 text-center text-sm text-red-400">No se han podido cargar las tarjetas.</p>
        )}

        {sesion.data?.length === 0 && (
          <div className="mt-10 flex flex-col items-center gap-4 text-center">
            <IconoEstado estado="ok" base="candado" etiquetas={{ espera: "", ok: "Al día", error: "" }} />
            <p className="text-sm text-neutral-300">
              ¡Al día! No tienes tarjetas pendientes{temaId ? " en este tema" : ""}.
            </p>
            <div className="flex gap-2">
              <Link to={`${volver}/repaso?${new URLSearchParams({ ...(temaId ? { tema: temaId } : {}), modo: "todas" })}`} className={buttonClass("ghost")}>
                Repasar al azar
              </Link>
              <Link to={volver} className={buttonClass("primary")}>
                Volver
              </Link>
            </div>
          </div>
        )}

        {terminada && (
          <div className="flashcards-fin mt-10 flex flex-col items-center gap-5 text-center">
            <IconoEstado estado="ok" base="candado" etiquetas={{ espera: "", ok: "Sesión completada", error: "" }} />
            <div>
              <h1 className="text-xl font-medium text-ink-text">Sesión completada</h1>
              <p className="mt-1 text-sm text-neutral-400">{unicas} tarjetas repasadas</p>
            </div>
            <div className="grid w-full grid-cols-3 gap-3">
              <Recuento valor={recuento.bien} texto="La sabía" clase="text-green-400" />
              <Recuento valor={recuento.dificil} texto="Dudé" clase="text-amber-300" />
              <Recuento valor={recuento.otra} texto="No la sabía" clase="text-red-400" />
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  queryClient.invalidateQueries({ queryKey: ["flashcards", "resumen", slug] });
                  setIntento((n) => n + 1);
                }}
                className={buttonClass("ghost")}
              >
                Otra sesión
              </button>
              <Link
                to={volver}
                onClick={() => queryClient.invalidateQueries({ queryKey: ["flashcards", "resumen", slug] })}
                className={buttonClass("primary")}
              >
                Terminar
              </Link>
            </div>
          </div>
        )}

        {actual && (
          <>
            <div
              key={`${actual.id}-${vista}`}
              className="flashcard-escena mt-8"
              data-saliendo={saliendo ?? undefined}
            >
              <button
                type="button"
                className="flashcard"
                data-girada={girada}
                onClick={() => !saliendo && setGirada((g) => !g)}
                aria-label={girada ? "Ver la pregunta" : "Ver la respuesta"}
              >
                <span className="flashcard__cara flashcard__cara--anverso">
                  <span className="flashcard__etiqueta">Pregunta</span>
                  <span className="flashcard__texto">{actual.anverso}</span>
                  <span className="flashcard__pista">Pulsa o usa la barra espaciadora para girar</span>
                </span>
                <span className="flashcard__cara flashcard__cara--reverso" aria-hidden={!girada}>
                  <span className="flashcard__etiqueta">Respuesta</span>
                  <span className="flashcard__texto flashcard__texto--respuesta">{actual.reverso}</span>
                  <span className="flashcard__cita">
                    «{actual.cita}»
                  </span>
                  <a
                    href={actual.boeUrl}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    tabIndex={girada ? 0 : -1}
                    className="flashcard__fuente"
                  >
                    BOE · {actual.referencia} ↗
                  </a>
                </span>
              </button>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-3" data-visible={girada}>
              {BOTONES.map((b) => (
                <button
                  key={b.calificacion}
                  type="button"
                  disabled={!girada || saliendo !== null}
                  onClick={() => calificar(b.calificacion)}
                  className={`flashcard-boton ${b.clase}`}
                >
                  {b.texto}
                  <kbd className="flashcard-boton__tecla">{b.tecla}</kbd>
                </button>
              ))}
            </div>
            {!girada && (
              <p className="mt-3 text-center text-xs text-neutral-600">
                Piensa la respuesta antes de girar la tarjeta.
              </p>
            )}
          </>
        )}
      </main>
    </div>
  );
}

function Recuento({ valor, texto, clase }: { valor: number; texto: string; clase: string }) {
  return (
    <div className="rounded-lg border border-ink-divider bg-ink-surface p-3">
      <p className={`text-2xl font-medium tabular-nums ${clase}`}>{valor}</p>
      <p className="mt-0.5 text-xs text-neutral-500">{texto}</p>
    </div>
  );
}
