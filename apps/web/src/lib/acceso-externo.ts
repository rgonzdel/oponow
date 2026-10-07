import { apiFetch } from "./api-client";

export interface ProveedoresAcceso {
  google: string | null;
  facebook: string | null;
}

export function getProveedores() {
  return apiFetch<ProveedoresAcceso>("/auth/proveedores", { skipAuth: true });
}

// Los SDK de Google y Facebook solo se descargan en las pantallas de acceso
// y solo si ese proveedor está configurado.
const scripts = new Map<string, Promise<void>>();
export function cargarScript(src: string): Promise<void> {
  let p = scripts.get(src);
  if (!p) {
    p = new Promise<void>((resolve, reject) => {
      const s = document.createElement("script");
      s.src = src;
      s.async = true;
      s.onload = () => resolve();
      s.onerror = () => {
        scripts.delete(src);
        reject(new Error(`No se pudo cargar ${src}`));
      };
      document.head.appendChild(s);
    });
    scripts.set(src, p);
  }
  return p;
}

// Tipos mínimos de los SDK que usamos.
declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize(opts: {
            client_id: string;
            callback: (r: { credential: string }) => void;
            ux_mode?: "popup";
            context?: "signin" | "signup";
          }): void;
          renderButton(
            el: HTMLElement,
            opts: Record<string, string | number>,
          ): void;
        };
      };
    };
    FB?: {
      init(opts: { appId: string; version: string; cookie?: boolean; xfbml?: boolean }): void;
      login(
        cb: (r: { authResponse?: { accessToken: string } | null; status: string }) => void,
        opts: { scope: string },
      ): void;
    };
  }
}
