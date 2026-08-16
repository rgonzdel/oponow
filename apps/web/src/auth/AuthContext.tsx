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
}

interface AuthTokensResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: string;
}

type AuthStatus = "loading" | "authenticated" | "anonymous";

interface AuthState {
  user: AuthUser | null;
  status: AuthStatus;
  login: (email: string, password: string) => Promise<void>;
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
    const tokens = await apiFetch<AuthTokensResponse>("/auth/login", {
      method: "POST",
      skipAuth: true,
      body: JSON.stringify({ email, password }),
    });
    setAccessToken(tokens.accessToken);
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
      value={{ user, status, login, register, logout, refreshSession }}
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
