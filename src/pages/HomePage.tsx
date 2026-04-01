import { ProductCard } from '../components/ProductCard';
import type { Category, Product, Service, Testimonial } from '../types/store';

type HomePageProps = {
  categories: Category[];
  featuredProducts: Product[];
  justDroppedProducts: Product[];
  services: Service[];
  testimonials: Testimonial[];
  wishlist: string[];
  onToggleWishlist: (productId: string) => void;
  onAddToCart: (productId: string) => void;
  onOpenProduct: (slug: string) => void;
  onShopCategory: (categoryId: string) => void;
};

export function HomePage({
  categories,
  featuredProducts,
  justDroppedProducts,
  services,
  testimonials,
  wishlist,
  onToggleWishlist,
  onAddToCart,
  onOpenProduct,
  onShopCategory,
}: HomePageProps) {
  return (
    <>
      <section className="hero-cinematic relative overflow-hidden border-b border-[var(--line)]">
        <div className="animate-orb-1 pointer-events-none absolute -left-16 top-0 h-80 w-80 rounded-full bg-[var(--gold)]/25 blur-3xl" />
        <div className="animate-orb-2 pointer-events-none absolute -right-24 bottom-0 h-96 w-96 rounded-full bg-[var(--ink)]/10 blur-3xl" />

        <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 md:py-20 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
          <div className="reveal-up">
            <p className="text-xs font-semibold tracking-[0.35em] text-[var(--gold-deep)]">
              SPRING SUMMER 2026
            </p>
            <h1 className="font-editorial mt-5 max-w-xl text-5xl leading-[0.92] sm:text-6xl lg:text-7xl">
              Live fashion storefront with premium everyday edits.
            </h1>
            <p className="mt-6 max-w-xl text-sm leading-7 text-[var(--muted)] sm:text-base">
              AYLEEN brings an Outfitters-inspired shopping experience with elevated Pakistani styling,
              modern essentials, and occasion wear designed for women, men, juniors, and accessories.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="#/shop"
                className="magnetic-btn rounded-full bg-[var(--ink)] px-7 py-3 text-xs font-semibold tracking-[0.2em] text-[var(--champagne)]"
              >
                SHOP NOW
              </a>
              <a
                href="#/about"
                className="ghost-btn rounded-full border border-[var(--ink)]/70 px-7 py-3 text-xs font-semibold tracking-[0.2em]"
              >
                BRAND STORY
              </a>
            </div>

            <div className="mt-10 grid max-w-xl gap-4 sm:grid-cols-3">
              <div className="soft-panel rounded-2xl border border-[var(--line)] p-4">
                <p className="font-editorial text-3xl">120+</p>
                <p className="mt-1 text-xs tracking-[0.2em] text-[var(--muted)]">STYLES LIVE</p>
              </div>
              <div className="soft-panel rounded-2xl border border-[var(--line)] p-4">
                <p className="font-editorial text-3xl">7 Days</p>
                <p className="mt-1 text-xs tracking-[0.2em] text-[var(--muted)]">EASY EXCHANGE</p>
              </div>
              <div className="soft-panel rounded-2xl border border-[var(--line)] p-4">
                <p className="font-editorial text-3xl">24/7</p>
                <p className="mt-1 text-xs tracking-[0.2em] text-[var(--muted)]">ORDER SUPPORT</p>
              </div>
            </div>
          </div>

          <div className="reveal-up delay-2 relative">
            <div className="cinema-frame soft-shadow relative overflow-hidden rounded-[2.4rem] border border-white/70">
              <img
                src="https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1800&auto=format&fit=crop"
                alt="AYLEEN premium collection"
                className="media-zoom h-[560px] w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent" />
              <div className="absolute bottom-0 p-8 text-white">
                <p className="text-xs tracking-[0.35em] text-white/85">AYLEEN SIGNATURE</p>
                <p className="font-editorial mt-2 text-4xl">Luxe Evening Edit</p>
                <p className="mt-2 max-w-sm text-sm text-white/80">
                  Fluid tailoring, statement silhouettes, and polished details for a premium storefront feel.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 md:py-24" id="categories">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold tracking-[0.3em] text-[var(--gold-deep)]">SHOP BY CATEGORY</p>
            <h2 className="font-editorial mt-3 text-4xl sm:text-5xl">Curated For Every Mood</h2>
          </div>
          <a href="#/shop" className="text-xs font-semibold tracking-[0.2em] underline underline-offset-4">
            VIEW ALL
          </a>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {categories.map((category, index) => (
            <button
              key={category.id}
              type="button"
              onClick={() => onShopCategory(category.id)}
              className="group lift-strong shimmer-border reveal-up soft-shadow relative overflow-hidden rounded-[1.8rem] text-left"
              style={{ animationDelay: `${100 + index * 90}ms` }}
            >
              <img src={category.image} alt={category.name} className="media-zoom h-[410px] w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
              <div className="absolute bottom-0 p-6 text-white">
                <p className="text-[10px] tracking-[0.28em] text-white/80">{category.items}+ STYLES</p>
                <h3 className="font-editorial mt-2 text-3xl">{category.name}</h3>
                <p className="mt-2 text-sm text-white/85">{category.subtitle}</p>
              </div>
            </button>
          ))}
        </div>
      </section>

      <section className="border-y border-[var(--line)] bg-[var(--panel)]/80" id="new-in">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-24">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold tracking-[0.3em] text-[var(--gold-deep)]">FRESH ARRIVALS</p>
              <h2 className="font-editorial mt-3 text-4xl sm:text-5xl">Premium New-In Drop</h2>
            </div>
            <a
              href="#/shop"
              className="rounded-full border border-[var(--line-strong)] px-4 py-2 text-[11px] font-semibold tracking-[0.18em]"
            >
              BROWSE SHOP
            </a>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {featuredProducts.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                index={index}
                liked={wishlist.includes(product.id)}
                onToggleWishlist={onToggleWishlist}
                onAddToCart={onAddToCart}
                onOpenProduct={onOpenProduct}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 md:py-24">
        <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <article className="reveal-scale signature-pan rounded-[2rem] border border-[var(--line)] p-8 text-[var(--champagne)] md:p-10">
            <p className="text-xs tracking-[0.3em] text-[var(--gold)]">EDITORIAL SPOTLIGHT</p>
            <h2 className="font-editorial mt-4 max-w-md text-4xl leading-tight sm:text-5xl">
              A store layout built to feel premium, modern, and complete.
            </h2>
            <p className="mt-4 max-w-lg text-sm leading-7 text-[var(--champagne)]/80">
              Strong visuals, clean product discovery, clear checkout steps, and polished category storytelling
              give this storefront a more live-brand experience instead of a demo feel.
            </p>
            <a
              href="#/contact"
              className="mt-7 inline-flex rounded-full border border-white/30 px-6 py-3 text-xs tracking-[0.2em]"
            >
              CONTACT TEAM
            </a>
          </article>

          <div className="grid gap-4 sm:grid-cols-2">
            {justDroppedProducts.map((product, index) => (
              <button
                key={product.id}
                type="button"
                onClick={() => onOpenProduct(product.slug)}
                className="reveal-up group overflow-hidden rounded-[1.8rem] border border-[var(--line)] bg-[var(--panel)] text-left"
                style={{ animationDelay: `${90 * index}ms` }}
              >
                <img src={product.image} alt={product.title} className="media-zoom h-64 w-full object-cover" />
                <div className="p-5">
                  <p className="text-[10px] tracking-[0.24em] text-[var(--gold-deep)]">{product.badge}</p>
                  <h3 className="font-editorial mt-2 text-3xl">{product.title}</h3>
                  <p className="mt-2 text-sm text-[var(--muted)]">{product.description}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 md:py-20">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service, index) => (
            <article
              key={service.title}
              className="service-card reveal-up soft-panel rounded-2xl border border-[var(--line)] px-5 py-6"
              style={{ animationDelay: `${70 + index * 70}ms` }}
            >
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[var(--gold)]/20 text-[var(--gold-deep)]">
                ●
              </span>
              <h3 className="mt-4 font-editorial text-2xl">{service.title}</h3>
              <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{service.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-16 md:pb-24">
        <div className="newsletter-glow reveal-scale soft-shadow overflow-hidden rounded-[2rem] border border-[var(--line)] bg-[var(--ink)] px-6 py-12 text-center text-[var(--champagne)] md:px-14">
          <p className="text-xs tracking-[0.3em] text-[var(--gold)]">CUSTOMER REVIEWS</p>
          <h2 className="font-editorial mx-auto mt-4 max-w-3xl text-4xl leading-tight sm:text-5xl">
            Trusted by style communities across Pakistan.
          </h2>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {testimonials.map((item, index) => (
              <article
                key={item.name}
                className="reveal-up rounded-2xl border border-white/20 bg-white/10 p-5 text-left"
                style={{ animationDelay: `${80 * index}ms` }}
              >
                <p className="text-sm leading-6 text-white/85">"{item.quote}"</p>
                <p className="mt-4 text-xs tracking-[0.2em] text-[var(--gold)]">
                  {item.name} · {item.city}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
