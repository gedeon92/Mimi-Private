import { Link } from "react-router-dom";
import { Droplets, Sun, Hand, Archive } from "lucide-react";
import { EditorialPage } from "@/components/mc/EditorialPage";
import { Reveal } from "@/components/mc/Reveal";

const principles = [
  {
    n: "01",
    title: "Une matière vivante",
    text: "Le cuir n'est pas un matériau figé. Il respire, se patine et gagne en caractère au fil des années. Chaque marque du temps fait partie de l'histoire de votre pièce.",
  },
  {
    n: "02",
    title: "Le temps long",
    text: "Une pièce de la Maison est pensée pour durer. L'entretenir, c'est prolonger un objet rare et accompagner sa transformation plutôt que de chercher à la figer.",
  },
  {
    n: "03",
    title: "Des gestes simples",
    text: "Préserver le cuir ne demande pas de soins complexes, mais une attention régulière et quelques précautions justes, dans l'esprit de sobriété de la Maison.",
  },
];

const gestures = [
  {
    icon: Hand,
    title: "Au quotidien",
    text: "Manipulez votre pièce avec des mains propres et sèches. Essuyez délicatement les poussières et traces avec un chiffon doux et sec, sans frotter la surface.",
  },
  {
    icon: Droplets,
    title: "Face à l'humidité",
    text: "En cas de contact avec l'eau, tamponnez aussitôt sans frotter et laissez sécher naturellement, à l'écart de toute source de chaleur. Évitez tout produit non adapté au cuir.",
  },
  {
    icon: Sun,
    title: "Lumière et chaleur",
    text: "Conservez votre pièce à l'abri de la lumière directe prolongée, de la chaleur et des sources sèches. Une exposition excessive peut altérer la teinte et assouplir excessivement la matière.",
  },
  {
    icon: Archive,
    title: "Rangement",
    text: "Rangez votre pièce dans sa housse, garnie d'un papier de soie pour préserver sa forme. Évitez les sacs plastiques hermétiques, qui empêchent le cuir de respirer.",
  },
];

const Entretien = () => (
  <EditorialPage
    eyebrow="Service"
    title="Entretien du cuir"
    intro="Préserver la beauté d'une pièce dans le temps relève du même soin que celui apporté à sa création. Quelques gestes suffisent à accompagner la patine et à révéler le caractère du cuir."
  >
    {/* Principes — la philosophie du soin */}
    <section className="mx-auto max-w-7xl px-5 py-16 md:px-10 md:py-24">
      <div className="grid gap-12 md:grid-cols-3 md:gap-16">
        {principles.map((p, i) => (
          <Reveal key={p.n} delay={i * 0.08}>
            <div className="border-t border-border pt-6">
              <span className="font-serif text-xl tabular-nums text-muted-foreground/70">
                {p.n}
              </span>
              <h2 className="mt-3 font-serif text-2xl text-foreground">{p.title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{p.text}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>

    {/* Gestes d'entretien */}
    <section className="bg-offwhite py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-5 md:px-10">
        <Reveal className="max-w-2xl">
          <p className="eyebrow-accent mb-4">Les gestes justes</p>
          <h2 className="font-serif text-3xl leading-[1.08] text-foreground md:text-4xl">
            Accompagner la matière
          </h2>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground">
            Un entretien régulier et mesuré suffit à préserver la souplesse, la teinte et la
            tenue de votre pièce. Chaque commande est accompagnée de ses instructions d'entretien.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-8 md:grid-cols-2 md:gap-12">
          {gestures.map((g, i) => (
            <Reveal key={g.title} delay={i * 0.08}>
              <div className="h-full border-t border-border bg-background p-8">
                <g.icon className="h-5 w-5 text-foreground" strokeWidth={1.4} />
                <h3 className="mt-5 font-serif text-2xl text-foreground">{g.title}</h3>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{g.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>

    {/* Nourrir le cuir */}
    <section className="mx-auto max-w-7xl px-5 py-16 md:px-10 md:py-24">
      <div className="grid gap-12 md:grid-cols-[1fr_1.1fr] md:gap-20">
        <Reveal>
          <p className="eyebrow-accent mb-4">Nourrir le cuir</p>
          <h2 className="font-serif text-3xl leading-[1.08] text-foreground md:text-4xl">
            Un soin occasionnel
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="text-base leading-relaxed text-muted-foreground">
            Quelques fois par an, nourrissez le cuir avec un soin adapté à sa nature, appliqué en
            fine couche à l'aide d'un chiffon doux, puis laissez pénétrer. Procédez toujours par
            petites quantités et testez d'abord sur une zone discrète. Pour les cuirs exotiques et
            les finitions particulières, la Maison vous conseille personnellement le soin le plus
            juste.
          </p>
          <Link
            to="/contact"
            className="link-underline mt-7 inline-block text-[0.7rem] uppercase tracking-[0.22em] text-foreground"
          >
            Demander un conseil d'entretien
          </Link>
        </Reveal>
      </div>
    </section>

    {/* La patine — un choix assumé */}
    <section className="bg-offwhite py-16 md:py-24">
      <Reveal className="mx-auto max-w-2xl px-5 text-center md:px-10">
        <p className="eyebrow-accent mb-4">La patine</p>
        <h3 className="font-serif text-3xl leading-[1.08] text-foreground md:text-4xl">
          La beauté du temps.
        </h3>
        <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-muted-foreground">
          Avec les années, le cuir se nuance, s'assouplit et révèle une patine unique, propre à
          celle qui le porte. Loin d'être une usure, cette évolution est la signature d'une pièce
          authentique et vivante. L'entretenir, c'est accepter le temps long et faire de votre
          pièce un objet véritablement vôtre.
        </p>
        <Link
          to="/collection"
          className="link-underline mt-8 inline-block text-[0.7rem] uppercase tracking-[0.22em] text-foreground"
        >
          Découvrir la collection
        </Link>
      </Reveal>
    </section>
  </EditorialPage>
);

export default Entretien;
