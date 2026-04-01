import { useState } from 'react';
import type { Route } from '../types/store';

type HeaderProps = {
  navLinks: { href: string; label: string }[];
  route: Route;
  wishlistCount: number;
  cartCount: number;
  onOpenCart: () => void;
};

export function Header({ navLinks, route, wishlistCount, cartCount, onOpenCart }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  function isActive(href: string) {
    return (
      (route.page === 'home' && href === '#/') ||
      (route.page !== 'home' && href === `#/${route.page}`)
    );
  }

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <header className="glass-shift sticky top-0 z-50 border-b border-[var(--line)] bg-[var(--panel)]/90 backdrop-blur-xl">
      <div className="bg-[var(--ink)] px-6 py-2 text-center text-[10px] tracking-[0.28em] text-[var(--champagne)] sm:text-xs">
        FREE SHIPPING ON ORDERS ABOVE PKR 6,000
      </div>

      <div className="mx-auto flex min-h-20 w-full max-w-7xl items-center justify-between gap-4 px-6 py-4">
        <a href="#/" className="font-editorial text-3xl font-semibold tracking-[0.24em]">
          AYLEEN
        </a>

        <nav className="hidden items-center gap-6 text-xs font-medium tracking-[0.22em] md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`transition hover:text-[var(--gold-deep)] ${isActive(link.href) ? 'text-[var(--gold-deep)]' : ''}`}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-2 text-[11px] font-medium tracking-[0.14em] sm:gap-3 md:flex">
          <a
            href="#/wishlist"
            className="rounded-full border border-[var(--line-strong)] px-3 py-2 hover:border-[var(--gold-deep)]"
          >
            WISHLIST ({wishlistCount})
          </a>
          <button
            type="button"
            onClick={onOpenCart}
            className="rounded-full border border-[var(--line-strong)] px-3 py-2 hover:border-[var(--gold-deep)]"
          >
            CART ({cartCount})
          </button>
          <a href="#/checkout" className="rounded-full bg-[var(--ink)] px-4 py-2 text-[var(--champagne)]">
            CHECKOUT
          </a>
        </div>

        <button
          type="button"
          aria-label="Toggle menu"
          onClick={() => setMenuOpen((prev) => !prev)}
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[var(--line-strong)] md:hidden"
        >
          <span className="space-y-1.5">
            <span className="block h-0.5 w-5 bg-[var(--ink)]" />
            <span className="block h-0.5 w-5 bg-[var(--ink)]" />
            <span className="block h-0.5 w-5 bg-[var(--ink)]" />
          </span>
        </button>
      </div>

      {menuOpen && (
        <div className="border-t border-[var(--line)] bg-[var(--paper)] px-6 py-5 md:hidden">
          <nav className="grid gap-3 text-xs font-semibold tracking-[0.22em]">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={closeMenu}
                className={`rounded-full border px-4 py-3 text-center ${
                  isActive(link.href)
                    ? 'border-[var(--ink)] bg-[var(--ink)] text-[var(--champagne)]'
                    : 'border-[var(--line-strong)]'
                }`}
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="mt-4 grid gap-3 text-xs font-semibold tracking-[0.18em]">
            <a
              href="#/wishlist"
              onClick={closeMenu}
              className="rounded-full border border-[var(--line-strong)] px-4 py-3 text-center"
            >
              WISHLIST ({wishlistCount})
            </a>
            <button
              type="button"
              onClick={() => {
                closeMenu();
                onOpenCart();
              }}
              className="rounded-full border border-[var(--line-strong)] px-4 py-3 text-center"
            >
              CART ({cartCount})
            </button>
            <a
              href="#/checkout"
              onClick={closeMenu}
              className="rounded-full bg-[var(--ink)] px-4 py-3 text-center text-[var(--champagne)]"
            >
              CHECKOUT
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
