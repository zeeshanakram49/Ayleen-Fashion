import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { OrdersView } from "@/components/account/orders-view";
import { createMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = createMetadata({
  title: "Orders",
  description: "View your Aylee order history.",
  path: "/account/orders",
  noIndex: true,
});
export default function OrdersPage() {
  return (
    <div className="container-site section-pad !pt-8 md:!pt-12">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Account", href: "/account" },
          { label: "Orders" },
        ]}
      />
      <h1 className="page-title mt-10 mb-12">Orders</h1>
      <OrdersView />
    </div>
  );
}
