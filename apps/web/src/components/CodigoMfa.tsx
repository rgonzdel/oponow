import { useEffect, useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useAuth, type DesafioMfa } from "../auth/AuthContext";
import { ApiError, apiFetch } from "../lib/api-client";
import { buttonClass } from "./button";
import { IconoEstado, type EstadoIcono } from "./IconoEstado";

const REENVIO_S = 30;
const LONGITUD = 6;
// Tiempo para que se vea la animación de éxito (sobre → check) antes de
// iniciar la sesión, que redirige al panel.
const ANIMACION_OK_MS = 1600;

type Estado = EstadoIcono;

/** Segundo paso del login en un navegador nuevo: el código enviado al correo. */
export function CodigoMfa({
  desafio,
  onSuccess,
  onVolver,
}: {
  desafio: DesafioMfa;
  onSuccess: () => void;
  onVolver: () => void;
}) {
  const { entrarConToken } = useAuth();
  const [codigo, setCodigo] = useState("");
  const [espera, setEspera] = useState(REENVIO_S);
  const [aviso, setAviso] = useState<string | null>(null);
  const [estado, setEstado] = useState<Estado>("espera");
  const input = useRef<HTMLInputElement>(null);

  useEffect(() => {
    input.current?.focus();
  }, []);

  useEffect(() => {
    if (espera <= 0) return;
    const t = setTimeout(() => setEspera((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [espera]);

  // Se verifica el código sin iniciar todavía la sesión: primero se muestra
  // la animación de éxito y después se entra.
  const verificar = useMutation({
    mutationFn: (valor: string) =>
      apiFetch<{ accessToken: string }>("/auth/mfa/verificar", {
        method: "POST",
        skipAuth: true,
        body: JSON.stringify({ desafioId: desafio.desafioId, codigo: valor }),
      }),
    onSuccess: ({ accessToken }) => {
      setEstado("ok");
      setTimeout(() => {
        entrarConToken(accessToken).then(onSuccess, () => setAviso("No se ha podido iniciar la sesión"));
      }, ANIMACION_OK_MS);
    },
    onError: () => {
      setEstado("error");
      setCodigo("");
      input.current?.focus();
    },
  });

  const reenviar = useMutation({
    mutationFn: () =>
      apiFetch<void>("/auth/mfa/reenviar", {
        method: "POST",
        skipAuth: true,
        body: JSON.stringify({ desafioId: desafio.desafioId }),
      }),
    onSuccess: () => {
      setEspera(REENVIO_S);
      setCodigo("");
      setEstado("espera");
      verificar.reset();
      setAviso("Te hemos enviado un código nuevo.");
      input.current?.focus();
    },
  });

  function cambiar(valor: string) {
    if (estado === "ok") return;
    const limpio = valor.replace(/\D/g, "").slice(0, LONGITUD);
    setCodigo(limpio);
    setAviso(null);
    // Tras un fallo, la X se queda hasta que se empieza a escribir otro código.
    if (estado === "error" && limpio.length > 0) setEstado("espera");
    // Al completar los 6 dígitos (al escribir o al pegar) se envía solo.
    if (limpio.length === LONGITUD && !verificar.isPending) verificar.mutate(limpio);
  }

  const error = estado === "error" ? verificar.error : reenviar.error;

  return (
    <form
      className="auth-pop space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        if (codigo.length === LONGITUD && estado !== "ok") verificar.mutate(codigo);
      }}
    >
      <div className="flex justify-center">
        <IconoEstado
          estado={estado}
          etiquetas={{ espera: "Correo enviado", ok: "Código correcto", error: "Código incorrecto" }}
        />
      </div>
      <p className="text-center text-sm text-neutral-300" aria-live="polite">
        {estado === "ok" ? (
          <span className="font-medium text-green-400">Código correcto. Entrando…</span>
        ) : (
          <>
            Te hemos enviado un código de {LONGITUD} dígitos a
            <span className="mt-0.5 block font-medium text-ink-text">{desafio.email}</span>
          </>
        )}
      </p>

      <label className="block">
        <span className="sr-only">Código de acceso</span>
        <input
          ref={input}
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={LONGITUD}
          value={estado === "ok" ? verificar.variables ?? codigo : codigo}
          onChange={(e) => cambiar(e.target.value)}
          readOnly={estado === "ok"}
          placeholder="••••••"
          aria-invalid={estado === "error"}
          data-estado={estado}
          className="codigo-mfa__input w-full rounded-md border border-ink-divider bg-ink px-3 py-3 text-center font-mono text-2xl tracking-[0.6em] text-ink-text placeholder-neutral-700 outline-none transition-[border-color,box-shadow,color] duration-300 focus:border-accent focus:shadow-[0_0_0_3px_rgba(145,132,217,0.18)]"
        />
      </label>

      {error && (
        <p className="text-center text-sm text-red-400">
          {error instanceof ApiError ? error.message : "No se ha podido comprobar el código"}
        </p>
      )}
      {aviso && !error && <p className="text-center text-sm text-accent-300">{aviso}</p>}

      {estado !== "ok" && (
        <>
          <button
            type="submit"
            disabled={codigo.length < LONGITUD || verificar.isPending}
            className={buttonClass("primary", "w-full")}
          >
            {verificar.isPending ? "Comprobando…" : "Verificar y entrar"}
          </button>

          <div className="flex justify-between text-xs">
            <button type="button" onClick={onVolver} className="text-neutral-400 hover:text-ink-text">
              ← Volver
            </button>
            <button
              type="button"
              disabled={espera > 0 || reenviar.isPending}
              onClick={() => reenviar.mutate()}
              className="text-accent hover:underline disabled:text-neutral-600 disabled:no-underline"
            >
              {reenviar.isPending ? "Enviando…" : espera > 0 ? `Reenviar en ${espera} s` : "Reenviar código"}
            </button>
          </div>

          <p className="text-center text-xs text-neutral-500">
            Mira también en la carpeta de spam. No te lo volveremos a pedir en este navegador durante 30 días.
          </p>
        </>
      )}
    </form>
  );
}

