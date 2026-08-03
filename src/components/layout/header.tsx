"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Heart, Menu, Search, ShoppingBag, UserRound, X } from "lucide-react";
import { Logo } from "@/components/common/logo";
import { SearchOverlay } from "@/components/search/search-overlay";
import { useStore } from "@/components/providers/store-provider";
import { siteConfig } from "@/config/site";

export function Header() {
  const { summary, wishlist, setDrawerOpen } = useStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <a
        href="#main-content"
        className="fixed top-4 left-4 z-[100] -translate-y-24 bg-white px-4 py-3 shadow focus:translate-y-0"
      >
        Skip to content
      </a>
      <p className="bg-[#171613] px-4 py-2 text-center text-[0.68rem] font-semibold tracking-[0.16em] text-white uppercase">
        {siteConfig.announcement}
      </p>
      <header
        className={`sticky top-0 z-50 border-b border-[#dedbd2] bg-white/95 backdrop-blur ${scrolled ? "shadow-[0_6px_20px_rgb(0_0_0/0.05)]" : ""}`}
      >
        <div className="container-site grid min-h-20 grid-cols-[1fr_auto_1fr] items-center">
          <nav
            aria-label="Primary navigation"
            className="hidden items-center gap-7 lg:flex"
          >
            {siteConfig.navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-xs font-semibold tracking-[0.12em] uppercase underline-offset-8 hover:underline"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            className="justify-self-start p-3 lg:hidden"
            aria-label="Open menu"
            aria-expanded={menuOpen}
          >
            <Menu size={22} />
          </button>
          <Logo />
          <div className="flex items-center justify-self-end">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="p-3"
              aria-label="Search"
            >
              <Search size={20} />
            </button>
            <Link
              href="/account"
              className="hidden p-3 sm:block"
              aria-label="Account"
            >
              <UserRound size={20} />
            </Link>
            <Link
              href="/wishlist"
              className="relative hidden p-3 sm:block"
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
              className="relative p-3"
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
      </header>

      {menuOpen ? (
        <div
          className="fixed inset-0 z-[65] bg-white lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation"
        >
          <div className="container-site flex min-h-20 items-center justify-between border-b border-[#dedbd2]">
            <Logo />
            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              className="p-3"
              aria-label="Close menu"
            >
              <X size={23} />
            </button>
          </div>
          <nav
            className="container-site py-10"
            aria-label="Mobile navigation links"
          >
            <ul className="divide-y divide-[#dedbd2]">
              {siteConfig.navigation.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className="serif block py-5 text-4xl"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-10 grid grid-cols-2 gap-3">
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
          </nav>
        </div>
      ) : null}
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
