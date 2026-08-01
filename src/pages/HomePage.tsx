import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight, Star, Sparkles, TrendingUp } from "lucide-react";
import { ImageWithFallback } from "../components/ImageWithFallback";
import { ProductCard } from "../components/ProductCard";
import { QuickViewModal } from "../components/QuickViewModal";
import type { Banner, Category, Product, Service, Testimonial } from "../types/store";
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
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [activeHeroSlide, setActiveHeroSlide] = useState(0);
  const [activeTab, setActiveTab] = useState<"bestsellers" | "sale">("bestsellers");

  const heroBanners = useMemo(
    () => (banners.length > 0 ? banners : [
      {
        id: "1",
        title: "MODERN STREETWEAR SILHOUETTES",
        description: "Explore the new Spring/Summer collection crafted with precision tailoring & premium cotton.",
        image: "https://pk.lamaretail.com/cdn/shop/files/LAMA_DESKTOP_BANNER_1_1800x.jpg",
      }
    ]),
    [banners]
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
      return (saleEssentialsProducts.length > 0 ? saleEssentialsProducts : products.filter((p) => p.tags.includes("sale"))).slice(0, 8);
    }
    if (activeTab === "bestsellers") {
      return (mustHavesProducts.length > 0 ? mustHavesProducts : products.filter((p) => p.rating >= 4.5)).slice(0, 8);
    }
    return products.slice(0, 8);
  }, [activeTab, products, saleEssentialsProducts, mustHavesProducts]);

  const parentCategories = useMemo(
    () => categories.filter((c) => c.isParent === true),
    [categories]
  );

  return (
    <div className="min-h-screen bg-[var(--paper)] text-[var(--ink)]">
      {/* 1. EDITORIAL HERO SECTION */}
      <section className="relative w-full h-screen min-h-[650px] overflow-hidden bg-neutral-900 text-white">
        <div className="absolute inset-0">
          <ImageWithFallback
            src={activeHeroBanner?.image}
            alt={activeHeroBanner?.title || "Aylee Collection"}
            className="h-full w-full object-cover object-center filter brightness-[0.78] transition-transform duration-1000 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/20" />
        </div>

        {/* Hero Overlay Content */}
        <div className="relative mx-auto max-w-7xl h-full flex flex-col justify-end px-6 pb-16 sm:pb-24 lg:px-12 z-10">
          <motion.div
            key={activeHeroSlide}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl space-y-4"
          >
            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 backdrop-blur-md px-3.5 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-white">
              <Sparkles size={14} /> NEW SEASON DROPS 2026
            </div>

            <h1 className="font-display text-4xl sm:text-6xl font-black tracking-tight text-white uppercase leading-none drop-shadow-lg">
              {activeHeroBanner?.title || "ESSENTIAL LUXURY STREETWEAR"}
            </h1>

            <p className="text-sm sm:text-base font-light text-neutral-200 line-clamp-2 max-w-xl leading-relaxed">
              {activeHeroBanner?.description || "Engineered for maximum drape, premium breathability, and contemporary streetwear aesthetics."}
            </p>

            <div className="pt-4 flex flex-wrap gap-4">
              <button
                type="button"
                onClick={() => onShopCategory("all")}
                className="flex items-center gap-2 rounded-full bg-white px-8 py-4 text-xs font-bold uppercase tracking-[0.16em] text-black hover:bg-neutral-200 transition shadow-2xl active:scale-95"
              >
                EXPLORE COLLECTION <ArrowRight size={16} />
              </button>
              <button
                type="button"
                onClick={() => onShopCategory("all", "sale")}
                className="flex items-center gap-2 rounded-full border border-white/40 bg-black/30 backdrop-blur-md px-8 py-4 text-xs font-bold uppercase tracking-[0.16em] text-white hover:bg-white/20 transition active:scale-95"
              >
                SHOP SALE ESSENTIALS
              </button>
            </div>
          </motion.div>

          {/* Hero Slider Dots / Navigation Controls */}
          {heroBanners.length > 1 && (
            <div className="absolute right-6 bottom-16 sm:right-12 hidden sm:flex items-center gap-3">
              <button
                type="button"
                onClick={() => setActiveHeroSlide((prev) => (prev === 0 ? heroBanners.length - 1 : prev - 1))}
                className="flex h-11 w-11 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-md hover:bg-white/40 transition active:scale-90"
                aria-label="Previous slide"
              >
                <ChevronLeft size={20} />
              </button>
              <span className="text-xs font-mono font-bold tracking-widest">
                0{activeHeroSlide + 1} / 0{heroBanners.length}
              </span>
              <button
                type="button"
                onClick={() => setActiveHeroSlide((prev) => (prev + 1) % heroBanners.length)}
                className="flex h-11 w-11 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-md hover:bg-white/40 transition active:scale-90"
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
        <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-[var(--line)] pb-6 mb-10">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-[var(--muted)]">CURATED SELECTION</span>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-[var(--ink)] mt-1">
              Shop by Category
            </h2>
          </div>
          <a
            href={getHashUrl(APP_ROUTES.shop)}
            className="mt-4 sm:mt-0 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[var(--ink)] hover:underline"
          >
            VIEW ALL CATEGORIES &rarr;
          </a>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {parentCategories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => onShopCategory(cat.id)}
              className="group cursor-pointer relative aspect-[3/4] overflow-hidden rounded-2xl bg-[var(--panel)] border border-[var(--line)] shadow-sm hover:shadow-2xl transition duration-500"
            >
              <ImageWithFallback
                src={cat.image}
                alt={cat.name}
                className="h-full w-full object-cover group-hover:scale-108 transition duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-6 flex flex-col justify-end text-white">
                <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-300">
                  {cat.items || "12+"} ITEMS
                </span>
                <h3 className="font-display text-xl font-bold uppercase tracking-tight mt-0.5">
                  {cat.name}
                </h3>
                <span className="mt-2 inline-flex items-center text-[11px] font-bold uppercase tracking-widest text-white/80 group-hover:translate-x-1 transition">
                  EXPLORE &rarr;
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. FEATURED PRODUCTS & TABBED SHOWCASE */}
      <section className="bg-[var(--panel)] py-16 lg:py-24 border-y border-[var(--line)]">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-12">
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-[var(--muted)] flex items-center gap-1">
                <TrendingUp size={14} /> CURATED DROPS
              </span>
              <h2 className="font-display text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-[var(--ink)] mt-1">
                Featured Collections
              </h2>
            </div>

            {/* Tabs Selector */}
            <div className="flex rounded-full border border-[var(--line-strong)] bg-white p-1 shadow-sm">
              <button
                type="button"
                onClick={() => setActiveTab("bestsellers")}
                className={`rounded-full px-5 py-2.5 text-xs font-bold uppercase tracking-wider transition ${
                  activeTab === "bestsellers" ? "bg-[var(--ink)] text-white shadow-md" : "text-[var(--muted)] hover:text-[var(--ink)]"
                }`}
              >
                Best Sellers
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("sale")}
                className={`rounded-full px-5 py-2.5 text-xs font-bold uppercase tracking-wider transition ${
                  activeTab === "sale" ? "bg-[var(--ink)] text-white shadow-md" : "text-[var(--muted)] hover:text-[var(--ink)]"
                }`}
              >
                Sale Essentials
              </button>
            </div>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
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
              className="inline-flex items-center gap-2 rounded-full bg-[var(--ink)] px-8 py-4 text-xs font-bold uppercase tracking-[0.16em] text-white hover:bg-neutral-800 transition shadow-xl active:scale-95"
            >
              EXPLORE ALL PRODUCTS <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* 4. BRAND STORY EDITORIAL BANNER */}
      <section className="mx-auto max-w-7xl px-6 py-16 lg:py-24">
        <div className="overflow-hidden rounded-3xl bg-[var(--ink)] text-white shadow-2xl grid md:grid-cols-12">
          <div className="md:col-span-6 p-8 sm:p-12 lg:p-16 flex flex-col justify-between">
            <div className="space-y-4">
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-neutral-400">AYLEE IDENTITY</span>
              <h2 className="font-display text-3xl sm:text-5xl font-black uppercase tracking-tight leading-tight">
                CRAFTED FOR MODERN ELEVATED LIVING
              </h2>
              <p className="text-sm text-neutral-300 font-light leading-relaxed">
                At Aylee, every piece is designed with meticulous attention to detail — from heavy GSM fabrics and reinforced stitching to ergonomic streetwear fits made to empower everyday confidence.
              </p>
            </div>

            <div className="pt-8">
              <a
                href={getHashUrl(APP_ROUTES.about)}
                className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3.5 text-xs font-bold uppercase tracking-widest text-[var(--ink)] hover:bg-neutral-200 transition"
              >
                OUR BRAND STORY &rarr;
              </a>
            </div>
          </div>

          <div className="md:col-span-6 relative min-h-[340px]">
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
        <section className="bg-[var(--panel)] py-16 border-t border-[var(--line)]">
          <div className="mx-auto max-w-7xl px-6">
            <div className="text-center max-w-xl mx-auto mb-12">
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-[var(--muted)]">CUSTOMER FEEDBACK</span>
              <h2 className="font-display text-3xl font-extrabold uppercase tracking-tight text-[var(--ink)] mt-1">
                What Our Clients Say
              </h2>
            </div>

            <div className="grid sm:grid-cols-3 gap-6">
              {testimonials.slice(0, 3).map((item, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-[var(--line)] bg-white p-6 shadow-sm space-y-4"
                >
                  <div className="flex items-center gap-1 text-amber-500">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={16} className="fill-amber-500 stroke-amber-500" />
                    ))}
                  </div>
                  <p className="text-xs leading-relaxed text-neutral-700 italic">
                    &ldquo;{item.quote}&rdquo;
                  </p>
                  <div className="border-t border-[var(--line)] pt-3 flex justify-between text-xs font-bold uppercase tracking-wider text-[var(--ink)]">
                    <span>{item.name}</span>
                    <span className="text-[var(--muted)] font-normal">{item.city}</span>
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
