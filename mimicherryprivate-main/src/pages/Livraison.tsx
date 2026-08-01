import { Link } from "react-router-dom";
import { Clock, MapPin, Globe, PackageSearch } from "lucide-react";
import { EditorialPage } from "@/components/mc/EditorialPage";
import { Reveal } from "@/components/mc/Reveal";

const steps = [
  {
    n: "01",
    title: "Vente directe",
    text: "Chaque commande est suivie personnellement par la Maison, sans intermédiaire ni boutique physique.",
  },
  {
    n: "02",
    title: "Préparation soignée",
    text: "Votre pièce est emballée à la main, numérotée et accompagnée de ses instructions d'entretien.",
  },
  {
    n: "03",
    title: "Livraison individuelle",
    text: "Une remise pensée comme un prolongement de la Maison : discrète, attentionnée et personnelle.",
  },
];

const zones = [
  {
    icon: MapPin,
    title: "Livraison au Sénégal",
    delay: "2 à 4 jours ouvrés",
    text: "À Dakar et dans les principales villes, votre pièce est remise en main propre ou par coursier de confiance. Les frais et délais précis sont confirmés lors de la commande, selon votre adresse.",
  },
  {
    icon: Globe,
    title: "Livraison internationale",
    delay: "5 à 10 jours ouvrés",
    text: "La Maison expédie à l'international via un transporteur suivi et assuré. Les délais, frais de port et éventuelles taxes locales sont étudiés au cas par cas et communiqués avant l'envoi.",
  },
];

const Livraison = () => (
  <EditorialPage
    eyebrow="Service"
    title="Livraison"
    intro="Maison Privée Mimi Cherry adopte un mode de livraison volontairement intime et maîtrisé. Chaque pièce est remise à sa propriétaire avec le même soin que celui apporté à sa création."
  >
    {/* Étapes — l'expérience de remise */}
    <section className="mx-auto max-w-7xl px-5 py-16 md:px-10 md:py-24">
      <div className="grid gap-12 md:grid-cols-3 md:gap-16">
        {steps.map((s, i) => (
          <Reveal key={s.n} delay={i * 0.08}>
            <div className="border-t border-border pt-6">
              <span className="font-serif text-xl tabular-nums text-muted-foreground/70">
                {s.n}
              </span>
              <h2 className="mt-3 font-serif text-2xl text-foreground">{s.title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{s.text}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>

    {/* Délais de livraison */}
    <section className="bg-offwhite py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-5 md:px-10">
        <Reveal className="max-w-2xl">
          <Clock className="h-5 w-5 text-foreground" strokeWidth={1.4} />
          <h2 className="mt-5 font-serif text-3xl leading-[1.08] text-foreground md:text-4xl">
            Délais de livraison
          </h2>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground">
            Nos pièces étant produites en petites séries, chaque commande est préparée avec
            attention avant son départ. Comptez un à deux jours ouvrés de préparation, auxquels
            s'ajoute le temps d'acheminement propre à votre destination.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-8 md:grid-cols-2 md:gap-12">
          {zones.map((z, i) => (
            <Reveal key={z.title} delay={i * 0.08}>
              <div className="h-full border-t border-border bg-background p-8">
                <z.icon className="h-5 w-5 text-foreground" strokeWidth={1.4} />
                <h3 className="mt-5 font-serif text-2xl text-foreground">{z.title}</h3>
                <p className="mt-2 text-[0.62rem] uppercase tracking-[0.3em] text-muted-foreground">
                  {z.delay}
                </p>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{z.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>

    {/* Suivi de commande */}
    <section className="mx-auto max-w-7xl px-5 py-16 md:px-10 md:py-24">
      <div className="grid gap-12 md:grid-cols-[1fr_1.1fr] md:gap-20">
        <Reveal>
          <PackageSearch className="h-5 w-5 text-foreground" strokeWidth={1.4} />
          <h2 className="mt-5 font-serif text-3xl leading-[1.08] text-foreground md:text-4xl">
            Suivi de commande
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="text-base leading-relaxed text-muted-foreground">
            Dès la prise en charge de votre pièce, la Maison vous tient informée personnellement
            de son acheminement. Un numéro de suivi vous est communiqué lorsque la livraison le
            permet, et notre équipe reste disponible jusqu'à la réception.
          </p>
          <Link
            to="/contact"
            className="link-underline mt-7 inline-block text-[0.7rem] uppercase tracking-[0.22em] text-foreground"
          >
            Suivre ma commande
          </Link>
        </Reveal>
      </div>
    </section>

    {/* Informations complémentaires — un choix assumé */}
    <section className="bg-offwhite py-16 md:py-24">
      <Reveal className="mx-auto max-w-2xl px-5 text-center md:px-10">
        <p className="eyebrow-accent mb-4">Informations complémentaires</p>
        <h3 className="font-serif text-3xl leading-[1.08] text-foreground md:text-4xl">
          Un choix assumé.
        </h3>
        <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-muted-foreground">
          L'absence de boutique physique n'est pas un manque, mais une volonté : conserver un
          lien direct avec nos clientes, un contrôle total de l'expérience, et une diffusion
          cohérente avec notre philosophie de rareté. Pour toute demande particulière
          (destination spécifique, délai souhaité, remise en main propre), la Maison étudie
          chaque situation individuellement.
        </p>
        <Link
          to="/contact"
          className="link-underline mt-8 inline-block text-[0.7rem] uppercase tracking-[0.22em] text-foreground"
        >
          Une question sur votre commande
        </Link>
      </Reveal>
    </section>
  </EditorialPage>
);

export default Livraison;
