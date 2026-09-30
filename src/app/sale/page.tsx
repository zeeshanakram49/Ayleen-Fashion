import type { Metadata } from "next";
import {
  CatalogView,
  type CatalogSearchParams,
} from "@/components/product/catalog-view";
import { createMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = createMetadata({
  title: "Sale",
  description:
    "Shop current Aylee reductions with live pricing and availability.",
  path: "/sale",
});
export const revalidate = 300;

export default async function SalePage({
  searchParams,
}: {
  searchParams: Promise<CatalogSearchParams>;
}) {
  return (
    <CatalogView
      title="Sale"
      description="Current reductions supplied directly by Aylee's commerce catalog."
      fixedQuery={{ sale: true }}
      searchParams={await searchParams}
      showFilters={false}
    />
  );
}
