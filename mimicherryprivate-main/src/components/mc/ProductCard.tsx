import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, ShoppingBag } from "lucide-react";
import type { Product } from "@/data/products";

interface ProductCardProps {
  product: Product;
  index?: number;
}

/**
 * Carte produit — épurée et éditoriale. Zoom d'image discret au survol,
 * révélation calme, prix en FCFA. Aucune surcharge graphique.
 */
export const ProductCard = ({ product, index = 0 }: ProductCardProps) => {
  const reduce = useReducedMotion();

  return (
    <motion.article
      className="group flex h-full flex-col"
      initial={reduce ? false : { opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.8, delay: (index % 4) * 0.08, ease: [0.22, 1, 0.36, 1] }}
    >
      <a href="#" className="relative block overflow-hidden bg-background">
        {product.tag && (
          <span className="absolute left-4 top-4 z-10 rounded-full border border-ink/15 bg-ivory/85 px-3 py-1 text-[0.55rem] uppercase tracking-[0.22em] text-ink backdrop-blur">
            {product.tag}
          </span>
        )}

        <img
          src={product.img}
          alt={`${product.line} ${product.name} — Mimi Cherry Private`}
          width={1000}
          height={1250}
          className="aspect-[4/5] w-full object-contain img-zoom"
        />

        {/* Révélation discrète au survol */}
        <span className="pointer-events-none absolute inset-x-0 bottom-0 flex translate-y-3 items-center justify-center pb-5 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
          <span className="flex items-center gap-2 rounded-full bg-ivory/95 px-5 py-2.5 text-[0.6rem] uppercase tracking-[0.22em] text-ink shadow-soft backdrop-blur">
            Découvrir
            <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.6} />
          </span>
        </span>
      </a>

      <div className="mt-5 flex flex-1 flex-col">
        <div className="flex items-baseline justify-between">
          <p className="text-[0.62rem] uppercase tracking-[0.3em] text-muted-foreground">
            {product.line}
          </p>
          <span className="font-serif text-sm tabular-nums text-muted-foreground/70">
            Version {String(index + 1).padStart(2, "0")}
          </span>
        </div>
        <h3 className="mt-1.5 font-serif text-2xl leading-none text-foreground">{product.name}</h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{product.detail}</p>
        <div className="mt-auto flex items-center justify-between gap-4 pt-4">
          <p className="text-base font-semibold tracking-tight text-foreground">
            {product.price}{" "}
            <span className="text-xs font-normal tracking-normal text-muted-foreground">
              FCFA
            </span>
          </p>
          <button
            type="button"
            aria-label={`Ajouter ${product.line} ${product.name} au panier`}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-foreground/15 text-foreground transition-all duration-500 hover:border-foreground/40 hover:bg-foreground hover:text-background"
          >
            <ShoppingBag className="h-4 w-4" strokeWidth={1.4} />
          </button>
        </div>
      </div>
    </motion.article>
  );
};
