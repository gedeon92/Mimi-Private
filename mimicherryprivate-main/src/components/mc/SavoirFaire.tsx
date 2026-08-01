import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Reveal } from "./Reveal";
import { EmblaCarousel } from "./EmblaCarousel";
import sf1 from "@/assets/home-precision/hp-1.webp";
import sf2 from "@/assets/home-precision/hp-2.webp";
import sf3 from "@/assets/home-precision/hp-3.webp";
import sf4 from "@/assets/home-precision/hp-4.webp";
import sf5 from "@/assets/home-precision/hp-5.webp";
import sf6 from "@/assets/home-precision/hp-6.webp";

const details = [
  { src: sf1, alt: "Savoir-faire Mimi Cherry Private — détail artisanal" },
  { src: sf2, alt: "Savoir-faire Mimi Cherry Private — travail du cuir" },
  { src: sf3, alt: "Savoir-faire Mimi Cherry Private — finition à la main" },
  { src: sf4, alt: "Savoir-faire Mimi Cherry Private — matière et grain du cuir" },
  { src: sf5, alt: "Savoir-faire Mimi Cherry Private — geste artisanal" },
  { src: sf6, alt: "Savoir-faire Mimi Cherry Private — exécution soignée" },
];


/**
 * Section savoir-faire immersive — split-screen, image à gauche, texte à droite.
 * Carrousel discret de détails (cuir, artisanat, matières, produit), défilement lent.
 */
export const SavoirFaire = () => (
  <section id="savoir-faire" className="bg-offwhite py-20 md:py-28">
    <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 md:grid-cols-2 md:gap-20 md:px-10">
      <Reveal>
        <EmblaCarousel autoplayDelay={5600} controls={false} slideClassName="basis-full">
          {details.map((d) => (
            <figure key={d.src} className="group overflow-hidden">
              <img
                src={d.src}
                alt={d.alt}
                width={1300}
                height={1625}
                className="aspect-[4/5] w-full object-cover img-zoom"
              />
            </figure>
          ))}
        </EmblaCarousel>
      </Reveal>

      <Reveal delay={0.1}>
        <p className="eyebrow mb-5">L'Univers</p>
        <h2 className="font-serif text-4xl leading-[1.04] text-foreground md:text-[3.4rem]">
          The Art of Precision.
        </h2>
        <div className="mt-8 space-y-5 text-base leading-relaxed text-muted-foreground">
          <p>Une forme travaillée jusqu'à la justesse.</p>
          <p>Des matières choisies pour durer.</p>
          <p>Des détails pensés avec intention.</p>
          <p>Une exigence qui ne se négocie pas.</p>
        </div>
        <Link
          to="/savoir-faire"
          className="link-underline mt-9 inline-flex items-center gap-2 text-[0.7rem] uppercase tracking-[0.22em] text-foreground"
        >
          Découvrir l'univers
          <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.5} />
        </Link>
      </Reveal>
    </div>
  </section>
);
