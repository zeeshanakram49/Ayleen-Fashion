import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Heart,
  ShoppingBag,
  Maximize2,
  Check,
  Plus,
  Minus,
} from "lucide-react";
import { discountPercent, money } from "../lib/store";
import { APP_ROUTES } from "../routes/appRoutes";
import { navigateToHash } from "../routes/routeUtils";
import type { Product } from "../types/store";
import { ImageWithFallback } from "./ImageWithFallback";
import { FullscreenProductGallery } from "./FullscreenProductGallery";

type QuickViewModalProps = {
  product: Product;
  liked: boolean;
  pickedSize?: string;
  onClose: () => void;
  onPickSize: (productId: string, size: string) => void;
  onToggleWishlist: (productId: string) => void;
  onAddToCart: (
    productId: string,
    fallbackSize?: string,
    requireSelection?: boolean,
    qty?: number,
  ) => void;
  onOpenProduct?: (slug: string) => void;
};

export function QuickViewModal({
  product,
  liked,
  pickedSize,
  onClose,
  onPickSize,
  onToggleWishlist,
  onAddToCart,
  onOpenProduct: _onOpenProduct,
}: QuickViewModalProps) {
  const [activeImage, setActiveImage] = useState(product.image);
  const [qty, setQty] = useState(1);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [addedNotice, setAddedNotice] = useState(false);

  const gallery = useMemo(
    () => Array.from(new Set([product.image, ...product.gallery])),
    [product],
  );
  const salePercent = discountPercent(product.price, product.oldPrice);
  const finalSize = pickedSize || product.sizes[0] || "M";
  const needsExplicitSize = product.sizes.length > 1 && !pickedSize;

  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose]);

  function handleAddToCart() {
    onAddToCart(product.id, finalSize, true, qty);
    setAddedNotice(true);
    setTimeout(() => {
      setAddedNotice(false);
      onClose();
    }, 800);
  }

  function handleBuyNow() {
    onAddToCart(product.id, finalSize, true, qty);
    navigateToHash(APP_ROUTES.checkout);
    onClose();
  }

  return (
    <>
      <AnimatePresence>
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={`${product.title} Quick View`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-[9980] flex items-center justify-center bg-black/65 p-4 backdrop-blur-md sm:p-6"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 280 }}
            onClick={(e) => e.stopPropagation()}
            className="relative flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl border border-[var(--line)] bg-white shadow-2xl md:flex-row"
          >
            {/* Close Modal Button */}
            <button
              type="button"
              onClick={onClose}
              className="absolute top-4 right-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white/80 text-[var(--ink)] shadow-md backdrop-blur-md transition hover:bg-white"
              aria-label="Close modal"
            >
              <X size={20} />
            </button>

            {/* Left Media Gallery Column */}
            <div className="flex w-full flex-col bg-[var(--panel)] p-4 sm:p-6 md:w-1/2">
              <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl bg-white shadow-sm">
                <ImageWithFallback
                  src={activeImage}
                  alt={product.title}
                  className="h-full w-full object-cover object-top"
                />
                <button
                  type="button"
                  onClick={() => setGalleryOpen(true)}
                  className="absolute right-3 bottom-3 flex items-center gap-1.5 rounded-full bg-black/75 px-3 py-1.5 text-xs font-bold text-white shadow-md backdrop-blur-md transition hover:bg-black"
                >
                  <Maximize2 size={14} /> Fullscreen
                </button>
              </div>

              {/* Thumbnails row */}
              {gallery.length > 1 && (
                <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
                  {gallery.map((img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveImage(img)}
                      className={`h-16 w-12 shrink-0 overflow-hidden rounded-lg border-2 transition ${
                        activeImage === img
                          ? "scale-105 border-[var(--ink)]"
                          : "border-transparent opacity-60"
                      }`}
                    >
                      <ImageWithFallback
                        src={img}
                        alt={`View ${idx + 1}`}
                        className="h-full w-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right Information & Options Column */}
            <div className="flex w-full flex-col justify-between overflow-y-auto p-6 sm:p-8 md:w-1/2">
              <div>
                <div className="flex items-center justify-between text-xs font-bold tracking-[0.2em] text-[var(--muted)] uppercase">
                  <span>{product.fit}</span>
                  <span>{product.categoryLabel}</span>
                </div>

                <h2 className="font-display mt-2 text-2xl font-extrabold tracking-tight text-[var(--ink)]">
                  {product.title}
                </h2>

                <div className="mt-4 flex items-baseline gap-3">
                  <span className="text-2xl font-black text-[var(--ink)]">
                    {money(product.price).replace("PKR ", "Rs. ")}
                  </span>
                  {product.oldPrice > product.price && (
                    <span className="text-sm font-semibold text-[var(--muted)] line-through">
                      {money(product.oldPrice).replace("PKR ", "Rs. ")}
                    </span>
                  )}
                  {salePercent > 0 && (
                    <span className="rounded-full bg-[var(--ink)] px-2.5 py-0.5 text-xs font-bold text-white">
                      -{salePercent}%
                    </span>
                  )}
                </div>

                <p className="mt-4 line-clamp-3 text-xs leading-relaxed text-neutral-600">
                  {product.description}
                </p>

                {/* Size Selector */}
                {product.sizes && product.sizes.length > 0 && (
                  <div className="mt-6">
                    <div className="mb-3 flex items-center justify-between text-xs font-bold tracking-wider text-[var(--ink)] uppercase">
                      <span>Select Size</span>
                      {needsExplicitSize && (
                        <span className="text-red-600">* Required</span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {product.sizes.map((size) => (
                        <button
                          key={size}
                          type="button"
                          onClick={() => onPickSize(product.id, size)}
                          className={`h-11 min-w-[44px] rounded-xl border text-xs font-bold uppercase transition ${
                            pickedSize === size
                              ? "border-[var(--ink)] bg-[var(--ink)] text-white shadow-md"
                              : "border-[var(--line-strong)] text-[var(--ink)] hover:border-[var(--ink)]"
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quantity Adjuster */}
                <div className="mt-6">
                  <span className="mb-3 block text-xs font-bold tracking-wider text-[var(--ink)] uppercase">
                    Quantity
                  </span>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center rounded-xl border border-[var(--line-strong)] bg-[var(--panel)] p-1">
                      <button
                        type="button"
                        onClick={() => setQty((q) => Math.max(q - 1, 1))}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--ink)] transition hover:bg-white"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-10 text-center text-xs font-bold">
                        {qty}
                      </span>
                      <button
                        type="button"
                        onClick={() => setQty((q) => q + 1)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--ink)] transition hover:bg-white"
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => onToggleWishlist(product.id)}
                      className={`flex h-11 w-11 items-center justify-center rounded-xl border border-[var(--line-strong)] transition ${
                        liked
                          ? "border-red-200 bg-red-50 text-red-600"
                          : "text-[var(--ink)] hover:bg-[var(--panel)]"
                      }`}
                    >
                      <Heart
                        size={20}
                        className={liked ? "fill-red-600 stroke-red-600" : ""}
                      />
                    </button>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 space-y-3">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={needsExplicitSize}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--ink)] py-3.5 text-xs font-bold tracking-widest text-white uppercase shadow-xl transition hover:bg-neutral-800 active:scale-98 disabled:opacity-50"
                >
                  {addedNotice ? (
                    <>
                      <Check size={16} /> Added to Cart!
                    </>
                  ) : (
                    <>
                      <ShoppingBag size={16} /> Add to Basket
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleBuyNow}
                  disabled={needsExplicitSize}
                  className="w-full rounded-xl border border-[var(--ink)] py-3.5 text-xs font-bold tracking-widest text-[var(--ink)] uppercase transition hover:bg-[var(--panel)] active:scale-98 disabled:opacity-50"
                >
                  Buy It Now
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>

      {/* Fullscreen Product Gallery */}
      <FullscreenProductGallery
        isOpen={galleryOpen}
        images={gallery}
        productTitle={product.title}
        onClose={() => setGalleryOpen(false)}
      />
    </>
  );
}
