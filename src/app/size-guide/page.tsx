import type { Metadata } from "next";
import Link from "next/link";
import { AlertCircle } from "lucide-react";
import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { createMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = createMetadata({
  title: "Size guide",
  description: "Aylee sizing information and support.",
  path: "/size-guide",
});
export default function SizeGuidePage() {
  return (
    <div className="container-site section-pad !pt-8 md:!pt-12">
      <Breadcrumbs
        items={[{ label: "Home", href: "/" }, { label: "Size guide" }]}
      />
      <div className="mx-auto mt-10 max-w-3xl">
        <p className="eyebrow">Fit help</p>
        <h1 className="page-title mt-4">Size guide</h1>
        <div className="mt-8 flex gap-3 border border-[#c7a352] bg-[#fff9e9] p-5">
          <AlertCircle className="shrink-0" />
          <p>
            <strong>Measurements pending confirmation.</strong> The current
            source website and commerce API publish size labels such as S, M, L,
            and XL, but do not provide verified body or garment measurements.
          </p>
        </div>
        <section className="mt-10">
          <h2 className="serif text-3xl">Choose with confidence</h2>
          <p className="mt-4 text-[#57544d]">
            Check the available size labels on each product page. For
            product-specific measurements or fit advice, contact Aylee customer
            service before ordering.
          </p>
          <div className="mt-7 flex gap-3">
            <Link href="/contact" className="button-primary">
              Ask about sizing
            </Link>
            <Link href="/shop" className="button-secondary">
              Return to shop
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
