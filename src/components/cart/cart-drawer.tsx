"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, ShoppingBag, X } from "lucide-react";
import { useStore } from "@/components/providers/store-provider";
import { amountUntilFreeShipping, formatPrice } from "@/lib/utils/format";
import { siteConfig } from "@/config/site";

export function CartDrawer() {
  const {
    drawerOpen,
    setDrawerOpen,
    lines,
    summary,
    updateQuantity,
    removeItem,
  } = useStore();
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!drawerOpen) return;
    closeRef.current?.focus();
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setDrawerOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [drawerOpen, setDrawerOpen]);

  if (!drawerOpen) return null;
  const remaining = amountUntilFreeShipping(summary.subtotal);
  const progress = Math.min(
    100,
    (summary.subtotal / siteConfig.freeShippingThreshold) * 100,
  );

  return (
    <div
      className="fixed inset-0 z-[80]"
      role="dialog"
      aria-modal="true"
      aria-label="Shopping bag"
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/45"
        onClick={() => setDrawerOpen(false)}
        aria-label="Close shopping bag"
      />
      <div className="absolute top-0 right-0 flex h-full w-full max-w-md flex-col bg-white shadow-2xl">
        <div className="flex min-h-20 items-center justify-between border-b border-[#dedbd2] px-5">
          <div className="flex items-center gap-3">
            <ShoppingBag size={20} aria-hidden />
            <h2 className="serif text-2xl">Your bag</h2>
            <span className="text-xs text-[#6c6961]">
              ({summary.itemCount})
            </span>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={() => setDrawerOpen(false)}
            className="p-3"
            aria-label="Close bag"
          >
            <X size={22} />
          </button>
        </div>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
            <ShoppingBag size={38} strokeWidth={1.2} aria-hidden />
            <p className="serif mt-5 text-3xl">Your bag is waiting</p>
            <p className="mt-2 text-sm text-[#6c6961]">
              Discover the latest pieces and add a favourite.
            </p>
            <Link
              href="/shop"
              onClick={() => setDrawerOpen(false)}
              className="button-primary mt-7"
            >
              Shop now
            </Link>
          </div>
        ) : (
          <>
            <div className="border-b border-[#dedbd2] bg-[#f7f5f0] px-5 py-4">
              <p className="text-xs">
                {remaining > 0 ? (
                  <>
                    Add <strong>{formatPrice(remaining)}</strong> more for free
                    shipping.
                  </>
                ) : (
                  <strong>You qualify for free shipping.</strong>
                )}
              </p>
              <div
                className="mt-3 h-1.5 overflow-hidden bg-[#dedbd2]"
                aria-hidden
              >
                <div
                  className="h-full bg-[#6f2d24] transition-[width]"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
            <ul className="flex-1 divide-y divide-[#dedbd2] overflow-y-auto px-5">
              {lines.map((line) => (
                <li
                  key={line.key}
                  className="grid grid-cols-[88px_1fr] gap-4 py-5"
                >
                  <Link
                    href={`/products/${line.slug}`}
                    onClick={() => setDrawerOpen(false)}
                    className="relative aspect-[4/5] bg-[#f0eee8]"
                  >
                    {line.image ? (
                      <Image
                        src={line.image}
                        alt={line.name}
                        fill
                        sizes="88px"
                        className="object-cover"
                      />
                    ) : null}
                  </Link>
                  <div className="min-w-0">
                    <div className="flex justify-between gap-3">
                      <div>
                        <Link
                          href={`/products/${line.slug}`}
                          onClick={() => setDrawerOpen(false)}
                          className="font-medium hover:underline"
                        >
                          {line.name}
                        </Link>
                        <p className="mt-1 text-xs text-[#6c6961]">
                          {[line.size && `Size ${line.size}`, line.color]
                            .filter(Boolean)
                            .join(" · ") || "Standard"}
                        </p>
                      </div>
                      <p className="text-sm">
                        {formatPrice(line.price * line.quantity)}
                      </p>
                    </div>
                    <div className="mt-5 flex items-center justify-between">
                      <div className="flex h-9 items-center border border-[#dedbd2]">
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(line.key, line.quantity - 1)
                          }
                          className="h-full px-2.5"
                          aria-label={`Decrease ${line.name} quantity`}
                        >
                          <Minus size={13} />
                        </button>
                        <span
                          className="min-w-8 text-center text-xs"
                          aria-live="polite"
                        >
                          {line.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(line.key, line.quantity + 1)
                          }
                          className="h-full px-2.5"
                          aria-label={`Increase ${line.name} quantity`}
                          disabled={line.quantity >= line.stock}
                        >
                          <Plus size={13} />
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(line.key)}
                        className="text-xs underline underline-offset-4"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <div className="border-t border-[#dedbd2] p-5">
              <div className="flex items-center justify-between">
                <span className="text-sm">Subtotal</span>
                <strong>{formatPrice(summary.subtotal)}</strong>
              </div>
              <p className="mt-1 text-xs text-[#6c6961]">
                Shipping and discounts are confirmed at checkout.
              </p>
              <Link
                href="/checkout"
                onClick={() => setDrawerOpen(false)}
                className="button-primary mt-5 w-full"
              >
                Secure checkout
              </Link>
              <Link
                href="/cart"
                onClick={() => setDrawerOpen(false)}
                className="mt-3 block text-center text-xs underline underline-offset-4"
              >
                View full bag
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
