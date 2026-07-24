import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoAddOutline, IoRemoveOutline, IoTrashOutline, IoCartOutline, IoTicketOutline } from "react-icons/io5";
import { ProductCard } from "../components/ProductCard";
import { products } from "../data/store";
import { installmentAmount, money } from "../lib/store";
import type { CartRow } from "../types/store";

type CartPageProps = {
  rows: CartRow[];
  cartCount: number;
  cartSubtotal: number;
  shipping: number;
  tax: number;
  total: number;
  onUpdateQty: (productId: string, size: string, qty: number) => void;
  onRemoveLine: (productId: string, size: string) => void;
  wishlist: string[];
  selectedSize: Record<string, string>;
  onPickSize: (productId: string, size: string) => void;
  onToggleWishlist: (productId: string) => void;
  onAddToCart: (productId: string, fallbackSize?: string, requireSelection?: boolean, qty?: number) => void;
  onOpenProduct: (slug: string) => void;
};

export function CartPage({
  rows,
  cartCount,
  cartSubtotal,
  shipping,
  tax,
  total,
  onUpdateQty,
  onRemoveLine,
  wishlist,
  selectedSize,
  onPickSize,
  onToggleWishlist,
  onAddToCart,
  onOpenProduct,
}: CartPageProps) {
  const [couponCode, setCouponCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState(0); // in PKR
  const [couponError, setCouponError] = useState("");
  const [couponSuccess, setCouponSuccess] = useState("");

  const freeShippingThreshold = 6000;
  const progressPercent = Math.min((cartSubtotal / freeShippingThreshold) * 100, 100);
  const awayFromFree = freeShippingThreshold - cartSubtotal;

  // Apply Promo Code
  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError("");
    setCouponSuccess("");

    if (couponCode.trim().toUpperCase() === "AYLEEN10") {
      const discount = Math.round(cartSubtotal * 0.1);
      setAppliedDiscount(discount);
      setCouponSuccess("Promo code 'AYLEEN10' (10% Off) applied successfully!");
    } else if (couponCode.trim() === "") {
      setCouponError("Please enter a promo code.");
    } else {
      setCouponError("Invalid promo code. Try 'AYLEEN10'.");
    }
  };

  const finalTotal = Math.max(0, total - appliedDiscount);

  // Recommendations: products not in cart
  const recommendations = useMemo(() => {
    const cartProductIds = rows.map((r) => r.productId);
    return products.filter((p) => !cartProductIds.includes(p.id)).slice(0, 4);
  }, [rows]);

  return (
    <section className="mx-auto max-w-[1400px] px-6 py-24 md:px-12 md:py-32">
      {/* Page Title */}
      <div className="border-b border-black/5 pb-8 mb-12 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold tracking-[0.3em] text-[var(--gold-deep)] uppercase">
            Review Order
          </span>
          <h1 className="font-editorial text-4xl sm:text-5xl font-bold text-[var(--ink)] mt-3">
            Shopping Bag
          </h1>
        </div>
        <p className="text-xs font-semibold text-[var(--muted)] tracking-wider">
          {cartCount} ITEMS SELECTED
        </p>
      </div>

      {rows.length === 0 ? (
        // Empty Cart State
        <motion.article
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-3xl border border-black/5 bg-[var(--panel)] p-12 text-center max-w-lg mx-auto py-20"
        >
          <IoCartOutline className="text-5xl text-black/20 border-2 border-dashed border-black/10 rounded-full p-2 mx-auto" />
          <h2 className="font-editorial text-2xl mt-6 font-semibold text-[var(--ink)]">
            Your bag is currently empty
          </h2>
          <p className="text-xs text-[var(--muted)] mt-2 leading-relaxed max-w-xs mx-auto">
            Before you can proceed to checkout, you must add some premium items to your shopping bag.
          </p>
          <a
            href="#/shop"
            className="mt-8 inline-flex rounded-full bg-[var(--ink)] px-8 py-3.5 text-xs font-bold tracking-widest text-white hover:bg-[var(--gold-deep)] transition shadow-md"
          >
            START SHOPPING
          </a>
        </motion.article>
      ) : (
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] items-start">
          {/* Left Column - Cart Items List */}
          <div className="space-y-6">
            {/* Free Shipping Meter */}
            <div className="rounded-2xl border border-black/5 bg-black/[0.01] p-5">
              {awayFromFree > 0 ? (
                <p className="text-xs text-[var(--muted)]">
                  You are only <span className="font-bold text-[var(--ink)]">{money(awayFromFree)}</span> away from{" "}
                  <span className="font-semibold text-[var(--gold-deep)]">Free Shipping</span>.
                </p>
              ) : (
                <p className="text-xs font-semibold text-emerald-600">
                  Your order qualifies for <span className="underline">Free Shipping</span>.
                </p>
              )}
              <div className="mt-3 h-2 w-full rounded-full bg-black/5 overflow-hidden">
                <div
                  className="h-full bg-[var(--gold-deep)] transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            <div className="space-y-4">
              <AnimatePresence>
                {rows.map((row, index) => (
                  <motion.article
                    key={`${row.product.id}-${row.size}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.35, delay: index * 0.05 }}
                    className="flex flex-col sm:flex-row items-stretch gap-5 rounded-3xl border border-black/5 p-5 bg-white shadow-sm hover:shadow-md transition"
                  >
                    {/* Item Image */}
                    <img
                      src={row.product.image}
                      alt={row.product.title}
                      className="h-36 w-28 rounded-2xl object-cover bg-[var(--panel)] mx-auto sm:mx-0"
                    />

                    {/* Item Details */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-[9px] font-bold tracking-wider text-[var(--gold-deep)] uppercase">
                            {row.product.categoryLabel}
                          </p>
                          <h3 className="font-editorial text-2xl font-semibold text-[var(--ink)] mt-1">
                            {row.product.title}
                          </h3>
                          <p className="text-[10px] text-[var(--muted)] font-bold tracking-wider uppercase mt-1">
                            SIZE: {row.size}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => onRemoveLine(row.product.id, row.size)}
                          className="flex h-8 w-8 items-center justify-center rounded-full border border-red-100 text-red-500 hover:bg-red-50 transition"
                          aria-label="Remove item"
                        >
                          <IoTrashOutline />
                        </button>
                      </div>

                      {/* Controls and pricing */}
                      <div className="flex flex-wrap items-end justify-between gap-4 mt-6">
                        <div className="flex items-center border border-black/10 rounded-xl overflow-hidden h-9 bg-white">
                          <button
                            type="button"
                            onClick={() => onUpdateQty(row.product.id, row.size, row.qty - 1)}
                            className="flex h-full w-9 items-center justify-center text-base text-[var(--muted)] hover:bg-black/5"
                          >
                            <IoRemoveOutline />
                          </button>
                          <span className="w-10 text-center text-xs font-semibold text-[var(--ink)]">
                            {row.qty}
                          </span>
                          <button
                            type="button"
                            onClick={() => onUpdateQty(row.product.id, row.size, row.qty + 1)}
                            className="flex h-full w-9 items-center justify-center text-base text-[var(--muted)] hover:bg-black/5"
                          >
                            <IoAddOutline />
                          </button>
                        </div>

                        <div className="text-right">
                          <span className="text-base font-bold text-[var(--ink)]">
                            {money(row.product.price * row.qty)}
                          </span>
                          <p className="text-[9px] text-[var(--muted)] mt-1">
                            3 installments of {money(installmentAmount(row.product.price))}
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.article>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <aside className="space-y-6">
            {/* Promo Code Box */}
            <div className="rounded-3xl border border-black/5 bg-white p-6 shadow-sm">
              <h3 className="font-editorial text-xl font-bold text-[var(--ink)] flex items-center gap-2">
                <IoTicketOutline />
                <span>Promo Code</span>
              </h3>
              <form onSubmit={handleApplyCoupon} className="mt-4 flex gap-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="Enter code (e.g. AYLEEN10)"
                  className="flex-1 h-10 rounded-xl border border-black/10 bg-white px-3 text-xs uppercase outline-none focus:border-[var(--ink)]"
                />
                <button
                  type="submit"
                  className="h-10 rounded-xl bg-[var(--ink)] px-5 text-[10px] font-bold tracking-widest text-white hover:bg-[var(--gold-deep)] transition"
                >
                  APPLY
                </button>
              </form>
              {couponError && (
                <p className="text-[10px] font-semibold text-red-500 mt-2">{couponError}</p>
              )}
              {couponSuccess && (
                <p className="text-[10px] font-semibold text-emerald-600 mt-2">{couponSuccess}</p>
              )}
            </div>

            {/* Price Breakdown */}
            <div className="rounded-3xl border border-black/5 bg-[var(--panel)] p-6 space-y-5 shadow-sm">
              <h3 className="font-editorial text-2xl font-bold text-[var(--ink)]">
                Order Summary
              </h3>

              <div className="space-y-3 text-xs text-[var(--muted)]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-[var(--ink)]">{money(cartSubtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="font-semibold text-[var(--ink)]">
                    {shipping === 0 ? "Free" : money(shipping)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Sales Tax (3%)</span>
                  <span className="font-semibold text-[var(--ink)]">{money(tax)}</span>
                </div>

                {appliedDiscount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>Discount (10% Off)</span>
                    <span>-{money(appliedDiscount)}</span>
                  </div>
                )}

                <hr className="border-black/5 pt-1" />

                <div className="flex justify-between text-sm font-bold text-[var(--ink)]">
                  <span>Total Amount</span>
                  <span>{money(finalTotal)}</span>
                </div>
              </div>

              <div className="bg-white/50 border border-black/5 rounded-2xl p-4 text-[10px] text-[var(--muted)] leading-relaxed space-y-1">
                <p className="font-semibold text-[var(--ink)]">DELIVERY & POLICIES</p>
                <p>• Estimated delivery time: 3 - 5 working days.</p>
                <p>• Secure checkout with COD, Stripe, JazzCash, Easypaisa, or Bank Transfer.</p>
                <p>• Hassle-free exchanges within 7 days of receipt.</p>
              </div>

              <a
                href="#/checkout"
                className="flex h-12 w-full items-center justify-center rounded-xl bg-[var(--ink)] text-white text-xs font-bold tracking-[0.2em] transition hover:bg-[var(--gold-deep)] shadow-md"
              >
                PROCEED TO CHECKOUT
              </a>
            </div>
          </aside>
        </div>
      )}

      {/* Recommended Products Section */}
      {recommendations.length > 0 && (
        <div className="mt-28 border-t border-black/5 pt-16">
          <div className="mb-8">
            <span className="text-[10px] font-bold tracking-[0.3em] text-[var(--gold-deep)] uppercase">
              Curated Picks
            </span>
            <h2 className="font-editorial mt-3 text-3xl font-bold text-[var(--ink)]">
              Recommended for You
            </h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {recommendations.map((item, index) => (
              <ProductCard
                key={item.id}
                product={item}
                index={index}
                liked={wishlist.includes(item.id)}
                pickedSize={selectedSize[item.id]}
                compact
                onPickSize={onPickSize}
                onToggleWishlist={onToggleWishlist}
                onAddToCart={onAddToCart}
                onOpenProduct={onOpenProduct}
              />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
