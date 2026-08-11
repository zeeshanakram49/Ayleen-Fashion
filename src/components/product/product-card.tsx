"use client";

import { useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Heart, Plus } from "lucide-react";
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
  const cardRef = useRef<HTMLElement>(null);
  const needsSizePicker = product.sizes.length > 1;
  const [pickerOpen, setPickerOpen] = useState(false);
  const [added, setAdded] = useState(false);

  function handleQuickAdd() {
    if (needsSizePicker) {
      setPickerOpen(true);
      return;
    }
    addItem(product);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1800);
  }

  function handleSizePick(size: string) {
    addItem(product, { size });
    setPickerOpen(false);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1800);
  }

  function handlePointerMove(event: ReactPointerEvent<HTMLElement>) {
    if (event.pointerType !== "mouse" || !cardRef.current) return;
    const bounds = cardRef.current.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width;
    const y = (event.clientY - bounds.top) / bounds.height;
    cardRef.current.style.setProperty("--card-rotate-x", `${(0.5 - y) * 7}deg`);
    cardRef.current.style.setProperty("--card-rotate-y", `${(x - 0.5) * 8}deg`);
    cardRef.current.style.setProperty("--card-glare-x", `${x * 100}%`);
    cardRef.current.style.setProperty("--card-glare-y", `${y * 100}%`);
  }

  function resetPointerDepth() {
    cardRef.current?.style.setProperty("--card-rotate-x", "0deg");
    cardRef.current?.style.setProperty("--card-rotate-y", "0deg");
  }

  return (
    <article
      ref={cardRef}
      className="product-card group min-w-0"
      data-testid="product-card"
      onPointerMove={handlePointerMove}
      onPointerLeave={resetPointerDepth}
    >
      <div className="product-media relative aspect-[4/5] overflow-hidden bg-[#efede7]">
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
              className={`object-cover transition-[opacity,transform] duration-700 ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.035] ${secondary ? "group-hover:opacity-0" : ""}`}
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
              className="scale-[1.035] object-cover opacity-0 transition-[opacity,transform] duration-700 ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-100 group-hover:opacity-100"
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
        <motion.button
          type="button"
          onClick={() => toggleWishlist(product.id)}
          whileTap={{ scale: 0.92 }}
          className="card-action absolute top-3 right-3 grid size-10 place-items-center rounded-full bg-white/90 shadow-sm backdrop-blur-sm"
          aria-label={
            favourite
              ? `Remove ${product.name} from wishlist`
              : `Add ${product.name} to wishlist`
          }
          aria-pressed={favourite}
        >
          <motion.span
            key={String(favourite)}
            initial={{ scale: 0.7 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <Heart size={18} fill={favourite ? "currentColor" : "none"} />
          </motion.span>
        </motion.button>
        {product.isAvailable ? (
          <div className="quick-add-wrap absolute inset-x-3 bottom-3">
            <AnimatePresence>
              {pickerOpen ? (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                  className="mb-2 flex flex-wrap gap-1.5 bg-white/95 p-2 shadow-[0_8px_28px_rgb(0_0_0/0.12)] backdrop-blur-sm"
                >
                  {product.sizes.map((entry) => (
                    <motion.button
                      key={entry}
                      type="button"
                      onClick={() => handleSizePick(entry)}
                      whileTap={{ scale: 0.9 }}
                      className="min-h-8 min-w-9 border border-[#dedbd2] px-2 text-xs font-semibold"
                    >
                      {entry}
                    </motion.button>
                  ))}
                </motion.div>
              ) : null}
            </AnimatePresence>
            <button
              type="button"
              onClick={handleQuickAdd}
              className="quick-add flex min-h-11 w-full translate-y-3 items-center justify-center gap-2 bg-white/95 px-3 text-xs font-bold tracking-wider uppercase opacity-0 shadow-[0_8px_28px_rgb(0_0_0/0.12)] backdrop-blur-sm transition duration-300 group-hover:translate-y-0 group-hover:opacity-100 focus:translate-y-0 focus:opacity-100 max-md:translate-y-0 max-md:opacity-100 active:scale-[0.97]"
              aria-label={`Quick add ${product.name}`}
              aria-expanded={pickerOpen}
            >
              <AnimatePresence mode="wait" initial={false}>
                {added ? (
                  <motion.span
                    key="added"
                    initial={{ opacity: 0, scale: 0.7 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.7 }}
                    transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                    className="inline-flex items-center gap-2"
                  >
                    <Check size={15} /> Added
                  </motion.span>
                ) : (
                  <motion.span
                    key="add"
                    initial={{ opacity: 0, scale: 0.7 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.7 }}
                    transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                    className="inline-flex items-center gap-2"
                  >
                    <Plus size={15} /> Quick add
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
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
