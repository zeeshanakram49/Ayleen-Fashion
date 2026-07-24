import { useState } from "react";
import { motion } from "framer-motion";
import {
  IoShieldCheckmarkOutline,
  IoAlertCircleOutline,
  IoCheckmarkCircleSharp,
  IoLockClosedOutline,
  IoReloadOutline,
} from "react-icons/io5";
import { PaymentSelector } from "../components/PaymentSelector";
import { money } from "../lib/store";
import type { CartRow, CheckoutState } from "../types/store";

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

type CheckoutStatus = "filling" | "processing" | "success" | "failure";

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
  const [status, setStatus] = useState<CheckoutStatus>("filling");
  const [mockOrderId, setMockOrderId] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Basic Validation
    if (!checkout.fullName || !checkout.phone || !checkout.address || !checkout.city) {
      return;
    }

    // Enter Processing State
    setStatus("processing");

    // Simulate Payment Processing API Call
    setTimeout(() => {
      // Demo Failure Scenario: If payment is CARD and card number ends with "3", fail.
      if (checkout.payment === "CARD" && checkout.cardNumber?.endsWith("3")) {
        setStatus("failure");
        setErrorMessage(
          "Your card was declined by the bank. Please check your card details or try a different payment method."
        );
        return;
      }

      // Generate Order ID
      const orderId = `AY-${Math.floor(100000 + Math.random() * 900000)}`;
      setMockOrderId(orderId);

      // Trigger Parent App's Order Placement (clears cart, etc.)
      onPlaceOrder(e);

      setStatus("success");
    }, 2500);
  };

  // Calculate estimated delivery date (3-5 days from now)
  const getEstimatedDeliveryDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + 4);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Get human readable payment name
  const getPaymentMethodLabel = () => {
    switch (checkout.payment) {
      case "COD":
        return "Cash on Delivery";
      case "CARD":
        return "Stripe Card Payment";
      case "JAZZCASH":
        return "JazzCash Wallet";
      case "EASYPAISA":
        return "Easypaisa Wallet";
      case "BANK":
        return "Direct Bank Transfer";
      default:
        return "COD";
    }
  };

  return (
    <section className="mx-auto max-w-[1300px] px-6 py-24 md:px-12 md:py-32">
      {/* 1. PROCESSING STATE */}
      {status === "processing" && (
        <div className="flex flex-col items-center justify-center py-24 text-center min-h-[50vh]">
          <div className="relative flex items-center justify-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
              className="h-20 w-20 rounded-full border-4 border-black/5 border-t-[var(--gold-deep)]"
            />
            <IoLockClosedOutline className="absolute text-2xl text-[var(--gold-deep)]" />
          </div>
          <h2 className="font-editorial text-3xl font-bold text-[var(--ink)] mt-8">
            Securing Your Order...
          </h2>
          <p className="text-xs text-[var(--muted)] mt-3 max-w-xs leading-relaxed">
            Please do not refresh the page or click back. We are securely processing your transaction through our backend gateways.
          </p>
        </div>
      )}

      {/* 2. FAILURE STATE */}
      {status === "failure" && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-3xl border border-red-100 bg-red-50/50 p-8 md:p-12 text-center max-w-xl mx-auto py-16 shadow-lg"
        >
          <IoAlertCircleOutline className="text-6xl text-red-500 mx-auto" />
          <h2 className="font-editorial text-3xl font-bold text-red-950 mt-6">
            Payment Transaction Failed
          </h2>
          <p className="text-xs text-red-800 mt-3 leading-relaxed max-w-md mx-auto">
            {errorMessage}
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => setStatus("filling")}
              className="flex items-center justify-center gap-2 rounded-xl bg-red-950 text-white px-6 py-3 text-xs font-bold tracking-widest hover:bg-red-900 transition shadow-md"
            >
              <IoReloadOutline />
              <span>RETRY PAYMENT</span>
            </button>
            <button
              onClick={() => {
                onCheckoutChange("payment", "COD");
                setStatus("filling");
              }}
              className="rounded-xl border border-red-950/20 text-red-950 px-6 py-3 text-xs font-bold tracking-widest hover:bg-red-50 transition"
            >
              PAY WITH CASH ON DELIVERY
            </button>
          </div>
        </motion.div>
      )}

      {/* 3. SUCCESS STATE */}
      {status === "success" && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto space-y-8"
        >
          {/* Success Banner */}
          <div className="rounded-3xl border border-black/5 bg-[var(--panel)] p-8 md:p-12 text-center shadow-sm">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
              className="inline-block"
            >
              <IoCheckmarkCircleSharp className="text-6xl text-[var(--gold-deep)] mx-auto" />
            </motion.div>
            <span className="text-[9px] font-bold tracking-[0.3em] text-[var(--gold-deep)] uppercase block mt-4">
              Thank You
            </span>
            <h2 className="font-editorial text-4xl font-bold text-[var(--ink)] mt-2">
              Order Confirmed
            </h2>
            <p className="text-xs text-[var(--muted)] mt-3 max-w-md mx-auto leading-relaxed">
              Your order has been successfully placed. A confirmation email with details has been sent to{" "}
              <span className="font-semibold text-[var(--ink)]">{checkout.email || "your address"}</span>.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-3 max-w-xl mx-auto border-t border-b border-black/5 py-6 text-left">
              <div>
                <span className="text-[9px] font-bold text-[var(--muted)] tracking-wider uppercase block">
                  ORDER ID
                </span>
                <span className="text-xs font-bold text-[var(--ink)] mt-1 block select-all">
                  {mockOrderId || placedOrder}
                </span>
              </div>
              <div>
                <span className="text-[9px] font-bold text-[var(--muted)] tracking-wider uppercase block">
                  PAYMENT METHOD
                </span>
                <span className="text-xs font-semibold text-[var(--ink)] mt-1 block">
                  {getPaymentMethodLabel()}
                </span>
              </div>
              <div>
                <span className="text-[9px] font-bold text-[var(--muted)] tracking-wider uppercase block">
                  EST. DELIVERY
                </span>
                <span className="text-xs font-semibold text-[var(--ink)] mt-1 block">
                  3 - 5 Working Days
                </span>
              </div>
            </div>

            <p className="text-xs font-medium text-emerald-600 mt-6 flex items-center justify-center gap-1.5 bg-emerald-50 border border-emerald-100 py-2.5 px-4 rounded-xl max-w-md mx-auto">
              <IoShieldCheckmarkOutline className="text-base" />
              <span>Estimated Delivery: {getEstimatedDeliveryDate()}</span>
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="#/shop"
              className="flex h-12 items-center justify-center rounded-xl bg-[var(--ink)] text-white text-xs font-bold tracking-[0.2em] px-8 hover:bg-[var(--gold-deep)] transition shadow-md"
            >
              CONTINUE SHOPPING
            </a>
            <a
              href={`#/track-order?id=${mockOrderId || placedOrder}`}
              className="flex h-12 items-center justify-center rounded-xl border border-black/10 text-[var(--ink)] text-xs font-bold tracking-[0.2em] px-8 hover:bg-black/[0.02] transition"
            >
              TRACK YOUR ORDER
            </a>
          </div>
        </motion.div>
      )}

      {/* 4. FILLING STATE (FORM) */}
      {status === "filling" && (
        <form onSubmit={handleFormSubmit} className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          {/* Left Column - Form */}
          <div className="space-y-8">
            <div className="border-b border-black/5 pb-6">
              <span className="text-[10px] font-bold tracking-[0.3em] text-[var(--gold-deep)] uppercase">
                Secure checkout
              </span>
              <h1 className="font-editorial text-4xl sm:text-5xl font-bold text-[var(--ink)] mt-3">
                Checkout
              </h1>
            </div>

            {/* Delivery Details Block */}
            <div className="space-y-5">
              <h3 className="text-lg font-bold tracking-wider uppercase text-[var(--ink)]">
                Delivery Details
              </h3>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-[var(--muted)] tracking-wider uppercase">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={checkout.fullName}
                    onChange={(e) => onCheckoutChange("fullName", e.target.value)}
                    placeholder="Enter your full name"
                    className="h-11 rounded-xl border border-black/10 bg-white px-4 text-xs outline-none focus:border-[var(--ink)]"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-[var(--muted)] tracking-wider uppercase">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    required
                    value={checkout.phone}
                    onChange={(e) => onCheckoutChange("phone", e.target.value)}
                    placeholder="e.g. 03001234567"
                    className="h-11 rounded-xl border border-black/10 bg-white px-4 text-xs outline-none focus:border-[var(--ink)]"
                  />
                </div>

                <div className="flex flex-col gap-1 sm:col-span-2">
                  <label className="text-[10px] font-bold text-[var(--muted)] tracking-wider uppercase">
                    Email Address (Optional)
                  </label>
                  <input
                    type="email"
                    value={checkout.email}
                    onChange={(e) => onCheckoutChange("email", e.target.value)}
                    placeholder="you@example.com"
                    className="h-11 rounded-xl border border-black/10 bg-white px-4 text-xs outline-none focus:border-[var(--ink)]"
                  />
                </div>

                <div className="flex flex-col gap-1 sm:col-span-2">
                  <label className="text-[10px] font-bold text-[var(--muted)] tracking-wider uppercase">
                    Shipping Address
                  </label>
                  <input
                    type="text"
                    required
                    value={checkout.address}
                    onChange={(e) => onCheckoutChange("address", e.target.value)}
                    placeholder="House number, street name, apartment, area"
                    className="h-11 rounded-xl border border-black/10 bg-white px-4 text-xs outline-none focus:border-[var(--ink)]"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-[var(--muted)] tracking-wider uppercase">
                    City
                  </label>
                  <input
                    type="text"
                    required
                    value={checkout.city}
                    onChange={(e) => onCheckoutChange("city", e.target.value)}
                    placeholder="e.g. Lahore, Karachi, Islamabad"
                    className="h-11 rounded-xl border border-black/10 bg-white px-4 text-xs outline-none focus:border-[var(--ink)]"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-[var(--muted)] tracking-wider uppercase">
                    Country
                  </label>
                  <input
                    type="text"
                    disabled
                    value="Pakistan"
                    className="h-11 rounded-xl border border-black/5 bg-black/[0.02] px-4 text-xs outline-none text-[var(--muted)]"
                  />
                </div>

                <div className="flex flex-col gap-1 sm:col-span-2">
                  <label className="text-[10px] font-bold text-[var(--muted)] tracking-wider uppercase">
                    Order Note (Optional)
                  </label>
                  <textarea
                    value={checkout.note}
                    onChange={(e) => onCheckoutChange("note", e.target.value)}
                    placeholder="Instructions for courier representative..."
                    className="min-h-24 rounded-xl border border-black/10 bg-white px-4 py-3 text-xs outline-none focus:border-[var(--ink)] resize-none"
                  />
                </div>
              </div>
            </div>

            <hr className="border-black/5" />

            {/* Payment Selector Component */}
            <PaymentSelector
              payment={checkout.payment}
              checkout={checkout}
              onChangePayment={(p) => onCheckoutChange("payment", p)}
              onCheckoutChange={onCheckoutChange}
            />
          </div>

          {/* Right Column - Summary */}
          <aside className="sticky top-28 space-y-6">
            <div className="rounded-3xl border border-black/5 bg-[var(--panel)] p-6 space-y-6 shadow-sm">
              <h3 className="font-editorial text-2xl font-bold text-[var(--ink)]">
                Order Items
              </h3>

              {/* Items List */}
              <div className="max-h-60 overflow-y-auto space-y-4 pr-2">
                {cartRows.map((row) => (
                  <div key={`${row.product.id}-${row.size}`} className="flex gap-3 text-xs">
                    <img
                      src={row.product.image}
                      alt={row.product.title}
                      className="h-16 w-12 rounded-lg object-cover bg-white"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-[var(--ink)] truncate">{row.product.title}</h4>
                      <p className="text-[10px] text-[var(--muted)] mt-0.5">
                        SIZE {row.size} • QTY {row.qty}
                      </p>
                    </div>
                    <span className="font-semibold text-[var(--ink)] shrink-0">
                      {money(row.product.price * row.qty)}
                    </span>
                  </div>
                ))}
              </div>

              <hr className="border-black/5" />

              {/* Cost Summary */}
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
                  <span>Sales Tax</span>
                  <span className="font-semibold text-[var(--ink)]">{money(tax)}</span>
                </div>

                <hr className="border-black/5 pt-1" />

                <div className="flex justify-between text-sm font-bold text-[var(--ink)]">
                  <span>Total Amount</span>
                  <span>{money(total)}</span>
                </div>
              </div>

              {/* Secure Lock Badge */}
              <div className="flex items-center gap-2 justify-center text-[10px] text-emerald-600 font-bold bg-emerald-50 border border-emerald-100 rounded-xl py-2 px-4">
                <IoShieldCheckmarkOutline className="text-base" />
                <span>SSL SECURED & CHECKED OUT</span>
              </div>

              <button
                type="submit"
                className="flex h-12 w-full items-center justify-center rounded-xl bg-[var(--ink)] text-white text-xs font-bold tracking-[0.2em] transition hover:bg-[var(--gold-deep)] shadow-md"
              >
                PLACE SECURE ORDER
              </button>
            </div>
          </aside>
        </form>
      )}
    </section>
  );
}
