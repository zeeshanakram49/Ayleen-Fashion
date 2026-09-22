"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Heart, Minus, Plus, ShoppingBag } from "lucide-react";
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
  const selectedColor =
    product.colors.length === 1 ? product.colors[0] : color;

  const complete = isVariantSelectionComplete(product, {
    size,
    color: selectedColor,
  });

  const enabled = product.isAvailable && complete;

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
    if (!enabled) return;

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
    if (!enabled) return;

    add();

    router.push("/checkout");
  }

  return (
    <div className="mt-7 space-y-7">
      {/* SIZE */}
      {product.sizes.length > 0 ? (
        <fieldset>
          <div className="flex items-center justify-between">
            <legend className="text-sm font-semibold">
              Size
            </legend>

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

          {!size ? (
            <p className="mt-2 text-xs text-[#6c6961]">
              Select a size to continue.
            </p>
          ) : null}
        </fieldset>
      ) : null}

      {/* COLOUR */}
      {product.colors.length > 0 ? (
        <fieldset>
          <legend className="sr-only">
            Choose a colour
          </legend>

          <div className="flex items-center justify-between gap-4">
            <p className="text-sm font-semibold">
              Colour
            </p>

            {!selectedColor ? (
              <span className="text-xs text-[#6c6961]">
                Select one
              </span>
            ) : null}
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            {product.colorOptions.map((entry) => {
              const entryColor =
                entry.code || "#57544d";

              const selected =
                selectedColor === entry.name;

              return (
                <button
                  key={entry.name}
                  type="button"
                  onClick={() =>
                    setColor(entry.name)
                  }
                  className={`grid size-12 place-items-center border bg-white p-1 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm ${
                    selected
                      ? "border-[#171613] outline outline-1 outline-offset-2 outline-[#171613]"
                      : "border-[#d4d0c6]"
                  }`}
                  aria-label={`Select ${entry.name}`}
                  aria-pressed={selected}
                  title={entry.name}
                >
                  <span
                    className="grid size-full place-items-center border border-black/10 shadow-inner"
                    style={{
                      backgroundColor:
                        entryColor,
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
                </button>
              );
            })}
          </div>

          {!selectedColor ? (
            <p className="mt-2 text-xs text-[#6c6961]">
              Select a colour to continue.
            </p>
          ) : null}
        </fieldset>
      ) : null}

      {/* QUANTITY */}
      <div>
        <p className="text-sm font-semibold">
          Quantity
        </p>

        <div className="mt-3 inline-flex h-11 items-center border border-[#dedbd2]">
          <button
            type="button"
            onClick={() =>
              setQuantity((current) =>
                Math.max(1, current - 1)
              )
            }
            className="h-full px-3"
            aria-label="Decrease quantity"
          >
            <Minus size={14} />
          </button>

          <span
            className="min-w-10 text-center"
            aria-live="polite"
          >
            {quantity}
          </span>

          <button
            type="button"
            onClick={() =>
              setQuantity((current) =>
                Math.min(
                  product.stock,
                  current + 1
                )
              )
            }
            className="h-full px-3"
            aria-label="Increase quantity"
            disabled={
              quantity >= product.stock
            }
          >
            <Plus size={14} />
          </button>
        </div>
      </div>

      {/* ADD TO CART + WISHLIST */}
      <div className="grid grid-cols-[1fr_52px] gap-2">
        <MagneticButton
          className="block"
          strength={0.15}
        >
          <button
            type="button"
            onClick={add}
            disabled={!enabled}
            className="button-primary w-full"
            data-testid="add-to-cart"
          >
            <AnimatePresence
              mode="wait"
              initial={false}
            >
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
                    ease: [
                      0.22,
                      1,
                      0.36,
                      1,
                    ],
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
                    ease: [
                      0.22,
                      1,
                      0.36,
                      1,
                    ],
                  }}
                  className="inline-flex items-center gap-2"
                >
                  <ShoppingBag size={17} />

                  {product.isAvailable
                    ? "Add to bag"
                    : "Sold out"}
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </MagneticButton>

        <button
          type="button"
          onClick={() =>
            toggleWishlist(product.id)
          }
          className="grid min-h-12 place-items-center border border-[#171613]"
          aria-label={
            favourite
              ? "Remove from wishlist"
              : "Add to wishlist"
          }
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
              ease: [
                0.22,
                1,
                0.36,
                1,
              ],
            }}
          >
            <Heart
              size={19}
              fill={
                favourite
                  ? "currentColor"
                  : "none"
              }
            />
          </motion.span>
        </button>
      </div>

      {/* BUY NOW */}
      <MagneticButton
        className="block w-full"
        strength={0.15}
      >
        <button
          type="button"
          onClick={buyNow}
          disabled={!enabled}
          className="button-secondary w-full"
        >
          Buy now
        </button>
      </MagneticButton>

      <p
        className="sr-only"
        aria-live="polite"
      >
        {added
          ? `${product.name} added to your bag`
          : ""}
      </p>
    </div>
  );
}
