import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Star,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { ImageWithFallback } from "../components/ImageWithFallback";
import { ProductCard } from "../components/ProductCard";
import { QuickViewModal } from "../components/QuickViewModal";
import type {
  Banner,
  Category,
  Product,
  Service,
  Testimonial,
} from "../types/store";
import { APP_ROUTES } from "../routes/appRoutes";
import { getHashUrl } from "../routes/routeUtils";

type HomePageProps = {
  categories: Category[];
  banners: Banner[];
  products: Product[];
  focusProducts?: Product[];
  mustHavesProducts?: Product[];
  saleEssentialsProducts?: Product[];
  services: Service[];
  testimonials: Testimonial[];
  wishlist: string[];
  selectedSize: Record<string, string>;
  onPickSize: (productId: string, size: string) => void;
  onToggleWishlist: (productId: string) => void;
  onAddToCart: (
    productId: string,
    fallbackSize?: string,
    requireSelection?: boolean,
    qty?: number,
  ) => void;
  onOpenProduct: (slug: string) => void;
  onShopCategory: (categoryId: string, query?: string) => void;
};

export function HomePage({
  categories,
  banners,
  products,
  focusProducts: _focusProducts = [],
  mustHavesProducts = [],
  saleEssentialsProducts = [],
  services: _services,
  testimonials,
  wishlist,
  selectedSize,
  onPickSize,
  onToggleWishlist,
  onAddToCart,
  onOpenProduct,
  onShopCategory,
}: HomePageProps) {
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(
    null,
  );
  const [activeHeroSlide, setActiveHeroSlide] = useState(0);
  const [activeTab, setActiveTab] = useState<"bestsellers" | "sale">(
    "bestsellers",
  );

  const heroBanners = useMemo(
    () =>
      banners.length > 0
        ? banners
        : [
            {
              id: "1",
              title: "MODERN STREETWEAR SILHOUETTES",
              description:
                "Explore the new Spring/Summer collection crafted with precision tailoring & premium cotton.",
              image:
                "https://pk.lamaretail.com/cdn/shop/files/LAMA_DESKTOP_BANNER_1_1800x.jpg",
            },
          ],
    [banners],
  );

  const activeHeroBanner = heroBanners[activeHeroSlide % heroBanners.length];

  // Auto slide hero every 6 seconds
  useEffect(() => {
    if (heroBanners.length <= 1) return;
    const interval = setInterval(() => {
      setActiveHeroSlide((prev) => (prev + 1) % heroBanners.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [heroBanners.length]);

  const displayProducts = useMemo(() => {
    if (activeTab === "sale") {
      return (
        saleEssentialsProducts.length > 0
          ? saleEssentialsProducts
          : products.filter((p) => p.tags.includes("sale"))
      ).slice(0, 8);
    }
    if (activeTab === "bestsellers") {
      return (
        mustHavesProducts.length > 0
          ? mustHavesProducts
          : products.filter((p) => p.rating >= 4.5)
      ).slice(0, 8);
    }
    return products.slice(0, 8);
  }, [activeTab, products, saleEssentialsProducts, mustHavesProducts]);

  const parentCategories = useMemo(
    () => categories.filter((c) => c.isParent === true),
    [categories],
  );

  return (
    <div className="min-h-screen bg-[var(--paper)] text-[var(--ink)]">
      {/* 1. EDITORIAL HERO SECTION */}
      <section className="relative h-screen min-h-[650px] w-full overflow-hidden bg-neutral-900 text-white">
        <div className="absolute inset-0">
          <ImageWithFallback
            src={activeHeroBanner?.image}
            alt={activeHeroBanner?.title || "Aylee Collection"}
            className="h-full w-full scale-105 object-cover object-center brightness-[0.78] filter transition-transform duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/20" />
        </div>

        {/* Hero Overlay Content */}
        <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-end px-6 pb-16 sm:pb-24 lg:px-12">
          <motion.div
            key={activeHeroSlide}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl space-y-4"
          >
            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3.5 py-1 text-[11px] font-bold tracking-[0.2em] text-white uppercase backdrop-blur-md">
              <Sparkles size={14} /> NEW SEASON DROPS 2026
            </div>

            <h1 className="font-display text-4xl leading-none font-black tracking-tight text-white uppercase drop-shadow-lg sm:text-6xl">
              {activeHeroBanner?.title || "ESSENTIAL LUXURY STREETWEAR"}
            </h1>

            <p className="line-clamp-2 max-w-xl text-sm leading-relaxed font-light text-neutral-200 sm:text-base">
              {activeHeroBanner?.description ||
                "Engineered for maximum drape, premium breathability, and contemporary streetwear aesthetics."}
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <button
                type="button"
                onClick={() => onShopCategory("all")}
                className="flex items-center gap-2 rounded-full bg-white px-8 py-4 text-xs font-bold tracking-[0.16em] text-black uppercase shadow-2xl transition hover:bg-neutral-200 active:scale-95"
              >
                EXPLORE COLLECTION <ArrowRight size={16} />
              </button>
              <button
                type="button"
                onClick={() => onShopCategory("all", "sale")}
                className="flex items-center gap-2 rounded-full border border-white/40 bg-black/30 px-8 py-4 text-xs font-bold tracking-[0.16em] text-white uppercase backdrop-blur-md transition hover:bg-white/20 active:scale-95"
              >
                SHOP SALE ESSENTIALS
              </button>
            </div>
          </motion.div>

          {/* Hero Slider Dots / Navigation Controls */}
          {heroBanners.length > 1 && (
            <div className="absolute right-6 bottom-16 hidden items-center gap-3 sm:right-12 sm:flex">
              <button
                type="button"
                onClick={() =>
                  setActiveHeroSlide((prev) =>
                    prev === 0 ? heroBanners.length - 1 : prev - 1,
                  )
                }
                className="flex h-11 w-11 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-md transition hover:bg-white/40 active:scale-90"
                aria-label="Previous slide"
              >
                <ChevronLeft size={20} />
              </button>
              <span className="font-mono text-xs font-bold tracking-widest">
                0{activeHeroSlide + 1} / 0{heroBanners.length}
              </span>
              <button
                type="button"
                onClick={() =>
                  setActiveHeroSlide((prev) => (prev + 1) % heroBanners.length)
                }
                className="flex h-11 w-11 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-md transition hover:bg-white/40 active:scale-90"
                aria-label="Next slide"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* 2. SHOP BY CATEGORY SECTION */}
      <section className="mx-auto max-w-7xl px-6 py-16 lg:py-24">
        <div className="mb-10 flex flex-col justify-between border-b border-[var(--line)] pb-6 sm:flex-row sm:items-end">
          <div>
            <span className="text-xs font-bold tracking-[0.25em] text-[var(--muted)] uppercase">
              CURATED SELECTION
            </span>
            <h2 className="font-display mt-1 text-3xl font-extrabold tracking-tight text-[var(--ink)] uppercase sm:text-4xl">
              Shop by Category
            </h2>
          </div>
          <a
            href={getHashUrl(APP_ROUTES.shop)}
            className="mt-4 flex items-center gap-2 text-xs font-bold tracking-widest text-[var(--ink)] uppercase hover:underline sm:mt-0"
          >
            VIEW ALL CATEGORIES &rarr;
          </a>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 lg:grid-cols-4">
          {parentCategories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => onShopCategory(cat.id)}
              className="group relative aspect-[3/4] cursor-pointer overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--panel)] shadow-sm transition duration-500 hover:shadow-2xl"
            >
              <ImageWithFallback
                src={cat.image}
                alt={cat.name}
                className="h-full w-full object-cover transition duration-700 group-hover:scale-108"
              />
              <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/80 via-black/20 to-transparent p-6 text-white">
                <span className="text-[10px] font-bold tracking-widest text-neutral-300 uppercase">
                  {cat.items || "12+"} ITEMS
                </span>
                <h3 className="font-display mt-0.5 text-xl font-bold tracking-tight uppercase">
                  {cat.name}
                </h3>
                <span className="mt-2 inline-flex items-center text-[11px] font-bold tracking-widest text-white/80 uppercase transition group-hover:translate-x-1">
                  EXPLORE &rarr;
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. FEATURED PRODUCTS & TABBED SHOWCASE */}
      <section className="border-y border-[var(--line)] bg-[var(--panel)] py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-12 flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div>
              <span className="flex items-center gap-1 text-xs font-bold tracking-[0.25em] text-[var(--muted)] uppercase">
                <TrendingUp size={14} /> CURATED DROPS
              </span>
              <h2 className="font-display mt-1 text-3xl font-extrabold tracking-tight text-[var(--ink)] uppercase sm:text-4xl">
                Featured Collections
              </h2>
            </div>

            {/* Tabs Selector */}
            <div className="flex rounded-full border border-[var(--line-strong)] bg-white p-1 shadow-sm">
              <button
                type="button"
                onClick={() => setActiveTab("bestsellers")}
                className={`rounded-full px-5 py-2.5 text-xs font-bold tracking-wider uppercase transition ${
                  activeTab === "bestsellers"
                    ? "bg-[var(--ink)] text-white shadow-md"
                    : "text-[var(--muted)] hover:text-[var(--ink)]"
                }`}
              >
                Best Sellers
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("sale")}
                className={`rounded-full px-5 py-2.5 text-xs font-bold tracking-wider uppercase transition ${
                  activeTab === "sale"
                    ? "bg-[var(--ink)] text-white shadow-md"
                    : "text-[var(--muted)] hover:text-[var(--ink)]"
                }`}
              >
                Sale Essentials
              </button>
            </div>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 lg:grid-cols-4">
            {displayProducts.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                index={index}
                liked={wishlist.includes(product.id)}
                pickedSize={selectedSize[product.id]}
                onPickSize={onPickSize}
                onToggleWishlist={onToggleWishlist}
                onAddToCart={onAddToCart}
                onOpenProduct={onOpenProduct}
                onOpenQuickView={setQuickViewProduct}
              />
            ))}
          </div>

          <div className="mt-12 text-center">
            <button
              type="button"
              onClick={() => onShopCategory("all")}
              className="inline-flex items-center gap-2 rounded-full bg-[var(--ink)] px-8 py-4 text-xs font-bold tracking-[0.16em] text-white uppercase shadow-xl transition hover:bg-neutral-800 active:scale-95"
            >
              EXPLORE ALL PRODUCTS <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* 4. BRAND STORY EDITORIAL BANNER */}
      <section className="mx-auto max-w-7xl px-6 py-16 lg:py-24">
        <div className="grid overflow-hidden rounded-3xl bg-[var(--ink)] text-white shadow-2xl md:grid-cols-12">
          <div className="flex flex-col justify-between p-8 sm:p-12 md:col-span-6 lg:p-16">
            <div className="space-y-4">
              <span className="text-xs font-bold tracking-[0.25em] text-neutral-400 uppercase">
                AYLEE IDENTITY
              </span>
              <h2 className="font-display text-3xl leading-tight font-black tracking-tight uppercase sm:text-5xl">
                CRAFTED FOR MODERN ELEVATED LIVING
              </h2>
              <p className="text-sm leading-relaxed font-light text-neutral-300">
                At Aylee, every piece is designed with meticulous attention to
                detail — from heavy GSM fabrics and reinforced stitching to
                ergonomic streetwear fits made to empower everyday confidence.
              </p>
            </div>

            <div className="pt-8">
              <a
                href={getHashUrl(APP_ROUTES.about)}
                className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3.5 text-xs font-bold tracking-widest text-[var(--ink)] uppercase transition hover:bg-neutral-200"
              >
                OUR BRAND STORY &rarr;
              </a>
            </div>
          </div>

          <div className="relative min-h-[340px] md:col-span-6">
            <ImageWithFallback
              src="https://pk.lamaretail.com/cdn/shop/files/LAMA_DESKTOP_BANNER_2_1800x.jpg"
              alt="Aylee Editorial"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* 5. CUSTOMER TESTIMONIALS REVIEWS */}
      {testimonials.length > 0 && (
        <section className="border-t border-[var(--line)] bg-[var(--panel)] py-16">
          <div className="mx-auto max-w-7xl px-6">
            <div className="mx-auto mb-12 max-w-xl text-center">
              <span className="text-xs font-bold tracking-[0.25em] text-[var(--muted)] uppercase">
                CUSTOMER FEEDBACK
              </span>
              <h2 className="font-display mt-1 text-3xl font-extrabold tracking-tight text-[var(--ink)] uppercase">
                What Our Clients Say
              </h2>
            </div>

            <div className="grid gap-6 sm:grid-cols-3">
              {testimonials.slice(0, 3).map((item, idx) => (
                <div
                  key={idx}
                  className="space-y-4 rounded-2xl border border-[var(--line)] bg-white p-6 shadow-sm"
                >
                  <div className="flex items-center gap-1 text-amber-500">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        className="fill-amber-500 stroke-amber-500"
                      />
                    ))}
                  </div>
                  <p className="text-xs leading-relaxed text-neutral-700 italic">
                    &ldquo;{item.quote}&rdquo;
                  </p>
                  <div className="flex justify-between border-t border-[var(--line)] pt-3 text-xs font-bold tracking-wider text-[var(--ink)] uppercase">
                    <span>{item.name}</span>
                    <span className="font-normal text-[var(--muted)]">
                      {item.city}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Quick View Modal */}
      {quickViewProduct && (
        <QuickViewModal
          product={quickViewProduct}
          liked={wishlist.includes(quickViewProduct.id)}
          pickedSize={selectedSize[quickViewProduct.id]}
          onClose={() => setQuickViewProduct(null)}
          onPickSize={onPickSize}
          onToggleWishlist={onToggleWishlist}
          onAddToCart={onAddToCart}
          onOpenProduct={onOpenProduct}
        />
      )}
    </div>
  );
}
