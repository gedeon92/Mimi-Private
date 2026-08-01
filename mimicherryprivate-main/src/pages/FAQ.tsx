import { Link } from "react-router-dom";
import { EditorialPage } from "@/components/mc/EditorialPage";
import { Reveal } from "@/components/mc/Reveal";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    q: "Pourquoi si peu de modèles ?",
    a: "La Maison construit une collection de formes plutôt qu'un catalogue. Un seul modèle iconique, le FORM 01, décliné en quelques versions et retravaillé jusqu'à la justesse. Nous préférons la maîtrise à la profusion.",
  },
  {
    q: "Que signifie une production limitée ?",
    a: "Nos pièces sont produites en petites séries, numérotées, sans réassort systématique. Cette rareté n'est pas un argument marketing : elle découle naturellement de notre exigence et de notre philosophie du temps long.",
  },
  {
    q: "Comment sont fixés les prix ?",
    a: "Les prix reflètent la qualité des matériaux, le temps de conception et de fabrication, la rareté et un positionnement haut de gamme. Ils ne sont ni justifiés ni négociés : ils sont assumés.",
  },
  {
    q: "Quels sont les moyens de paiement acceptés ?",
    a: "La Maison accepte les paiements par mobile money (Wave, Orange Money), par carte bancaire et par virement pour les commandes internationales. Chaque transaction est sécurisée et confirmée personnellement, et notre équipe vous accompagne pour tout règlement adapté à votre situation.",
  },
  {
    q: "Comment se déroule la livraison ?",
    a: "La Maison privilégie la vente directe et une livraison individuelle, soignée et personnelle. Chaque pièce est emballée à la main et remise comme un prolongement de la Maison.",
  },
  {
    q: "Puis-je retourner ou échanger une pièce ?",
    a: "Vous disposez de quatorze jours après réception. La pièce doit être retournée intacte, non portée, dans son emballage d'origine. Chaque retour est traité personnellement par la Maison.",
  },
  {
    q: "Comment entretenir le cuir ?",
    a: "Le cuir se patine et gagne en caractère avec le temps. Conservez votre pièce à l'abri de l'humidité et de la chaleur directe, et nourrissez-la régulièrement avec un soin adapté. Des conseils détaillés accompagnent chaque commande.",
  },
];

const FAQ = () => (
  <EditorialPage
    eyebrow="Service"
    title="Questions fréquentes"
    intro="Commandes, rareté, livraison, entretien : les réponses aux questions les plus courantes, dans l'esprit de transparence de la Maison."
  >
    <section className="mx-auto max-w-3xl px-5 py-16 md:px-10 md:py-24">
      <Reveal>
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((f, i) => (
            <AccordionItem key={i} value={`item-${i}`} className="border-border">
              <AccordionTrigger className="text-left font-serif text-lg text-foreground hover:no-underline md:text-xl">
                {f.q}
              </AccordionTrigger>
              <AccordionContent className="text-sm leading-relaxed text-muted-foreground md:text-base">
                {f.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Reveal>

      <Reveal className="mt-16 text-center">
        <p className="text-sm leading-relaxed text-muted-foreground">
          Une autre question ? La Maison vous répond personnellement.
        </p>
        <Link
          to="/contact"
          className="link-underline mt-4 inline-block text-[0.7rem] uppercase tracking-[0.22em] text-foreground"
        >
          Nous contacter
        </Link>
      </Reveal>
    </section>
  </EditorialPage>
);

export default FAQ;
