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
  addServerCartItem,
  clearServerCart,
  getServerCart,
  mergeServerCart,
  removeServerCartItem,
  updateServerCartItem,
  type ServerCartLine,
} from "@/api/cart";
import { resolveProductImage } from "@/data/productAssets";

export interface CartLine {
  /** Identifiant de la variante produit (id réel côté base). */
  id: string;
  productId: string;
  line: string;
  name: string;
  color: string;
  price: string; // formatted FCFA, e.g. "165 000"
  img: string;
  qty: number;
}

interface CartContextValue {
  items: CartLine[];
  count: number;
  /** Somme brute en FCFA (nombre). */
  subtotal: number;
  /** False tant que le panier serveur n'a pas fini de se charger après connexion —
   * évite qu'un panier réellement plein soit interprété comme vide pendant l'hydratation. */
  ready: boolean;
  addItem: (item: Omit<CartLine, "qty">, qty?: number) => void;
  removeItem: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "mcp_cart";

const toNumber = (price: string) => Number(price.replace(/\s/g, "")) || 0;

function readLocalCart(): CartLine[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as CartLine[]) : [];
  } catch {
    return [];
  }
}

function writeLocalCart(items: CartLine[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    /* ignore quota errors */
  }
}

function mapServerLine(l: ServerCartLine): CartLine {
  return {
    id: l.variantId,
    // Le front route les fiches produit par slug (`/produit/:slug`), pas par id DB.
    productId: l.productSlug,
    line: l.line,
    name: l.name,
    color: l.colorName,
    price: formatFcfa(l.price),
    img: resolveProductImage(l.image),
    qty: l.quantity,
  };
}

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const { status } = useAuth();
  const [items, setItems] = useState<CartLine[]>(() => readLocalCart());
  const [ready, setReady] = useState(false);
  const mergedRef = useRef(false);

  // Invité : le panier local reste la source de vérité, persistée en localStorage.
  useEffect(() => {
    if (status !== "authenticated") writeLocalCart(items);
  }, [items, status]);

  // Connexion : fusionne le panier local (s'il existe) dans le panier serveur,
  // une seule fois par session authentifiée, puis bascule sur le serveur.
  useEffect(() => {
    if (status === "authenticated" && !mergedRef.current) {
      mergedRef.current = true;
      (async () => {
        const local = readLocalCart();
        const server =
          local.length > 0
            ? await mergeServerCart(local.map((l) => ({ variantId: l.id, quantity: l.qty })))
            : await getServerCart();
        writeLocalCart([]);
        setItems(server.map(mapServerLine));
        setReady(true);
      })();
    }
    if (status === "unauthenticated") {
      mergedRef.current = false;
      setItems(readLocalCart());
      setReady(true);
    }
  }, [status]);

  const addItem = useCallback(
    async (item: Omit<CartLine, "qty">, qty = 1) => {
      if (status === "authenticated") {
        const server = await addServerCartItem(item.id, qty);
        setItems(server.map(mapServerLine));
        return;
      }
      setItems((prev) => {
        const existing = prev.find((l) => l.id === item.id);
        if (existing) {
          return prev.map((l) => (l.id === item.id ? { ...l, qty: l.qty + qty } : l));
        }
        return [...prev, { ...item, qty }];
      });
    },
    [status],
  );

  const removeItem = useCallback(
    async (id: string) => {
      if (status === "authenticated") {
        const server = await removeServerCartItem(id);
        setItems(server.map(mapServerLine));
        return;
      }
      setItems((prev) => prev.filter((l) => l.id !== id));
    },
    [status],
  );

  const setQty = useCallback(
    async (id: string, qty: number) => {
      if (status === "authenticated") {
        const server =
          qty <= 0 ? await removeServerCartItem(id) : await updateServerCartItem(id, qty);
        setItems(server.map(mapServerLine));
        return;
      }
      setItems((prev) =>
        qty <= 0
          ? prev.filter((l) => l.id !== id)
          : prev.map((l) => (l.id === id ? { ...l, qty } : l)),
      );
    },
    [status],
  );

  const clear = useCallback(async () => {
    if (status === "authenticated") {
      await clearServerCart();
    }
    setItems([]);
  }, [status]);

  const value = useMemo<CartContextValue>(() => {
    const count = items.reduce((n, l) => n + l.qty, 0);
    const subtotal = items.reduce((n, l) => n + toNumber(l.price) * l.qty, 0);
    return { items, count, subtotal, ready, addItem, removeItem, setQty, clear };
  }, [items, ready, addItem, removeItem, setQty, clear]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
};

/** Formatte un nombre en FCFA avec séparateur d'espace. */
export const formatFcfa = (n: number) =>
  n.toLocaleString("fr-FR").replace(/ |,/g, " ");
