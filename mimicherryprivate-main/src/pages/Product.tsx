import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ChevronRight, Heart, Minus, Plus, ShoppingBag, Truck, RotateCcw, ShieldCheck } from "lucide-react";
import { Header } from "@/components/mc/Header";
import { Footer } from "@/components/mc/Footer";
import { Reveal } from "@/components/mc/Reveal";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useProduct, useProducts } from "@/api/products";
import { useCart } from "@/context/CartContext";
import { useFavorites } from "@/context/FavoritesContext";
import { Skeleton } from "@/components/mc/Skeleton";

const ProductPage = () => {
  const { id: slug } = useParams();
  const { data: product, isLoading } = useProduct(slug);
  const { data: allProducts } = useProducts();
  const { addItem } = useCart();
  const { isFavorite, toggle: toggleFavorite } = useFavorites();

  const [activeColor, setActiveColor] = useState(0);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    setActiveColor(0);
    setQty(1);
  }, [slug]);

  const related = useMemo(
    () => (allProducts ?? []).filter((p) => p.id !== slug).slice(0, 3),
    [allProducts, slug],
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header overHero={false} />
        <main className="mx-auto grid max-w-7xl gap-6 px-4 pb-16 pt-24 md:grid-cols-2 md:gap-16 md:px-10 md:pb-24 md:pt-28">
          <Skeleton className="aspect-[4/5] w-full rounded-none" />
          <div className="space-y-4">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-10 w-2/3" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="mt-4 h-5 w-28" />
            <Skeleton className="h-px w-32" />
            <Skeleton className="h-20 w-full max-w-md" />
            <div className="flex gap-3 pt-2">
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-8 w-8 rounded-full" />
            </div>
            <Skeleton className="mt-6 h-14 w-full max-w-sm rounded-full" />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Header overHero={false} />
        <main className="mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center px-5 text-center">
          <h1 className="font-serif text-4xl text-foreground">Pièce introuvable</h1>
          <p className="mt-4 text-muted-foreground">
            Cette pièce n'existe pas ou n'est plus disponible.
          </p>
          <Link
            to="/collection"
            className="link-underline mt-8 text-[0.7rem] uppercase tracking-[0.22em] text-foreground"
          >
            Retour à la collection
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const color = product.colors[activeColor] ?? product.colors[0];
  const favActive = isFavorite(color.id);
  const outOfStock = color.stock <= 0;

  const handleAdd = () => {
    addItem(
      {
        id: color.id,
        productId: product.id,
        line: product.line,
        name: product.name,
        color: color.name,
        price: product.price,
        img: color.img,
      },
      qty,
    );
    setAdded(true);
    window.setTimeout(() => setAdded(false), 2200);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header overHero={false} />
      <main>
        {/* Fil d'ariane */}
        <nav
          aria-label="Fil d'ariane"
          className="mx-auto flex max-w-7xl items-center gap-2 px-4 pt-24 text-[0.62rem] uppercase tracking-[0.22em] text-muted-foreground md:px-10 md:pt-28"
        >
          <Link to="/" className="transition-colors hover:text-foreground">Accueil</Link>
          <ChevronRight className="h-3 w-3" strokeWidth={1.4} />
          <Link to="/collection" className="transition-colors hover:text-foreground">Collection</Link>
          <ChevronRight className="h-3 w-3" strokeWidth={1.4} />
          <span className="text-foreground">{product.name}</span>
        </nav>

        {/* Section principale */}
        <section className="mx-auto grid max-w-7xl gap-6 px-4 pb-16 pt-6 md:grid-cols-2 md:gap-16 md:px-10 md:pb-24 md:pt-10">
          {/* Galerie */}
          <Reveal>
            <div className="overflow-hidden bg-offwhite">
              <img
                key={color.img}
                src={color.img}
                alt={`${product.line} ${product.name} — teinte ${color.name} — Mimi Cherry Private`}
                width={1400}
                height={1750}
                className="aspect-[4/5] w-full animate-fade-in object-cover"
              />
            </div>
          </Reveal>

          {/* Informations */}
          <Reveal delay={0.08}>
            <div className="md:sticky md:top-28">
              <p className="text-[0.62rem] uppercase tracking-[0.3em] text-muted-foreground">
                {product.line}
              </p>
              <h1 className="mt-2 font-serif text-4xl leading-none text-foreground md:text-5xl">
                {product.name}
              </h1>
              <p className="mt-3 text-[0.62rem] uppercase tracking-[0.22em] text-muted-foreground">
                Réf. {product.ref}
              </p>

              <p className="mt-6 text-lg font-semibold tracking-tight text-foreground">
                {product.price}{" "}
                <span className="text-sm font-normal tracking-normal text-muted-foreground">
                  FCFA
                </span>
              </p>

              <div className="rule-fade my-7 max-w-[8rem]" />

              <p className="max-w-md text-base leading-relaxed text-muted-foreground">
                {product.shortDescription}
              </p>

              {/* Teintes */}
              <div className="mt-6">
                <div className="flex items-center gap-3">
                  <p className="text-[0.58rem] uppercase tracking-[0.3em] text-muted-foreground">
                    Teinte
                  </p>
                  <span className="text-[0.72rem] tracking-wide text-foreground">{color.name}</span>
                </div>
                <div className="mt-3 flex items-center gap-3">
                  {product.colors.map((c, i) => (
                    <button
                      key={c.name}
                      type="button"
                      onClick={() => setActiveColor(i)}
                      aria-label={`Teinte ${c.name}`}
                      aria-pressed={i === activeColor}
                      className={`h-8 w-8 rounded-full transition-all duration-500 ${
                        i === activeColor
                          ? "ring-1 ring-foreground ring-offset-2 ring-offset-background"
                          : "ring-1 ring-border hover:ring-foreground/40"
                      }`}
                      style={{ backgroundColor: c.swatch }}
                    />
                  ))}
                </div>
              </div>

              {/* Quantité + panier */}
              <div className="mt-9 flex flex-col gap-4 sm:flex-row sm:items-center">
                <div className="flex h-14 items-center justify-between rounded-full border border-foreground/15 px-3 sm:w-32">
                  <button
                    type="button"
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    aria-label="Diminuer la quantité"
                    className="flex h-8 w-8 items-center justify-center text-foreground transition-colors hover:text-foreground/60"
                  >
                    <Minus className="h-4 w-4" strokeWidth={1.5} />
                  </button>
                  <span className="text-sm tabular-nums text-foreground">{qty}</span>
                  <button
                    type="button"
                    onClick={() => setQty((q) => q + 1)}
                    aria-label="Augmenter la quantité"
                    className="flex h-8 w-8 items-center justify-center text-foreground transition-colors hover:text-foreground/60"
                  >
                    <Plus className="h-4 w-4" strokeWidth={1.5} />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleAdd}
                  disabled={outOfStock}
                  className="flex h-14 flex-1 items-center justify-center gap-2.5 rounded-full bg-foreground px-10 text-[0.74rem] uppercase tracking-[0.22em] text-background shadow-soft transition-all duration-500 hover:bg-foreground/90 hover:shadow-bag disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
                >
                  <ShoppingBag className="h-[1.15rem] w-[1.15rem]" strokeWidth={1.5} />
                  {outOfStock ? "Épuisé" : added ? "Ajouté au panier" : "Ajouter au panier"}
                </button>
              </div>

              <button
                type="button"
                onClick={() =>
                  toggleFavorite({
                    id: color.id,
                    productId: product.id,
                    line: product.line,
                    name: product.name,
                    color: color.name,
                    price: product.price,
                    img: color.img,
                  })
                }
                aria-pressed={favActive}
                className="link-underline mt-5 inline-flex items-center gap-2 text-[0.7rem] uppercase tracking-[0.22em] text-foreground"
              >
                <Heart
                  className="h-3.5 w-3.5"
                  strokeWidth={1.5}
                  fill={favActive ? "currentColor" : "none"}
                />
                {favActive ? "Retirer des favoris" : "Ajouter aux favoris"}
              </button>

              {/* Réassurance */}
              <ul className="mt-9 space-y-3 border-t border-border pt-7 text-sm text-muted-foreground">
                <li className="flex items-center gap-3">
                  <Truck className="h-4 w-4 text-foreground" strokeWidth={1.5} />
                  Livraison soignée, suivie et assurée
                </li>
                <li className="flex items-center gap-3">
                  <RotateCcw className="h-4 w-4 text-foreground" strokeWidth={1.5} />
                  Retours sous 14 jours
                </li>
                <li className="flex items-center gap-3">
                  <ShieldCheck className="h-4 w-4 text-foreground" strokeWidth={1.5} />
                  Pièce numérotée et garantie
                </li>
              </ul>
            </div>
          </Reveal>
        </section>

        {/* Récit — histoire, intention, matières, fabrication, entretien */}
        <section className="bg-offwhite py-16 md:py-24">
          <div className="mx-auto grid max-w-7xl gap-12 px-5 md:grid-cols-2 md:gap-20 md:px-10">
            <Reveal>
              <p className="eyebrow mb-5">L'histoire de la pièce</p>
              <h2 className="font-serif text-3xl leading-[1.08] text-foreground md:text-[2.6rem]">
                Une intention,
                <br />
                <span className="italic">avant un objet.</span>
              </h2>
              <p className="mt-7 max-w-md text-base leading-relaxed text-muted-foreground">
                {product.story}
              </p>
            </Reveal>

            <Reveal delay={0.1}>
              <Accordion type="single" collapsible defaultValue="intention" className="w-full">
                <AccordionItem value="intention">
                  <AccordionTrigger className="font-serif text-xl text-foreground">
                    Intention du design
                  </AccordionTrigger>
                  <AccordionContent className="text-base leading-relaxed text-muted-foreground">
                    {product.designIntent}
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="matieres">
                  <AccordionTrigger className="font-serif text-xl text-foreground">
                    Matières utilisées
                  </AccordionTrigger>
                  <AccordionContent className="text-base leading-relaxed text-muted-foreground">
                    {product.materials}
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="fabrication">
                  <AccordionTrigger className="font-serif text-xl text-foreground">
                    Fabrication artisanale
                  </AccordionTrigger>
                  <AccordionContent className="text-base leading-relaxed text-muted-foreground">
                    {product.craftsmanship}
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="entretien">
                  <AccordionTrigger className="font-serif text-xl text-foreground">
                    Conseils d'entretien
                  </AccordionTrigger>
                  <AccordionContent className="text-base leading-relaxed text-muted-foreground">
                    {product.care}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </Reveal>
          </div>
        </section>

        {/* Livraison, retours, informations complémentaires */}
        <section className="mx-auto max-w-7xl px-5 py-16 md:px-10 md:py-24">
          <div className="grid gap-10 md:grid-cols-3 md:gap-14">
            {[
              {
                icon: Truck,
                title: "Livraison",
                body: "Chaque commande est expédiée sous écrin de coton, emballée à la main. Livraison suivie au Sénégal et à l'international.",
                to: "/livraison",
              },
              {
                icon: RotateCcw,
                title: "Retours & échanges",
                body: "Vous disposez de 14 jours pour changer d'avis. La pièce est reprise non portée, dans son emballage d'origine.",
                to: "/retours",
              },
              {
                icon: ShieldCheck,
                title: "Informations complémentaires",
                body: "Pièce numérotée, garantie atelier. Notre équipe vous accompagne pour toute question de conseil ou d'entretien.",
                to: "/faq",
              },
            ].map((b) => (
              <Reveal key={b.title}>
                <b.icon className="h-5 w-5 text-foreground" strokeWidth={1.4} />
                <h3 className="mt-5 font-serif text-2xl text-foreground">{b.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{b.body}</p>
                <Link
                  to={b.to}
                  className="link-underline mt-4 inline-block text-[0.66rem] uppercase tracking-[0.22em] text-foreground"
                >
                  En savoir plus
                </Link>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Autres pièces de la collection */}
        <section className="bg-offwhite py-16 md:py-24">
          <div className="mx-auto max-w-7xl px-5 md:px-10">
            <Reveal className="mb-12 md:mb-16">
              <p className="eyebrow-accent mb-4">À découvrir aussi</p>
              <h2 className="font-serif text-3xl leading-[1.05] text-foreground md:text-4xl">
                Autres pièces de la collection
              </h2>
            </Reveal>
            <div className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-3 md:gap-x-8">
              {related.map((p, i) => (
                <Reveal key={p.id} delay={(i % 3) * 0.06}>
                  <Link to={`/produit/${p.id}`} className="group block">
                    <div className="overflow-hidden bg-background">
                      <img
                        src={p.img}
                        alt={`${p.line} ${p.name} — Mimi Cherry Private`}
                        className="aspect-[4/5] w-full object-cover img-zoom"
                      />
                    </div>
                    <div className="mt-4">
                      <p className="text-[0.58rem] uppercase tracking-[0.3em] text-muted-foreground">
                        {p.line}
                      </p>
                      <h3 className="mt-1.5 font-serif text-xl leading-none text-foreground">
                        {p.name}
                      </h3>
                      <p className="mt-2 text-base font-semibold tracking-tight text-foreground">
                        {p.price}{" "}
                        <span className="text-xs font-normal tracking-normal text-muted-foreground">
                          FCFA
                        </span>
                      </p>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default ProductPage;
