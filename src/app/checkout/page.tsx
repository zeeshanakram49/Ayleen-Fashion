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
    <div className="container-site section-pad !pt-8 md:!pt-12">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Bag", href: "/cart" },
          { label: "Checkout" },
        ]}
      />
      <h1 className="page-title mt-10 mb-12">Checkout</h1>
      <CheckoutForm />
    </div>
  );
}
