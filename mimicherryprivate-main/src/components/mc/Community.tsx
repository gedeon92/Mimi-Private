import { Reveal } from "./Reveal";
import { Instagram } from "lucide-react";
import insta1 from "@/assets/insta-1.jpg";
import insta2 from "@/assets/insta-2.jpg";
import insta3 from "@/assets/insta-3.jpg";
import insta4 from "@/assets/insta-4.jpg";

const posts = [insta1, insta2, insta3, insta4];

export const Community = () => (
  <section className="bg-offwhite py-16 md:py-24">
    <div className="mx-auto max-w-7xl px-5 md:px-10">
      <Reveal className="mb-12 text-center">
        <p className="eyebrow mb-4">La communauté</p>
        <h2 className="font-serif text-4xl leading-tight text-foreground md:text-5xl">
          @mimicherryprivate
        </h2>
        <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
          Identifiez-nous pour rejoindre le cercle des femmes Mimi Cherry Private.
        </p>
      </Reveal>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5">
        {posts.map((src, i) => (
          <Reveal key={i} delay={(i % 4) * 0.08}>
            <a
              href="#"
              className="group relative block overflow-hidden"
              aria-label="Voir la publication Instagram"
            >
              <img
                src={src}
                alt="Publication Instagram Mimi Cherry Private"
                width={1024}
                height={1024}
                className="aspect-square w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <span className="absolute inset-0 flex items-center justify-center bg-ink/30 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                <Instagram className="h-7 w-7 text-ivory" strokeWidth={1.4} />
              </span>
            </a>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);
