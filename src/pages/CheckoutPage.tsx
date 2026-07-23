import { useState } from 'react';
import type { CartRow, CheckoutState } from '../types/store';
import { money } from '../lib/store';
import { APP_ROUTES } from '../routes/appRoutes';
import { getHashUrl } from '../routes/routeUtils';

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

const pakistaniCities = [
  'Lahore',
  'Karachi',
  'Islamabad',
  'Rawalpindi',
  'Faisalabad',
  'Multan',
  'Peshawar',
  'Quetta',
  'Sialkot',
  'Gujranwala',
  'Hyderabad',
  'Bahawalpur',
];

/* ---------------------------------- icons ---------------------------------- */

function IconCheck({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M5 12.5l4.5 4.5L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconLock({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <rect x="5" y="11" width="14" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function IconChevron({ className = 'h-4 w-4', open }: { className?: string; open?: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={`${className} transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
      aria-hidden="true"
    >
      <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconCash({ className = 'h-5 w-5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <rect x="2.5" y="6" width="19" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="12" cy="12" r="2.5" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

function IconWallet({ className = 'h-5 w-5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M3 7.5A1.5 1.5 0 0 1 4.5 6h13A1.5 1.5 0 0 1 19 7.5V8H4.5A1.5 1.5 0 0 0 3 9.5v8A1.5 1.5 0 0 0 4.5 19h14a1.5 1.5 0 0 0 1.5-1.5v-7A1.5 1.5 0 0 0 18.5 9H6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <circle cx="16.5" cy="13.5" r="1" fill="currentColor" />
    </svg>
  );
}

function IconCard({ className = 'h-5 w-5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <rect x="2.5" y="5.5" width="19" height="13" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
      <path d="M2.5 9.5h19" stroke="currentColor" strokeWidth="1.4" />
      <path d="M5.5 14.5h4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function paymentIcon(value: CheckoutState['payment'], className?: string) {
  if (value === 'CARD') return <IconCard className={className} />;
  if (value === 'COD') return <IconCash className={className} />;
  return <IconWallet className={className} />;
}

/* ------------------------------- form fields -------------------------------- */

function FloatingInput({
  id,
  label,
  required,
  type = 'text',
  value,
  onChange,
  className = '',
  list,
}: {
  id: string;
  label: string;
  required?: boolean;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
  list?: string;
}) {
  return (
    <div className={`relative ${className}`}>
      <input
        id={id}
        type={type}
        required={required}
        value={value}
        list={list}
        onChange={(e) => onChange(e.target.value)}
        placeholder=" "
        className="peer h-12 w-full border-b border-[var(--line-strong)] bg-transparent px-1 pt-4 pb-1 text-sm text-[var(--ink)] outline-none transition-colors focus:border-[var(--gold-deep)]"
      />
      <label
        htmlFor={id}
        className="pointer-events-none absolute left-1 top-4 text-sm text-[var(--muted)] transition-all duration-200 peer-focus:top-0 peer-focus:text-[10px] peer-focus:tracking-[0.18em] peer-focus:text-[var(--gold-deep)] peer-[&:not(:placeholder-shown)]:top-0 peer-[&:not(:placeholder-shown)]:text-[10px] peer-[&:not(:placeholder-shown)]:tracking-[0.18em]"
      >
        {label.toUpperCase()}
        {required ? ' *' : ''}
      </label>
    </div>
  );
}

function FloatingTextarea({
  id,
  label,
  value,
  onChange,
  className = '',
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
}) {
  return (
    <div className={`relative ${className}`}>
      <textarea
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder=" "
        className="peer min-h-24 w-full resize-none border-b border-[var(--line-strong)] bg-transparent px-1 pt-5 pb-1 text-sm text-[var(--ink)] outline-none transition-colors focus:border-[var(--gold-deep)]"
      />
      <label
        htmlFor={id}
        className="pointer-events-none absolute left-1 top-5 text-sm text-[var(--muted)] transition-all duration-200 peer-focus:top-0 peer-focus:text-[10px] peer-focus:tracking-[0.18em] peer-focus:text-[var(--gold-deep)] peer-[&:not(:placeholder-shown)]:top-0 peer-[&:not(:placeholder-shown)]:text-[10px] peer-[&:not(:placeholder-shown)]:tracking-[0.18em]"
      >
        {label.toUpperCase()}
      </label>
    </div>
  );
}

function SectionEyebrow({ index, title }: { index: string; title: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-[var(--gold-deep)] text-[10px] font-semibold text-[var(--gold-deep)]">
        {index}
      </span>
      <span className="text-xs font-semibold tracking-[0.22em] text-[var(--ink)]">{title}</span>
    </div>
  );
}

/* --------------------------------- page -------------------------------------- */

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
  isProcessing?: boolean;
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
  isProcessing = false,
}: CheckoutPageProps) {
  const [summaryOpen, setSummaryOpen] = useState(false);
  const selectedPayment = placedPayment || checkout.payment;
  const itemCount = cartRows.reduce((sum, row) => sum + row.qty, 0);

  const orderItems = (
    <div className="space-y-4">
      {cartRows.map((row) => (
        <div key={`${row.product.id}-${row.size}`} className="flex items-start gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[var(--line)] bg-[var(--panel)] font-editorial text-base text-[var(--ink)]">
            {row.product.title.charAt(0)}
          </span>
          <span className="flex-1 text-sm text-[var(--ink)]">
            {row.product.title}
            <span className="block text-[11px] tracking-[0.12em] text-[var(--muted)]">
              SIZE {row.size} &middot; QTY {row.qty}
            </span>
          </span>
          <span className="text-sm text-[var(--ink)]">{money(row.product.price * row.qty)}</span>
        </div>
      ))}
    </div>
  );

  const totals = (
    <div className="space-y-3 text-sm text-[var(--ink)]">
      <div className="flex justify-between">
        <span className="text-[var(--muted)]">Subtotal</span>
        <span>{money(cartSubtotal)}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-[var(--muted)]">Shipping</span>
        <span>{shipping === 0 ? 'Free' : money(shipping)}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-[var(--muted)]">Tax</span>
        <span>{money(tax)}</span>
      </div>
    </div>
  );

  return (
    <section className="mx-auto max-w-7xl px-5 py-12 sm:px-6 md:py-16 lg:py-20">
      <div className="reveal-up mb-8">
        <p className="text-xs tracking-[0.3em] text-[var(--gold-deep)]">SECURE ORDER</p>
        <h1 className="font-editorial mt-3 text-4xl sm:text-5xl">Checkout</h1>

        {!placedOrder && (
          <div className="mt-6 flex max-w-md items-center gap-2 text-[10px] font-semibold tracking-[0.18em] text-[var(--muted)]">
            <span className="flex items-center gap-1.5 text-[var(--ink)]">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[var(--ink)] text-[var(--champagne)]">
                <IconCheck className="h-3 w-3" />
              </span>
              CART
            </span>
            <span className="h-px flex-1 bg-[var(--gold-deep)]" />
            <span className="flex items-center gap-1.5 text-[var(--ink)]">
              <span className="flex h-5 w-5 items-center justify-center rounded-full border border-[var(--gold-deep)] text-[var(--gold-deep)]">2</span>
              DELIVERY
            </span>
            <span className="h-px flex-1 bg-[var(--line-strong)]" />
            <span className="flex items-center gap-1.5">
              <span className="flex h-5 w-5 items-center justify-center rounded-full border border-[var(--line-strong)]">3</span>
              CONFIRM
            </span>
          </div>
        )}
      </div>

      {placedOrder ? (
        <article className="reveal-up is-visible mx-auto max-w-2xl rounded-[var(--radius-lg)] border border-[var(--line)] bg-[var(--panel)] p-8 text-center sm:p-10">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[var(--ink)] text-[var(--champagne)]">
            <IconCheck className="h-6 w-6" />
          </span>
          <p className="mt-5 text-xs tracking-[0.24em] text-[var(--gold-deep)]">ORDER CONFIRMED</p>
          <h2 className="font-editorial mt-3 text-4xl">Thank you for shopping with Aylee</h2>
          <p className="mt-3 text-sm text-[var(--muted)]">
            Your order ID is <span className="font-semibold text-[var(--ink)]">{placedOrder}</span>. Payment method:{' '}
            <span className="font-semibold text-[var(--ink)]">{paymentLabels[selectedPayment]}</span>.{' '}
            {paymentConfirmationCopy[selectedPayment]}
          </p>

          <div className="mt-8 grid gap-4 border-t border-dashed border-[var(--line-strong)] pt-6 text-left sm:grid-cols-3">
            {[
              { step: '1', title: 'Confirmation call', copy: 'Our team verifies your order details.' },
              { step: '2', title: 'Packed with care', copy: 'Your pieces are pressed, folded and boxed.' },
              { step: '3', title: 'On its way', copy: 'Dispatched with tracking to your door.' },
            ].map((item) => (
              <div key={item.step}>
                <span className="flex h-7 w-7 items-center justify-center rounded-full border border-[var(--gold-deep)] text-xs font-semibold text-[var(--gold-deep)]">
                  {item.step}
                </span>
                <p className="mt-2 text-sm font-semibold text-[var(--ink)]">{item.title}</p>
                <p className="mt-1 text-xs leading-5 text-[var(--muted)]">{item.copy}</p>
              </div>
            ))}
          </div>

          <a
            href={getHashUrl(APP_ROUTES.shop)}
            style={{ color: '#ffffff', backgroundColor: 'var(--ink)' }}
            className="mt-8 inline-flex rounded-[var(--radius-sm)] px-6 py-3 text-xs font-semibold tracking-[0.18em] text-white transition-opacity hover:opacity-90"
          >
            CONTINUE SHOPPING
          </a>
        </article>
      ) : (
        <form className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-start" onSubmit={onPlaceOrder}>
          {/* mobile-only collapsible order summary */}
          <button
            type="button"
            onClick={() => setSummaryOpen((v) => !v)}
            className="reveal-up flex items-center justify-between rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--panel)] px-4 py-3 text-left lg:hidden"
          >
            <span className="text-sm">
              <span className="font-semibold text-[var(--ink)]">
                {summaryOpen ? 'Hide' : 'Show'} order summary
              </span>
              <span className="ml-2 text-[var(--muted)]">
                {itemCount} item{itemCount === 1 ? '' : 's'}
              </span>
            </span>
            <span className="flex items-center gap-2 text-sm font-semibold text-[var(--ink)]">
              {money(total)}
              <IconChevron open={summaryOpen} />
            </span>
          </button>
          {summaryOpen && (
            <div className="reveal-up is-visible rounded-[var(--radius-md)] border border-[var(--line)] bg-white p-4 lg:hidden">
              {orderItems}
              <div className="my-4 border-t border-dashed border-[var(--line-strong)]" />
              {totals}
            </div>
          )}

          <fieldset disabled={isProcessing} className="contents">
            <article className="reveal-up soft-panel space-y-8 rounded-[var(--radius-lg)] border border-[var(--line)] p-5 sm:p-6 bg-white">
              <div>
                <h2 className="font-editorial text-3xl">Delivery Details</h2>
                <p className="mt-1 text-xs text-[var(--muted)]">Fields marked * are required to ship your order.</p>
              </div>

              <div className="space-y-4">
                <SectionEyebrow index="1" title="CONTACT" />
                <div className="grid gap-x-4 gap-y-5 pl-9 sm:grid-cols-2">
                  <FloatingInput
                    id="fullName"
                    label="Full Name"
                    required
                    value={checkout.fullName}
                    onChange={(v) => onCheckoutChange('fullName', v)}
                    className="sm:col-span-2"
                  />
                  <FloatingInput
                    id="phone"
                    label="Phone Number"
                    required
                    type="tel"
                    value={checkout.phone}
                    onChange={(v) => onCheckoutChange('phone', v)}
                  />
                  <FloatingInput
                    id="email"
                    label="Email (optional)"
                    type="email"
                    value={checkout.email}
                    onChange={(v) => onCheckoutChange('email', v)}
                  />
                </div>
              </div>

              <div className="space-y-4 border-t border-[var(--line)] pt-6">
                <SectionEyebrow index="2" title="DELIVERY ADDRESS" />
                <div className="grid gap-x-4 gap-y-5 pl-9 sm:grid-cols-2">
                  <FloatingInput
                    id="address"
                    label="Address"
                    required
                    value={checkout.address}
                    onChange={(v) => onCheckoutChange('address', v)}
                    className="sm:col-span-2"
                  />
                  <FloatingInput
                    id="address2"
                    label="Address Line 2 / Landmark (optional)"
                    value={checkout.address2 || ''}
                    onChange={(v) => onCheckoutChange('address2', v)}
                    className="sm:col-span-2"
                  />
                  <FloatingInput
                    id="city"
                    label="City"
                    required
                    list="checkout-city-list"
                    value={checkout.city}
                    onChange={(v) => onCheckoutChange('city', v)}
                  />
                  <FloatingInput
                    id="postCode"
                    label="Postal Code (optional)"
                    value={checkout.postCode || ''}
                    onChange={(v) => onCheckoutChange('postCode', v)}
                  />
                  <datalist id="checkout-city-list">
                    {pakistaniCities.map((city) => (
                      <option key={city} value={city} />
                    ))}
                  </datalist>
                  <FloatingInput
                    id="country"
                    label="Country"
                    value={checkout.country || 'Pakistan'}
                    onChange={(v) => onCheckoutChange('country', v)}
                    className="sm:col-span-2"
                  />
                  <div className="flex items-center gap-2 text-xs text-[var(--muted)] sm:col-span-2">
                    <span className="inline-flex h-5 items-center rounded-full border border-[var(--line-strong)] px-2 text-[10px] font-semibold tracking-[0.12em] text-[var(--ink)]">
                      PK
                    </span>
                    Currently shipping within Pakistan only
                  </div>
                </div>
              </div>

              <div className="space-y-4 border-t border-[var(--line)] pt-6">
                <SectionEyebrow index="3" title="PAYMENT METHOD" />
                <div className="grid gap-3 pl-9 sm:grid-cols-2">
                  {paymentMethods.map((method) => {
                    const selected = checkout.payment === method.value;

                    return (
                      <label
                        key={method.value}
                        className={`flex min-h-24 cursor-pointer items-start gap-3 rounded-[var(--radius-md)] border bg-white p-4 transition ${
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
                          disabled={isProcessing}
                        />
                        <span className={selected ? 'text-[var(--ink)]' : 'text-[var(--muted)]'}>
                          {paymentIcon(method.value)}
                        </span>
                        <span className="flex-1">
                          <span className="block text-sm font-semibold text-[var(--ink)]">{method.label}</span>
                          <span className="mt-1 block text-xs leading-5 text-[var(--muted)]">{method.detail}</span>
                        </span>
                        <span
                          className={`mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
                            selected ? 'border-[var(--ink)] bg-[var(--ink)] text-[var(--champagne)]' : 'border-[var(--line-strong)]'
                          }`}
                          aria-hidden="true"
                        >
                          {selected && <IconCheck className="h-2.5 w-2.5" />}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="border-t border-[var(--line)] pt-6">
                <FloatingTextarea
                  id="note"
                  label="Order note (optional)"
                  value={checkout.note}
                  onChange={(v) => onCheckoutChange('note', v)}
                />
              </div>
            </article>
          </fieldset>

          <aside className="reveal-up delay-1 soft-panel hidden rounded-[var(--radius-lg)] border border-[var(--line)] p-5 sm:p-6 lg:sticky lg:top-10 lg:block bg-white">
            <div className="flex items-baseline justify-between">
              <h2 className="font-editorial text-3xl">Order Summary</h2>
              <span className="text-xs tracking-[0.12em] text-[var(--muted)]">
                {itemCount} ITEM{itemCount === 1 ? '' : 'S'}
              </span>
            </div>

            <div className="mt-5">{orderItems}</div>

            <div className="my-5 border-t border-dashed border-[var(--line-strong)]" />

            {totals}

            <div className="mt-4 flex justify-between border-t border-[var(--line)] pt-3 text-base font-semibold text-[var(--ink)]">
              <span>Total</span>
              <span>{money(total)}</span>
            </div>

            <div className="mt-4 rounded-[var(--radius-md)] border border-[var(--line)] bg-white/70 p-4 text-sm">
              <span className="block text-xs tracking-[0.18em] text-[var(--gold-deep)]">SELECTED PAYMENT</span>
              <span className="mt-1 flex items-center gap-2 font-semibold text-[var(--ink)]">
                {paymentIcon(checkout.payment, 'h-4 w-4')}
                {paymentLabels[checkout.payment]}
              </span>
            </div>

            <button
              type="submit"
              disabled={isProcessing}
              className="mt-6 w-full rounded-[var(--radius-sm)] bg-[var(--ink)] px-6 py-3 text-xs tracking-[0.18em] text-[var(--champagne)] transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--gold-deep)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? "PROCESSING..." : "PLACE ORDER"}
            </button>
            <p className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-[var(--muted)]">
              <IconLock className="h-3 w-3" />
              Encrypted &amp; secure checkout
            </p>
          </aside>

          {/* sticky mobile place-order bar */}
          <div className="sticky bottom-3 z-10 rounded-[var(--radius-md)] border border-[var(--line)] bg-white/95 p-3 shadow-[0_18px_45px_-25px_rgba(22,17,12,0.55)] backdrop-blur lg:hidden">
            <button
              type="submit"
              disabled={isProcessing}
              className="flex w-full items-center justify-between rounded-[var(--radius-sm)] bg-[var(--ink)] px-5 py-3 text-xs tracking-[0.18em] text-[var(--champagne)] transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>{isProcessing ? "PROCESSING..." : "PLACE ORDER"}</span>
              <span>{money(total)}</span>
            </button>
          </div>
        </form>
      )}
    </section>
  );
}
