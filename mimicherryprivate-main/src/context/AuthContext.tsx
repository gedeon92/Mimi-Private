import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { refreshSession } from "@/lib/api";
import {
  fetchCurrentUser,
  login as loginRequest,
  logout as logoutRequest,
  register as registerRequest,
  type AuthUser,
  type RegisterPayload,
} from "@/api/auth";
import { updateProfile as updateProfileRequest, type UpdateProfilePayload } from "@/api/users";

type AuthStatus = "loading" | "authenticated" | "unauthenticated";

interface AuthContextValue {
  user: AuthUser | null;
  status: AuthStatus;
  login: (email: string, password: string) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (payload: UpdateProfilePayload) => Promise<void>;
  setUser: (user: AuthUser) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [status, setStatus] = useState<AuthStatus>("loading");

  // Au montage : tente de restaurer la session via le cookie de refresh
  // httpOnly (le token d'accès en mémoire ne survit pas à un rechargement).
  useEffect(() => {
    let cancelled = false;

    (async () => {
      const token = await refreshSession();
      if (cancelled) return;
      if (!token) {
        setStatus("unauthenticated");
        return;
      }
      try {
        const me = await fetchCurrentUser();
        if (cancelled) return;
        setUser(me);
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
    const loggedInUser = await loginRequest(email, password);
    setUser(loggedInUser);
    setStatus("authenticated");
  }, []);

  const register = useCallback(async (payload: RegisterPayload) => {
    const newUser = await registerRequest(payload);
    setUser(newUser);
    setStatus("authenticated");
  }, []);

  const logout = useCallback(async () => {
    await logoutRequest();
    setUser(null);
    setStatus("unauthenticated");
  }, []);

  const updateProfile = useCallback(async (payload: UpdateProfilePayload) => {
    const updated = await updateProfileRequest(payload);
    setUser(updated);
  }, []);

  const setUserDirectly = useCallback((updated: AuthUser) => setUser(updated), []);

  const value = useMemo<AuthContextValue>(
    () => ({ user, status, login, register, logout, updateProfile, setUser: setUserDirectly }),
    [user, status, login, register, logout, updateProfile, setUserDirectly],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
};
