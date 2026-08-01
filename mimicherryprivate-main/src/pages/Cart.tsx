import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Minus, Plus, X } from "lucide-react";
import { Header } from "@/components/mc/Header";
import { Footer } from "@/components/mc/Footer";
import { Reveal } from "@/components/mc/Reveal";
import { useCart, formatFcfa } from "@/context/CartContext";
import { Skeleton } from "@/components/mc/Skeleton";

const Cart = () => {
  const { items, count, subtotal, ready, setQty, removeItem } = useCart();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header overHero={false} />
      <main className="mx-auto max-w-7xl px-5 pb-24 pt-28 md:px-10 md:pb-32 md:pt-32">
        <Reveal>
          <p className="eyebrow-accent mb-4">Votre sélection</p>
          <h1 className="font-serif text-4xl leading-none text-foreground md:text-5xl">
            Mon panier
          </h1>
        </Reveal>

        {!ready ? (
          <div className="mt-12 space-y-6">
            {[0, 1].map((i) => (
              <div key={i} className="flex gap-5 border-b border-border pb-6">
                <Skeleton className="h-32 w-24 shrink-0 sm:w-28" />
                <div className="flex-1 space-y-3 pt-1">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-5 w-40" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
            ))}
          </div>
        ) : count === 0 ? (
          <Reveal className="mt-12">
            <div className="rounded-3xl border border-border bg-offwhite/60 px-8 py-20 text-center">
              <h2 className="font-serif text-2xl text-foreground">Votre panier est vide</h2>
              <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">
                Découvrez nos pièces iconiques et composez votre première sélection.
              </p>
              <Link
                to="/collection"
                className="mt-7 inline-flex h-11 items-center justify-center rounded-full bg-foreground px-8 text-[0.7rem] uppercase tracking-[0.22em] text-background transition-all duration-500 hover:bg-foreground/90"
              >
                Découvrir la collection
              </Link>
            </div>
          </Reveal>
        ) : (
          <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_360px] lg:gap-16">
            {/* Lignes */}
            <ul className="divide-y divide-border border-y border-border">
              {items.map((l) => (
                <li key={l.id} className="flex gap-5 py-6">
                  <Link to={`/produit/${l.productId}`} className="block w-24 shrink-0 overflow-hidden bg-offwhite sm:w-28">
                    <img src={l.img} alt={`${l.name} — ${l.color}`} className="aspect-[4/5] w-full object-cover" />
                  </Link>
                  <div className="flex flex-1 flex-col">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-[0.58rem] uppercase tracking-[0.3em] text-muted-foreground">
                          {l.line}
                        </p>
                        <Link to={`/produit/${l.productId}`} className="mt-1 block font-serif text-xl text-foreground">
                          {l.name}
                        </Link>
                        <p className="mt-1 text-[0.72rem] tracking-wide text-muted-foreground">
                          Teinte {l.color}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(l.id)}
                        aria-label="Retirer la pièce"
                        className="text-muted-foreground transition-colors hover:text-foreground"
                      >
                        <X className="h-4 w-4" strokeWidth={1.5} />
                      </button>
                    </div>

                    <div className="mt-auto flex items-center justify-between gap-4 pt-4">
                      <div className="flex h-10 items-center justify-between rounded-full border border-foreground/15 px-2">
                        <button
                          type="button"
                          onClick={() => setQty(l.id, l.qty - 1)}
                          aria-label="Diminuer la quantité"
                          className="flex h-7 w-7 items-center justify-center text-foreground transition-colors hover:text-foreground/60"
                        >
                          <Minus className="h-3.5 w-3.5" strokeWidth={1.5} />
                        </button>
                        <span className="w-7 text-center text-sm tabular-nums text-foreground">{l.qty}</span>
                        <button
                          type="button"
                          onClick={() => setQty(l.id, l.qty + 1)}
                          aria-label="Augmenter la quantité"
                          className="flex h-7 w-7 items-center justify-center text-foreground transition-colors hover:text-foreground/60"
                        >
                          <Plus className="h-3.5 w-3.5" strokeWidth={1.5} />
                        </button>
                      </div>
                      <p className="text-sm font-semibold tracking-tight text-foreground">
                        {l.price} <span className="text-xs font-normal text-muted-foreground">FCFA</span>
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            {/* Récapitulatif */}
            <aside className="h-fit rounded-3xl border border-border bg-offwhite/50 p-7 lg:sticky lg:top-28">
              <h2 className="font-serif text-2xl text-foreground">Récapitulatif</h2>
              <div className="mt-6 space-y-3 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>Sous-total</span>
                  <span className="text-foreground">{formatFcfa(subtotal)} FCFA</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Livraison</span>
                  <span className="text-foreground">Calculée à l'étape suivante</span>
                </div>
              </div>
              <div className="rule-fade my-6" />
              <div className="flex items-center justify-between">
                <span className="text-[0.7rem] uppercase tracking-[0.22em] text-muted-foreground">Total</span>
                <span className="text-lg font-semibold tracking-tight text-foreground">
                  {formatFcfa(subtotal)} <span className="text-sm font-normal text-muted-foreground">FCFA</span>
                </span>
              </div>
              <Link
                to="/commande"
                className="mt-7 flex h-12 w-full items-center justify-center rounded-full bg-foreground text-[0.7rem] uppercase tracking-[0.22em] text-background transition-all duration-500 hover:bg-foreground/90"
              >
                Passer la commande
              </Link>
              <Link
                to="/collection"
                className="link-underline mt-5 block text-center text-[0.66rem] uppercase tracking-[0.22em] text-foreground"
              >
                Continuer mes achats
              </Link>
              <p className="mt-6 text-center text-[0.62rem] leading-relaxed tracking-[0.18em] text-muted-foreground uppercase">
                Paiement sécurisé · Wave · Orange Money · Carte bancaire
              </p>
              <p className="mt-3 text-center text-[0.7rem] leading-relaxed text-muted-foreground">
                Une question sur votre commande ?{" "}
                <Link to="/contact" className="link-underline text-foreground">
                  Contactez la Maison
                </Link>
              </p>
            </aside>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Cart;
