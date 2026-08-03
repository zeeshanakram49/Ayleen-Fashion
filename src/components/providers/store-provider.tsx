"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { CartLine, Product } from "@/types/commerce";
import { cartLineKey, cartSummary } from "@/lib/commerce/cart";

type AddOptions = { size?: string; color?: string; quantity?: number };

type StoreContextValue = {
  lines: CartLine[];
  wishlist: string[];
  drawerOpen: boolean;
  summary: ReturnType<typeof cartSummary>;
  addItem: (product: Product, options?: AddOptions) => void;
  updateQuantity: (key: string, quantity: number) => void;
  removeItem: (key: string) => void;
  clearCart: () => void;
  toggleWishlist: (productId: string) => void;
  setDrawerOpen: (open: boolean) => void;
};

const StoreContext = createContext<StoreContextValue | null>(null);
const CART_KEY = "aylee_cart_v2";
const WISHLIST_KEY = "aylee_wishlist_v2";

function readLines(): CartLine[] {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(CART_KEY) || "[]");
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (line): line is CartLine =>
        line !== null &&
        typeof line === "object" &&
        typeof (line as CartLine).key === "string" &&
        typeof (line as CartLine).productId === "string" &&
        typeof (line as CartLine).quantity === "number",
    );
  } catch {
    return [];
  }
}

function readWishlist(): string[] {
  try {
    const parsed: unknown = JSON.parse(
      localStorage.getItem(WISHLIST_KEY) || "[]",
    );
    return Array.isArray(parsed)
      ? parsed.filter((id): id is string => typeof id === "string")
      : [];
  } catch {
    return [];
  }
}

async function syncCart(method: string, body?: object) {
  try {
    await fetch("/api/commerce/cart", {
      method,
      headers: body ? { "Content-Type": "application/json" } : undefined,
      body: body ? JSON.stringify(body) : undefined,
      keepalive: true,
    });
  } catch {
    // Local cart remains usable and will reconcile during the next successful request.
  }
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    document.documentElement.dataset.storeReady = "true";
    const stored = readLines();
    // Hydrate device-local commerce state after the client mounts.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLines(stored);
    setWishlist(readWishlist());
    void fetch("/api/commerce/cart", { cache: "no-store" })
      .then((response) => response.json())
      .then(
        (body: {
          lines?: Array<{
            productId?: string;
            product_id?: string;
            qty?: number;
            quantity?: number;
            size?: string;
          }>;
        }) => {
          if (!Array.isArray(body.lines) || body.lines.length === 0) return;
          setLines((current) =>
            current.map((line) => {
              const remote = body.lines?.find(
                (entry) =>
                  String(entry.productId || entry.product_id) ===
                    line.productId && (entry.size || "") === line.size,
              );
              if (!remote) return line;
              const quantity = Number(remote.quantity ?? remote.qty);
              return Number.isFinite(quantity) && quantity > 0
                ? { ...line, quantity: Math.min(quantity, line.stock) }
                : line;
            }),
          );
        },
      )
      .catch(() => undefined);
    return () => {
      delete document.documentElement.dataset.storeReady;
    };
  }, []);

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(lines));
  }, [lines]);

  useEffect(() => {
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
  }, [wishlist]);

  const addItem = useCallback((product: Product, options: AddOptions = {}) => {
    const size = options.size || product.sizes[0] || "";
    const color = options.color || product.colors[0] || "";
    const quantity = Math.max(
      1,
      Math.min(options.quantity || 1, product.stock),
    );
    const key = cartLineKey(product.id, size, color);
    const line: CartLine = {
      key,
      productId: product.id,
      slug: product.slug,
      name: product.name,
      image: product.images[0]?.thumbnailUrl || product.images[0]?.url || null,
      price: product.price,
      size,
      color,
      quantity,
      stock: product.stock,
    };

    setLines((current) => {
      const existing = current.find((entry) => entry.key === key);
      if (!existing) return [...current, line];
      return current.map((entry) =>
        entry.key === key
          ? {
              ...entry,
              quantity: Math.min(entry.quantity + quantity, entry.stock),
            }
          : entry,
      );
    });
    setDrawerOpen(true);
    void syncCart("POST", { productId: product.id, size, color, quantity });
  }, []);

  const updateQuantity = useCallback((key: string, quantity: number) => {
    setLines((current) => {
      const line = current.find((entry) => entry.key === key);
      if (!line) return current;
      if (quantity <= 0) {
        void syncCart("DELETE", {
          productId: line.productId,
          size: line.size,
          color: line.color,
        });
        return current.filter((entry) => entry.key !== key);
      }
      const nextQuantity = Math.min(quantity, line.stock);
      void syncCart("PATCH", {
        productId: line.productId,
        size: line.size,
        color: line.color,
        quantity: nextQuantity,
      });
      return current.map((entry) =>
        entry.key === key ? { ...entry, quantity: nextQuantity } : entry,
      );
    });
  }, []);

  const removeItem = useCallback((key: string) => {
    setLines((current) => {
      const line = current.find((entry) => entry.key === key);
      if (line) {
        void syncCart("DELETE", {
          productId: line.productId,
          size: line.size,
          color: line.color,
        });
      }
      return current.filter((entry) => entry.key !== key);
    });
  }, []);

  const clearCart = useCallback(() => {
    setLines([]);
    void syncCart("DELETE", { clear: true });
  }, []);

  const toggleWishlist = useCallback(
    (productId: string) => {
      const removing = wishlist.includes(productId);
      setWishlist((current) =>
        current.includes(productId)
          ? current.filter((id) => id !== productId)
          : [...current, productId],
      );
      void fetch("/api/commerce/wishlist", {
        method: removing ? "DELETE" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
        keepalive: true,
      }).catch(() => undefined);
    },
    [wishlist],
  );

  const value = useMemo<StoreContextValue>(
    () => ({
      lines,
      wishlist,
      drawerOpen,
      summary: cartSummary(lines),
      addItem,
      updateQuantity,
      removeItem,
      clearCart,
      toggleWishlist,
      setDrawerOpen,
    }),
    [
      addItem,
      clearCart,
      drawerOpen,
      lines,
      removeItem,
      toggleWishlist,
      updateQuantity,
      wishlist,
    ],
  );

  return (
    <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
  );
}

export function useStore(): StoreContextValue {
  const value = useContext(StoreContext);
  if (!value) throw new Error("useStore must be used within StoreProvider");
  return value;
}
