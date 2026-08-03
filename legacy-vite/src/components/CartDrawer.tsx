import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingBag, ArrowRight, Truck, CheckCircle2 } from "lucide-react";
import { money } from "../lib/store";
import { APP_ROUTES } from "../routes/appRoutes";
import { getHashUrl } from "../routes/routeUtils";
import type { CartRow } from "../types/store";
import { ImageWithFallback } from "./ImageWithFallback";

type CartDrawerProps = {
  open: boolean;
  latestItem: CartRow | null;
  cartCount: number;
  subtotal: number;
  onClose: () => void;
};

const FREE_SHIPPING_THRESHOLD = 2500;

export function CartDrawer({
  open,
  latestItem,
  cartCount,
  subtotal,
  onClose,
}: CartDrawerProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  const remainingForFreeShipping = Math.max(
    FREE_SHIPPING_THRESHOLD - subtotal,
    0,
  );
  const shippingProgress = Math.min(
    (subtotal / FREE_SHIPPING_THRESHOLD) * 100,
    100,
  );

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-drawer-heading"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-[9970] bg-black/60 backdrop-blur-sm"
      >
        <motion.aside
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 280 }}
          onClick={(e) => e.stopPropagation()}
          className="fixed top-0 right-0 bottom-0 z-[9975] flex h-full w-full max-w-md flex-col border-l border-[var(--line)] bg-white p-6 shadow-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[var(--line)] pb-4">
            <div className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5 text-[var(--ink)]" />
              <h2
                id="cart-drawer-heading"
                className="text-xl font-bold tracking-wider text-[var(--ink)] uppercase"
              >
                Shopping Bag ({cartCount})
              </h2>
            </div>
            <button
              ref={closeButtonRef}
              type="button"
              onClick={onClose}
              aria-label="Close cart"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--line-strong)] text-[var(--ink)] transition hover:bg-[var(--panel)]"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Shipping Progress Bar */}
          <div className="mt-4 rounded-xl border border-[var(--line)] bg-[var(--panel)] p-4">
            <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-[var(--ink)]">
              <Truck className="h-4 w-4 text-[var(--ink)]" />
              {remainingForFreeShipping === 0 ? (
                <span className="flex items-center gap-1 font-bold text-emerald-700">
                  <CheckCircle2 size={14} /> You unlocked FREE EXPRESS SHIPPING!
                </span>
              ) : (
                <span>
                  Add{" "}
                  <strong className="text-[var(--ink)]">
                    {money(remainingForFreeShipping).replace("PKR ", "Rs. ")}
                  </strong>{" "}
                  more for <strong>FREE Shipping</strong>
                </span>
              )}
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-[var(--line)]">
              <div
                className="h-full rounded-full bg-[var(--ink)] transition-all duration-500"
                style={{ width: `${shippingProgress}%` }}
              />
            </div>
          </div>

          {/* Cart Item Content */}
          <div className="mt-4 flex-1 space-y-4 overflow-y-auto pr-1">
            {latestItem ? (
              <article className="rounded-2xl border border-[var(--line)] bg-[var(--panel)] p-4 shadow-sm">
                <p className="mb-2 flex items-center gap-1 text-[10px] font-bold tracking-[0.2em] text-emerald-700 uppercase">
                  <CheckCircle2 size={12} /> Just Added To Your Bag
                </p>
                <div className="flex gap-4">
                  <div className="h-24 w-20 shrink-0 overflow-hidden rounded-xl border border-[var(--line)] bg-white">
                    <ImageWithFallback
                      src={latestItem.product.image}
                      alt={latestItem.product.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <p className="text-[10px] font-semibold text-[var(--muted)] uppercase">
                        {latestItem.product.fit} • Size {latestItem.size}
                      </p>
                      <h4 className="line-clamp-1 text-sm font-bold text-[var(--ink)]">
                        {latestItem.product.title}
                      </h4>
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-xs font-semibold text-[var(--muted)]">
                        Qty: {latestItem.qty}
                      </span>
                      <span className="text-sm font-extrabold text-[var(--ink)]">
                        {money(
                          latestItem.product.price * latestItem.qty,
                        ).replace("PKR ", "Rs. ")}
                      </span>
                    </div>
                  </div>
                </div>
              </article>
            ) : (
              <div className="py-12 text-center">
                <ShoppingBag className="mx-auto mb-3 h-12 w-12 text-[var(--muted)] opacity-60" />
                <p className="text-sm font-medium text-[var(--muted)]">
                  Your shopping bag is empty.
                </p>
              </div>
            )}

            <div className="rounded-xl border border-dashed border-[var(--line-strong)] p-4 text-center">
              <p className="mb-2 text-xs font-semibold tracking-wider text-[var(--ink)] uppercase">
                Need anything else?
              </p>
              <a
                href={getHashUrl(APP_ROUTES.shop)}
                onClick={onClose}
                className="text-xs font-bold text-[var(--ink)] underline transition hover:text-neutral-600"
              >
                Explore New Arrivals &rarr;
              </a>
            </div>
          </div>

          {/* Footer Summary & Checkout */}
          <div className="pb-safe mt-4 space-y-3 border-t border-[var(--line)] pt-4">
            <div className="flex items-center justify-between text-sm">
              <span className="font-semibold text-[var(--muted)]">
                Subtotal
              </span>
              <span className="text-lg font-black text-[var(--ink)]">
                {money(subtotal).replace("PKR ", "Rs. ")}
              </span>
            </div>
            <p className="text-[11px] text-[var(--muted)]">
              Taxes and shipping calculated at checkout. Express Delivery
              available across Pakistan.
            </p>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <a
                href={getHashUrl(APP_ROUTES.cart)}
                onClick={onClose}
                className="flex items-center justify-center rounded-xl border border-[var(--line-strong)] py-3 text-xs font-bold tracking-widest text-[var(--ink)] uppercase transition hover:bg-[var(--panel)]"
              >
                View Cart
              </a>
              <a
                href={getHashUrl(APP_ROUTES.checkout)}
                onClick={onClose}
                className="flex items-center justify-center gap-1.5 rounded-xl bg-[var(--ink)] py-3 text-xs font-bold tracking-widest text-white uppercase shadow-xl transition hover:bg-neutral-800 active:scale-98"
              >
                Checkout <ArrowRight size={14} />
              </a>
            </div>
          </div>
        </motion.aside>
      </motion.div>
    </AnimatePresence>
  );
}
