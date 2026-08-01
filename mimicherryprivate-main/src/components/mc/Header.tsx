import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Heart, Menu, Search, ShoppingBag, User, X } from "lucide-react";
import { BrandLogo, BrandLogoLight } from "./Logo";
import { SearchOverlay } from "./SearchOverlay";
import { useCart } from "@/context/CartContext";
import { useFavorites } from "@/context/FavoritesContext";

const nav: { label: string; to?: string; href?: string }[] = [
  { label: "Collection", to: "/collection" },
  { label: "L'Univers", to: "/savoir-faire" },
  { label: "Notre histoire", to: "/notre-histoire" },
];

interface HeaderProps {
  /** True on pages that open with a dark, full-bleed hero (the homepage). */
  overHero?: boolean;
}

export const Header = ({ overHero = true }: HeaderProps) => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { count } = useCart();
  const { count: favCount } = useFavorites();
  const { pathname } = useLocation();

  const isActive = (n: (typeof nav)[number]) =>
    n.to ? pathname === n.to || pathname.startsWith(`${n.to}/`) : false;

  // Active states for the utility icons, driven by the current route.
  const favActive = pathname.startsWith("/compte/favoris");
  const accountActive = pathname.startsWith("/compte") && !favActive;
  const cartActive = pathname.startsWith("/panier");
  const searchActive = searchOpen;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);


  // Lock body scroll while the mobile panel is open.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Transparent white content only while overlaying a dark hero, before scroll.
  const onHero = overHero && !scrolled;
  const solid = !onHero;

  return (
    <header
      className={`fixed top-0 z-50 w-full transition-all duration-700 ${
        solid ? "bg-ivory/90 backdrop-blur-md shadow-soft" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-10 md:py-5">
        {/* Logo — switches to white over the hero */}
        <Link to="/" aria-label="Mimi Cherry Private — accueil" className="flex shrink-0 items-center">
          <span className="relative block h-9 w-auto md:h-11">
            <BrandLogo
              className={`h-9 w-auto transition-opacity duration-700 md:h-11 ${
                onHero ? "opacity-0" : "opacity-100"
              }`}
            />
            <BrandLogoLight
              className={`absolute inset-0 h-9 w-auto transition-opacity duration-700 md:h-11 ${
                onHero ? "opacity-100" : "opacity-0"
              }`}
            />
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-9 md:flex">
          {nav.map((n) => {
            const active = isActive(n);
            const cls = `link-underline text-xs uppercase tracking-[0.22em] transition-all duration-700 ${
              onHero
                ? active
                  ? "font-semibold text-ivory after:w-full"
                  : "text-ivory/80 hover:text-ivory"
                : active
                  ? "font-semibold text-foreground after:w-full"
                  : "text-foreground/70 hover:text-foreground"
            }`;
            return n.to ? (
              <Link key={n.label} to={n.to} className={cls} aria-current={active ? "page" : undefined}>
                {n.label}
              </Link>
            ) : (
              <a key={n.label} href={n.href} className={cls}>
                {n.label}
              </a>
            );
          })}
        </nav>

        <div
          className={`flex items-center gap-5 transition-colors duration-700 ${
            onHero ? "text-ivory" : "text-foreground"
          }`}
        >
          <button
            type="button"
            aria-label="Rechercher"
            aria-pressed={searchActive}
            onClick={() => setSearchOpen(true)}
            className="hidden md:block"
          >
            <Search
              className="h-[1.15rem] w-[1.15rem]"
              strokeWidth={searchActive ? 2.4 : 1.4}
            />
          </button>
          <Link
            to="/compte/favoris"
            aria-label="Mes favoris"
            aria-current={favActive ? "page" : undefined}
            className="relative hidden md:block"
          >
            <Heart
              className="h-[1.15rem] w-[1.15rem]"
              strokeWidth={favActive ? 2.4 : 1.4}
              fill={favActive ? "currentColor" : "none"}
            />
            {favCount > 0 && (
              <span
                className={`absolute -right-1.5 -top-1.5 flex h-3.5 w-3.5 items-center justify-center rounded-full text-[0.55rem] transition-colors duration-700 ${
                  onHero ? "bg-ivory text-ink" : "bg-foreground text-background"
                }`}
              >
                {favCount}
              </span>
            )}
          </Link>
          <Link
            to="/compte"
            aria-label="Mon compte"
            aria-current={accountActive ? "page" : undefined}
            className="hidden md:block"
          >
            <User
              className="h-[1.15rem] w-[1.15rem]"
              strokeWidth={accountActive ? 2.4 : 1.4}
            />
          </Link>
          <Link
            to="/panier"
            aria-label="Panier"
            aria-current={cartActive ? "page" : undefined}
            className="relative"
          >
            <ShoppingBag
              className="h-[1.15rem] w-[1.15rem]"
              strokeWidth={cartActive ? 2.4 : 1.4}
            />
            <span
              className={`absolute -right-1.5 -top-1.5 flex h-3.5 w-3.5 items-center justify-center rounded-full text-[0.55rem] transition-colors duration-700 ${
                onHero ? "bg-ivory text-ink" : "bg-foreground text-background"
              }`}
            >
              {count}
            </span>
          </Link>
          <button
            type="button"
            className="flex items-center md:hidden"
            onClick={() => setSearchOpen(true)}
            aria-label="Rechercher"
          >
            <Search className="h-5 w-5" strokeWidth={1.4} />
          </button>
          <button
            className="flex items-center md:hidden"
            onClick={() => setOpen(true)}
            aria-label="Ouvrir le menu"
          >
            <Menu className="h-5 w-5" strokeWidth={1.4} />
          </button>
        </div>
      </div>

      {/* Mobile — true full-screen opaque overlay (covers everything, blocks all interaction behind) */}
      <div
        className={`fixed inset-0 z-[100] flex h-[100dvh] w-full flex-col bg-ivory transition-opacity duration-300 ease-out md:hidden ${
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
      >
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <Link to="/" onClick={() => setOpen(false)} aria-label="Mimi Cherry Private — accueil">
            <BrandLogo className="h-9 w-auto" />
          </Link>
          <button onClick={() => setOpen(false)} aria-label="Fermer le menu">
            <X className="h-6 w-6" strokeWidth={1.3} />
          </button>
        </div>

        <nav className="flex flex-col gap-6 px-6 pt-10">
          {nav.map((n) =>
            n.to ? (
              <Link
                key={n.label}
                to={n.to}
                onClick={() => setOpen(false)}
                aria-current={isActive(n) ? "page" : undefined}
                className={`font-serif text-3xl transition-opacity ${
                  isActive(n)
                    ? "font-semibold text-foreground underline decoration-1 underline-offset-8"
                    : "text-foreground/70"
                }`}
              >
                {n.label}
              </Link>
            ) : (
              <a
                key={n.label}
                href={n.href}
                onClick={() => setOpen(false)}
                className="font-serif text-3xl text-foreground/70"
              >
                {n.label}
              </a>
            ),
          )}
        </nav>

        <div className="mt-auto border-t border-border px-6 py-7">
          <div className="flex flex-col gap-4">
            <Link
              to="/compte/favoris"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 text-[0.78rem] uppercase tracking-[0.2em] text-foreground"
            >
              <Heart className="h-4 w-4" strokeWidth={1.5} />
              Mes favoris
            </Link>
            <Link
              to="/compte"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 text-[0.78rem] uppercase tracking-[0.2em] text-foreground"
            >
              <User className="h-4 w-4" strokeWidth={1.5} />
              Mon compte
            </Link>
            <Link
              to="/panier"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 text-[0.78rem] uppercase tracking-[0.2em] text-foreground"
            >
              <ShoppingBag className="h-4 w-4" strokeWidth={1.5} />
              Panier ({count})
            </Link>
          </div>
        </div>
      </div>

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </header>
  );
};
