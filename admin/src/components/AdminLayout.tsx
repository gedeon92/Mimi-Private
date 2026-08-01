import { useEffect, useState, type ReactNode } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  Tags,
  ShoppingBag,
  Users,
  UserCircle,
  LogOut,
  Menu,
  X,
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
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/connexion", { replace: true });
  };

  // Referme le tiroir mobile à chaque changement de route.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Bloque le scroll du corps de page tant que le tiroir mobile est ouvert.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const sidebarContent = (
    <>
      <div className="mb-10 flex items-center justify-between px-2 md:block">
        <div>
          <p className="font-serif text-2xl leading-none text-foreground">MC</p>
          <p className="mt-1 text-[0.6rem] uppercase tracking-[0.25em] text-muted-foreground">
            Administration
          </p>
        </div>
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label="Fermer le menu"
          className="text-foreground md:hidden"
        >
          <X className="h-6 w-6" strokeWidth={1.4} />
        </button>
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
    </>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Barre supérieure mobile — seule surface visible sous md, ouvre le tiroir de navigation */}
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-border bg-offwhite/90 px-5 py-4 backdrop-blur-md md:hidden">
        <div>
          <p className="font-serif text-xl leading-none text-foreground">MC</p>
        </div>
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Ouvrir le menu"
          className="text-foreground"
        >
          <Menu className="h-6 w-6" strokeWidth={1.4} />
        </button>
      </header>

      {/* Sidebar desktop — toujours visible à partir de md */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 shrink-0 flex-col overflow-y-auto border-r border-border bg-offwhite/40 px-5 py-7 md:flex">
        {sidebarContent}
      </aside>

      {/* Tiroir mobile — recouvre l'écran, ferme au clic sur le fond ou un lien */}
      <div
        className={cn(
          "fixed inset-0 z-50 md:hidden",
          open ? "pointer-events-auto" : "pointer-events-none",
        )}
        role="dialog"
        aria-modal="true"
        aria-label="Menu d'administration"
      >
        <div
          onClick={() => setOpen(false)}
          className={cn(
            "absolute inset-0 bg-ink/40 transition-opacity duration-300",
            open ? "opacity-100" : "opacity-0",
          )}
        />
        <aside
          className={cn(
            "absolute inset-y-0 left-0 flex w-72 max-w-[80vw] flex-col overflow-y-auto bg-offwhite px-5 py-7 shadow-soft transition-transform duration-300 ease-out",
            open ? "translate-x-0" : "-translate-x-full",
          )}
        >
          {sidebarContent}
        </aside>
      </div>

      <main key={pathname} className="animate-fade-in overflow-x-hidden px-5 py-6 md:ml-64 md:px-12 md:py-8">
        {children}
      </main>
    </div>
  );
};
