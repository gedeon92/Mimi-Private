import { useState } from "react";
import { Reveal } from "./Reveal";
import { ArrowRight, Check } from "lucide-react";

export const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setDone(true);
    setEmail("");
    setTimeout(() => setDone(false), 4000);
  };

  return (
    <section className="bg-background py-20 md:py-28">
      <div className="mx-auto max-w-2xl px-5 text-center md:px-10">
        <Reveal>
          <p className="eyebrow mb-4">Le cercle privé</p>
          <h2 className="font-serif text-4xl leading-tight text-foreground md:text-5xl">
            Avant tout le monde.
          </h2>
          <p className="mx-auto mt-5 max-w-md text-sm leading-relaxed text-muted-foreground">
            Nouvelles silhouettes, séries limitées et invitations confidentielles,
            directement dans votre boîte mail.
          </p>

          <form onSubmit={submit} className="mx-auto mt-10 flex max-w-md items-center gap-3">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Votre adresse e-mail"
              className="h-12 flex-1 rounded-full border border-border bg-offwhite px-5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-foreground"
            />
            <button
              type="submit"
              aria-label="S'inscrire"
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground transition-colors hover:bg-ink/90"
            >
              {done ? <Check className="h-5 w-5" /> : <ArrowRight className="h-5 w-5" />}
            </button>
          </form>
          {done && (
            <p className="mt-4 text-xs uppercase tracking-[0.2em] text-gold">
              Bienvenue dans le cercle.
            </p>
          )}
        </Reveal>
      </div>
    </section>
  );
};
