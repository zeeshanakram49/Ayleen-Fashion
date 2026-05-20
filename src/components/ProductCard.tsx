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
  const salePercent = discountPercent(product.price, product.oldPrice);
  const isCatalog = variant === "catalog";

  return (
    <article
      className={`group product-card reveal-up overflow-hidden border border-[var(--line)] bg-white ${
        isCatalog
          ? "catalog-product-card rounded-[0.25rem] p-4"
          : compact
            ? "rounded-[1.65rem] p-3"
            : "rounded-[1.65rem] p-4"
      }`}
      style={{ animationDelay: `${80 + index * 80}ms` }}
    >
      <div className={`relative overflow-hidden ${isCatalog ? "rounded-[0.15rem]" : "rounded-[1.35rem]"}`}>
        <ImageWithFallback
          src={product.image}
          alt={product.title}
          className={`media-zoom w-full object-cover ${
            isCatalog ? "h-[26rem]" : compact ? "h-[300px]" : "h-[360px]"
          }`}
        />
        <div
          className={`absolute inset-0 ${
            isCatalog
              ? "bg-gradient-to-t from-black/10 via-transparent to-transparent"
              : "bg-gradient-to-t from-black/16 via-transparent to-transparent"
          }`}
        />

        {!isCatalog && (
          <div className="absolute left-3 top-3 flex flex-wrap gap-2">
            <span className="rounded-full bg-white/88 px-3 py-1 text-[10px] font-semibold tracking-[0.14em] text-[var(--ink)] backdrop-blur">
              {product.badge}
            </span>
            {salePercent > 0 && (
              <span className="rounded-full bg-[var(--ink)] px-3 py-1 text-[10px] font-semibold tracking-[0.14em] text-[var(--paper)]">
                SAVE {salePercent}%
              </span>
            )}
          </div>
        )}

        <button
          type="button"
          onClick={() => onToggleWishlist(product.id)}
          className={`absolute ${
            isCatalog
              ? "catalog-heart-button right-3 top-3 flex h-11 w-11 items-center justify-center rounded-full bg-white/96 text-[1.45rem] text-[var(--ink)] shadow-lg"
              : "right-3 top-3 rounded-full border border-white/70 bg-white/20 px-3 py-1 text-[10px] font-semibold tracking-[0.14em] text-white backdrop-blur"
          }`}
        >
          {isCatalog ? (liked ? "♥" : "♡") : liked ? "SAVED" : "SAVE"}
        </button>

        {isCatalog && (
          <button
            type="button"
            onClick={() => onOpenProduct(product.slug)}
            className="catalog-product-quickview"
          >
            Quick view
          </button>
        )}
      </div>

      <div className={compact ? "mt-4" : "mt-5"}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className={`tracking-[0.2em] text-[var(--gold-deep)] ${isCatalog ? "text-[9px]" : "text-[10px]"}`}>
              {product.categoryLabel.toUpperCase()}
            </p>
            <button
              type="button"
              onClick={() => onOpenProduct(product.slug)}
              className={`mt-2 text-left leading-none transition hover:text-[var(--gold-deep)] ${
                isCatalog
                  ? "text-[1.02rem] font-medium tracking-[0.22em] uppercase"
                  : compact
                    ? "font-editorial text-[1.9rem]"
                    : "font-editorial text-[2.15rem]"
              }`}
            >
              {product.title}
            </button>
          </div>

          {!compact && !isCatalog && (
            <button
              type="button"
              onClick={() => onAddToCart(product.id, pickedSize, true)}
              className="rounded-full border border-[var(--line-strong)] px-4 py-2 text-[10px] font-semibold tracking-[0.16em] transition hover:border-[var(--gold-deep)] hover:text-[var(--gold-deep)]"
            >
              ADD TO BAG
            </button>
          )}
        </div>

        {!isCatalog && (
          <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
            {product.description}
          </p>
        )}

        <div className="mt-4 flex items-center gap-2 text-sm">
          <span className="font-semibold text-[var(--ink)]">
            {money(product.price)}
          </span>
          <span className="text-[var(--muted)] line-through">
            {money(product.oldPrice)}
          </span>
        </div>

        {!isCatalog && (
          <p className="mt-1 text-xs text-[var(--muted)]">
            Pay in 3 installments of {money(installmentAmount(product.price))}
          </p>
        )}

        {!isCatalog && (
          <div className="mt-4 flex flex-wrap items-center gap-2">
            {product.colors.slice(0, compact ? 2 : 3).map((color) => (
              <span
                key={color}
                className="rounded-full border border-[var(--line-strong)] px-3 py-1 text-[10px] tracking-[0.14em] text-[var(--muted)]"
              >
                {color}
              </span>
            ))}
          </div>
        )}

        {compact ? (
          <button
            type="button"
            onClick={() => onAddToCart(product.id, pickedSize, true)}
            className="mt-5 w-full rounded-full bg-[var(--ink)] px-4 py-3 text-[10px] font-semibold tracking-[0.18em] text-[var(--paper)]"
          >
            QUICK ADD
          </button>
        ) : isCatalog ? (
          <button
            type="button"
            onClick={() => onAddToCart(product.id, pickedSize, true)}
            className="mt-5 w-full rounded-[0.15rem] border border-[var(--ink)] bg-[var(--ink)] px-4 py-3 text-[10px] font-semibold tracking-[0.18em] text-[var(--paper)]"
          >
            ADD TO BAG
          </button>
        ) : (
          <div className="mt-5">
            <p className="text-[10px] font-semibold tracking-[0.18em] text-[var(--muted)]">
              SELECT SIZE
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => onPickSize(product.id, size)}
                  className={`rounded-full px-3 py-1.5 text-[10px] font-semibold tracking-[0.15em] transition ${
                    pickedSize === size
                      ? "bg-[var(--ink)] text-[var(--paper)]"
                      : "border border-[var(--line-strong)] hover:border-[var(--gold-deep)]"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </article>
  );
}
