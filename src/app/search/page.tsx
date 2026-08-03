import type { Metadata } from "next";
import {
  CatalogView,
  type CatalogSearchParams,
} from "@/components/product/catalog-view";
import { createMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = createMetadata({
  title: "Search",
  description:
    "Search Aylee products by name, category, tag, size, colour, or SKU.",
  path: "/search",
  noIndex: true,
});

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<CatalogSearchParams>;
}) {
  const params = await searchParams;
  const query = Array.isArray(params.q) ? params.q[0] : params.q;
  return (
    <CatalogView
      title={query ? `Results for “${query}”` : "Search Aylee"}
      description="Search the current product catalog by name, category, tag, size, colour, or SKU."
      searchParams={params}
      showFilters={false}
    />
  );
}
