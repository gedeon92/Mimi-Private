import { type ReactNode } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Header } from "@/components/mc/Header";
import { Footer } from "@/components/mc/Footer";
import { Reveal } from "@/components/mc/Reveal";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";

const links = [
  { label: "Mon compte", to: "/compte", end: true },
  { label: "Mes commandes", to: "/compte/commandes" },
  { label: "Mes adresses", to: "/compte/adresses" },
  { label: "Mes favoris", to: "/compte/favoris" },
  { label: "Mon panier", to: "/panier" },
];

interface AccountLayoutProps {
  title: string;
  intro?: string;
  children: ReactNode;
}

/** Cadre partagé de l'espace client — navigation latérale + contenu. */
export const AccountLayout = ({ title, intro, children }: AccountLayoutProps) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/", { replace: true });
  };

  return (
  <div className="min-h-screen bg-background">
    <Header overHero={false} />
    <main className="mx-auto max-w-7xl px-5 pb-24 pt-28 md:px-10 md:pb-32 md:pt-32">
      <Reveal>
        <p className="eyebrow-accent mb-4">Espace client</p>
        <h1 className="font-serif text-4xl leading-none text-foreground md:text-5xl">{title}</h1>
        {intro && (
          <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground">{intro}</p>
        )}
      </Reveal>

      <div className="mt-12 grid gap-10 md:grid-cols-[220px_1fr] md:gap-16">
        {/* Navigation latérale */}
        <nav className="flex flex-row flex-wrap gap-x-6 gap-y-3 border-b border-border pb-6 md:flex-col md:gap-3 md:border-b-0 md:border-r md:pb-0 md:pr-8">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) =>
                cn(
                  "relative pl-3 text-[0.72rem] uppercase tracking-[0.18em] transition-colors",
                  "before:absolute before:left-0 before:top-1/2 before:h-3.5 before:w-px before:-translate-y-1/2 before:bg-burgundy before:transition-opacity",
                  isActive
                    ? "font-medium text-foreground before:opacity-100"
                    : "text-muted-foreground before:opacity-0 hover:text-foreground",
                )
              }
            >
              {l.label}
            </NavLink>
          ))}
          <button
            type="button"
            onClick={handleLogout}
            className="text-left text-[0.72rem] uppercase tracking-[0.18em] text-muted-foreground/70 transition-colors hover:text-foreground md:mt-4"
          >
            Déconnexion
          </button>
        </nav>

        {/* Contenu */}
        <div>{children}</div>
      </div>
    </main>
    <Footer />
  </div>
  );
};

/** État vide élégant, partagé par les sous-pages encore en préparation. */
export const AccountEmpty = ({
  title,
  body,
  cta,
}: {
  title: string;
  body: string;
  cta?: ReactNode;
}) => (
  <div className="rounded-3xl border border-border bg-offwhite/60 px-8 py-16 text-center">
    <h2 className="font-serif text-2xl text-foreground">{title}</h2>
    <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">{body}</p>
    {cta && <div className="mt-7">{cta}</div>}
  </div>
);
