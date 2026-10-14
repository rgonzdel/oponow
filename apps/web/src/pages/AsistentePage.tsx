import { useEffect, useRef, useState } from "react";
import { SiteHeader } from "../components/SiteHeader";
import { buttonClass } from "../components/button";
import { RespuestaTemis } from "../components/asistente/RespuestaTemis";
import { ClienteTemis, type Progreso } from "../asistente/cliente";
import { NOMBRE, SUGERENCIAS_INICIO } from "../asistente/plantillas";
import type { ContextoConversacion, Respuesta } from "../asistente/tipos";

type Mensaje = { id: number; de: "usuario"; texto: string } | { id: number; de: "temis"; respuesta: Respuesta } | { id: number; de: "error"; texto: string };

export function AsistentePage() {
  const cliente = useRef<ClienteTemis | null>(null);
  const contexto = useRef<ContextoConversacion>({});
  const final = useRef<HTMLDivElement>(null);
  const siguienteId = useRef(1);
  const [progreso, setProgreso] = useState<Progreso | null>(null);
  const [mensajes, setMensajes] = useState<Mensaje[]>([]);
  const [texto, setTexto] = useState("");
  const [pensando, setPensando] = useState(false);

  useEffect(() => {
    cliente.current = new ClienteTemis(setProgreso);
    return () => cliente.current?.cerrar();
  }, []);

  useEffect(() => {
    final.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [mensajes, pensando]);

  async function preguntar(consulta: string) {
    const q = consulta.trim();
    if (!q || pensando || !cliente.current) return;
    setTexto("");
    setMensajes((m) => [...m, { id: siguienteId.current++, de: "usuario", texto: q }]);
    setPensando(true);
    try {
      const r = await cliente.current.preguntar(q, contexto.current);
      contexto.current = r.contexto;
      setMensajes((m) => [...m, { id: siguienteId.current++, de: "temis", respuesta: r }]);
    } catch (e) {
      setMensajes((m) => [...m, { id: siguienteId.current++, de: "error", texto: e instanceof Error ? e.message : "Error inesperado" }]);
    } finally {
      setPensando(false);
    }
  }

  const ultimaTemis = [...mensajes].reverse().find((m) => m.de === "temis")?.id;
  const cargando = progreso && progreso.cargadas < progreso.total;

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-4 pb-40 pt-8 sm:px-6">
        {mensajes.length === 0 && (
          <section className="mt-6 text-center">
            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-accent text-lg font-semibold text-accent">
              T
            </span>
            <h1 className="mt-4 text-2xl font-medium tracking-tight text-ink-text">{NOMBRE}, tu asistente de oposiciones</h1>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-neutral-400">
              Responde con el texto literal y vigente del BOE: Constitución, procedimiento administrativo, TREBEP, LOPJ, leyes
              procesales, códigos Civil y Penal, Estatutos de Autonomía y más. Funciona dentro de tu navegador, sin conectarse
              a ninguna IA externa, y siempre te enseña el artículo del que sale cada respuesta.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              {SUGERENCIAS_INICIO.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => preguntar(s)}
                  className="rounded-full border border-ink-divider px-3 py-1.5 text-xs text-neutral-300 transition-colors hover:border-accent hover:text-ink-text"
                >
                  {s}
                </button>
              ))}
            </div>
          </section>
        )}

        <div className="mt-6 space-y-5">
          {mensajes.map((m) =>
            m.de === "usuario" ? (
              <div key={m.id} className="flex justify-end">
                <p className="max-w-[85%] rounded-lg border border-accent/40 bg-accent-900/50 px-4 py-2.5 text-sm text-ink-text">{m.texto}</p>
              </div>
            ) : m.de === "temis" ? (
              <RespuestaTemis key={m.id} respuesta={m.respuesta} onConsulta={preguntar} mostrarSugerencias={m.id === ultimaTemis && !pensando} />
            ) : (
              <p key={m.id} className="text-sm text-red-400">
                No he podido responder: {m.texto}
              </p>
            ),
          )}
          {pensando && <p className="animate-pulse text-sm text-neutral-500">{NOMBRE} está buscando en la normativa…</p>}
          <div ref={final} />
        </div>
      </main>

      <div className="fixed inset-x-0 bottom-0 border-t border-ink-divider bg-ink/95 backdrop-blur">
        <form
          className="mx-auto flex max-w-3xl items-end gap-2 px-4 py-3 sm:px-6"
          onSubmit={(e) => {
            e.preventDefault();
            preguntar(texto);
          }}
        >
          <label className="flex-1">
            <span className="sr-only">Pregunta a {NOMBRE}</span>
            <textarea
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  preguntar(texto);
                }
              }}
              rows={1}
              maxLength={500}
              placeholder="Pregunta un artículo, un plazo, una oposición… o pide un test"
              className="block max-h-40 w-full resize-none rounded-md border border-ink-divider bg-ink-surface px-3 py-2.5 text-sm text-ink-text placeholder:text-neutral-500 focus:border-accent focus:outline-none"
            />
          </label>
          <button type="submit" disabled={pensando || !texto.trim()} className={buttonClass("primary")}>
            Preguntar
          </button>
        </form>
        <p className="mx-auto max-w-3xl px-4 pb-2 text-[11px] text-neutral-600 sm:px-6">
          {cargando
            ? `Cargando normativa: ${progreso.cargadas} de ${progreso.total} normas (${progreso.preceptos.toLocaleString("es-ES")} preceptos)…`
            : progreso
              ? `${progreso.total} normas · ${progreso.preceptos.toLocaleString("es-ES")} preceptos del BOE consolidado. Contrasta siempre con tu convocatoria.`
              : "Preparando la normativa…"}
        </p>
      </div>
    </div>
  );
}
