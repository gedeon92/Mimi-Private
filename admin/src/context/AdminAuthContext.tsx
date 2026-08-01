import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { refreshAdminSession } from "@/lib/api";
import { adminLogin, adminLogout, fetchCurrentAdmin, type AdminUser } from "@/api/auth";

type AuthStatus = "loading" | "authenticated" | "unauthenticated";

interface AdminAuthContextValue {
  admin: AdminUser | null;
  status: AuthStatus;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  setAdmin: (admin: AdminUser) => void;
}

const AdminAuthContext = createContext<AdminAuthContextValue | null>(null);

export const AdminAuthProvider = ({ children }: { children: ReactNode }) => {
  const [admin, setAdminState] = useState<AdminUser | null>(null);
  const [status, setStatus] = useState<AuthStatus>("loading");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const token = await refreshAdminSession();
      if (cancelled) return;
      if (!token) {
        setStatus("unauthenticated");
        return;
      }
      try {
        const me = await fetchCurrentAdmin();
        if (cancelled) return;
        if (me.role !== "ADMIN") {
          setStatus("unauthenticated");
          return;
        }
        setAdminState(me);
        setStatus("authenticated");
      } catch {
        if (!cancelled) setStatus("unauthenticated");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const user = await adminLogin(email, password);
    setAdminState(user);
    setStatus("authenticated");
  }, []);

  const logout = useCallback(async () => {
    await adminLogout();
    setAdminState(null);
    setStatus("unauthenticated");
  }, []);

  const setAdmin = useCallback((user: AdminUser) => setAdminState(user), []);

  const value = useMemo<AdminAuthContextValue>(
    () => ({ admin, status, login, logout, setAdmin }),
    [admin, status, login, logout, setAdmin],
  );

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
};

export const useAdminAuth = () => {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error("useAdminAuth must be used within an AdminAuthProvider");
  return ctx;
};
