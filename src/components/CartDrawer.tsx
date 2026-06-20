import { useEffect, useRef } from 'react';
import { installmentAmount, money } from '../lib/store';
import type { CartRow } from '../types/store';

type CartDrawerProps = {
  open: boolean;
  latestItem: CartRow | null;
  cartCount: number;
  subtotal: number;
  onClose: () => void;
};

const FREE_SHIPPING_THRESHOLD = 6000;

export function CartDrawer({ open, latestItem, cartCount, subtotal, onClose }: CartDrawerProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Lock body scroll + close on Escape while the drawer is open, and
  // send focus to the close button so keyboard/screen-reader users land
  // somewhere sensible the moment it opens.
  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, onClose]);

  const remainingForFreeShipping = Math.max(FREE_SHIPPING_THRESHOLD - subtotal, 0);
  const shippingProgress = Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100);

  return (
    <>
      <div
        aria-hidden={!open}
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-black/42 backdrop-blur-[2px] transition-opacity duration-300 ${
          open ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-drawer-heading"
        aria-hidden={!open}
        className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col border-l border-[var(--line)] bg-[var(--paper)] p-5 shadow-[0_30px_90px_-40px_rgba(0,0,0,0.55)] transition-transform duration-300 ease-out sm:p-6 ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs tracking-[0.26em] text-[var(--gold-deep)]">ADDED TO BASKET</p>
            <h2 id="cart-drawer-heading" className="font-editorial mt-2 text-3xl">
              Your Cart Preview
            </h2>
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="Close cart preview"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[var(--line-strong)] text-[var(--ink)] transition hover:border-[var(--ink)] hover:bg-[var(--panel)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ink)]"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M1 1L13 13M13 1L1 13" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Scrollable middle section — header and footer stay pinned even if the
            order summary grows (longer titles, wrapped text, smaller screens). */}
        <div className="mt-2 flex-1 overflow-y-auto -mr-1 pr-1">
          {latestItem ? (
            <article className="mt-4 rounded-[var(--radius-lg)] border border-[var(--line)] bg-[var(--panel)] p-4">
              <div className="grid gap-4 sm:grid-cols-[116px_1fr]">
                <div className="h-32 w-full overflow-hidden rounded-[var(--radius-md)] bg-[var(--line)]">
                  <img
                    src={latestItem.product.image}
                    alt={latestItem.product.title}
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <p className="text-[10px] tracking-[0.22em] text-[var(--gold-deep)]">
                    {latestItem.product.fit} · {latestItem.product.categoryLabel}
                  </p>
                  <h3 className="font-editorial mt-2 text-2xl leading-tight sm:text-3xl">
                    {latestItem.product.title}
                  </h3>
                  <p className="mt-2 text-xs tracking-[0.16em] text-[var(--muted)]">
                    SIZE {latestItem.size} · QTY {latestItem.qty}
                  </p>
                  <p className="mt-3 text-sm font-semibold">{money(latestItem.product.price * latestItem.qty)}</p>
                  <p className="mt-1 text-xs text-[var(--muted)]">
                    Pay in 3 installments of {money(installmentAmount(latestItem.product.price))}
                  </p>
                </div>
              </div>
            </article>
          ) : (
            <div className="mt-4 flex flex-col items-center gap-3 rounded-[var(--radius-lg)] border border-dashed border-[var(--line-strong)] p-8 text-center">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="text-[var(--muted)]" aria-hidden="true">
                <path d="M6 8h12l-1 12H7L6 8Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
                <path d="M9 8V6a3 3 0 0 1 6 0v2" stroke="currentColor" strokeWidth="1.4" />
              </svg>
              <p className="text-sm text-[var(--muted)]">Your bag preview will appear here after you add an item.</p>
            </div>
          )}

          <div className="mt-6 rounded-[var(--radius-lg)] border border-[var(--line)] bg-white p-5">
            <div className="flex justify-between text-sm font-medium">
              <span>
                {cartCount} {cartCount === 1 ? 'item' : 'items'} in bag
              </span>
              <span>{money(subtotal)}</span>
            </div>

            <div className="mt-4">
              {remainingForFreeShipping > 0 ? (
                <p className="text-xs leading-6 text-[var(--muted)]">
                  Add {money(remainingForFreeShipping)} more for free shipping
                </p>
              ) : (
                <p className="text-xs leading-6 text-[var(--gold-deep)]">You&apos;ve unlocked free shipping</p>
              )}
              <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-[var(--line)]">
                <div
                  className="h-full rounded-full bg-[var(--ink)] transition-[width] duration-500 ease-out"
                  style={{ width: `${shippingProgress}%` }}
                />
              </div>
            </div>

            <p className="mt-4 text-xs leading-6 text-[var(--muted)]">All orders may take 3 to 5 working days.</p>
          </div>
        </div>

        <div className="mt-4 grid gap-3 border-t border-[var(--line)] pt-6 text-xs tracking-[0.18em]">
          {/* Inline color/background here is intentional, not an oversight: a global
              `a { color: ... }` rule in this project sits later in the cascade than
              Tailwind's utility classes and was overriding text-white, which is why
              CHECKOUT was rendering black-on-black. Inline styles have higher
              specificity than any stylesheet rule, so this guarantees the right
              colors regardless of cascade order. */}
          <a
            href="#/checkout"
            onClick={onClose}
            style={{ color: '#fff', backgroundColor: 'var(--ink)' }}
            className="rounded-[var(--radius-sm)] px-5 py-3 text-center font-semibold transition hover:opacity-90 active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ink)]"
          >
            CHECKOUT
          </a>
          <a
            href="#/cart"
            onClick={onClose}
            style={{ color: 'var(--ink)' }}
            className="rounded-[var(--radius-sm)] border border-[var(--ink)] px-5 py-3 text-center font-semibold transition hover:bg-[var(--panel)] active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ink)]"
          >
            VIEW CART
          </a>
          <button
            type="button"
            onClick={onClose}
            className="rounded-[var(--radius-sm)] px-5 py-3 text-center font-semibold text-[var(--ink)] underline-offset-4 transition hover:underline active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ink)]"
          >
            CONTINUE SHOPPING
          </button>
        </div>
      </aside>
    </>
  );
}