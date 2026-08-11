import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { CheckoutForm } from "@/components/forms/checkout-form";
import { createMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = createMetadata({
  title: "Checkout",
  description: "Complete your Aylee order through the secure checkout flow.",
  path: "/checkout",
  noIndex: true,
});

export default function CheckoutPage() {
  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#fffefb_0%,#f4f1ea_42%,#f7f5f0_100%)]">
      <div className="container-site section-pad !pt-8 md:!pt-12">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Bag", href: "/cart" },
            { label: "Checkout" },
          ]}
        />
        <div className="mt-9 mb-9 flex flex-col gap-5 border-b border-[#dedbd2] pb-8 md:mb-12 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow">Secure checkout</p>
            <h1 className="page-title mt-3">Complete your order</h1>
            <p className="mt-4 max-w-xl text-[#6c6961]">
              Just a few details and your Aylee order will be on its way.
            </p>
          </div>
          <div className="flex items-center gap-2 text-[0.68rem] font-bold tracking-[0.08em] uppercase">
            <span className="rounded-full bg-[#171613] px-3 py-1.5 text-white">
              Bag
            </span>
            <span className="h-px w-5 bg-[#bdb8ad]" />
            <span className="rounded-full bg-[#171613] px-3 py-1.5 text-white">
              Details
            </span>
            <span className="h-px w-5 bg-[#bdb8ad]" />
            <span className="rounded-full border border-[#bdb8ad] px-3 py-1.5 text-[#6c6961]">
              Done
            </span>
          </div>
        </div>
        <CheckoutForm />
      </div>
    </div>
  );
}
