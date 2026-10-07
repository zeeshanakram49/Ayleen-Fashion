import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { siteConfig } from "@/config/site";
import { createMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = createMetadata({
  title: "Stores",
  description: "Contact Aylee about visiting a store.",
  path: "/stores",
});
export default function StoresPage() {
  return (
    <div className="container-site section-pad !pt-8 md:!pt-12">
      <Breadcrumbs
        items={[{ label: "Home", href: "/" }, { label: "Stores" }]}
      />
      <header className="mt-10 max-w-3xl">
        <p className="eyebrow">Visit Aylee</p>
        <h1 className="page-title mt-4">Store locations</h1>
        <p className="mt-5 text-[#6c6961]">
          Please contact Aylee before planning a store visit. Our team can
          confirm current locations and opening hours.
        </p>
        <a
          className="button-primary mt-6"
          href={siteConfig.contact.whatsappHref}
        >
          Ask on WhatsApp
        </a>
      </header>
    </div>
  );
}
