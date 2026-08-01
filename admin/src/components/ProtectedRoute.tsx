import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAdminAuth } from "@/context/AdminAuthContext";

export const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { status } = useAdminAuth();

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-sm uppercase tracking-[0.22em] text-muted-foreground">Chargement…</p>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return <Navigate to="/connexion" replace />;
  }

  return <>{children}</>;
};
