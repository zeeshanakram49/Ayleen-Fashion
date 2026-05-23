import type { CartRow, CheckoutState } from '../types/store';
import { money } from '../lib/store';

const paymentMethods: {
  value: CheckoutState['payment'];
  label: string;
  detail: string;
}[] = [
  {
    value: 'COD',
    label: 'Cash on Delivery',
    detail: 'Pay when your parcel arrives.',
  },
  {
    value: 'JAZZCASH',
    label: 'JazzCash',
    detail: 'Wallet payment details will be shared after order confirmation.',
  },
  {
    value: 'EASYPAISA',
    label: 'EasyPaisa',
    detail: 'Wallet payment details will be shared after order confirmation.',
  },
  {
    value: 'CARD',
    label: 'Credit / Debit Card',
    detail: 'Card checkout will be enabled through the payment gateway.',
  },
];

const paymentLabels: Record<CheckoutState['payment'], string> = {
  COD: 'Cash on Delivery',
  JAZZCASH: 'JazzCash',
  EASYPAISA: 'EasyPaisa',
  CARD: 'Credit / Debit Card',
};

const paymentConfirmationCopy: Record<CheckoutState['payment'], string> = {
  COD: 'Our team will contact you shortly for confirmation.',
  JAZZCASH: 'Our team will contact you shortly with JazzCash payment details.',
  EASYPAISA: 'Our team will contact you shortly with EasyPaisa payment details.',
  CARD: 'Our team will contact you shortly once card checkout is ready.',
};

type CheckoutPageProps = {
  checkout: CheckoutState;
  cartRows: CartRow[];
  cartSubtotal: number;
  shipping: number;
  tax: number;
  total: number;
  placedOrder: string;
  placedPayment: CheckoutState['payment'] | '';
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
  placedPayment,
  onCheckoutChange,
  onPlaceOrder,
}: CheckoutPageProps) {
  const selectedPayment = placedPayment || checkout.payment;

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
            Your order ID is <span className="font-semibold text-[var(--ink)]">{placedOrder}</span>. Payment method:{' '}
            <span className="font-semibold text-[var(--ink)]">{paymentLabels[selectedPayment]}</span>.{' '}
            {paymentConfirmationCopy[selectedPayment]}
          </p>
          <a
            href="#/shop"
            style={{ color: '#fff', backgroundColor: 'var(--ink)' }}
            className="mt-6 inline-flex rounded-full px-6 py-3 text-xs font-semibold tracking-[0.2em]"
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
              <div className="sm:col-span-2">
                <p className="text-xs font-semibold tracking-[0.18em] text-[var(--gold-deep)]">PAYMENT METHOD</p>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  {paymentMethods.map((method) => {
                    const selected = checkout.payment === method.value;

                    return (
                      <label
                        key={method.value}
                        className={`min-h-24 cursor-pointer rounded-xl border bg-white p-4 transition ${
                          selected
                            ? 'border-[var(--ink)] shadow-[0_18px_45px_-30px_rgba(22,17,12,0.75)]'
                            : 'border-[var(--line-strong)] hover:border-[var(--ink)]'
                        }`}
                      >
                        <input
                          type="radio"
                          name="payment"
                          value={method.value}
                          checked={selected}
                          onChange={() => onCheckoutChange('payment', method.value)}
                          className="sr-only"
                        />
                        <span className="flex items-start justify-between gap-3">
                          <span>
                            <span className="block text-sm font-semibold text-[var(--ink)]">{method.label}</span>
                            <span className="mt-1 block text-xs leading-5 text-[var(--muted)]">{method.detail}</span>
                          </span>
                          <span
                            className={`mt-1 h-4 w-4 rounded-full border ${
                              selected ? 'border-[var(--ink)] bg-[var(--ink)]' : 'border-[var(--line-strong)]'
                            }`}
                            aria-hidden="true"
                          />
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>
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
            <div className="mt-4 rounded-xl border border-[var(--line)] bg-white/70 p-4 text-sm">
              <span className="block text-xs tracking-[0.18em] text-[var(--gold-deep)]">SELECTED PAYMENT</span>
              <span className="mt-1 block font-semibold">{paymentLabels[checkout.payment]}</span>
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
