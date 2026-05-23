import { useEffect, useState } from "react";
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

const categoryTiles = [
  {
    label: "New In",
    categoryId: "all",
    query: "new-in",
    image:
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1300&auto=format&fit=crop",
  },
  {
    label: "Women",
    categoryId: "women",
    query: "",
    image:
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=1300&auto=format&fit=crop",
  },
  {
    label: "Men",
    categoryId: "men",
    query: "",
    image:
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=1300&auto=format&fit=crop",
  },
  {
    label: "Shoes",
    categoryId: "accessories",
    query: "shoes",
    image:
      "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?q=80&w=1300&auto=format&fit=crop",
  },
  {
    label: "Bags",
    categoryId: "accessories",
    query: "bags",
    image:
      "https://images.unsplash.com/photo-1591561954557-26941169b49e?q=80&w=1300&auto=format&fit=crop",
  },
] as const;

const collectionBlocks = [
  {
    title: "Pause",
    subtitle: "soft volume, everyday denim, clean layers",
    categoryId: "women",
    query: "",
    image:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1600&auto=format&fit=crop",
  },
  {
    title: "Artisanal Collection",
    subtitle: "crafted shirts, textured cotton, summer neutrals",
    categoryId: "men",
    query: "shirt",
    image:
      "https://images.unsplash.com/photo-1516826957135-700dedea698c?q=80&w=1600&auto=format&fit=crop",
  },
  {
    title: "Summer Shirts Edit",
    subtitle: "breathable cuts made for city heat",
    categoryId: "all",
    query: "shirt",
    image:
      "https://images.unsplash.com/photo-1603252109303-2751441dd157?q=80&w=1600&auto=format&fit=crop",
  },
] as const;

const shopPills = [
  { label: "View All", categoryId: "all", query: "" },
  { label: "T-Shirts", categoryId: "all", query: "shirt" },
  { label: "Dresses", categoryId: "women", query: "abaya" },
  { label: "Denim", categoryId: "juniors", query: "denim" },
  { label: "Footwear", categoryId: "accessories", query: "shoes" },
  { label: "Accessories", categoryId: "accessories", query: "bags" },
] as const;

const wardrobeTabs = [
  { label: "T-Shirts", categoryId: "all", query: "shirt" },
  { label: "Denim", categoryId: "juniors", query: "denim" },
  { label: "Footwear", categoryId: "accessories", query: "shoes" },
  { label: "Trousers", categoryId: "men", query: "trouser" },
  { label: "Bags", categoryId: "accessories", query: "bags" },
] as const;

const heroSlides = [
  {
    title: "Pause",
    categoryId: "men",
    query: "",
    image:
      "https://images.unsplash.com/photo-1516826957135-700dedea698c?q=80&w=2200&auto=format&fit=crop",
  },
  {
    title: "Maytime",
    categoryId: "women",
    query: "",
    image:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2200&auto=format&fit=crop",
  },
  {
    title: "Shoes",
    categoryId: "men",
    query: "shirt",
    image:
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=2200&auto=format&fit=crop",
  },
  {
    title: "Banana Road",
    categoryId: "juniors",
    query: "denim",
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=2200&auto=format&fit=crop",
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
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [activeHeroSlide, setActiveHeroSlide] = useState(0);

  const newInProducts = products
    .filter((product) => product.tags.includes("new-in"))
    .slice(0, 5);
  const denimProducts = products
    .filter((product) =>
      [product.title, product.description, product.material, ...product.tags]
        .join(" ")
        .toLowerCase()
        .includes("denim"),
    )
    .slice(0, 4);
  const featuredProducts = products.slice(0, 8);
  const railProducts = newInProducts.length >= 4 ? newInProducts : featuredProducts;
  const storyProducts = denimProducts.length ? denimProducts : featuredProducts.slice(0, 4);
  const wardrobeProducts = featuredProducts.slice(0, 5);
  const activeSlide = heroSlides[activeHeroSlide];

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveHeroSlide((current) => (current + 1) % heroSlides.length);
    }, 5200);

    return () => window.clearInterval(timer);
  }, []);

  function renderProductTile(product: Product, index: number) {
    return (
      <article
        key={product.id}
        className="group outfit-product-tile reveal-up"
        style={{ animationDelay: `${70 + index * 70}ms` }}
      >
        <div className="outfit-product-media">
          <button
            type="button"
            onClick={() => onOpenProduct(product.slug)}
            className="block h-full w-full"
          >
            <ImageWithFallback
              src={product.image}
              alt={product.title}
              className="outfit-product-image w-full object-cover"
            />
          </button>

          <button
            type="button"
            onClick={() => onToggleWishlist(product.id)}
            className="outfit-heart-button"
            aria-label={
              wishlist.includes(product.id)
                ? `Remove ${product.title} from wishlist`
                : `Save ${product.title} to wishlist`
            }
          >
            {wishlist.includes(product.id) ? "♥" : "♡"}
          </button>

          <button
            type="button"
            onClick={() => setQuickViewProduct(product)}
            className="outfit-quick-button"
          >
            Quick view
          </button>
        </div>

        <div className="outfit-product-info">
          <button
            type="button"
            onClick={() => onOpenProduct(product.slug)}
            className="outfit-product-name"
          >
            {product.title}
          </button>
          <span>
            {product.fit} | {product.categoryLabel}
          </span>
          <p>{money(product.price).replace("PKR ", "Rs. ")}</p>
        </div>
      </article>
    );
  }

  return (
    <>
      <section className="outfit-hero">
        <div
          className="outfit-hero-slide-button"
        >
          {heroSlides.map((slide, index) => (
            <span
              key={slide.title}
              className={`outfit-hero-slide ${
                index === activeHeroSlide ? "is-active" : ""
              }`}
              aria-hidden={index !== activeHeroSlide}
            >
              <ImageWithFallback
                src={slide.image}
                alt=""
                className="outfit-hero-image"
              />
            </span>
          ))}
          <span className="outfit-hero-scrim" />
          <button
            type="button"
            className="outfit-hero-copy"
            onClick={() => onShopCategory(activeSlide.categoryId, activeSlide.query)}
          >
            <span>{activeSlide.title}</span>
          </button>
        </div>

        <div className="outfit-hero-dots" aria-label="Hero slider controls">
          {heroSlides.map((slide, index) => (
            <button
              key={slide.title}
              type="button"
              onClick={() => setActiveHeroSlide(index)}
              className={index === activeHeroSlide ? "is-active" : ""}
              aria-label={`Show ${slide.title}`}
            />
          ))}
        </div>

      </section>

      <section className="outfit-wardrobe-section">
        <div className="outfit-wardrobe-head reveal-up">
          <div>
            <p>AYLEEN</p>
            <h2>Wardrobe</h2>
          </div>

          <div className="outfit-wardrobe-tools">
            <a href="#/shop" aria-label="Search products">
              Search
            </a>
            <a href="#/account" aria-label="Open account">
              Account
            </a>
          </div>
        </div>

        <nav className="outfit-wardrobe-tabs reveal-up" aria-label="Featured wardrobe categories">
          {wardrobeTabs.map((tab, index) => (
            <button
              key={tab.label}
              type="button"
              onClick={() => onShopCategory(tab.categoryId, tab.query)}
              className={index === 0 ? "is-active" : ""}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        <div className="outfit-product-row outfit-wardrobe-row">
          {wardrobeProducts.map((product, index) => renderProductTile(product, index))}
        </div>
      </section>

      <section className="outfit-category-section">
        <div className="outfit-section-heading reveal-up">
          <p>Shop by Categories</p>
          <h2>Fresh fits, fast picks</h2>
        </div>

        <div className="outfit-pill-row reveal-up">
          {shopPills.map((pill) => (
            <button
              key={pill.label}
              type="button"
              onClick={() => onShopCategory(pill.categoryId, pill.query)}
            >
              {pill.label}
            </button>
          ))}
        </div>

        <div className="outfit-category-grid">
          {categoryTiles.map((category, index) => (
            <button
              key={category.label}
              type="button"
              onClick={() => onShopCategory(category.categoryId, category.query)}
              className="outfit-category-tile reveal-up"
              style={{ animationDelay: `${90 + index * 70}ms` }}
            >
              <img src={category.image} alt={category.label} />
              <span>{category.label}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="outfit-product-section">
        <div className="outfit-split-heading reveal-up">
          <div>
            <p>New In</p>
            <h2>Just landed</h2>
          </div>
          <button type="button" onClick={() => onShopCategory("all", "new-in")}>
            View all
          </button>
        </div>

        <div className="outfit-product-row">
          {railProducts.map((product, index) => renderProductTile(product, index))}
        </div>
      </section>

      <section className="outfit-collection-section">
        <div className="outfit-section-heading reveal-up">
          <p>Shop by Collection</p>
          <h2>Campaign edits</h2>
        </div>

        <div className="outfit-collection-grid">
          {collectionBlocks.map((collection, index) => (
            <button
              key={collection.title}
              type="button"
              onClick={() =>
                onShopCategory(collection.categoryId, collection.query)
              }
              className="outfit-collection-card reveal-up"
              style={{ animationDelay: `${80 + index * 80}ms` }}
            >
              <img src={collection.image} alt={collection.title} />
              <span className="outfit-collection-label">
                <strong>{collection.title}</strong>
                <small>{collection.subtitle}</small>
              </span>
            </button>
          ))}
        </div>
      </section>

      <section className="outfit-denim-story">
        <div className="outfit-denim-copy reveal-up">
          <p>Denim Studio</p>
          <h2>We know what makes denim, denim.</h2>
          <span>
            Crafted for everyday wear with clean washes, relaxed movement, and
            pieces that hold their shape.
          </span>
          <button type="button" onClick={() => onShopCategory("juniors", "denim")}>
            Shop denim
          </button>
        </div>
        <div className="outfit-denim-grid">
          {storyProducts.map((product, index) => renderProductTile(product, index))}
        </div>
      </section>

      <section className="outfit-service-strip">
        {services.map((service, index) => (
          <article
            key={service.title}
            className="reveal-up"
            style={{ animationDelay: `${70 * index}ms` }}
          >
            <h3>{service.title}</h3>
            <p>{service.detail}</p>
          </article>
        ))}
      </section>

      <section className="outfit-notes-section">
        <div className="outfit-section-heading reveal-up">
          <p>Customer Notes</p>
          <h2>What shoppers say</h2>
        </div>
        <div className="outfit-notes-grid">
          {testimonials.map((item, index) => (
            <article
              key={item.name}
              className="reveal-up"
              style={{ animationDelay: `${80 + index * 80}ms` }}
            >
              <p>"{item.quote}"</p>
              <span>
                {item.name} / {item.city}
              </span>
            </article>
          ))}
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
