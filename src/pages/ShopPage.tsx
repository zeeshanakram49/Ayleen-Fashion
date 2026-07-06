import { useEffect, useMemo, useRef, useState } from "react";
import { ProductCard } from "../components/ProductCard";
import { money } from "../lib/store";
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
  isLoading?: boolean;
  errorMessage?: string;
  onRetryCatalog?: () => void;
};

const POLO_SUB_TABS = [
  { label: "All", query: "" },
  { label: "Basics", query: "basics" },
  { label: "Textured", query: "textured" },
  { label: "Knit", query: "knit" },
  { label: "Solids", query: "solids" },
] as const;

const TSHIRT_SUB_TABS = [
  { label: "All", query: "" },
  { label: "Basics", query: "basics" },
  { label: "Textured", query: "textured" },
  { label: "Graphics", query: "graphics" },
  { label: "Solids", query: "solids" },
] as const;

const DEFAULT_SUB_TABS = [
  { label: "All", query: "" },
  { label: "Textured", query: "textured" },
  { label: "Polo", query: "polo" },
  { label: "Henley", query: "henley" },
  { label: "Knit", query: "knit" },
  { label: "Sand", query: "sand" },
  { label: "Ice", query: "ice" },
  { label: "Olive", query: "olive" },
] as const;

const sortOptions = [
  { label: "Featured", value: "featured" },
  { label: "Newest Arrivals", value: "newest" },
  { label: "Best Rated", value: "rating" },
  { label: "Price: Low to High", value: "price-low" },
  { label: "Price: High to Low", value: "price-high" },
] as const;

type GridLayout = "single" | "double" | "quad";

function IconGridSingle() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <rect x="3" y="2.75" width="12" height="12.5" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

function IconGridDouble() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <rect x="2.5" y="2.75" width="5.75" height="12.5" stroke="currentColor" strokeWidth="1.4" />
      <rect x="9.75" y="2.75" width="5.75" height="12.5" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

function IconGridQuad() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <rect x="2.5" y="2.5" width="4" height="4" stroke="currentColor" strokeWidth="1.3" />
      <rect x="8" y="2.5" width="4" height="4" stroke="currentColor" strokeWidth="1.3" />
      <rect x="13.5" y="2.5" width="2" height="4" stroke="currentColor" strokeWidth="1.3" />
      <rect x="2.5" y="8" width="4" height="4" stroke="currentColor" strokeWidth="1.3" />
      <rect x="8" y="8" width="4" height="4" stroke="currentColor" strokeWidth="1.3" />
      <rect x="13.5" y="8" width="2" height="4" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  );
}

function IconSearch() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="7" cy="7" r="4.75" stroke="currentColor" strokeWidth="1.35" />
      <path d="M10.5 10.5 14 14" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" />
    </svg>
  );
}

function IconFilter() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path d="M3 5.25H15M5.75 9H12.25M7.75 12.75H10.25" stroke="currentColor" strokeWidth="1.45" strokeLinecap="round" />
    </svg>
  );
}

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
  isLoading = false,
  errorMessage = "",
  onRetryCatalog,
}: ShopPageProps) {
  const pageRef = useRef<HTMLElement | null>(null);
  const [gridLayout, setGridLayout] = useState<GridLayout>("quad");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [activeSubFilter, setActiveSubFilter] = useState("");

  const activeProductType = useMemo(() => {
    const q = query.toLowerCase();
    if (q.includes("polo")) return "polo";
    if (
      q.includes("t-shirt") ||
      q.includes("t shirt") ||
      q.includes("tee") ||
      q.includes("v-neck")
    )
      return "t-shirt";
    return "all";
  }, [query]);

  const [prevQuery, setPrevQuery] = useState(query);
  const [prevCategory, setPrevCategory] = useState(activeCategory);

  if (query !== prevQuery || activeCategory !== prevCategory) {
    setPrevQuery(query);
    setPrevCategory(activeCategory);
    setActiveSubFilter("");
  }

  const subTabs = useMemo(() => {
    if (activeProductType === "polo") return POLO_SUB_TABS;
    if (activeProductType === "t-shirt") return TSHIRT_SUB_TABS;
    return DEFAULT_SUB_TABS;
  }, [activeProductType]);

  const activeCategoryData = useMemo(
    () => categories.find((category) => category.id === activeCategory) ?? null,
    [activeCategory, categories],
  );
  const sortLabel = useMemo(
    () => sortOptions.find((option) => option.value === sortBy)?.label ?? "Featured",
    [sortBy],
  );

  const displayedProducts = useMemo(() => {
    if (!activeSubFilter) return products;
    const cleanFilter = activeSubFilter.toLowerCase();
    return products.filter((product) => {
      return (
        product.title.toLowerCase().includes(cleanFilter) ||
        product.description.toLowerCase().includes(cleanFilter) ||
        product.categoryLabel.toLowerCase().includes(cleanFilter) ||
        product.fit.toLowerCase().includes(cleanFilter) ||
        product.material.toLowerCase().includes(cleanFilter) ||
        product.badge.toLowerCase().includes(cleanFilter) ||
        product.colors.some((color) => color.toLowerCase().includes(cleanFilter)) ||
        product.tags.some((tag) => tag.toLowerCase().includes(cleanFilter))
      );
    });
  }, [products, activeSubFilter]);

  const priceRange = useMemo(() => {
    if (displayedProducts.length === 0) return null;
    const prices = displayedProducts.map((product) => product.price);
    return `${money(Math.min(...prices))} - ${money(Math.max(...prices))}`;
  }, [displayedProducts]);

  const paletteCount = useMemo(() => {
    return new Set(
      displayedProducts.flatMap((product) => product.colors.map((color) => color.toLowerCase())),
    ).size;
  }, [displayedProducts]);

  useEffect(() => {
    const cards = pageRef.current?.querySelectorAll<HTMLElement>(".product-card.reveal-up");
    if (!cards?.length) return;

    cards.forEach((card, index) => {
      card.style.setProperty("--section-stagger", `${Math.min(index * 60, 360)}ms`);
      card.classList.add("is-visible");
    });
  }, [displayedProducts]);

  const gridClass =
    gridLayout === "single"
      ? "shop-product-grid--single"
      : gridLayout === "double"
        ? "shop-product-grid--double"
        : "shop-product-grid--quad";

  const collectionTitle = useMemo(() => {
    if (activeCategoryData) {
      return `${activeCategoryData.name} Knit Edit`;
    }
    if (query) {
      const cleanType =
        activeProductType === "polo"
          ? "Polo"
          : activeProductType === "t-shirt"
            ? "T-Shirt"
            : query;
      const formatted = cleanType.replace(/(^\w|\s\w)/g, (match) => match.toUpperCase());
      return `${formatted} Knit Edit`;
    }
    return "All Collections";
  }, [activeCategoryData, query, activeProductType]);

  const breadcrumbTitle = useMemo(() => {
    if (activeCategoryData) {
      return activeCategoryData.name;
    }
    if (query) {
      const cleanType =
        activeProductType === "polo"
          ? "Polo"
          : activeProductType === "t-shirt"
            ? "T-Shirt"
            : query;
      return cleanType.replace(/(^\w|\s\w)/g, (match) => match.toUpperCase());
    }
    return "All Collections";
  }, [activeCategoryData, query, activeProductType]);

  const hasActiveFilters =
    activeCategory !== "all" ||
    query.trim().length > 0 ||
    sortBy !== "featured" ||
    activeSubFilter !== "";

  return (
    <section ref={pageRef} className="shop-page">
      <div className="shop-page__shell">
        <header className="shop-header reveal-up">
          <div className="shop-header__intro">
            <nav className="shop-breadcrumb" aria-label="Breadcrumb">
              <span>Home</span>
              <span>/</span>
              <span>{activeCategoryData?.name ?? "Collections"}</span>
              <span>/</span>
              <strong>{breadcrumbTitle}</strong>
            </nav>

            <h1 className="shop-header__title">{collectionTitle}</h1>
            <p className="shop-header__description">
              Clean silhouettes, breathable textures, and a refined catalog layout inspired
              by modern retail storefronts.
            </p>
          </div>

          <div className="shop-header__utility">
            <label className="shop-search-inline">
              <span className="shop-search-inline__icon">
                <IconSearch />
              </span>
              <input
                type="search"
                value={query}
                onChange={(event) => onQueryChange(event.target.value)}
                placeholder="Search"
                aria-label="Search products"
              />
            </label>

            <div className="shop-header__meta">
              <span>{displayedProducts.length} Items</span>
              {priceRange && <span>{priceRange}</span>}
              <span>{paletteCount} Colors</span>
            </div>
          </div>
        </header>

        <section className="shop-collection-bar reveal-up" aria-label="Collection controls">
          <nav className="shop-tabs" aria-label="Collection tags">
            {subTabs.map((tab) => {
              const active =
                activeSubFilter === tab.query ||
                (activeSubFilter === "" && tab.query === "");
              return (
                <button
                  key={tab.label}
                  type="button"
                  className={active ? "is-active" : ""}
                  onClick={() => {
                    if (tab.query === "") {
                      setActiveSubFilter("");
                      if (activeProductType === "all") {
                        onQueryChange("");
                      }
                      return;
                    }

                    if (activeProductType === "all") {
                      if (tab.query === "polo" || tab.query === "henley") {
                        onQueryChange(tab.query);
                      } else {
                        setActiveSubFilter(tab.query);
                      }
                    } else {
                      setActiveSubFilter(tab.query);
                    }
                  }}
                >
                  {tab.label}
                </button>
              );
            })}
          </nav>

          <div className="shop-tools">
            <div className="shop-grid-toggle" role="group" aria-label="Grid layout">
              <button
                type="button"
                aria-label="Single column view"
                aria-pressed={gridLayout === "single"}
                className={gridLayout === "single" ? "is-active" : ""}
                onClick={() => setGridLayout("single")}
              >
                <IconGridSingle />
              </button>
              <button
                type="button"
                aria-label="Two column view"
                aria-pressed={gridLayout === "double"}
                className={gridLayout === "double" ? "is-active" : ""}
                onClick={() => setGridLayout("double")}
              >
                <IconGridDouble />
              </button>
              <button
                type="button"
                aria-label="Four column view"
                aria-pressed={gridLayout === "quad"}
                className={gridLayout === "quad" ? "is-active" : ""}
                onClick={() => setGridLayout("quad")}
              >
                <IconGridQuad />
              </button>
            </div>

            <label className="shop-sort-field">
              <span className="sr-only">Sort products</span>
              <select value={sortBy} onChange={(event) => onSortChange(event.target.value)}>
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <button
              type="button"
              aria-expanded={filtersOpen}
              aria-controls="shop-filters-panel"
              className={`shop-filter-toggle${filtersOpen ? " is-active" : ""}`}
              onClick={() => setFiltersOpen((value) => !value)}
            >
              <IconFilter />
            </button>
          </div>
        </section>

        {filtersOpen && (
          <section
            id="shop-filters-panel"
            className="shop-filters reveal-up is-visible"
            aria-label="Shop filters"
          >
            <div className="shop-filter-group">
              <p>Category</p>
              <div className="shop-pill-row">
                <button
                  type="button"
                  className={activeCategory === "all" ? "is-active" : ""}
                  onClick={() => onCategoryChange("all")}
                >
                  All Collections
                </button>
                {categories.map((category) => (
                  <button
                    key={category.id}
                    type="button"
                    className={activeCategory === category.id ? "is-active" : ""}
                    onClick={() => onCategoryChange(category.id)}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="shop-filter-group">
              <p>Sort Preference</p>
              <div className="shop-pill-row">
                {sortOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    className={sortBy === option.value ? "is-active" : ""}
                    onClick={() => onSortChange(option.value)}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </section>
        )}

        <div className="shop-results-strip reveal-up">
          <p>{displayedProducts.length} products available</p>
          <p>Sorted by {sortLabel.toLowerCase()}</p>
        </div>

        {hasActiveFilters && (
          <div className="shop-active-filters reveal-up is-visible" aria-label="Applied filters">
            <span className="shop-active-filters__label">Active</span>
            {activeCategory !== "all" && (
              <button type="button" onClick={() => onCategoryChange("all")}>
                {activeCategoryData?.name ?? activeCategory}
              </button>
            )}
            {query.trim().length > 0 && (
              <button type="button" onClick={() => onQueryChange("")}>
                {query}
              </button>
            )}
            {sortBy !== "featured" && (
              <button type="button" onClick={() => onSortChange("featured")}>
                {sortLabel}
              </button>
            )}
            {activeSubFilter !== "" && (
              <button type="button" onClick={() => setActiveSubFilter("")}>
                {activeSubFilter.charAt(0).toUpperCase() + activeSubFilter.slice(1)}
              </button>
            )}
            <button
              type="button"
              className="shop-active-filters__reset"
              onClick={() => {
                onCategoryChange("all");
                onQueryChange("");
                onSortChange("featured");
                setActiveSubFilter("");
              }}
            >
              Reset
            </button>
          </div>
        )}

        {errorMessage && (
          <article className="shop-empty-state reveal-up is-visible">
            <span className="shop-empty-state__eyebrow">Catalog notice</span>
            <h2 className="font-editorial">Live catalog is unavailable</h2>
            <p>{errorMessage}</p>
            {onRetryCatalog && (
              <button type="button" onClick={onRetryCatalog}>
                Retry catalog
              </button>
            )}
          </article>
        )}

        {isLoading ? (
          <div className={`shop-product-grid ${gridClass}`} aria-label="Loading products">
            {Array.from({ length: 8 }, (_, index) => (
              <div
                key={index}
                className="animate-shimmer min-h-[460px] rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--panel)]"
              />
            ))}
          </div>
        ) : displayedProducts.length === 0 ? (
          <article className="shop-empty-state reveal-up is-visible">
            <span className="shop-empty-state__eyebrow">No match yet</span>
            <h2 className="font-editorial">We could not find products</h2>
            <p>
              {products.length === 0
                ? "Try another keyword or clear the current category and sorting filters."
                : "No products match the selected sub-filter. Try selecting 'All' or a different sub-tab."}
            </p>
            <button
              type="button"
              onClick={() => {
                if (products.length === 0) {
                  onCategoryChange("all");
                  onQueryChange("");
                  onSortChange("featured");
                }
                setActiveSubFilter("");
              }}
            >
              {products.length === 0 ? "Reset filters" : "Reset sub-filter"}
            </button>
          </article>
        ) : (
          <div className={`shop-product-grid ${gridClass}`}>
            {displayedProducts.map((product, index) => (
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
      </div>
    </section>
  );
}
