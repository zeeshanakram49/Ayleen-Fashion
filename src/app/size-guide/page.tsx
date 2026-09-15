import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { AlertCircle } from "lucide-react";
import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { getProduct, getProducts } from "@/lib/commerce/products";
import { createMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = createMetadata({
  title: "Size guide",
  description: "Aylee sizing information and support.",
  path: "/size-guide",
});
type SizeGuideSearchParams = Promise<{
  product?: string | string[];
}>;

export default async function SizeGuidePage({
  searchParams,
}: {
  searchParams: SizeGuideSearchParams;
}) {
  const params = await searchParams;
  const requestedSlug = Array.isArray(params.product)
    ? params.product[0]
    : params.product;
  const requestedProduct = requestedSlug
    ? await getProduct(requestedSlug)
    : null;
  const catalog =
    !requestedProduct?.sizeChart || !requestedSlug ? await getProducts() : [];
  const matchingChartProduct = requestedProduct
    ? catalog.find(
        (product) =>
          product.sizeChart &&
          (product.name.toLocaleLowerCase() ===
            requestedProduct.name.toLocaleLowerCase() ||
            (product.category?.id &&
              product.category.id === requestedProduct.category?.id)),
      )
    : null;
  const chartProducts = requestedProduct
    ? requestedProduct.sizeChart
      ? [requestedProduct]
      : matchingChartProduct
        ? [matchingChartProduct]
        : []
    : catalog.filter((product) => product.sizeChart);
  const seenCharts = new Set<string>();
  const charts = chartProducts.filter((product) => {
    if (!product.sizeChart || seenCharts.has(product.sizeChart)) return false;
    seenCharts.add(product.sizeChart);
    return true;
  });

  return (
    <div className="container-site section-pad !pt-8 md:!pt-12">
      <Breadcrumbs
        items={[{ label: "Home", href: "/" }, { label: "Size guide" }]}
      />
      <div className="mx-auto mt-10 max-w-3xl">
        <p className="eyebrow">Fit help</p>
        <h1 className="page-title mt-4">Size guide</h1>
        {requestedProduct ? (
          <p className="mt-3 text-sm text-[#6c6961]">
            Measurements for {requestedProduct.name}
          </p>
        ) : null}

        {charts.length ? (
          <div className="mt-8 space-y-8">
            {charts.map((product, index) => (
              <figure
                key={product.sizeChart}
                className="border border-[#dedbd2] bg-white p-4 shadow-[0_12px_35px_rgb(23_22_19/0.06)] md:p-7"
              >
                {!requestedProduct ? (
                  <figcaption className="mb-4 text-sm font-semibold">
                    {product.name}
                  </figcaption>
                ) : null}
                <Image
                  src={product.sizeChart!}
                  alt={`${product.name} size chart`}
                  width={1034}
                  height={544}
                  priority={index === 0}
                  className="h-auto w-full"
                  sizes="(max-width: 768px) calc(100vw - 4rem), 768px"
                />
              </figure>
            ))}
          </div>
        ) : (
          <div className="mt-8 flex gap-3 border border-[#c7a352] bg-[#fff9e9] p-5">
            <AlertCircle className="shrink-0" />
            <p>
              <strong>Size chart is not available for this product.</strong>{" "}
              Check its available size labels or contact Aylee customer service
              for fit advice before ordering.
            </p>
          </div>
        )}
        <section className="mt-10">
          <h2 className="serif text-3xl">Choose with confidence</h2>
          <p className="mt-4 text-[#57544d]">
            Check the available size labels on each product page. For
            product-specific measurements or fit advice, contact Aylee customer
            service before ordering.
          </p>
          <div className="mt-7 flex gap-3">
            <Link href="/contact" className="button-primary">
              Ask about sizing
            </Link>
            <Link href="/shop" className="button-secondary">
              Return to shop
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
