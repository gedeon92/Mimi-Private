import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Header } from "@/components/mc/Header";
import { Footer } from "@/components/mc/Footer";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background">
      <Header overHero={false} />
      <main className="mx-auto flex min-h-[70vh] max-w-3xl flex-col items-center justify-center px-5 text-center">
        <p className="eyebrow-accent mb-4">Erreur 404</p>
        <h1 className="font-serif text-5xl leading-none text-foreground md:text-6xl">
          Page introuvable
        </h1>
        <p className="mt-5 max-w-md text-base leading-relaxed text-muted-foreground">
          Cette page n'existe pas ou n'est plus disponible.
        </p>
        <Link
          to="/"
          className="link-underline mt-8 text-[0.7rem] uppercase tracking-[0.22em] text-foreground"
        >
          Retour à l'accueil
        </Link>
      </main>
      <Footer />
    </div>
  );
};

export default NotFound;
