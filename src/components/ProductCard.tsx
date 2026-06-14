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
      className={`group product-card reveal-up overflow-hidden bg-white ${
        isCatalog
          ? "catalog-product-card"
          : compact
            ? "rounded-[var(--radius-lg)] border border-[var(--line)] p-3 shadow-[var(--shadow-soft)]"
            : "rounded-[var(--radius-lg)] border border-[var(--line)] p-3.5 shadow-[var(--shadow-soft)]"
      }`}
      style={{ animationDelay: `${80 + index * 80}ms` }}
    >
      <div className={`relative overflow-hidden ${isCatalog ? "bg-[#f3f4f1]" : "rounded-[var(--radius-md)]"}`}>
        <button
          type="button"
          onClick={() => onOpenProduct(product.slug)}
          className="block w-full"
        >
          <ImageWithFallback
            src={product.image}
            alt={product.title}
            className={`media-zoom w-full object-cover ${
              isCatalog ? "catalog-product-image" : compact ? "h-[300px]" : "h-[360px]"
            }`}
          />
        </button>
        <div
          className={`absolute inset-0 ${
            isCatalog
              ? "pointer-events-none bg-transparent"
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
              ? "catalog-heart-button right-3 top-3 flex h-9 w-9 items-center justify-center bg-white/82 text-[1.25rem] text-[var(--ink)]"
              : "right-3 top-3 rounded-[var(--radius-sm)] border border-white/70 bg-white/20 px-3 py-1 text-[10px] font-semibold tracking-[0.14em] text-white backdrop-blur"
          }`}
        >
          {isCatalog ? (liked ? "♥" : "♡") : liked ? "SAVED" : "SAVE"}
        </button>

        {isCatalog && (
          <button
            type="button"
            onClick={() => onAddToCart(product.id, pickedSize, true)}
            className="catalog-product-quickview"
          >
            Add to Basket
          </button>
        )}
      </div>

      <div className={isCatalog ? "catalog-product-body" : compact ? "mt-4" : "mt-5"}>
        <div className="flex items-start justify-between gap-4">
          <div>
            {!isCatalog && (
              <p className={`tracking-[0.2em] text-[var(--gold-deep)] ${compact ? "text-[10px]" : "text-[10px]"}`}>
              {product.categoryLabel.toUpperCase()}
              </p>
            )}
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
            {isCatalog && (
              <p className="catalog-product-meta">
                {product.fit} | {product.categoryLabel}
              </p>
            )}
          </div>

          {!compact && !isCatalog && (
            <button
              type="button"
              onClick={() => onAddToCart(product.id, pickedSize, true)}
              className="rounded-[var(--radius-sm)] border border-[var(--line-strong)] px-4 py-2 text-[10px] font-semibold tracking-[0.14em] transition hover:border-[var(--gold-deep)] hover:text-[var(--gold-deep)]"
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
          <span className="text-[var(--muted)] line-through">
            {money(product.oldPrice)}
          </span>
          <span className="font-semibold text-[var(--ink)]">
            {money(product.price)}
          </span>
          {isCatalog && salePercent > 0 && (
            <span className="font-semibold text-[var(--ink)]">-{salePercent}%</span>
          )}
        </div>

        {!isCatalog && (
          <p className="mt-1 text-xs text-[var(--muted)]">
            Pay in 3 installments of {money(installmentAmount(product.price))}
          </p>
        )}

        {!isCatalog ? (
          <div className="mt-4 flex flex-wrap items-center gap-2">
            {product.colors.slice(0, compact ? 2 : 3).map((color) => (
              <span
                key={color}
                className="rounded-[var(--radius-sm)] border border-[var(--line-strong)] px-3 py-1 text-[10px] tracking-[0.12em] text-[var(--muted)]"
              >
                {color}
              </span>
            ))}
          </div>
        ) : (
          <div className="catalog-swatches">
            {product.colors.slice(0, 2).map((color) => (
              <span key={color} title={color} />
            ))}
          </div>
        )}

        {compact ? (
          <button
            type="button"
            onClick={() => onAddToCart(product.id, pickedSize, true)}
            className="mt-5 w-full rounded-[var(--radius-sm)] bg-[var(--ink)] px-4 py-3 text-[10px] font-semibold tracking-[0.16em] text-[var(--paper)]"
          >
            QUICK ADD
          </button>
        ) : isCatalog ? null : (
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
                  className={`px-3 py-1.5 text-[10px] font-semibold tracking-[0.14em] transition ${
                    pickedSize === size
                      ? "rounded-[var(--radius-sm)] bg-[var(--ink)] text-[var(--paper)]"
                      : "rounded-[var(--radius-sm)] border border-[var(--line-strong)] hover:border-[var(--gold-deep)]"
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
