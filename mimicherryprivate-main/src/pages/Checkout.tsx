import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Header } from "@/components/mc/Header";
import { Footer } from "@/components/mc/Footer";
import { Reveal } from "@/components/mc/Reveal";
import { PaymentMethods } from "@/components/mc/PaymentMethods";
import { useCart, formatFcfa } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { createOrder } from "@/api/orders";
import { ApiError } from "@/lib/api";

const fieldClass =
  "h-11 w-full rounded-lg border border-border bg-background px-4 text-sm text-foreground placeholder:text-muted-foreground/70 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground/40";

const labelClass =
  "mb-1.5 block text-[0.62rem] uppercase tracking-[0.18em] text-muted-foreground";

const Checkout = () => {
  const { items, count, subtotal, ready, clear } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Panier vide → retour au panier (uniquement une fois le panier serveur chargé,
  // sinon un panier plein serait interprété comme vide pendant l'hydratation).
  useEffect(() => {
    if (ready && count === 0) navigate("/panier", { replace: true });
  }, [ready, count, navigate]);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const form = new FormData(e.currentTarget);
    setSubmitting(true);
    try {
      await createOrder({
        shippingFirstName: String(form.get("firstName") ?? ""),
        shippingLastName: String(form.get("lastName") ?? ""),
        shippingEmail: String(form.get("email") ?? ""),
        shippingPhone: String(form.get("phone") ?? ""),
        shippingLine1: String(form.get("address") ?? ""),
        shippingCity: String(form.get("city") ?? ""),
        shippingCountry: String(form.get("country") ?? "Sénégal"),
        notes: String(form.get("notes") ?? "") || undefined,
      });
      toast("Commande enregistrée", {
        description:
          "Notre équipe vous contactera pour finaliser le paiement et la livraison.",
      });
      await clear();
      navigate("/compte/commandes", { replace: true });
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Une erreur est survenue lors de la validation. Réessayez.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (!ready || count === 0) return null;

  return (
    <div className="min-h-screen bg-background">
      <Header overHero={false} />
      <main className="mx-auto max-w-7xl px-5 pb-24 pt-28 md:px-10 md:pb-32 md:pt-32">
        <Reveal>
          <p className="eyebrow-accent mb-4">Finaliser votre commande</p>
          <h1 className="font-serif text-4xl leading-none text-foreground md:text-5xl">
            Checkout
          </h1>
        </Reveal>

        <form
          onSubmit={handleSubmit}
          className="mt-12 grid gap-12 lg:grid-cols-[1fr_380px] lg:gap-16"
        >
          {/* Colonne formulaire */}
          <div className="space-y-12">
            {/* Informations client */}
            <Reveal>
              <section>
                <h2 className="font-serif text-2xl text-foreground">
                  Informations client
                </h2>
                <div className="mt-6 grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className={labelClass} htmlFor="firstName">
                      Prénom
                    </label>
                    <input
                      id="firstName"
                      name="firstName"
                      required
                      defaultValue={user?.firstName}
                      className={fieldClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass} htmlFor="lastName">
                      Nom
                    </label>
                    <input
                      id="lastName"
                      name="lastName"
                      required
                      defaultValue={user?.lastName}
                      className={fieldClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass} htmlFor="email">
                      Adresse e-mail
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      defaultValue={user?.email}
                      className={fieldClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass} htmlFor="phone">
                      Téléphone
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      required
                      defaultValue={user?.phone ?? ""}
                      className={fieldClass}
                    />
                  </div>
                </div>
              </section>
            </Reveal>

            {/* Adresse de livraison */}
            <Reveal>
              <section>
                <h2 className="font-serif text-2xl text-foreground">
                  Adresse de livraison
                </h2>
                <div className="mt-6 grid gap-5 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label className={labelClass} htmlFor="address">
                      Adresse
                    </label>
                    <input id="address" name="address" required className={fieldClass} />
                  </div>
                  <div>
                    <label className={labelClass} htmlFor="city">
                      Ville
                    </label>
                    <input id="city" name="city" required className={fieldClass} />
                  </div>
                  <div>
                    <label className={labelClass} htmlFor="country">
                      Pays
                    </label>
                    <input
                      id="country"
                      name="country"
                      defaultValue="Sénégal"
                      required
                      className={fieldClass}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className={labelClass} htmlFor="notes">
                      Indications de livraison (optionnel)
                    </label>
                    <input
                      id="notes"
                      name="notes"
                      placeholder="Repère, étage, instructions…"
                      className={fieldClass}
                    />
                  </div>
                </div>
              </section>
            </Reveal>

            {/* Moyens de paiement */}
            <Reveal>
              <section>
                <h2 className="font-serif text-2xl text-foreground">Paiement</h2>
                <div className="mt-6">
                  <PaymentMethods />
                  <p className="mt-5 rounded-xl border border-border bg-offwhite/50 px-5 py-4 text-sm leading-relaxed text-muted-foreground">
                    Les paiements en ligne seront prochainement disponibles. Notre
                    équipe vous accompagnera dans la finalisation de votre commande.
                  </p>
                </div>
              </section>
            </Reveal>
          </div>

          {/* Récapitulatif commande */}
          <aside className="h-fit rounded-3xl border border-border bg-offwhite/50 p-7 lg:sticky lg:top-28">
            <h2 className="font-serif text-2xl text-foreground">
              Récapitulatif commande
            </h2>
            <ul className="mt-6 space-y-4">
              {items.map((l) => (
                <li key={l.id} className="flex gap-4">
                  <div className="w-16 shrink-0 overflow-hidden rounded-md bg-offwhite">
                    <img
                      src={l.img}
                      alt={`${l.name} — ${l.color}`}
                      className="aspect-[4/5] w-full object-cover"
                    />
                  </div>
                  <div className="flex flex-1 flex-col">
                    <p className="font-serif text-sm text-foreground">{l.name}</p>
                    <p className="mt-0.5 text-[0.66rem] tracking-wide text-muted-foreground">
                      Teinte {l.color} · Qté {l.qty}
                    </p>
                    <p className="mt-auto text-sm font-semibold tracking-tight text-foreground">
                      {l.price}{" "}
                      <span className="text-xs font-normal text-muted-foreground">
                        FCFA
                      </span>
                    </p>
                  </div>
                </li>
              ))}
            </ul>

            <div className="rule-fade my-6" />

            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Sous-total</span>
                <span className="text-foreground">{formatFcfa(subtotal)} FCFA</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Livraison</span>
                <span className="text-foreground">Offerte</span>
              </div>
            </div>

            <div className="rule-fade my-6" />

            <div className="flex items-center justify-between">
              <span className="text-[0.7rem] uppercase tracking-[0.22em] text-muted-foreground">
                Total
              </span>
              <span className="text-lg font-semibold tracking-tight text-foreground">
                {formatFcfa(subtotal)}{" "}
                <span className="text-sm font-normal text-muted-foreground">FCFA</span>
              </span>
            </div>

            {error && <p role="alert" className="mt-5 text-sm text-destructive">{error}</p>}

            <button
              type="submit"
              disabled={submitting}
              className="mt-7 h-12 w-full rounded-full bg-foreground text-[0.7rem] uppercase tracking-[0.22em] text-background transition-all duration-500 hover:bg-foreground/90 disabled:opacity-60"
            >
              {submitting ? "Validation…" : "Valider ma commande"}
            </button>
            <Link
              to="/panier"
              className="link-underline mt-5 block text-center text-[0.66rem] uppercase tracking-[0.22em] text-foreground"
            >
              Retour au panier
            </Link>
          </aside>
        </form>
      </main>
      <Footer />
    </div>
  );
};

export default Checkout;
