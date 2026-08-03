import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  CatalogView,
  type CatalogSearchParams,
} from "@/components/product/catalog-view";
import { getCategory } from "@/lib/commerce/collections";
import { createMetadata } from "@/lib/seo/metadata";

export const revalidate = 300;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategory(slug);
  if (!category)
    return createMetadata({
      title: "Collection not found",
      description: "This Aylee collection is unavailable.",
      path: `/collections/${slug}`,
      noIndex: true,
    });
  return createMetadata({
    title: category.name,
    description:
      category.description || `Shop the Aylee ${category.name} collection.`,
    path: `/collections/${slug}`,
    image: category.image,
  });
}

export default async function CollectionPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<CatalogSearchParams>;
}) {
  const { slug } = await params;
  const category = await getCategory(slug);
  if (!category) notFound();
  return (
    <CatalogView
      title={category.name}
      description={
        category.description ||
        `Explore the current ${category.name} collection.`
      }
      searchParams={await searchParams}
      fixedQuery={{ category: category.slug }}
    />
  );
}
