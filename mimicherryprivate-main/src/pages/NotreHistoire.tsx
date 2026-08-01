import { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { Header } from "@/components/mc/Header";
import { Footer } from "@/components/mc/Footer";
import { Reveal } from "@/components/mc/Reveal";
import { Cta } from "@/components/mc/Cta";

import heroImg from "@/assets/editorial-feature.jpg";
import founderImg from "@/assets/founder.jpg";

import collectionImg from "@/assets/editorial-collection.jpg";
import duoImg from "@/assets/editorial-duo.jpg";

import standard from "@/assets/histoire-strategie/standard.jpg";
import mini from "@/assets/histoire-strategie/mini.jpg";
import wallet from "@/assets/histoire-strategie/wallet.jpg";

const icons = [
  { line: "FORM 01", name: "Standard", img: standard, id: "standard" },
  { line: "FORM 01", name: "Mini", img: mini, id: "mini" },
  { line: "FORM 01", name: "Wallet", img: wallet, id: "wallet" },
];

const NotreHistoire = () => {
  const reduce = useReducedMotion();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header overHero={false} />
      <main>
        {/* SECTION 1 — HERO : texte en haut, portrait de la fondatrice dessous */}
        <section className="px-5 pt-28 text-center md:px-10 md:pt-32">
          <Reveal className="mx-auto max-w-3xl">
            <p className="eyebrow-accent mb-5">La maison</p>
            <h1 className="font-serif text-[2.8rem] leading-[1.02] text-foreground sm:text-6xl md:text-7xl">
              Notre histoire
            </h1>
            <p className="mx-auto mt-7 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
              Une maison née d'une vision claire : créer des pièces iconiques,
              rares et durables, pensées pour les femmes qui privilégient le sens,
              la forme et le temps long.
            </p>
          </Reveal>

          <Reveal delay={0.15} className="mt-12 w-screen relative left-1/2 right-1/2 -mx-[50vw] md:mt-16">
            <div className="overflow-hidden">
              <motion.img
                src={founderImg}
                alt="La fondatrice de Maison Privée Mimi Cherry"
                width={1600}
                height={2000}
                initial={reduce ? false : { scale: 1.08 }}
                animate={{ scale: 1 }}
                transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
                className="aspect-[4/5] w-full object-cover sm:aspect-[3/4] md:aspect-[16/9]"
              />
            </div>
          </Reveal>

          <Reveal delay={0.25} className="mx-auto mt-12 max-w-2xl md:mt-16">
            <p className="eyebrow mb-4">La fondatrice</p>
            <h2 className="font-serif text-3xl leading-[1.08] text-foreground md:text-4xl">
              Mimi Cherry
            </h2>
            <div className="mx-auto mt-6 max-w-xl space-y-5 text-base leading-relaxed text-muted-foreground">
              <p>
                Créatrice et fondatrice de la Maison, Mimi imagine chaque pièce
                comme une rencontre entre esthétique, intention et intemporalité.
              </p>
              <p>
                Guidée par une recherche constante d'équilibre entre forme,
                fonctionnalité et rareté, elle développe une maroquinerie
                contemporaine où chaque détail trouve sa raison d'être.
              </p>
              <p>
                À travers Maison Privée Mimi Cherry, elle défend une vision du
                luxe maîtrisée, où chaque création est pensée avec intention et
                conçue pour devenir une signature.
              </p>
            </div>
          </Reveal>

          <div className="mx-auto mt-16 max-w-7xl md:mt-24">
            <div className="rule-fade" />
          </div>
        </section>


        {/* SECTION 2 — La naissance de la maison */}
        <section className="mx-auto max-w-7xl px-5 py-24 md:px-10 md:py-36">
          <div className="grid items-center gap-12 md:grid-cols-12 md:gap-16">
            <Reveal className="md:col-span-6">
              <div className="overflow-hidden">
                <img
                  src={heroImg}
                  alt="L'atelier de Maison Privée Mimi Cherry à Dakar"
                  width={1400}
                  height={1750}
                  className="aspect-[4/5] w-full object-cover"
                />
              </div>
            </Reveal>

            <Reveal delay={0.1} className="md:col-span-6 md:pl-6">
              <p className="eyebrow mb-5">La naissance</p>
              <h2 className="font-serif text-4xl leading-[1.06] text-foreground md:text-5xl">
                Une vision
                <br />
                <span className="italic">avant une marque.</span>
              </h2>
              <div className="mt-8 max-w-md space-y-5 text-base leading-relaxed text-muted-foreground">
                <p>
                  Maison Privée Mimi Cherry est née d'une volonté simple : créer
                  moins, mais créer mieux.
                </p>
                <p>
                  Une maison construite autour de formes fondatrices, pensées pour
                  traverser le temps plutôt que suivre les tendances.
                </p>
                <p>
                  Chaque création est envisagée comme une pièce durable, destinée à
                  accompagner sa propriétaire au fil des années.
                </p>
              </div>
            </Reveal>
          </div>
        </section>

        {/* SECTION 3 — Une autre idée du luxe */}
        <section className="bg-offwhite py-24 md:py-36">
          <div className="mx-auto max-w-7xl px-5 md:px-10">
            <Reveal className="mx-auto mb-16 max-w-2xl text-center md:mb-24">
              <p className="eyebrow-accent mb-4">Le positionnement</p>
              <h2 className="font-serif text-4xl leading-[1.05] text-foreground md:text-6xl">
                Une autre idée
                <br />
                <span className="italic">du luxe.</span>
              </h2>
            </Reveal>

            <div className="grid items-center gap-12 md:grid-cols-2 md:gap-20">
              <Reveal>
                <div className="overflow-hidden">
                  <img
                    src={collectionImg}
                    alt="Composition éditoriale — luxe contemporain Mimi Cherry"
                    width={1400}
                    height={1750}
                    className="aspect-[4/5] w-full object-cover"
                  />
                </div>
              </Reveal>

              <Reveal delay={0.1}>
                <div className="space-y-10">
                  {[
                    {
                      n: "01",
                      title: "Le luxe contemporain",
                      text: "Discret. Assumé. Essentiel.",
                    },
                    {
                      n: "02",
                      title: "La rareté",
                      text: "Peu de pièces. Beaucoup d'intention.",
                    },
                    {
                      n: "03",
                      title: "La qualité sans compromis",
                      text: "L'exigence dans chaque détail.",
                    },
                    {
                      n: "04",
                      title: "La maîtrise du temps",
                      text: "Créer pour durer.",
                    },
                  ].map((b) => (
                    <div key={b.n} className="border-t border-border pt-6">
                      <span className="font-serif text-xl tabular-nums text-muted-foreground/70">
                        {b.n}
                      </span>
                      <h3 className="mt-3 font-serif text-2xl text-foreground">{b.title}</h3>
                      <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
                        {b.text}
                      </p>
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* SECTION 4 — Entre Dakar et l'international */}
        <section className="relative overflow-hidden bg-ink text-ivory">
          <img
            src={duoImg}
            alt="Héritage contemporain — Mimi Cherry entre Dakar et le monde"
            className="absolute inset-0 h-full w-full object-cover opacity-30"
          />
          <div className="relative mx-auto max-w-3xl px-5 py-28 text-center md:px-10 md:py-40">
            <Reveal>
              <p className="mb-5 text-xs uppercase tracking-[0.4em] text-ivory/70">
                L'ancrage
              </p>
              <h2 className="font-serif text-4xl leading-[1.06] text-ivory md:text-6xl">
                A Sense of Place.
                <br />
                <span className="italic">A Global Perspective.</span>
              </h2>
              <div className="mx-auto mt-8 max-w-xl space-y-5 text-base leading-relaxed text-ivory/80">
                <p>Maison Privée Mimi Cherry est née à Dakar.</p>
                <p>
                  Une ville de contrastes, de mouvement et de créativité, qui
                  nourrit le regard et inspire la Maison.
                </p>
                <p>
                  Ancrée dans son environnement tout en étant tournée vers
                  l'international, la Maison développe un langage esthétique
                  universel, où l'élégance s'affranchit des frontières.
                </p>
                <p>Pensée à Dakar. Portée partout.</p>
              </div>
            </Reveal>
          </div>
        </section>

        {/* SECTION 5 — La forme avant la tendance */}
        <section className="mx-auto max-w-7xl px-5 py-24 md:px-10 md:py-36">
          <Reveal className="mx-auto mb-16 max-w-2xl text-center md:mb-20">
            <p className="eyebrow-accent mb-4">La stratégie</p>
            <h2 className="font-serif text-4xl leading-[1.05] text-foreground md:text-5xl">
              Form over
              <br />
              <span className="italic">Trend.</span>
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-muted-foreground">
              Une même ligne. Une même intention. Conçue pour traverser le temps.
            </p>
          </Reveal>

          <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-3">
            {icons.map((p, i) => (
              <Reveal key={p.id} delay={(i % 3) * 0.08}>
                <Link to={`/produit/${p.id}`} className="group block text-center">
                  <div className="overflow-hidden">
                    <img
                      src={p.img}
                      alt={`${p.line} ${p.name} — Mimi Cherry Private`}
                      className="aspect-[4/5] w-full object-contain img-zoom"
                    />
                  </div>
                  <p className="mt-4 text-[0.58rem] uppercase tracking-[0.3em] text-muted-foreground">
                    {p.line}
                  </p>
                  <h3 className="mt-1.5 font-serif text-2xl text-foreground">{p.name}</h3>
                </Link>
              </Reveal>
            ))}
          </div>
        </section>

        {/* SECTION 6 — Conclusion */}
        <section className="relative overflow-hidden bg-offwhite py-28 md:py-40">
          <div className="mx-auto max-w-3xl px-5 text-center md:px-10">
            <Reveal>
              <p className="eyebrow-accent mb-5">Notre raison d'être</p>
              <h2 className="font-serif text-4xl leading-[1.06] text-foreground md:text-6xl">
                What Endures
                <br />
                <span className="italic">Matters.</span>
              </h2>
              <p className="mx-auto mt-8 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
                Créer des pièces destinées à durer. L'intemporalité plutôt que
                l'instant. La transmission plutôt que la possession. La rareté
                plutôt que l'abondance.
              </p>
              <div className="mt-12 flex justify-center">
                <Cta href="/collection" className="bg-foreground text-background border-foreground hover:bg-foreground/90">
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

export default NotreHistoire;
