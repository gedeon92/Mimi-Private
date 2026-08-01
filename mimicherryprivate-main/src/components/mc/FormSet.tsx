import { Reveal } from "./Reveal";
import { EmblaCarousel } from "./EmblaCarousel";
import bottom1 from "@/assets/campaign-bottom/b-1.jpg";
import bottom2 from "@/assets/campaign-bottom/b-2.jpg";
import bottom3 from "@/assets/campaign-bottom/b-3.jpg";
import bottom4 from "@/assets/campaign-bottom/b-4.jpg";
import bottom5 from "@/assets/campaign-bottom/b-5.jpg";
import bottom6 from "@/assets/campaign-bottom/b-6.jpg";

const views = [
  { src: bottom1, alt: "Campagne Mimi Cherry Private — silhouette éditoriale I" },
  { src: bottom2, alt: "Campagne Mimi Cherry Private — silhouette éditoriale II" },
  { src: bottom3, alt: "Campagne Mimi Cherry Private — silhouette éditoriale III" },
  { src: bottom4, alt: "Campagne Mimi Cherry Private — silhouette éditoriale IV" },
  { src: bottom5, alt: "Campagne Mimi Cherry Private — silhouette éditoriale V" },
  { src: bottom6, alt: "Campagne Mimi Cherry Private — silhouette éditoriale VI" },
];


/**
 * Section éditoriale de marque — purement émotionnelle, sans logique produit.
 * Fond noir, imagerie de campagne uniquement, pour évoquer la philosophie
 * du temps long propre à la Maison.
 */
export const FormSet = () => (
  <section id="temps-long" className="bg-ink py-20 text-ivory md:py-28">
    <div className="mx-auto max-w-3xl px-5 text-center md:px-10">
      <Reveal>
        <p className="text-xs uppercase tracking-[0.35em] text-ivory/60">Maison Privée Mimi Cherry</p>
        <h2 className="mt-6 font-serif text-4xl leading-[1.04] md:text-6xl">
          L'Art du Temps Long
        </h2>
        <p className="mx-auto mt-7 max-w-xl text-base leading-relaxed text-ivory/75 md:text-lg">
          Des pièces pensées pour traverser le temps, loin des tendances
          éphémères.
        </p>
      </Reveal>
    </div>

    <Reveal className="mx-auto mt-14 max-w-7xl px-5 md:mt-20 md:px-10">
      <EmblaCarousel
        autoplayDelay={5200}
        align="start"
        tone="dark"
        controls
        showArrows={false}
        slideClassName="basis-full sm:basis-1/2 lg:basis-1/3"
      >
        {views.map((v) => (
          <figure key={v.src} className="overflow-hidden bg-ivory/[0.04]">
            <img
              src={v.src}
              alt={v.alt}
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
