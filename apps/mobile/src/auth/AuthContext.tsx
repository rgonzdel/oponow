import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  apiFetch,
  getStoredRefreshToken,
  setAccessToken,
  setStoredRefreshToken,
} from "../lib/api-client";

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

type AuthStatus = "loading" | "authenticated" | "anonymous";

interface AuthState {
  user: AuthUser | null;
  status: AuthStatus;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
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
    const stored = await getStoredRefreshToken();
    if (!stored) throw new Error("Sin sesión guardada");

    const tokens = await apiFetch<AuthTokensResponse>("/auth/refresh", {
      method: "POST",
      skipAuth: true,
      body: JSON.stringify({ refreshToken: stored }),
    });
    setAccessToken(tokens.accessToken);
    await setStoredRefreshToken(tokens.refreshToken);
    await loadUser();
  }

  useEffect(() => {
    // Al abrir la app: si hay refresh token guardado en el keychain/keystore
    // del sistema, lo usamos para recuperar sesión sin pedir nada al usuario.
    (async () => {
      try {
        await refreshSession();
      } catch {
        setAccessToken(null);
        await setStoredRefreshToken(null);
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
    await setStoredRefreshToken(tokens.refreshToken);
    await loadUser();
  }

  async function register(email: string, password: string) {
    const tokens = await apiFetch<AuthTokensResponse>("/auth/register", {
      method: "POST",
      skipAuth: true,
      body: JSON.stringify({ email, password }),
    });
    setAccessToken(tokens.accessToken);
    await setStoredRefreshToken(tokens.refreshToken);
    await loadUser();
  }

  async function logout() {
    const stored = await getStoredRefreshToken();
    await apiFetch("/auth/logout", {
      method: "POST",
      body: JSON.stringify({ refreshToken: stored }),
    }).catch(() => {});
    setAccessToken(null);
    await setStoredRefreshToken(null);
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
