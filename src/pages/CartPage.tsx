import { installmentAmount, money } from "../lib/store";
import { APP_ROUTES } from "../routes/appRoutes";
import { getHashUrl } from "../routes/routeUtils";
import { ImageWithFallback } from "../components/ImageWithFallback";
import type { CartRow } from "../types/store";

type CartPageProps = {
  rows: CartRow[];
  cartCount: number;
  cartSubtotal: number;
  shipping: number;
  tax: number;
  total: number;
  isLoading?: boolean;
  onUpdateQty: (productId: string, size: string, qty: number) => void;
  onRemoveLine: (productId: string, size: string) => void;
};

// Keep this in sync with the free-shipping rule used to compute `shipping`.
// Only used here to render the progress bar — the actual discount always
// comes from the `shipping` prop.
const FREE_SHIPPING_THRESHOLD = 6000;

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold-deep)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg,_#fff)]";

function IconBag({ className = "h-7 w-7" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M6 8h12l1 12.5a1.5 1.5 0 0 1-1.5 1.5H6.5A1.5 1.5 0 0 1 5 20.5L6 8Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M9 8V6a3 3 0 0 1 6 0v2"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconTrash({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M5 7h14M10 11v6M14 11v6M6.5 7l.6 11.4A2 2 0 0 0 9.1 20.4h5.8a2 2 0 0 0 2-1.9L18 7M9.5 7V5a1.5 1.5 0 0 1 1.5-1.5h2A1.5 1.5 0 0 1 14.5 5v2"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconMinus({ className = "h-3.5 w-3.5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M5 12h14"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconPlus({ className = "h-3.5 w-3.5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M12 5v14M5 12h14"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconCheck({ className = "h-3.5 w-3.5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M4 12.5 9 17.5 20 6.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconLock({ className = "h-3.5 w-3.5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <rect
        x="5"
        y="10.5"
        width="14"
        height="9.5"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M8 10.5V8a4 4 0 0 1 8 0v2.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function CartPage({
  rows,
  cartCount,
  cartSubtotal,
  shipping,
  tax,
  total,
  isLoading = false,
  onUpdateQty,
  onRemoveLine,
}: CartPageProps) {
  const freeShippingUnlocked = shipping === 0;
  const amountToFreeShipping = Math.max(
    0,
    FREE_SHIPPING_THRESHOLD - cartSubtotal,
  );
  const freeShippingProgress = freeShippingUnlocked
    ? 100
    : Math.min(100, Math.round((cartSubtotal / FREE_SHIPPING_THRESHOLD) * 100));

  return (
    <section className="mx-auto max-w-7xl px-5 py-12 sm:px-6 md:py-16 lg:py-20">
      <div className="reveal-up mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs tracking-[0.3em] text-[var(--gold-deep)]">
            BAG SUMMARY
          </p>
          <h1 className="font-editorial mt-3 text-4xl sm:text-5xl">
            Your Cart
          </h1>
        </div>
        <p className="text-sm text-[var(--muted)]">
          {cartCount} {cartCount === 1 ? "item" : "items"}
        </p>
      </div>

      {isLoading ? (
        <div className="grid gap-4">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="animate-shimmer h-36 rounded-[var(--radius-lg)] border border-[var(--line)] bg-[var(--panel)]"
            />
          ))}
        </div>
      ) : rows.length === 0 ? (
        <article className="reveal-up is-visible flex flex-col items-center rounded-[var(--radius-lg)] border border-[var(--line)] bg-[var(--panel)] p-10 text-center sm:p-14">
          <div className="flex h-14 w-14 items-center justify-center rounded-full border border-[var(--line-strong)] text-[var(--gold-deep)]">
            <IconBag />
          </div>
          <h2
           className="font-editorial mt-5 text-3xl">Your cart is empty</h2>
          <p className="mt-2 max-w-xs text-sm leading-6 text-[var(--muted)]">
            Items you add will show up here. Start exploring the collection to
            find something you love.
          </p>
          <a
           style={{ color: '#fff', backgroundColor: 'var(--ink)' }}
            href={getHashUrl(APP_ROUTES.shop)}
            className={`mt-7 inline-flex rounded-[var(--radius-sm)] bg-[var(--ink)] px-7 py-3 text-xs font-semibold tracking-[0.18em] text-[var(--champagne)] transition-opacity hover:opacity-90 ${focusRing}`}
          >
            START SHOPPING
          </a>
        </article>
      ) : (
        <div className="grid items-start gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="grid gap-4">
            {rows.map((row, index) => {
              const lineTotal = row.product.price * row.qty;
              return (
                <article
                  key={`${row.product.id}-${row.size}`}
                  className="reveal-up soft-panel grid grid-cols-[96px_1fr] gap-4 rounded-[var(--radius-lg)] border border-[var(--line)] p-4 sm:grid-cols-[150px_1fr]"
                  style={{ animationDelay: `${index * 70}ms` }}
                >
                  <ImageWithFallback
                    src={row.product.image}
                    alt={row.product.title}
                    className="aspect-[3/4] w-full rounded-[var(--radius-md)] object-cover"
                  />
                  <div className="flex flex-col">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <h3 className="font-editorial text-2xl leading-tight sm:text-3xl">
                          {row.product.title}
                        </h3>
                        <p className="mt-1 text-xs tracking-[0.16em] text-[var(--muted)]">
                          {row.product.fit} · SIZE {row.size}
                        </p>
                        <p className="mt-2 text-sm font-semibold">
                          {money(row.product.price)}
                        </p>
                        <p className="mt-1 text-xs text-[var(--muted)]">
                          3 installments of{" "}
                          {money(installmentAmount(row.product.price))}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => onRemoveLine(row.product.id, row.size)}
                        aria-label={`Remove ${row.product.title}, size ${row.size}`}
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-[var(--radius-sm)] border border-[var(--line-strong)] text-[var(--muted)] transition-colors hover:border-[var(--ink)] hover:text-[var(--ink)] ${focusRing}`}
                      >
                        <IconTrash />
                      </button>
                    </div>

                    <div className="mt-auto flex flex-wrap items-end justify-between gap-3 pt-4">
                      <div
                        className="inline-flex items-center gap-1 rounded-full border border-[var(--line-strong)] p-1"
                        role="group"
                        aria-label={`Quantity for ${row.product.title}, size ${row.size}`}
                      >
                        <button
                          type="button"
                          onClick={() =>
                            row.qty > 1 &&
                            onUpdateQty(row.product.id, row.size, row.qty - 1)
                          }
                          disabled={row.qty <= 1}
                          aria-label="Decrease quantity"
                          className={`flex h-7 w-7 items-center justify-center rounded-full text-[var(--ink)] transition-colors hover:bg-[var(--line)] disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent ${focusRing}`}
                        >
                          <IconMinus />
                        </button>
                        <span className="w-6 text-center text-sm font-semibold tabular-nums">
                          {row.qty}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            onUpdateQty(row.product.id, row.size, row.qty + 1)
                          }
                          aria-label="Increase quantity"
                          className={`flex h-7 w-7 items-center justify-center rounded-full text-[var(--ink)] transition-colors hover:bg-[var(--line)] ${focusRing}`}
                        >
                          <IconPlus />
                        </button>
                      </div>
                      {row.qty > 1 && (
                        <p className="text-xs text-[var(--muted)]">
                          Line total{" "}
                          <span className="font-semibold text-[var(--ink)]">
                            {money(lineTotal)}
                          </span>
                        </p>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          <aside className="reveal-up delay-1 soft-panel rounded-[var(--radius-lg)] border border-[var(--line)] p-6 lg:sticky lg:top-24">
            <h2 className="font-editorial text-3xl">Order Summary</h2>

            <div className="mt-5 space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-[var(--muted)]">Items ({cartCount})</span>
                <span>{money(cartSubtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--muted)]">Shipping</span>
                <span
                  className={
                    freeShippingUnlocked
                      ? "font-semibold text-[var(--gold-deep)]"
                      : ""
                  }
                >
                  {freeShippingUnlocked ? "Free" : money(shipping)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--muted)]">Tax</span>
                <span>{money(tax)}</span>
              </div>
              <div className="mt-3 flex justify-between border-t border-[var(--line)] pt-3 text-base font-semibold">
                <span>Total</span>
                <span>{money(total)}</span>
              </div>
            </div>

            <div className="mt-5 rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--bg-soft,_transparent)] p-4">
              <div className="flex items-center gap-2 text-xs font-medium">
                {freeShippingUnlocked ? (
                  <span className="flex items-center gap-1.5 text-[var(--gold-deep)]">
                    <IconCheck className="h-3.5 w-3.5" />
                    Free delivery unlocked
                  </span>
                ) : (
                  <span className="text-[var(--ink)]">
                    Add {money(amountToFreeShipping)} more for free delivery
                  </span>
                )}
              </div>
              <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-[var(--line)]">
                <div
                  className="h-full rounded-full bg-[var(--gold-deep)] transition-[width] duration-500"
                  style={{ width: `${freeShippingProgress}%` }}
                />
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              {["COD", "JazzCash", "EasyPaisa", "Card"].map((method) => (
                <span
                  key={method}
                  className="rounded-full border border-[var(--line-strong)] px-3 py-1 text-[10px] tracking-[0.1em] text-[var(--muted)]"
                >
                  {method}
                </span>
              ))}
            </div>

            <a
             style={{ color: '#fff', backgroundColor: 'var(--ink)' }}
              href={getHashUrl(APP_ROUTES.checkout)}
              className={`mt-6 inline-flex w-full items-center justify-center rounded-[var(--radius-sm)] bg-[var(--ink)] px-6 py-3 text-xs font-semibold tracking-[0.18em] text-white transition-opacity hover:opacity-90 ${focusRing}`}
            >
              PROCEED CHECKOUT
            </a>
            <p className="mt-3 flex items-center justify-center gap-1.5 text-center text-[11px] text-[var(--muted)]">
              <IconLock className="h-3 w-3" />
              Secure checkout · Easy 7-day returns
            </p>
          </aside>
        </div>
      )}
    </section>
  );
}
