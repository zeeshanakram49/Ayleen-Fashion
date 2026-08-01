import { useEffect, useRef, useState, type WheelEvent } from "react";
import { Search, Heart, User, ShoppingBag, Menu, X, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ImageWithFallback } from "./ImageWithFallback";
import type { Category, Product, Route } from "../types/store";
import { APP_ROUTES } from "../routes/appRoutes";
import { getHashUrl } from "../routes/routeUtils";
import { SearchOverlay } from "./SearchOverlay";

type HeaderProps = {
  navLinks: { href: string; label: string }[];
  route: Route;
  activeCategory: string;
  activeQuery: string;
  wishlistCount: number;
  cartCount: number;
  categories: Category[];
  products?: Product[];
  onOpenCart: () => void;
  onShopCategory: (categoryId: string, query?: string) => void;
  onOpenProduct?: (slug: string) => void;
};

type MegaMenuItem = {
  label: string;
  categoryId: string;
  query?: string;
};

type DesktopLink = {
  id: string;
  label: string;
  categoryId: string;
  query?: string;
  title: string;
  items: MegaMenuItem[];
};

const staticDesktopLinks: DesktopLink[] = [
  {
    id: "sale",
    label: "SALE",
    categoryId: "all",
    query: "sale",
    title: "SALE ESSENTIALS",
    items: [
      { label: "EXPLORE ALL SALE", categoryId: "all", query: "sale" },
      { label: "SEASON END SALE", categoryId: "all", query: "sale" },
    ],
  },
];

export function Header({
  navLinks: _navLinks,
  route,
  activeCategory,
  activeQuery,
  wishlistCount,
  cartCount,
  categories,
  products = [],
  onOpenCart,
  onShopCategory,
  onOpenProduct,
}: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const closeMenuTimer = useRef<number | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (closeMenuTimer.current !== null) {
        window.clearTimeout(closeMenuTimer.current);
      }
    };
  }, []);

  function closeMenu() {
    setMenuOpen(false);
  }

  function clearDesktopMenuClose() {
    if (closeMenuTimer.current !== null) {
      window.clearTimeout(closeMenuTimer.current);
      closeMenuTimer.current = null;
    }
  }

  function openDesktopMenu(menuId: string) {
    clearDesktopMenuClose();
    setActiveMenu(menuId);
  }

  function closeDesktopMenuSoon() {
    clearDesktopMenuClose();
    closeMenuTimer.current = window.setTimeout(() => {
      setActiveMenu(null);
      closeMenuTimer.current = null;
    }, 200);
  }

  function closeDesktopMenuNow() {
    clearDesktopMenuClose();
    setActiveMenu(null);
  }

  function keepMegaMenuScroll(event: WheelEvent<HTMLDivElement>) {
    const menu = event.currentTarget;
    const canScroll = menu.scrollHeight > menu.clientHeight;
    if (!canScroll) {
      event.preventDefault();
      return;
    }
    const isAtTop = menu.scrollTop <= 0;
    const isAtBottom =
      Math.ceil(menu.scrollTop + menu.clientHeight) >= menu.scrollHeight;

    if ((event.deltaY < 0 && isAtTop) || (event.deltaY > 0 && isAtBottom)) {
      event.preventDefault();
    }
  }

  function isDesktopLinkActive(categoryId: string, query?: string) {
    if (route.page !== "shop") return false;
    if (query) return activeCategory === categoryId && activeQuery === query;
    return activeCategory === categoryId && !activeQuery;
  }

  const menCategories = categories.filter((category) => {
    const gender = category.gender?.toLowerCase();
    return category.isParent === true && (!gender || gender === "male" || gender === "men");
  });
  const menMenuItems: MegaMenuItem[] =
    menCategories.length > 0
      ? menCategories.map((category) => ({
          label: category.name,
          categoryId: category.id,
        }))
      : [{ label: "SHOP ALL MEN", categoryId: "all" }];

  const menMenu: DesktopLink = {
    id: "men",
    label: "MEN",
    categoryId: menCategories[0]?.id ?? "all",
    title: "MEN'S COLLECTION",
    items: menMenuItems,
  };
  const desktopLinks = [menMenu, ...staticDesktopLinks];
  const menMenuIsActive =
    route.page === "shop" &&
    menCategories.some((category) => category.id === activeCategory);

  const activeDesktopMenu =
    desktopLinks.find((link) => link.id === activeMenu) ?? null;
  const activeDesktopCategory =
    activeDesktopMenu?.categoryId === "all"
      ? categories.find((category) => category.image) ?? categories[0]
      : categories.find((category) => category.id === activeDesktopMenu?.categoryId);

  const isTransparent = route.page === "home" && !isScrolled;

  return (
    <>
      <header
        className={`site-header transition-all duration-300 ${
          isTransparent
            ? "fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/80 via-black/35 to-transparent text-white border-b border-white/10"
            : isScrolled
              ? "sticky top-0 z-50 bg-white/95 backdrop-blur-xl shadow-md border-b border-black/8 text-[var(--ink)]"
              : "sticky top-0 z-50 bg-white border-b border-black/8 text-[var(--ink)]"
        }`}
      >
        {/* Top Announcement Bar */}
        <div
          className={`site-announcement-bar text-[11px] font-medium tracking-[0.2em] uppercase py-2 px-4 text-center transition-colors ${
            isTransparent
              ? "bg-black/40 text-neutral-200 border-b border-white/10"
              : "bg-[var(--ink)] text-white"
          }`}
        >
          FREE EXPRESS SHIPPING ON ALL ORDERS ABOVE RS. 2,500
        </div>

        {/* Desktop Header Container (76–84px) */}
        <div
          className="relative mx-auto hidden min-h-[80px] max-w-[1700px] items-center justify-between px-8 lg:flex xl:px-12"
          onMouseEnter={clearDesktopMenuClose}
          onMouseLeave={closeDesktopMenuSoon}
        >
          {/* Left Brand Logo */}
          <a
            href={getHashUrl(APP_ROUTES.home)}
            className={`site-wordmark shrink-0 font-display text-3xl font-extrabold tracking-tighter transition ${
              isTransparent ? "!text-white drop-shadow-lg" : "text-[var(--ink)]"
            }`}
          >
            AYLEE
          </a>

          {/* Center Navigation Links */}
          <nav className="flex items-center gap-8 text-sm font-semibold tracking-[0.14em] uppercase" aria-label="Primary navigation">
            {desktopLinks.map((link) => (
              <button
                key={link.id}
                type="button"
                onMouseEnter={() => openDesktopMenu(link.id)}
                onFocus={() => openDesktopMenu(link.id)}
                onClick={() => {
                  if (link.id === "men") {
                    openDesktopMenu(link.id);
                    return;
                  }
                  closeDesktopMenuNow();
                  onShopCategory(link.categoryId, link.query);
                }}
                className={`nav-link-underline py-2 transition-colors ${
                  isTransparent
                    ? "text-white hover:text-neutral-200 drop-shadow-sm"
                    : (link.id === "men"
                        ? menMenuIsActive
                        : isDesktopLinkActive(link.categoryId, link.query))
                      ? "text-[var(--ink)] font-bold"
                      : "text-neutral-700 hover:text-[var(--ink)]"
                }`}
              >
                {link.label}
              </button>
            ))}
            <a
              href={getHashUrl(APP_ROUTES.shop)}
              onMouseEnter={closeDesktopMenuNow}
              className={`nav-link-underline py-2 transition-colors ${
                isTransparent ? "text-white hover:text-neutral-200 drop-shadow-sm" : "text-neutral-700 hover:text-[var(--ink)]"
              }`}
            >
              COLLECTIONS
            </a>
            <a
              href={getHashUrl(APP_ROUTES.about)}
              onMouseEnter={closeDesktopMenuNow}
              className={`nav-link-underline py-2 transition-colors ${
                isTransparent ? "text-white hover:text-neutral-200 drop-shadow-sm" : "text-neutral-700 hover:text-[var(--ink)]"
              }`}
            >
              STORES
            </a>
            <a
              href={getHashUrl(APP_ROUTES.contact)}
              onMouseEnter={closeDesktopMenuNow}
              className={`nav-link-underline py-2 transition-colors ${
                isTransparent ? "text-white hover:text-neutral-200 drop-shadow-sm" : "text-neutral-700 hover:text-[var(--ink)]"
              }`}
            >
              CONTACT
            </a>
          </nav>

          {/* Right Action Icons (22-24px) */}
          <div className="flex shrink-0 items-center gap-5">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className={`p-2 transition active:scale-95 ${
                isTransparent ? "text-white hover:text-neutral-200" : "text-neutral-800 hover:text-[var(--ink)]"
              }`}
              aria-label="Search products"
            >
              <Search size={22} />
            </button>
            <a
              href={getHashUrl(APP_ROUTES.wishlist)}
              className={`relative p-2 transition active:scale-95 ${
                isTransparent ? "text-white hover:text-neutral-200" : "text-neutral-800 hover:text-[var(--ink)]"
              }`}
              aria-label={`Wishlist, ${wishlistCount} items`}
            >
              <Heart size={22} />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--ink)] text-[10px] font-bold text-white shadow-sm">
                  {wishlistCount}
                </span>
              )}
            </a>
            <a
              href={getHashUrl(APP_ROUTES.account)}
              className={`p-2 transition active:scale-95 ${
                isTransparent ? "text-white hover:text-neutral-200" : "text-neutral-800 hover:text-[var(--ink)]"
              }`}
              aria-label="Account login and sign up"
            >
              <User size={22} />
            </a>
            <button
              type="button"
              onClick={onOpenCart}
              className={`relative p-2 transition active:scale-95 ${
                isTransparent ? "text-white hover:text-neutral-200" : "text-neutral-800 hover:text-[var(--ink)]"
              }`}
              aria-label={`Open cart, ${cartCount} items`}
            >
              <ShoppingBag size={22} />
              {cartCount > 0 && (
                <span className="cart-badge-pop absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--ink)] text-[10px] font-bold text-white shadow-md">
                  {cartCount}
                </span>
              )}
            </button>
          </div>

          {/* Mega Menu Dropdown Overlay */}
          <AnimatePresence>
            {activeDesktopMenu && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.2 }}
                className="site-mega-menu absolute top-full left-0 w-full border-t border-[var(--line)] bg-white/98 backdrop-blur-2xl shadow-2xl p-8"
                onMouseEnter={clearDesktopMenuClose}
                onMouseLeave={closeDesktopMenuSoon}
                onWheel={keepMegaMenuScroll}
              >
                <div className="mx-auto max-w-6xl grid grid-cols-3 gap-12">
                  <div className="col-span-1 space-y-4">
                    <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--muted)] border-b border-[var(--line)] pb-2">
                      {activeDesktopMenu.title}
                    </h3>
                    <div className="flex flex-col gap-2">
                      {activeDesktopMenu.items.map((item) => (
                        <button
                          key={item.label}
                          type="button"
                          onClick={() => {
                            closeDesktopMenuNow();
                            onShopCategory(item.categoryId, item.query);
                          }}
                          className="flex items-center justify-between text-left text-sm font-semibold uppercase tracking-wider text-[var(--ink)] hover:translate-x-1 hover:text-[var(--muted)] transition duration-200 py-1"
                        >
                          <span>{item.label}</span>
                          <ChevronRight size={14} />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="col-span-2 relative h-64 overflow-hidden rounded-2xl bg-[var(--panel)]">
                    <ImageWithFallback
                      src={activeDesktopCategory?.image}
                      alt={activeDesktopMenu.title}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent p-6 flex flex-col justify-end text-white">
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-300">
                        EDITORIAL PICK
                      </p>
                      <h4 className="text-2xl font-bold tracking-tight mt-1">
                        {activeDesktopMenu.title}
                      </h4>
                      <button
                        type="button"
                        onClick={() => {
                          closeDesktopMenuNow();
                          onShopCategory(
                            activeDesktopMenu.categoryId,
                            activeDesktopMenu.query
                          );
                        }}
                        className="mt-3 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2 text-xs font-bold uppercase tracking-widest text-[var(--ink)] hover:bg-neutral-200 transition"
                      >
                        EXPLORE NOW <ChevronRight size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Mobile Header Container (60–68px) */}
        <div className="flex h-[64px] max-w-7xl items-center justify-between px-4 lg:hidden">
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Toggle menu"
              onClick={() => setMenuOpen((prev) => !prev)}
              className={`flex h-11 w-11 items-center justify-center rounded-full border transition active:scale-95 ${
                isTransparent
                  ? "border-white/30 text-white bg-black/20"
                  : "border-[var(--line-strong)] text-[var(--ink)] hover:bg-[var(--panel)]"
              }`}
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className={`flex h-11 w-11 items-center justify-center rounded-full border transition active:scale-95 ${
                isTransparent
                  ? "border-white/30 text-white bg-black/20"
                  : "border-[var(--line-strong)] text-[var(--ink)] hover:bg-[var(--panel)]"
              }`}
              aria-label="Search"
            >
              <Search size={20} />
            </button>
          </div>

          <a
            href={getHashUrl(APP_ROUTES.home)}
            className={`site-wordmark font-display text-2xl font-extrabold tracking-tighter transition ${
              isTransparent ? "!text-white drop-shadow-lg" : "text-[var(--ink)]"
            }`}
          >
            AYLEE
          </a>

          <div className="flex items-center gap-2">
            <a
              href={getHashUrl(APP_ROUTES.wishlist)}
              className={`relative flex h-11 w-11 items-center justify-center rounded-full border transition active:scale-95 ${
                isTransparent
                  ? "border-white/30 text-white bg-black/20"
                  : "border-[var(--line-strong)] text-[var(--ink)] hover:bg-[var(--panel)]"
              }`}
              aria-label={`Wishlist, ${wishlistCount} items`}
            >
              <Heart size={20} />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--ink)] text-[10px] font-bold text-white shadow-sm">
                  {wishlistCount}
                </span>
              )}
            </a>
            <button
              type="button"
              onClick={onOpenCart}
              className={`relative flex h-11 w-11 items-center justify-center rounded-full border transition active:scale-95 ${
                isTransparent
                  ? "border-white/30 text-white bg-black/20"
                  : "border-[var(--line-strong)] text-[var(--ink)] hover:bg-[var(--panel)]"
              }`}
              aria-label={`Open cart, ${cartCount} items`}
            >
              <ShoppingBag size={20} />
              {cartCount > 0 && (
                <span className="cart-badge-pop absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--ink)] text-[10px] font-bold text-white shadow-md">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Full-Height Navigation Drawer */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 250 }}
              className="fixed inset-0 z-[9970] top-[100px] flex flex-col bg-white p-6 shadow-2xl overflow-y-auto lg:hidden"
            >
              <div className="flex flex-col gap-3">
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--muted)]">
                  Categories
                </span>
                <button
                  type="button"
                  onClick={() => {
                    closeMenu();
                    onShopCategory("all");
                  }}
                  className="flex items-center justify-between rounded-xl bg-[var(--panel)] p-4 text-sm font-bold uppercase tracking-wider text-[var(--ink)]"
                >
                  <span>SHOP ALL PRODUCTS</span>
                  <ChevronRight size={18} />
                </button>
                {menCategories.map((category) => (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => {
                      closeMenu();
                      onShopCategory(category.id);
                    }}
                    className="flex items-center justify-between rounded-xl border border-[var(--line)] p-4 text-sm font-bold uppercase tracking-wider text-[var(--ink)] hover:bg-[var(--panel)] transition"
                  >
                    <span>{category.name}</span>
                    <ChevronRight size={18} />
                  </button>
                ))}
              </div>

              <div className="mt-8 flex flex-col gap-3 border-t border-[var(--line)] pt-6">
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--muted)]">
                  Account &amp; Info
                </span>
                <a
                  href={getHashUrl(APP_ROUTES.account)}
                  onClick={closeMenu}
                  className="flex items-center justify-between p-3 text-sm font-semibold text-[var(--ink)]"
                >
                  <span className="flex items-center gap-2">
                    <User size={18} /> My Account / Login
                  </span>
                  <ChevronRight size={16} />
                </a>
                <a
                  href={getHashUrl(APP_ROUTES.wishlist)}
                  onClick={closeMenu}
                  className="flex items-center justify-between p-3 text-sm font-semibold text-[var(--ink)]"
                >
                  <span className="flex items-center gap-2">
                    <Heart size={18} /> Saved Wishlist ({wishlistCount})
                  </span>
                  <ChevronRight size={16} />
                </a>
                <a
                  href={getHashUrl(APP_ROUTES.about)}
                  onClick={closeMenu}
                  className="flex items-center justify-between p-3 text-sm font-semibold text-[var(--ink)]"
                >
                  <span>Our Stores &amp; Story</span>
                  <ChevronRight size={16} />
                </a>
                <a
                  href={getHashUrl(APP_ROUTES.contact)}
                  onClick={closeMenu}
                  className="flex items-center justify-between p-3 text-sm font-semibold text-[var(--ink)]"
                >
                  <span>Contact &amp; Customer Support</span>
                  <ChevronRight size={16} />
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Interactive Search Overlay Modal */}
      <SearchOverlay
        isOpen={searchOpen}
        query={searchQuery}
        products={products}
        onQueryChange={setSearchQuery}
        onSelectProduct={(slug) => {
          if (onOpenProduct) onOpenProduct(slug);
        }}
        onSearchSubmit={(q) => {
          onShopCategory(activeCategory || "all", q);
        }}
        onClose={() => setSearchOpen(false)}
      />
    </>
  );
}
