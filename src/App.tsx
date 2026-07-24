import { useEffect, useMemo, useState } from "react";
import { CartDrawer } from "./components/CartDrawer";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import {
  categories,
  initialCheckout,
  products,
} from "./data/store";
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
import { TrackOrderPage } from "./pages/TrackOrderPage";
import type {
  CartItem,
  CartRow,
  CheckoutState,
  Notice,
  Route,
} from "./types/store";

function readStoredCart() {
  try {
    const storedCart = localStorage.getItem("ayleen_cart_v1");
    return storedCart ? (JSON.parse(storedCart) as CartItem[]) : [];
  } catch {
    return [];
  }
}

function readStoredWishlist() {
  try {
    const storedWishlist = localStorage.getItem("ayleen_wishlist_v1");
    return storedWishlist ? (JSON.parse(storedWishlist) as string[]) : [];
  } catch {
    return [];
  }
}

function App() {
  const [route, setRoute] = useState<Route>(() => parseHash());
  const [activeCategory, setActiveCategory] = useState("all");
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState("featured");
  const [selectedSize, setSelectedSize] = useState<Record<string, string>>({});
  const [cart, setCart] = useState<CartItem[]>(readStoredCart);
  const [wishlist, setWishlist] = useState<string[]>(readStoredWishlist);
  const [checkout, setCheckout] = useState<CheckoutState>(initialCheckout);
  const [placedOrder, setPlacedOrder] = useState("");
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [notice, setNotice] = useState<Notice | null>(null);

  // Sync cart to local storage
  useEffect(() => {
    localStorage.setItem("ayleen_cart_v1", JSON.stringify(cart));
  }, [cart]);

  // Sync wishlist to local storage
  useEffect(() => {
    localStorage.setItem("ayleen_wishlist_v1", JSON.stringify(wishlist));
  }, [wishlist]);

  // Notice auto-dismiss
  useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(() => setNotice(null), 2200);
    return () => window.clearTimeout(timer);
  }, [notice]);

  // Hash change listener
  useEffect(() => {
    const onHash = () => setRoute(parseHash());
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  // Sync category & query states based on route
  useEffect(() => {
    if (route.page === "men") {
      setActiveCategory("men");
      setQuery("");
    } else if (route.page === "women") {
      setActiveCategory("women");
      setQuery("");
    } else if (route.page === "juniors") {
      setActiveCategory("juniors");
      setQuery("");
    } else if (route.page === "new-arrivals") {
      setActiveCategory("all");
      setQuery("new-in");
    } else if (route.page === "sale") {
      setActiveCategory("all");
      setQuery("sale");
    }
  }, [route]);

  // Set page titles
  useEffect(() => {
    const titles: Record<Route["page"], string> = {
      home: "AYLEEN | Premium Fashion Brand",
      shop: "Catalogue | AYLEEN",
      men: "Men | AYLEEN",
      women: "Women | AYLEEN",
      juniors: "Juniors | AYLEEN",
      "new-arrivals": "New Arrivals | AYLEEN",
      sale: "Exclusive Sale | AYLEEN",
      product: "Garment Details | AYLEEN",
      wishlist: "Curated Wishlist | AYLEEN",
      cart: "Shopping Bag | AYLEEN",
      checkout: "Secure Checkout | AYLEEN",
      account: "Membership Account | AYLEEN",
      about: "Our Story | AYLEEN",
      contact: "Contact Us | AYLEEN",
      "track-order": "Track Shipment | AYLEEN",
      search: "Search | AYLEEN",
    };
    document.title = titles[route.page] || "AYLEEN";
  }, [route]);

  const cartRows = useMemo<CartRow[]>(() => {
    return cart
      .map((line) => {
        const product = products.find((item) => item.id === line.productId);
        if (!product) return null;
        return { ...line, product };
      })
      .filter((line): line is CartRow => line !== null);
  }, [cart]);

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

  // Expose all products including women's
  const storefrontProducts = useMemo(() => products, []);

  const filteredProducts = useMemo(() => {
    const q = query.trim().toLowerCase();
    const visible = storefrontProducts.filter((product) => {
      const categoryMatch =
        activeCategory === "all" ||
        product.categoryId === activeCategory ||
        product.tags.includes(activeCategory);
      const queryMatch =
        q.length === 0 ||
        product.title.toLowerCase().includes(q) ||
        product.description.toLowerCase().includes(q) ||
        product.categoryLabel.toLowerCase().includes(q) ||
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
  }, [activeCategory, query, sortBy, storefrontProducts]);

  const wishlistProducts = useMemo(
    () => storefrontProducts.filter((product) => wishlist.includes(product.id)),
    [storefrontProducts, wishlist],
  );

  const productRoute = useMemo(
    () =>
      route.page === "product"
        ? (storefrontProducts.find((p) => p.slug === route.slug) ?? null)
        : null,
    [route, storefrontProducts],
  );

  const relatedProducts = useMemo(() => {
    if (!productRoute) return [];
    return storefrontProducts
      .filter(
        (item) =>
          item.categoryId === productRoute.categoryId &&
          item.id !== productRoute.id,
      )
      .slice(0, 4);
  }, [productRoute, storefrontProducts]);

  function toggleWishlist(productId: string) {
    setWishlist((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId],
    );
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
      return [
        ...prev,
        { productId, size: finalSize, qty: Math.min(qty, product.stock) },
      ];
    });

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
    window.location.hash = `/shop`;
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
    setCart([]);
    setCheckout(initialCheckout);
    setCartDrawerOpen(false);
    setNotice({
      kind: "success",
      message: `Order ${orderId} placed successfully.`,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="min-h-screen text-[var(--ink)]">
      <Header
        route={route}
        activeCategory={activeCategory}
        activeQuery={query}
        wishlistCount={wishlist.length}
        cartCount={cartCount}
        onOpenCart={() => setCartDrawerOpen(true)}
        onShopCategory={navigateToShop}
      />

      {/* Floating Notice Toast */}
      {notice && (
        <div className="fixed right-4 z-[250] max-w-sm border border-black/5 bg-white/95 backdrop-blur-md px-5 py-3.5 text-xs font-semibold tracking-wide shadow-xl" style={{ top: 'calc(var(--total-header) + 12px)' }}>
          <p className="font-medium text-[var(--ink)]">{notice.message}</p>
        </div>
      )}

      <main>
        {route.page === "home" && (
          <HomePage
            products={storefrontProducts}
            wishlist={wishlist}
            selectedSize={selectedSize}
            onPickSize={pickSize}
            onToggleWishlist={toggleWishlist}
            onAddToCart={addToCart}
            onOpenProduct={openProduct}
            onShopCategory={navigateToShop}
          />
        )}

        {(route.page === "shop" ||
          route.page === "men" ||
          route.page === "women" ||
          route.page === "juniors" ||
          route.page === "new-arrivals" ||
          route.page === "sale") && (
          <ShopPage
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
            pickedSize={selectedSize[productRoute.id] || productRoute.sizes[0]}
            liked={wishlist.includes(productRoute.id)}
            wishlist={wishlist}
            selectedSize={selectedSize}
            onPickSize={(size) => pickSize(productRoute.id, size)}
            onAddToCart={() => addToCart(productRoute.id)}
            onToggleWishlist={() => toggleWishlist(productRoute.id)}
            onOpenProduct={openProduct}
            onCardAddToCart={addToCart}
            onCardPickSize={pickSize}
            onCardToggleWishlist={toggleWishlist}
          />
        )}

        {route.page === "product" && !productRoute && (
          <section className="mx-auto max-w-7xl px-6 py-16">
            <article className="rounded-3xl border border-black/5 bg-[var(--panel)] p-10 text-center">
              <h1 className="font-editorial text-4xl">Product not found</h1>
              <a
                href="#/shop"
                className="mt-5 inline-flex rounded-full border border-black/15 px-5 py-2 text-xs tracking-[0.18em]"
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
            wishlist={wishlist}
            selectedSize={selectedSize}
            onPickSize={pickSize}
            onToggleWishlist={toggleWishlist}
            onAddToCart={addToCart}
            onOpenProduct={openProduct}
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
            onCheckoutChange={onCheckoutChange}
            onPlaceOrder={placeOrder}
          />
        )}

        {route.page === "about" && <AboutPage />}
        {route.page === "account" && <AccountPage />}
        {route.page === "contact" && <ContactPage />}
        {route.page === "track-order" && <TrackOrderPage />}
      </main>

      <Footer categories={categories} />

      <CartDrawer
        open={cartDrawerOpen}
        rows={cartRows}
        cartCount={cartCount}
        subtotal={cartSubtotal}
        onClose={() => setCartDrawerOpen(false)}
        onUpdateQty={updateCartQty}
        onRemoveLine={removeCartLine}
      />
    </div>
  );
}

export default App;
