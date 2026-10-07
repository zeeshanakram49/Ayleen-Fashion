import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { CheckCircle2, ShieldCheck, Truck } from "lucide-react";

import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { JsonLd } from "@/components/common/json-ld";
import { ProductGallery } from "@/components/product/product-gallery";
import { ProductGrid } from "@/components/product/product-grid";
import { ProductPurchase } from "@/components/product/product-purchase";
import { RecentlyViewed } from "@/components/product/recently-viewed";
import { ProductViewEvent } from "@/components/analytics/product-view-event";

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

  if (!product) {
    return createMetadata({
      title: "Product not found",
      description: "This product is no longer available.",
      path: `/products/${slug}`,
      noIndex: true,
    });
  }

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

  if (!product) {
    notFound();
  }

  const [related, catalog] = await Promise.all([
    getRelatedProducts(product),
    getProducts(),
  ]);
  const otherVersions = catalog
    .filter(
      (item) =>
        item.id !== product.id &&
        item.name === product.name &&
        item.category?.id === product.category?.id,
    )
    .slice(0, 8);

  const productUrl = `${siteConfig.url}/products/${product.slug}`;

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: product.images.map((image) => image.url),
    description: product.description || undefined,
    sku: product.sku || undefined,
    brand: {
      "@type": "Brand",
      name: product.brand,
    },
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
    {
      name: "Home",
      path: "/",
    },
    {
      name: "Shop",
      path: "/shop",
    },
    ...(product.category
      ? [
          {
            name: product.category.name,
            path: `/categories/${product.category.slug}`,
          },
        ]
      : []),
    {
      name: product.name,
      path: `/products/${product.slug}`,
    },
  ];

  return (
    <>
      {/* SEO Structured Data */}
      <JsonLd data={productJsonLd} />
      <JsonLd data={breadcrumbJsonLd(breadcrumbs)} />

      {/* Meta Pixel - Product View Tracking */}
      <ProductViewEvent
        contentId={String(product.id)}
        contentName={product.name}
        value={Number(product.price)}
        currency={product.currency || "PKR"}
      />

      {/* Product Section */}
      <div className="container-site py-8 md:py-12">
        <Breadcrumbs
          items={[
            {
              label: "Home",
              href: "/",
            },
            {
              label: "Shop",
              href: "/shop",
            },

            ...(product.category
              ? [
                  {
                    label: product.category.name,
                    href: `/categories/${product.category.slug}`,
                  },
                ]
              : []),

            {
              label: product.name,
            },
          ]}
        />

        <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(360px,0.7fr)] lg:gap-16">
          {/* Product Images */}
          <div className="min-w-0">
            <ProductGallery
              images={product.images}
              productName={product.name}
            />
            {product.video ? (
              <div className="mt-5">
                <p className="mb-2 text-sm font-semibold">Product video</p>
                <video
                  controls
                  playsInline
                  preload="metadata"
                  className="w-full"
                  src={product.video}
                  aria-label={`${product.name} product video`}
                />
              </div>
            ) : null}
          </div>

          {/* Product Information */}
          <div className="lg:sticky lg:top-32 lg:self-start">
            <p className="eyebrow">{product.category?.name || "Aylee"}</p>

            <h1 className="serif mt-3 text-4xl leading-none tracking-[-0.04em] md:text-6xl">
              {product.name}
            </h1>

            {/* Price */}
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

            {/* Stock */}
            <p
              className={`mt-4 text-sm font-medium ${
                product.isAvailable ? "text-[#28633b]" : "text-[#8a2626]"
              }`}
            >
              {product.isAvailable
                ? `${product.stock} in stock`
                : "Currently unavailable"}
            </p>

            {/* Description */}
            {product.description ? (
              <p className="mt-6 leading-7 text-[#57544d]">
                {product.description}
              </p>
            ) : null}

            {/* Purchase Component */}
            <ProductPurchase product={product} />

            {otherVersions.length ? (
              <div className="mt-6">
                <p className="mb-3 text-sm font-semibold">
                  Explore other versions
                </p>
                <div className="flex flex-wrap gap-2">
                  {otherVersions.map((item) => (
                    <Link
                      key={item.id}
                      href={`/products/${item.slug}`}
                      className="block size-14 overflow-hidden border border-[#dedbd2]"
                      aria-label={`View ${item.name} version ${item.id}`}
                      title={`View ${item.name}`}
                    >
                      <span className="relative block size-full">
                        {item.images[0] ? (
                          <Image
                            src={
                              item.images[0].thumbnailUrl || item.images[0].url
                            }
                            alt=""
                            fill
                            sizes="56px"
                            className="object-cover"
                          />
                        ) : null}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            ) : null}

            <p className="mt-4 text-sm text-[#57544d]">
              Cash on Delivery available.{" "}
              <a
                className="underline underline-offset-4"
                href={`${siteConfig.contact.whatsappHref}?text=${encodeURIComponent(`Hi Aylee, I need size help for ${product.name}: ${productUrl}`)}`}
              >
                Ask for size help on WhatsApp
              </a>
              .
            </p>

            {/* Delivery / Exchange / Security */}
            <div className="mt-8 grid gap-3 border-y border-[#dedbd2] py-6 text-sm">
              <p className="flex items-center gap-3">
                <Truck size={18} strokeWidth={1.5} />
                Nationwide delivery. Free above{" "}
                {formatPrice(siteConfig.freeShippingThreshold)}.
              </p>

              <p className="flex items-center gap-3">
                <CheckCircle2 size={18} strokeWidth={1.5} />
                Need an exchange? Contact us before returning an unused item
                with its tags.
              </p>

              <p className="flex items-center gap-3">
                <ShieldCheck size={18} strokeWidth={1.5} />
                Secure hosted payment methods.
              </p>
            </div>

            {/* Product Information Sections */}
            <div className="divide-y divide-[#dedbd2]">
              <details className="py-5" open>
                <summary className="font-semibold">Product details</summary>

                <p className="mt-3 text-sm leading-7 text-[#6c6961]">
                  {product.description ||
                    "Ask Aylee for more information about this item."}
                </p>
                {(
                  [
                    ["Fabric", product.fabricComposition],
                    ["Fit", product.fit],
                    ["Care", product.washingInstructions],
                    ["Model wears", product.modelSize],
                  ] as const
                )
                  .filter(([, value]) => Boolean(value))
                  .map(([label, value]) => (
                    <p key={label} className="mt-2 text-sm text-[#57544d]">
                      <strong>{label}:</strong> {value}
                    </p>
                  ))}
              </details>

              <details className="py-5">
                <summary className="font-semibold">Shipping</summary>

                <p className="mt-3 text-sm leading-7 text-[#6c6961]">
                  Nationwide delivery. Free on orders of{" "}
                  {formatPrice(siteConfig.freeShippingThreshold)} or more.{" "}
                  <Link
                    href="/shipping-policy"
                    className="underline underline-offset-4"
                  >
                    Shipping details
                  </Link>
                </p>
              </details>

              <details className="py-5">
                <summary className="font-semibold">Exchanges</summary>

                <p className="mt-3 text-sm leading-7 text-[#6c6961]">
                  Contact Aylee before sending an item back.{" "}
                  <Link
                    href="/exchange-policy"
                    className="underline underline-offset-4"
                  >
                    Exchange information
                  </Link>
                </p>
              </details>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {related.length ? (
        <section className="section-pad container-site">
          <h2 className="serif mb-8 text-4xl tracking-[-0.04em] md:text-5xl">
            You may also like
          </h2>

          <ProductGrid products={related} />
        </section>
      ) : null}

      {/* Recently Viewed */}
      <RecentlyViewed currentId={product.id} products={catalog} />
    </>
  );
}
