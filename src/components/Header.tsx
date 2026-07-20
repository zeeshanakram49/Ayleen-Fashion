import { useEffect, useRef, useState, type WheelEvent } from "react";
import { ImageWithFallback } from "./ImageWithFallback";
import type { Category, Route } from "../types/store";
import { APP_ROUTES } from "../routes/appRoutes";
import { getHashUrl } from "../routes/routeUtils";

type HeaderProps = {
  navLinks: { href: string; label: string }[];
  route: Route;
  activeCategory: string;
  activeQuery: string;
  wishlistCount: number;
  cartCount: number;
  categories: Category[];
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
  title: string;
  items: MegaMenuItem[];
};

const staticDesktopLinks: DesktopLink[] = [
  {
    id: "sale",
    label: "SALE",
    categoryId: "all",
    query: "sale",
    title: "SALE",
    items: [
      { label: "SHOP ALL SALE", categoryId: "all", query: "sale" },
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
  categories,
  onOpenCart,
  onShopCategory,
}: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const closeMenuTimer = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (closeMenuTimer.current !== null) {
        window.clearTimeout(closeMenuTimer.current);
      }
    };
  }, []);

  function isActive(href: string) {
    const page = href.replace(/^#/, "");
    if (route.page === "home") return page === "/" || page === "";
    return page === `/${route.page}`;
  }

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
      : [{ label: "SHOP ALL", categoryId: "all" }];
  const menMenu: DesktopLink = {
    id: "men",
    label: "MEN",
    categoryId: menCategories[0]?.id ?? "all",
    title: "MEN",
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

  return (
    <header
      className={`site-header sticky top-0 z-50 border-b border-black/8 bg-white/95 backdrop-blur-xl ${
        route.page === "home" ? "site-header-home" : ""
      }`}
    >
      <div className="site-announcement-bar">
        FREE SHIPPING ON ORDERS ABOVE RS. 2,500
      </div>

      <div
        className="relative mx-auto hidden min-h-[84px] max-w-[1700px] items-center gap-8 px-8 lg:flex xl:px-12"
        onMouseEnter={clearDesktopMenuClose}
        onMouseLeave={closeDesktopMenuSoon}
      >
        <a href={getHashUrl(APP_ROUTES.home)} className="site-wordmark shrink-0">
          Aylee
        </a>

        <nav className="site-desktop-nav" aria-label="Primary navigation">
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
              className={`site-nav-link-minimal ${
                (link.id === "men"
                  ? menMenuIsActive
                  : isDesktopLinkActive(link.categoryId, link.query))
                  ? "is-active"
                  : ""
              }`}
            >
              {link.label}
            </button>
          ))}
          <a
            href={getHashUrl(APP_ROUTES.about)}
            onMouseEnter={closeDesktopMenuNow}
            className="site-nav-link-minimal"
          >
            STORES
          </a>
          <a
            href={getHashUrl(APP_ROUTES.contact)}
            onMouseEnter={closeDesktopMenuNow}
            className="site-nav-link-minimal"
          >
            CONTACT
          </a>
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <a
            href={getHashUrl(APP_ROUTES.shop)}
            className="site-icon-link"
            aria-label="Search products"
          >
            <SearchIcon />
          </a>
          <a
            href={getHashUrl(APP_ROUTES.wishlist)}
            className="site-icon-link"
            aria-label={`Wishlist, ${wishlistCount} items`}
          >
            <HeartIcon />
            {wishlistCount > 0 && (
              <span className="site-icon-badge">{wishlistCount}</span>
            )}
          </a>
          <a
            href={getHashUrl(APP_ROUTES.account)}
            className="site-icon-link"
            aria-label="Account login and sign up"
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
          <div
            className="site-mega-menu"
            onMouseEnter={clearDesktopMenuClose}
            onMouseLeave={closeDesktopMenuSoon}
            onWheel={keepMegaMenuScroll}
          >
            <div className="site-mega-menu-grid">
              <div className="site-mega-list">
                {activeDesktopMenu.items.map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => {
                      closeDesktopMenuNow();
                      onShopCategory(item.categoryId, item.query);
                    }}
                    className="site-mega-link"
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => {
                  closeDesktopMenuNow();
                  onShopCategory(
                    activeDesktopMenu.categoryId,
                    activeDesktopMenu.query,
                  );
                }}
                className="site-mega-preview"
              >
                <ImageWithFallback
                  src={activeDesktopCategory?.image}
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

      <div className="mx-auto flex min-h-[72px] max-w-7xl items-center justify-between gap-3 px-4 lg:hidden sm:px-6">
        <a
          href={getHashUrl(APP_ROUTES.home)}
          className="site-wordmark text-[1.55rem]"
          aria-label="Aylee home"
        >
          Aylee
        </a>

        <div className="flex items-center gap-1.5">
          <a
            href={getHashUrl(APP_ROUTES.wishlist)}
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
              <span className="site-menu-bar block h-0.5 w-5" />
              <span className="site-menu-bar block h-0.5 w-5" />
              <span className="site-menu-bar block h-0.5 w-5" />
            </span>
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="border-t border-black/8 bg-white/98 px-4 py-4 shadow-[0_24px_50px_-40px_rgba(0,0,0,0.5)] backdrop-blur lg:hidden sm:px-6">
          <div className="grid gap-2 text-[11px] font-semibold tracking-[0.18em] sm:grid-cols-2">
            {menCategories.map((category) => (
              <button
                key={category.id}
                type="button"
                onClick={() => {
                  closeMenu();
                  onShopCategory(category.id);
                }}
                className={`rounded-[var(--radius-sm)] border px-4 py-3 text-center transition-colors ${
                  isDesktopLinkActive(category.id)
                    ? "border-[var(--ink)] bg-[var(--ink)] text-[var(--paper)]"
                    : "border-black/10 bg-white"
                }`}
              >
                {category.name}
              </button>
            ))}
            {staticDesktopLinks.map((link) => (
              <button
                key={link.id}
                type="button"
                onClick={() => {
                  closeMenu();
                  onShopCategory(link.categoryId, link.query);
                }}
                className={`rounded-[var(--radius-sm)] border px-4 py-3 text-center transition-colors ${
                  isDesktopLinkActive(link.categoryId, link.query)
                    ? "border-[var(--ink)] bg-[var(--ink)] text-[var(--paper)]"
                    : "border-black/10 bg-white"
                }`}
              >
                {link.label}
              </button>
            ))}
            {navLinks
              .filter((link) => link.href !== getHashUrl(APP_ROUTES.shop))
              .map((link) => {
                const cleanHref =
                  link.href === getHashUrl(APP_ROUTES.home)
                    ? APP_ROUTES.home
                    : link.href.replace(/^#/, "");
                return (
                  <a
                    key={link.href}
                    href={getHashUrl(cleanHref)}
                    onClick={closeMenu}
                    className={`rounded-[var(--radius-sm)] border px-4 py-3 text-center transition-colors ${
                      isActive(link.href)
                        ? "border-[var(--ink)] bg-[var(--ink)] text-[var(--paper)]"
                        : "border-black/10 bg-white"
                    }`}
                  >
                    {link.label}
                  </a>
                );
              })}
          </div>

          <div className="mt-3 grid gap-2 text-[11px] font-semibold tracking-[0.16em] sm:grid-cols-2">
            <a
              href={getHashUrl(APP_ROUTES.shop)}
              onClick={closeMenu}
              className="rounded-[var(--radius-sm)] border border-black/10 bg-white px-4 py-3 text-center"
            >
              SEARCH PRODUCTS
            </a>
            <a
              href={getHashUrl(APP_ROUTES.account)}
              onClick={closeMenu}
              className="rounded-[var(--radius-sm)] border border-black/10 px-4 py-3 text-center"
            >
              LOGIN / SIGN UP
            </a>
            <a
              href={getHashUrl(APP_ROUTES.wishlist)}
              onClick={closeMenu}
              className="rounded-[var(--radius-sm)] border border-black/10 px-4 py-3 text-center"
            >
              SAVED {wishlistCount}
            </a>
            <button
              type="button"
              onClick={() => {
                closeMenu();
                onOpenCart();
              }}
              className="rounded-[var(--radius-sm)] border border-black/10 px-4 py-3 text-center"
            >
              BAG {cartCount}
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
