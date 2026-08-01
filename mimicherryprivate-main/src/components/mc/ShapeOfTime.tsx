import { Reveal } from "./Reveal";
import { Cta } from "./Cta";
import { EmblaCarousel } from "./EmblaCarousel";
import campaign1 from "@/assets/campaign-1.webp";
import campaign2 from "@/assets/campaign-2.webp";
import campaign3 from "@/assets/campaign-3.webp";
import campaign4 from "@/assets/campaign-4.webp";
import campaign5 from "@/assets/campaign-5.webp";

const slides = [
  { src: campaign1, alt: "Campagne Mimi Cherry Private — silhouette éditoriale I" },
  { src: campaign2, alt: "Campagne Mimi Cherry Private — silhouette éditoriale II" },
  { src: campaign3, alt: "Campagne Mimi Cherry Private — silhouette éditoriale III" },
  { src: campaign4, alt: "Campagne Mimi Cherry Private — silhouette éditoriale IV" },
  { src: campaign5, alt: "Campagne Mimi Cherry Private — silhouette éditoriale V" },
];

/**
 * Section éditoriale d'ouverture, juste après le Hero.
 * Titre + texte conservés, suivis d'un carrousel campagne plein cadre
 * pour supprimer toute impression de vide. Défilement automatique lent.
 */
export const ShapeOfTime = () => (
  <section className="bg-background pt-24 md:pt-32">
    <div className="mx-auto max-w-3xl px-5 text-center md:px-10">
      <Reveal>
        <p className="eyebrow mb-6">Mimi Cherry Private</p>
        <h2 className="font-serif text-4xl leading-[1.05] text-foreground md:text-6xl">
          Luxury leather goods &amp; timeless pieces
        </h2>
        <p className="mx-auto mt-7 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
          Des formes pensées pour durer.
        </p>
        <div className="mt-9 flex justify-center">
          <Cta href="#histoire" variant="outline">
            Découvrir la Maison
          </Cta>
        </div>
      </Reveal>
    </div>

    <Reveal className="mx-auto mt-16 max-w-7xl px-5 md:mt-24 md:px-10">
      <EmblaCarousel
        autoplayDelay={4600}
        align="start"
        controls
        showArrows={false}
        slideClassName="basis-full sm:basis-1/2 lg:basis-1/3"
      >
        {slides.map((s) => (
          <figure key={s.src} className="group overflow-hidden">
            <img
              src={s.src}
              alt={s.alt}
              width={1100}
              height={1467}
              className="aspect-[3/4] w-full object-cover img-zoom"
            />
          </figure>
        ))}
      </EmblaCarousel>
    </Reveal>
  </section>
);
