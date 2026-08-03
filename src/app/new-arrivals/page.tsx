import type { Metadata } from "next";
import { CatalogView } from "@/components/product/catalog-view";
import { createMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = createMetadata({
  title: "New arrivals",
  description: "Discover recently added styles in the live Aylee catalog.",
  path: "/new-arrivals",
});
export const revalidate = 300;

export default function NewArrivalsPage() {
  return (
    <CatalogView
      title="New arrivals"
      description="Recently added styles from the current Aylee catalog."
      fixedQuery={{ sort: "newest" }}
      showFilters={false}
    />
  );
}
