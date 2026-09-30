import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { EmptyState } from "@/components/common/empty-state";
import { ProductGrid } from "@/components/product/product-grid";
import { CatalogPagination } from "@/components/product/catalog-pagination";
import { ShopFilters } from "@/components/product/shop-filters";
import { getCategories } from "@/lib/commerce/collections";
import { getProductsPage } from "@/lib/commerce/products";
import type { ProductQuery } from "@/types/commerce";

export type CatalogSearchParams = Record<string, string | string[] | undefined>;

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export async function CatalogView({
  title,
  description,
  searchParams = {},
  fixedQuery = {},
  showFilters = true,
  breadcrumbLabel,
}: {
  title: string;
  description: string;
  searchParams?: CatalogSearchParams;
  fixedQuery?: ProductQuery;
  showFilters?: boolean;
  breadcrumbLabel?: string;
}) {
  const requestedPage = Number(first(searchParams.page)) || 1;
  const [categories, productPage] = await Promise.all([
    getCategories(),
    getProductsPage(
      {
        query: first(searchParams.q),
        category: first(searchParams.category),
        sort: (first(searchParams.sort) as ProductQuery["sort"]) || "featured",
        availability: first(
          searchParams.availability,
        ) as ProductQuery["availability"],
        minPrice: first(searchParams.minPrice)
          ? Number(first(searchParams.minPrice))
          : undefined,
        maxPrice: first(searchParams.maxPrice)
          ? Number(first(searchParams.maxPrice))
          : undefined,
        size: first(searchParams.size),
        color: first(searchParams.color),
        ...fixedQuery,
      },
      requestedPage,
    ),
  ]);

  const { products } = productPage;
  const hasActiveFilters = Object.entries(searchParams).some(
    ([key, value]) => key !== "page" && Boolean(value),
  );

  return (
    <div className="container-site section-pad !pt-8 md:!pt-12">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: breadcrumbLabel || title },
        ]}
      />
      <header className="mt-10 mb-10 max-w-4xl md:mb-14">
        <p className="eyebrow">Aylee collection</p>
        <h1 className="page-title mt-4">{title}</h1>
        <p className="mt-5 max-w-2xl text-[#6c6961]">{description}</p>
      </header>
      {showFilters ? <ShopFilters categories={categories} /> : null}
      <div className="mt-8 mb-6 flex items-center justify-between text-xs text-[#6c6961]">
        <p aria-live="polite">
          {productPage.total
            ? `Showing ${productPage.from}–${productPage.to} of ${productPage.total} styles`
            : "0 styles"}
        </p>
        {hasActiveFilters ? (
          <a href="?" className="underline underline-offset-4">
            Clear filters
          </a>
        ) : null}
      </div>
      {products.length ? (
        <>
          <ProductGrid products={products} eagerCount={4} />
          <CatalogPagination
            currentPage={productPage.currentPage}
            totalPages={productPage.totalPages}
          />
        </>
      ) : (
        <EmptyState
          title="Nothing matched"
          message="Try clearing a filter or use a broader search term. If the catalog is temporarily unavailable, it will return automatically."
        />
      )}
    </div>
  );
}
