"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { LockKeyhole } from "lucide-react";
import { useRouter } from "next/navigation";
import { useStore } from "@/components/providers/store-provider";
import {
  checkoutFormSchema,
  type CheckoutFormInput,
  type CheckoutInput,
} from "@/lib/validation/schemas";
import { formatPrice } from "@/lib/utils/format";

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
  const {
    register,
    handleSubmit,
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
      className="grid gap-10 lg:grid-cols-[1fr_420px] lg:items-start"
    >
      <div className="space-y-9">
        <section>
          <h2 className="serif text-3xl">Contact</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <label className="text-sm sm:col-span-2">
              Full name
              <input
                {...register("fullName")}
                className="field mt-2"
                autoComplete="name"
                aria-invalid={Boolean(errors.fullName)}
              />
              <FieldError message={errors.fullName?.message} />
            </label>
            <label className="text-sm">
              Email
              <input
                {...register("email")}
                type="email"
                className="field mt-2"
                autoComplete="email"
                aria-invalid={Boolean(errors.email)}
              />
              <FieldError message={errors.email?.message} />
            </label>
            <label className="text-sm">
              Phone
              <input
                {...register("phone")}
                type="tel"
                className="field mt-2"
                autoComplete="tel"
                aria-invalid={Boolean(errors.phone)}
              />
              <FieldError message={errors.phone?.message} />
            </label>
          </div>
        </section>
        <section>
          <h2 className="serif text-3xl">Shipping address</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <label className="text-sm sm:col-span-2">
              Address
              <input
                {...register("address")}
                className="field mt-2"
                autoComplete="street-address"
                aria-invalid={Boolean(errors.address)}
              />
              <FieldError message={errors.address?.message} />
            </label>
            <label className="text-sm sm:col-span-2">
              Apartment, suite, etc.{" "}
              <span className="text-[#6c6961]">(optional)</span>
              <input {...register("address2")} className="field mt-2" />
            </label>
            <label className="text-sm">
              City
              <input
                {...register("city")}
                className="field mt-2"
                autoComplete="address-level2"
                aria-invalid={Boolean(errors.city)}
              />
              <FieldError message={errors.city?.message} />
            </label>
            <label className="text-sm">
              Postal code <span className="text-[#6c6961]">(optional)</span>
              <input
                {...register("postCode")}
                className="field mt-2"
                autoComplete="postal-code"
              />
            </label>
            <label className="text-sm sm:col-span-2">
              Country
              <input
                {...register("country")}
                className="field mt-2 bg-[#f5f3ee]"
                readOnly
              />
            </label>
          </div>
        </section>
        <section>
          <h2 className="serif text-3xl">Payment</h2>
          <p className="mt-2 text-sm text-[#6c6961]">
            Payments are completed through Aylee&apos;s secure backend or a
            hosted provider. This site never asks for raw card details.
          </p>
          <fieldset className="mt-5 divide-y divide-[#dedbd2] border border-[#dedbd2]">
            <legend className="sr-only">Payment method</legend>
            {[
              ["COD", "Cash on delivery"],
              ["CARD", "Card — hosted checkout"],
              ["JAZZCASH", "JazzCash"],
              ["EASYPAISA", "EasyPaisa"],
            ].map(([value, label]) => (
              <label
                key={value}
                className="flex min-h-14 items-center gap-3 px-4 text-sm"
              >
                <input {...register("payment")} type="radio" value={value} />
                <span>{label}</span>
              </label>
            ))}
          </fieldset>
        </section>
        <label className="block text-sm">
          Order note <span className="text-[#6c6961]">(optional)</span>
          <textarea
            {...register("note")}
            className="field mt-2 min-h-28 resize-y"
          />
        </label>
      </div>
      <aside className="border border-[#dedbd2] bg-[#f7f5f0] p-6 lg:sticky lg:top-32">
        <h2 className="serif text-3xl">Your order</h2>
        <ul className="mt-5 divide-y divide-[#dedbd2]">
          {lines.map((line) => (
            <li
              key={line.key}
              className="grid grid-cols-[64px_1fr_auto] gap-3 py-4"
            >
              <div className="relative aspect-[4/5] bg-[#e8e5dd]">
                {line.image ? (
                  <Image
                    src={line.image}
                    alt={line.name}
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                ) : null}
                <span className="absolute -top-2 -right-2 grid size-5 place-items-center rounded-full bg-[#171613] text-[0.65rem] text-white">
                  {line.quantity}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium">{line.name}</p>
                <p className="mt-1 text-xs text-[#6c6961]">
                  {[line.size, line.color].filter(Boolean).join(" · ") ||
                    "Standard"}
                </p>
              </div>
              <p className="text-sm">
                {formatPrice(line.price * line.quantity)}
              </p>
            </li>
          ))}
        </ul>
        <div className="mt-5 flex justify-between border-t border-[#dedbd2] pt-5">
          <span>Total before shipping</span>
          <strong>{formatPrice(summary.subtotal)}</strong>
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
          className="button-primary mt-6 w-full"
        >
          <LockKeyhole size={16} />{" "}
          {isSubmitting ? "Placing order…" : "Place order securely"}
        </button>
        <p className="mt-3 text-center text-xs text-[#6c6961]">
          By continuing, you acknowledge the currently published store policies.
        </p>
      </aside>
    </form>
  );
}
