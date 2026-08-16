const PREVIEW_QUESTION = {
  enunciado:
    "¿Cuál de los siguientes derechos recogidos en el Capítulo Segundo del Título I de la Constitución Española NO forma parte de los Derechos Fundamentales y Libertades Públicas (Artículos 15 a 29)?",
  opciones: [
    "Derecho a sindicarse libremente.",
    "Derecho a la propiedad privada.",
    "Derecho a la producción y creación literaria, artística, científica y técnica.",
    "Derecho a elegir libremente su residencia.",
  ],
  correcta: 1,
};

export function QuestionPreviewCard({ siglas }: { siglas: string }) {
  return (
    <div className="rounded-lg border border-ink-divider bg-ink-surface p-5 shadow-[0_18px_40px_-24px_rgba(0,0,0,0.7)]">
      <div className="flex items-center justify-between text-[11px] text-neutral-500">
        <span>
          {siglas} · Primera parte · <span className="font-medium text-neutral-400">1 de 80</span>
        </span>
        <span className="rounded-md bg-accent-800 px-1.5 py-0.5 font-medium text-accent-100">
          2024
        </span>
      </div>
      <div className="mt-2 h-1 overflow-hidden rounded-full bg-ink">
        <div className="h-full w-[1.25%] rounded-full bg-accent" />
      </div>
      <p className="mt-4 text-sm leading-relaxed text-ink-text">
        {PREVIEW_QUESTION.enunciado}
      </p>
      <div className="mt-4 space-y-2">
        {PREVIEW_QUESTION.opciones.map((opcion, i) => (
          <div
            key={opcion}
            className={`flex items-start gap-2.5 rounded-md border px-3 py-2 text-xs ${
              i === PREVIEW_QUESTION.correcta
                ? "border-accent bg-accent/10 text-ink-text"
                : "border-ink-divider text-neutral-400"
            }`}
          >
            <span
              className={`flex h-5 w-5 flex-none items-center justify-center rounded border text-[10px] font-semibold ${
                i === PREVIEW_QUESTION.correcta
                  ? "border-accent bg-accent text-ink"
                  : "border-ink-divider text-neutral-500"
              }`}
            >
              {String.fromCharCode(97 + i)}
            </span>
            {opcion}
          </div>
        ))}
      </div>
      <p className="mt-4 text-center text-[11px] text-neutral-500">
        Extracto real del banco de preguntas — sin retocar
      </p>
    </div>
  );
}
