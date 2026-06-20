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
  const swatches = product.colors.slice(0, 3).map((color) => ({
    label: color,
    value: colorToSwatch(color),
  }));

  if (isCatalog) {
    return (
      <article
        className="group product-card reveal-up overflow-hidden bg-white catalog-product-card"
        style={{ animationDelay: `${80 + index * 80}ms` }}
      >
        <div className="catalog-product-media">
          <button
            type="button"
            onClick={() => onOpenProduct(product.slug)}
            className="block w-full"
          >
            <ImageWithFallback
              src={product.image}
              alt={product.title}
              className="catalog-product-image"
            />
          </button>

          <button
            type="button"
            onClick={() => onToggleWishlist(product.id)}
            aria-label={liked ? "Remove from wishlist" : "Add to wishlist"}
            className="catalog-heart-button"
          >
            {liked ? "♥" : "♡"}
          </button>

          <button
            type="button"
            onClick={() => onAddToCart(product.id, pickedSize, true)}
            className="catalog-product-quickview"
          >
            Add to Basket
          </button>
        </div>

        <div className="catalog-product-body">
          <p className="catalog-product-meta">
            {product.fit} | {product.categoryLabel}
          </p>

          <button
            type="button"
            onClick={() => onOpenProduct(product.slug)}
            className="catalog-product-title"
          >
            {product.title}
          </button>

          <div className="catalog-product-pricing">
            <span className="catalog-product-old-price">{money(product.oldPrice)}</span>
            <span className="catalog-product-price">{money(product.price)}</span>
            {salePercent > 0 && (
              <span className="catalog-product-discount">-{salePercent}%</span>
            )}
          </div>

          <div className="catalog-swatches" aria-label="Available colors">
            {swatches.map((swatch) => (
              <span
                key={swatch.label}
                title={swatch.label}
                style={{ backgroundColor: swatch.value }}
              />
            ))}
          </div>
        </div>
      </article>
    );
  }

  return (
    <article
      className={`group product-card reveal-up overflow-hidden bg-white ${
        compact
          ? "rounded-[var(--radius-lg)] border border-[var(--line)] p-3 shadow-[var(--shadow-soft)]"
          : "rounded-[var(--radius-lg)] border border-[var(--line)] p-3.5 shadow-[var(--shadow-soft)]"
      }`}
      style={{ animationDelay: `${80 + index * 80}ms` }}
    >
      <div className="relative overflow-hidden rounded-[var(--radius-md)]">
        <button
          type="button"
          onClick={() => onOpenProduct(product.slug)}
          className="block w-full"
        >
          <ImageWithFallback
            src={product.image}
            alt={product.title}
            className={`media-zoom w-full object-cover ${compact ? "h-[300px]" : "h-[360px]"}`}
          />
        </button>
        <div className="absolute inset-0 bg-gradient-to-t from-black/16 via-transparent to-transparent" />

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

        <button
          type="button"
          onClick={() => onToggleWishlist(product.id)}
          className="absolute right-3 top-3 rounded-[var(--radius-sm)] border border-white/70 bg-white/20 px-3 py-1 text-[10px] font-semibold tracking-[0.14em] text-white backdrop-blur"
        >
          {liked ? "SAVED" : "SAVE"}
        </button>
      </div>

      <div className={compact ? "mt-4" : "mt-5"}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className={`tracking-[0.2em] text-[var(--gold-deep)] ${compact ? "text-[10px]" : "text-[10px]"}`}>
              {product.categoryLabel.toUpperCase()}
            </p>
            <button
              type="button"
              onClick={() => onOpenProduct(product.slug)}
              className={`mt-2 text-left leading-none transition hover:text-[var(--gold-deep)] ${
                compact
                  ? "font-editorial text-[1.9rem]"
                  : "font-editorial text-[2.15rem]"
              }`}
            >
              {product.title}
            </button>
          </div>

          {!compact && (
            <button
              type="button"
              onClick={() => onAddToCart(product.id, pickedSize, true)}
              className="rounded-[var(--radius-sm)] border border-[var(--line-strong)] px-4 py-2 text-[10px] font-semibold tracking-[0.14em] transition hover:border-[var(--gold-deep)] hover:text-[var(--gold-deep)]"
            >
              ADD TO BAG
            </button>
          )}
        </div>

        <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
          {product.description}
        </p>

        <div className="mt-4 flex items-center gap-2 text-sm">
          <span className="text-[var(--muted)] line-through">
            {money(product.oldPrice)}
          </span>
          <span className="font-semibold text-[var(--ink)]">
            {money(product.price)}
          </span>
        </div>

        <p className="mt-1 text-xs text-[var(--muted)]">
          Pay in 3 installments of {money(installmentAmount(product.price))}
        </p>

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

        {compact ? (
          <button
            type="button"
            onClick={() => onAddToCart(product.id, pickedSize, true)}
            className="mt-5 w-full rounded-[var(--radius-sm)] bg-[var(--ink)] px-4 py-3 text-[10px] font-semibold tracking-[0.16em] text-[var(--paper)]"
          >
            QUICK ADD
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

function colorToSwatch(color: string) {
  const normalized = color.toLowerCase();

  if (normalized.includes("black")) return "#111111";
  if (normalized.includes("white")) return "#f8f7f3";
  if (normalized.includes("sand")) return "#d8c3a4";
  if (normalized.includes("ice")) return "#e9ece8";
  if (normalized.includes("olive")) return "#7c8561";
  if (normalized.includes("grey") || normalized.includes("gray")) return "#b6b8bb";
  if (normalized.includes("cream")) return "#ece2cf";
  if (normalized.includes("beige")) return "#cdb89c";

  return "#111111";
}
