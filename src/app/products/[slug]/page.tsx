import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2, ShieldCheck, Truck } from "lucide-react";
import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { JsonLd } from "@/components/common/json-ld";
import { ProductGallery } from "@/components/product/product-gallery";
import { ProductGrid } from "@/components/product/product-grid";
import { ProductPurchase } from "@/components/product/product-purchase";
import { RecentlyViewed } from "@/components/product/recently-viewed";
import {
  getProduct,
  getProducts,
  getRelatedProducts,
} from "@/lib/commerce/products";
import { formatPrice } from "@/lib/utils/format";
import { breadcrumbJsonLd, createMetadata } from "@/lib/seo/metadata";
import { siteConfig } from "@/config/site";

export const revalidate = 300;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product)
    return createMetadata({
      title: "Product not found",
      description: "This product is no longer available.",
      path: `/products/${slug}`,
      noIndex: true,
    });
  return createMetadata({
    title: product.name,
    description: product.description || `Shop ${product.name} by Aylee.`,
    path: `/products/${slug}`,
    image: product.images[0]?.url || null,
  });
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();
  const [related, catalog] = await Promise.all([
    getRelatedProducts(product),
    getProducts(),
  ]);
  const productUrl = `${siteConfig.url}/products/${product.slug}`;
  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: product.images.map((image) => image.url),
    description: product.description || undefined,
    sku: product.sku || undefined,
    brand: { "@type": "Brand", name: product.brand },
    category: product.category?.name,
    offers: {
      "@type": "Offer",
      url: productUrl,
      priceCurrency: product.currency,
      price: product.price,
      itemCondition: "https://schema.org/NewCondition",
      availability: product.isAvailable
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
    },
  };
  const breadcrumbs = [
    { name: "Home", path: "/" },
    { name: "Shop", path: "/shop" },
    ...(product.category
      ? [
          {
            name: product.category.name,
            path: `/categories/${product.category.slug}`,
          },
        ]
      : []),
    { name: product.name, path: `/products/${product.slug}` },
  ];

  return (
    <>
      <JsonLd data={productJsonLd} />
      <JsonLd data={breadcrumbJsonLd(breadcrumbs)} />
      <div className="container-site py-8 md:py-12">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Shop", href: "/shop" },
            ...(product.category
              ? [
                  {
                    label: product.category.name,
                    href: `/categories/${product.category.slug}`,
                  },
                ]
              : []),
            { label: product.name },
          ]}
        />
        <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(360px,0.7fr)] lg:gap-16">
          <ProductGallery images={product.images} productName={product.name} />
          <div className="lg:sticky lg:top-32 lg:self-start">
            <p className="eyebrow">{product.category?.name || "Aylee"}</p>
            <h1 className="serif mt-3 text-4xl leading-none tracking-[-0.04em] md:text-6xl">
              {product.name}
            </h1>
            <div className="mt-5 flex items-center gap-3 text-lg">
              <strong>{formatPrice(product.price)}</strong>
              {product.compareAtPrice ? (
                <del className="text-[#88847b]">
                  {formatPrice(product.compareAtPrice)}
                </del>
              ) : null}
              {product.discountPercent ? (
                <span className="bg-[#6f2d24] px-2 py-1 text-xs font-bold text-white">
                  Save {product.discountPercent}%
                </span>
              ) : null}
            </div>
            <p
              className={`mt-4 text-sm font-medium ${product.isAvailable ? "text-[#28633b]" : "text-[#8a2626]"}`}
            >
              {product.isAvailable
                ? `${product.stock} in stock`
                : "Currently unavailable"}
            </p>
            {product.description ? (
              <p className="mt-6 leading-7 text-[#57544d]">
                {product.description}
              </p>
            ) : null}
            <ProductPurchase product={product} />
            <div className="mt-8 grid gap-3 border-y border-[#dedbd2] py-6 text-sm">
              <p className="flex items-center gap-3">
                <Truck size={18} strokeWidth={1.5} /> Nationwide delivery. Free
                above {formatPrice(siteConfig.freeShippingThreshold)}.
              </p>
              <p className="flex items-center gap-3">
                <CheckCircle2 size={18} strokeWidth={1.5} /> Published 7-day
                exchange support for eligible unused articles.
              </p>
              <p className="flex items-center gap-3">
                <ShieldCheck size={18} strokeWidth={1.5} /> Secure hosted
                payment methods.
              </p>
            </div>
            <div className="divide-y divide-[#dedbd2]">
              <details className="py-5" open>
                <summary className="font-semibold">Product details</summary>
                <p className="mt-3 text-sm leading-7 text-[#6c6961]">
                  {product.description ||
                    "No additional product details are currently published by the commerce backend."}
                </p>
              </details>
              <details className="py-5">
                <summary className="font-semibold">Shipping</summary>
                <p className="mt-3 text-sm leading-7 text-[#6c6961]">
                  Nationwide delivery is advertised.{" "}
                  <Link
                    href="/shipping-policy"
                    className="underline underline-offset-4"
                  >
                    Read the published summary.
                  </Link>
                </p>
              </details>
              <details className="py-5">
                <summary className="font-semibold">Exchanges</summary>
                <p className="mt-3 text-sm leading-7 text-[#6c6961]">
                  Exchange support is advertised for eligible unused articles
                  with original tags.{" "}
                  <Link
                    href="/exchange-policy"
                    className="underline underline-offset-4"
                  >
                    Read the published summary.
                  </Link>
                </p>
              </details>
              <details className="py-5">
                <summary className="font-semibold">Reviews</summary>
                <p className="mt-3 text-sm leading-7 text-[#6c6961]">
                  No verified review data is published for this product. A
                  rating is not displayed until authentic review data is
                  available.
                </p>
              </details>
            </div>
          </div>
        </div>
      </div>
      {related.length ? (
        <section className="section-pad container-site">
          <h2 className="serif mb-8 text-4xl tracking-[-0.04em] md:text-5xl">
            You may also like
          </h2>
          <ProductGrid products={related} />
        </section>
      ) : null}
      <RecentlyViewed currentId={product.id} products={catalog} />
    </>
  );
}
