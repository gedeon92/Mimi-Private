import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { Header } from "@/components/mc/Header";
import { Footer } from "@/components/mc/Footer";
import { Reveal } from "@/components/mc/Reveal";
import { useProducts } from "@/api/products";
import type { Product, ProductColor } from "@/data/products";
import collectionHero from "@/assets/hero-slide-2.webp";

/**
 * La collection FORM 01 racontée comme une seule silhouette iconique déclinée
 * en trois expressions. Chaque modèle occupe sa propre section verticale que le
 * visiteur découvre en scrollant. À l'intérieur, toutes les teintes disponibles
 * sont présentées dans une grille éditoriale, aérée et parfaitement alignée :
 * photographie, nom du modèle, prix, appel discret « Découvrir la pièce ».
 * Aucune pastille de couleur, aucun filtre, aucun badge. Un lien secondaire
 * « Explorer toutes les teintes → » ouvre la fiche produit du modèle.
 */

/** Une variante = une teinte affichée dans la grille du modèle. */
const VariantCard = ({
  product,
  color,
}: {
  product: Product;
  color: ProductColor;
}) => (
  <Link
    to={`/produit/${product.id}`}
    className="group flex flex-col"
    aria-label={`${product.line} ${product.name} — teinte ${color.name}`}
  >
    <div className="relative overflow-hidden bg-offwhite">
      <img
        src={color.img}
        alt={`${product.line} ${product.name} — teinte ${color.name} — Mimi Cherry Private`}
        width={1000}
        height={1250}
        className="aspect-[4/5] w-full object-cover object-[50%_85%] transition-transform duration-[1100ms] ease-out group-hover:scale-[1.03]"
      />
    </div>
    <p className="mt-5 text-[0.62rem] uppercase tracking-[0.3em] text-muted-foreground">
      {product.line} {product.name}
    </p>
    <p className="mt-2 text-sm font-semibold tracking-tight text-foreground">
      {product.price}{" "}
      <span className="text-xs font-normal tracking-normal text-muted-foreground">
        FCFA
      </span>
    </p>
    <span className="link-underline mt-3 inline-flex w-fit items-center gap-2 text-[0.68rem] uppercase tracking-[0.22em] text-foreground">
      Découvrir la pièce
      <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.6} />
    </span>
  </Link>
);

const ModelSection = ({ product, index }: { product: Product; index: number }) => (
  <section className="bg-background">
    <div className="mx-auto max-w-7xl px-5 md:px-8">
      <Reveal className="mb-10 max-w-2xl md:mb-14">
        <span className="block font-serif text-5xl leading-none text-foreground/12 md:text-7xl">
          {String(index + 1).padStart(2, "0")}
        </span>
        <p className="mt-5 text-[0.62rem] uppercase tracking-[0.3em] text-muted-foreground">
          {product.line}
        </p>
        <h2 className="mt-2 font-serif text-4xl leading-none text-foreground md:text-5xl">
          {product.name}
        </h2>
        <div className="rule-fade my-6 max-w-[7rem]" />
        <p className="max-w-xl text-base leading-relaxed text-muted-foreground">
          {product.shortDescription}
        </p>
      </Reveal>

      <div className="grid grid-cols-2 gap-x-6 gap-y-14 md:grid-cols-3 md:gap-x-8 md:gap-y-20">
        {product.colors.map((color) => (
          <Reveal key={`${product.id}-${color.name}`}>
            <VariantCard product={product} color={color} />
          </Reveal>
        ))}
      </div>

      <Reveal className="mt-14 md:mt-20">
        <Link
          to={`/produit/${product.id}`}
          className="link-underline inline-flex items-center gap-2 text-[0.72rem] uppercase tracking-[0.24em] text-foreground"
        >
          Explorer toutes les teintes
          <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.6} />
        </Link>
      </Reveal>
    </div>
  </section>
);

const CollectionPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { data: allProducts } = useProducts();
  const models = (allProducts ?? []).filter((p) =>
    ["standard", "mini", "wallet"].includes(p.id)
  );

  return (
    <div className="min-h-screen bg-background">
      <Header overHero />
      <main>
        {/* Hero immersif — image plein écran */}
        <section className="relative flex min-h-[88vh] w-full items-center justify-center overflow-hidden bg-ink md:min-h-[62vh]">
          <img
            src={collectionHero}
            alt="Collection FORM 01 — Mimi Cherry Private"
            className="absolute inset-0 h-full w-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/30 to-ink/45" />
          <div className="relative z-10 mx-auto max-w-3xl px-5 text-center md:px-10">
            <Reveal>
              <p className="mb-4 text-xs uppercase tracking-[0.4em] text-ivory/80">
                La Maison
              </p>
              <h1 className="font-serif text-5xl leading-[1.02] text-ivory md:text-7xl">
                The Collection.
              </h1>
              <p className="mx-auto mt-6 max-w-xl font-serif text-xl leading-relaxed text-ivory/90 md:text-2xl">
                Une collection de formes conçues pour durer.
              </p>
              <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-ivory/70 md:text-base">
                Un modèle iconique. Trois formats. Une palette de teintes
                inspirée par le temps, la matière et la permanence.
              </p>
            </Reveal>
          </div>
        </section>

        {/* Introduction FORM 01 */}
        <section className="bg-background pt-16 md:pt-24">
          <div className="mx-auto max-w-7xl px-5 md:px-8">
            <Reveal className="max-w-2xl">
              <p className="eyebrow-accent mb-3">FORM 01</p>
              <h2 className="font-serif text-3xl leading-[1.05] text-foreground md:text-4xl">
                One Shape. Three Expressions.
              </h2>
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground md:text-base">
                Du Wallet au Standard, chaque déclinaison prolonge une même
                ligne, une même intention, une même signature.
              </p>
            </Reveal>
          </div>
        </section>

        {/* Trois sections successives : Standard · Mini · Wallet */}
        <div className="space-y-24 py-16 md:space-y-40 md:py-24">
          {models.map((product, i) => (
            <ModelSection key={product.id} product={product} index={i} />
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CollectionPage;
