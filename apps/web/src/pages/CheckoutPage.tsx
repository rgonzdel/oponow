import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useAuth } from "../auth/AuthContext";
import { SiteHeader } from "../components/SiteHeader";
import { FormField, TextInput } from "../components/FormField";
import { buttonClass } from "../components/button";
import { LoadingScreen } from "../components/LoadingScreen";
import { checkoutSchema, type CheckoutFormValues } from "../lib/schemas";
import { ApiError } from "../lib/api-client";
import { getSubscriptionStatus, subscribeWithTrial } from "../lib/billing-client";
import { OPOSICIONES } from "../data/oposiciones";
import { PLAN_PRECIO, type BillingCycle } from "../data/pricing";

const TRIAL_DAYS = 7;

function formatCardNumber(value: string) {
  return value
    .replace(/\D/g, "")
    .slice(0, 19)
    .replace(/(.{4})/g, "$1 ")
    .trim();
}

function formatExpiry(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

export function CheckoutPage() {
  const [searchParams] = useSearchParams();
  const slug = searchParams.get("oposicion") ?? "";
  const ciclo: BillingCycle =
    searchParams.get("ciclo") === "anual" ? "anual" : "mensual";
  const catalogEntry = OPOSICIONES.find((o) => o.slug === slug);
  const navigate = useNavigate();
  const { refreshSession } = useAuth();

  const statusQuery = useQuery({
    queryKey: ["billing", "subscription", slug],
    queryFn: () => getSubscriptionStatus(slug),
    enabled: Boolean(slug),
    retry: false,
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CheckoutFormValues>({ resolver: zodResolver(checkoutSchema) });

  const mutation = useMutation({
    mutationFn: (values: CheckoutFormValues) =>
      subscribeWithTrial({ oposicionSlug: slug, ...values }),
    onSuccess: async () => {
      await refreshSession();
      navigate("/dashboard", { replace: true });
    },
  });

  if (!slug || !catalogEntry) {
    return <Navigate to="/oposiciones" replace />;
  }

  if (statusQuery.isLoading) return <LoadingScreen />;

  const nombre = statusQuery.data?.oposicionNombre ?? catalogEntry.nombre;

  return (
    <div>
      <SiteHeader />

      <main className="mx-auto max-w-md px-6 py-16">
        {statusQuery.data?.subscribed ? (
          <div className="rounded-lg border border-ink-divider bg-ink-surface p-6 text-center">
            <p className="text-ink-text">
              Ya tienes <span className="text-accent">{nombre}</span> activa
              {statusQuery.data.estado === "trialing"
                ? " (en periodo de prueba)."
                : "."}
            </p>
            <Link to="/dashboard" className={buttonClass("primary", "mt-5 w-full")}>
              Ir al dashboard
            </Link>
          </div>
        ) : (
          <>
            <div className="text-center">
              <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">
                Suscripción {ciclo === "anual" ? "anual" : "mensual"}
              </p>
              <h1 className="mt-1 text-2xl font-medium tracking-tight text-ink-text">
                {nombre}
              </h1>
            </div>

            <div className="mt-6 rounded-lg border border-accent bg-ink-surface p-4 text-sm text-neutral-300">
              <p>
                <span className="font-medium text-ink-text">
                  {TRIAL_DAYS} días gratis
                </span>
                , después {PLAN_PRECIO[ciclo].valor}
                {PLAN_PRECIO[ciclo].sufijo}. Cancela cuando quieras antes de
                que acabe la prueba y no se te cobrará nada.
              </p>
            </div>

            <form
              onSubmit={handleSubmit((values) => mutation.mutate(values))}
              className="mt-6 space-y-4"
              noValidate
            >
              <FormField label="Nombre del titular" error={errors.cardName?.message}>
                <TextInput
                  autoComplete="cc-name"
                  placeholder="Como aparece en la tarjeta"
                  {...register("cardName")}
                />
              </FormField>

              <FormField label="Número de tarjeta" error={errors.cardNumber?.message}>
                <TextInput
                  inputMode="numeric"
                  autoComplete="cc-number"
                  placeholder="1234 1234 1234 1234"
                  value={formatCardNumber(watch("cardNumber") ?? "")}
                  onChange={(e) =>
                    setValue("cardNumber", formatCardNumber(e.target.value), {
                      shouldValidate: true,
                    })
                  }
                />
              </FormField>

              <div className="grid grid-cols-2 gap-4">
                <FormField label="Caducidad" error={errors.cardExpiry?.message}>
                  <TextInput
                    inputMode="numeric"
                    autoComplete="cc-exp"
                    placeholder="MM/AA"
                    value={watch("cardExpiry") ?? ""}
                    onChange={(e) =>
                      setValue("cardExpiry", formatExpiry(e.target.value), {
                        shouldValidate: true,
                      })
                    }
                  />
                </FormField>
                <FormField label="CVC" error={errors.cardCvc?.message}>
                  <TextInput
                    inputMode="numeric"
                    autoComplete="cc-csc"
                    placeholder="123"
                    maxLength={4}
                    {...register("cardCvc")}
                  />
                </FormField>
              </div>

              {mutation.isError && (
                <p className="text-sm text-red-400">
                  {mutation.error instanceof ApiError
                    ? mutation.error.message
                    : "No se pudo procesar el pago"}
                </p>
              )}

              <button
                type="submit"
                disabled={mutation.isPending}
                className={buttonClass("primary", "w-full")}
              >
                {mutation.isPending
                  ? "Procesando…"
                  : `Empezar prueba de ${TRIAL_DAYS} días`}
              </button>

              <p className="text-center text-xs text-neutral-500">
                Pago procesado de forma segura. Podrás cancelar en cualquier
                momento desde tu cuenta.
              </p>
            </form>
          </>
        )}
      </main>
    </div>
  );
}
