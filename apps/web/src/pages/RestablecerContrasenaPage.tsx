import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useAuth } from "../auth/AuthContext";
import { restablecerSchema, type RestablecerFormValues } from "../lib/schemas";
import { ApiError, apiFetch } from "../lib/api-client";
import { AuthLayout } from "../components/AuthLayout";
import { FormField, TextInput } from "../components/FormField";
import { buttonClass } from "../components/button";
import { IconoEstado, type EstadoIcono } from "../components/IconoEstado";

// Tiempo para ver el candado convertirse en check antes de entrar al panel.
const ANIMACION_OK_MS = 1600;

/** Página a la que lleva el enlace del correo: elegir la contraseña nueva. */
export function RestablecerContrasenaPage() {
  const { entrarConToken } = useAuth();
  const navigate = useNavigate();
  // El token se guarda en memoria y se quita de la barra de direcciones,
  // para que no quede en el historial ni se comparta por error.
  const [token] = useState(() => new URLSearchParams(window.location.search).get("token") ?? "");
  useEffect(() => {
    if (window.location.search) window.history.replaceState(window.history.state, "", window.location.pathname);
  }, []);
  const [estado, setEstado] = useState<EstadoIcono>("espera");

  const enlace = useQuery({
    queryKey: ["enlace-contrasena", token],
    queryFn: () =>
      apiFetch<{ email: string }>("/auth/contrasena/comprobar", {
        method: "POST",
        skipAuth: true,
        body: JSON.stringify({ token }),
      }),
    enabled: token.length > 0,
    retry: false,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RestablecerFormValues>({ resolver: zodResolver(restablecerSchema) });

  const guardar = useMutation({
    mutationFn: (password: string) =>
      apiFetch<{ accessToken: string }>("/auth/contrasena/restablecer", {
        method: "POST",
        skipAuth: true,
        body: JSON.stringify({ token, password }),
      }),
    onSuccess: ({ accessToken }) => {
      setEstado("ok");
      setTimeout(() => {
        entrarConToken(accessToken).then(
          () => navigate("/dashboard", { replace: true }),
          () => navigate("/login", { replace: true }),
        );
      }, ANIMACION_OK_MS);
    },
    onError: () => setEstado("error"),
  });

  // Tras un fallo, la X se queda hasta que se vuelve a escribir.
  const alEscribir = () => {
    if (estado === "error") {
      setEstado("espera");
      guardar.reset();
    }
  };

  const enlaceInvalido = !token || enlace.isError;
  const iconoEstado: EstadoIcono = enlaceInvalido ? "error" : estado;
  const etiquetas = { espera: "Contraseña", ok: "Contraseña cambiada", error: "Error" };

  if (enlaceInvalido) {
    return (
      <AuthLayout title="Enlace no válido">
        <div className="auth-pop space-y-4">
          <div className="flex justify-center">
            <IconoEstado estado={iconoEstado} base="candado" etiquetas={etiquetas} />
          </div>
          <p className="text-center text-sm text-neutral-300">
            {enlace.error instanceof ApiError
              ? enlace.error.message
              : "El enlace no es válido o ha caducado. Pide uno nuevo."}
          </p>
          <Link to="/recuperar-contrasena" className={buttonClass("primary", "w-full")}>
            Pedir un enlace nuevo
          </Link>
          <p className="text-center text-sm text-neutral-400">
            <Link to="/login" className="text-accent hover:underline">
              Volver a iniciar sesión
            </Link>
          </p>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout title={estado === "ok" ? "¡Listo!" : "Elige una contraseña nueva"}>
      <form
        onSubmit={handleSubmit((v) => estado !== "ok" && guardar.mutate(v.password))}
        className="auth-pop space-y-4"
        noValidate
      >
        <div className="flex justify-center">
          <IconoEstado estado={iconoEstado} base="candado" etiquetas={etiquetas} />
        </div>

        <p className="text-center text-sm text-neutral-300" aria-live="polite">
          {estado === "ok" ? (
            <span className="font-medium text-green-400">Contraseña cambiada. Entrando…</span>
          ) : enlace.data ? (
            <>
              Cuenta
              <span className="mt-0.5 block font-medium text-ink-text">{enlace.data.email}</span>
            </>
          ) : (
            "Comprobando el enlace…"
          )}
        </p>

        <fieldset disabled={!enlace.data || estado === "ok"} className="space-y-4 disabled:opacity-60">
          <FormField label="Contraseña nueva" error={errors.password?.message}>
            <TextInput
              type="password"
              autoComplete="new-password"
              autoFocus
              {...register("password", { onChange: alEscribir })}
            />
          </FormField>
          <FormField label="Repite la contraseña" error={errors.confirmacion?.message}>
            <TextInput
              type="password"
              autoComplete="new-password"
              {...register("confirmacion", { onChange: alEscribir })}
            />
          </FormField>
        </fieldset>

        {estado === "error" && (
          <p className="text-center text-sm text-red-400">
            {guardar.error instanceof ApiError ? guardar.error.message : "No se ha podido cambiar la contraseña"}{" "}
            <Link to="/recuperar-contrasena" className="text-accent hover:underline">
              Pedir un enlace nuevo
            </Link>
          </p>
        )}

        {estado !== "ok" && (
          <>
            <button
              type="submit"
              disabled={!enlace.data || guardar.isPending}
              className={buttonClass("primary", "w-full")}
            >
              {guardar.isPending ? "Guardando…" : "Guardar y entrar"}
            </button>
            <p className="text-center text-xs text-neutral-500">
              Se cerrará la sesión en el resto de dispositivos.
            </p>
          </>
        )}
      </form>
    </AuthLayout>
  );
}
