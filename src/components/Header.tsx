import { useState } from "react";
import type { Route } from "../types/store";

type HeaderProps = {
  navLinks: { href: string; label: string }[];
  route: Route;
  activeCategory: string;
  activeQuery: string;
  wishlistCount: number;
  cartCount: number;
  onOpenCart: () => void;
  onShopCategory: (categoryId: string, query?: string) => void;
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
  hero: string;
  title: string;
  items: MegaMenuItem[];
};

const desktopLinks: DesktopLink[] = [
  {
    id: "woman",
    label: "WOMAN",
    categoryId: "women",
    hero: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=1600&auto=format&fit=crop",
    title: "WOMAN",
    items: [
      { label: "NEW IN", categoryId: "women" },
      { label: "SPRING SUMMER '26", categoryId: "women" },
      { label: "TOPS & BLOUSES", categoryId: "women", query: "shirt" },
      { label: "DRESSES & SKIRTS", categoryId: "women", query: "abaya" },
      { label: "BOTTOMS", categoryId: "women" },
    ],
  },
  {
    id: "man",
    label: "MAN",
    categoryId: "men",
    hero: "/founder-formal.jpg",
    title: "MAN",
    items: [
      { label: "NEW IN", categoryId: "men" },
      { label: "SMART CASUAL", categoryId: "men", query: "linen" },
      { label: "TAILORING", categoryId: "men", query: "formal" },
      { label: "WEEKEND LOOKS", categoryId: "men" },
      { label: "FEATURED SHOOTS", categoryId: "men", query: "new-in" },
    ],
  },
  {
    id: "shoes",
    label: "SHOES",
    categoryId: "accessories",
    query: "shoes",
    hero: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1600&auto=format&fit=crop",
    title: "SHOES",
    items: [
      { label: "SNEAKERS", categoryId: "accessories", query: "sneaker" },
      { label: "SLIDES", categoryId: "accessories", query: "slides" },
      { label: "PREMIUM LEATHER", categoryId: "accessories", query: "shoes" },
      { label: "SUMMER EDIT", categoryId: "accessories", query: "shoes" },
    ],
  },
  {
    id: "accessories",
    label: "ACCESSORIES",
    categoryId: "accessories",
    query: "bags",
    hero: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=1600&auto=format&fit=crop",
    title: "ACCESSORIES",
    items: [
      { label: "BLACK LUXURY BAGS", categoryId: "accessories", query: "bags" },
      { label: "TOTES", categoryId: "accessories", query: "tote" },
      { label: "BACKPACKS", categoryId: "accessories", query: "backpack" },
      { label: "GIFT EDIT", categoryId: "accessories", query: "bags" },
    ],
  },
];

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="11" cy="11" r="6.7" />
      <path d="M16.2 16.2 20 20" />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 20.4 4.9 13.6a4.6 4.6 0 0 1 6.5-6.5L12 7.7l.6-.6a4.6 4.6 0 0 1 6.5 6.5Z" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="8.2" r="3.7" />
      <path d="M5.2 20c.9-3.5 3.1-5.3 6.8-5.3s5.9 1.8 6.8 5.3" />
    </svg>
  );
}

function BagIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 8.4h14l-.9 11.4H5.9z" />
      <path d="M9 8.4V7a3 3 0 0 1 6 0v1.4" />
    </svg>
  );
}

export function Header({
  navLinks,
  route,
  activeCategory,
  activeQuery,
  wishlistCount,
  cartCount,
  onOpenCart,
  onShopCategory,
}: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  function isActive(href: string) {
    return (
      (route.page === "home" && href === "#/") ||
      (route.page !== "home" && href === `#/${route.page}`)
    );
  }

  function closeMenu() {
    setMenuOpen(false);
  }

  function isDesktopLinkActive(categoryId: string, query?: string) {
    if (route.page !== "shop") return false;
    if (query) return activeCategory === categoryId && activeQuery === query;
    return activeCategory === categoryId && !activeQuery;
  }

  const activeDesktopMenu =
    desktopLinks.find((link) => link.id === activeMenu) ?? null;

  return (
    <header className="sticky top-0 z-50 border-b border-black/8 bg-white/95 backdrop-blur-xl">
      <div className="site-announcement-bar">
        FREE SHIPPING ON ORDERS ABOVE RS. 2500
      </div>

      <div
        className="relative mx-auto hidden min-h-[92px] max-w-[1700px] items-center gap-10 px-8 lg:flex xl:px-12"
        onMouseLeave={() => setActiveMenu(null)}
      >
        <a href="#/" className="site-wordmark shrink-0">
          AYLEEN
        </a>

        <nav className="site-desktop-nav" aria-label="Primary navigation">
          {desktopLinks.map((link) => (
            <button
              key={link.id}
              type="button"
              onMouseEnter={() => setActiveMenu(link.id)}
              onFocus={() => setActiveMenu(link.id)}
              onClick={() => onShopCategory(link.categoryId, link.query)}
              className={`site-nav-link-minimal ${
                isDesktopLinkActive(link.categoryId, link.query) ? "is-active" : ""
              }`}
            >
              {link.label}
            </button>
          ))}
          <a href="#/about" className="site-nav-link-minimal">
            ABOUT
          </a>
          <a href="#/contact" className="site-nav-link-minimal">
            CONTACT
          </a>
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <a
            href="#/shop"
            className="site-icon-link"
            aria-label="Search products"
          >
            <SearchIcon />
          </a>
          <a
            href="#/wishlist"
            className="site-icon-link"
            aria-label={`Wishlist, ${wishlistCount} items`}
          >
            <HeartIcon />
            {wishlistCount > 0 && (
              <span className="site-icon-badge">{wishlistCount}</span>
            )}
          </a>
          <a
            href="#/about"
            className="site-icon-link"
            aria-label="About Ayleen"
          >
            <UserIcon />
          </a>
          <button
            type="button"
            onClick={onOpenCart}
            className="site-icon-link"
            aria-label={`Open bag, ${cartCount} items`}
          >
            <BagIcon />
            {cartCount > 0 && <span className="site-icon-badge">{cartCount}</span>}
          </button>
        </div>

        {activeDesktopMenu && (
          <div className="site-mega-menu">
            <div className="site-mega-menu-grid">
              <div className="site-mega-list">
                {activeDesktopMenu.items.map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => onShopCategory(item.categoryId, item.query)}
                    className="site-mega-link"
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() =>
                  onShopCategory(
                    activeDesktopMenu.categoryId,
                    activeDesktopMenu.query,
                  )
                }
                className="site-mega-preview"
              >
                <img
                  src={activeDesktopMenu.hero}
                  alt={activeDesktopMenu.title}
                  className="site-mega-preview-image"
                />
                <div className="site-mega-preview-overlay" />
                <div className="site-mega-preview-copy">
                  <p className="site-mega-preview-label">{activeDesktopMenu.title}</p>
                  <span className="site-mega-preview-cta">SHOP NOW</span>
                </div>
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="mx-auto flex min-h-[78px] max-w-7xl items-center justify-between gap-3 px-4 lg:hidden sm:px-6">
        <a href="#/" className="site-wordmark text-[1.7rem] tracking-[0.16em]">
          AYLEEN
        </a>

        <div className="flex items-center gap-1.5">
          <a
            href="#/wishlist"
            className="site-mobile-icon"
            aria-label={`Wishlist, ${wishlistCount} items`}
          >
            <HeartIcon />
            {wishlistCount > 0 && (
              <span className="site-icon-badge">{wishlistCount}</span>
            )}
          </a>
          <button
            type="button"
            onClick={onOpenCart}
            className="site-mobile-icon"
            aria-label={`Open bag, ${cartCount} items`}
          >
            <BagIcon />
            {cartCount > 0 && <span className="site-icon-badge">{cartCount}</span>}
          </button>
          <button
            type="button"
            aria-label="Toggle menu"
            onClick={() => setMenuOpen((prev) => !prev)}
            className="site-mobile-icon"
          >
            <span className="space-y-1.5">
              <span className="block h-0.5 w-5 bg-[var(--ink)]" />
              <span className="block h-0.5 w-5 bg-[var(--ink)]" />
              <span className="block h-0.5 w-5 bg-[var(--ink)]" />
            </span>
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="border-t border-black/8 bg-white px-6 py-5 lg:hidden">
          <div className="grid gap-3 text-[11px] font-semibold tracking-[0.22em]">
            {desktopLinks.map((link) => (
              <button
                key={link.id}
                type="button"
                onClick={() => {
                  closeMenu();
                  onShopCategory(link.categoryId, link.query);
                }}
                className={`rounded-full border px-4 py-3 text-center transition-colors ${
                  isDesktopLinkActive(link.categoryId, link.query)
                    ? "border-[var(--ink)] bg-[var(--ink)] text-[var(--paper)]"
                    : "border-black/10 bg-white"
                }`}
              >
                {link.label}
              </button>
            ))}
            {navLinks
              .filter((link) => link.href !== "#/shop")
              .map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={closeMenu}
                  className={`rounded-full border px-4 py-3 text-center transition-colors ${
                    isActive(link.href)
                      ? "border-[var(--ink)] bg-[var(--ink)] text-[var(--paper)]"
                      : "border-black/10 bg-white"
                  }`}
                >
                  {link.label}
                </a>
              ))}
          </div>

          <div className="mt-4 grid gap-3 text-[11px] font-semibold tracking-[0.18em]">
            <a
              href="#/shop"
              onClick={closeMenu}
              className="rounded-full border border-black/10 bg-white px-4 py-3 text-center"
            >
              SEARCH PRODUCTS
            </a>
            <a
              href="#/wishlist"
              onClick={closeMenu}
              className="rounded-full border border-black/10 px-4 py-3 text-center"
            >
              SAVED {wishlistCount}
            </a>
            <button
              type="button"
              onClick={() => {
                closeMenu();
                onOpenCart();
              }}
              className="rounded-full border border-black/10 px-4 py-3 text-center"
            >
              BAG {cartCount}
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
