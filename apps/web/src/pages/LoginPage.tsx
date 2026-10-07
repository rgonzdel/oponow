import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { useAuth, type DesafioMfa } from "../auth/AuthContext";
import { loginSchema, type LoginFormValues } from "../lib/schemas";
import { ApiError } from "../lib/api-client";
import { AuthLayout } from "../components/AuthLayout";
import { FormField, TextInput } from "../components/FormField";
import { buttonClass } from "../components/button";
import { AccesoAlternativo } from "../components/AccesoAlternativo";
import { CodigoMfa } from "../components/CodigoMfa";

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  // En un navegador nuevo, tras la contraseña llega el paso del código.
  const [desafio, setDesafio] = useState<DesafioMfa | null>(null);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) });

  const mutation = useMutation({
    mutationFn: (values: LoginFormValues) =>
      login(values.email, values.password),
    onSuccess: (pendiente) => {
      if (pendiente) setDesafio(pendiente);
      else irDespuesDeEntrar();
    },
  });

  function irDespuesDeEntrar() {
    navigate(searchParams.get("next") ?? "/dashboard", { replace: true });
  }

  if (desafio) {
    return (
      <AuthLayout title="Revisa tu correo">
        <CodigoMfa
          desafio={desafio}
          onSuccess={irDespuesDeEntrar}
          onVolver={() => {
            setDesafio(null);
            mutation.reset();
          }}
        />
      </AuthLayout>
    );
  }

  return (
    <AuthLayout title="Inicia sesión">
      <form
        onSubmit={handleSubmit((values) => mutation.mutate(values))}
        className="auth-stagger space-y-4"
        noValidate
      >
        <FormField label="Email" error={errors.email?.message}>
          <TextInput type="email" autoComplete="email" {...register("email")} />
        </FormField>
        <FormField label="Contraseña" error={errors.password?.message}>
          <TextInput
            type="password"
            autoComplete="current-password"
            {...register("password")}
          />
        </FormField>
        <div className="-mt-2 text-right">
          <Link
            to="/recuperar-contrasena"
            state={{ email: watch("email") }}
            className="text-xs text-neutral-400 transition-colors hover:text-accent"
          >
            ¿Has olvidado tu contraseña?
          </Link>
        </div>

        {mutation.isError && (
          <p className="text-sm text-red-400">
            {mutation.error instanceof ApiError
              ? mutation.error.message
              : "No se pudo iniciar sesión"}
          </p>
        )}

        <button
          type="submit"
          disabled={mutation.isPending}
          className={buttonClass("primary", "w-full")}
        >
          {mutation.isPending ? "Entrando…" : "Entrar"}
        </button>
      </form>

      <div className="mt-5">
        <AccesoAlternativo modo="signin" onSuccess={irDespuesDeEntrar} />
      </div>

      <p className="mt-6 text-center text-sm text-neutral-400">
        ¿No tienes cuenta?{" "}
        <Link
          to={{ pathname: "/register", search: searchParams.toString() }}
          className="text-accent hover:underline"
        >
          Regístrate
        </Link>
      </p>
    </AuthLayout>
  );
}
