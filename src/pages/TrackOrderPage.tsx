import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  IoSearchOutline,
  IoCheckmarkCircleSharp,
} from "react-icons/io5";

export function TrackOrderPage() {
  const [orderIdInput, setOrderIdInput] = useState("");
  const [phoneInput, setPhoneInput] = useState("");
  const [isSearched, setIsSearched] = useState(false);
  const [trackingDetails, setTrackingDetails] = useState<any>(null);

  // Parse order ID from URL if present (after checkout redirect)
  useEffect(() => {
    const params = new URLSearchParams(window.location.hash.split("?")[1] || "");
    const id = params.get("id");
    if (id) {
      setOrderIdInput(id);
      setPhoneInput("03001234567"); // Mock phone number
      triggerMockSearch(id);
    }
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderIdInput.trim() || !phoneInput.trim()) return;
    triggerMockSearch(orderIdInput);
  };

  const triggerMockSearch = (id: string) => {
    setIsSearched(true);
    // Create mock tracking details
    setTrackingDetails({
      id: id,
      date: new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
      status: "Shipped",
      carrier: "Leopard Courier Services",
      trackingNumber: "LCS-928392182",
      estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
      }),
      steps: [
        { title: "Order Placed", desc: "We received your order and payment verification.", time: "June 30, 2026 - 3:15 PM", status: "completed" },
        { title: "Processing", desc: "Your garments are being quality inspected and packed.", time: "June 30, 2026 - 5:30 PM", status: "completed" },
        { title: "Shipped", desc: "Dispatched via Leopard Courier. In transit to destination hub.", time: "July 01, 2026 - 9:00 AM", status: "current" },
        { title: "Out for Delivery", desc: "Courier representative will contact you on your mobile number.", time: "Pending", status: "pending" },
        { title: "Delivered", desc: "Package will be handed over upon verification/cash collection.", time: "Pending", status: "pending" },
      ],
    });
  };

  return (
    <section className="mx-auto max-w-[900px] px-6 py-24 md:px-12 md:py-32">
      {/* Page Header */}
      <div className="border-b border-black/5 pb-8 mb-12 text-center">
        <span className="text-[10px] font-bold tracking-[0.3em] text-[var(--gold-deep)] uppercase">
          Shipping Operations
        </span>
        <h1 className="font-editorial text-4xl sm:text-5xl font-bold text-[var(--ink)] mt-3">
          Track Your Order
        </h1>
        <p className="text-xs text-[var(--muted)] mt-3 max-w-md mx-auto leading-relaxed">
          Enter your order tracking ID and mobile number to retrieve real-time logistics logs.
        </p>
      </div>

      {/* Search Box */}
      <form onSubmit={handleSearch} className="rounded-3xl border border-black/5 bg-[var(--panel)] p-6 md:p-8 shadow-sm max-w-xl mx-auto space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1">
            <label className="text-[9px] font-bold text-[var(--muted)] tracking-wider uppercase">
              Order ID
            </label>
            <input
              type="text"
              required
              value={orderIdInput}
              onChange={(e) => setOrderIdInput(e.target.value)}
              placeholder="e.g. AY-123456"
              className="h-11 rounded-xl border border-black/10 bg-white px-4 text-xs outline-none focus:border-[var(--ink)]"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[9px] font-bold text-[var(--muted)] tracking-wider uppercase">
              Phone Number
            </label>
            <input
              type="tel"
              required
              value={phoneInput}
              onChange={(e) => setPhoneInput(e.target.value)}
              placeholder="e.g. 03001234567"
              className="h-11 rounded-xl border border-black/10 bg-white px-4 text-xs outline-none focus:border-[var(--ink)]"
            />
          </div>
        </div>
        <button
          type="submit"
          className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[var(--ink)] text-white text-xs font-bold tracking-[0.2em] transition hover:bg-[var(--gold-deep)] shadow-sm"
        >
          <IoSearchOutline className="text-base" />
          <span>TRACK SHIPMENT</span>
        </button>
      </form>

      {/* Tracking Details & Timeline */}
      {isSearched && trackingDetails && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mt-12 space-y-8"
        >
          {/* Logistics Metadata */}
          <div className="rounded-3xl border border-black/5 bg-white p-6 shadow-sm grid gap-4 sm:grid-cols-2 md:grid-cols-4 text-xs">
            <div>
              <span className="text-[9px] font-bold text-[var(--muted)] tracking-wider uppercase block">
                STATUS
              </span>
              <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 font-bold px-2.5 py-0.5 rounded-full mt-1.5 uppercase tracking-wider text-[9px]">
                {trackingDetails.status}
              </span>
            </div>
            <div>
              <span className="text-[9px] font-bold text-[var(--muted)] tracking-wider uppercase block">
                COURIER PARTNER
              </span>
              <span className="text-xs font-semibold text-[var(--ink)] mt-1.5 block">
                {trackingDetails.carrier}
              </span>
            </div>
            <div>
              <span className="text-[9px] font-bold text-[var(--muted)] tracking-wider uppercase block">
                TRACKING NUMBER
              </span>
              <span className="text-xs font-mono font-semibold text-[var(--ink)] mt-1.5 block select-all">
                {trackingDetails.trackingNumber}
              </span>
            </div>
            <div>
              <span className="text-[9px] font-bold text-[var(--muted)] tracking-wider uppercase block">
                ESTIMATED DELIVERY
              </span>
              <span className="text-xs font-semibold text-[var(--gold-deep)] mt-1.5 block">
                {trackingDetails.estimatedDelivery}
              </span>
            </div>
          </div>

          {/* Timeline */}
          <div className="rounded-3xl border border-black/5 bg-white p-6 md:p-8 shadow-sm">
            <h3 className="font-editorial text-2xl font-bold text-[var(--ink)] mb-8">
              Shipment History
            </h3>

            <div className="relative pl-8 space-y-10">
              {/* Vertical line */}
              <div className="absolute left-4 top-2 bottom-2 w-[2px] bg-black/5">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: "50%" }} // Highlight up to the 3rd step (index 2: Shipped)
                  transition={{ duration: 1.5, ease: "easeInOut" }}
                  className="w-full bg-[var(--gold-deep)]"
                />
              </div>

              {trackingDetails.steps.map((step: any, index: number) => {
                const isCompleted = step.status === "completed";
                const isCurrent = step.status === "current";
                const isPending = step.status === "pending";

                return (
                  <div key={index} className="relative flex flex-col md:flex-row md:items-start gap-4 md:gap-12">
                    {/* Bullet */}
                    <div className="absolute -left-[28px] top-1 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-white">
                      {isCompleted && (
                        <IoCheckmarkCircleSharp className="text-2xl text-[var(--gold-deep)] bg-white" />
                      )}
                      {isCurrent && (
                        <div className="h-5 w-5 rounded-full border-4 border-[var(--gold-deep)] bg-white flex items-center justify-center animate-ping" />
                      )}
                      {isCurrent && (
                        <div className="absolute h-3 w-3 rounded-full bg-[var(--gold-deep)]" />
                      )}
                      {isPending && (
                        <div className="h-4 w-4 rounded-full border-2 border-black/10 bg-white" />
                      )}
                    </div>

                    <div className="flex-1">
                      <h4
                        className={`text-sm font-bold tracking-wide ${
                          isCompleted
                            ? "text-[var(--ink)]"
                            : isCurrent
                              ? "text-[var(--gold-deep)]"
                              : "text-[var(--muted)]"
                        }`}
                      >
                        {step.title}
                      </h4>
                      <p className="text-xs text-[var(--muted)] mt-1 max-w-md leading-relaxed">
                        {step.desc}
                      </p>
                    </div>

                    <div className="w-40 text-left md:text-right shrink-0">
                      <span className={`text-[10px] font-bold tracking-wider uppercase ${
                        isPending ? "text-black/20" : "text-[var(--muted)]"
                      }`}>
                        {step.time}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>
      )}
    </section>
  );
}
