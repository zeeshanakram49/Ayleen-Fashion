"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Heart, Minus, Plus, ShoppingBag } from "lucide-react";
import { useRouter } from "next/navigation";
import { useStore } from "@/components/providers/store-provider";
import { isVariantSelectionComplete } from "@/lib/utils/product";
import type { Product } from "@/types/commerce";

export function ProductPurchase({ product }: { product: Product }) {
  const router = useRouter();
  const { addItem, wishlist, toggleWishlist } = useStore();
  const [size, setSize] = useState("");
  const [color, setColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const complete = isVariantSelectionComplete(product, { size, color });
  const enabled = product.isAvailable && complete;
  const favourite = wishlist.includes(product.id);

  function add() {
    if (!enabled) return;
    addItem(product, { size, color, quantity });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 2200);
  }

  function buyNow() {
    add();
    if (enabled) router.push("/checkout");
  }

  return (
    <div className="mt-7 space-y-7">
      {product.sizes.length > 0 ? (
        <fieldset>
          <div className="flex items-center justify-between">
            <legend className="text-sm font-semibold">Size</legend>
            <Link
              href="/size-guide"
              className="text-xs underline underline-offset-4"
            >
              Size guide
            </Link>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {product.sizes.map((entry) => (
              <button
                key={entry}
                type="button"
                onClick={() => setSize(entry)}
                className={`min-h-11 min-w-12 border px-3 text-xs font-semibold ${size === entry ? "border-[#171613] bg-[#171613] text-white" : "border-[#dedbd2]"}`}
                aria-pressed={size === entry}
              >
                {entry}
              </button>
            ))}
          </div>
          {!size ? (
            <p className="mt-2 text-xs text-[#6c6961]">
              Select a size to continue.
            </p>
          ) : null}
        </fieldset>
      ) : null}
      {product.colors.length > 0 ? (
        <fieldset>
          <legend className="text-sm font-semibold">Colour</legend>
          <div className="mt-3 flex flex-wrap gap-2">
            {product.colors.map((entry) => (
              <button
                key={entry}
                type="button"
                onClick={() => setColor(entry)}
                className={`min-h-11 border px-4 text-xs ${color === entry ? "border-[#171613] bg-[#171613] text-white" : "border-[#dedbd2]"}`}
                aria-pressed={color === entry}
              >
                {entry}
              </button>
            ))}
          </div>
        </fieldset>
      ) : null}
      <div>
        <p className="text-sm font-semibold">Quantity</p>
        <div className="mt-3 inline-flex h-11 items-center border border-[#dedbd2]">
          <button
            type="button"
            onClick={() => setQuantity((current) => Math.max(1, current - 1))}
            className="h-full px-3"
            aria-label="Decrease quantity"
          >
            <Minus size={14} />
          </button>
          <span className="min-w-10 text-center" aria-live="polite">
            {quantity}
          </span>
          <button
            type="button"
            onClick={() =>
              setQuantity((current) => Math.min(product.stock, current + 1))
            }
            className="h-full px-3"
            aria-label="Increase quantity"
            disabled={quantity >= product.stock}
          >
            <Plus size={14} />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-[1fr_52px] gap-2">
        <button
          type="button"
          onClick={add}
          disabled={!enabled}
          className="button-primary w-full"
          data-testid="add-to-cart"
        >
          {added ? (
            <>
              <Check size={17} /> Added to bag
            </>
          ) : (
            <>
              <ShoppingBag size={17} />{" "}
              {product.isAvailable ? "Add to bag" : "Sold out"}
            </>
          )}
        </button>
        <button
          type="button"
          onClick={() => toggleWishlist(product.id)}
          className="grid min-h-12 place-items-center border border-[#171613]"
          aria-label={favourite ? "Remove from wishlist" : "Add to wishlist"}
          aria-pressed={favourite}
        >
          <Heart size={19} fill={favourite ? "currentColor" : "none"} />
        </button>
      </div>
      <button
        type="button"
        onClick={buyNow}
        disabled={!enabled}
        className="button-secondary w-full"
      >
        Buy now
      </button>
      <p className="sr-only" aria-live="polite">
        {added ? `${product.name} added to your bag` : ""}
      </p>
    </div>
  );
}
