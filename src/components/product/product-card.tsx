"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, Plus } from "lucide-react";
import { useStore } from "@/components/providers/store-provider";
import { calculateDiscount, formatPrice } from "@/lib/utils/format";
import type { Product } from "@/types/commerce";

export function ProductCard({
  product,
  eager = false,
}: {
  product: Product;
  eager?: boolean;
}) {
  const { addItem, wishlist, toggleWishlist } = useStore();
  const favourite = wishlist.includes(product.id);
  const discount = calculateDiscount(product.price, product.compareAtPrice);
  const primary = product.images[0];
  const secondary = product.images[1];

  return (
    <article className="group min-w-0" data-testid="product-card">
      <div className="relative aspect-[4/5] overflow-hidden bg-[#efede7]">
        <Link
          href={`/products/${product.slug}`}
          aria-label={`View ${product.name}`}
          className="absolute inset-0"
        >
          {primary ? (
            <Image
              src={primary.thumbnailUrl || primary.url}
              alt={primary.alt}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className={`object-cover transition-opacity duration-300 ${secondary ? "group-hover:opacity-0" : ""}`}
              loading={eager ? "eager" : "lazy"}
            />
          ) : (
            <span className="serif flex h-full items-center justify-center text-2xl text-[#9a968d]">
              Aylee
            </span>
          )}
          {secondary ? (
            <Image
              src={secondary.thumbnailUrl || secondary.url}
              alt={secondary.alt}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            />
          ) : null}
        </Link>
        <div className="absolute top-3 left-3 flex flex-col items-start gap-1.5">
          {discount > 0 ? (
            <span className="bg-[#6f2d24] px-2.5 py-1 text-[0.65rem] font-bold tracking-wider text-white uppercase">
              -{discount}%
            </span>
          ) : null}
          {!product.isAvailable ? (
            <span className="bg-white px-2.5 py-1 text-[0.65rem] font-bold tracking-wider uppercase">
              Sold out
            </span>
          ) : null}
        </div>
        <button
          type="button"
          onClick={() => toggleWishlist(product.id)}
          className="absolute top-3 right-3 grid size-10 place-items-center rounded-full bg-white/90 shadow-sm"
          aria-label={
            favourite
              ? `Remove ${product.name} from wishlist`
              : `Add ${product.name} to wishlist`
          }
          aria-pressed={favourite}
        >
          <Heart size={18} fill={favourite ? "currentColor" : "none"} />
        </button>
        {product.isAvailable ? (
          <button
            type="button"
            onClick={() => addItem(product)}
            className="absolute inset-x-3 bottom-3 flex min-h-11 translate-y-3 items-center justify-center gap-2 bg-white px-3 text-xs font-bold tracking-wider uppercase opacity-0 shadow-sm transition group-hover:translate-y-0 group-hover:opacity-100 focus:translate-y-0 focus:opacity-100 max-md:translate-y-0 max-md:opacity-100"
            aria-label={`Quick add ${product.name}`}
          >
            <Plus size={15} /> Quick add
          </button>
        ) : null}
      </div>
      <div className="pt-4">
        <p className="text-xs text-[#6c6961]">
          {product.category?.name || "Aylee"}
        </p>
        <h3 className="mt-1 leading-snug">
          <Link
            href={`/products/${product.slug}`}
            className="underline-offset-4 hover:underline"
          >
            {product.name}
          </Link>
        </h3>
        <div className="mt-2 flex flex-wrap items-center gap-2 text-sm">
          <strong>{formatPrice(product.price)}</strong>
          {product.compareAtPrice ? (
            <del className="text-[#88847b]">
              {formatPrice(product.compareAtPrice)}
            </del>
          ) : null}
        </div>
        {product.colors.length > 0 ? (
          <p className="mt-2 text-xs text-[#6c6961]">
            {product.colors.slice(0, 3).join(" · ")}
          </p>
        ) : null}
      </div>
    </article>
  );
}
