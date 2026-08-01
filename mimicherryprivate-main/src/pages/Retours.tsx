import { Link } from "react-router-dom";
import { CheckCircle2, Clock, Package, RefreshCw } from "lucide-react";
import { EditorialPage } from "@/components/mc/EditorialPage";
import { Reveal } from "@/components/mc/Reveal";

const conditions = [
  {
    n: "01",
    title: "14 jours pour décider",
    text: "Vous disposez de quatorze jours après réception pour nous faire part de votre souhait de retour ou d'échange.",
  },
  {
    n: "02",
    title: "Une pièce intacte",
    text: "L'article doit être retourné dans son état d'origine, non porté, avec son emballage, son écrin et sa numérotation.",
  },
  {
    n: "03",
    title: "Un accompagnement direct",
    text: "Chaque retour est traité personnellement par la Maison, comme un prolongement de notre relation.",
  },
];

const process = [
  {
    icon: Clock,
    title: "Conditions & délais",
    text: "Le retour doit être initié dans les quatorze jours suivant la réception. Passé ce délai, la Maison reste à votre écoute pour étudier votre demande.",
  },
  {
    icon: Package,
    title: "Produits concernés",
    text: "Toutes les pièces de la collection sont éligibles, à l'exception des commandes personnalisées ou sur-mesure, conçues spécifiquement pour vous.",
  },
  {
    icon: RefreshCw,
    title: "Processus d'échange",
    text: "Contactez la Maison pour annoncer votre retour. Nous convenons ensemble des modalités, puis votre échange ou remboursement est traité dès réception et contrôle de la pièce.",
  },
];

const Retours = () => (
  <EditorialPage
    eyebrow="Service"
    title="Retours & échanges"
    intro="Acquérir une pièce de la Maison doit rester un geste serein. Si une pièce ne trouve pas sa place, nous vous accompagnons avec la même attention que lors de sa remise."
  >
    {/* Conditions de retour */}
    <section className="mx-auto max-w-7xl px-5 py-16 md:px-10 md:py-24">
      <Reveal className="mb-12 max-w-2xl md:mb-16">
        <p className="eyebrow-accent mb-3">Conditions de retour</p>
        <h2 className="font-serif text-3xl leading-[1.05] text-foreground md:text-4xl">
          Une démarche simple et rassurante
        </h2>
      </Reveal>
      <div className="grid gap-12 md:grid-cols-3 md:gap-16">
        {conditions.map((p, i) => (
          <Reveal key={p.n} delay={i * 0.08}>
            <div className="border-t border-border pt-6">
              <span className="font-serif text-xl tabular-nums text-muted-foreground/70">
                {p.n}
              </span>
              <h3 className="mt-3 font-serif text-2xl text-foreground">{p.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{p.text}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>

    {/* Délais, produits concernés, processus d'échange */}
    <section className="bg-offwhite py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-5 md:px-10">
        <div className="grid gap-8 md:grid-cols-3 md:gap-10">
          {process.map((b, i) => (
            <Reveal key={b.title} delay={i * 0.08}>
              <div className="h-full bg-background p-8">
                <b.icon className="h-5 w-5 text-foreground" strokeWidth={1.4} />
                <h3 className="mt-5 font-serif text-xl text-foreground">{b.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{b.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>

    {/* Contact assistance */}
    <section className="mx-auto max-w-7xl px-5 py-16 md:px-10 md:py-24">
      <Reveal className="mx-auto max-w-2xl border-t border-border pt-16 text-center">
        <CheckCircle2 className="mx-auto h-5 w-5 text-foreground" strokeWidth={1.4} />
        <h3 className="mt-5 font-serif text-3xl leading-[1.08] text-foreground md:text-4xl">
          Pièces numérotées,
          <br />
          <span className="italic">attention sur-mesure.</span>
        </h3>
        <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-muted-foreground">
          Nos pièces étant produites en séries volontairement limitées, chaque échange est
          étudié individuellement selon les disponibilités. Pour initier un retour ou un
          échange, contactez l'assistance de la Maison : nous reviendrons vers vous
          personnellement.
        </p>
        <Link
          to="/contact"
          className="link-underline mt-8 inline-block text-[0.7rem] uppercase tracking-[0.22em] text-foreground"
        >
          Contacter l'assistance
        </Link>
      </Reveal>
    </section>
  </EditorialPage>
);

export default Retours;
