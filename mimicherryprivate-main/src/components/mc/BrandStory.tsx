import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "./Reveal";

/**
 * Court lien éditorial vers la page Notre histoire — placé avant le footer.
 * Remplace l'ancienne grande section narrative, désormais dédiée à sa page.
 */
export const BrandStory = () => (
  <section id="histoire" className="bg-background py-24 md:py-32">
    <div className="mx-auto max-w-2xl px-5 text-center md:px-10">
      <Reveal>
        <p className="eyebrow-accent mb-5">Maison Privée Mimi Cherry</p>
        <h2 className="font-serif text-3xl leading-[1.08] text-foreground md:text-[2.6rem]">
          Une collection de formes
          <br />
          <span className="italic">conçues pour durer.</span>
        </h2>
        <div className="mt-9 flex justify-center">
          <Link
            to="/notre-histoire"
            className="link-underline inline-flex items-center gap-2 text-[0.72rem] uppercase tracking-[0.24em] text-foreground"
          >
            Découvrir notre histoire
            <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.6} />
          </Link>
        </div>
      </Reveal>
    </div>
  </section>
);
