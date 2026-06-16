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
    label: "Sand Polo",
    categoryId: "men",
    query: "sand",
    image: "/products/product_06_website_square_1600.jpg",
  },
  {
    label: "Ice Henley",
    categoryId: "men",
    query: "ice",
    image: "/products/product_02_website_square_1600.jpg",
  },
  {
    label: "Olive Polo",
    categoryId: "men",
    query: "olive",
    image: "/products/product_04_website_square_1600.jpg",
  },
  {
    label: "Side Edits",
    categoryId: "men",
    query: "easy",
    image: "/products/product_05_website_square_1600.jpg",
  },
] as const;

const focusLinks = [
  { label: "Textured Polos", categoryId: "men", query: "polo" },
  { label: "Knit Henleys", categoryId: "men", query: "henley" },
  { label: "Sale Picks", categoryId: "all", query: "sale" },
] as const;

const mustHaveTabs = [
  { label: "Textured", categoryId: "men", query: "textured" },
  { label: "Polo", categoryId: "men", query: "polo" },
  { label: "Henley", categoryId: "men", query: "henley" },
  { label: "Sale", categoryId: "all", query: "sale" },
] as const;

const heroSlides = [
  {
    kicker: "New Arrival",
    title: "Sand Textured Knit Polo",
    subtitle: "Soft sand knit",
    categoryId: "men",
    query: "sand",
    image: "/products/product_06_website_square_1600.jpg",
  },
  {
    kicker: "New Arrival",
    title: "Ice Textured Knit Henley",
    subtitle: "Cool grey texture",
    categoryId: "men",
    query: "ice",
    image: "/products/product_02_website_square_1600.jpg",
  },
  {
    kicker: "Sale Edit",
    title: "Olive Textured Knit Polo",
    subtitle: "Deep olive finish",
    categoryId: "men",
    query: "olive",
    image: "/products/product_04_website_square_1600.jpg",
  },
  {
    kicker: "Detail View",
    title: "Sand Knit Polo Side Edit",
    subtitle: "Easy everyday fit",
    categoryId: "men",
    query: "sand",
    image: "/products/product_01_website_square_1600.jpg",
  },
  {
    kicker: "Fresh Drop",
    title: "Ice Knit Henley Side Edit",
    subtitle: "Airy knit profile",
    categoryId: "men",
    query: "henley",
    image: "/products/product_03_website_square_1600.jpg",
  },
  {
    kicker: "Selected Stock",
    title: "Olive Knit Polo Side Edit",
    subtitle: "Relaxed textured drape",
    categoryId: "men",
    query: "olive",
    image: "/products/product_05_website_square_1600.jpg",
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
  const saleProducts = products
    .filter((product) => product.tags.includes("sale"))
    .slice(0, 4);
  const featuredProducts = products.slice(0, 8);
  const focusProducts = products
    .filter((product) => product.categoryId === "men" || product.tags.includes("shirt"))
    .slice(0, 4);
  const mustHaveProducts = newInProducts.length >= 5 ? newInProducts : featuredProducts.slice(0, 5);
  const saleRailProducts = saleProducts.length ? saleProducts : featuredProducts.slice(0, 4);
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
            <small>{activeSlide.kicker}</small>
            <span>{activeSlide.title}</span>
            <p>{activeSlide.subtitle}</p>
            <strong>Shop now</strong>
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

      <section className="outfit-home-category-strip">
        <div className="outfit-home-category-scroll">
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

      <section className="outfit-focus-section">
        <div className="outfit-focus-image reveal-up">
          <img
            src="/products/product_03_website_square_1600.jpg"
            alt="Textured knit polo feature"
          />
        </div>
        <div className="outfit-focus-content">
          <div className="outfit-focus-copy reveal-up">
            <h2>Categories in Focus</h2>
            <nav aria-label="Categories in focus">
              {focusLinks.map((link, index) => (
                <button
                  key={link.label}
                  type="button"
                  onClick={() => onShopCategory(link.categoryId, link.query)}
                  className={index === 0 ? "is-active" : ""}
                >
                  {link.label}
                </button>
              ))}
            </nav>
          </div>
          <div className="outfit-focus-products">
            {focusProducts.map((product, index) => renderProductTile(product, index))}
          </div>
        </div>
      </section>

      <section className="outfit-must-section">
        <div className="outfit-must-copy reveal-up">
          <h2>Must-Haves</h2>
          <p>
            Thoughtfully designed everyday styles that combine comfort,
            versatility, and effortless appeal. Reliable go-to pieces made to fit
            seamlessly into your daily wardrobe.
          </p>
          <nav aria-label="Must-have categories">
            {mustHaveTabs.map((tab, index) => (
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
        </div>
        <div className="outfit-must-products">
          {mustHaveProducts.map((product, index) => renderProductTile(product, index))}
        </div>
      </section>

      <section className="outfit-sale-rail">
        <div className="outfit-split-heading reveal-up">
          <div>
            <p>Selected Stock</p>
            <h2>Sale essentials</h2>
          </div>
          <button type="button" onClick={() => onShopCategory("all", "sale")}>
            View all
          </button>
        </div>

        <div className="outfit-product-row">
          {saleRailProducts.map((product, index) => renderProductTile(product, index))}
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
