import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, ShoppingBag } from "lucide-react";
import { Reveal } from "./Reveal";
import { FavoriteButton } from "./FavoriteButton";
import { Cta } from "./Cta";
import { useProducts } from "@/api/products";
import type { Product } from "@/data/products";
import { useCart } from "@/context/CartContext";

/**
 * La collection FORM 01 — trois pièces présentées sur une seule ligne,
 * dans un rythme éditorial proche de la page Collection : grand visuel,
 * numéro de version discret, typographie ample, actions e-commerce sobres.
 * Les teintes sont proposées sous forme de miniatures très discrètes
 * (max 4, format réduit) qui pilotent le visuel principal sans recharger.
 */
const CollectionItem = ({ product, index }: { product: Product; index: number }) => {
  const [active, setActive] = useState(0);
  const color = product.colors[active] ?? product.colors[0];
  const { addItem } = useCart();
  const thumbs = product.colors.slice(0, 4);

  const cartItem = {
    id: color.id,
    productId: product.id,
    line: product.line,
    name: product.name,
    color: color.name,
    price: product.price,
    img: color.img,
  };

  return (
    <article className="group flex h-full flex-col">
      <Link
        to={`/produit/${product.id}`}
        className="relative block overflow-hidden bg-background"
      >
        {product.tag && (
          <span className="absolute left-4 top-4 z-10 rounded-full border border-ink/15 bg-ivory/85 px-3 py-1 text-[0.55rem] uppercase tracking-[0.22em] text-ink backdrop-blur">
            {product.tag}
          </span>
        )}
        <img
          key={color.img}
          src={color.img}
          alt={`${product.line} ${product.name}, teinte ${color.name}, Mimi Cherry Private`}
          width={1000}
          height={1250}
          className="aspect-[4/5] w-full animate-fade-in object-cover object-[50%_88%] img-zoom"
        />
        <span className="pointer-events-none absolute inset-x-0 bottom-0 flex translate-y-3 items-center justify-center pb-5 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
          <span className="flex items-center gap-2 rounded-full bg-ivory/95 px-5 py-2.5 text-[0.6rem] uppercase tracking-[0.22em] text-ink shadow-soft backdrop-blur">
            Découvrir
            <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.6} />
          </span>
        </span>
      </Link>

      <div className="mt-6 flex flex-1 flex-col">
        <p className="text-[0.6rem] uppercase tracking-[0.3em] text-muted-foreground">
          {product.line} · Version {String(index + 1).padStart(2, "0")}
        </p>
        <h3 className="mt-2 font-serif text-3xl leading-none text-foreground">
          {product.name}
        </h3>
        <div className="rule-fade my-5 max-w-[5rem]" />
        <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
          {product.detail}
        </p>

        {thumbs.length > 1 && (
          <div className="mt-6 flex items-center gap-2.5">
            {thumbs.map((c, i) => (
              <button
                key={`thumb-${c.name}`}
                type="button"
                onClick={() => setActive(i)}
                aria-label={`Voir ${product.name}, ${c.name}`}
                className={`relative block h-11 w-9 overflow-hidden bg-background transition-all duration-500 ${
                  i === active
                    ? "opacity-100 ring-1 ring-foreground/40"
                    : "opacity-45 hover:opacity-90"
                }`}
              >
                <img
                  src={c.img}
                  alt={`${product.name}, ${c.name}`}
                  className="h-full w-full object-cover object-[50%_88%]"
                />
              </button>
            ))}
          </div>
        )}

        <div className="mt-auto flex items-center justify-between gap-4 pt-7">
          <p className="text-base font-semibold tracking-tight text-foreground">
            {product.price}{" "}
            <span className="text-xs font-normal tracking-normal text-muted-foreground">
              FCFA
            </span>
          </p>
          <div className="flex items-center gap-2.5">
            <FavoriteButton item={cartItem} className="h-9 w-9" />
            <button
              type="button"
              onClick={() => addItem(cartItem)}
              aria-label={`Ajouter ${product.line} ${product.name} au panier`}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-foreground/15 text-foreground transition-all duration-500 hover:border-foreground/40 hover:bg-foreground hover:text-background"
            >
              <ShoppingBag className="h-4 w-4" strokeWidth={1.4} />
            </button>
          </div>
        </div>

        <Link
          to={`/produit/${product.id}`}
          className="link-underline mt-5 inline-flex w-fit items-center gap-2 text-[0.68rem] uppercase tracking-[0.22em] text-muted-foreground transition-colors hover:text-foreground"
        >
          Explorer toutes les teintes
          <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.6} />
        </Link>
      </div>
    </article>
  );
};

export const Collection = () => {
  const { data: products = [] } = useProducts();

  return (
    <section id="collection" className="bg-background py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-5 md:px-10">
        <Reveal className="mb-16 mx-auto max-w-3xl text-center md:mb-24">
          <p className="eyebrow-accent mb-4">La collection</p>
          <h2 className="font-serif text-4xl leading-[1.05] text-foreground md:text-6xl">
            FORM 01
          </h2>
          <p className="mt-5 mx-auto max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
            One Shape. Three Expressions. Du Wallet au Standard, une même courbe
            déclinée avec cohérence et simplicité.
          </p>
        </Reveal>

        <div className="grid gap-14 md:grid-cols-3 md:gap-10 lg:gap-14">
          {products
            .filter((p) => p.id !== "set")
            .map((p, i) => (
              <Reveal key={p.id} delay={i * 0.08}>
                <CollectionItem product={p} index={i} />
              </Reveal>
            ))}
        </div>

        <Reveal className="mt-24 flex justify-center md:mt-32">
          <Cta href="/collection" variant="outline">
            Découvrir la collection
          </Cta>
        </Reveal>
      </div>
    </section>
  );
};
