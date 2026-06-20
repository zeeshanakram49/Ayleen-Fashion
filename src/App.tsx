import { useEffect, useMemo, useState } from "react";
import { getApiErrorMessage } from "./api/apiError";
import {
  addFavoriteProduct,
  fetchCatalog,
  fetchFavoriteProductIds,
  removeFavoriteProduct,
} from "./api/storeApi";
import { CartDrawer } from "./components/CartDrawer";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import {
  initialCheckout,
  navLinks,
  services,
  testimonials,
} from "./data/store";
import { useAuth } from "./hooks/useAuth";
import { orderTotal, parseHash, shippingFee, taxAmount } from "./lib/store";
import { AboutPage } from "./pages/AboutPage";
import { AccountPage } from "./pages/AccountPage";
import { CartPage } from "./pages/CartPage";
import { CheckoutPage } from "./pages/CheckoutPage";
import { ContactPage } from "./pages/ContactPage";
import { HomePage } from "./pages/HomePage";
import { ProductPage } from "./pages/ProductPage";
import { ShopPage } from "./pages/ShopPage";
import { WishlistPage } from "./pages/WishlistPage";
import type {
  Category,
  CartItem,
  CartRow,
  CheckoutState,
  Notice,
  Product,
  Route,
} from "./types/store";

function readStoredCart() {
  try {
    const storedCart = localStorage.getItem("ayleen_cart_v1");
    const storedLines = storedCart ? (JSON.parse(storedCart) as unknown) : [];
    if (!Array.isArray(storedLines)) return [];

    return storedLines.filter((line): line is CartItem => {
      if (!line || typeof line !== "object") return false;
      const record = line as Record<string, unknown>;
      return (
        typeof record.productId === "string" &&
        typeof record.size === "string" &&
        typeof record.qty === "number"
      );
    });
  } catch {
    return [];
  }
}

function readStoredWishlist() {
  try {
    const storedWishlist = localStorage.getItem("ayleen_wishlist_v1");
    const storedIds = storedWishlist ? (JSON.parse(storedWishlist) as unknown) : [];
    if (!Array.isArray(storedIds)) return [];

    return storedIds
      .map((productId) => (typeof productId === "string" ? productId : String(productId)))
      .filter(Boolean);
  } catch {
    return [];
  }
}

function App() {
  const { isAuthenticated } = useAuth() as { isAuthenticated: boolean };
  const [route, setRoute] = useState<Route>(() => parseHash());
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [catalogLoading, setCatalogLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("all");
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState("featured");
  const [selectedSize, setSelectedSize] = useState<Record<string, string>>({});
  const [cart, setCart] = useState<CartItem[]>(readStoredCart);
  const [wishlist, setWishlist] = useState<string[]>(readStoredWishlist);
  const [checkout, setCheckout] = useState<CheckoutState>(initialCheckout);
  const [placedOrder, setPlacedOrder] = useState("");
  const [placedPayment, setPlacedPayment] = useState<CheckoutState["payment"] | "">("");
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [latestCartLine, setLatestCartLine] = useState<{
    productId: string;
    size: string;
  } | null>(null);
  const [notice, setNotice] = useState<Notice | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadCatalog() {
      setCatalogLoading(true);

      try {
        const nextCatalog = await fetchCatalog();
        if (cancelled) return;

        setCategories(nextCatalog.categories);
        setProducts(nextCatalog.products);
      } catch (error) {
        if (cancelled) return;

        setCategories([]);
        setProducts([]);
        setNotice({
          kind: "info",
          message: getApiErrorMessage(error),
        });
      } finally {
        if (!cancelled) {
          setCatalogLoading(false);
        }
      }
    }

    void loadCatalog();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    localStorage.setItem("ayleen_cart_v1", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem("ayleen_wishlist_v1", JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(() => setNotice(null), 2200);
    return () => window.clearTimeout(timer);
  }, [notice]);

  useEffect(() => {
    if (catalogLoading) return;

    const validProductIds = new Set(products.map((product) => product.id));
    setCart((prev) => prev.filter((line) => validProductIds.has(line.productId)));

    if (!isAuthenticated) {
      setWishlist((prev) => prev.filter((productId) => validProductIds.has(productId)));
    }
  }, [catalogLoading, isAuthenticated, products]);

  useEffect(() => {
    const onHash = () => setRoute(parseHash());
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  useEffect(() => {
    if (activeCategory === "all") return;
    if (categories.some((category) => category.id === activeCategory)) return;
    setActiveCategory("all");
  }, [activeCategory, categories]);

  useEffect(() => {
    const titles: Record<Route["page"], string> = {
      home: "Aylee | Official Online Store",
      shop: "Shop | Aylee",
      product: "Product | Aylee",
      wishlist: "Wishlist | Aylee",
      cart: "Cart | Aylee",
      checkout: "Checkout | Aylee",
      account: "Account | Aylee",
      login: "Login | Aylee",
      register: "Register | Aylee",
      about: "Stores | Aylee",
      contact: "Contact | Aylee",
    };
    document.title = titles[route.page];
  }, [route]);

  useEffect(() => {
    if (route.page === "checkout") return;
    if (!placedOrder && !placedPayment) return;

    setPlacedOrder("");
    setPlacedPayment("");
  }, [placedOrder, placedPayment, route.page]);

  useEffect(() => {
    const sections = Array.from(
      document.querySelectorAll<HTMLElement>("main section"),
    );
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion) {
      sections.forEach((section) => {
        const targets = section.querySelectorAll<HTMLElement>(
          ".reveal-up, .reveal-scale",
        );
        targets.forEach((target) => target.classList.add("is-visible"));
      });
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const section = entry.target as HTMLElement;
          const targets = section.querySelectorAll<HTMLElement>(
            ".reveal-up, .reveal-scale",
          );
          targets.forEach((target, index) => {
            target.style.setProperty(
              "--section-stagger",
              `${Math.min(index * 70, 420)}ms`,
            );
            target.classList.add("is-visible");
          });

          observer.unobserve(section);
        });
      },
      { threshold: 0.2, rootMargin: "0px 0px -12% 0px" },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [route]);

  useEffect(() => {
    if (!isAuthenticated) return;

    let cancelled = false;

    async function loadFavorites() {
      try {
        const favoriteIds = await fetchFavoriteProductIds();
        if (!cancelled) {
          setWishlist(favoriteIds);
        }
      } catch (error) {
        if (!cancelled) {
          setNotice({
            kind: "info",
            message: getApiErrorMessage(error),
          });
        }
      }
    }

    void loadFavorites();

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated]);

  const cartRows = useMemo<CartRow[]>(() => {
    return cart
      .map((line) => {
        const product = products.find((item) => item.id === line.productId);
        if (!product) return null;
        return { ...line, product };
      })
      .filter((line): line is CartRow => line !== null);
  }, [cart, products]);

  const cartSubtotal = useMemo(
    () => cartRows.reduce((acc, row) => acc + row.product.price * row.qty, 0),
    [cartRows],
  );
  const shipping = useMemo(() => shippingFee(cartSubtotal), [cartSubtotal]);
  const tax = useMemo(() => taxAmount(cartSubtotal), [cartSubtotal]);
  const total = useMemo(() => orderTotal(cartSubtotal), [cartSubtotal]);
  const cartCount = useMemo(
    () => cart.reduce((acc, line) => acc + line.qty, 0),
    [cart],
  );

  const filteredProducts = useMemo(() => {
    const q = query.trim().toLowerCase();
    const visible = products.filter((product) => {
      const categoryMatch =
        activeCategory === "all" || product.categoryId === activeCategory;
      const queryMatch =
        q.length === 0 ||
        product.title.toLowerCase().includes(q) ||
        product.description.toLowerCase().includes(q) ||
        product.categoryLabel.toLowerCase().includes(q) ||
        product.fit.toLowerCase().includes(q) ||
        product.material.toLowerCase().includes(q) ||
        product.badge.toLowerCase().includes(q) ||
        product.colors.some((color) => color.toLowerCase().includes(q)) ||
        product.tags.some((tag) => tag.toLowerCase().includes(q));
      return categoryMatch && queryMatch;
    });

    if (sortBy === "price-low")
      return [...visible].sort((a, b) => a.price - b.price);
    if (sortBy === "price-high")
      return [...visible].sort((a, b) => b.price - a.price);
    if (sortBy === "rating")
      return [...visible].sort((a, b) => b.rating - a.rating);
    if (sortBy === "newest") return [...visible].reverse();

    return visible;
  }, [activeCategory, products, query, sortBy]);

  const wishlistProducts = useMemo(
    () => products.filter((product) => wishlist.includes(product.id)),
    [products, wishlist],
  );
  const productRoute = useMemo(
    () =>
      route.page === "product"
        ? (products.find((p) => p.slug === route.slug) ?? null)
        : null,
    [products, route],
  );
  const relatedProducts = useMemo(() => {
    if (!productRoute) return [];
    return products
      .filter(
        (item) =>
          item.categoryId === productRoute.categoryId &&
          item.id !== productRoute.id,
      )
      .slice(0, 4);
  }, [productRoute, products]);
  const latestCartRow = useMemo(() => {
    if (!latestCartLine) return null;
    return (
      cartRows.find(
        (row) =>
          row.productId === latestCartLine.productId &&
          row.size === latestCartLine.size,
      ) ?? null
    );
  }, [cartRows, latestCartLine]);
  const cartPreviewRow = useMemo(
    () => latestCartRow ?? cartRows[cartRows.length - 1] ?? null,
    [cartRows, latestCartRow],
  );

  async function toggleWishlist(productId: string) {
    const product = products.find((item) => item.id === productId);
    const isSaved = wishlist.includes(productId);

    if (!isAuthenticated) {
      setWishlist((prev) =>
        prev.includes(productId)
          ? prev.filter((id) => id !== productId)
          : [...prev, productId],
      );

      if (product) {
        setNotice({
          kind: isSaved ? "info" : "success",
          message: isSaved
            ? `${product.title} removed from your wishlist.`
            : `${product.title} saved to your wishlist.`,
        });
      }
      return;
    }

    try {
      if (isSaved) {
        await removeFavoriteProduct(productId);
        setWishlist((prev) => prev.filter((id) => id !== productId));
      } else {
        await addFavoriteProduct(productId);
        setWishlist((prev) => [...prev, productId]);
      }

      if (product) {
        setNotice({
          kind: isSaved ? "info" : "success",
          message: isSaved
            ? `${product.title} removed from your wishlist.`
            : `${product.title} saved to your wishlist.`,
        });
      }
    } catch (error) {
      setNotice({
        kind: "info",
        message: getApiErrorMessage(error),
      });
    }
  }

  function pickSize(productId: string, size: string) {
    setSelectedSize((prev) => ({ ...prev, [productId]: size }));
    const product = products.find((item) => item.id === productId);
    if (product) {
      setNotice({
        kind: "info",
        message: `${product.title} size ${size} selected.`,
      });
    }
  }

  function addToCart(
    productId: string,
    fallbackSize?: string,
    requireSelection = false,
    qty = 1,
  ) {
    const product = products.find((item) => item.id === productId);
    if (!product) return;

    const size = selectedSize[productId] || fallbackSize;
    if (requireSelection && !size && product.sizes.length > 1) {
      setNotice({
        kind: "info",
        message: `Please select a size for ${product.title}.`,
      });
      return;
    }

    const finalSize = size || product.sizes[0] || "One Size";

    setCart((prev) => {
      const existing = prev.find(
        (line) => line.productId === productId && line.size === finalSize,
      );
      if (existing) {
        return prev.map((line) =>
          line.productId === productId && line.size === finalSize
            ? { ...line, qty: Math.min(line.qty + qty, product.stock) }
            : line,
        );
      }
      return [...prev, { productId, size: finalSize, qty: Math.min(qty, product.stock) }];
    });

    setLatestCartLine({ productId, size: finalSize });
    setNotice({
      kind: "success",
      message: `${product.title} added to your bag.`,
    });
    setCartDrawerOpen(true);
  }

  function updateCartQty(productId: string, size: string, qty: number) {
    const product = products.find((item) => item.id === productId);
    const maxStock = product?.stock ?? 10;
    setCart((prev) =>
      prev
        .map((line) =>
          line.productId === productId && line.size === size
            ? { ...line, qty: Math.max(1, Math.min(qty, maxStock)) }
            : line,
        )
        .filter((line) => line.qty > 0),
    );
  }

  function removeCartLine(productId: string, size: string) {
    setCart((prev) =>
      prev.filter(
        (line) => !(line.productId === productId && line.size === size),
      ),
    );
  }

  function openProduct(slug: string) {
    window.location.hash = `/product/${slug}`;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function navigateToShop(categoryId = "all", nextQuery = "") {
    setActiveCategory(categoryId);
    setQuery(nextQuery);
    setSortBy("featured");
    window.location.hash = "/shop";
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function onCheckoutChange(field: keyof CheckoutState, value: string) {
    setCheckout((prev) => ({ ...prev, [field]: value }));
  }

  function placeOrder(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (
      !checkout.fullName ||
      !checkout.phone ||
      !checkout.address ||
      !checkout.city
    ) {
      setNotice({
        kind: "info",
        message: "Please fill the required checkout details.",
      });
      return;
    }

    if (cartRows.length === 0) {
      setNotice({ kind: "info", message: "Your cart is empty." });
      return;
    }

    const orderId = `AY-${Math.floor(100000 + Math.random() * 900000)}`;
    setPlacedOrder(orderId);
    setPlacedPayment(checkout.payment);
    setCart([]);
    setCheckout(initialCheckout);
    setCartDrawerOpen(false);
    setLatestCartLine(null);
    setNotice({
      kind: "success",
      message: `Order ${orderId} placed successfully.`,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="premium-scene min-h-screen text-[var(--ink)]">
      <Header
        navLinks={navLinks}
        route={route}
        activeCategory={activeCategory}
        activeQuery={query}
        wishlistCount={wishlist.length}
        cartCount={cartCount}
        onOpenCart={() => setCartDrawerOpen(true)}
        onShopCategory={navigateToShop}
      />

      {notice && (
        <div className="fixed right-4 top-24 z-[60] max-w-sm rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--paper)] px-4 py-3 text-sm shadow-[var(--shadow-lift)]">
          <p className="font-medium">{notice.message}</p>
        </div>
      )}

      <main>
        {route.page === "home" && (
          <HomePage
            products={products}
            services={services}
            testimonials={testimonials}
            wishlist={wishlist}
            selectedSize={selectedSize}
            onPickSize={pickSize}
            onToggleWishlist={toggleWishlist}
            onAddToCart={addToCart}
            onOpenProduct={openProduct}
            onShopCategory={navigateToShop}
          />
        )}

        {route.page === "shop" && (
          <ShopPage
            categories={categories}
            products={filteredProducts}
            activeCategory={activeCategory}
            query={query}
            sortBy={sortBy}
            wishlist={wishlist}
            selectedSize={selectedSize}
            onCategoryChange={setActiveCategory}
            onQueryChange={setQuery}
            onSortChange={setSortBy}
            onPickSize={pickSize}
            onToggleWishlist={toggleWishlist}
            onAddToCart={addToCart}
            onOpenProduct={openProduct}
          />
        )}

        {route.page === "product" && productRoute && (
          <ProductPage
            product={productRoute}
            relatedProducts={relatedProducts}
            pickedSize={selectedSize[productRoute.id] || ""}
            liked={wishlist.includes(productRoute.id)}
            wishlist={wishlist}
            selectedSize={selectedSize}
            onPickSize={(size) => pickSize(productRoute.id, size)}
            onAddToCart={() => addToCart(productRoute.id, undefined, true)}
            onToggleWishlist={() => toggleWishlist(productRoute.id)}
            onOpenProduct={openProduct}
            onCardAddToCart={addToCart}
            onCardPickSize={pickSize}
            onCardToggleWishlist={toggleWishlist}
          />
        )}

        {route.page === "product" && !productRoute && !catalogLoading && (
          <section className="mx-auto max-w-7xl px-5 py-14 sm:px-6 md:py-16">
            <article className="rounded-[var(--radius-lg)] border border-[var(--line)] bg-[var(--panel)] p-8 text-center sm:p-10">
              <h1 className="font-editorial text-4xl">Product not found</h1>
              <a
                href="#/shop"
                className="mt-5 inline-flex rounded-[var(--radius-sm)] border border-[var(--line-strong)] px-5 py-2 text-xs tracking-[0.16em]"
              >
                BACK TO SHOP
              </a>
            </article>
          </section>
        )}

        {route.page === "wishlist" && (
          <WishlistPage
            products={wishlistProducts}
            wishlist={wishlist}
            selectedSize={selectedSize}
            onPickSize={pickSize}
            onToggleWishlist={toggleWishlist}
            onAddToCart={addToCart}
            onOpenProduct={openProduct}
          />
        )}

        {route.page === "cart" && (
          <CartPage
            rows={cartRows}
            cartCount={cartCount}
            cartSubtotal={cartSubtotal}
            shipping={shipping}
            tax={tax}
            total={total}
            onUpdateQty={updateCartQty}
            onRemoveLine={removeCartLine}
          />
        )}

        {route.page === "checkout" && (
          <CheckoutPage
            checkout={checkout}
            cartRows={cartRows}
            cartSubtotal={cartSubtotal}
            shipping={shipping}
            tax={tax}
            total={total}
            placedOrder={placedOrder}
            placedPayment={placedPayment}
            onCheckoutChange={onCheckoutChange}
            onPlaceOrder={placeOrder}
          />
        )}

        {route.page === "about" && <AboutPage />}
        {route.page === "account" && <AccountPage />}
        {route.page === "login" && <AccountPage initialMode="login" />}
        {route.page === "register" && <AccountPage initialMode="signup" />}
        {route.page === "contact" && <ContactPage />}
      </main>

      <Footer categories={categories} />

      <CartDrawer
        open={cartDrawerOpen}
        latestItem={cartPreviewRow}
        cartCount={cartCount}
        subtotal={cartSubtotal}
        onClose={() => setCartDrawerOpen(false)}
      />
    </div>
  );
}

export default App;
