import { Heart } from "lucide-react";
import { useFavorites, type FavoriteItem } from "@/context/FavoritesContext";
import { cn } from "@/lib/utils";

interface FavoriteButtonProps {
  item: FavoriteItem;
  className?: string;
}

/**
 * Bouton Favoris discret — pastille ronde cohérente avec le bouton panier.
 * Le cœur se remplit lorsque la pièce est enregistrée.
 */
export const FavoriteButton = ({ item, className }: FavoriteButtonProps) => {
  const { isFavorite, toggle } = useFavorites();
  const active = isFavorite(item.id);

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(item);
      }}
      aria-pressed={active}
      aria-label={
        active
          ? `Retirer ${item.line} ${item.name} ${item.color} des favoris`
          : `Ajouter ${item.line} ${item.name} ${item.color} aux favoris`
      }
      className={cn(
        "flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-all duration-500",
        active
          ? "border-foreground/40 bg-foreground text-background"
          : "border-foreground/15 text-foreground hover:border-foreground/40",
        className,
      )}
    >
      <Heart
        className="h-4 w-4"
        strokeWidth={1.4}
        fill={active ? "currentColor" : "none"}
      />
    </button>
  );
};
