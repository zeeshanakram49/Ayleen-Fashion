import { useState } from "react";
import { Heart, Eye, Maximize2, ShoppingBag, Check } from "lucide-react";
import { ImageWithFallback } from "./ImageWithFallback";
import type { Product } from "../types/store";
import { discountPercent, money } from "../lib/store";
import { Card3DTilt } from "./Card3DTilt";
import { FullscreenProductGallery } from "./FullscreenProductGallery";

type ProductCardProps = {
  product: Product;
  index: number;
  liked: boolean;
  pickedSize?: string;
  compact?: boolean;
  variant?: "default" | "catalog";
  catalogAudience?: string;
  onPickSize: (productId: string, size: string) => void;
  onToggleWishlist: (productId: string) => void;
  onAddToCart: (
    productId: string,
    fallbackSize?: string,
    requireSelection?: boolean,
    qty?: number,
  ) => void;
  onOpenProduct: (slug: string) => void;
  onOpenQuickView?: (product: Product) => void;
};

export function ProductCard({
  product,
  index: _index,
  liked,
  pickedSize,
  compact: _compact = false,
  variant: _variant = "default",
  catalogAudience,
  onPickSize,
  onToggleWishlist,
  onAddToCart,
  onOpenProduct,
  onOpenQuickView,
}: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [heartPop, setHeartPop] = useState(false);
  const [addedNotice, setAddedNotice] = useState(false);

  const salePercent = discountPercent(product.price, product.oldPrice);
  const secondImage = product.gallery && product.gallery.length > 0 ? product.gallery[0] : product.image;
  const allImages = Array.from(new Set([product.image, ...(product.gallery || [])]));

  function handleWishlistClick(e: React.MouseEvent) {
    e.stopPropagation();
    setHeartPop(true);
    onToggleWishlist(product.id);
    setTimeout(() => setHeartPop(false), 450);
  }

  function handleQuickAdd(sizeToUse?: string) {
    const targetSize = sizeToUse || pickedSize || product.sizes[0] || 'M';
    onAddToCart(product.id, targetSize, false, 1);
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 1200);
  }

  return (
    <>
      <Card3DTilt maxDegree={5}>
        <article
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="group relative flex flex-col h-full rounded-2xl border border-[var(--line)] bg-white overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
        >
          {/* Media Section */}
          <div className="relative aspect-[3/4] w-full overflow-hidden bg-[var(--panel)]">
            {/* Primary & Secondary Hover Crossfade Image */}
            <div
              onClick={() => onOpenProduct(product.slug)}
              className="cursor-pointer h-full w-full relative"
            >
              <ImageWithFallback
                src={isHovered ? secondImage : product.image}
                alt={product.title}
                className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
              />
            </div>

            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 pointer-events-none">
              {salePercent > 0 && (
                <span className="rounded-full bg-[var(--ink)] px-2.5 py-1 text-[10px] font-bold tracking-widest uppercase text-white shadow-md">
                  -{salePercent}% SALE
                </span>
              )}
              {product.badge && (
                <span className="rounded-full bg-neutral-900/90 backdrop-blur-md px-2.5 py-1 text-[10px] font-semibold tracking-widest uppercase text-white shadow-sm">
                  {product.badge}
                </span>
              )}
              {product.stock <= 5 && product.stock > 0 && (
                <span className="rounded-full bg-amber-600 px-2.5 py-1 text-[10px] font-bold tracking-widest uppercase text-white shadow-sm">
                  LOW STOCK ({product.stock})
                </span>
              )}
            </div>

            {/* Top Right Wishlist & Fullscreen Gallery Action Buttons */}
            <div className="absolute top-3 right-3 flex flex-col gap-2 z-10">
              <button
                type="button"
                onClick={handleWishlistClick}
                aria-label={liked ? "Remove from wishlist" : "Add to wishlist"}
                className={`flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-[var(--ink)] shadow-md backdrop-blur-md transition hover:bg-white active:scale-90 ${heartPop ? "scale-125" : ""
                  }`}
              >
                <Heart
                  size={18}
                  className={liked ? "fill-red-600 stroke-red-600" : "stroke-neutral-700"}
                />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setGalleryOpen(true);
                }}
                aria-label="Open fullscreen gallery"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-[var(--ink)] shadow-md backdrop-blur-md transition hover:bg-white active:scale-90 opacity-0 group-hover:opacity-100"
              >
                <Maximize2 size={16} />
              </button>
            </div>

            {/* Desktop Quick Size Selector Bar Overlay */}
            <div className="absolute inset-x-3 bottom-3 z-10 hidden sm:flex flex-col gap-2 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
              {product.sizes && product.sizes.length > 0 && (
                <div className="flex items-center justify-center gap-1.5 rounded-xl bg-white/95 backdrop-blur-md p-1.5 shadow-lg border border-black/5">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onPickSize(product.id, size);
                        handleQuickAdd(size);
                      }}
                      className={`h-7 min-w-[28px] rounded-lg text-[11px] font-bold uppercase transition ${pickedSize === size
                          ? "bg-[var(--ink)] text-white shadow-sm"
                          : "text-neutral-700 hover:bg-neutral-200"
                        }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              )}

              <div className="flex gap-2">
                {onOpenQuickView && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenQuickView(product);
                    }}
                    className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-white/95 backdrop-blur-md py-2 text-[11px] font-bold tracking-wider uppercase text-[var(--ink)] hover:bg-white shadow-lg transition"
                  >
                    <Eye size={14} /> Quick View
                  </button>
                )}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleQuickAdd();
                  }}
                  className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-[var(--ink)] py-2 text-[11px] font-bold tracking-wider uppercase text-white hover:bg-neutral-800 shadow-lg transition active:scale-95"
                >
                  {addedNotice ? (
                    <>
                      <Check size={14} /> Added!
                    </>
                  ) : (
                    <>
                      <ShoppingBag size={14} /> Add
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Product Body Information */}
          <div className="flex flex-col justify-between flex-1 p-4">
            <div>
              <div className="flex items-center justify-between text-[11px] uppercase tracking-wider text-[var(--muted)] font-medium">
                <span>{product.fit || "Regular Fit"}</span>
                <span>{catalogAudience || product.categoryLabel}</span>
              </div>

              <h3
                onClick={() => onOpenProduct(product.slug)}
                className="mt-1 cursor-pointer font-sans text-sm font-semibold text-[var(--ink)] line-clamp-1 hover:text-neutral-600 transition"
              >
                {product.title}
              </h3>
            </div>

            <div className="mt-3 flex items-baseline gap-2 pt-2 border-t border-[var(--line)]">
              <span className="text-sm font-extrabold text-[var(--ink)]">
                {money(product.price).replace("PKR ", "Rs. ")}
              </span>
              {product.oldPrice > product.price && (
                <span className="text-xs text-[var(--muted)] line-through">
                  {money(product.oldPrice).replace("PKR ", "Rs. ")}
                </span>
              )}
            </div>
          </div>
        </article>
      </Card3DTilt>

      {/* Fullscreen Image Gallery Viewer */}
      <FullscreenProductGallery
        isOpen={galleryOpen}
        images={allImages}
        productTitle={product.title}
        onClose={() => setGalleryOpen(false)}
      />
    </>
  );
}
