import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { EmptyState } from "@/components/common/empty-state";
import { getCategories } from "@/lib/commerce/collections";
import { createMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = createMetadata({
  title: "Collections",
  description: "Explore Aylee clothing collections and categories.",
  path: "/collections",
});
export const revalidate = 300;

export default async function CollectionsPage() {
  const categories = await getCategories();
  return (
    <div className="container-site section-pad !pt-8 md:!pt-12">
      <Breadcrumbs
        items={[{ label: "Home", href: "/" }, { label: "Collections" }]}
      />
      <header className="mt-10 mb-12">
        <p className="eyebrow">Explore</p>
        <h1 className="page-title mt-4">Collections</h1>
        <p className="mt-5 max-w-2xl text-[#6c6961]">
          Browse the categories currently published by Aylee.
        </p>
      </header>
      {categories.length ? (
        <div className="grid gap-5 md:grid-cols-2">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/collections/${category.slug}`}
              className="group relative aspect-[5/4] overflow-hidden bg-[#efede7]"
            >
              {category.image ? (
                <Image
                  src={category.image}
                  alt={`${category.name} collection`}
                  fill
                  unoptimized
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover object-top"
                />
              ) : null}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/5 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-7 text-white md:p-9">
                <h2 className="serif text-4xl md:text-5xl">{category.name}</h2>
                <p className="mt-3 line-clamp-2 max-w-lg text-sm text-white/75">
                  {category.description || `Explore ${category.name}`}
                </p>
                <span className="mt-5 inline-flex items-center gap-2 text-xs font-bold tracking-wider uppercase">
                  View collection <ArrowRight size={15} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <EmptyState
          title="Collections are syncing"
          message="The commerce service is temporarily unavailable. Please try again shortly."
        />
      )}
    </div>
  );
}
