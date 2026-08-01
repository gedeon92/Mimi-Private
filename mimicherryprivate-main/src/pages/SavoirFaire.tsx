import { useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Header } from "@/components/mc/Header";
import { Footer } from "@/components/mc/Footer";
import { Reveal } from "@/components/mc/Reveal";
import { Cta } from "@/components/mc/Cta";

import sf1 from "@/assets/savoir-faire/sf-1.jpg";
import sf2 from "@/assets/savoir-faire/sf-2.jpg";
import sf3 from "@/assets/savoir-faire/sf-3.jpg";
import sf4 from "@/assets/savoir-faire/sf-4.jpg";
import sf5 from "@/assets/savoir-faire/sf-5.jpg";


const SavoirFairePage = () => {
  const reduce = useReducedMotion();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header overHero={false} />
      <main>
        {/* SECTION 1 — INTRODUCTION : le savoir-faire comme fondement */}
        <section className="px-5 pt-28 text-center md:px-10 md:pt-32">
          <Reveal className="mx-auto max-w-3xl">
            <p className="eyebrow-accent mb-5">L'Univers</p>
            <h1 className="font-serif text-[2.8rem] leading-[1.02] text-foreground sm:text-6xl md:text-7xl">
              A Sense of Place.
            </h1>
            <p className="mx-auto mt-7 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
              L'élégance ne se résume pas à une silhouette. Elle se retrouve dans
              une lumière, une matière, un instant. Maison Privée Mimi Cherry
              cultive un univers calme, maîtrisé et intemporel, où chaque détail
              participe à une même vision.
            </p>
          </Reveal>

          <Reveal delay={0.15} className="mt-12 w-screen relative left-1/2 right-1/2 -mx-[50vw] md:mt-16">
            <div className="overflow-hidden">
              <motion.img
                src={sf1}
                alt="Savoir-faire Maison Privée Mimi Cherry — l'atelier et le travail du cuir"
                width={1600}
                height={2000}
                initial={reduce ? false : { scale: 1.08 }}
                animate={{ scale: 1 }}
                transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
                className="aspect-[4/5] w-full object-cover sm:aspect-[3/4] md:aspect-[16/9]"
              />
            </div>
          </Reveal>
        </section>

        {/* SECTION 2 — LA MATIÈRE */}
        <section className="mx-auto max-w-7xl px-5 py-24 md:px-10 md:py-36">
          <div className="grid items-center gap-12 md:grid-cols-12 md:gap-16">
            <Reveal className="md:col-span-6">
              <div className="overflow-hidden">
                <img
                  src={sf2}
                  alt="Choix de la matière — grain et tenue du cuir, Mimi Cherry Private"
                  width={1400}
                  height={1750}
                  className="aspect-[4/5] w-full object-cover"
                />
              </div>
            </Reveal>

            <Reveal delay={0.1} className="md:col-span-6 md:pl-6">
              <p className="eyebrow mb-5">La lumière</p>
              <h2 className="font-serif text-4xl leading-[1.06] text-foreground md:text-5xl">
                Light,
                <br />
                <span className="italic">Naturally.</span>
              </h2>
              <div className="mt-8 max-w-md space-y-5 text-base leading-relaxed text-muted-foreground">
                <p>
                  Une lumière douce. Des contrastes subtils. Des espaces qui
                  respirent.
                </p>
                <p>
                  L'univers de la Maison privilégie la simplicité à l'excès et la
                  présence à la démonstration.
                </p>
              </div>
            </Reveal>
          </div>
        </section>

        {/* SECTION 3 — LE GESTE */}
        <section className="bg-offwhite py-24 md:py-36">
          <div className="mx-auto max-w-7xl px-5 md:px-10">
            <div className="grid items-center gap-12 md:grid-cols-12 md:gap-16">
              <Reveal delay={0.1} className="order-2 md:order-1 md:col-span-6 md:pr-6">
                <p className="eyebrow mb-5">La matière</p>
                <h2 className="font-serif text-4xl leading-[1.06] text-foreground md:text-5xl">
                  The Material
                  <br />
                  <span className="italic">Matters.</span>
                </h2>
                <div className="mt-8 max-w-md space-y-5 text-base leading-relaxed text-muted-foreground">
                  <p>
                    Des matières choisies pour leur caractère autant que pour leur
                    beauté. Des textures qui se révèlent au toucher.
                  </p>
                  <p>
                    Des cuirs qui évoluent avec le temps. Des détails qui gagnent
                    en profondeur au fil des années.
                  </p>
                </div>
              </Reveal>

              <Reveal className="order-1 md:order-2 md:col-span-6">
                <div className="overflow-hidden">
                  <img
                    src={sf3}
                    alt="Le geste artisanal — travail manuel et finitions à la main"
                    width={1400}
                    height={1750}
                    className="aspect-[4/5] w-full object-cover"
                  />
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* SECTION 4 — LA FORME */}
        <section className="mx-auto max-w-7xl px-5 py-24 md:px-10 md:py-36">
          <div className="grid items-center gap-12 md:grid-cols-12 md:gap-16">
            <Reveal className="md:col-span-6">
              <div className="overflow-hidden">
                <img
                  src={sf4}
                  alt="La forme — équilibre des proportions et maîtrise du volume"
                  width={1400}
                  height={1750}
                  className="aspect-[4/5] w-full object-cover"
                />
              </div>
            </Reveal>

            <Reveal delay={0.1} className="md:col-span-6 md:pl-6">
              <p className="eyebrow mb-5">Les détails</p>
              <h2 className="font-serif text-4xl leading-[1.06] text-foreground md:text-5xl">
                Every Detail
                <br />
                <span className="italic">Counts.</span>
              </h2>
              <div className="mt-8 max-w-md space-y-5 text-base leading-relaxed text-muted-foreground">
                <p>
                  Une couture. Une courbe. Un monogramme.
                </p>
                <p>
                  Les détails ne sont jamais accessoires. Ils donnent du sens à
                  l'ensemble.
                </p>
              </div>
            </Reveal>
          </div>
        </section>

        {/* SECTION 5 — LE TEMPS */}
        <section className="relative overflow-hidden bg-ink text-ivory">
          <img
            src={sf5}
            alt="Le temps long — artisanat et durabilité, Mimi Cherry Private"
            className="absolute inset-0 h-full w-full object-cover opacity-30"
          />
          <div className="relative mx-auto max-w-3xl px-5 py-28 text-center md:px-10 md:py-40">
            <Reveal>
              <p className="mb-5 text-xs uppercase tracking-[0.4em] text-ivory/70">
                Le temps
              </p>
              <h2 className="font-serif text-4xl leading-[1.06] text-ivory md:text-6xl">
                What Endures
                <br />
                <span className="italic">Matters.</span>
              </h2>
              <div className="mx-auto mt-8 max-w-xl space-y-5 text-base leading-relaxed text-ivory/80">
                <p>
                  Prendre le temps. Observer. Affiner.
                </p>
                <p>
                  Parce que certaines choses méritent d'être conçues lentement.
                </p>
              </div>
            </Reveal>
          </div>
        </section>

        {/* SECTION 6 — CONCLUSION */}
        <section className="relative overflow-hidden bg-offwhite py-28 md:py-40">
          <div className="mx-auto max-w-3xl px-5 text-center md:px-10">
            <Reveal>
              <p className="eyebrow-accent mb-5">L'élégance</p>
              <h2 className="font-serif text-4xl leading-[1.06] text-foreground md:text-6xl">
                Quiet
                <br />
                <span className="italic">Luxury.</span>
              </h2>
              <p className="mx-auto mt-8 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
                Une élégance discrète. Jamais démonstrative. Une présence qui
                s'impose sans avoir besoin de se montrer.
              </p>
              <div className="mt-12 flex justify-center">
                <Cta
                  href="/collection"
                  className="bg-foreground text-background border-foreground hover:bg-foreground/90"
                >
                  Découvrir la collection
                </Cta>
              </div>
            </Reveal>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default SavoirFairePage;
