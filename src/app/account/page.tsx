import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { AccountPanel } from "@/components/account/account-panel";
import { createMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = createMetadata({
  title: "Account",
  description: "Sign in to your Aylee customer account.",
  path: "/account",
  noIndex: true,
});

export default function AccountPage() {
  return (
    <div className="container-site section-pad !pt-8 md:!pt-12">
      <Breadcrumbs
        items={[{ label: "Home", href: "/" }, { label: "Account" }]}
      />
      <h1 className="page-title mt-10 mb-12">Your account</h1>
      <AccountPanel />
    </div>
  );
}
