import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  IoSearchOutline,
  IoHeartOutline,
  IoBagOutline,
  IoPersonOutline,
  IoMenuOutline,
  IoCloseOutline,
} from "react-icons/io5";
import { SearchOverlay } from "./SearchOverlay";
import type { Route } from "../types/store";

type HeaderProps = {
  route: Route;
  activeCategory: string;
  activeQuery: string;
  wishlistCount: number;
  cartCount: number;
  onOpenCart: () => void;
  onShopCategory: (categoryId: string, query?: string) => void;
};

type MegaItem = { label: string; categoryId: string; query?: string };

type NavLink = {
  id: string;
  label: string;
  categoryId: string;
  query?: string;
  sale?: boolean;
  mega?: {
    cols: { title: string; items: MegaItem[] }[];
  };
};

const navLinks: NavLink[] = [
  {
    id: "men",
    label: "MEN",
    categoryId: "men",
    mega: {
      cols: [
        {
          title: "",
          items: [
            { label: "New In", categoryId: "men", query: "new-in" },
            { label: "Summer Sale Upto 50% Off", categoryId: "men", query: "sale" },
          ],
        },
        {
          title: "Shop by Categories",
          items: [
            { label: "View All", categoryId: "men" },
            { label: "T-Shirts", categoryId: "men", query: "tshirt" },
            { label: "Polos", categoryId: "men", query: "polo" },
            { label: "Shirts", categoryId: "men", query: "shirt" },
            { label: "Activewear", categoryId: "men", query: "active" },
            { label: "Trousers", categoryId: "men", query: "trouser" },
            { label: "Shorts", categoryId: "men", query: "short" },
            { label: "Jeans", categoryId: "men", query: "denim" },
            { label: "Footwear", categoryId: "men", query: "footwear" },
            { label: "Accessories", categoryId: "men", query: "accessories" },
          ],
        },
        {
          title: "Shop by Collection",
          items: [
            { label: "Essentials", categoryId: "men", query: "essentials" },
            { label: "Knit Collection", categoryId: "men", query: "knit" },
            { label: "Summer Edit", categoryId: "men", query: "summer" },
          ],
        },
      ],
    },
  },
  {
    id: "women",
    label: "WOMEN",
    categoryId: "women",
    mega: {
      cols: [
        {
          title: "",
          items: [
            { label: "New In", categoryId: "women", query: "new-in" },
            { label: "Summer Sale Upto 50% Off", categoryId: "women", query: "sale" },
          ],
        },
        {
          title: "Shop by Categories",
          items: [
            { label: "View All", categoryId: "women" },
            { label: "Tops", categoryId: "women", query: "top" },
            { label: "Co-Ords", categoryId: "women", query: "silk" },
            { label: "Abayas", categoryId: "women", query: "abaya" },
            { label: "Dresses", categoryId: "women", query: "dress" },
            { label: "Trousers", categoryId: "women", query: "trouser" },
            { label: "Activewear", categoryId: "women", query: "active" },
            { label: "Accessories", categoryId: "women", query: "accessories" },
          ],
        },
        {
          title: "Shop by Collection",
          items: [
            { label: "Silk Edit", categoryId: "women", query: "silk" },
            { label: "Linen Blend", categoryId: "women", query: "linen" },
            { label: "Summer Resort", categoryId: "women", query: "summer" },
          ],
        },
      ],
    },
  },
  {
    id: "juniors",
    label: "KIDS",
    categoryId: "juniors",
    mega: {
      cols: [
        {
          title: "Shop by Categories",
          items: [
            { label: "View All Kids", categoryId: "juniors" },
            { label: "T-Shirts", categoryId: "juniors", query: "tshirt" },
            { label: "Shorts", categoryId: "juniors", query: "short" },
            { label: "Sets", categoryId: "juniors", query: "set" },
            { label: "Accessories", categoryId: "juniors", query: "accessories" },
          ],
        },
      ],
    },
  },
  {
    id: "new-arrivals",
    label: "NEW ARRIVALS",
    categoryId: "all",
    query: "new-in",
  },
  {
    id: "sale",
    label: "SALE",
    categoryId: "all",
    query: "sale",
    sale: true,
    mega: {
      cols: [
        {
          title: "SALE",
          items: [
            { label: "Shop All Sale", categoryId: "all", query: "sale" },
            { label: "Men's Sale", categoryId: "men", query: "sale" },
            { label: "Women's Sale", categoryId: "women", query: "sale" },
            { label: "Kids' Sale", categoryId: "juniors", query: "sale" },
          ],
        },
      ],
    },
  },
];

export function Header({
  route,
  activeCategory,
  activeQuery,
  wishlistCount,
  cartCount,
  onOpenCart,
  onShopCategory,
}: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const hoverTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handler = () => setIsScrolled(window.scrollY > 80);
    handler(); // run on mount
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen || searchOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen, searchOpen]);

  const openMega = (id: string) => {
    if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
    setOpenMenu(id);
  };
  const closeMega = () => {
    hoverTimerRef.current = setTimeout(() => setOpenMenu(null), 80);
  };
  const stayOpen = () => {
    if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
  };

  const isActive = (link: NavLink) => {
    if (route.page === link.id) return true;
    if (link.query && activeQuery === link.query) return true;
    if (!link.query && activeCategory === link.categoryId && link.id !== "sale") return true;
    return false;
  };

  return (
    <>
      {/* ── ANNOUNCEMENT BAR ── */}
      <div className="ot-announce-bar">
        <div className="animate-marquee-infinite">
          {["FREE SHIPPING ON ORDERS OVER RS. 3,000", "SUMMER SALE — UPTO 50% OFF", "EASY RETURNS WITHIN 7 DAYS", "SHOP MEN · WOMEN · KIDS"].concat(
            ["FREE SHIPPING ON ORDERS OVER RS. 3,000", "SUMMER SALE — UPTO 50% OFF", "EASY RETURNS WITHIN 7 DAYS", "SHOP MEN · WOMEN · KIDS"]
          ).map((item, i) => (
            <span key={i} className="ot-announce-item">
              {item}
              <span className="ot-announce-dot">★</span>
            </span>
          ))}
        </div>
      </div>

      {/* ── MAIN HEADER ── */}
      <header className={`ot-header ${isScrolled ? "ot-header--solid" : "ot-header--transparent"}`}>
        <div className="ot-header-inner">

          {/* LOGO */}
          <a href="#/" className={`ot-logo ${isScrolled ? "" : "ot-logo--light"}`} onClick={(e) => { e.preventDefault(); onShopCategory("all"); }}>
            AYLEEN
          </a>

          {/* DESKTOP NAV */}
          <nav className={`ot-desktop-nav ${!isScrolled ? "ot-desktop-nav--light" : ""}`}>
            {navLinks.map((link) => (
              <div
                key={link.id}
                className="ot-nav-item"
                onMouseEnter={() => link.mega && openMega(link.id)}
                onMouseLeave={() => link.mega && closeMega()}
              >
                <button
                  onClick={() => onShopCategory(link.categoryId, link.query)}
                  className={`ot-nav-link ${isActive(link) ? "ot-nav-link--active" : ""} ${link.sale ? "ot-nav-link--sale" : ""}`}
                >
                  {link.label}
                </button>

                {/* Mega Menu */}
                {link.mega && (
                  <AnimatePresence>
                    {openMenu === link.id && (
                      <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.22, ease: "easeOut" }}
                        className="ot-mega"
                        onMouseEnter={stayOpen}
                        onMouseLeave={closeMega}
                      >
                        <div className="ot-mega-inner">
                          {link.mega.cols.map((col, ci) => (
                            <div key={ci} className="ot-mega-col">
                              {col.title && (
                                <p className="ot-mega-col-title">{col.title}</p>
                              )}
                              <ul className="ot-mega-list">
                                {col.items.map((item, ii) => (
                                  <li key={ii}>
                                    <button
                                      onClick={() => {
                                        onShopCategory(item.categoryId, item.query);
                                        setOpenMenu(null);
                                      }}
                                      className={`ot-mega-link ${
                                        ci === 0 && ii === 1 ? "ot-mega-link--sale" : ""
                                      }`}
                                    >
                                      {item.label}
                                    </button>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </div>
            ))}
          </nav>

          {/* ICONS */}
          <div className={`ot-header-icons ${!isScrolled ? "ot-header-icons--light" : ""}`}>
            <button
              className="ot-icon-btn"
              aria-label="Search"
              onClick={() => setSearchOpen(true)}
            >
              <IoSearchOutline size={21} />
            </button>
            <a href="#/account" className="ot-icon-btn" aria-label="Account">
              <IoPersonOutline size={21} />
            </a>
            <a href="#/wishlist" className="ot-icon-btn ot-icon-btn--badge" aria-label="Wishlist" data-count={wishlistCount || undefined}>
              <IoHeartOutline size={21} />
              {wishlistCount > 0 && <span className="ot-badge">{wishlistCount}</span>}
            </a>
            <button
              className="ot-icon-btn ot-icon-btn--badge"
              aria-label="Cart"
              onClick={onOpenCart}
            >
              <IoBagOutline size={21} />
              {cartCount > 0 && <span className="ot-badge">{cartCount}</span>}
            </button>
            <button
              className="ot-icon-btn ot-mobile-menu-btn"
              aria-label="Menu"
              onClick={() => setMobileOpen(true)}
            >
              <IoMenuOutline size={24} />
            </button>
          </div>
        </div>
      </header>

      {/* ── MOBILE DRAWER ── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="ot-mobile-backdrop"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
              className="ot-mobile-drawer"
            >
              {/* Drawer Header */}
              <div className="ot-drawer-head">
                <span className="ot-logo">AYLEEN</span>
                <button onClick={() => setMobileOpen(false)} className="ot-icon-btn">
                  <IoCloseOutline size={24} />
                </button>
              </div>

              {/* Links */}
              <nav className="ot-drawer-nav">
                {navLinks.map((link) => (
                  <div key={link.id} className="ot-drawer-item">
                    <button
                      className={`ot-drawer-link ${link.sale ? "ot-drawer-link--sale" : ""}`}
                      onClick={() => {
                        if (link.mega) {
                          setMobileExpanded(mobileExpanded === link.id ? null : link.id);
                        } else {
                          onShopCategory(link.categoryId, link.query);
                          setMobileOpen(false);
                        }
                      }}
                    >
                      <span>{link.label}</span>
                      {link.mega && (
                        <span className={`ot-drawer-chevron ${mobileExpanded === link.id ? "ot-drawer-chevron--open" : ""}`}>
                          +
                        </span>
                      )}
                    </button>

                    {/* Sub-links */}
                    <AnimatePresence>
                      {link.mega && mobileExpanded === link.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.28 }}
                          className="overflow-hidden"
                        >
                          {link.mega.cols.flatMap((col) => col.items).map((item, ii) => (
                            <button
                              key={ii}
                              onClick={() => {
                                onShopCategory(item.categoryId, item.query);
                                setMobileOpen(false);
                              }}
                              className="ot-drawer-sublink"
                            >
                              {item.label}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </nav>

              {/* Footer Links */}
              <div className="ot-drawer-footer">
                <a href="#/account" onClick={() => setMobileOpen(false)} className="ot-drawer-foot-link">
                  <IoPersonOutline size={18} /> Account
                </a>
                <a href="#/wishlist" onClick={() => setMobileOpen(false)} className="ot-drawer-foot-link">
                  <IoHeartOutline size={18} /> Wishlist {wishlistCount > 0 && `(${wishlistCount})`}
                </a>
                <a href="#/track-order" onClick={() => setMobileOpen(false)} className="ot-drawer-foot-link">
                  Track Order
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── SEARCH OVERLAY ── */}
      <SearchOverlay
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        onOpenProduct={(slug) => {
          setSearchOpen(false);
          window.location.hash = `/product/${slug}`;
        }}
      />
    </>
  );
}
