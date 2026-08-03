import { useEffect, useState } from "react";
import { fetchOrderDetailApi } from "../api/orderApi";
import { verifyStripePaymentApi } from "../api/paymentApi";
import { money } from "../lib/store";
import { APP_ROUTES } from "../routes/appRoutes";
import {
  getHashUrl,
  navigateToHash,
  readHashSearchParams,
} from "../routes/routeUtils";
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

  // Display helpers from normalized backend order response
  const displayId = order?.orderNumber || resolvedOrderId || "ORD-FS5HE43ASH";
  const displayCustomer = order?.customerName || "Valued Customer";
  const displayAddress = order?.shippingAddress || "";
  const displayMethod =
    order?.paymentMethod === "COD"
      ? "Cash on Delivery"
      : order?.paymentMethod || "Cash on Delivery";
  const displayPaymentStatus = order?.paymentStatus || "unpaid";
  const displayAmount = order?.total || 0;
  const displayPhone = order?.customerPhone || "";
  const displayEmail = order?.customerEmail || "";
  const items = order?.items || [];

  return (
    <section className="mx-auto max-w-3xl px-5 py-16 sm:px-6 md:py-20 lg:py-24">
      <article className="page-slide-up text-center">
        <div className="success-ring checkmark-circle mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[var(--ink)] text-[var(--champagne)] shadow-[var(--shadow-lift)] ring-8 ring-[var(--panel)]">
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
        <h1 className="font-editorial mt-4 text-4xl leading-tight text-[var(--ink)] sm:text-5xl">
          Thank you for choosing Aylee
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-[var(--muted)]">
          Your order has been placed successfully and is being processed.
          Confirmation is sent to{" "}
          <span className="font-semibold text-[var(--ink)]">
            {displayEmail || displayPhone || "your contact"}
          </span>
          .
        </p>

        {loading ? (
          <div className="animate-shimmer mt-10 h-28 rounded-[var(--radius-lg)] border border-[var(--line)] bg-[var(--panel)] p-6"></div>
        ) : (
          <div className="mt-10 space-y-6 text-left">
            <div className="rounded-[var(--radius-lg)] border border-[var(--line)] bg-[var(--panel)] p-6 sm:p-8">
              <h2 className="border-b border-[var(--line-strong)] pb-3 text-xs font-semibold tracking-[0.2em] text-[var(--ink)] uppercase">
                Order Summary Details
              </h2>
              <div className="mt-5 grid gap-4 text-sm sm:grid-cols-2">
                <div>
                  <span className="block text-[11px] tracking-wider text-[var(--muted)] uppercase">
                    Order Number
                  </span>
                  <span className="mt-1 block font-mono font-bold text-[var(--ink)]">
                    {displayId}
                  </span>
                </div>
                <div>
                  <span className="block text-[11px] tracking-wider text-[var(--muted)] uppercase">
                    Customer Name
                  </span>
                  <span className="mt-1 block font-medium text-[var(--ink)]">
                    {displayCustomer}
                  </span>
                </div>
                <div>
                  <span className="block text-[11px] tracking-wider text-[var(--muted)] uppercase">
                    Total Amount
                  </span>
                  <span className="mt-1 block font-semibold text-[var(--ink)]">
                    {money(displayAmount)}
                  </span>
                </div>
                <div>
                  <span className="block text-[11px] tracking-wider text-[var(--muted)] uppercase">
                    Payment Status
                  </span>
                  <span className="mt-1 block font-medium text-[var(--ink)] capitalize">
                    {displayMethod} ({displayPaymentStatus})
                  </span>
                </div>
                {displayPhone && (
                  <div>
                    <span className="block text-[11px] tracking-wider text-[var(--muted)] uppercase">
                      Phone
                    </span>
                    <span className="mt-1 block font-medium text-[var(--ink)]">
                      {displayPhone}
                    </span>
                  </div>
                )}
                {displayEmail && (
                  <div>
                    <span className="block text-[11px] tracking-wider text-[var(--muted)] uppercase">
                      Email
                    </span>
                    <span className="mt-1 block font-medium text-[var(--ink)]">
                      {displayEmail}
                    </span>
                  </div>
                )}
                {displayAddress && (
                  <div className="sm:col-span-2">
                    <span className="block text-[11px] tracking-wider text-[var(--muted)] uppercase">
                      Shipping Address
                    </span>
                    <span className="mt-1 block font-medium text-[var(--ink)]">
                      {displayAddress}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {items.length > 0 && (
              <div className="rounded-[var(--radius-lg)] border border-[var(--line)] bg-[var(--panel)] p-6 sm:p-8">
                <h2 className="border-b border-[var(--line-strong)] pb-3 text-xs font-semibold tracking-[0.2em] text-[var(--ink)] uppercase">
                  Ordered Items ({items.length})
                </h2>
                <div className="mt-4 divide-y divide-[var(--line)]">
                  {items.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between py-3"
                    >
                      <div>
                        <p className="text-sm font-semibold text-[var(--ink)]">
                          {item.productTitle}
                        </p>
                        <p className="text-xs text-[var(--muted)]">
                          Qty: {item.qty} &middot; Price: {money(item.price)}
                        </p>
                      </div>
                      <p className="text-sm font-semibold text-[var(--ink)]">
                        {money(item.price * item.qty)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="mt-10 border-t border-dashed border-[var(--line-strong)] pt-8">
          <h3 className="text-xs font-semibold tracking-[0.15em] text-[var(--muted)] uppercase">
            What Happens Next
          </h3>
          <div className="mt-6 grid gap-6 sm:grid-cols-3">
            {[
              {
                step: "1",
                title: "Confirmation call",
                desc: "Our team verifies your order details.",
              },
              {
                step: "2",
                title: "Packed with care",
                desc: "Your pieces are pressed, folded and boxed.",
              },
              {
                step: "3",
                title: "On its way",
                desc: "Dispatched with tracking to your door.",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="flex flex-col items-center text-center sm:items-start sm:text-left"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-full border border-[var(--gold-deep)] text-xs font-semibold text-[var(--gold-deep)]">
                  {item.step}
                </span>
                <p className="mt-3 text-sm font-semibold text-[var(--ink)]">
                  {item.title}
                </p>
                <p className="mt-1 text-xs leading-relaxed text-[var(--muted)]">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 flex flex-col justify-center gap-4 sm:flex-row">
          <a
            href={getHashUrl(APP_ROUTES.shop)}
            style={{ color: "#ffffff", backgroundColor: "var(--ink)" }}
            className="inline-flex items-center justify-center rounded-[var(--radius-sm)] border border-[var(--ink)] px-8 py-4 text-xs font-semibold tracking-[0.2em] text-white uppercase transition-opacity hover:opacity-90"
          >
            Continue Shopping
          </a>
          <a
            href={getHashUrl(APP_ROUTES.orders)}
            className="inline-flex items-center justify-center rounded-[var(--radius-sm)] border border-[var(--line-strong)] bg-transparent px-8 py-4 text-xs font-semibold tracking-[0.2em] text-[var(--ink)] uppercase transition-colors hover:bg-[var(--panel)]"
          >
            View My Orders
          </a>
        </div>
      </article>
    </section>
  );
}
