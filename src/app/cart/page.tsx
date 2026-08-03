import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { CartPageView } from "@/components/cart/cart-page-view";
import { createMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = createMetadata({
  title: "Shopping bag",
  description: "Review and update your Aylee shopping bag.",
  path: "/cart",
  noIndex: true,
});

export default function CartPage() {
  return (
    <div className="container-site section-pad !pt-8 md:!pt-12">
      <Breadcrumbs
        items={[{ label: "Home", href: "/" }, { label: "Shopping bag" }]}
      />
      <h1 className="page-title mt-10 mb-12">Shopping bag</h1>
      <CartPageView />
    </div>
  );
}
