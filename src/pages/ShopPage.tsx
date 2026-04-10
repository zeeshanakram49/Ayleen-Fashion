import { useEffect, useMemo, useRef } from "react";
import { ProductCard } from "../components/ProductCard";
import type { Category, Product } from "../types/store";

type ShopPageProps = {
  categories: Category[];
  products: Product[];
  activeCategory: string;
  query: string;
  sortBy: string;
  wishlist: string[];
  selectedSize: Record<string, string>;
  onCategoryChange: (category: string) => void;
  onQueryChange: (query: string) => void;
  onSortChange: (sortBy: string) => void;
  onPickSize: (productId: string, size: string) => void;
  onToggleWishlist: (productId: string) => void;
  onAddToCart: (
    productId: string,
    fallbackSize?: string,
    requireSelection?: boolean,
    qty?: number,
  ) => void;
  onOpenProduct: (slug: string) => void;
};

export function ShopPage({
  categories,
  products,
  activeCategory,
  query,
  sortBy,
  wishlist,
  selectedSize,
  onCategoryChange,
  onQueryChange,
  onSortChange,
  onPickSize,
  onToggleWishlist,
  onAddToCart,
  onOpenProduct,
}: ShopPageProps) {
  const pageRef = useRef<HTMLElement | null>(null);
  const collectionCopy = useMemo(() => {
    if (query === "shoes") {
      return {
        title: "Shoes",
        description: "Minimal sneakers, slides, and luxe footwear edits in one clean view.",
      };
    }

    if (query === "bags") {
      return {
        title: "Black Luxury Bags",
        description: "Structured totes, backpacks, and carryalls designed for everyday polish.",
      };
    }

    if (activeCategory === "women") {
      return {
        title: "Woman",
        description: "Soft tailoring, elevated separates, and occasion-ready silhouettes.",
      };
    }

    if (activeCategory === "men") {
      return {
        title: "Man",
        description: "Refined casual layers, premium essentials, and sharp evening tailoring.",
      };
    }

    return {
      title: "All Collections",
      description: "Search, filter, and sort across the full Ayleen storefront.",
    };
  }, [activeCategory, query]);

  useEffect(() => {
    const cards = pageRef.current?.querySelectorAll<HTMLElement>(
      ".product-card.reveal-up, .product-card.reveal-scale",
    );
    if (!cards?.length) return;

    cards.forEach((card, index) => {
      card.style.setProperty("--section-stagger", `${Math.min(index * 70, 420)}ms`);
      card.classList.add("is-visible");
    });
  }, [products]);

  return (
    <section ref={pageRef} className="mx-auto max-w-[1800px] px-6 py-12 md:px-10 md:py-16">
      <div className="reveal-up border-b border-[var(--line)] pb-8">
        <p className="text-xs tracking-[0.3em] text-[var(--gold-deep)]">COLLECTION VIEW</p>
        <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-editorial text-4xl sm:text-5xl">{collectionCopy.title}</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--muted)]">
              {collectionCopy.description}
            </p>
          </div>
          <p className="text-sm text-[var(--muted)]">{products.length} products visible</p>
        </div>
      </div>

      <div className="reveal-up mt-8 grid gap-3 lg:grid-cols-[auto_1fr_auto]">
        <div className="flex flex-wrap gap-2 text-[11px] font-semibold tracking-[0.15em]">
          <button
            type="button"
            onClick={() => onCategoryChange("all")}
            className={`rounded-[0.2rem] border px-5 py-3 ${
              activeCategory === "all"
                ? "border-[var(--ink)] bg-[var(--ink)] text-[var(--paper)]"
                : "border-[var(--line)] bg-white"
            }`}
          >
            FILTER
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => onCategoryChange(cat.id)}
              className={`rounded-[0.2rem] border px-5 py-3 ${
                activeCategory === cat.id
                  ? "border-[var(--ink)] bg-[var(--ink)] text-[var(--paper)]"
                  : "border-[var(--line)] bg-white"
              }`}
            >
              {cat.name.toUpperCase()}
            </button>
          ))}
        </div>

        <input
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Search by product, category, style, or material"
          className="min-w-0 rounded-[0.2rem] border border-[var(--line)] bg-white px-5 py-3 text-sm outline-none"
        />

        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          className="rounded-[0.2rem] border border-[var(--line)] bg-white px-5 py-3 text-sm outline-none"
        >
          <option value="featured">Featured</option>
          <option value="newest">Newest</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
          <option value="rating">Top Rated</option>
        </select>
      </div>

      {products.length === 0 ? (
        <article className="reveal-up is-visible mt-8 rounded-[0.3rem] border border-[var(--line)] bg-[var(--panel)] p-10 text-center">
          <h2 className="font-editorial text-3xl">No products found</h2>
          <p className="mt-3 text-sm text-[var(--muted)]">
            Try changing category, sort, or clearing search.
          </p>
          <button
            type="button"
            onClick={() => {
              onQueryChange("");
              onCategoryChange("all");
              onSortChange("featured");
            }}
            className="mt-5 rounded-full border border-[var(--line-strong)] px-5 py-2 text-xs tracking-[0.18em]"
          >
            RESET FILTERS
          </button>
        </article>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {products.map((product, index) => (
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
              variant="catalog"
            />
          ))}
        </div>
      )}
    </section>
  );
}
