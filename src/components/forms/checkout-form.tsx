"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { AnimatePresence, motion } from "framer-motion";
import {
  Banknote,
  Check,
  ChevronDown,
  ChevronRight,
  CreditCard,
  LockKeyhole,
  MapPin,
  PackageCheck,
  ShieldCheck,
  Smartphone,
  Truck,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useStore } from "@/components/providers/store-provider";
import {
  checkoutFormSchema,
  type CheckoutFormInput,
  type CheckoutInput,
} from "@/lib/validation/schemas";
import { formatPrice } from "@/lib/utils/format";
import { Spinner } from "@/components/motion/spinner";

const EASE = [0.22, 1, 0.36, 1] as const;

const PAYMENT_METHODS = [
  {
    value: "COD",
    label: "Cash on Delivery",
    caption: "Pay when your parcel arrives",
    icon: Banknote,
  },
  {
    value: "CARD",
    label: "Debit / Credit Card",
    caption: "Visa and Mastercard via secure checkout",
    icon: CreditCard,
  },
  {
    value: "JAZZCASH",
    label: "JazzCash",
    caption: "Mobile wallet",
    icon: Smartphone,
  },
  {
    value: "EASYPAISA",
    label: "EasyPaisa",
    caption: "Mobile wallet",
    icon: Smartphone,
  },
] as const;

type PaymentValue = (typeof PAYMENT_METHODS)[number]["value"];

function PaymentMarks({ method }: { method: PaymentValue }) {
  if (method === "CARD") {
    return (
      <span
        className="flex shrink-0 items-center gap-1.5"
        aria-label="Visa and Mastercard accepted"
      >
        <span className="grid h-7 min-w-11 place-items-center rounded-[5px] bg-[#1434cb] px-1.5 text-[0.65rem] font-black tracking-tight text-white italic shadow-sm">
          VISA
        </span>
        <span
          className="grid h-7 min-w-11 place-items-center rounded-[5px] border border-[#dedbd2] bg-white px-1.5 shadow-sm"
          aria-label="Mastercard"
        >
          <span className="relative block h-4 w-7">
            <span className="absolute left-0 size-4 rounded-full bg-[#eb001b]" />
            <span className="absolute right-0 size-4 rounded-full bg-[#f79e1b] mix-blend-multiply" />
          </span>
        </span>
      </span>
    );
  }

  if (method === "JAZZCASH") {
    return (
      <span className="shrink-0 rounded-md bg-[#8f171b] px-2.5 py-1 text-[0.62rem] font-black tracking-wide text-white">
        JAZZCASH
      </span>
    );
  }

  if (method === "EASYPAISA") {
    return (
      <span className="shrink-0 rounded-md bg-[#00a651] px-2.5 py-1 text-[0.62rem] font-black tracking-wide text-white">
        EASYPAISA
      </span>
    );
  }

  return (
    <span className="shrink-0 rounded-full bg-[#edf6ee] px-2.5 py-1 text-[0.62rem] font-bold tracking-wide text-[#28633b] uppercase">
      Pay on arrival
    </span>
  );
}

function SectionHeader({
  step,
  title,
  description,
}: {
  step: number;
  title: string;
  description: string;
}) {
  return (
    <div className="flex gap-3.5">
      <span className="grid size-8 shrink-0 place-items-center rounded-full bg-[#171613] text-xs font-bold text-white">
        {step}
      </span>
      <div>
        <h2 className="serif text-2xl leading-none md:text-[2rem]">{title}</h2>
        <p className="mt-2 text-sm text-[#6c6961]">{description}</p>
      </div>
    </div>
  );
}

function FieldError({ message }: { message?: string }) {
  return message ? (
    <p className="mt-1 text-xs text-[#a82020]" role="alert">
      {message}
    </p>
  ) : null;
}

export function CheckoutForm() {
  const router = useRouter();
  const { lines, summary, clearCart } = useStore();
  const [serverError, setServerError] = useState("");
  const [orderOpen, setOrderOpen] = useState(true);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutFormInput>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      address: "",
      address2: "",
      city: "",
      postCode: "",
      country: "Pakistan",
      payment: "COD",
      note: "",
    },
  });

  if (!lines.length)
    return (
      <div className="border border-[#dedbd2] bg-[#f7f5f0] p-10 text-center">
        <h2 className="serif text-3xl">Your bag is empty</h2>
        <p className="mt-3 text-[#6c6961]">
          Add a product before starting checkout.
        </p>
        <Link href="/shop" className="button-primary mt-6">
          Shop now
        </Link>
      </div>
    );

  const selectedPayment = watch("payment");

  async function submit(values: CheckoutFormInput) {
    setServerError("");
    const payload: CheckoutInput = {
      ...values,
      lines: lines.map((line) => ({
        productId: line.productId,
        size: line.size,
        color: line.color,
        quantity: line.quantity,
      })),
    };
    try {
      const response = await fetch("/api/commerce/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const body = (await response.json()) as {
        orderId?: string;
        redirectUrl?: string;
        message?: string;
      };
      if (!response.ok || !body.orderId)
        throw new Error(
          body.message || "The order could not be placed. Please try again.",
        );
      clearCart();
      if (body.redirectUrl) {
        window.location.assign(body.redirectUrl);
        return;
      }
      router.push(`/order-confirmation/${encodeURIComponent(body.orderId)}`);
    } catch (error) {
      setServerError(
        error instanceof Error
          ? error.message
          : "The order could not be placed.",
      );
    }
  }

  return (
    <form
      onSubmit={handleSubmit(submit)}
      className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(380px,460px)] lg:items-start xl:gap-14"
    >
      <div className="space-y-5">
        <section className="rounded-2xl border border-[#dedbd2] bg-white p-5 shadow-[0_16px_50px_rgb(23_22_19/0.04)] md:p-8">
          <SectionHeader
            step={1}
            title="Contact information"
            description="We’ll use these details for order and delivery updates."
          />
          <div className="mt-7 grid gap-4 sm:grid-cols-2">
            <label className="text-sm sm:col-span-2">
              Full name
              <input
                {...register("fullName")}
                className="field mt-2 !rounded-xl focus:border-[#171613] focus:outline-none"
                autoComplete="name"
                placeholder="Your full name"
                aria-invalid={Boolean(errors.fullName)}
              />
              <FieldError message={errors.fullName?.message} />
            </label>
            <label className="text-sm">
              Email
              <input
                {...register("email")}
                type="email"
                className="field mt-2 !rounded-xl focus:border-[#171613] focus:outline-none"
                autoComplete="email"
                placeholder="you@example.com"
                aria-invalid={Boolean(errors.email)}
              />
              <FieldError message={errors.email?.message} />
            </label>
            <label className="text-sm">
              Phone
              <input
                {...register("phone")}
                type="tel"
                className="field mt-2 !rounded-xl focus:border-[#171613] focus:outline-none"
                autoComplete="tel"
                placeholder="03XX XXXXXXX"
                aria-invalid={Boolean(errors.phone)}
              />
              <FieldError message={errors.phone?.message} />
            </label>
          </div>
        </section>
        <section className="rounded-2xl border border-[#dedbd2] bg-white p-5 shadow-[0_16px_50px_rgb(23_22_19/0.04)] md:p-8">
          <SectionHeader
            step={2}
            title="Delivery address"
            description="Enter the address where you want to receive your parcel."
          />
          <div className="mt-7 grid gap-4 sm:grid-cols-2">
            <label className="text-sm sm:col-span-2">
              Address
              <input
                {...register("address")}
                className="field mt-2 !rounded-xl focus:border-[#171613] focus:outline-none"
                autoComplete="street-address"
                placeholder="House, street and area"
                aria-invalid={Boolean(errors.address)}
              />
              <FieldError message={errors.address?.message} />
            </label>
            <label className="text-sm sm:col-span-2">
              Apartment, suite, etc.{" "}
              <span className="text-[#6c6961]">(optional)</span>
              <input
                {...register("address2")}
                className="field mt-2 !rounded-xl focus:border-[#171613] focus:outline-none"
                placeholder="Apartment, floor or landmark"
              />
            </label>
            <label className="text-sm">
              City
              <input
                {...register("city")}
                className="field mt-2 !rounded-xl focus:border-[#171613] focus:outline-none"
                autoComplete="address-level2"
                placeholder="City"
                aria-invalid={Boolean(errors.city)}
              />
              <FieldError message={errors.city?.message} />
            </label>
            <label className="text-sm">
              Postal code <span className="text-[#6c6961]">(optional)</span>
              <input
                {...register("postCode")}
                className="field mt-2 !rounded-xl focus:border-[#171613] focus:outline-none"
                autoComplete="postal-code"
                placeholder="Postal code"
              />
            </label>
            <label className="text-sm sm:col-span-2">
              Country
              <input
                {...register("country")}
                className="field mt-2 !rounded-xl bg-[#f5f3ee]"
                readOnly
              />
            </label>
          </div>
        </section>

        <section className="rounded-2xl border border-[#dedbd2] bg-white p-5 shadow-[0_16px_50px_rgb(23_22_19/0.04)] md:p-8">
          <SectionHeader
            step={3}
            title="Shipping method"
            description="Fast, tracked delivery across Pakistan."
          />
          <div className="mt-7 grid grid-cols-[44px_minmax(0,1fr)_auto] items-center gap-3 rounded-xl border-2 border-[#171613] bg-[#f7f5f0] p-4">
            <span className="grid size-11 shrink-0 place-items-center rounded-full bg-white shadow-sm">
              <Truck size={20} aria-hidden />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-semibold">
                Nationwide delivery
              </span>
              <span className="block text-xs text-[#6c6961]">
                Tracked delivery to your provided address
              </span>
            </span>
            <span className="flex items-center justify-end gap-1.5 text-right text-xs font-bold sm:text-sm">
              <span>
                {summary.hasFreeShipping ? "Free" : "Confirmed on order"}
              </span>
              <Check size={18} className="shrink-0 text-[#28633b]" />
            </span>
          </div>
          {!summary.hasFreeShipping ? (
            <p className="mt-3 text-xs text-[#6c6961]">
              Add {formatPrice(summary.remainingForFreeShipping)} more to
              qualify for free shipping.
            </p>
          ) : null}
        </section>

        <section className="rounded-2xl border border-[#dedbd2] bg-white p-5 shadow-[0_16px_50px_rgb(23_22_19/0.04)] md:p-8">
          <SectionHeader
            step={4}
            title="Payment"
            description="All payment sessions are secure and encrypted."
          />
          <fieldset className="mt-5 space-y-2.5">
            <legend className="sr-only">Payment method</legend>
            {PAYMENT_METHODS.map(({ value, label, caption, icon: Icon }) => {
              const selected = selectedPayment === value;
              return (
                <div key={value}>
                  <label
                    className="option-card !rounded-xl text-sm"
                    data-selected={selected}
                  >
                    <input
                      {...register("payment")}
                      type="radio"
                      value={value}
                      className="size-4 accent-[#171613]"
                    />
                    <span
                      className={`grid size-10 shrink-0 place-items-center rounded-full ${selected ? "bg-[#171613] text-white" : "bg-[#f3f1eb] text-[#6c6961]"}`}
                    >
                      <Icon size={18} />
                    </span>
                    <span className="flex-1">
                      <span className="block font-medium">{label}</span>
                      {caption ? (
                        <span className="block text-xs text-[#6c6961]">
                          {caption}
                        </span>
                      ) : null}
                    </span>
                    <PaymentMarks method={value} />
                  </label>
                  <AnimatePresence initial={false}>
                    {selected && value !== "COD" ? (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25, ease: EASE }}
                        className="mx-2 -mt-1 overflow-hidden rounded-b-xl border-x border-b border-[#dedbd2] bg-[#f7f5f0] px-4 text-xs text-[#6c6961]"
                      >
                        <span className="flex items-start gap-2.5 py-3.5">
                          <ShieldCheck
                            size={16}
                            className="mt-0.5 shrink-0 text-[#28633b]"
                          />
                          <span>
                            {value === "CARD"
                              ? "After placing the order, you’ll continue to our secure card page. Aylee never stores your card number."
                              : `You’ll continue to ${label} to authorize the payment securely.`}
                          </span>
                        </span>
                      </motion.p>
                    ) : null}
                  </AnimatePresence>
                </div>
              );
            })}
          </fieldset>
        </section>
        <section className="rounded-2xl border border-[#dedbd2] bg-white p-5 shadow-[0_16px_50px_rgb(23_22_19/0.04)] md:p-8">
          <label className="block text-sm font-medium">
            Order note{" "}
            <span className="font-normal text-[#6c6961]">(optional)</span>
            <textarea
              {...register("note")}
              className="field mt-2 min-h-28 resize-y !rounded-xl focus:border-[#171613] focus:outline-none"
              placeholder="Delivery instructions or a note for your order"
            />
          </label>
        </section>
      </div>
      <aside className="overflow-hidden rounded-2xl border border-[#dedbd2] bg-[#f3f1eb] shadow-[0_24px_70px_rgb(23_22_19/0.09)] lg:sticky lg:top-28">
        <div className="flex items-center gap-3 border-b border-[#dedbd2] bg-white px-5 py-3 md:px-6">
          <button
            type="button"
            onClick={() => setOrderOpen((current) => !current)}
            className="group flex min-w-0 flex-1 items-center justify-between gap-3 py-2 text-left"
            aria-expanded={orderOpen}
            aria-controls="checkout-order-summary"
          >
            <span>
              <span className="block text-[0.65rem] font-bold tracking-[0.16em] text-[#6c6961] uppercase">
                Order summary
              </span>
              <span className="serif mt-1 block text-3xl">Your bag</span>
            </span>
            <span className="flex shrink-0 items-center gap-2">
              <span className="hidden text-sm font-bold sm:block">
                {formatPrice(summary.subtotal)}
              </span>
              <motion.span
                animate={{ rotate: orderOpen ? 180 : 0 }}
                transition={{ duration: 0.3, ease: EASE }}
                className="grid size-9 place-items-center rounded-full bg-[#f3f1eb] transition-colors group-hover:bg-[#e8e4dc]"
              >
                <ChevronDown size={18} />
              </motion.span>
            </span>
          </button>
          <Link
            href="/cart"
            className="hidden items-center gap-1 text-xs font-bold underline-offset-4 hover:underline sm:inline-flex"
          >
            Edit bag <ChevronRight size={14} />
          </Link>
        </div>

        <AnimatePresence initial>
          {orderOpen ? (
            <motion.div
              id="checkout-order-summary"
              key="order-summary"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{
                height: { duration: 0.45, ease: EASE },
                opacity: { duration: 0.28, ease: EASE },
              }}
              className="overflow-hidden"
            >
              <div className="p-5 md:p-6">
                <Link
                  href="/cart"
                  className="mb-4 inline-flex items-center gap-1 text-xs font-bold underline-offset-4 hover:underline sm:hidden"
                >
                  Edit bag <ChevronRight size={14} />
                </Link>
                <ul className="space-y-3">
                  {lines.map((line) => (
                    <li
                      key={line.key}
                      className="grid grid-cols-[76px_minmax(0,1fr)_auto] gap-3 rounded-xl border border-[#dedbd2] bg-white p-3 shadow-[0_8px_25px_rgb(23_22_19/0.04)]"
                    >
                      <div className="relative aspect-[4/5] overflow-hidden rounded-lg bg-[#e8e5dd]">
                        {line.image ? (
                          <Image
                            src={line.image}
                            alt={line.name}
                            fill
                            sizes="76px"
                            className="object-cover"
                          />
                        ) : null}
                        <span className="absolute top-1 right-1 grid size-6 place-items-center rounded-full border-2 border-white bg-[#171613] text-[0.65rem] font-bold text-white shadow-sm">
                          {line.quantity}
                        </span>
                      </div>
                      <div className="min-w-0 py-1">
                        <p className="truncate text-sm font-semibold">
                          {line.name}
                        </p>
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {line.size ? (
                            <span className="rounded-full bg-[#f3f1eb] px-2 py-0.5 text-[0.65rem] text-[#57544d]">
                              Size {line.size}
                            </span>
                          ) : null}
                          {line.color ? (
                            <span className="rounded-full bg-[#f3f1eb] px-2 py-0.5 text-[0.65rem] text-[#57544d]">
                              {line.color}
                            </span>
                          ) : null}
                          {!line.size && !line.color ? (
                            <span className="text-xs text-[#6c6961]">
                              Standard
                            </span>
                          ) : null}
                        </div>
                      </div>
                      <p className="py-1 text-sm font-semibold whitespace-nowrap">
                        {formatPrice(line.price * line.quantity)}
                      </p>
                    </li>
                  ))}
                </ul>

                <div className="mt-6 space-y-3 border-t border-[#d6d2c9] pt-5 text-sm">
                  <div className="flex justify-between gap-4">
                    <span className="text-[#57544d]">
                      Subtotal · {summary.itemCount}{" "}
                      {summary.itemCount === 1 ? "item" : "items"}
                    </span>
                    <strong>{formatPrice(summary.subtotal)}</strong>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="inline-flex items-center gap-1.5 text-[#57544d]">
                      Shipping <Truck size={14} />
                    </span>
                    <span
                      className={
                        summary.hasFreeShipping
                          ? "font-bold text-[#28633b]"
                          : "text-[#6c6961]"
                      }
                    >
                      {summary.hasFreeShipping ? "Free" : "Confirmed on order"}
                    </span>
                  </div>
                </div>

                <div className="mt-5 flex items-end justify-between gap-4 border-t border-[#d6d2c9] pt-5">
                  <div>
                    <span className="text-lg font-bold">Total</span>
                    {!summary.hasFreeShipping ? (
                      <p className="mt-0.5 text-[0.65rem] text-[#6c6961]">
                        Delivery charge may apply
                      </p>
                    ) : null}
                  </div>
                  <p className="text-right">
                    <span className="mr-1.5 text-[0.65rem] font-semibold text-[#6c6961]">
                      PKR
                    </span>
                    <strong className="serif text-3xl leading-none">
                      {formatPrice(summary.subtotal).replace("Rs. ", "")}
                    </strong>
                  </p>
                </div>
                {serverError ? (
                  <p
                    className="mt-4 border border-[#a82020] bg-white p-3 text-sm text-[#a82020]"
                    role="alert"
                  >
                    {serverError}
                  </p>
                ) : null}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="button-primary mt-6 min-h-14 w-full !rounded-xl shadow-[0_12px_30px_rgb(23_22_19/0.18)]"
                >
                  <AnimatePresence mode="wait" initial={false}>
                    {isSubmitting ? (
                      <motion.span
                        key="placing"
                        initial={{ opacity: 0, scale: 0.7 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.7 }}
                        transition={{ duration: 0.2, ease: EASE }}
                        className="inline-flex items-center gap-2"
                      >
                        <Spinner size={16} /> Placing order…
                      </motion.span>
                    ) : (
                      <motion.span
                        key="place"
                        initial={{ opacity: 0, scale: 0.7 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.7 }}
                        transition={{ duration: 0.2, ease: EASE }}
                        className="inline-flex items-center gap-2"
                      >
                        <LockKeyhole size={16} />
                        {selectedPayment === "COD"
                          ? "Place COD order"
                          : "Continue to secure payment"}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </button>
                <p className="mt-3 text-center text-[0.68rem] leading-5 text-[#6c6961]">
                  By continuing, you acknowledge the currently published store
                  policies.
                </p>

                <div className="mt-5 grid grid-cols-3 gap-2 border-t border-[#d6d2c9] pt-5 text-center text-[0.6rem] font-semibold text-[#57544d]">
                  <span className="grid justify-items-center gap-1.5">
                    <ShieldCheck size={18} /> Secure checkout
                  </span>
                  <span className="grid justify-items-center gap-1.5">
                    <PackageCheck size={18} /> Tracked order
                  </span>
                  <span className="grid justify-items-center gap-1.5">
                    <MapPin size={18} /> Pakistan-wide
                  </span>
                </div>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </aside>
    </form>
  );
}
