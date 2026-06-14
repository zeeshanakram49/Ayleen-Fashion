import { installmentAmount, money } from '../lib/store';
import type { CartRow } from '../types/store';

type CartDrawerProps = {
  open: boolean;
  latestItem: CartRow | null;
  cartCount: number;
  subtotal: number;
  onClose: () => void;
};

export function CartDrawer({ open, latestItem, cartCount, subtotal, onClose }: CartDrawerProps) {
  return (
    <>
      <div
        aria-hidden={!open}
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-black/42 backdrop-blur-[2px] transition ${open ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'}`}
      />

      <aside
        aria-hidden={!open}
        className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col border-l border-[var(--line)] bg-[var(--paper)] p-5 shadow-[0_30px_90px_-40px_rgba(0,0,0,0.55)] transition duration-300 sm:p-6 ${open ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs tracking-[0.26em] text-[var(--gold-deep)]">ADDED TO BASKET</p>
            <h2 className="font-editorial mt-2 text-3xl">Your Cart Preview</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-[var(--radius-sm)] border border-[var(--line-strong)] px-3 py-2 text-xs tracking-[0.14em]"
          >
            CLOSE
          </button>
        </div>

        {latestItem ? (
          <article className="mt-6 rounded-[var(--radius-lg)] border border-[var(--line)] bg-[var(--panel)] p-4">
            <div className="grid gap-4 sm:grid-cols-[116px_1fr]">
              <img
                src={latestItem.product.image}
                alt={latestItem.product.title}
                className="h-32 w-full rounded-[var(--radius-md)] object-cover"
              />
              <div>
                <p className="text-[10px] tracking-[0.22em] text-[var(--gold-deep)]">
                  {latestItem.product.fit} | {latestItem.product.categoryLabel}
                </p>
                <h3 className="font-editorial mt-2 text-2xl leading-tight sm:text-3xl">{latestItem.product.title}</h3>
                <p className="mt-2 text-xs tracking-[0.16em] text-[var(--muted)]">
                  SIZE {latestItem.size} | QTY {latestItem.qty}
                </p>
                <p className="mt-3 text-sm font-semibold">{money(latestItem.product.price * latestItem.qty)}</p>
                <p className="mt-1 text-xs text-[var(--muted)]">
                  Pay in 3 installments of {money(installmentAmount(latestItem.product.price))}
                </p>
              </div>
            </div>
          </article>
        ) : (
          <div className="mt-6 rounded-[var(--radius-lg)] border border-dashed border-[var(--line-strong)] p-5 text-sm text-[var(--muted)]">
            Your bag preview will appear here after you add an item.
          </div>
        )}

        <div className="mt-6 rounded-[var(--radius-lg)] border border-[var(--line)] bg-white p-5">
          <div className="flex justify-between text-sm">
            <span>{cartCount} items in bag</span>
            <span>{money(subtotal)}</span>
          </div>
          <p className="mt-3 text-xs leading-6 text-[var(--muted)]">
            All orders may take 3 to 5 working days. Shipping becomes free automatically above PKR 6,000.
          </p>
        </div>

        <div className="mt-auto grid gap-3 pt-6 text-xs tracking-[0.18em]">
          <a
            href="#/cart"
            onClick={onClose}
            style={{ color: '#fff', backgroundColor: 'var(--ink)' }}
            className="rounded-[var(--radius-sm)] px-5 py-3 text-center font-semibold"
          >
            VIEW CART
          </a>
          <a
            href="#/checkout"
            onClick={onClose}
            style={{ color: '#fff', backgroundColor: 'var(--ink)' }}
            className="rounded-[var(--radius-sm)] border border-[var(--ink)] px-5 py-3 text-center font-semibold"
          >
            CHECKOUT
          </a>
          <button
            type="button"
            onClick={onClose}
            style={{ color: '#fff', backgroundColor: 'var(--ink)' }}
            className="rounded-[var(--radius-sm)] border border-[var(--ink)] px-5 py-3 text-center font-semibold"
          >
            CONTINUE SHOPPING
          </button>
        </div>
      </aside>
    </>
  );
}
