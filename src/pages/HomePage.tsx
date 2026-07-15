import { useEffect, useMemo, useState } from "react";
import { ImageWithFallback } from "../components/ImageWithFallback";
import { QuickViewModal } from "../components/QuickViewModal";
import { money } from "../lib/store";
import type { Banner, Category, Product, Service, Testimonial } from "../types/store";

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

function productMatchesQuery(product: Product, query: string) {
  const normalizedQuery = query.toLowerCase();

  return (
    product.slug.toLowerCase().includes(normalizedQuery) ||
    product.title.toLowerCase().includes(normalizedQuery) ||
    product.description.toLowerCase().includes(normalizedQuery) ||
    product.tags.some((tag) => tag.toLowerCase().includes(normalizedQuery))
  );
}

export function HomePage({
  categories,
  banners,
  products,
  focusProducts = [],
  mustHavesProducts = [],
  saleEssentialsProducts = [],
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
  const [activeMustHaveProductId, setActiveMustHaveProductId] = useState("");
  const [activeFocusProductId, setActiveFocusProductId] = useState("");
  const [selectedFocusImage, setSelectedFocusImage] = useState<string | null>(null);

  const finalFocusProducts = useMemo(() => {
    return focusProducts.length > 0 ? focusProducts : products.slice(0, 4);
  }, [focusProducts, products]);

  const activeFocusProduct = useMemo(() => {
    return (
      finalFocusProducts.find((p) => p.id === activeFocusProductId) ??
      finalFocusProducts[0] ??
      null
    );
  }, [finalFocusProducts, activeFocusProductId]);

  useEffect(() => {
    setSelectedFocusImage(null);
  }, [activeFocusProduct?.id]);

  const finalMustHavesProducts = useMemo(() => {
    return mustHavesProducts.length > 0 ? mustHavesProducts : products;
  }, [mustHavesProducts, products]);

  const finalSaleEssentialsProducts = useMemo(() => {
    return saleEssentialsProducts.length > 0
      ? saleEssentialsProducts
      : products.filter((product) => product.tags.includes("sale"));
  }, [saleEssentialsProducts, products]);

  const featuredProducts = useMemo(() => products.slice(0, 8), [products]);

  const parentCategories = useMemo(() => {
    return categories.filter((category) => category.isParent === true);
  }, [categories]);

  const focusLinks = useMemo(() => {
    return finalFocusProducts.map((product) => ({
      label: product.title,
      productId: product.id,
    }));
  }, [finalFocusProducts]);

  const mustHaveTabs = useMemo(() => finalMustHavesProducts.slice(0, 4), [finalMustHavesProducts]);

  const heroBanners = useMemo(
    () => banners.filter((banner) => banner.image).slice(0, 6),
    [banners],
  );

  const normalizedHeroSlide = heroBanners.length > 0 ? activeHeroSlide % heroBanners.length : 0;
  const activeHeroBanner = heroBanners[normalizedHeroSlide] ?? null;

  const activeMustHaveProduct =
    mustHaveTabs.find((product) => product.id === activeMustHaveProductId) ??
    mustHaveTabs[0] ??
    null;

  const mustHaveProducts = useMemo(() => {
    if (!activeMustHaveProduct) return products.slice(0, 5);
    const query = activeMustHaveProduct.slug.toLowerCase();

    return products
      .filter((product) => {
        const activeTitleWords = activeMustHaveProduct.title.toLowerCase().split(/\s+/).filter((w) => w.length > 1);
        const matchesType = activeTitleWords.some(
          (word) =>
            product.title.toLowerCase().includes(word) ||
            product.slug.toLowerCase().includes(word) ||
            product.tags.includes(word),
        );
        return matchesType || productMatchesQuery(product, query);
      })
      .slice(0, 5);
  }, [activeMustHaveProduct, products]);

  const saleRailProducts = useMemo(() => {
    const list = finalSaleEssentialsProducts.slice(0, 4);
    return list.length ? list : featuredProducts.slice(0, 4);
  }, [finalSaleEssentialsProducts, featuredProducts]);

  useEffect(() => {
    if (heroBanners.length < 2) return undefined;

    const timer = window.setInterval(() => {
      setActiveHeroSlide((current) => (current + 1) % heroBanners.length);
    }, 5200);

    return () => window.clearInterval(timer);
  }, [heroBanners.length]);

  function renderProductTile(product: Product, index: number) {
    return (
      <article
        key={product.id}
        className="group outfit-product-tile reveal-up is-visible"
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
          {heroBanners.map((banner, index) => (
            <span
              key={banner.id}
              className={`outfit-hero-slide ${index === normalizedHeroSlide ? "is-active" : ""
                }`}
              aria-hidden={index !== normalizedHeroSlide}
            >
              <ImageWithFallback
                src={banner.image}
                alt=""
                className="outfit-hero-image"
              />
            </span>
          ))}
          <span className="outfit-hero-scrim" />
          {activeHeroBanner ? (
            <button
              type="button"
              className="outfit-hero-copy"
              onClick={() => onShopCategory("all")}
            >
              <small>Featured Banner</small>
              <span>{activeHeroBanner.title}</span>
              {activeHeroBanner.description && <p>{activeHeroBanner.description}</p>}
              <strong>Shop now</strong>
            </button>
          ) : (
            <div className="outfit-hero-copy">
              <small>Live Banners</small>
              <span>Loading Slider</span>
              <p>Banners from the API will appear here.</p>
            </div>
          )}
        </div>

        {heroBanners.length > 1 && (
          <div className="outfit-hero-dots" aria-label="Hero slider controls">
            {heroBanners.map((banner, index) => (
              <button
                key={banner.id}
                type="button"
                onClick={() => setActiveHeroSlide(index)}
                className={index === normalizedHeroSlide ? "is-active" : ""}
                aria-label={`Show ${banner.title}`}
              />
            ))}
          </div>
        )}

      </section>

      <section className="outfit-home-category-strip">
        <div className="outfit-home-category-scroll">
          {parentCategories.map((category, index) => (
            <button
              key={category.id}
              type="button"
              onClick={() => onShopCategory(category.id)}
              className="outfit-category-tile reveal-up"
              style={{ animationDelay: `${90 + index * 70}ms` }}
            >
              <ImageWithFallback src={category.image} alt={category.name} />
              <span>{category.name}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="outfit-focus-section">
        <div className="outfit-focus-image reveal-up">
          <ImageWithFallback
            src={selectedFocusImage ?? activeFocusProduct?.image}
            alt={activeFocusProduct?.title ?? "Featured product"}
          />
        </div>
        <div className="outfit-focus-content">
          <div className="outfit-focus-copy reveal-up">
            <h2>Categories in Focus</h2>
            <nav aria-label="Categories in focus">
              {focusLinks.map((link) => (
                <button
                  key={link.productId}
                  type="button"
                  onClick={() => setActiveFocusProductId(link.productId)}
                  className={link.productId === activeFocusProduct?.id ? "is-active" : ""}
                >
                  {link.label}
                </button>
              ))}
            </nav>
          </div>
          <div className="outfit-focus-products">
            {activeFocusProduct?.gallery.map((img, index) => {
              const isActive = selectedFocusImage === img || (!selectedFocusImage && img === activeFocusProduct.image);
              return (
                <article
                  key={`${activeFocusProduct.id}-img-${index}`}
                  className={`group outfit-product-tile focus-gallery-card reveal-up is-visible cursor-pointer ${isActive ? "is-active" : ""}`}
                  style={{ 
                    animationDelay: `${70 + index * 70}ms`,
                  }}
                >
                  <div className="outfit-product-media">
                    <button
                      type="button"
                      onClick={() => setSelectedFocusImage(img)}
                      className="block h-full w-full"
                    >
                      <ImageWithFallback
                        src={img}
                        alt={`${activeFocusProduct.title} view ${index + 1}`}
                        className="outfit-product-image w-full object-cover"
                      />
                    </button>
                  </div>
                </article>
              );
            })}
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
            {mustHaveTabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveMustHaveProductId(tab.id)}
                className={tab.id === activeMustHaveProduct?.id ? "is-active" : ""}
                aria-pressed={tab.id === activeMustHaveProduct?.id}
              >
                {tab.title}
              </button>
            ))}
          </nav>
        </div>
        {mustHaveProducts.length > 0 ? (
          <div className="outfit-must-products" key={activeMustHaveProduct?.id ?? "all"}>
            {mustHaveProducts.map((product, index) => renderProductTile(product, index))}
          </div>
        ) : (
          <div className="outfit-must-empty reveal-up is-visible">
            <p>No products found in this collection.</p>
          </div>
        )}
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
