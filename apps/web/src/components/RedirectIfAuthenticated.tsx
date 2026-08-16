import { Navigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { LoadingScreen } from "./LoadingScreen";

export function RedirectIfAuthenticated({
  children,
}: {
  children: React.ReactElement;
}) {
  const { status } = useAuth();
  const [searchParams] = useSearchParams();

  if (status === "loading") return <LoadingScreen />;
  if (status === "authenticated") {
    return <Navigate to={searchParams.get("next") ?? "/dashboard"} replace />;
  }
  return children;
}
