import { motion, AnimatePresence } from "framer-motion";
import { IoCloseOutline, IoAddOutline, IoRemoveOutline, IoTrashOutline } from "react-icons/io5";
import { installmentAmount, money } from "../lib/store";
import type { CartRow } from "../types/store";

type CartDrawerProps = {
  open: boolean;
  rows: CartRow[];
  cartCount: number;
  subtotal: number;
  onClose: () => void;
  onUpdateQty: (productId: string, size: string, qty: number) => void;
  onRemoveLine: (productId: string, size: string) => void;
};

export function CartDrawer({
  open,
  rows,
  cartCount,
  subtotal,
  onClose,
  onUpdateQty,
  onRemoveLine,
}: CartDrawerProps) {
  const freeShippingThreshold = 6000;
  const awayFromFree = freeShippingThreshold - subtotal;
  const progressPercent = Math.min((subtotal / freeShippingThreshold) * 100, 100);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black"
          />

          {/* Drawer Panel */}
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.35, ease: "easeInOut" }}
            className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col border-l border-black/5 bg-white shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-black/5 px-6 py-6">
              <div>
                <span className="text-[9px] font-bold tracking-[0.3em] text-[var(--gold-deep)] uppercase">
                  Your Bag
                </span>
                <h2 className="font-editorial text-2xl font-bold mt-1 text-[var(--ink)]">
                  Shopping Cart ({cartCount})
                </h2>
              </div>
              <button
                onClick={onClose}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-black/5 text-2xl transition hover:bg-black/10 text-[var(--ink)]"
                aria-label="Close cart"
              >
                <IoCloseOutline />
              </button>
            </div>

            {/* Free Shipping Meter */}
            <div className="border-b border-black/5 bg-black/[0.01] px-6 py-4">
              {awayFromFree > 0 ? (
                <p className="text-xs text-[var(--muted)]">
                  You are <span className="font-bold text-[var(--ink)]">{money(awayFromFree)}</span> away from{" "}
                  <span className="font-semibold text-[var(--gold-deep)]">Free Shipping</span>.
                </p>
              ) : (
                <p className="text-xs font-semibold text-emerald-600">
                  Congratulations! You qualify for <span className="underline">Free Shipping</span>.
                </p>
              )}
              <div className="mt-2.5 h-1.5 w-full rounded-full bg-black/5 overflow-hidden">
                <div
                  className="h-full bg-[var(--gold-deep)] transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              {rows.length > 0 ? (
                rows.map((row) => (
                  <div
                    key={`${row.product.id}-${row.size}`}
                    className="flex items-start gap-4 border-b border-black/5 pb-4"
                  >
                    <img
                      src={row.product.image}
                      alt={row.product.title}
                      className="h-24 w-18 rounded-xl object-cover bg-[var(--panel)]"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-[9px] font-bold tracking-wider text-[var(--gold-deep)] uppercase">
                        {row.product.categoryLabel}
                      </p>
                      <h4 className="font-medium text-sm text-[var(--ink)] truncate mt-0.5">
                        {row.product.title}
                      </h4>
                      <p className="text-[10px] text-[var(--muted)] mt-1 font-semibold tracking-wider uppercase">
                        SIZE: {row.size}
                      </p>

                      {/* Quantity Selector & Remove Button */}
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center border border-black/15 rounded-lg overflow-hidden h-7 bg-white">
                          <button
                            type="button"
                            onClick={() => onUpdateQty(row.productId, row.size, row.qty - 1)}
                            className="flex h-full w-7 items-center justify-center text-sm text-[var(--muted)] hover:bg-black/5 transition"
                          >
                            <IoRemoveOutline />
                          </button>
                          <span className="w-8 text-center text-xs font-semibold text-[var(--ink)]">
                            {row.qty}
                          </span>
                          <button
                            type="button"
                            onClick={() => onUpdateQty(row.productId, row.size, row.qty + 1)}
                            className="flex h-full w-7 items-center justify-center text-sm text-[var(--muted)] hover:bg-black/5 transition"
                          >
                            <IoAddOutline />
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => onRemoveLine(row.productId, row.size)}
                          className="flex h-7 w-7 items-center justify-center rounded-lg border border-red-100 text-red-500 hover:bg-red-50 transition"
                          aria-label="Remove item"
                        >
                          <IoTrashOutline />
                        </button>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-semibold text-[var(--ink)]">
                        {money(row.product.price * row.qty)}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <IoCloseOutline className="text-5xl text-black/10 border-2 border-dashed border-black/10 rounded-full p-2" />
                  <h3 className="font-editorial text-xl mt-4 font-semibold text-[var(--ink)]">
                    Your bag is empty
                  </h3>
                  <p className="text-xs text-[var(--muted)] mt-2 max-w-[220px]">
                    Explore our curated collections and add your favorite items.
                  </p>
                  <button
                    onClick={onClose}
                    className="mt-6 rounded-full bg-[var(--ink)] px-6 py-2.5 text-[10px] font-bold tracking-widest text-white hover:bg-[var(--gold-deep)] transition"
                  >
                    CONTINUE SHOPPING
                  </button>
                </div>
              )}
            </div>

            {/* Summary & Footer (Only show if cart has items) */}
            {rows.length > 0 && (
              <div className="border-t border-black/5 bg-[var(--panel)] p-6 space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-[var(--muted)]">Subtotal</span>
                    <span className="font-semibold text-[var(--ink)]">{money(subtotal)}</span>
                  </div>
                  <p className="text-[10px] text-[var(--muted)] leading-relaxed">
                    Taxes and shipping calculated at checkout. Easy 30-day returns. Pay in 3 installments of{" "}
                    <span className="font-semibold text-[var(--ink)]">
                      {money(installmentAmount(subtotal))}
                    </span>
                  </p>
                </div>

                <div className="grid gap-2.5 text-xs tracking-[0.2em] font-bold">
                  <a
                    href="#/cart"
                    onClick={onClose}
                    className="flex h-11 items-center justify-center rounded-xl bg-white border border-black/10 text-[var(--ink)] transition hover:border-[var(--ink)]"
                  >
                    VIEW BAG
                  </a>
                  <a
                    href="#/checkout"
                    onClick={onClose}
                    className="flex h-11 items-center justify-center rounded-xl bg-[var(--ink)] text-white transition hover:bg-[var(--gold-deep)]"
                  >
                    CHECKOUT
                  </a>
                </div>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
