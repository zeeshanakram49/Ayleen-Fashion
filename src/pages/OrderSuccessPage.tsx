import { useEffect, useState } from "react";
import { fetchOrderDetailApi } from "../api/orderApi";
import { verifyStripePaymentApi } from "../api/paymentApi";
import { money } from "../lib/store";
import { APP_ROUTES } from "../routes/appRoutes";
import { getHashUrl, navigateToHash, readHashSearchParams } from "../routes/routeUtils";
import type { Order } from "../api/apiTypes";

type OrderSuccessPageProps = {
  orderId?: string;
};

export function OrderSuccessPage({ orderId }: OrderSuccessPageProps) {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const searchParams = readHashSearchParams();
  const queryOrderId =
    searchParams.get("orderId") || searchParams.get("order_id") || undefined;
  const sessionId = searchParams.get("session_id") || undefined;
  const resolvedOrderId = orderId || queryOrderId;

  useEffect(() => {
    if (!resolvedOrderId) {
      setLoading(false);
      return;
    }

    let active = true;
    const currentOrderId = resolvedOrderId;
    async function loadOrder() {
      try {
        if (sessionId) {
          const verifyResponse = await verifyStripePaymentApi({
            orderId: currentOrderId,
            sessionId,
          });

          if (!active) return;
          if (!verifyResponse.success) {
            navigateToHash(
              `${APP_ROUTES.orderFailed}/${currentOrderId}?message=${encodeURIComponent(
                verifyResponse.message || "Stripe payment verification failed.",
              )}`,
            );
            return;
          }
        }

        const response = await fetchOrderDetailApi(currentOrderId);
        if (!active) return;
        if (response.success && response.payload) {
          setOrder(response.payload);
        } else if (response.data) {
          setOrder(response.data);
        }
      } catch (err) {
        console.error("Failed to load order success details:", err);
      } finally {
        if (active) setLoading(false);
      }
    }

    void loadOrder();
    return () => {
      active = false;
    };
  }, [resolvedOrderId, sessionId]);

  // Fallbacks if backend doesn't load or returned blank
  const displayId = order?.orderNumber || resolvedOrderId || "AY-726481";
  const displayMethod = order?.paymentMethod === "COD" ? "Cash on Delivery" : order?.paymentMethod || "Credit / Debit Card";
  const displayAmount = order?.total || 0;
  const displayPhone = order?.customerPhone || "Provided Phone Number";
  const displayEmail = order?.customerEmail || "Provided Email Address";

  return (
    <section className="mx-auto max-w-3xl px-5 py-16 sm:px-6 md:py-20 lg:py-24">
      <article className="page-slide-up text-center">
        <div className="success-ring mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[var(--ink)] text-[var(--champagne)] shadow-[var(--shadow-lift)] ring-8 ring-[var(--panel)] checkmark-circle">
          <svg
            className="h-9 w-9"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <path
              className="checkmark-draw"
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        <p className="mt-8 text-xs font-semibold tracking-[0.3em] text-[var(--gold-deep)] uppercase">
          Order Completed
        </p>
        <h1 className="font-editorial mt-4 text-4xl sm:text-5xl leading-tight text-[var(--ink)]">
          Thank you for choosing Aylee
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-[var(--muted)]">
          Your order has been placed successfully and is being processed. Confirmation is sent to <span className="font-semibold text-[var(--ink)]">{displayEmail}</span>.
        </p>

        {loading ? (
          <div className="mt-10 rounded-[var(--radius-lg)] border border-[var(--line)] bg-[var(--panel)] p-6 h-28 animate-shimmer"></div>
        ) : (
          <div className="mt-10 rounded-[var(--radius-lg)] border border-[var(--line)] bg-[var(--panel)] p-6 text-left sm:p-8">
            <h2 className="text-xs font-semibold tracking-[0.2em] text-[var(--ink)] uppercase border-b border-[var(--line-strong)] pb-3">
              Summary Details
            </h2>
            <div className="mt-5 grid gap-4 text-sm sm:grid-cols-2">
              <div>
                <span className="block text-[11px] tracking-wider text-[var(--muted)] uppercase">Order Number</span>
                <span className="mt-1 block font-mono font-bold text-[var(--ink)]">{displayId}</span>
              </div>
              <div>
                <span className="block text-[11px] tracking-wider text-[var(--muted)] uppercase">Payment Method</span>
                <span className="mt-1 block font-medium text-[var(--ink)]">{displayMethod}</span>
              </div>
              <div>
                <span className="block text-[11px] tracking-wider text-[var(--muted)] uppercase">Total Amount</span>
                <span className="mt-1 block font-semibold text-[var(--ink)]">{money(displayAmount)}</span>
              </div>
              <div>
                <span className="block text-[11px] tracking-wider text-[var(--muted)] uppercase">Delivery Contact</span>
                <span className="mt-1 block font-medium text-[var(--ink)]">{displayPhone}</span>
              </div>
            </div>
          </div>
        )}

        <div className="mt-10 border-t border-dashed border-[var(--line-strong)] pt-8">
          <h3 className="text-xs font-semibold tracking-[0.15em] text-[var(--muted)] uppercase">
            What Happens Next
          </h3>
          <div className="mt-6 grid gap-6 sm:grid-cols-3">
            {[
              { step: "1", title: "Confirmation call", desc: "Our team verifies your order details." },
              { step: "2", title: "Packed with care", desc: "Your pieces are pressed, folded and boxed." },
              { step: "3", title: "On its way", desc: "Dispatched with tracking to your door." },
            ].map((item) => (
              <div key={item.step} className="flex flex-col items-center sm:items-start text-center sm:text-left">
                <span className="flex h-7 w-7 items-center justify-center rounded-full border border-[var(--gold-deep)] text-xs font-semibold text-[var(--gold-deep)]">
                  {item.step}
                </span>
                <p className="mt-3 text-sm font-semibold text-[var(--ink)]">{item.title}</p>
                <p className="mt-1 text-xs leading-relaxed text-[var(--muted)]">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 flex flex-col justify-center gap-4 sm:flex-row">
          <a
            href={getHashUrl(APP_ROUTES.shop)}
            className="inline-flex items-center justify-center rounded-[var(--radius-sm)] border border-[var(--ink)] bg-[var(--ink)] px-8 py-4 text-xs font-semibold tracking-[0.2em] text-[var(--champagne)] transition-opacity hover:opacity-90 uppercase"
          >
            Continue Shopping
          </a>
          <a
            href={getHashUrl(APP_ROUTES.orders)}
            className="inline-flex items-center justify-center rounded-[var(--radius-sm)] border border-[var(--line-strong)] bg-transparent px-8 py-4 text-xs font-semibold tracking-[0.2em] text-[var(--ink)] transition-colors hover:bg-[var(--panel)] uppercase"
          >
            View My Orders
          </a>
        </div>
      </article>
    </section>
  );
}
