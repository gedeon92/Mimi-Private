import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useAuth } from "./AuthContext";
import {
  addServerFavorite,
  getServerFavorites,
  mergeServerFavorites,
  removeServerFavorite,
  type ServerFavorite,
} from "@/api/favorites";
import { resolveProductImage } from "@/data/productAssets";
import { formatFcfa } from "./CartContext";

export interface FavoriteItem {
  /** Identifiant de la variante produit (id réel côté base). */
  id: string;
  productId: string;
  line: string;
  name: string;
  color: string;
  price: string; // formatted FCFA
  img: string;
}

interface FavoritesContextValue {
  items: FavoriteItem[];
  count: number;
  isFavorite: (id: string) => boolean;
  toggle: (item: FavoriteItem) => void;
  remove: (id: string) => void;
  clear: () => void;
}

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

const STORAGE_KEY = "mcp_favorites";

function readLocalFavorites(): FavoriteItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as FavoriteItem[]) : [];
  } catch {
    return [];
  }
}

function writeLocalFavorites(items: FavoriteItem[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    /* ignore quota errors */
  }
}

function mapServerFavorite(f: ServerFavorite): FavoriteItem {
  return {
    id: f.variantId,
    // Le front route les fiches produit par slug (`/produit/:slug`), pas par id DB.
    productId: f.productSlug,
    line: f.line,
    name: f.name,
    color: f.colorName,
    price: formatFcfa(f.price),
    img: resolveProductImage(f.image),
  };
}

export const FavoritesProvider = ({ children }: { children: ReactNode }) => {
  const { status } = useAuth();
  const [items, setItems] = useState<FavoriteItem[]>(() => readLocalFavorites());
  const mergedRef = useRef(false);

  useEffect(() => {
    if (status !== "authenticated") writeLocalFavorites(items);
  }, [items, status]);

  useEffect(() => {
    if (status === "authenticated" && !mergedRef.current) {
      mergedRef.current = true;
      (async () => {
        const local = readLocalFavorites();
        const server =
          local.length > 0
            ? await mergeServerFavorites(local.map((i) => i.id))
            : await getServerFavorites();
        writeLocalFavorites([]);
        setItems(server.map(mapServerFavorite));
      })();
    }
    if (status === "unauthenticated") {
      mergedRef.current = false;
      setItems(readLocalFavorites());
    }
  }, [status]);

  const isFavorite = useCallback((id: string) => items.some((i) => i.id === id), [items]);

  const toggle = useCallback(
    async (item: FavoriteItem) => {
      const currentlyFavorite = items.some((i) => i.id === item.id);

      if (status === "authenticated") {
        const server = currentlyFavorite
          ? await removeServerFavorite(item.id)
          : await addServerFavorite(item.id);
        setItems(server.map(mapServerFavorite));
        return;
      }

      setItems((prev) =>
        prev.some((i) => i.id === item.id)
          ? prev.filter((i) => i.id !== item.id)
          : [...prev, item],
      );
    },
    [items, status],
  );

  const remove = useCallback(
    async (id: string) => {
      if (status === "authenticated") {
        const server = await removeServerFavorite(id);
        setItems(server.map(mapServerFavorite));
        return;
      }
      setItems((prev) => prev.filter((i) => i.id !== id));
    },
    [status],
  );

  const clear = useCallback(async () => {
    if (status === "authenticated") {
      await Promise.all(items.map((i) => removeServerFavorite(i.id)));
    }
    setItems([]);
  }, [items, status]);

  const value = useMemo<FavoritesContextValue>(
    () => ({ items, count: items.length, isFavorite, toggle, remove, clear }),
    [items, isFavorite, toggle, remove, clear],
  );

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
};

export const useFavorites = () => {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error("useFavorites must be used within a FavoritesProvider");
  return ctx;
};
