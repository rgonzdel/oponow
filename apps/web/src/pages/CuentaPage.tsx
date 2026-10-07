import { useState, type FormEvent, type ReactNode } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../auth/AuthContext";
import { SiteHeader } from "../components/SiteHeader";
import { LoadingScreen } from "../components/LoadingScreen";
import { FormField, TextInput } from "../components/FormField";
import { buttonClass } from "../components/button";
import { ApiError } from "../lib/api-client";
import {
  abrirPortalPagos,
  cancelSubscription,
  getPasarela,
  listMySubscriptions,
  type SubscriptionStatus,
} from "../lib/billing-client";
import {
  borrarCuenta,
  cambiarContrasena,
  cerrarOtrasSesiones,
  getCuenta,
  pedirCambioEmail,
  pedirEnlaceContrasena,
} from "../lib/cuenta-client";

const PLAN: Record<string, string> = { free: "Gratis", lite: "Lite", vip: "VIP" };
const ESTADO_SUSCRIPCION: Record<string, string> = {
  trialing: "Periodo de prueba",
  active: "Activa",
  past_due: "Pago pendiente",
  canceled: "Cancelada",
};
const PROVEEDOR: Record<string, string> = { google: "Google", facebook: "Facebook" };
const EUROS = new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" });
const FECHA = new Intl.DateTimeFormat("es-ES", { day: "numeric", month: "long", year: "numeric" });

const mensajeError = (e: unknown, porDefecto: string) => (e instanceof ApiError ? e.message : porDefecto);

/** Mi cuenta: datos, contraseña, email, suscripción, sesiones y baja. */
export function CuentaPage() {
  const cuenta = useQuery({ queryKey: ["cuenta"], queryFn: getCuenta });
  const suscripciones = useQuery({ queryKey: ["billing", "subscriptions", "mine"], queryFn: listMySubscriptions });

  if (cuenta.isLoading) return <LoadingScreen />;
  const c = cuenta.data;

  return (
    <div>
      <SiteHeader />
      <main className="mx-auto max-w-2xl px-6 py-12">
        <Link to="/dashboard" className="text-sm text-neutral-500 transition-colors hover:text-ink-text">
          ← Panel
        </Link>
        <h1 className="mt-3 text-2xl font-medium tracking-tight text-ink-text">Mi cuenta</h1>

        {!c ? (
          <p className="mt-6 text-sm text-red-400">No se han podido cargar los datos de tu cuenta. Recarga la página.</p>
        ) : (
          <div className="mt-6 space-y-4">
            <Tarjeta>
              <div className="flex flex-wrap items-center gap-2">
                <span className="break-all text-base text-ink-text">{c.email ?? "Sin email"}</span>
                {c.email && (
                  <Chip tono={c.emailVerificado ? "ok" : "aviso"}>{c.emailVerificado ? "Verificado" : "Sin verificar"}</Chip>
                )}
              </div>
              <dl className="mt-4 grid grid-cols-1 gap-3 text-sm sm:grid-cols-3">
                <Dato titulo="Plan">
                  <Chip tono="acento">{PLAN[c.plan] ?? c.plan}</Chip>
                </Dato>
                <Dato titulo="Miembro desde">{FECHA.format(new Date(c.creadaEn))}</Dato>
                <Dato titulo="Formas de entrar">
                  {[c.tieneContrasena ? "Email y contraseña" : null, ...c.proveedores.map((p) => PROVEEDOR[p] ?? p)]
                    .filter(Boolean)
                    .join(" · ") || "—"}
                </Dato>
              </dl>
            </Tarjeta>

            <SeccionContrasena tieneContrasena={c.tieneContrasena} email={c.email} />
            <SeccionEmail email={c.email} tieneContrasena={c.tieneContrasena} />
            <SeccionSuscripcion
              plan={c.plan}
              suscripciones={suscripciones.data ?? []}
              cargando={suscripciones.isLoading}
            />
            <SeccionSesiones sesiones={c.sesionesActivas} dispositivos={c.dispositivosConfianza} />
            <SeccionBorrar tieneContrasena={c.tieneContrasena} />
          </div>
        )}
      </main>
    </div>
  );
}

function SeccionContrasena({ tieneContrasena, email }: { tieneContrasena: boolean; email: string | null }) {
  const { entrarConToken } = useAuth();
  const queryClient = useQueryClient();
  const [actual, setActual] = useState("");
  const [nueva, setNueva] = useState("");
  const [repetida, setRepetida] = useState("");
  const [errorLocal, setErrorLocal] = useState<string | null>(null);

  const cambiar = useMutation({
    mutationFn: () => cambiarContrasena(actual, nueva),
    onSuccess: async ({ accessToken }) => {
      await entrarConToken(accessToken);
      setActual("");
      setNueva("");
      setRepetida("");
      queryClient.invalidateQueries({ queryKey: ["cuenta"] });
    },
  });
  const enlace = useMutation({ mutationFn: () => pedirEnlaceContrasena(email ?? "") });

  function enviar(e: FormEvent) {
    e.preventDefault();
    setErrorLocal(null);
    if (nueva.length < 8) return setErrorLocal("La contraseña nueva debe tener al menos 8 caracteres.");
    if (nueva !== repetida) return setErrorLocal("Las contraseñas nuevas no coinciden.");
    cambiar.mutate();
  }

  return (
    <Tarjeta titulo="Contraseña">
      {tieneContrasena ? (
        <form onSubmit={enviar} className="space-y-3" noValidate>
          <FormField label="Contraseña actual">
            <TextInput type="password" autoComplete="current-password" value={actual} onChange={(e) => { setActual(e.target.value); cambiar.reset(); }} />
          </FormField>
          <div className="grid gap-3 sm:grid-cols-2">
            <FormField label="Contraseña nueva">
              <TextInput type="password" autoComplete="new-password" value={nueva} onChange={(e) => { setNueva(e.target.value); cambiar.reset(); }} />
            </FormField>
            <FormField label="Repite la nueva">
              <TextInput type="password" autoComplete="new-password" value={repetida} onChange={(e) => { setRepetida(e.target.value); cambiar.reset(); }} />
            </FormField>
          </div>
          <Resultado
            error={errorLocal ?? (cambiar.isError ? mensajeError(cambiar.error, "No se ha podido cambiar la contraseña") : null)}
            ok={cambiar.isSuccess ? "Contraseña cambiada. Se ha cerrado la sesión en el resto de dispositivos." : null}
          />
          <button type="submit" disabled={cambiar.isPending || !actual || !nueva} className={buttonClass("primary")}>
            {cambiar.isPending ? "Guardando…" : "Cambiar contraseña"}
          </button>
        </form>
      ) : (
        <div className="space-y-3">
          <p className="text-sm text-neutral-400">
            Entras con Google y tu cuenta no tiene contraseña. Si quieres poder entrar también con tu email, te enviamos un
            enlace para crearla.
          </p>
          <Resultado
            error={enlace.isError ? mensajeError(enlace.error, "No se ha podido enviar el enlace") : null}
            ok={enlace.isSuccess ? `Te hemos enviado el enlace a ${email}.` : null}
          />
          <button type="button" onClick={() => enlace.mutate()} disabled={!email || enlace.isPending || enlace.isSuccess} className={buttonClass("primary")}>
            {enlace.isPending ? "Enviando…" : "Enviarme el enlace"}
          </button>
        </div>
      )}
    </Tarjeta>
  );
}

function SeccionEmail({ email, tieneContrasena }: { email: string | null; tieneContrasena: boolean }) {
  const [nuevo, setNuevo] = useState("");
  const [password, setPassword] = useState("");
  const [enviadoA, setEnviadoA] = useState<string | null>(null);

  const pedir = useMutation({
    mutationFn: () => pedirCambioEmail(nuevo.trim(), password),
    onSuccess: () => {
      setEnviadoA(nuevo.trim());
      setNuevo("");
      setPassword("");
    },
  });

  return (
    <Tarjeta titulo="Email">
      <p className="mb-3 text-sm text-neutral-400">
        Ahora usas <span className="text-ink-text">{email ?? "ninguno"}</span>. Te enviaremos un enlace a la dirección nueva
        para confirmarla; hasta entonces sigue valiendo la actual.
      </p>
      {tieneContrasena ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            pedir.mutate();
          }}
          className="space-y-3"
          noValidate
        >
          <div className="grid gap-3 sm:grid-cols-2">
            <FormField label="Email nuevo">
              <TextInput type="email" autoComplete="email" value={nuevo} onChange={(e) => { setNuevo(e.target.value); pedir.reset(); }} />
            </FormField>
            <FormField label="Tu contraseña">
              <TextInput type="password" autoComplete="current-password" value={password} onChange={(e) => { setPassword(e.target.value); pedir.reset(); }} />
            </FormField>
          </div>
          <Resultado
            error={pedir.isError ? mensajeError(pedir.error, "No se ha podido pedir el cambio") : null}
            ok={
              enviadoA && !pedir.isError
                ? `Si ${enviadoA} está disponible, te hemos enviado un enlace para confirmarla. Caduca en 1 hora.`
                : null
            }
          />
          <button type="submit" disabled={pedir.isPending || !nuevo || !password} className={buttonClass("primary")}>
            {pedir.isPending ? "Enviando…" : "Cambiar email"}
          </button>
        </form>
      ) : (
        <p className="text-sm text-neutral-500">Para cambiar el email, crea primero una contraseña (sección de arriba).</p>
      )}
    </Tarjeta>
  );
}

function SeccionSuscripcion({
  plan,
  suscripciones,
  cargando,
}: {
  plan: string;
  suscripciones: SubscriptionStatus[];
  cargando: boolean;
}) {
  const queryClient = useQueryClient();
  const { refreshSession } = useAuth();
  const [confirmando, setConfirmando] = useState<string | null>(null);
  const pasarela = useQuery({ queryKey: ["billing", "pasarela"], queryFn: getPasarela, staleTime: Infinity });
  const portal = useMutation({ mutationFn: abrirPortalPagos, onSuccess: ({ url }) => window.location.assign(url) });
  const conStripe = pasarela.data?.tipo === "stripe";
  const cancelar = useMutation({
    mutationFn: (slug: string) => cancelSubscription(slug),
    onSuccess: async () => {
      setConfirmando(null);
      // El plan viaja en el access token: hay que pedir uno nuevo.
      await refreshSession().catch(() => {});
      queryClient.invalidateQueries({ queryKey: ["billing"] });
      queryClient.invalidateQueries({ queryKey: ["cuenta"] });
    },
  });

  return (
    <Tarjeta titulo="Suscripción">
      {cargando ? (
        <p className="text-sm text-neutral-500">Cargando…</p>
      ) : suscripciones.length === 0 ? (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-neutral-400">
            {plan === "vip" ? "Tu plan VIP incluye todas las oposiciones." : "Estás en el plan gratuito: el tema 1 de cada oposición y un test al día."}
          </p>
          {plan !== "vip" && (
            <Link to="/oposiciones" className={buttonClass("primary")}>
              Ver planes
            </Link>
          )}
        </div>
      ) : (
        <>
        <ul className="space-y-3">
          {suscripciones.map((s) => (
            <li key={s.oposicionSlug} className="rounded-md border border-ink-divider p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-sm text-ink-text">{s.oposicionNombre}</span>
                <Chip tono={s.estado === "past_due" ? "aviso" : "ok"}>{ESTADO_SUSCRIPCION[s.estado ?? ""] ?? "Activa"}</Chip>
              </div>
              <dl className="mt-3 grid grid-cols-1 gap-3 text-sm sm:grid-cols-3">
                <Dato titulo="Próximo pago">
                  {s.proximoPago ? FECHA.format(new Date(s.proximoPago)) : "—"}
                  {s.estado === "trialing" && s.proximoPago && (
                    <span className="block text-xs text-neutral-500">al terminar la prueba gratuita</span>
                  )}
                </Dato>
                <Dato titulo="Importe">
                  {s.importeCentimos != null ? (
                    <>
                      {EUROS.format(s.importeCentimos / 100)}
                      <span className="text-neutral-500"> {s.ciclo === "anual" ? "al año" : "al mes"}</span>
                    </>
                  ) : (
                    "—"
                  )}
                </Dato>
                <Dato titulo="Método de pago">
                  <MetodoPago metodo={s.metodoPago ?? null} />
                </Dato>
              </dl>
              {s.cancelaEl && (
                <p className="mt-3 rounded-md bg-amber-400/10 px-3 py-2 text-xs text-amber-300">
                  Cancelada: mantienes el acceso hasta el {FECHA.format(new Date(s.cancelaEl))} y no se te cobrará más.
                </p>
              )}
              {s.cancelaEl ? null : confirmando === s.oposicionSlug ? (
                <div className="mt-3 rounded-md border border-red-400/40 bg-red-500/10 p-3">
                  <p className="text-sm text-ink-text">
                    {conStripe
                      ? "¿Cancelar la suscripción? No se te volverá a cobrar y mantendrás el acceso hasta el final del periodo ya pagado (o de la prueba). Tu progreso se conserva."
                      : "¿Cancelar la suscripción? Dejarás de tener acceso a los temas de pago de esta oposición. Tu progreso se conserva."}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button type="button" onClick={() => cancelar.mutate(s.oposicionSlug)} disabled={cancelar.isPending} className="rounded-md border border-red-400/60 px-3 py-1.5 text-sm text-red-300 transition-colors hover:bg-red-500/15">
                      {cancelar.isPending ? "Cancelando…" : "Sí, cancelar"}
                    </button>
                    <button type="button" onClick={() => setConfirmando(null)} className={buttonClass("ghost")}>
                      No, mantenerla
                    </button>
                  </div>
                  {cancelar.isError && <p className="mt-2 text-xs text-red-400">{mensajeError(cancelar.error, "No se ha podido cancelar")}</p>}
                </div>
              ) : (
                <button type="button" onClick={() => setConfirmando(s.oposicionSlug)} className="mt-3 text-xs text-neutral-400 underline-offset-2 transition-colors hover:text-red-300 hover:underline">
                  Cancelar suscripción
                </button>
              )}
            </li>
          ))}
        </ul>
        {conStripe && (
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-ink-divider pt-4">
            <p className="text-xs text-neutral-500">Cambia la tarjeta, descarga tus facturas o reactiva la suscripción.</p>
            <button type="button" onClick={() => portal.mutate()} disabled={portal.isPending || portal.isSuccess} className={buttonClass("ghost")}>
              {portal.isPending || portal.isSuccess ? "Abriendo…" : "Gestionar pago y facturas"}
            </button>
            {portal.isError && <p className="w-full text-xs text-red-400">{mensajeError(portal.error, "No se ha podido abrir la gestión de pagos")}</p>}
          </div>
        )}
        </>
      )}
    </Tarjeta>
  );
}

function SeccionSesiones({ sesiones, dispositivos }: { sesiones: number; dispositivos: number }) {
  const { entrarConToken } = useAuth();
  const queryClient = useQueryClient();
  const cerrar = useMutation({
    mutationFn: cerrarOtrasSesiones,
    onSuccess: async ({ accessToken }) => {
      await entrarConToken(accessToken);
      queryClient.invalidateQueries({ queryKey: ["cuenta"] });
    },
  });

  return (
    <Tarjeta titulo="Sesiones y dispositivos">
      <p className="text-sm text-neutral-400">
        Tienes {sesiones} {sesiones === 1 ? "sesión abierta" : "sesiones abiertas"} y {dispositivos}{" "}
        {dispositivos === 1 ? "navegador de confianza" : "navegadores de confianza"} (no piden el código del correo). Si
        has entrado en un ordenador que no es tuyo o has perdido un dispositivo, cierra todas: este navegador seguirá
        dentro.
      </p>
      <Resultado
        error={cerrar.isError ? mensajeError(cerrar.error, "No se han podido cerrar las sesiones") : null}
        ok={cerrar.isSuccess ? "Listo: solo queda abierta la sesión de este navegador." : null}
      />
      <button type="button" onClick={() => cerrar.mutate()} disabled={cerrar.isPending} className={buttonClass("ghost", "mt-3")}>
        {cerrar.isPending ? "Cerrando…" : "Cerrar sesión en los demás dispositivos"}
      </button>
    </Tarjeta>
  );
}

function SeccionBorrar({ tieneContrasena }: { tieneContrasena: boolean }) {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [abierto, setAbierto] = useState(false);
  const [password, setPassword] = useState("");
  const [texto, setTexto] = useState("");
  const borrar = useMutation({
    mutationFn: () => borrarCuenta(tieneContrasena ? password : undefined),
    onSuccess: async () => {
      await logout();
      queryClient.clear();
      navigate("/?cuenta=eliminada", { replace: true });
    },
  });
  const listo = texto.trim().toUpperCase() === "BORRAR" && (!tieneContrasena || password.length > 0);

  return (
    <section className="rounded-lg border border-red-400/30 bg-ink-surface p-5">
      <h2 className="text-sm font-medium text-red-300">Eliminar cuenta</h2>
      <p className="mt-2 text-sm text-neutral-400">
        Se borran para siempre tu cuenta y todos tus datos: progreso, tests, fallos, flashcards, agenda y suscripciones. No
        se puede deshacer.
      </p>
      {!abierto ? (
        <button type="button" onClick={() => setAbierto(true)} className="mt-4 rounded-md border border-red-400/50 px-3 py-1.5 text-sm text-red-300 transition-colors hover:bg-red-500/10">
          Quiero eliminar mi cuenta
        </button>
      ) : (
        <form
          className="mt-4 space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            if (listo) borrar.mutate();
          }}
          noValidate
        >
          {tieneContrasena && (
            <FormField label="Tu contraseña">
              <TextInput type="password" autoComplete="current-password" value={password} onChange={(e) => { setPassword(e.target.value); borrar.reset(); }} />
            </FormField>
          )}
          <FormField label='Escribe BORRAR para confirmar'>
            <TextInput value={texto} onChange={(e) => setTexto(e.target.value)} autoComplete="off" spellCheck={false} />
          </FormField>
          {borrar.isError && <p className="text-sm text-red-400">{mensajeError(borrar.error, "No se ha podido eliminar la cuenta")}</p>}
          <div className="flex flex-wrap gap-2">
            <button type="submit" disabled={!listo || borrar.isPending} className="rounded-md bg-red-500/90 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-40">
              {borrar.isPending ? "Eliminando…" : "Eliminar mi cuenta para siempre"}
            </button>
            <button type="button" onClick={() => { setAbierto(false); setPassword(""); setTexto(""); borrar.reset(); }} className={buttonClass("ghost")}>
              Cancelar
            </button>
          </div>
        </form>
      )}
    </section>
  );
}

/** "Visa •••• 4242 · caduca 12/30" o "Bizum · móvil •••• 34". */
function MetodoPago({ metodo }: { metodo: SubscriptionStatus["metodoPago"] }) {
  if (!metodo) return <span className="text-neutral-500">Sin datos</span>;
  if (metodo.tipo === "bizum") {
    return (
      <span className="flex flex-wrap items-center gap-2">
        <Marca>Bizum</Marca>
        {metodo.telefonoUltimos && <span className="tabular-nums">móvil •••• {metodo.telefonoUltimos}</span>}
      </span>
    );
  }
  return (
    <span className="block">
      <span className="flex flex-wrap items-center gap-2">
        <Marca>{metodo.marca ?? "Tarjeta"}</Marca>
        <span className="tabular-nums">•••• {metodo.ultimos4 ?? "····"}</span>
      </span>
      {metodo.caducidad && <span className="mt-0.5 block text-xs text-neutral-500">Caduca {metodo.caducidad}</span>}
    </span>
  );
}

function Marca({ children }: { children: ReactNode }) {
  return (
    <span className="inline-block rounded border border-ink-divider bg-ink px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-neutral-300">
      {children}
    </span>
  );
}

function Tarjeta({ titulo, children }: { titulo?: string; children: ReactNode }) {
  return (
    <section className="rounded-lg border border-ink-divider bg-ink-surface p-5">
      {titulo && <h2 className="mb-3 text-sm font-medium text-ink-text">{titulo}</h2>}
      {children}
    </section>
  );
}

function Dato({ titulo, children }: { titulo: string; children: ReactNode }) {
  return (
    <div>
      <dt className="text-xs text-neutral-500">{titulo}</dt>
      <dd className="mt-1 text-ink-text">{children}</dd>
    </div>
  );
}

function Chip({ tono, children }: { tono: "ok" | "aviso" | "acento"; children: ReactNode }) {
  const clases = {
    ok: "bg-green-500/15 text-green-400",
    aviso: "bg-amber-400/15 text-amber-300",
    acento: "bg-accent-800 text-accent-100",
  }[tono];
  return <span className={`inline-block rounded-md px-2 py-0.5 text-[11px] font-medium ${clases}`}>{children}</span>;
}

function Resultado({ error, ok }: { error: string | null; ok: string | null }) {
  if (error) return <p className="text-sm text-red-400">{error}</p>;
  if (ok) return <p className="text-sm text-green-400">{ok}</p>;
  return null;
}
