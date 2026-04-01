import type { Route } from '../types/store';

type HeaderProps = {
  navLinks: { href: string; label: string }[];
  route: Route;
  wishlistCount: number;
  cartCount: number;
};

export function Header({ navLinks, route, wishlistCount, cartCount }: HeaderProps) {
  return (
    <header className="glass-shift sticky top-0 z-50 border-b border-[var(--line)] bg-[var(--panel)]/85 backdrop-blur-xl">
      <div className="bg-[var(--ink)] px-6 py-2 text-center text-xs tracking-[0.25em] text-[var(--champagne)]">
        FREE SHIPPING ON ORDERS ABOVE PKR 6,000
      </div>

      <div className="mx-auto flex min-h-20 w-full max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-4">
        <a href="#/" className="font-editorial text-3xl font-semibold tracking-[0.24em]">
          AYLEEN
        </a>

        <nav className="hidden items-center gap-6 text-xs font-medium tracking-[0.22em] md:flex">
          {navLinks.map((link) => {
            const active =
              (route.page === 'home' && link.href === '#/') ||
              (route.page !== 'home' && link.href === `#/${route.page}`);

            return (
              <a
                key={link.href}
                href={link.href}
                className={`transition hover:text-[var(--gold-deep)] ${active ? 'text-[var(--gold-deep)]' : ''}`}
              >
                {link.label}
              </a>
            );
          })}
        </nav>

        <div className="flex items-center gap-2 text-[11px] font-medium tracking-[0.14em] sm:gap-3">
          <a
            href="#/wishlist"
            className="rounded-full border border-[var(--line-strong)] px-3 py-2 hover:border-[var(--gold-deep)]"
          >
            WISHLIST ({wishlistCount})
          </a>
          <a
            href="#/cart"
            className="rounded-full border border-[var(--line-strong)] px-3 py-2 hover:border-[var(--gold-deep)]"
          >
            CART ({cartCount})
          </a>
          <a href="#/checkout" className="rounded-full bg-[var(--ink)] px-4 py-2 text-[var(--champagne)]">
            CHECKOUT
          </a>
        </div>
      </div>
    </header>
  );
}
