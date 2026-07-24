import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  IoCardOutline,
  IoCashOutline,
  IoBriefcaseOutline,
  IoCheckmarkCircle,
  IoLockClosedOutline,
  IoCloudUploadOutline,
} from "react-icons/io5";
import type { CheckoutState } from "../types/store";

type PaymentSelectorProps = {
  payment: CheckoutState["payment"];
  checkout: CheckoutState;
  onChangePayment: (payment: CheckoutState["payment"]) => void;
  onCheckoutChange: (field: keyof CheckoutState, value: string) => void;
};

export function PaymentSelector({
  payment,
  checkout,
  onChangePayment,
  onCheckoutChange,
}: PaymentSelectorProps) {
  const [dragOver, setDragOver] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFileName(file.name);
      onCheckoutChange("bankScreenshot", file.name);
    }
  };

  const methods = [
    {
      id: "COD" as const,
      title: "Cash on Delivery",
      description: "Pay with cash upon delivery",
      icon: <IoCashOutline className="text-2xl text-emerald-600" />,
    },
    {
      id: "CARD" as const,
      title: "Stripe Card Payment",
      description: "Secure credit/debit card",
      icon: <IoCardOutline className="text-2xl text-blue-600" />,
    },
    {
      id: "JAZZCASH" as const,
      title: "JazzCash Mobile Wallet",
      description: "Pay via JazzCash app or mobile",
      icon: (
        <span className="flex h-6 items-center justify-center rounded bg-red-600 px-1.5 text-[9px] font-black text-white tracking-tighter">
          JCASH
        </span>
      ),
    },
    {
      id: "EASYPAISA" as const,
      title: "Easypaisa Mobile Wallet",
      description: "Pay via Easypaisa account",
      icon: (
        <span className="flex h-6 items-center justify-center rounded bg-green-500 px-1.5 text-[9px] font-black text-white tracking-tighter">
          EPASA
        </span>
      ),
    },
    {
      id: "BANK" as const,
      title: "Bank Transfer",
      description: "Manual bank account transfer",
      icon: <IoBriefcaseOutline className="text-2xl text-amber-600" />,
    },
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold tracking-wider uppercase text-[var(--ink)] mb-4">
        Payment Method
      </h3>

      <div className="grid gap-3 sm:grid-cols-1">
        {methods.map((method) => {
          const isSelected = payment === method.id;

          return (
            <div
              key={method.id}
              className={`overflow-hidden rounded-2xl border-2 transition-all duration-300 ${
                isSelected
                  ? "border-[var(--ink)] bg-black/[0.01] shadow-md"
                  : "border-black/5 bg-white hover:border-black/20 hover:shadow-sm"
              }`}
            >
              {/* Main Card Header */}
              <button
                type="button"
                onClick={() => onChangePayment(method.id)}
                className="flex w-full items-center justify-between p-4 text-left"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-black/[0.03]">
                    {method.icon}
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-[var(--ink)]">
                      {method.title}
                    </h4>
                    <p className="text-xs text-[var(--muted)] mt-0.5">
                      {method.description}
                    </p>
                  </div>
                </div>
                <div className="relative flex h-6 w-6 items-center justify-center">
                  <AnimatePresence>
                    {isSelected ? (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      >
                        <IoCheckmarkCircle className="text-2xl text-[var(--ink)]" />
                      </motion.div>
                    ) : (
                      <div className="h-5 w-5 rounded-full border border-black/20" />
                    )}
                  </AnimatePresence>
                </div>
              </button>

              {/* Sub-form fields (expandable) */}
              <AnimatePresence initial={false}>
                {isSelected && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                    className="border-t border-black/5 bg-black/[0.005]"
                  >
                    <div className="p-4 space-y-4">
                      {/* JAZZCASH FORM */}
                      {method.id === "JAZZCASH" && (
                        <div className="space-y-3">
                          <p className="text-xs text-[var(--muted)] leading-relaxed">
                            You will receive a secure payment request on your mobile phone. Please enter your JazzCash account details below.
                          </p>
                          <div className="grid gap-3 sm:grid-cols-2">
                            <div className="flex flex-col gap-1">
                              <label className="text-[10px] font-bold text-[var(--muted)] tracking-wider uppercase">
                                Mobile Number
                              </label>
                              <input
                                type="tel"
                                required
                                placeholder="e.g. 03001234567"
                                value={checkout.jazzcashMobile || ""}
                                onChange={(e) =>
                                  onCheckoutChange("jazzcashMobile", e.target.value)
                                }
                                className="h-10 rounded-lg border border-black/15 bg-white px-3 text-xs outline-none focus:border-[var(--ink)]"
                              />
                            </div>
                            <div className="flex flex-col gap-1">
                              <label className="text-[10px] font-bold text-[var(--muted)] tracking-wider uppercase">
                                CNIC Last 6 Digits
                              </label>
                              <input
                                type="text"
                                required
                                maxLength={6}
                                placeholder="e.g. 123456"
                                value={checkout.cnicLast6 || ""}
                                onChange={(e) =>
                                  onCheckoutChange("cnicLast6", e.target.value)
                                }
                                className="h-10 rounded-lg border border-black/15 bg-white px-3 text-xs outline-none focus:border-[var(--ink)]"
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {/* EASYPAISA FORM */}
                      {method.id === "EASYPAISA" && (
                        <div className="space-y-3">
                          <p className="text-xs text-[var(--muted)] leading-relaxed">
                            Please provide your Easypaisa account details. You will receive an authorization prompt or app notification to approve.
                          </p>
                          <div className="grid gap-3 sm:grid-cols-2">
                            <div className="flex flex-col gap-1">
                              <label className="text-[10px] font-bold text-[var(--muted)] tracking-wider uppercase">
                                Mobile Number
                              </label>
                              <input
                                type="tel"
                                required
                                placeholder="e.g. 03451234567"
                                value={checkout.easypaisaMobile || ""}
                                onChange={(e) =>
                                  onCheckoutChange("easypaisaMobile", e.target.value)
                                }
                                className="h-10 rounded-lg border border-black/15 bg-white px-3 text-xs outline-none focus:border-[var(--ink)]"
                              />
                            </div>
                            <div className="flex flex-col gap-1">
                              <label className="text-[10px] font-bold text-[var(--muted)] tracking-wider uppercase">
                                Account Holder Name
                              </label>
                              <input
                                type="text"
                                required
                                placeholder="e.g. Muhammad Ali"
                                value={checkout.easypaisaName || ""}
                                onChange={(e) =>
                                  onCheckoutChange("easypaisaName", e.target.value)
                                }
                                className="h-10 rounded-lg border border-black/15 bg-white px-3 text-xs outline-none focus:border-[var(--ink)]"
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {/* STRIPE CARD FORM */}
                      {method.id === "CARD" && (
                        <div className="space-y-3">
                          <div className="flex items-center gap-1.5 text-xs text-blue-700 font-medium">
                            <IoLockClosedOutline />
                            <span>Secure 256-bit SSL Card Payment</span>
                          </div>
                          <div className="space-y-3">
                            <div className="flex flex-col gap-1">
                              <label className="text-[10px] font-bold text-[var(--muted)] tracking-wider uppercase">
                                Cardholder Name
                              </label>
                              <input
                                type="text"
                                required
                                placeholder="Name on Card"
                                value={checkout.cardName || ""}
                                onChange={(e) =>
                                  onCheckoutChange("cardName", e.target.value)
                                }
                                className="h-10 w-full rounded-lg border border-black/15 bg-white px-3 text-xs outline-none focus:border-[var(--ink)]"
                              />
                            </div>

                            <div className="flex flex-col gap-1">
                              <label className="text-[10px] font-bold text-[var(--muted)] tracking-wider uppercase">
                                Card Number
                              </label>
                              <input
                                type="text"
                                required
                                maxLength={19}
                                placeholder="•••• •••• •••• ••••"
                                value={checkout.cardNumber || ""}
                                onChange={(e) => {
                                  // Simple card formatting
                                  const val = e.target.value
                                    .replace(/\s?/g, "")
                                    .replace(/(\d{4})/g, "$1 ")
                                    .trim();
                                  onCheckoutChange("cardNumber", val);
                                }}
                                className="h-10 w-full rounded-lg border border-black/15 bg-white px-3 text-xs outline-none focus:border-[var(--ink)]"
                              />
                            </div>

                            <div className="grid gap-3 grid-cols-2">
                              <div className="flex flex-col gap-1">
                                <label className="text-[10px] font-bold text-[var(--muted)] tracking-wider uppercase">
                                  Expiry Date
                                </label>
                                <input
                                  type="text"
                                  required
                                  maxLength={5}
                                  placeholder="MM/YY"
                                  value={checkout.cardExpiry || ""}
                                  onChange={(e) => {
                                    let val = e.target.value.replace(/\D/g, "");
                                    if (val.length >= 2) {
                                      val = val.slice(0, 2) + "/" + val.slice(2, 4);
                                    }
                                    onCheckoutChange("cardExpiry", val);
                                  }}
                                  className="h-10 rounded-lg border border-black/15 bg-white px-3 text-xs outline-none focus:border-[var(--ink)]"
                                />
                              </div>
                              <div className="flex flex-col gap-1">
                                <label className="text-[10px] font-bold text-[var(--muted)] tracking-wider uppercase">
                                  CVV
                                </label>
                                <input
                                  type="password"
                                  required
                                  maxLength={4}
                                  placeholder="•••"
                                  value={checkout.cardCvv || ""}
                                  onChange={(e) =>
                                    onCheckoutChange("cardCvv", e.target.value.replace(/\D/g, ""))
                                  }
                                  className="h-10 rounded-lg border border-black/15 bg-white px-3 text-xs outline-none focus:border-[var(--ink)]"
                                />
                              </div>
                            </div>
                          </div>
                          <p className="text-[10px] text-[var(--muted)] leading-relaxed pt-1">
                            * Note: Real payment gateway, webhook, and order confirmation are handled through secure backend APIs. Secrets are never stored on frontend.
                          </p>
                        </div>
                      )}

                      {/* CASH ON DELIVERY */}
                      {method.id === "COD" && (
                        <div className="rounded-xl bg-black/[0.02] border border-black/5 p-4 text-center">
                          <IoCashOutline className="mx-auto text-3xl text-[var(--muted)] mb-2" />
                          <h5 className="font-semibold text-xs text-[var(--ink)] mb-1">
                            Cash on Delivery Confirmed
                          </h5>
                          <p className="text-[11px] text-[var(--muted)] leading-relaxed">
                            You will pay in cash to the courier representative when the package arrives at your delivery address. Please keep the exact amount ready.
                          </p>
                        </div>
                      )}

                      {/* BANK TRANSFER */}
                      {method.id === "BANK" && (
                        <div className="space-y-4">
                          <div className="rounded-xl border border-dashed border-black/15 bg-white p-4 text-xs space-y-2">
                            <p className="font-bold text-[var(--gold-deep)] uppercase tracking-wider">
                              Bank Account Details
                            </p>
                            <div className="grid grid-cols-3 gap-y-1">
                              <span className="text-[var(--muted)]">Bank:</span>
                              <span className="col-span-2 font-semibold text-[var(--ink)]">
                                Al Habib Bank Limited
                              </span>

                              <span className="text-[var(--muted)]">Title:</span>
                              <span className="col-span-2 font-semibold text-[var(--ink)]">
                                AYLEEN FASHION
                              </span>

                              <span className="text-[var(--muted)]">Account:</span>
                              <span className="col-span-2 font-semibold text-[var(--ink)]">
                                1029-0095-019238-01-3
                              </span>

                              <span className="text-[var(--muted)]">IBAN:</span>
                              <span className="col-span-2 font-semibold text-[var(--ink)] select-all">
                                PK89ALHB10290095019238013
                              </span>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <label className="text-[10px] font-bold text-[var(--muted)] tracking-wider uppercase">
                              Upload Payment Receipt / Screenshot
                            </label>
                            <div
                              onDragOver={(e) => {
                                e.preventDefault();
                                setDragOver(true);
                              }}
                              onDragLeave={() => setDragOver(false)}
                              onDrop={(e) => {
                                e.preventDefault();
                                setDragOver(false);
                                if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                                  const file = e.dataTransfer.files[0];
                                  setFileName(file.name);
                                  onCheckoutChange("bankScreenshot", file.name);
                                }
                              }}
                              className={`relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 text-center transition ${
                                dragOver
                                  ? "border-[var(--ink)] bg-black/[0.02]"
                                  : "border-black/15 hover:border-black/30"
                              }`}
                            >
                              <IoCloudUploadOutline className="text-2xl text-[var(--muted)] mb-2" />
                              {fileName ? (
                                <div className="space-y-1">
                                  <p className="text-xs font-semibold text-emerald-600">
                                    File Selected
                                  </p>
                                  <p className="text-[11px] text-[var(--muted)] truncate max-w-[250px]">
                                    {fileName}
                                  </p>
                                </div>
                              ) : (
                                <div>
                                  <p className="text-xs text-[var(--ink)] font-medium">
                                    Drag & drop receipt here, or{" "}
                                    <span className="underline cursor-pointer text-[var(--gold-deep)]">
                                      browse
                                    </span>
                                  </p>
                                  <p className="text-[10px] text-[var(--muted)] mt-1">
                                    Supports JPG, PNG, PDF up to 5MB
                                  </p>
                                </div>
                              )}
                              <input
                                type="file"
                                accept="image/*,application/pdf"
                                onChange={handleFileChange}
                                className="absolute inset-0 opacity-0 cursor-pointer"
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}
