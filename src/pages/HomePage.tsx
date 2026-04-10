import { useState } from "react";
import { ImageWithFallback } from "../components/ImageWithFallback";
import { QuickViewModal } from "../components/QuickViewModal";
import { money } from "../lib/store";
import type { Product, Service, Testimonial } from "../types/store";

type HomePageProps = {
  products: Product[];
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

const heroVideos = [
  "https://cdn.shopify.com/videos/c/o/v/e3b8907c018f4e4dbfe20a1fffc010b4.mp4",
  "https://cdn.shopify.com/videos/c/o/v/5dc415c78c4d4f39a6fe66a7d89f5cb8.mp4",
];

const collectionSections = [
  {
    key: "women",
    title: "WOMAN",
    eyebrow: "SUMMER STORIES",
    banner:
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=2000&auto=format&fit=crop",
    categoryId: "women",
    query: "",
  },
  {
    key: "men",
    title: "MAN",
    eyebrow: "SIGNATURE LOOKS",
    banner: "/founder-outdoor.jpg",
    categoryId: "men",
    query: "",
  },
  {
    key: "shoes",
    title: "SHOES",
    eyebrow: "WEARING NOW",
    banner:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=2000&auto=format&fit=crop",
    categoryId: "accessories",
    query: "shoes",
  },
  {
    key: "bags",
    title: "BLACK LUXURY BAGS",
    eyebrow: "EVERYDAY CARRY",
    banner:
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=2000&auto=format&fit=crop",
    categoryId: "accessories",
    query: "bags",
  },
] as const;

export function HomePage({
  products,
  services,
  testimonials,
  wishlist,
  selectedSize,
  onPickSize,
  onToggleWishlist,
  onAddToCart,
  onOpenProduct,
  onShopCategory,
}: HomePageProps) {
  const [muted, setMuted] = useState(true);
  const [heroVideoIndex, setHeroVideoIndex] = useState(0);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  const sectionProducts: Record<string, Product[]> = {
    women: products.filter((product) => product.categoryId === "women").slice(0, 4),
    men: products.filter((product) => product.categoryId === "men").slice(0, 4),
    shoes: products.filter((product) => product.tags.includes("shoes")).slice(0, 4),
    bags: products.filter((product) => product.tags.includes("bags")).slice(0, 4),
  };

  function renderRail(items: Product[]) {
    return items.map((product, index) => (
      <article
        key={product.id}
        className="home-rail-card reveal-up"
        style={{ animationDelay: `${70 + index * 80}ms` }}
      >
        <div className="group relative overflow-hidden bg-[#f6f1ea]">
          <button
            type="button"
            onClick={() => onOpenProduct(product.slug)}
            className="block w-full"
          >
            <ImageWithFallback
              src={product.image}
              alt={product.title}
              className="home-rail-image w-full object-cover"
            />
          </button>

          <button
            type="button"
            onClick={() => onToggleWishlist(product.id)}
            className="home-wishlist-btn"
          >
            {wishlist.includes(product.id) ? "♥" : "♡"}
          </button>

          <button
            type="button"
            onClick={() => setQuickViewProduct(product)}
            className="home-quick-view"
          >
            Quick view
          </button>
        </div>

        <div className="px-2 pb-1 pt-4 text-center">
          <button
            type="button"
            onClick={() => onOpenProduct(product.slug)}
            className="home-rail-title"
          >
            {product.title}
          </button>
          <p className="mt-2 text-[0.92rem] text-[var(--ink)]/80">
            {money(product.price).replace("PKR ", "Rs. ")}
          </p>
        </div>
      </article>
    ));
  }

  return (
    <>
      <section className="border-b border-[var(--line)] bg-white">
        <div className="lama-hero relative overflow-hidden">
          <video
            className="lama-hero-video"
            key={heroVideos[heroVideoIndex]}
            src={heroVideos[heroVideoIndex]}
            autoPlay
            loop
            playsInline
            muted={muted}
            preload="auto"
            poster="/founder-formal.jpg"
            onError={() => {
              setHeroVideoIndex((current) =>
                current < heroVideos.length - 1 ? current + 1 : current,
              );
            }}
          />
          <div className="lama-hero-overlay" />

          <button
            type="button"
            onClick={() => setMuted((prev) => !prev)}
            className="lama-sound-btn"
          >
            {muted ? "Sound Off" : "Sound On"}
          </button>

          <div className="lama-hero-copy reveal-scale">
            <h1 className="font-editorial text-4xl font-normal tracking-[0.05em] text-white sm:text-6xl">
              MODERN LINES, QUIET LUXURY
            </h1>
            <p className="mt-2 text-lg italic text-white/90 sm:text-2xl">
              premium edits for woman, man, shoes, and bags
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-6">
              <button
                type="button"
                onClick={() => onShopCategory("women")}
                className="lama-hero-link"
              >
                SHOP WOMAN
              </button>
              <button
                type="button"
                onClick={() => onShopCategory("men")}
                className="lama-hero-link"
              >
                SHOP MAN
              </button>
            </div>
          </div>
        </div>
      </section>

      {collectionSections.map((section) => (
        <section
          key={section.key}
          className="mx-auto max-w-[1800px] bg-white px-6 py-10 md:px-10 md:py-14"
        >
          <div className="lama-banner reveal-scale relative overflow-hidden">
            <img
              src={section.banner}
              alt={`${section.title} collection banner`}
              className="h-[42vw] min-h-[320px] max-h-[720px] w-full object-cover"
            />
            <div className="lama-banner-overlay" />
            <div className="lama-banner-copy">
              <p className="mb-4 text-[0.72rem] tracking-[0.38em] text-white/80">
                {section.eyebrow}
              </p>
              <h2 className="font-editorial text-4xl font-normal tracking-[0.08em] text-white sm:text-7xl">
                {section.title}
              </h2>
              <div className="mt-5 flex flex-wrap justify-center gap-8">
                <button
                  type="button"
                  onClick={() => onShopCategory(section.categoryId, section.query)}
                  className="lama-hero-link"
                >
                  {section.title === "BLACK LUXURY BAGS"
                    ? "SHOP BAGS"
                    : `SHOP ${section.title}`}
                </button>
                <button
                  type="button"
                  onClick={() => onShopCategory(section.categoryId, section.query)}
                  className="lama-hero-link"
                >
                  VIEW ALL
                </button>
              </div>
            </div>
          </div>

          <div className="mt-10 text-center">
            <p className="font-editorial text-4xl tracking-[0.05em] text-[var(--ink)]">
              {section.eyebrow}
            </p>
            <button
              type="button"
              onClick={() => onShopCategory(section.categoryId, section.query)}
              className="mt-3 text-[0.88rem] tracking-[0.42em] text-[var(--ink)]"
            >
              VIEW ALL
            </button>
          </div>

          <div className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {renderRail(sectionProducts[section.key])}
          </div>
        </section>
      ))}

      <section className="border-t border-[var(--line)] bg-[var(--paper)]">
        <div className="mx-auto grid max-w-7xl gap-6 px-6 py-14 md:grid-cols-4">
          {services.map((service, index) => (
            <article
              key={service.title}
              className="reveal-up rounded-[1.4rem] border border-[var(--line)] bg-white p-5"
              style={{ animationDelay: `${70 * index}ms` }}
            >
              <p className="text-[0.72rem] tracking-[0.3em] text-[var(--gold-deep)]">
                SERVICE
              </p>
              <h3 className="mt-3 text-base font-medium tracking-[0.08em] text-[var(--ink)]">
                {service.title}
              </h3>
              <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
                {service.detail}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-[var(--ink)] px-6 py-14 text-white">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 text-center">
            <p className="font-editorial text-4xl tracking-[0.05em]">
              CUSTOMER NOTES
            </p>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {testimonials.map((item, index) => (
              <article
                key={item.name}
                className="reveal-up rounded-[1.6rem] border border-white/10 bg-white/5 p-6"
                style={{ animationDelay: `${80 + index * 90}ms` }}
              >
                <p className="text-sm leading-7 text-white/80">"{item.quote}"</p>
                <p className="mt-4 text-[0.75rem] tracking-[0.24em] text-[var(--gold)]">
                  {item.name.toUpperCase()} / {item.city.toUpperCase()}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {quickViewProduct && (
        <QuickViewModal
          product={quickViewProduct}
          liked={wishlist.includes(quickViewProduct.id)}
          pickedSize={selectedSize[quickViewProduct.id]}
          onClose={() => setQuickViewProduct(null)}
          onPickSize={onPickSize}
          onToggleWishlist={onToggleWishlist}
          onAddToCart={onAddToCart}
        />
      )}
    </>
  );
}
