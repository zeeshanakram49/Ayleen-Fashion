import { useEffect, useMemo, useState } from "react";
import { discountPercent, money } from "../lib/store";
import { APP_ROUTES } from "../routes/appRoutes";
import { navigateToHash } from "../routes/routeUtils";
import type { Product } from "../types/store";
import { ImageWithFallback } from "./ImageWithFallback";

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
};

export function QuickViewModal({
  product,
  liked,
  pickedSize,
  onClose,
  onPickSize,
  onToggleWishlist,
  onAddToCart,
}: QuickViewModalProps) {
  const [activeImageByProduct, setActiveImageByProduct] = useState<
    Record<string, string>
  >({});
  const [qtyByProduct, setQtyByProduct] = useState<Record<string, number>>({});
  const gallery = useMemo(
    () => Array.from(new Set([product.image, ...product.gallery])),
    [product],
  );
  const activeImage =
    activeImageByProduct[product.id] ?? product.gallery[0] ?? product.image;
  const qty = qtyByProduct[product.id] ?? 1;
  const salePercent = discountPercent(product.price, product.oldPrice);
  const finalSize = pickedSize || product.sizes[0];
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

  function addCurrentToCart() {
    if (needsExplicitSize) {
      return;
    }
    onAddToCart(product.id, finalSize, true, qty);
    onClose();
  }

  function buyNow() {
    if (needsExplicitSize) {
      return;
    }
    onAddToCart(product.id, finalSize, true, qty);
    navigateToHash(APP_ROUTES.checkout);
    onClose();
  }

  return (
    <div
      className="quickview-backdrop"
      role="presentation"
      onClick={onClose}
    >
      <div
        className="quickview-shell"
        role="dialog"
        aria-modal="true"
        aria-label={`${product.title} quick view`}
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="quickview-close"
          aria-label="Close quick view"
        >
          ×
        </button>

        <div className="quickview-grid">
          <div className="quickview-gallery-strip">
            {gallery.map((image) => (
              <button
                key={image}
                type="button"
                onClick={() =>
                  setActiveImageByProduct((prev) => ({
                    ...prev,
                    [product.id]: image,
                  }))
                }
                className={`quickview-thumb ${
                  activeImage === image ? "is-active" : ""
                }`}
              >
                <ImageWithFallback
                  src={image}
                  alt={product.title}
                  className="h-full w-full object-cover"
                />
              </button>
            ))}
          </div>

          <div className="quickview-main-image">
            <ImageWithFallback
              src={activeImage}
              alt={product.title}
              className="h-full w-full object-cover"
            />
          </div>

          <div className="quickview-content">
            <h2 className="font-editorial text-4xl leading-[1.05] text-[var(--ink)]">
              {product.title}
            </h2>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <p className="text-3xl text-[var(--ink)]">
                {money(product.price).replace("PKR ", "Rs.")}
              </p>
              {salePercent > 0 && (
                <span className="rounded-[var(--radius-sm)] bg-[var(--ink)] px-3 py-1 text-[0.68rem] tracking-[0.16em] text-white">
                  SAVE {salePercent}%
                </span>
              )}
            </div>

            <p className="mt-2 text-sm text-[var(--muted)]">
              Shipping calculated at checkout.
            </p>
            <div className="mt-6">
              <p className="quickview-label">COLOR</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {product.colors.map((color) => (
                  <span
                    key={color}
                    className="rounded-[var(--radius-sm)] border border-[var(--line)] px-3 py-1.5 text-[0.72rem] tracking-[0.1em]"
                  >
                    {color}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-7">
              <p className="quickview-label">SIZE</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => onPickSize(product.id, size)}
                    className={`quickview-size ${
                      pickedSize === size ? "is-selected" : ""
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
              {needsExplicitSize && (
                <p className="mt-3 text-sm text-[#b14c41]">
                  Please select a size before continuing.
                </p>
              )}
            </div>

            <div className="mt-7">
              <p className="quickview-label">QUANTITY</p>
              <div className="quickview-qty mt-3">
                <button
                  type="button"
                  onClick={() =>
                    setQtyByProduct((prev) => ({
                      ...prev,
                      [product.id]: Math.max(1, qty - 1),
                    }))
                  }
                >
                  −
                </button>
                <span>{qty}</span>
                <button
                  type="button"
                  onClick={() =>
                    setQtyByProduct((prev) => ({
                      ...prev,
                      [product.id]: Math.min(product.stock, qty + 1),
                    }))
                  }
                >
                  +
                </button>
              </div>
            </div>

            <p className="mt-7 text-[0.82rem] tracking-[0.28em] text-[var(--muted)]">
              SIZE CHART
            </p>

            <div className="mt-8 flex gap-3">
              <button
                type="button"
                onClick={addCurrentToCart}
                className="quickview-primary"
              >
                ADD TO CART
              </button>
              <button
                type="button"
                onClick={() => onToggleWishlist(product.id)}
                className="quickview-save"
                aria-label="Save item"
              >
                {liked ? "♥" : "♡"}
              </button>
            </div>

            <button
              type="button"
              onClick={buyNow}
              className="quickview-secondary"
            >
              BUY IT NOW
            </button>

            <div className="mt-8 border-t border-[var(--line)] pt-5 text-sm leading-7 text-[var(--muted)]">
              <p>{product.details}</p>
              <p className="mt-3">Material: {product.material}</p>
              <p>Stock available: {product.stock}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
