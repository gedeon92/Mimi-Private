import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import { Search, X } from "lucide-react";
import { useProducts } from "@/api/products";

interface SearchOverlayProps {
  open: boolean;
  onClose: () => void;
}

/**
 * Recherche élégante — superposition plein écran depuis le header.
 * Filtre les pièces par nom, modèle ou catégorie. Adapté desktop et mobile.
 */
export const SearchOverlay = ({ open, onClose }: SearchOverlayProps) => {
  const { data: products = [] } = useProducts();
  const quickCategories = useMemo(
    () => Array.from(new Set(products.map((p) => p.category))),
    [products],
  );
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setQuery("");
      const t = window.setTimeout(() => inputRef.current?.focus(), 120);
      document.body.style.overflow = "hidden";
      return () => {
        window.clearTimeout(t);
        document.body.style.overflow = "";
      };
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return products.filter((p) =>
      [p.name, p.line, p.category, p.detail, p.ref]
        .join(" ")
        .toLowerCase()
        .includes(q),
    );
  }, [query, products]);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-[60] flex flex-col bg-ivory/98 backdrop-blur-md">
      {/* Barre de saisie */}
      <div className="border-b border-border">
        <div className="mx-auto flex max-w-3xl items-center gap-4 px-5 py-6 md:px-8 md:py-8">
          <Search className="h-5 w-5 shrink-0 text-foreground" strokeWidth={1.4} />
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher une pièce, un modèle, une catégorie…"
            className="w-full border-0 bg-transparent font-serif text-2xl text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-0 md:text-3xl"
            aria-label="Champ de recherche"
          />
          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer la recherche"
            className="shrink-0 text-foreground transition-opacity hover:opacity-60"
          >
            <X className="h-6 w-6" strokeWidth={1.3} />
          </button>
        </div>
      </div>

      {/* Résultats */}
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-3xl px-5 py-8 md:px-8 md:py-10">
          {query.trim() === "" ? (
            <div>
              <p className="text-[0.62rem] uppercase tracking-[0.3em] text-muted-foreground">
                Catégories
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                {quickCategories.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setQuery(c)}
                    className="rounded-full border border-border px-4 py-2 text-[0.7rem] uppercase tracking-[0.18em] text-foreground transition-colors hover:border-foreground/40"
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          ) : results.length === 0 ? (
            <p className="text-sm leading-relaxed text-muted-foreground">
              Aucune pièce ne correspond à « {query} ». Essayez un autre modèle ou une
              catégorie.
            </p>
          ) : (
            <>
              <p className="text-[0.62rem] uppercase tracking-[0.3em] text-muted-foreground">
                {results.length} pièce{results.length > 1 ? "s" : ""}
              </p>
              <ul className="mt-6 divide-y divide-border">
                {results.map((p) => (
                  <li key={p.id}>
                    <Link
                      to={`/produit/${p.id}`}
                      onClick={onClose}
                      className="group flex items-center gap-5 py-4"
                    >
                      <img
                        src={p.img}
                        alt={`${p.line} ${p.name}`}
                        className="h-20 w-16 shrink-0 bg-offwhite object-contain"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-[0.58rem] uppercase tracking-[0.3em] text-muted-foreground">
                          {p.line} · {p.category}
                        </p>
                        <h3 className="mt-1 font-serif text-xl leading-none text-foreground">
                          {p.name}
                        </h3>
                        <p className="mt-1.5 line-clamp-1 text-sm text-muted-foreground">
                          {p.detail}
                        </p>
                      </div>
                      <p className="shrink-0 text-sm font-semibold tracking-tight text-foreground">
                        {p.price}{" "}
                        <span className="text-xs font-normal text-muted-foreground">FCFA</span>
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
};
