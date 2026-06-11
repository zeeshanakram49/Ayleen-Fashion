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
    label: "T-Shirts",
    categoryId: "men",
    query: "knit",
    image: "/men-knit-grey-front.png",
  },
  {
    label: "Polos",
    categoryId: "men",
    query: "polo",
    image: "/men-knit-khaki-front.png",
  },
  {
    label: "Shirts",
    categoryId: "men",
    query: "shirt",
    image: "/men-knit-charcoal-front.png",
  },
  {
    label: "Knitwear",
    categoryId: "men",
    query: "knit",
    image: "/men-knit-khaki-side.png",
  },
  {
    label: "Henleys",
    categoryId: "men",
    query: "henley",
    image: "/men-knit-grey-side.png",
  },
  {
    label: "Smart Casual",
    categoryId: "men",
    query: "formal",
    image: "/men-knit-charcoal-side.png",
  },
] as const;

const collectionBlocks = [
  {
    title: "Khaki Texture",
    subtitle: "open knit polo, warm neutral, ribbed finish",
    categoryId: "men",
    query: "khaki",
    image: "/men-knit-khaki-side.png",
  },
  {
    title: "Cloud Grey Edit",
    subtitle: "soft henley neckline, airy summer structure",
    categoryId: "men",
    query: "grey",
    image: "/men-knit-grey-side.png",
  },
  {
    title: "Charcoal Polo",
    subtitle: "dark texture, clean collar, evening casual",
    categoryId: "men",
    query: "charcoal",
    image: "/men-knit-charcoal-side.png",
  },
] as const;

const shopPills = [
  { label: "View All", categoryId: "all", query: "" },
  { label: "Knit Polos", categoryId: "men", query: "polo" },
  { label: "Henleys", categoryId: "men", query: "henley" },
  { label: "Denim", categoryId: "juniors", query: "denim" },
  { label: "Accessories", categoryId: "accessories", query: "bags" },
] as const;

const heroSlides = [
  {
    title: "Khaki Front",
    categoryId: "men",
    query: "khaki",
    image: "/men-knit-khaki-front.png",
  },
  {
    title: "Khaki Side",
    categoryId: "men",
    query: "khaki",
    image: "/men-knit-khaki-side.png",
  },
  {
    title: "Grey Front",
    categoryId: "men",
    query: "grey",
    image: "/men-knit-grey-front.png",
  },
  {
    title: "Grey Side",
    categoryId: "men",
    query: "grey",
    image: "/men-knit-grey-side.png",
  },
  {
    title: "Charcoal Front",
    categoryId: "men",
    query: "charcoal",
    image: "/men-knit-charcoal-front.png",
  },
  {
    title: "Charcoal Side",
    categoryId: "men",
    query: "charcoal",
    image: "/men-knit-charcoal-side.png",
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

  const shirtProducts = products
    .filter(
      (product) =>
        product.categoryId === "men" &&
        [product.title, product.description, product.material, ...product.tags]
          .join(" ")
          .toLowerCase()
          .match(/shirt|knit|polo|henley|formal/),
    )
    .slice(0, 8);
  const knitProducts = products
    .filter((product) =>
      product.categoryId === "men" &&
      [product.title, product.description, product.material, ...product.tags]
        .join(" ")
        .toLowerCase()
        .includes("knit"),
    )
    .slice(0, 4);
  const featuredProducts = products
    .filter((product) => product.categoryId === "men")
    .slice(0, 8);
  const railProducts = shirtProducts.length ? shirtProducts : featuredProducts;
  const storyProducts = knitProducts.length ? knitProducts : featuredProducts.slice(0, 4);
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
          <p>{money(product.price).replace("PKR ", "Rs. ")}</p>
        </div>
      </article>
    );
  }

  return (
    <>
      <section className="outfit-hero">
        <button
          type="button"
          className="outfit-hero-slide-button"
          onClick={() => onShopCategory(activeSlide.categoryId, activeSlide.query)}
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
          <span className="outfit-hero-copy">
            <span>{activeSlide.title}</span>
          </span>
        </button>

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

      <section className="outfit-category-section">
        <div className="outfit-section-heading reveal-up">
          <p>Men Categories</p>
          <h2>Categories in focus</h2>
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
            <p>Shirts Outside</p>
            <h2>All men shirts</h2>
          </div>
          <button type="button" onClick={() => onShopCategory("men", "shirt")}>
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
          <p>Knit Studio</p>
          <h2>Texture made for warm days and clean evenings.</h2>
          <span>
            Breathable knit polos and henleys with soft structure, refined
            collars, and colors that style easily.
          </span>
          <button type="button" onClick={() => onShopCategory("men", "knit")}>
            Shop knitwear
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
