import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { LoadingScreen } from "./LoadingScreen";

export function RequireAuth({ children }: { children: React.ReactElement }) {
  const { status } = useAuth();
  const location = useLocation();

  if (status === "loading") return <LoadingScreen />;
  if (status === "anonymous") {
    const next = encodeURIComponent(
      location.pathname + location.search,
    );
    return <Navigate to={`/login?next=${next}`} replace />;
  }
  return children;
}
