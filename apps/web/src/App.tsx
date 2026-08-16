import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext";
import { RequireAuth } from "./components/RequireAuth";
import { RedirectIfAuthenticated } from "./components/RedirectIfAuthenticated";
import { LandingPage } from "./pages/LandingPage";
import { OposicionesPage } from "./pages/OposicionesPage";
import { OposicionLandingPage } from "./pages/OposicionLandingPage";
import { SimulacroPage } from "./pages/SimulacroPage";
import { TemarioPage } from "./pages/TemarioPage";
import { TemaReaderPage } from "./pages/TemaReaderPage";
import { CheckoutPage } from "./pages/CheckoutPage";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { DashboardPage } from "./pages/DashboardPage";

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/oposiciones" element={<OposicionesPage />} />
          <Route path="/oposiciones/:slug" element={<OposicionLandingPage />} />
          <Route path="/oposiciones/:slug/simulacro" element={<SimulacroPage />} />
          <Route
            path="/oposiciones/:slug/temario"
            element={
              <RequireAuth>
                <TemarioPage />
              </RequireAuth>
            }
          />
          <Route
            path="/oposiciones/:slug/temario/:temaId"
            element={
              <RequireAuth>
                <TemaReaderPage />
              </RequireAuth>
            }
          />
          <Route
            path="/checkout"
            element={
              <RequireAuth>
                <CheckoutPage />
              </RequireAuth>
            }
          />
          <Route
            path="/login"
            element={
              <RedirectIfAuthenticated>
                <LoginPage />
              </RedirectIfAuthenticated>
            }
          />
          <Route
            path="/register"
            element={
              <RedirectIfAuthenticated>
                <RegisterPage />
              </RedirectIfAuthenticated>
            }
          />
          <Route
            path="/dashboard"
            element={
              <RequireAuth>
                <DashboardPage />
              </RequireAuth>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
