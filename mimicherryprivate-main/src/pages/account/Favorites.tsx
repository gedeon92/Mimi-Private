import { Link } from "react-router-dom";
import { Trash2, ShoppingBag } from "lucide-react";
import { AccountLayout, AccountEmpty } from "@/components/mc/AccountLayout";
import { useFavorites } from "@/context/FavoritesContext";
import { useCart } from "@/context/CartContext";

const Favorites = () => {
  const { items, remove } = useFavorites();
  const { addItem } = useCart();

  return (
    <AccountLayout title="Mes favoris" intro="Retrouvez les pièces que vous avez mises de côté.">
      {items.length === 0 ? (
        <AccountEmpty
          title="Votre sélection est vide"
          body="Parcourez la collection et ajoutez vos pièces préférées à vos favoris."
          cta={
            <Link
              to="/collection"
              className="inline-flex h-11 items-center justify-center rounded-full bg-foreground px-8 text-[0.7rem] uppercase tracking-[0.22em] text-background transition-all duration-500 hover:bg-foreground/90"
            >
              Explorer la collection
            </Link>
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <article key={item.id} className="group">
              <Link
                to={`/produit/${item.productId}`}
                className="relative block overflow-hidden bg-background"
              >
                <img
                  src={item.img}
                  alt={`${item.line} ${item.name} — teinte ${item.color} — Mimi Cherry Private`}
                  className="aspect-[4/5] w-full object-contain transition-transform duration-[1100ms] ease-out group-hover:scale-[1.03]"
                />
              </Link>
              <div className="mt-4 flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[0.58rem] uppercase tracking-[0.3em] text-muted-foreground">
                    {item.line}
                  </p>
                  <h3 className="mt-1.5 font-serif text-xl leading-none text-foreground">
                    {item.name}
                  </h3>
                  <p className="mt-1 text-[0.72rem] tracking-wide text-muted-foreground">
                    {item.color}
                  </p>
                  <p className="mt-2 text-sm font-semibold tracking-tight text-foreground">
                    {item.price}{" "}
                    <span className="text-xs font-normal tracking-normal text-muted-foreground">
                      FCFA
                    </span>
                  </p>
                </div>
                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => addItem(item)}
                    aria-label={`Ajouter ${item.line} ${item.name} ${item.color} au panier`}
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-foreground/15 text-foreground transition-all duration-500 hover:border-foreground/40 hover:bg-foreground hover:text-background"
                  >
                    <ShoppingBag className="h-4 w-4" strokeWidth={1.4} />
                  </button>
                  <button
                    type="button"
                    onClick={() => remove(item.id)}
                    aria-label={`Retirer ${item.line} ${item.name} ${item.color} des favoris`}
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-foreground/15 text-muted-foreground transition-all duration-500 hover:border-foreground/40 hover:text-foreground"
                  >
                    <Trash2 className="h-4 w-4" strokeWidth={1.4} />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </AccountLayout>
  );
};

export default Favorites;
