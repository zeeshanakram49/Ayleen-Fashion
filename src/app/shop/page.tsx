import type { Metadata } from "next";
import {
  CatalogView,
  type CatalogSearchParams,
} from "@/components/product/catalog-view";
import { createMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = createMetadata({
  title: "Shop all",
  description:
    "Browse the complete live Aylee clothing catalog, including current prices, sizes, and availability.",
  path: "/shop",
});

export const revalidate = 300;

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<CatalogSearchParams>;
}) {
  return (
    <CatalogView
      title="Shop all"
      description="The complete current Aylee catalog, with live prices and availability."
      searchParams={await searchParams}
    />
  );
}
