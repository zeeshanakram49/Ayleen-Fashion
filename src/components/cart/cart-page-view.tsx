"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useStore } from "@/components/providers/store-provider";
import { EmptyState } from "@/components/common/empty-state";
import { formatPrice } from "@/lib/utils/format";
import { siteConfig } from "@/config/site";

export function CartPageView() {
  const { lines, summary, updateQuantity, removeItem, clearCart } = useStore();
  if (!lines.length)
    return (
      <EmptyState
        title="Your bag is empty"
        message="Add a piece you love and it will be saved on this device."
      />
    );

  const progress = Math.min(
    100,
    (summary.subtotal / siteConfig.freeShippingThreshold) * 100,
  );
  return (
    <div className="grid gap-12 lg:grid-cols-[1fr_380px] lg:items-start">
      <div>
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm text-[#6c6961]">{summary.itemCount} items</p>
          <button
            type="button"
            onClick={clearCart}
            className="text-xs underline underline-offset-4"
          >
            Clear bag
          </button>
        </div>
        <ul className="divide-y divide-[#dedbd2] border-y border-[#dedbd2]">
          {lines.map((line) => (
            <li
              key={line.key}
              className="grid grid-cols-[96px_1fr] gap-4 py-6 sm:grid-cols-[132px_1fr] sm:gap-6"
            >
              <Link
                href={`/products/${line.slug}`}
                className="relative aspect-[4/5] bg-[#efede7]"
              >
                {line.image ? (
                  <Image
                    src={line.image}
                    alt={line.name}
                    fill
                    sizes="132px"
                    className="object-cover"
                  />
                ) : null}
              </Link>
              <div className="flex min-w-0 flex-col justify-between">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-medium">
                      <Link
                        href={`/products/${line.slug}`}
                        className="hover:underline"
                      >
                        {line.name}
                      </Link>
                    </p>
                    <p className="mt-1 text-xs text-[#6c6961]">
                      {[line.size && `Size ${line.size}`, line.color]
                        .filter(Boolean)
                        .join(" · ") || "Standard"}
                    </p>
                  </div>
                  <strong className="text-sm whitespace-nowrap">
                    {formatPrice(line.price * line.quantity)}
                  </strong>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex h-10 items-center border border-[#dedbd2]">
                    <button
                      type="button"
                      onClick={() =>
                        updateQuantity(line.key, line.quantity - 1)
                      }
                      className="h-full px-3"
                      aria-label={`Decrease ${line.name} quantity`}
                    >
                      <Minus size={14} />
                    </button>
                    <span className="min-w-9 text-center text-sm">
                      {line.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        updateQuantity(line.key, line.quantity + 1)
                      }
                      className="h-full px-3"
                      aria-label={`Increase ${line.name} quantity`}
                      disabled={line.quantity >= line.stock}
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeItem(line.key)}
                    className="p-2 text-[#6c6961]"
                    aria-label={`Remove ${line.name}`}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <aside className="border border-[#dedbd2] bg-[#f7f5f0] p-6 lg:sticky lg:top-32">
        <h2 className="serif text-3xl">Order summary</h2>
        <div className="mt-6 flex justify-between text-sm">
          <span>Subtotal</span>
          <strong>{formatPrice(summary.subtotal)}</strong>
        </div>
        <div className="mt-3 flex justify-between text-sm">
          <span>Shipping</span>
          <span>Calculated at checkout</span>
        </div>
        <div className="mt-6 border-t border-[#dedbd2] pt-6">
          <p className="text-xs">
            {summary.hasFreeShipping
              ? "You qualify for free shipping."
              : `Add ${formatPrice(summary.remainingForFreeShipping)} for free shipping.`}
          </p>
          <div className="mt-3 h-1.5 bg-[#d4d0c7]">
            <div
              className="h-full bg-[#6f2d24]"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
        <div className="mt-6">
          <label htmlFor="coupon" className="text-xs font-semibold">
            Coupon code
          </label>
          <div className="mt-2 flex">
            <input
              id="coupon"
              className="field"
              placeholder="Enter code"
              disabled
              aria-describedby="coupon-help"
            />
            <button
              type="button"
              disabled
              className="button-secondary !min-h-12"
            >
              Apply
            </button>
          </div>
          <p id="coupon-help" className="mt-2 text-xs text-[#6c6961]">
            Coupon validation will appear when enabled by the commerce backend.
          </p>
        </div>
        <Link href="/checkout" className="button-primary mt-7 w-full">
          <ShoppingBag size={16} /> Continue to checkout
        </Link>
        <Link
          href="/shop"
          className="mt-4 block text-center text-xs underline underline-offset-4"
        >
          Continue shopping
        </Link>
      </aside>
    </div>
  );
}
