import { type ReactNode } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  Tags,
  ShoppingBag,
  Users,
  UserCircle,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAdminAuth } from "@/context/AdminAuthContext";

const nav = [
  { label: "Tableau de bord", to: "/", icon: LayoutDashboard, end: true },
  { label: "Produits", to: "/produits", icon: Package },
  { label: "Catégories", to: "/categories", icon: Tags },
  { label: "Commandes", to: "/commandes", icon: ShoppingBag },
  { label: "Clients", to: "/clients", icon: Users },
];

export const AdminLayout = ({ children }: { children: ReactNode }) => {
  const { admin, logout } = useAdminAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/connexion", { replace: true });
  };

  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed inset-y-0 left-0 z-40 flex w-64 shrink-0 flex-col overflow-y-auto border-r border-border bg-offwhite/40 px-5 py-7">
        <div className="mb-10 px-2">
          <p className="font-serif text-2xl leading-none text-foreground">MC</p>
          <p className="mt-1 text-[0.6rem] uppercase tracking-[0.25em] text-muted-foreground">
            Administration
          </p>
        </div>

        <nav className="flex flex-1 flex-col gap-1">
          {nav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-[0.72rem] uppercase tracking-[0.16em] transition-colors",
                  isActive
                    ? "bg-foreground text-background"
                    : "text-muted-foreground hover:bg-foreground/5 hover:text-foreground",
                )
              }
            >
              <item.icon className="h-4 w-4" strokeWidth={1.6} />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto space-y-1 border-t border-border pt-4">
          <NavLink
            to="/profil"
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-[0.72rem] uppercase tracking-[0.16em] transition-colors",
                isActive
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:bg-foreground/5 hover:text-foreground",
              )
            }
          >
            <UserCircle className="h-4 w-4" strokeWidth={1.6} />
            {admin?.firstName ?? "Profil"}
          </NavLink>
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-[0.72rem] uppercase tracking-[0.16em] text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
          >
            <LogOut className="h-4 w-4" strokeWidth={1.6} />
            Déconnexion
          </button>
        </div>
      </aside>

      <main className="ml-64 overflow-x-hidden px-8 py-8 md:px-12">{children}</main>
    </div>
  );
};
