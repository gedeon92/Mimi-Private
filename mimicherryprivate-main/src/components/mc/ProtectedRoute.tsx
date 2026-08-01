import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

/** Redirige vers /connexion tant que la session n'est pas confirmée. */
export const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { status } = useAuth();
  const location = useLocation();

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-sm uppercase tracking-[0.22em] text-muted-foreground">
          Chargement…
        </p>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return <Navigate to="/connexion" state={{ from: location.pathname }} replace />;
  }

  return <>{children}</>;
};
