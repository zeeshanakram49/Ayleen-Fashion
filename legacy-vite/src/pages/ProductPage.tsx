import { useState, useMemo } from "react";
import {
  Heart,
  Maximize2,
  Ruler,
  Truck,
  RefreshCw,
  ChevronDown,
  Check,
} from "lucide-react";
import { ImageWithFallback } from "../components/ImageWithFallback";
import { ProductCard } from "../components/ProductCard";
import { FullscreenProductGallery } from "../components/FullscreenProductGallery";
import { SizeGuideModal } from "../components/SizeGuideModal";
import { discountPercent, installmentAmount, money } from "../lib/store";
import { APP_ROUTES } from "../routes/appRoutes";
import { getHashUrl } from "../routes/routeUtils";
import type { Product } from "../types/store";

type ProductPageProps = {
  product: Product;
  relatedProducts: Product[];
  pickedSize: string;
  liked: boolean;
  wishlist: string[];
  selectedSize: Record<string, string>;
  onPickSize: (size: string) => void;
  onAddToCart: () => void;
  onToggleWishlist: () => void;
  onOpenProduct: (slug: string) => void;
  onCardAddToCart: (
    productId: string,
    fallbackSize?: string,
    requireSelection?: boolean,
    qty?: number,
  ) => void;
  onCardPickSize: (productId: string, size: string) => void;
  onCardToggleWishlist: (productId: string) => void;
};

const displaySizes = ["S", "M", "L", "XL", "XXL"];

export function ProductPage({
  product,
  relatedProducts,
  pickedSize,
  liked,
  wishlist,
  selectedSize,
  onPickSize,
  onAddToCart,
  onToggleWishlist,
  onOpenProduct,
  onCardAddToCart,
  onCardPickSize,
  onCardToggleWishlist,
}: ProductPageProps) {
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [galleryInitialIndex, setGalleryInitialIndex] = useState(0);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [addedNotice, setAddedNotice] = useState(false);
  const [openAccordions, setOpenAccordions] = useState<Record<string, boolean>>(
    {
      desc: true,
      fit: false,
      shipping: false,
    },
  );

  const salePercent = discountPercent(product.price, product.oldPrice);
  const galleryImages = useMemo(
    () => Array.from(new Set([product.image, ...product.gallery])),
    [product],
  );
  const installment = money(installmentAmount(product.price)).replace(
    "PKR ",
    "Rs. ",
  );

  const toggleAccordion = (key: string) => {
    setOpenAccordions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleOpenGallery = (idx: number) => {
    setGalleryInitialIndex(idx);
    setGalleryOpen(true);
  };

  const handleAdd = () => {
    onAddToCart();
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 1200);
  };

  return (
    <div className="min-h-screen bg-[var(--paper)] pb-24 text-[var(--ink)] lg:pb-32">
      {/* Breadcrumb Navigation */}
      <div className="mx-auto max-w-7xl border-b border-[var(--line)] px-4 py-6 sm:px-8">
        <div className="flex items-center gap-2 text-xs font-semibold tracking-[0.2em] text-[var(--muted)] uppercase">
          <a
            href={getHashUrl(APP_ROUTES.home)}
            className="transition hover:text-[var(--ink)]"
          >
            Home
          </a>
          <span>/</span>
          <a
            href={getHashUrl(APP_ROUTES.shop)}
            className="transition hover:text-[var(--ink)]"
          >
            Shop
          </a>
          <span>/</span>
          <span className="text-[var(--ink)]">{product.categoryLabel}</span>
        </div>
      </div>

      {/* Main Editorial Media & Info Section (65/35) */}
      <div className="mx-auto max-w-[1700px] px-4 py-8 sm:px-8 lg:py-12">
        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12 lg:gap-16">
          {/* Left Media Gallery Column (65% width = 8 cols) */}
          <div className="space-y-4 lg:col-span-7">
            {/* Desktop Vertical Gallery Stack */}
            <div className="hidden grid-cols-2 gap-4 sm:grid">
              {galleryImages.map((img, idx) => (
                <div
                  key={idx}
                  onClick={() => handleOpenGallery(idx)}
                  className="group relative aspect-[3/4] cursor-zoom-in overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--panel)] shadow-sm"
                >
                  <ImageWithFallback
                    src={img}
                    alt={`${product.title} view ${idx + 1}`}
                    className="h-full w-full object-cover object-top transition duration-500 group-hover:scale-105"
                  />
                  <div className="absolute right-3 bottom-3 opacity-0 transition group-hover:opacity-100">
                    <span className="flex items-center gap-1 rounded-full bg-black/75 px-3 py-1 text-[11px] font-bold text-white shadow-md backdrop-blur-md">
                      <Maximize2 size={12} /> Expand
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Mobile Swipeable Gallery (100% width, ~75vh height) */}
            <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--panel)] sm:hidden">
              <ImageWithFallback
                src={galleryImages[0]}
                alt={product.title}
                onClick={() => handleOpenGallery(0)}
                className="h-full w-full object-cover object-top"
              />
              <button
                type="button"
                onClick={() => handleOpenGallery(0)}
                className="absolute right-4 bottom-4 flex items-center gap-1.5 rounded-full bg-black/80 px-3.5 py-1.5 text-xs font-bold text-white shadow-lg backdrop-blur-md"
              >
                <Maximize2 size={14} /> Fullscreen Viewer
              </button>
            </div>
          </div>

          {/* Right Information Panel (35% width = 5 cols) - Sticky */}
          <div className="space-y-6 rounded-3xl border border-[var(--line)] bg-white p-6 shadow-lg sm:p-8 lg:sticky lg:top-28 lg:col-span-5">
            <div>
              <div className="flex items-center justify-between text-xs font-bold tracking-[0.2em] text-[var(--muted)] uppercase">
                <span>{product.fit}</span>
                <span>{product.categoryLabel}</span>
              </div>

              <h1 className="font-display mt-2 text-3xl font-extrabold tracking-tight text-[var(--ink)] uppercase sm:text-4xl">
                {product.title}
              </h1>

              {/* Price & Installments */}
              <div className="mt-4 flex flex-wrap items-baseline gap-3">
                <span className="text-3xl font-black text-[var(--ink)]">
                  {money(product.price).replace("PKR ", "Rs. ")}
                </span>
                {product.oldPrice > product.price && (
                  <span className="text-base font-semibold text-[var(--muted)] line-through">
                    {money(product.oldPrice).replace("PKR ", "Rs. ")}
                  </span>
                )}
                {salePercent > 0 && (
                  <span className="rounded-full bg-[var(--ink)] px-3 py-1 text-xs font-bold text-white shadow-sm">
                    SAVE {salePercent}%
                  </span>
                )}
              </div>

              {/* Installment payment callout */}
              <div className="mt-3 inline-flex items-center gap-2 rounded-xl border border-[var(--line)] bg-[var(--panel)] px-3.5 py-2 text-xs text-[var(--muted)]">
                <span>
                  Or 4 interest-free payments of <strong>{installment}</strong>
                </span>
              </div>
            </div>

            {/* Size Selector */}
            <div className="border-t border-[var(--line)] pt-6">
              <div className="mb-3 flex items-center justify-between text-xs font-bold tracking-wider text-[var(--ink)] uppercase">
                <span>Select Size</span>
                <button
                  type="button"
                  onClick={() => setSizeGuideOpen(true)}
                  className="flex items-center gap-1 text-[var(--muted)] underline transition hover:text-[var(--ink)]"
                >
                  <Ruler size={14} /> Size Guide
                </button>
              </div>

              <div className="flex flex-wrap gap-2.5">
                {(product.sizes.length > 0 ? product.sizes : displaySizes).map(
                  (size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => onPickSize(size)}
                      className={`h-12 min-w-[48px] rounded-xl border text-xs font-bold tracking-wider uppercase transition ${
                        pickedSize === size
                          ? "border-[var(--ink)] bg-[var(--ink)] text-white shadow-md"
                          : "border-[var(--line-strong)] bg-white text-[var(--ink)] hover:border-[var(--ink)]"
                      }`}
                    >
                      {size}
                    </button>
                  ),
                )}
              </div>
            </div>

            {/* Action Buttons (Add to Basket + Wishlist) */}
            <div className="space-y-3 pt-2">
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleAdd}
                  className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-[var(--ink)] py-4 text-xs font-bold tracking-[0.18em] text-white uppercase shadow-xl transition hover:bg-neutral-800 active:scale-98"
                >
                  {addedNotice ? (
                    <>
                      <Check size={18} /> Added to Basket!
                    </>
                  ) : (
                    "Add to Basket"
                  )}
                </button>
                <button
                  type="button"
                  onClick={onToggleWishlist}
                  aria-label="Toggle Wishlist"
                  className={`flex h-14 w-14 items-center justify-center rounded-2xl border transition ${
                    liked
                      ? "border-red-200 bg-red-50 text-red-600"
                      : "border-[var(--line-strong)] text-[var(--ink)] hover:bg-[var(--panel)]"
                  }`}
                >
                  <Heart
                    size={22}
                    className={liked ? "fill-red-600 stroke-red-600" : ""}
                  />
                </button>
              </div>
            </div>

            {/* Value Highlights */}
            <div className="grid grid-cols-2 gap-3 border-t border-[var(--line)] pt-4 text-xs text-[var(--muted)]">
              <div className="flex items-center gap-2">
                <Truck size={16} className="shrink-0 text-[var(--ink)]" />
                <span>Free Shipping over Rs. 2,500</span>
              </div>
              <div className="flex items-center gap-2">
                <RefreshCw size={16} className="shrink-0 text-[var(--ink)]" />
                <span>14-Day Easy Exchange</span>
              </div>
            </div>

            {/* Collapsible Accordions */}
            <div className="space-y-3 border-t border-[var(--line)] pt-4">
              <div className="overflow-hidden rounded-2xl border border-[var(--line)] bg-white">
                <button
                  type="button"
                  onClick={() => toggleAccordion("desc")}
                  className="flex w-full items-center justify-between p-4 text-left text-xs font-bold tracking-wider text-[var(--ink)] uppercase"
                >
                  <span>Product Description</span>
                  <ChevronDown
                    className={`h-4 w-4 transition duration-200 ${openAccordions.desc ? "rotate-180" : ""}`}
                  />
                </button>
                {openAccordions.desc && (
                  <div className="border-t border-[var(--line)] p-4 pt-0 text-xs leading-relaxed text-neutral-600">
                    <p>{product.description}</p>
                    <p className="mt-2 font-medium">
                      Material: {product.material || "100% Premium Cotton"}
                    </p>
                  </div>
                )}
              </div>

              <div className="overflow-hidden rounded-2xl border border-[var(--line)] bg-white">
                <button
                  type="button"
                  onClick={() => toggleAccordion("fit")}
                  className="flex w-full items-center justify-between p-4 text-left text-xs font-bold tracking-wider text-[var(--ink)] uppercase"
                >
                  <span>Fabric &amp; Care Guide</span>
                  <ChevronDown
                    className={`h-4 w-4 transition duration-200 ${openAccordions.fit ? "rotate-180" : ""}`}
                  />
                </button>
                {openAccordions.fit && (
                  <div className="space-y-1 border-t border-[var(--line)] p-4 pt-0 text-xs leading-relaxed text-neutral-600">
                    <p>• Machine wash cold inside out with like colors.</p>
                    <p>
                      • Tumble dry low or line dry to preserve fabric drape.
                    </p>
                    <p>
                      • Warm iron if needed. Do not iron directly over prints.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products Carousel / Grid */}
      {relatedProducts.length > 0 && (
        <section className="mx-auto mt-16 max-w-7xl border-t border-[var(--line)] px-4 py-16 sm:px-8">
          <div className="mb-8">
            <span className="text-xs font-bold tracking-[0.25em] text-[var(--muted)] uppercase">
              COMPLETE THE LOOK
            </span>
            <h2 className="font-display mt-1 text-2xl font-extrabold tracking-tight text-[var(--ink)] uppercase sm:text-3xl">
              You May Also Like
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 lg:grid-cols-4">
            {relatedProducts.slice(0, 4).map((rel, idx) => (
              <ProductCard
                key={rel.id}
                product={rel}
                index={idx}
                liked={wishlist.includes(rel.id)}
                pickedSize={selectedSize[rel.id]}
                onPickSize={(id, s) => onCardPickSize(id, s)}
                onToggleWishlist={(id) => onCardToggleWishlist(id)}
                onAddToCart={(id, s, req, q) => onCardAddToCart(id, s, req, q)}
                onOpenProduct={onOpenProduct}
              />
            ))}
          </div>
        </section>
      )}

      {/* Sticky Mobile Bottom CTA Bar (safe-area padding) */}
      <div className="pb-safe fixed inset-x-0 bottom-0 z-40 border-t border-[var(--line)] bg-white/95 p-4 shadow-2xl backdrop-blur-xl lg:hidden">
        <div className="flex items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-bold text-[var(--muted)] uppercase">
              Total Price
            </span>
            <p className="text-lg font-black text-[var(--ink)]">
              {money(product.price).replace("PKR ", "Rs. ")}
            </p>
          </div>
          <button
            type="button"
            onClick={handleAdd}
            className="max-w-xs flex-1 rounded-xl bg-[var(--ink)] py-3 text-xs font-bold tracking-widest text-white uppercase shadow-lg transition active:scale-95"
          >
            {addedNotice ? "Added!" : "Add to Basket"}
          </button>
        </div>
      </div>

      {/* Interactive Fullscreen Image Viewer Modal */}
      <FullscreenProductGallery
        isOpen={galleryOpen}
        images={galleryImages}
        initialIndex={galleryInitialIndex}
        productTitle={product.title}
        onClose={() => setGalleryOpen(false)}
      />

      {/* Size Guide Modal */}
      <SizeGuideModal
        isOpen={sizeGuideOpen}
        onClose={() => setSizeGuideOpen(false)}
      />
    </div>
  );
}
