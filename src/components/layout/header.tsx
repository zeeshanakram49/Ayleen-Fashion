"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BadgePercent,
  Heart,
  Layers3,
  MapPin,
  Menu,
  Search,
  Shirt,
  ShoppingBag,
  Store,
  UserRound,
  X,
} from "lucide-react";
import { Logo } from "@/components/common/logo";
import { SearchOverlay } from "@/components/search/search-overlay";
import { useStore } from "@/components/providers/store-provider";
import { siteConfig } from "@/config/site";

type MenuCategory = {
  id: string;
  slug: string;
  name: string;
};

const mobileNavIcons = [Shirt, Store, Layers3, BadgePercent, MapPin];

export function Header({ categories }: { categories: MenuCategory[] }) {
  const pathname = usePathname();
  const { summary, wishlist, setDrawerOpen } = useStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const isHomepage = pathname === "/";
  const transparent = isHomepage && !scrolled;
  const floating = isHomepage && scrolled;
  const iconButtonClass = `relative z-10 grid size-11 touch-manipulation place-items-center rounded-full transition duration-200 ${
    transparent
      ? "hover:bg-black/10 focus-visible:bg-black/10"
      : "hover:bg-[#efede7] focus-visible:bg-[#efede7]"
  }`;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen]);

  return (
    <>
      <a
        href="#main-content"
        className="fixed top-4 left-4 z-[100] -translate-y-24 bg-white px-4 py-3 shadow focus:translate-y-0"
      >
        Skip to content
      </a>
      <p
        className={`${isHomepage ? "absolute inset-x-0 top-0 z-[51] bg-transparent drop-shadow-[0_1px_3px_rgb(0_0_0/0.9)] max-md:relative max-md:bg-[#f7f5f0] max-md:text-[#24271f] max-md:drop-shadow-none" : "bg-[#171613]"} pointer-events-none px-2 py-2 text-center text-[0.55rem] leading-[1.35] font-semibold tracking-[0.13em] text-white uppercase sm:px-4 sm:text-[0.65rem] sm:tracking-[0.2em]`}
      >
        {siteConfig.announcement}
      </p>
      <header
        className={`${
          transparent
            ? "absolute inset-x-0 top-[28px] z-[60] bg-transparent text-[#24271f] drop-shadow-[0_1px_1px_rgb(255_255_255/0.9)] max-md:relative max-md:top-0 max-md:bg-[#fffefb] max-md:drop-shadow-none max-md:shadow-[0_1px_0_rgb(23_22_19/0.1)] sm:top-[30px]"
            : floating
              ? "fixed inset-x-0 top-0 z-[60] py-3 text-[#171613]"
              : `sticky top-0 z-[60] bg-white/90 text-[#171613] backdrop-blur-xl ${scrolled ? "shadow-[0_8px_30px_rgb(0_0_0/0.06)]" : "shadow-[0_1px_0_rgb(23_22_19/0.08)]"}`
        } pointer-events-auto isolate touch-manipulation transition-colors duration-300`}
      >
        <div
          className={`container-site pointer-events-auto relative z-[1] transition-all duration-300 ${
            floating
              ? "rounded-[1.5rem] bg-white/95 px-3 shadow-[0_14px_45px_rgb(0_0_0/0.14)] ring-1 ring-black/5 backdrop-blur-xl md:px-5 xl:rounded-full"
              : ""
          }`}
        >
          <div
            className={`grid grid-cols-[auto_1fr_auto] items-center ${floating ? "min-h-14 xl:min-h-16" : "min-h-16 sm:min-h-20"}`}
          >
            <div className="flex items-center gap-3 justify-self-start md:gap-4">
              <button
                type="button"
                onClick={() => setMenuOpen(true)}
                className={`${iconButtonClass} shrink-0`}
                aria-label="Open menu"
                aria-expanded={menuOpen}
              >
                <Menu size={24} />
              </button>
              <span className="hidden md:inline-flex">
                <Logo prominent />
              </span>
            </div>
            <div className="justify-self-center">
              <span className="md:hidden">
                <Logo />
              </span>
              <nav
                aria-label="Primary navigation"
                className="hidden items-center gap-7 xl:flex"
              >
                {siteConfig.navigation.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="py-2 text-[0.78rem] font-semibold tracking-[0.1em] uppercase opacity-85 transition hover:opacity-100"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>
            <div className="flex items-center justify-self-end">
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                className={iconButtonClass}
                aria-label="Search"
              >
                <Search size={20} />
              </button>
              <Link
                href="/account"
                className={`${iconButtonClass} hidden sm:grid`}
                aria-label="Account"
              >
                <UserRound size={20} />
              </Link>
              <Link
                href="/wishlist"
                className={`${iconButtonClass} relative hidden sm:grid`}
                aria-label={`Wishlist with ${wishlist.length} items`}
              >
                <Heart size={20} />
                {wishlist.length ? (
                  <span className="absolute top-1.5 right-1.5 min-w-4 rounded-full bg-[#6f2d24] px-1 text-center text-[0.6rem] text-white">
                    {wishlist.length}
                  </span>
                ) : null}
              </Link>
              <button
                type="button"
                onClick={() => setDrawerOpen(true)}
                className={`${iconButtonClass} relative`}
                aria-label={`Shopping bag with ${summary.itemCount} items`}
              >
                <ShoppingBag size={20} />
                {summary.itemCount ? (
                  <span className="absolute top-1.5 right-1.5 min-w-4 rounded-full bg-[#6f2d24] px-1 text-center text-[0.6rem] text-white">
                    {summary.itemCount}
                  </span>
                ) : null}
              </button>
            </div>
          </div>

          <nav
            aria-label="Mobile primary navigation"
            className="pointer-events-auto hidden touch-pan-x overflow-x-auto pb-2 sm:pb-3 md:block xl:hidden"
          >
            <div className="flex min-w-max items-center gap-4 px-1 sm:gap-5">
              {siteConfig.navigation.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="touch-manipulation py-2 text-[0.72rem] font-bold tracking-[0.09em] uppercase opacity-90"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </nav>
        </div>
      </header>

      {menuOpen ? (
        <div
          className="menu-reveal fixed inset-0 z-[90] flex min-h-[100dvh] flex-col overflow-y-auto bg-white"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation"
        >
          <div className="container-site grid min-h-20 grid-cols-[1fr_auto_1fr] items-center border-b border-[#dedbd2] md:min-h-24">
            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              className="-ml-3 justify-self-start p-3"
              aria-label="Close menu"
            >
              <X size={28} strokeWidth={1.5} />
            </button>
            <Logo />
            <p className="eyebrow hidden justify-self-end md:block">Menu</p>
          </div>
          <div className="container-site grid flex-1 gap-9 py-8 md:gap-14 md:py-16 lg:grid-cols-[minmax(240px,0.65fr)_minmax(0,1.35fr)] lg:gap-20">
            <nav aria-label="Menu navigation links">
              <p className="eyebrow mb-5">Explore</p>
              <ul className="divide-y divide-[#dedbd2] border-y border-[#dedbd2]">
                {siteConfig.navigation.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center justify-between py-3.5 text-lg font-semibold tracking-[-0.02em] uppercase transition hover:pl-2 hover:text-[#6f2d24] md:py-4 md:text-2xl"
                    >
                      {item.label}
                      <span aria-hidden className="text-base font-normal">
                        ↗
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <nav aria-label="Shop by categories">
              <p className="eyebrow mb-5">Shop by categories</p>
              <ul className="grid border-t border-[#dedbd2] sm:grid-cols-2">
                <li className="border-b border-[#dedbd2] sm:odd:pr-5 sm:even:pl-5">
                  <Link
                    href="/shop"
                    onClick={() => setMenuOpen(false)}
                    className="block py-3.5 text-lg uppercase transition hover:pl-2 hover:text-[#6f2d24] md:py-4 md:text-2xl"
                  >
                    View all
                  </Link>
                </li>
                {categories.map((category) => (
                  <li
                    key={category.id}
                    className="border-b border-[#dedbd2] sm:odd:pr-5 sm:even:pl-5"
                  >
                    <Link
                      href={`/categories/${category.slug}`}
                      onClick={() => setMenuOpen(false)}
                      className="block py-3.5 text-lg uppercase transition hover:pl-2 hover:text-[#6f2d24] md:py-4 md:text-2xl"
                    >
                      {category.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <div className="container-site grid grid-cols-2 gap-3 border-t border-[#dedbd2] py-6 md:ml-auto md:max-w-md">
            <Link
              href="/account"
              onClick={() => setMenuOpen(false)}
              className="button-secondary"
            >
              Account
            </Link>
            <Link
              href="/wishlist"
              onClick={() => setMenuOpen(false)}
              className="button-secondary"
            >
              Wishlist
            </Link>
          </div>
        </div>
      ) : null}
      <nav
        aria-label="Mobile quick navigation"
        className="fixed inset-x-0 bottom-0 z-[70] grid grid-cols-5 border-t border-black/10 bg-white/95 pt-2 pb-[calc(0.35rem+env(safe-area-inset-bottom))] shadow-[0_-10px_30px_rgb(0_0_0/0.08)] backdrop-blur-xl md:hidden"
      >
        {siteConfig.navigation.map((item, index) => {
          const Icon = mobileNavIcons[index] ?? Store;
          const active =
            pathname === item.href &&
            (item.href !== "/shop" || item.label === "Shop");

          return (
            <Link
              key={item.label}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={`relative flex min-w-0 flex-col items-center justify-center gap-0.5 px-1 py-1 text-[0.56rem] leading-tight font-semibold tracking-[0.04em] uppercase transition-colors ${
                active ? "text-[#6f2d24]" : "text-[#4f4c45]"
              }`}
            >
              {active ? (
                <span className="absolute -top-2 h-0.5 w-8 rounded-full bg-[#6f2d24]" />
              ) : null}
              <Icon size={19} strokeWidth={active ? 2 : 1.7} />
              <span className="max-w-full truncate">{item.label}</span>
            </Link>
          );
        })}
      </nav>
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
