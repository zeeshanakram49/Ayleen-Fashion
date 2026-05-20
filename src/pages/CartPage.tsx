import { installmentAmount, money } from '../lib/store';
import type { CartRow } from '../types/store';

type CartPageProps = {
  rows: CartRow[];
  cartCount: number;
  cartSubtotal: number;
  shipping: number;
  tax: number;
  total: number;
  onUpdateQty: (productId: string, size: string, qty: number) => void;
  onRemoveLine: (productId: string, size: string) => void;
};

export function CartPage({
  rows,
  cartCount,
  cartSubtotal,
  shipping,
  tax,
  total,
  onUpdateQty,
  onRemoveLine,
}: CartPageProps) {
  return (
    <section className="mx-auto max-w-7xl px-6 py-14 md:py-20">
      <div className="reveal-up mb-8 flex items-end justify-between gap-4">
        <div>
          <p className="text-xs tracking-[0.3em] text-[var(--gold-deep)]">BAG SUMMARY</p>
          <h1 className="font-editorial mt-3 text-4xl sm:text-5xl">Your Cart</h1>
        </div>
        <p className="text-sm text-[var(--muted)]">{cartCount} total items</p>
      </div>

      {rows.length === 0 ? (
        <article className="reveal-up is-visible rounded-3xl border border-[var(--line)] bg-[var(--panel)] p-10 text-center">
          <h2 className="font-editorial text-3xl">Your cart is empty</h2>
          <p className="mt-3 text-sm text-[var(--muted)]">Add products to continue checkout.</p>
          <a
            href="#/shop"
                style={{ color: '#fff', backgroundColor: 'var(--ink)' }}
            className="mt-5 inline-flex rounded-full bg-[var(--ink)] px-6 py-3 text-xs tracking-[0.2em] text-[var(--champagne)]"
          >
            START SHOPPING
          </a>
        </article>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="grid gap-4">
            {rows.map((row, index) => (
              <article
                key={`${row.product.id}-${row.size}`}
                className="reveal-up soft-panel grid gap-4 rounded-3xl border border-[var(--line)] p-4 sm:grid-cols-[150px_1fr]"
                style={{ animationDelay: `${index * 70}ms` }}
              >
                <img src={row.product.image} alt={row.product.title} className="h-36 w-full rounded-2xl object-cover" />
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-editorial text-3xl leading-tight">{row.product.title}</h3>
                      <p className="text-xs tracking-[0.16em] text-[var(--muted)]">
                        {row.product.fit} | SIZE {row.size}
                      </p>
                      <p className="mt-1 text-sm font-semibold">{money(row.product.price)}</p>
                      <p className="mt-1 text-xs text-[var(--muted)]">
                        3 installments of {money(installmentAmount(row.product.price))}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => onRemoveLine(row.product.id, row.size)}
                      className="rounded-full border border-[var(--line-strong)] px-3 py-1 text-[10px] tracking-[0.14em]"
                    >
                      REMOVE
                    </button>
                  </div>

                  <div className="mt-4 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onUpdateQty(row.product.id, row.size, row.qty - 1)}
                      className="h-8 w-8 rounded-full border border-[var(--line-strong)]"
                    >
                      -
                    </button>
                    <span className="w-8 text-center text-sm font-semibold">{row.qty}</span>
                    <button
                      type="button"
                      onClick={() => onUpdateQty(row.product.id, row.size, row.qty + 1)}
                      className="h-8 w-8 rounded-full border border-[var(--line-strong)]"
                    >
                      +
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <aside className="reveal-up delay-1 soft-panel rounded-3xl border border-[var(--line)] p-6">
            <h2 className="font-editorial text-3xl">Order Summary</h2>
            <div className="mt-5 space-y-3 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{money(cartSubtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>{shipping === 0 ? 'Free' : money(shipping)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span>{money(tax)}</span>
              </div>
              <div className="mt-3 flex justify-between border-t border-[var(--line)] pt-3 text-base font-semibold">
                <span>Total</span>
                <span>{money(total)}</span>
              </div>
            </div>
            <p className="mt-5 text-sm leading-6 text-[var(--muted)]">
              Free delivery unlocks automatically above PKR 6,000 and checkout remains available with COD or card on delivery.
            </p>
            <a
              href="#/checkout"
              style={{ color: '#fff', backgroundColor: 'var(--ink)' }}
              className="mt-6 inline-flex w-full items-center justify-center rounded-full px-6 py-3 text-xs font-semibold tracking-[0.2em]"
            >
              PROCEED CHECKOUT
            </a>
          </aside>
        </div>
      )}
    </section>
  );
}
