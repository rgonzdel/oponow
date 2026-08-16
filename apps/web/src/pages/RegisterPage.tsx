import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "../auth/AuthContext";
import { registerSchema, type RegisterFormValues } from "../lib/schemas";
import { ApiError } from "../lib/api-client";
import { AuthLayout } from "../components/AuthLayout";
import { FormField, TextInput } from "../components/FormField";
import { buttonClass } from "../components/button";

export function RegisterPage() {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({ resolver: zodResolver(registerSchema) });

  const mutation = useMutation({
    mutationFn: (values: RegisterFormValues) =>
      registerUser(values.email, values.password),
    onSuccess: () =>
      navigate(searchParams.get("next") ?? "/dashboard", { replace: true }),
  });

  return (
    <AuthLayout title="Crea tu cuenta">
      <form
        onSubmit={handleSubmit((values) => mutation.mutate(values))}
        className="space-y-4"
        noValidate
      >
        <FormField label="Email" error={errors.email?.message}>
          <TextInput type="email" autoComplete="email" {...register("email")} />
        </FormField>
        <FormField label="Contraseña" error={errors.password?.message}>
          <TextInput
            type="password"
            autoComplete="new-password"
            {...register("password")}
          />
        </FormField>

        {mutation.isError && (
          <p className="text-sm text-red-400">
            {mutation.error instanceof ApiError
              ? mutation.error.message
              : "No se pudo crear la cuenta"}
          </p>
        )}

        <button
          type="submit"
          disabled={mutation.isPending}
          className={buttonClass("primary", "w-full")}
        >
          {mutation.isPending ? "Creando cuenta…" : "Crear cuenta"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-neutral-400">
        ¿Ya tienes cuenta?{" "}
        <Link
          to={{ pathname: "/login", search: searchParams.toString() }}
          className="text-accent hover:underline"
        >
          Inicia sesión
        </Link>
      </p>
    </AuthLayout>
  );
}
