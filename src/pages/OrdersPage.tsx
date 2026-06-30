import { useEffect, useState } from "react";
import { fetchOrdersApi } from "../api/orderApi";
import { getApiErrorMessage } from "../api/apiError";
import { useAuth } from "../hooks/useAuth";
import { money } from "../lib/store";
import { APP_ROUTES } from "../routes/appRoutes";
import { getHashUrl, navigateToHash } from "../routes/routeUtils";
import type { Order } from "../api/apiTypes";

export function OrdersPage() {
  const { isAuthenticated } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isAuthenticated) {
      navigateToHash(APP_ROUTES.login);
      return;
    }

    let active = true;
    async function loadOrders() {
      try {
        const response = await fetchOrdersApi();
        if (!active) return;
        if (response.success && response.payload) {
          setOrders(response.payload);
        } else if (response.data) {
          setOrders(response.data);
        }
      } catch (err) {
        if (!active) return;
        setError(getApiErrorMessage(err));
      } finally {
        if (active) setLoading(false);
      }
    }

    void loadOrders();
    return () => {
      active = false;
    };
  }, [isAuthenticated]);

  const badgeStyles: Record<string, string> = {
    pending: "bg-amber-50 text-amber-800 border-amber-200",
    paid: "bg-emerald-50 text-emerald-800 border-emerald-200",
    failed: "bg-rose-50 text-rose-800 border-rose-200",
    cancelled: "bg-slate-150 text-slate-600 border-slate-300",
    shipped: "bg-blue-50 text-blue-800 border-blue-200",
    delivered: "bg-teal-50 text-teal-800 border-teal-200",
  };

  return (
    <section className="mx-auto max-w-7xl px-5 py-12 sm:px-6 md:py-16">
      <div className="reveal-up is-visible mb-8">
        <p className="text-xs tracking-[0.3em] text-[var(--gold-deep)]">MEMBER ACCOUNT</p>
        <h1 className="font-editorial mt-3 text-4xl sm:text-5xl">Your Orders</h1>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((n) => (
            <div key={n} className="animate-shimmer rounded-[var(--radius-lg)] border border-[var(--line)] bg-[var(--panel)] p-6 h-36"></div>
          ))}
        </div>
      ) : error ? (
        <div className="rounded-[var(--radius-lg)] border border-red-200 bg-red-50 p-6 text-center">
          <p className="text-red-700 font-medium">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 rounded-[var(--radius-sm)] border border-red-300 bg-white px-4 py-2 text-xs font-semibold tracking-wider text-red-700 hover:bg-red-50"
          >
            RETRY
          </button>
        </div>
      ) : orders.length === 0 ? (
        <div className="rounded-[var(--radius-lg)] border border-[var(--line)] bg-[var(--panel)] p-12 text-center">
          <h2 className="font-editorial text-2xl">No orders placed yet</h2>
          <p className="mt-2 text-sm text-[var(--muted)]">You haven't placed any orders with this account.</p>
          <a
            href={getHashUrl(APP_ROUTES.shop)}
            className="mt-6 inline-flex rounded-[var(--radius-sm)] bg-[var(--ink)] px-6 py-3 text-xs font-semibold tracking-wider text-[var(--champagne)]"
          >
            START SHOPPING
          </a>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="rounded-[var(--radius-lg)] border border-[var(--line)] bg-white p-5 shadow-[var(--shadow-soft)] sm:p-6"
            >
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--line)] pb-4">
                <div>
                  <span className="text-xs text-[var(--muted)]">Order Placed</span>
                  <p className="text-sm font-semibold text-[var(--ink)]">
                    {new Date(order.createdAt).toLocaleDateString("en-PK", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
                <div>
                  <span className="text-xs text-[var(--muted)]">Order ID</span>
                  <p className="text-sm font-mono font-bold text-[var(--ink)]">{order.orderNumber}</p>
                </div>
                <div>
                  <span className="text-xs text-[var(--muted)]">Total Amount</span>
                  <p className="text-sm font-bold text-[var(--gold-deep)]">{money(order.total)}</p>
                </div>
                <div>
                  <span className="text-xs text-[var(--muted)]">Status</span>
                  <div className="mt-1 flex gap-2">
                    <span
                      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize ${
                        badgeStyles[order.status.toLowerCase()] || "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Order Items List */}
              <div className="mt-4 space-y-3">
                {order.items.map((item) => (
                  <div key={item.productId} className="flex justify-between items-center text-sm">
                    <div className="flex-1">
                      <p className="font-medium text-[var(--ink)]">{item.productTitle}</p>
                      <span className="text-xs text-[var(--muted)]">
                        SIZE {item.size} &middot; QTY {item.qty}
                      </span>
                    </div>
                    <span className="font-semibold text-[var(--ink)]">{money(item.price * item.qty)}</span>
                  </div>
                ))}
              </div>

              {/* Order Footer Details */}
              <div className="mt-4 border-t border-dashed border-[var(--line-strong)] pt-4 text-xs text-[var(--muted)] flex justify-between">
                <span>Payment: {order.paymentMethod}</span>
                <span>Address: {order.shippingAddress}, {order.city}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
