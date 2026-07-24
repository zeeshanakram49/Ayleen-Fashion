import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoHeartOutline, IoHeart, IoEyeOutline, IoBagAddOutline } from "react-icons/io5";
import { ImageWithFallback } from "./ImageWithFallback";
import type { Product } from "../types/store";
import { discountPercent, installmentAmount, money } from "../lib/store";

type ProductCardProps = {
  product: Product;
  index: number;
  liked: boolean;
  pickedSize?: string;
  compact?: boolean;
  variant?: "default" | "catalog";
  onPickSize: (productId: string, size: string) => void;
  onToggleWishlist: (productId: string) => void;
  onAddToCart: (
    productId: string,
    fallbackSize?: string,
    requireSelection?: boolean,
    qty?: number,
  ) => void;
  onOpenProduct: (slug: string) => void;
};

export function ProductCard({
  product,
  index,
  liked,
  pickedSize,
  compact = false,
  variant = "default",
  onPickSize,
  onToggleWishlist,
  onAddToCart,
  onOpenProduct,
}: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);
  const salePercent = discountPercent(product.price, product.oldPrice);
  const isCatalog = variant === "catalog";

  // Use second image in gallery on hover if available
  const displayImage =
    isHovered && product.gallery && product.gallery.length > 1
      ? product.gallery[1]
      : product.image;

  const handleQuickAdd = async (size: string) => {
    setAddingToCart(true);
    onPickSize(product.id, size);
    onAddToCart(product.id, size, false, 1);
    setTimeout(() => setAddingToCart(false), 800);
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: Math.min(index * 0.05, 0.3), ease: [0.215, 0.61, 0.355, 1] }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`group relative overflow-hidden transition-all duration-500 ${
        isCatalog
          ? "border border-black/5 bg-white p-3 rounded-lg hover:shadow-lg"
          : compact
            ? "border border-black/5 bg-white p-3 rounded-2xl hover:shadow-xl"
            : "border border-black/5 bg-white p-4 rounded-3xl hover:shadow-2xl"
      }`}
    >
      {/* Image Container */}
      <div
        className="relative overflow-hidden bg-[var(--panel)] cursor-pointer"
        style={{
          borderRadius: isCatalog ? "6px" : compact ? "16px" : "20px",
        }}
        onClick={() => onOpenProduct(product.slug)}
      >
        <div className="relative aspect-[3/4] w-full overflow-hidden">
          <motion.div
            animate={{ scale: isHovered ? 1.04 : 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="h-full w-full"
          >
            <ImageWithFallback
              src={displayImage}
              alt={product.title}
              className="h-full w-full object-cover object-top"
            />
          </motion.div>
        </div>

        {/* Badges */}
        <div className="absolute left-3 top-3 flex flex-col gap-1.5 pointer-events-none">
          {product.badge && (
            <span className="rounded-full bg-white/90 backdrop-blur-sm px-3 py-1 text-[9px] font-bold tracking-wider text-[var(--ink)] shadow-sm">
              {product.badge.toUpperCase()}
            </span>
          )}
          {salePercent > 0 && (
            <span className="rounded-full bg-[var(--ink)] px-3 py-1 text-[9px] font-bold tracking-wider text-white shadow-sm">
              SAVE {salePercent}%
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <motion.button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(product.id);
          }}
          whileTap={{ scale: 0.85 }}
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm text-lg text-[var(--ink)] shadow-sm transition hover:bg-white hover:text-[var(--gold-deep)]"
          aria-label="Add to wishlist"
        >
          {liked ? <IoHeart className="text-red-500 animate-pulse" /> : <IoHeartOutline />}
        </motion.button>

        {/* Quick View Button overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/10 transition-opacity duration-300">
          <motion.button
            type="button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              e.stopPropagation();
              onOpenProduct(product.slug);
            }}
            className="flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-xs font-bold tracking-wider text-[var(--ink)] shadow-lg transition hover:bg-[var(--ink)] hover:text-white"
          >
            <IoEyeOutline className="text-sm" />
            <span>QUICK VIEW</span>
          </motion.button>
        </div>

        {/* Size Selection Hover Overlay (High Conversion feature) */}
        <AnimatePresence>
          {isHovered && product.sizes && product.sizes.length > 0 && !compact && (
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm p-4 border-t border-black/5 flex flex-col gap-2 items-center"
              onClick={(e) => e.stopPropagation()}
            >
              <p className="text-[9px] font-bold tracking-widest text-[var(--muted)]">
                QUICK ADD TO BAG
              </p>
              <div className="flex flex-wrap gap-1.5 justify-center w-full">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => handleQuickAdd(size)}
                    className={`h-7 min-w-7 rounded-full border text-[10px] font-bold flex items-center justify-center px-2 transition-all ${
                      pickedSize === size
                        ? "bg-[var(--ink)] border-[var(--ink)] text-white"
                        : "border-black/10 hover:border-[var(--ink)] text-[var(--ink)]"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Product Details */}
      <div className="mt-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <p className="text-[9px] font-bold tracking-widest text-[var(--gold-deep)] uppercase">
              {product.categoryLabel}
            </p>
            <h3
              onClick={() => onOpenProduct(product.slug)}
              className="font-editorial text-lg md:text-xl text-[var(--ink)] mt-1 font-semibold leading-tight hover:text-[var(--gold-deep)] cursor-pointer transition"
            >
              {product.title}
            </h3>
          </div>

          {/* Simple price info next to title if compact */}
          {compact && (
            <div className="text-right">
              <span className="text-xs font-bold text-[var(--ink)] block">
                {money(product.price)}
              </span>
              {product.oldPrice > product.price && (
                <span className="text-[10px] text-[var(--muted)] line-through block">
                  {money(product.oldPrice)}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Description (Omitted if compact) */}
        {!compact && !isCatalog && (
          <p className="text-xs text-[var(--muted)] mt-2 leading-relaxed line-clamp-2">
            {product.description}
          </p>
        )}

        {/* Price & Installments (If not compact) */}
        {!compact && (
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-sm font-bold text-[var(--ink)]">
              {money(product.price)}
            </span>
            {product.oldPrice > product.price && (
              <span className="text-xs text-[var(--muted)] line-through">
                {money(product.oldPrice)}
              </span>
            )}
          </div>
        )}

        {/* Installment details */}
        {!compact && !isCatalog && (
          <p className="text-[9px] text-[var(--muted)] mt-1 tracking-wide">
            Or 3 interest-free payments of {money(installmentAmount(product.price))}
          </p>
        )}

        {/* Colors (If not compact) */}
        {!compact && product.colors && product.colors.length > 0 && (
          <div className="mt-3.5 flex flex-wrap gap-1.5">
            {product.colors.slice(0, 3).map((color) => (
              <span
                key={color}
                className="rounded-full bg-[var(--panel)] px-2.5 py-0.5 text-[9px] font-bold tracking-wider text-[var(--muted)] uppercase border border-black/5"
              >
                {color}
              </span>
            ))}
          </div>
        )}

        {/* Quick Add Button (Visible on mobile/tablet or when compact) */}
        {(compact || isCatalog) && (
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => handleQuickAdd(product.sizes[0] || "One Size")}
            className="mt-4 w-full flex items-center justify-center gap-2 rounded-xl bg-[var(--ink)] py-3 text-[10px] font-bold tracking-widest text-white transition hover:bg-[var(--gold-deep)]"
          >
            <IoBagAddOutline className="text-sm" />
            <span>{addingToCart ? "ADDING..." : "QUICK ADD"}</span>
          </motion.button>
        )}
      </div>
    </motion.article>
  );
}
