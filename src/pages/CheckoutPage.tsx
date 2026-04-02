import type { CartRow, CheckoutState } from '../types/store';
import { money } from '../lib/store';

type CheckoutPageProps = {
  checkout: CheckoutState;
  cartRows: CartRow[];
  cartSubtotal: number;
  shipping: number;
  tax: number;
  total: number;
  placedOrder: string;
  onCheckoutChange: (field: keyof CheckoutState, value: string) => void;
  onPlaceOrder: (e: React.FormEvent<HTMLFormElement>) => void;
};

export function CheckoutPage({
  checkout,
  cartRows,
  cartSubtotal,
  shipping,
  tax,
  total,
  placedOrder,
  onCheckoutChange,
  onPlaceOrder,
}: CheckoutPageProps) {
  return (
    <section className="mx-auto max-w-7xl px-6 py-14 md:py-20">
      <div className="reveal-up mb-8">
        <p className="text-xs tracking-[0.3em] text-[var(--gold-deep)]">SECURE ORDER</p>
        <h1 className="font-editorial mt-3 text-4xl sm:text-5xl">Checkout</h1>
      </div>

      {placedOrder ? (
        <article className="reveal-up is-visible rounded-3xl border border-[var(--line)] bg-[var(--panel)] p-10 text-center">
          <p className="text-xs tracking-[0.24em] text-[var(--gold-deep)]">ORDER CONFIRMED</p>
          <h2 className="font-editorial mt-3 text-4xl">Thank you for shopping with AYLEEN</h2>
          <p className="mt-3 text-sm text-[var(--muted)]">
            Your order ID is <span className="font-semibold text-[var(--ink)]">{placedOrder}</span>. Our team will
            contact you shortly for confirmation.
          </p>
          <a
            href="#/shop"
            className="mt-6 inline-flex rounded-full bg-[var(--ink)] px-6 py-3 text-xs tracking-[0.2em] text-[var(--champagne)]"
          >
            CONTINUE SHOPPING
          </a>
        </article>
      ) : (
        <form className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]" onSubmit={onPlaceOrder}>
          <article className="reveal-up soft-panel rounded-3xl border border-[var(--line)] p-6">
            <h2 className="font-editorial text-3xl">Delivery Details</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <input
                required
                value={checkout.fullName}
                onChange={(e) => onCheckoutChange('fullName', e.target.value)}
                placeholder="Full Name"
                className="h-11 rounded-xl border border-[var(--line-strong)] bg-white px-4 text-sm outline-none"
              />
              <input
                required
                value={checkout.phone}
                onChange={(e) => onCheckoutChange('phone', e.target.value)}
                placeholder="Phone Number"
                className="h-11 rounded-xl border border-[var(--line-strong)] bg-white px-4 text-sm outline-none"
              />
              <input
                value={checkout.email}
                onChange={(e) => onCheckoutChange('email', e.target.value)}
                placeholder="Email (optional)"
                className="h-11 rounded-xl border border-[var(--line-strong)] bg-white px-4 text-sm outline-none sm:col-span-2"
              />
              <input
                required
                value={checkout.address}
                onChange={(e) => onCheckoutChange('address', e.target.value)}
                placeholder="Address"
                className="h-11 rounded-xl border border-[var(--line-strong)] bg-white px-4 text-sm outline-none sm:col-span-2"
              />
              <input
                required
                value={checkout.city}
                onChange={(e) => onCheckoutChange('city', e.target.value)}
                placeholder="City"
                className="h-11 rounded-xl border border-[var(--line-strong)] bg-white px-4 text-sm outline-none"
              />
              <select
                value={checkout.payment}
                onChange={(e) => onCheckoutChange('payment', e.target.value as CheckoutState['payment'])}
                className="h-11 rounded-xl border border-[var(--line-strong)] bg-white px-4 text-sm outline-none"
              >
                <option value="COD">Cash on Delivery</option>
                <option value="CARD">Card on Delivery</option>
              </select>
              <textarea
                value={checkout.note}
                onChange={(e) => onCheckoutChange('note', e.target.value)}
                placeholder="Order note (optional)"
                className="min-h-24 rounded-xl border border-[var(--line-strong)] bg-white px-4 py-3 text-sm outline-none sm:col-span-2"
              />
            </div>
          </article>

          <aside className="reveal-up delay-1 soft-panel rounded-3xl border border-[var(--line)] p-6">
            <h2 className="font-editorial text-3xl">Payment Summary</h2>
            <div className="mt-4 space-y-3 text-sm">
              {cartRows.map((row) => (
                <div key={`${row.product.id}-${row.size}`} className="flex items-start justify-between gap-2">
                  <span className="text-[var(--muted)]">
                    {row.product.title} x{row.qty}
                    <span className="block text-[11px] tracking-[0.12em]">SIZE {row.size}</span>
                  </span>
                  <span>{money(row.product.price * row.qty)}</span>
                </div>
              ))}
            </div>
            <div className="mt-5 space-y-3 border-t border-[var(--line)] pt-4 text-sm">
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
            </div>
            <div className="mt-4 flex justify-between border-t border-[var(--line)] pt-3 text-base font-semibold">
              <span>Total</span>
              <span>{money(total)}</span>
            </div>
            <button
              type="submit"
              className="mt-6 w-full rounded-full bg-[var(--ink)] px-6 py-3 text-xs tracking-[0.2em] text-[var(--champagne)]"
            >
              PLACE ORDER
            </button>
          </aside>
        </form>
      )}
    </section>
  );
}
