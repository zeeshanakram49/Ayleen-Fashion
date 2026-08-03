import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { createMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = createMetadata({
  title: "Addresses",
  description: "Manage the address associated with your Aylee account.",
  path: "/account/addresses",
  noIndex: true,
});
export default function AddressesPage() {
  return (
    <div className="container-site section-pad !pt-8 md:!pt-12">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Account", href: "/account" },
          { label: "Addresses" },
        ]}
      />
      <h1 className="page-title mt-10">Addresses</h1>
      <div className="mt-12 max-w-2xl border border-[#dedbd2] bg-[#f7f5f0] p-8">
        <h2 className="serif text-3xl">Address management</h2>
        <p className="mt-3 text-[#6c6961]">
          The current backend contract exposes account address information but
          does not publish a safe address-update endpoint. Address updates are
          therefore collected during secure checkout instead of being silently
          stored here.
        </p>
        <Link href="/checkout" className="button-primary mt-6">
          Go to checkout
        </Link>
      </div>
    </div>
  );
}
