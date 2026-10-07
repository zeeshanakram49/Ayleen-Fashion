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
  const params = await searchParams;
  const men = params.gender === "male";
  return (
    <CatalogView
      title={men ? "Men" : "Shop all"}
      description={
        men
          ? "Aylee menswear, with current prices, sizes and availability."
          : "The complete current Aylee catalog, with live prices and availability."
      }
      searchParams={params}
    />
  );
}
