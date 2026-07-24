import { useState, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Pagination } from "swiper/modules";
import {
  IoArrowForwardOutline,
  IoArrowBackOutline,
  IoLogoInstagram,
  IoChevronForwardOutline,
} from "react-icons/io5";

import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";

import { ProductCard } from "../components/ProductCard";
import { Newsletter } from "../components/Newsletter";
import type { Product } from "../types/store";

type HomePageProps = {
  products: Product[];
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

const heroSlides = [
  {
    image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2400&auto=format&fit=crop",
    badge: "SUMMER 2025",
    title: "RESORTWEAR\nEDIT",
    cta: "SHOP WOMEN",
    category: "women",
    query: "silk",
    align: "left",
  },
  {
    image: "https://images.unsplash.com/photo-1488161628813-04466f872be2?q=80&w=2400&auto=format&fit=crop",
    badge: "NEW ARRIVALS",
    title: "THE MEN'S\nESSENTIALS",
    cta: "SHOP MEN",
    category: "men",
    query: "knit",
    align: "left",
  },
  {
    image: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=2400&auto=format&fit=crop",
    badge: "SEASON EDIT",
    title: "MONOCHROME\nSILKS",
    cta: "EXPLORE",
    category: "women",
    query: "new-in",
    align: "right",
  },
];

const categoryTiles = [
  {
    title: "MEN",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop",
    categoryId: "men",
    sub: "View All Men's",
  },
  {
    title: "NEW ARRIVALS",
    image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=800&auto=format&fit=crop",
    categoryId: "all",
    query: "new-in",
    sub: "Just Dropped",
  },
  {
    title: "SALE",
    image: "https://images.unsplash.com/photo-1479064555552-3ef4979f8908?q=80&w=800&auto=format&fit=crop",
    categoryId: "all",
    query: "sale",
    sub: "Upto 50% Off",
    saleTag: true,
  },
];

const editorialBanners = [
  {
    image: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=1400&auto=format&fit=crop",
    title: "SUMMER SALE",
    sub: "Upto 50% Off",
    tag: "SALE",
    tagColor: "#fc0b0b",
    category: "all",
    query: "sale",
  },
  {
    image: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?q=80&w=1400&auto=format&fit=crop",
    title: "MEN'S\nCOLLECTION",
    sub: "Refined Essentials",
    tag: "MEN",
    tagColor: "#111",
    category: "men",
    query: "",
  },
];

const lookbookImages = [
  "https://images.unsplash.com/photo-1485462537746-965f33f7f6a7?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1509319117193-57bab727e09d?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?q=80&w=600&auto=format&fit=crop",
];

const marqueeItems = [
  "FREE SHIPPING ON ORDERS OVER RS. 3000",
  "SUMMER SALE NOW ON — UPTO 50% OFF",
  "EXCLUSIVE ONLINE DEALS",
  "NEW ARRIVALS EVERY WEEK",
  "EASY RETURNS WITHIN 7 DAYS",
  "SHOP MEN · WOMEN · KIDS",
];

// Animated fade-in-up wrapper
function RevealBlock({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function HomePage({
  products,
  wishlist,
  selectedSize,
  onPickSize,
  onToggleWishlist,
  onAddToCart,
  onOpenProduct,
  onShopCategory,
}: HomePageProps) {
  const [activeTab, setActiveTab] = useState<"new" | "women" | "men">("new");
  const [currentSlide, setCurrentSlide] = useState(0);
  const categoryScrollRef = useRef<HTMLDivElement>(null);

  const newArrivals = products.filter((p) => p.tags.includes("new-in")).slice(0, 8);
  const womenProducts = products.filter((p) => p.categoryId === "women").slice(0, 8);
  const menProducts = products.filter((p) => p.categoryId === "men").slice(0, 8);

  const activeProducts =
    activeTab === "new" ? newArrivals : activeTab === "women" ? womenProducts : menProducts;

  // Category horizontal scroll
  const scrollCategories = (dir: "left" | "right") => {
    const el = categoryScrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === "right" ? 280 : -280, behavior: "smooth" });
  };

  return (
    <div className="ot-page bg-white overflow-x-hidden">

      {/* ── ANNOUNCEMENT MARQUEE ── */}
      <div className="ot-marquee-bar">
        <div className="animate-marquee-infinite">
          {[...marqueeItems, ...marqueeItems].map((item, i) => (
            <span key={i} className="ot-marquee-item">
              {item}
              <span className="ot-marquee-dot">★</span>
            </span>
          ))}
        </div>
      </div>

      {/* ── HERO SLIDER ── */}
      <section className="ot-hero-section">
        <Swiper
          modules={[Autoplay, EffectFade, Pagination]}
          effect="fade"
          autoplay={{ delay: 5500, disableOnInteraction: false }}
          pagination={{ clickable: true, el: ".ot-hero-pagination" }}
          onSlideChange={(s) => setCurrentSlide(s.activeIndex)}
          className="ot-hero-swiper"
        >
          {heroSlides.map((slide, i) => (
            <SwiperSlide key={i} className="ot-hero-slide">
              {/* BG Image */}
              <div className="ot-hero-img-wrap">
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="ot-hero-img"
                />
                <div className="ot-hero-overlay" />
              </div>

              {/* Copy */}
              <div className={`ot-hero-copy ${slide.align === "right" ? "ot-hero-copy--right" : ""}`}>
                <AnimatePresence>
                  {currentSlide === i && (
                    <>
                      <motion.span
                        key="badge"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="ot-hero-badge"
                      >
                        {slide.badge}
                      </motion.span>
                      <motion.h1
                        key="title"
                        initial={{ opacity: 0, y: 28 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.65, delay: 0.25 }}
                        className="ot-hero-title"
                      >
                        {slide.title.split("\n").map((line, l) => (
                          <span key={l} style={{ display: "block" }}>{line}</span>
                        ))}
                      </motion.h1>
                      <motion.button
                        key="cta"
                        initial={{ opacity: 0, y: 18 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.6, delay: 0.45 }}
                        onClick={() => onShopCategory(slide.category, slide.query)}
                        className="ot-hero-btn"
                      >
                        {slide.cta}
                        <IoArrowForwardOutline />
                      </motion.button>
                    </>
                  )}
                </AnimatePresence>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Hero controls */}
        <div className="ot-hero-controls">
          <button
            className="ot-hero-arrow ot-hero-arrow--prev"
            onClick={() => {
              const s = document.querySelector(".ot-hero-swiper") as any;
              s?.swiper?.slidePrev();
            }}
          >
            <IoArrowBackOutline />
          </button>
          <div className="ot-hero-pagination" />
          <button
            className="ot-hero-arrow ot-hero-arrow--next"
            onClick={() => {
              const s = document.querySelector(".ot-hero-swiper") as any;
              s?.swiper?.slideNext();
            }}
          >
            <IoArrowForwardOutline />
          </button>
        </div>
      </section>

      {/* ── CATEGORY TILES (Horizontal scroll) ── */}
      <section className="ot-categories-section">
        <div className="ot-section-header">
          <h2 className="ot-section-heading">Shop by Category</h2>
          <div className="ot-scroll-arrows">
            <button className="ot-scroll-arrow" onClick={() => scrollCategories("left")}>
              <IoArrowBackOutline />
            </button>
            <button className="ot-scroll-arrow" onClick={() => scrollCategories("right")}>
              <IoChevronForwardOutline />
            </button>
          </div>
        </div>
        <div className="ot-categories-track" ref={categoryScrollRef}>
          {categoryTiles.map((tile, i) => (
            <RevealBlock key={i} delay={i * 0.07}>
              <button
                onClick={() => onShopCategory(tile.categoryId, tile.query)}
                className="ot-category-tile group"
              >
                <div className="ot-category-img-wrap">
                  <img
                    src={tile.image}
                    alt={tile.title}
                    className="ot-category-img"
                  />
                  {tile.saleTag && (
                    <span className="ot-category-sale-tag">SALE</span>
                  )}
                </div>
                <div className="ot-category-label">
                  <span className="ot-category-name">{tile.title}</span>
                  <span className="ot-category-sub">{tile.sub}</span>
                </div>
              </button>
            </RevealBlock>
          ))}
        </div>
      </section>

      {/* ── EDITORIAL SPLIT BANNERS ── */}
      <section className="ot-editorial-section">
        {editorialBanners.map((banner, i) => (
          <RevealBlock key={i} delay={i * 0.12} className="ot-editorial-card">
            <button
              onClick={() => onShopCategory(banner.category, banner.query)}
              className="ot-editorial-btn group"
            >
              <div className="ot-editorial-img-wrap">
                <img
                  src={banner.image}
                  alt={banner.title}
                  className="ot-editorial-img"
                />
                <div className="ot-editorial-overlay" />
              </div>
              <div className="ot-editorial-copy">
                <span
                  className="ot-editorial-tag"
                  style={{ color: banner.tagColor }}
                >
                  {banner.tag}
                </span>
                <h3 className="ot-editorial-title">
                  {banner.title.split("\n").map((line, l) => (
                    <span key={l} style={{ display: "block" }}>{line}</span>
                  ))}
                </h3>
                <span className="ot-editorial-sub">{banner.sub}</span>
                <span className="ot-editorial-link group-hover:gap-3">
                  SHOP NOW <IoArrowForwardOutline />
                </span>
              </div>
            </button>
          </RevealBlock>
        ))}
      </section>

      {/* ── PRODUCTS TABS ── */}
      <section className="ot-products-section">
        <div className="ot-products-header">
          <div className="ot-tab-row">
            {[
              { id: "new", label: "NEW ARRIVALS" },
              { id: "women", label: "WOMEN" },
              { id: "men", label: "MEN" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`ot-tab ${activeTab === tab.id ? "ot-tab--active" : ""}`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <motion.span
                    layoutId="ot-tab-line"
                    className="ot-tab-line"
                  />
                )}
              </button>
            ))}
          </div>
          <button
            onClick={() => onShopCategory("all")}
            className="ot-view-all-link"
          >
            View All <IoArrowForwardOutline />
          </button>
        </div>

        {/* Product grid — horizontal scroll on mobile, 4-col on desktop */}
        <div className="ot-product-scroll">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="ot-product-scroll-inner"
            >
              {activeProducts.map((product, index) => (
                <div key={product.id} className="ot-product-tile">
                  <ProductCard
                    product={product}
                    index={index}
                    liked={wishlist.includes(product.id)}
                    pickedSize={selectedSize[product.id]}
                    onPickSize={onPickSize}
                    onToggleWishlist={onToggleWishlist}
                    onAddToCart={onAddToCart}
                    onOpenProduct={onOpenProduct}
                  />
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* ── BRAND STRIP ── */}
      <RevealBlock>
        <section className="ot-brand-strip">
          <div className="ot-brand-strip-inner">
            <h2 className="ot-brand-strip-title">AYLEEN × STYLE × QUALITY × TRUST × AYLEEN × STYLE × QUALITY × TRUST ×</h2>
          </div>
        </section>
      </RevealBlock>

      {/* ── LOOKBOOK GRID ── */}
      <section className="ot-lookbook-section">
        <RevealBlock>
          <div className="ot-lookbook-header">
            <h2 className="ot-section-heading">#AYLEENStyle</h2>
            <p className="ot-lookbook-sub">Tag us on Instagram to be featured</p>
          </div>
        </RevealBlock>
        <div className="ot-lookbook-grid">
          {lookbookImages.map((src, i) => (
            <RevealBlock key={i} delay={i * 0.06} className="ot-lookbook-item group">
              <img
                src={src}
                alt={`Look ${i + 1}`}
                className="ot-lookbook-img"
              />
              <div className="ot-lookbook-hover">
                <IoLogoInstagram size={28} />
              </div>
            </RevealBlock>
          ))}
        </div>
      </section>

      {/* ── SERVICE STRIP ── */}
      <RevealBlock>
        <section className="ot-service-strip">
          {[
            { icon: "🚚", title: "FREE DELIVERY", sub: "On orders above Rs. 3000" },
            { icon: "↩", title: "EASY RETURNS", sub: "Within 7 days of delivery" },
            { icon: "🔒", title: "SECURE PAYMENTS", sub: "100% safe & encrypted" },
            { icon: "📞", title: "24/7 SUPPORT", sub: "Always here to help you" },
          ].map((s, i) => (
            <div key={i} className="ot-service-item">
              <span className="ot-service-icon">{s.icon}</span>
              <div>
                <p className="ot-service-title">{s.title}</p>
                <p className="ot-service-sub">{s.sub}</p>
              </div>
            </div>
          ))}
        </section>
      </RevealBlock>

      {/* ── NEWSLETTER ── */}
      <Newsletter />
    </div>
  );
}
