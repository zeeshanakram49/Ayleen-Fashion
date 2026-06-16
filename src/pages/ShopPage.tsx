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

const collectionTabs = [
  { label: "All", query: "" },
  { label: "Textured", query: "textured" },
  { label: "Polo", query: "polo" },
  { label: "Henley", query: "henley" },
  { label: "Knit", query: "knit" },
  { label: "Sand", query: "sand" },
  { label: "Ice", query: "ice" },
  { label: "Olive", query: "olive" },
] as const;

export function ShopPage({
  products,
  activeCategory,
  query,
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
    if (query === "sale") {
      return {
        title: "Sale",
        breadcrumb: ["Home", "Sale"],
        description: "Selected markdowns on textured polos and knit henleys.",
      };
    }

    if (activeCategory === "men") {
      return {
        title: "Men",
        breadcrumb: ["Home", "Men"],
        description: "Textured polos and knit henleys in sand, ice, and olive.",
      };
    }

    return {
      title: "All Collections",
      breadcrumb: ["Home", "All Collections"],
      description: "Search, filter, and sort the current Aylee edit.",
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
    <section ref={pageRef} className="collection-page">
      <div className="collection-topbar reveal-up">
        <div className="collection-breadcrumb">
          {collectionCopy.breadcrumb.map((item, index) => (
            <span key={item}>
              {index > 0 && "/ "}
              <strong className={index === collectionCopy.breadcrumb.length - 1 ? "is-current" : ""}>
                {item}
              </strong>
            </span>
          ))}
        </div>

        <div className="collection-tools" aria-label="Collection display tools">
          <button type="button" aria-label="Single column view" />
          <button type="button" aria-label="Two column view" className="is-active" />
          <button type="button" aria-label="Four column view" />
          <button type="button" aria-label="Filters">
            <span />
          </button>
        </div>
      </div>

      {collectionCopy.description && (
        <p className="collection-description reveal-up">{collectionCopy.description}</p>
      )}

      <nav className="collection-tabs reveal-up" aria-label="Collection filters">
        {collectionTabs.map((tab) => {
          const active = tab.query ? query === tab.query : !query || query === "shirt";
          return (
            <button
              key={tab.label}
              type="button"
              onClick={() => {
                if (activeCategory === "all") onCategoryChange("men");
                onQueryChange(tab.query);
              }}
              className={active ? "is-active" : ""}
            >
              {tab.label}
            </button>
          );
        })}
      </nav>

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
            className="mt-5 rounded-[var(--radius-sm)] border border-[var(--line-strong)] px-5 py-2 text-xs tracking-[0.16em]"
          >
            RESET FILTERS
          </button>
        </article>
      ) : (
        <div className="collection-product-grid">
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
