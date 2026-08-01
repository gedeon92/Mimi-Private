import { useState, type FormEvent } from "react";
import { Mail, Instagram, Clock } from "lucide-react";
import { toast } from "sonner";
import { EditorialPage } from "@/components/mc/EditorialPage";
import { Reveal } from "@/components/mc/Reveal";

const inputCls =
  "w-full border-0 border-b border-border bg-transparent px-0 py-3 text-sm text-foreground placeholder:text-muted-foreground/70 focus:border-foreground focus:outline-none focus:ring-0 transition-colors";

const Contact = () => {
  const [sent, setSent] = useState(false);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSent(true);
    toast("Message envoyé", {
      description: "La Maison vous répondra personnellement dans les meilleurs délais.",
    });
    (e.currentTarget as HTMLFormElement).reset();
  };

  return (
    <EditorialPage
      eyebrow="La Maison"
      title="Contact"
      intro="Pour un conseil personnalisé, une commande sur-mesure ou une présentation privée, la Maison vous accompagne avec attention."
    >
      <section className="mx-auto max-w-7xl px-5 py-16 md:px-10 md:py-24">
        <div className="grid gap-14 md:grid-cols-[1fr_1.2fr] md:gap-20">
          {/* Coordonnées */}
          <Reveal>
            <p className="eyebrow mb-5">Nous joindre</p>
            <h2 className="font-serif text-3xl leading-[1.1] text-foreground md:text-4xl">
              Un lien direct,
              <br />
              <span className="italic">personnel.</span>
            </h2>
            <div className="mt-10 space-y-7">
              <div className="flex items-start gap-4">
                <Mail className="mt-0.5 h-5 w-5 text-foreground" strokeWidth={1.4} />
                <div>
                  <p className="text-[0.7rem] uppercase tracking-[0.2em] text-muted-foreground">
                    E-mail
                  </p>
                  <a
                    href="mailto:contact@mimicherryprivate.com"
                    className="link-underline mt-1 inline-block text-sm text-foreground"
                  >
                    contact@mimicherryprivate.com
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Instagram className="mt-0.5 h-5 w-5 text-foreground" strokeWidth={1.4} />
                <div>
                  <p className="text-[0.7rem] uppercase tracking-[0.2em] text-muted-foreground">
                    Instagram
                  </p>
                  <a
                    href="#"
                    className="link-underline mt-1 inline-block text-sm text-foreground"
                  >
                    @mimicherryprivate
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Clock className="mt-0.5 h-5 w-5 text-foreground" strokeWidth={1.4} />
                <div>
                  <p className="text-[0.7rem] uppercase tracking-[0.2em] text-muted-foreground">
                    Disponibilité
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Du lundi au samedi, réponse sous 48h
                  </p>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Formulaire */}
          <Reveal delay={0.1}>
            <form onSubmit={onSubmit} className="space-y-7">
              <div className="grid gap-7 sm:grid-cols-2">
                <input className={inputCls} name="prenom" placeholder="Prénom" required />
                <input className={inputCls} name="nom" placeholder="Nom" required />
              </div>
              <input
                className={inputCls}
                type="email"
                name="email"
                placeholder="Adresse e-mail"
                required
              />
              <input className={inputCls} name="sujet" placeholder="Sujet" />
              <textarea
                className={`${inputCls} min-h-[120px] resize-none`}
                name="message"
                placeholder="Votre message"
                required
              />
              <button
                type="submit"
                className="inline-flex h-12 items-center justify-center rounded-full bg-foreground px-10 text-[0.7rem] uppercase tracking-[0.22em] text-background transition-all duration-500 hover:bg-foreground/90"
              >
                Envoyer le message
              </button>
              {sent && (
                <p className="text-sm text-muted-foreground">
                  Merci, votre message a bien été transmis à la Maison.
                </p>
              )}
            </form>
          </Reveal>
        </div>
      </section>
    </EditorialPage>
  );
};

export default Contact;
