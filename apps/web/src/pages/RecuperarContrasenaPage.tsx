import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useLocation } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { recuperarSchema, type RecuperarFormValues } from "../lib/schemas";
import { ApiError, apiFetch } from "../lib/api-client";
import { AuthLayout } from "../components/AuthLayout";
import { FormField, TextInput } from "../components/FormField";
import { buttonClass } from "../components/button";
import { IconoEstado } from "../components/IconoEstado";

// La API no manda más de un correo por minuto a la misma cuenta.
const REENVIO_S = 60;

/** "He olvidado mi contraseña": pide el enlace que llega al correo. */
export function RecuperarContrasenaPage() {
  const location = useLocation();
  const emailLogin = (location.state as { email?: string } | null)?.email ?? "";
  const [espera, setEspera] = useState(0);
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<RecuperarFormValues>({
    resolver: zodResolver(recuperarSchema),
    defaultValues: { email: emailLogin },
  });

  const enviar = useMutation({
    mutationFn: (email: string) =>
      apiFetch<void>("/auth/contrasena/olvidada", {
        method: "POST",
        skipAuth: true,
        body: JSON.stringify({ email }),
      }),
    onSuccess: () => setEspera(REENVIO_S),
  });

  useEffect(() => {
    if (espera <= 0) return;
    const t = setTimeout(() => setEspera((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [espera]);

  // Tras el primer envío se queda el check aunque se pida otro correo.
  const enviado = enviar.isSuccess || (enviar.isPending && espera > 0);
  const estado = enviar.isError ? "error" : enviado ? "ok" : "espera";

  return (
    <AuthLayout title={enviado ? "Revisa tu correo" : "Recupera tu contraseña"}>
      <div className="auth-pop space-y-4">
        <div className="flex justify-center">
          <IconoEstado
            estado={estado}
            etiquetas={{ espera: "Correo", ok: "Enlace enviado", error: "No se ha podido enviar" }}
          />
        </div>

        {enviado ? (
          <>
            <p className="text-center text-sm text-neutral-300" aria-live="polite">
              Si existe una cuenta con la dirección
              <span className="my-0.5 block font-medium text-ink-text">{getValues("email")}</span>
              te hemos enviado un enlace para elegir una contraseña nueva.
            </p>
            <p className="text-center text-xs text-neutral-500">
              Si no te llega, comprueba que la dirección es correcta y mira en la carpeta de spam. El enlace caduca en 60 minutos.
            </p>
            <Link to="/login" className={buttonClass("primary", "w-full")}>
              Volver a iniciar sesión
            </Link>
            <p className="text-center text-xs">
              <button
                type="button"
                disabled={espera > 0 || enviar.isPending}
                onClick={() => enviar.mutate(getValues("email"))}
                className="text-accent hover:underline disabled:text-neutral-600 disabled:no-underline"
              >
                {enviar.isPending ? "Enviando…" : espera > 0 ? `¿No llega? Reenviar en ${espera} s` : "Reenviar el enlace"}
              </button>
            </p>
          </>
        ) : (
          <form
            onSubmit={handleSubmit((v) => enviar.mutate(v.email))}
            className="space-y-4"
            noValidate
          >
            <p className="text-center text-sm text-neutral-300">
              Escribe el email de tu cuenta y te enviaremos un enlace para elegir una contraseña nueva.
            </p>
            <FormField label="Email" error={errors.email?.message}>
              <TextInput
                type="email"
                autoComplete="email"
                autoFocus={!emailLogin}
                {...register("email", { onChange: () => enviar.isError && enviar.reset() })}
              />
            </FormField>

            {enviar.isError && (
              <p className="text-center text-sm text-red-400">
                {enviar.error instanceof ApiError ? enviar.error.message : "No se ha podido enviar el enlace"}
              </p>
            )}

            <button type="submit" disabled={enviar.isPending} className={buttonClass("primary", "w-full")}>
              {enviar.isPending ? "Enviando…" : "Enviar enlace"}
            </button>
          </form>
        )}

        {!enviado && (
          <p className="text-center text-sm text-neutral-400">
            ¿Ya te acuerdas?{" "}
            <Link to="/login" className="text-accent hover:underline">
              Inicia sesión
            </Link>
          </p>
        )}
      </div>
    </AuthLayout>
  );
}
