import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { apiFetch, setAccessToken } from "../lib/api-client";

export interface AuthUser {
  id: string;
  plan: string;
  isAdmin: boolean;
}

interface AuthTokensResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: string;
}

/** /auth/login en un navegador nuevo: hay que introducir el código del correo. */
export interface DesafioMfa {
  mfaRequerido: true;
  desafioId: string;
  /** Email enmascarado al que se ha enviado el código. */
  email: string;
}

type AuthStatus = "loading" | "authenticated" | "anonymous";

interface AuthState {
  user: AuthUser | null;
  status: AuthStatus;
  /** Devuelve el desafío si este navegador necesita el código del correo;
   * null si ya ha iniciado sesión. */
  login: (email: string, password: string) => Promise<DesafioMfa | null>;
  /** Login con Google (/auth/google), Facebook (/auth/facebook) o con el
   * código MFA del correo (/auth/mfa/verificar). */
  loginCon: (path: string, body: Record<string, string>) => Promise<void>;
  /** Inicia la sesión con un access token ya obtenido (p. ej. tras verificar
   * el código MFA y terminar su animación de éxito). */
  entrarConToken: (accessToken: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  /** El `plan` viaja dentro del access token, así que un cambio de plan en
   * el backend (p.ej. al confirmar una suscripción) no se refleja hasta
   * que hay un token nuevo. Pide uno vía /auth/refresh y recarga /auth/me.
   * Úsalo justo después de cualquier acción que cambie el plan del usuario. */
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [status, setStatus] = useState<AuthStatus>("loading");

  async function loadUser() {
    const me = await apiFetch<AuthUser>("/auth/me");
    setUser(me);
    setStatus("authenticated");
  }

  async function refreshSession() {
    const tokens = await apiFetch<AuthTokensResponse>("/auth/refresh", {
      method: "POST",
      skipAuth: true,
    });
    setAccessToken(tokens.accessToken);
    await loadUser();
  }

  useEffect(() => {
    // La sesión solo se persiste vía la cookie httpOnly de refresh (nada
    // legible por JS). Al montar la app, la usamos para recuperar un access
    // token nuevo en memoria sin pedirle nada al usuario.
    (async () => {
      try {
        await refreshSession();
      } catch {
        setAccessToken(null);
        setUser(null);
        setStatus("anonymous");
      }
    })();
  }, []);

  async function login(email: string, password: string) {
    const res = await apiFetch<AuthTokensResponse | DesafioMfa>("/auth/login", {
      method: "POST",
      skipAuth: true,
      body: JSON.stringify({ email, password }),
    });
    if ("mfaRequerido" in res) return res;
    setAccessToken(res.accessToken);
    await loadUser();
    return null;
  }

  // Google, Facebook y el código MFA: el backend responde con los mismos
  // tokens que /auth/login, así que comparten el resto del flujo.
  async function loginCon(path: string, body: Record<string, string>) {
    const tokens = await apiFetch<AuthTokensResponse>(path, {
      method: "POST",
      skipAuth: true,
      body: JSON.stringify(body),
    });
    setAccessToken(tokens.accessToken);
    await loadUser();
  }

  async function entrarConToken(accessToken: string) {
    setAccessToken(accessToken);
    await loadUser();
  }

  async function register(email: string, password: string) {
    const tokens = await apiFetch<AuthTokensResponse>("/auth/register", {
      method: "POST",
      skipAuth: true,
      body: JSON.stringify({ email, password }),
    });
    setAccessToken(tokens.accessToken);
    await loadUser();
  }

  async function logout() {
    await apiFetch("/auth/logout", { method: "POST" }).catch(() => {});
    setAccessToken(null);
    setUser(null);
    setStatus("anonymous");
  }

  return (
    <AuthContext.Provider
      value={{ user, status, login, loginCon, entrarConToken, register, logout, refreshSession }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de <AuthProvider>");
  return ctx;
}
