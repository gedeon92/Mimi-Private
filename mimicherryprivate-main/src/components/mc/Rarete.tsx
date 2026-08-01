import { Reveal } from "./Reveal";

const blocks = [
  {
    n: "01",
    title: "Production limitée",
    text: "Peu de pièces. Jamais de production de masse.",
  },
  {
    n: "02",
    title: "Les matières",
    text: "Des cuirs choisis pour traverser le temps.",
  },
  {
    n: "03",
    title: "Le temps long",
    text: "L'intemporel ne se précipite jamais.",
  },
];

/**
 * Section rareté — trois blocs purement éditoriaux.
 * Pas d'icônes, pas de cartes colorées : typographie et espace.
 */
export const Rarete = () => (
  <section className="bg-background py-20 md:py-28">
    <div className="mx-auto max-w-7xl px-5 md:px-10">
      <Reveal className="mx-auto mb-14 max-w-2xl text-center md:mb-20">
        <p className="eyebrow-accent mb-4">La rareté</p>
        <h2 className="font-serif text-4xl leading-[1.05] text-foreground md:text-5xl">
          What Is Rare
          <br />
          <span className="italic">Endures.</span>
        </h2>
      </Reveal>

      <div className="grid gap-12 md:grid-cols-3 md:gap-10">
        {blocks.map((b, i) => (
          <Reveal key={b.n} delay={i * 0.1}>
            <div className="flex flex-col items-center border-t border-border pt-8 text-center">
              <span className="font-serif text-2xl tabular-nums text-muted-foreground/70">
                {b.n}
              </span>
              <h3 className="mt-6 font-serif text-2xl text-foreground md:text-3xl">{b.title}</h3>
              <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">{b.text}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);
