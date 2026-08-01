import { useEffect, type ReactNode } from "react";
import { Header } from "@/components/mc/Header";
import { Footer } from "@/components/mc/Footer";
import { Reveal } from "@/components/mc/Reveal";

interface EditorialPageProps {
  eyebrow: string;
  title: string;
  intro: string;
  children?: ReactNode;
}

/**
 * Cadre éditorial partagé des pages de service — hero centré, divider façon
 * Collection, contenu généreux. Garde la cohérence visuelle de la Maison.
 */
export const EditorialPage = ({ eyebrow, title, intro, children }: EditorialPageProps) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [title]);

  return (
    <div className="min-h-screen bg-background">
      <Header overHero={false} />
      <main>
        <section className="px-5 pt-28 text-center md:px-10 md:pt-32">
          <Reveal className="mx-auto max-w-3xl">
            <p className="eyebrow-accent mb-4">{eyebrow}</p>
            <h1 className="font-serif text-[2.6rem] leading-[1.02] text-foreground sm:text-6xl">
              {title}
            </h1>
            <p className="mx-auto mt-7 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
              {intro}
            </p>
          </Reveal>

          <div className="mx-auto mt-14 max-w-7xl md:mt-20">
            <div className="rule-fade" />
          </div>
        </section>

        {children}
      </main>
      <Footer />
    </div>
  );
};
