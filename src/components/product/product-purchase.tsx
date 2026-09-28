"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertCircle,
  Check,
  Heart,
  Minus,
  Plus,
  ShoppingBag,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useStore } from "@/components/providers/store-provider";
import { isVariantSelectionComplete } from "@/lib/utils/product";
import { MagneticButton } from "@/components/motion/magnetic-button";
import type { Product } from "@/types/commerce";

export function ProductPurchase({ product }: { product: Product }) {
  const router = useRouter();

  const { addItem, wishlist, toggleWishlist } = useStore();

  const [size, setSize] = useState("");
  const [color, setColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [showValidation, setShowValidation] = useState(false);
  const sizeFieldRef = useRef<HTMLFieldSetElement>(null);
  const colourFieldRef = useRef<HTMLFieldSetElement>(null);
  const selectedColor = product.colors.length === 1 ? product.colors[0] : color;

  const hasSizeOptions = product.sizes.length > 0;
  const hasColourOptions = product.colors.length > 0;
  const totalSelections = Number(hasSizeOptions) + Number(hasColourOptions);
  const completedSelections =
    Number(hasSizeOptions && Boolean(size)) +
    Number(hasColourOptions && Boolean(selectedColor));
  const missingSize = hasSizeOptions && !size;
  const missingColour = hasColourOptions && !selectedColor;

  const complete = isVariantSelectionComplete(product, {
    size,
    color: selectedColor,
  });

  const favourite = wishlist.includes(product.id);

  /**
   * Meta Pixel - AddToCart
   */
  function trackAddToCart() {
    if (typeof window === "undefined") return;

    if (typeof window.fbq !== "function") return;

    const unitPrice = Number(product.price);
    const totalValue = unitPrice * quantity;

    window.fbq("track", "AddToCart", {
      content_ids: [String(product.id)],

      content_name: product.name,

      content_type: "product",

      contents: [
        {
          id: String(product.id),
          quantity,
          item_price: unitPrice,
        },
      ],

      value: totalValue,

      currency: product.currency || "PKR",
    });
  }

  /**
   * Add product to cart
   */
  function add() {
    if (!validateSelection()) return;

    addItem(product, {
      size,
      color: selectedColor,
      quantity,
    });

    /**
     * Fire Meta AddToCart event
     */
    trackAddToCart();

    setAdded(true);

    window.setTimeout(() => {
      setAdded(false);
    }, 2200);
  }

  /**
   * Buy Now
   *
   * Product is first added to cart.
   * Checkout page will later fire InitiateCheckout.
   */
  function buyNow() {
    if (!validateSelection()) return;

    add();

    router.push("/checkout");
  }

  function validateSelection() {
    if (!product.isAvailable) return false;
    if (complete) return true;

    setShowValidation(true);

    const firstMissingField = missingSize
      ? sizeFieldRef.current
      : colourFieldRef.current;

    window.requestAnimationFrame(() => {
      firstMissingField?.focus({ preventScroll: true });
      firstMissingField?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    });

    return false;
  }

  return (
    <div className="mt-7 space-y-7">
      {totalSelections > 0 ? (
        <div className="border border-[#dedbd2] bg-[#faf8f3] px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold">Choose your options</p>
              <p className="mt-0.5 text-xs text-[#6c6961]">
                Select the required options before adding to your bag.
              </p>
            </div>
            <span
              className={`shrink-0 text-xs font-semibold ${
                complete ? "text-[#2f6b45]" : "text-[#6c6961]"
              }`}
              aria-live="polite"
            >
              {complete
                ? "Ready to add"
                : `${completedSelections} of ${totalSelections} selected`}
            </span>
          </div>
        </div>
      ) : null}

      {/* SIZE */}
      {hasSizeOptions ? (
        <fieldset
          ref={sizeFieldRef}
          tabIndex={-1}
          aria-labelledby="size-selection-label"
          aria-describedby={missingSize ? "size-selection-help" : undefined}
          className={`transition-colors outline-none ${
            showValidation && missingSize
              ? "border-l-2 border-[#9b3027] pl-4"
              : ""
          }`}
        >
          <div className="flex items-center justify-between">
            <p
              id="size-selection-label"
              className="flex items-center gap-2 text-sm font-semibold"
            >
              <span className="grid size-6 place-items-center rounded-full bg-[#171613] text-[11px] text-white">
                1
              </span>
              Select Size <span className="text-[#9b3027]">*</span>
            </p>

            <Link
              href={{
                pathname: "/size-guide",
                query: {
                  product: product.slug,
                },
              }}
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
                className={`min-h-11 min-w-12 border px-3 text-xs font-semibold ${
                  size === entry
                    ? "border-[#171613] bg-[#171613] text-white"
                    : "border-[#dedbd2]"
                }`}
                aria-pressed={size === entry}
              >
                {entry}
              </button>
            ))}
          </div>

          {missingSize ? (
            <p
              id="size-selection-help"
              className={`mt-2 flex items-center gap-1.5 text-xs ${
                showValidation ? "font-medium text-[#9b3027]" : "text-[#6c6961]"
              }`}
            >
              {showValidation ? (
                <AlertCircle size={14} aria-hidden="true" />
              ) : null}
              Please choose your size.
            </p>
          ) : (
            <p className="mt-2 text-xs font-medium text-[#2f6b45]">
              Selected: {size}
            </p>
          )}
        </fieldset>
      ) : null}

      {/* COLOUR */}
      {hasColourOptions ? (
        <fieldset
          ref={colourFieldRef}
          tabIndex={-1}
          aria-labelledby="colour-selection-label"
          aria-describedby={missingColour ? "colour-selection-help" : undefined}
          className={`transition-colors outline-none ${
            showValidation && missingColour
              ? "border-l-2 border-[#9b3027] pl-4"
              : ""
          }`}
        >
          <div className="flex items-center justify-between gap-4">
            <p
              id="colour-selection-label"
              className="flex items-center gap-2 text-sm font-semibold"
            >
              <span className="grid size-6 place-items-center rounded-full bg-[#171613] text-[11px] text-white">
                {hasSizeOptions ? 2 : 1}
              </span>
              Select Colour <span className="text-[#9b3027]">*</span>
            </p>

            {!selectedColor ? (
              <span className="text-xs text-[#6c6961]">Select one</span>
            ) : null}
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            {product.colorOptions.map((entry) => {
              const entryColor = entry.code || "#57544d";

              const selected = selectedColor === entry.name;

              return (
                <button
                  key={entry.name}
                  type="button"
                  onClick={() => setColor(entry.name)}
                  className={`inline-flex min-h-12 items-center gap-2 border bg-white p-1.5 pr-3 text-xs font-semibold transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm ${
                    selected
                      ? "border-[#171613] outline outline-1 outline-offset-2 outline-[#171613]"
                      : "border-[#d4d0c6]"
                  }`}
                  aria-label={`Select ${entry.name}`}
                  aria-pressed={selected}
                  title={entry.name}
                >
                  <span
                    className="grid size-8 shrink-0 place-items-center border border-black/10 shadow-inner"
                    style={{
                      backgroundColor: entryColor,
                    }}
                    aria-hidden="true"
                  >
                    {selected ? (
                      <Check
                        size={17}
                        strokeWidth={2.5}
                        className="text-white mix-blend-difference drop-shadow-sm"
                      />
                    ) : null}
                  </span>
                  <span>{entry.name}</span>
                </button>
              );
            })}
          </div>

          {missingColour ? (
            <p
              id="colour-selection-help"
              className={`mt-2 flex items-center gap-1.5 text-xs ${
                showValidation ? "font-medium text-[#9b3027]" : "text-[#6c6961]"
              }`}
            >
              {showValidation ? (
                <AlertCircle size={14} aria-hidden="true" />
              ) : null}
              Please choose a colour.
            </p>
          ) : (
            <p className="mt-2 text-xs font-medium text-[#2f6b45]">
              Selected: {selectedColor}
              {product.colors.length === 1 ? " (only option)" : ""}
            </p>
          )}
        </fieldset>
      ) : null}

      {/* QUANTITY */}
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

      {/* ADD TO CART + WISHLIST */}
      <div className="grid grid-cols-[1fr_52px] gap-2">
        <MagneticButton className="block" strength={0.15}>
          <button
            type="button"
            onClick={add}
            disabled={!product.isAvailable}
            className="button-primary w-full"
            data-testid="add-to-cart"
          >
            <AnimatePresence mode="wait" initial={false}>
              {added ? (
                <motion.span
                  key="added"
                  initial={{
                    opacity: 0,
                    scale: 0.7,
                  }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                  }}
                  exit={{
                    opacity: 0,
                    scale: 0.7,
                  }}
                  transition={{
                    duration: 0.25,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="inline-flex items-center gap-2"
                >
                  <Check size={17} />
                  Added to bag
                </motion.span>
              ) : (
                <motion.span
                  key="add"
                  initial={{
                    opacity: 0,
                    scale: 0.7,
                  }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                  }}
                  exit={{
                    opacity: 0,
                    scale: 0.7,
                  }}
                  transition={{
                    duration: 0.25,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="inline-flex items-center gap-2"
                >
                  <ShoppingBag size={17} />

                  {product.isAvailable ? "Add to bag" : "Sold out"}
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </MagneticButton>

        <button
          type="button"
          onClick={() => toggleWishlist(product.id)}
          className="grid min-h-12 place-items-center border border-[#171613]"
          aria-label={favourite ? "Remove from wishlist" : "Add to wishlist"}
          aria-pressed={favourite}
        >
          <motion.span
            key={String(favourite)}
            initial={{
              scale: 0.7,
            }}
            animate={{
              scale: 1,
            }}
            transition={{
              duration: 0.3,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <Heart size={19} fill={favourite ? "currentColor" : "none"} />
          </motion.span>
        </button>
      </div>

      {/* BUY NOW */}
      <MagneticButton className="block w-full" strength={0.15}>
        <button
          type="button"
          onClick={buyNow}
          disabled={!product.isAvailable}
          className="button-secondary w-full"
        >
          Buy now
        </button>
      </MagneticButton>

      <p className="sr-only" aria-live="polite">
        {added ? `${product.name} added to your bag` : ""}
      </p>
    </div>
  );
}
