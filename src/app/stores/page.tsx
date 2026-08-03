import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { siteConfig } from "@/config/site";
import { createMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = createMetadata({
  title: "Stores",
  description:
    "Find published Aylee store locations in Lahore, Islamabad, and Karachi.",
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
          Locations currently published by the Aylee storefront. Contact
          customer service to confirm opening times before travelling.
        </p>
      </header>
      <div className="mt-12 grid gap-px bg-[#dedbd2] md:grid-cols-3">
        {siteConfig.stores.map((store) => (
          <article key={store.city} className="bg-white p-8">
            <h2 className="serif text-4xl">{store.city}</h2>
            <ul className="mt-6 space-y-4">
              {store.locations.map((location) => (
                <li
                  key={location}
                  className="border-t border-[#dedbd2] pt-4 text-sm text-[#57544d]"
                >
                  {location}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </div>
  );
}
