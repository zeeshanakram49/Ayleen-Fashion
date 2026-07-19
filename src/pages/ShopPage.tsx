import { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import axiosClient from "../api/axiosClient";
import { mapApiProduct, stripHtml } from "../api/storeApi";
import { ENV } from "../config/env";
import { APP_ROUTES } from "../routes/appRoutes";
import { navigateToHash } from "../routes/routeUtils";
import { ProductCard } from "../components/ProductCard";
import { money } from "../lib/store";
import type { Category, Product } from "../types/store";

type ShopPageProps = {
  categories: Category[];
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
  onQueryChange: (query: string) => void;
  onSortChange: (sortBy: string) => void;
  activeQuery: string;
  activeSortBy: string;
};

interface ParentCategoryData {
  id: number;
  title: string;
  slug: string;
  summary: string;
  photo: string[];
  is_parent: string;
  status: string;
}

interface ChildCategoryData {
  id: number;
  title: string;
  slug: string;
  summary: string;
  photo: string[];
  is_parent: string;
  parent_id: string;
  status: string;
}

interface PaginationData {
  total: number;
  count: number;
  per_page: number;
  current_page: number;
  total_pages: number;
}

interface CategoryProductsResponse {
  responseCode: number;
  message: string;
  payload: {
    parent_category: ParentCategoryData;
    child_categories: ChildCategoryData[];
    products: {
      data: Record<string, unknown>[];
      pagination: PaginationData;
    };
  };
}

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
  wishlist,
  selectedSize,
  onPickSize,
  onToggleWishlist,
  onAddToCart,
  onOpenProduct,
  onQueryChange,
  onSortChange,
  activeQuery,
  activeSortBy,
}: ShopPageProps) {
  const pageRef = useRef<HTMLElement | null>(null);
  const [gridLayout, setGridLayout] = useState<GridLayout>("quad");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  // Parse hash search params
  const hash = typeof window !== "undefined" ? window.location.hash : "";
  const params = useMemo(() => {
    const queryIndex = hash.indexOf("?");
    return new URLSearchParams(queryIndex === -1 ? "" : hash.slice(queryIndex + 1));
  }, [hash]);

  const categoryId = params.get("category_id") || "";
  const subCategoryId = params.get("sub_category_id") || "";
  const page = Number(params.get("page")) || 1;
  const urlQuery = params.get("q") || "";
  const urlSort = params.get("sort_by") || "featured";

  // Category and products state
  const [parentCategory, setParentCategory] = useState<ParentCategoryData | null>(null);
  const [childCategories, setChildCategories] = useState<ChildCategoryData[]>([]);
  const [apiProducts, setApiProducts] = useState<Product[]>([]);
  const [pagination, setPagination] = useState<PaginationData | null>(null);
  const [pageLoading, setPageLoading] = useState(false);
  const [pageError, setPageError] = useState("");
  const [lastLoadedCategoryId, setLastLoadedCategoryId] = useState("");

  // Sync route params to App.tsx root state
  useEffect(() => {
    onQueryChange(urlQuery);
  }, [urlQuery, onQueryChange]);

  useEffect(() => {
    onSortChange(urlSort);
  }, [urlSort, onSortChange]);

  // Clear products/pagination when parent category switches to prevent screen flash
  useEffect(() => {
    if (categoryId !== lastLoadedCategoryId) {
      setParentCategory(null);
      setChildCategories([]);
      setApiProducts([]);
      setPagination(null);
    }
  }, [categoryId, lastLoadedCategoryId]);

  // Fetch Category Products from API
  useEffect(() => {
    if (!categoryId) return;

    const controller = new AbortController();

    async function loadCategoryData() {
      setPageLoading(true);
      setPageError("");
      try {
        const fetchParams: Record<string, unknown> = { page };
        if (subCategoryId && subCategoryId !== "all") {
          fetchParams.sub_category_id = subCategoryId;
        }

        const response = await axiosClient.get<CategoryProductsResponse>(`/api/fetch/${categoryId}/products`, {
          params: fetchParams,
          signal: controller.signal,
        });

        const data = response.data;
        if (data.responseCode === 200 && data.payload) {
          setParentCategory(data.payload.parent_category);
          setChildCategories(data.payload.child_categories || []);

          const rawProducts = data.payload.products?.data || [];
          const mapped = rawProducts.map((raw: Record<string, unknown>) => mapApiProduct(raw));
          setApiProducts(mapped);
          setPagination(data.payload.products?.pagination || null);
          setLastLoadedCategoryId(categoryId);
        } else {
          setPageError(data.message || "Failed to retrieve category products.");
        }
      } catch (err: unknown) {
        if (axios.isCancel(err)) {
          return;
        }
        const error = err as { message?: string };
        setPageError(error.message || "Something went wrong while fetching products.");
      } finally {
        if (!controller.signal.aborted) {
          setPageLoading(false);
        }
      }
    }

    void loadCategoryData();

    return () => {
      controller.abort();
    };
  }, [categoryId, subCategoryId, page, retryCount]);

  // Handle URL change updates
  function updateSearchParams(newParams: Record<string, string | null>) {
    const nextParams = new URLSearchParams(params);
    Object.entries(newParams).forEach(([key, val]) => {
      if (val === null) {
        nextParams.delete(key);
      } else {
        nextParams.set(key, val);
      }
    });
    const queryString = nextParams.toString();
    navigateToHash(queryString ? `${APP_ROUTES.shop}?${queryString}` : APP_ROUTES.shop);
  }

  function handleSubCategoryChange(subId: string) {
    updateSearchParams({
      sub_category_id: subId === "all" ? null : subId,
      page: "1", // reset to page 1
    });
  }

  function handlePageChange(newPage: number) {
    updateSearchParams({ page: String(newPage) });
  }

  function handleQueryChange(newQuery: string) {
    updateSearchParams({
      q: newQuery || null,
      page: "1", // reset to page 1
    });
  }

  function handleSortChange(newSort: string) {
    updateSearchParams({
      sort_by: newSort === "featured" ? null : newSort,
      page: "1", // reset to page 1
    });
  }

  // Client-side filtering & sorting on API products (handles search + backup filtering)
  const displayedProducts = useMemo(() => {
    const q = activeQuery.trim().toLowerCase();
    let list = apiProducts.filter((product) => {
      // client-side subcategory fallback filter
      if (subCategoryId && subCategoryId !== "all") {
        if (product.subCategoryId && String(product.subCategoryId) !== subCategoryId) {
          return false;
        }
      }

      return (
        q.length === 0 ||
        product.title.toLowerCase().includes(q) ||
        product.description.toLowerCase().includes(q) ||
        product.categoryLabel.toLowerCase().includes(q) ||
        product.fit.toLowerCase().includes(q) ||
        product.material.toLowerCase().includes(q) ||
        product.badge.toLowerCase().includes(q) ||
        product.colors.some((color) => color.toLowerCase().includes(q)) ||
        product.tags.some((tag) => tag.toLowerCase().includes(q))
      );
    });

    // Client-side sort fallback
    if (activeSortBy === "price-low") {
      list = [...list].sort((a, b) => a.price - b.price);
    } else if (activeSortBy === "price-high") {
      list = [...list].sort((a, b) => b.price - a.price);
    } else if (activeSortBy === "rating") {
      list = [...list].sort((a, b) => b.rating - a.rating);
    } else if (activeSortBy === "newest") {
      list = [...list].reverse();
    }

    return list;
  }, [apiProducts, subCategoryId, activeQuery, activeSortBy]);

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

  // Set stagger animations when products update
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

  // Category Banner construction
  const categoryPhoto = parentCategory?.photo
    ? (Array.isArray(parentCategory.photo) ? parentCategory.photo[0] : parentCategory.photo)
    : "";
  const categoryPhotoUrl = categoryPhoto
    ? (/^(https?:)?\/\//i.test(categoryPhoto) || categoryPhoto.startsWith("data:")
      ? categoryPhoto
      : `${ENV.API_BASE_URL}/${categoryPhoto.startsWith("/") ? categoryPhoto.slice(1) : categoryPhoto}`)
    : "";

  const collectionTitle = parentCategory?.title || "All Collections";
  const categoryDescription = parentCategory?.summary ? stripHtml(parentCategory.summary) : "";

  // Dynamic Product count
  const totalAvailable = !subCategoryId || subCategoryId === "all"
    ? (pagination?.total ?? displayedProducts.length)
    : displayedProducts.length;

  const productCountText = totalAvailable === 1
    ? "1 PRODUCT AVAILABLE"
    : `${totalAvailable} PRODUCTS AVAILABLE`;

  const sortLabel = useMemo(
    () => sortOptions.find((option) => option.value === activeSortBy)?.label ?? "Featured",
    [activeSortBy],
  );

  const hasActiveFilters =
    categoryId !== "" ||
    activeQuery.trim().length > 0 ||
    activeSortBy !== "featured" ||
    subCategoryId !== "";

  // Category Selection fallback screen
  if (!categoryId) {
    return (
      <section className="shop-page">
        <div className="shop-page__shell">
          <header className="shop-header reveal-up">
            <div className="shop-header__intro">
              <h1 className="shop-header__title">Collections</h1>
              <p className="shop-header__description">
                Please select a collection to explore our catalog.
              </p>
            </div>
          </header>

          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 reveal-up mt-8">
            {categories.filter((c) => c.isParent).map((category, index) => (
              <button
                key={category.id}
                type="button"
                onClick={() => {
                  navigateToHash(`${APP_ROUTES.shop}?category_id=${category.id}`);
                }}
                className="group relative overflow-hidden rounded-[var(--radius-lg)] border border-[var(--line)] aspect-[4/3] bg-[var(--panel)] transition-all hover:border-[var(--ink)] cursor-pointer text-left"
                style={{ animationDelay: `${70 + index * 70}ms` }}
              >
                <img
                  src={category.image}
                  alt={category.name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/40 flex items-end p-6">
                  <span className="font-editorial text-2xl text-white uppercase">{category.name}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section ref={pageRef} className="shop-page">
      <div className="shop-page__shell">
        
        {/* Category Photo Banner */}
        {categoryPhotoUrl && (
          <div className="shop-category-banner reveal-up">
            <img
              src={categoryPhotoUrl}
              alt={collectionTitle}
              className="shop-category-banner__image"
            />
            <div className="shop-category-banner__overlay" />
          </div>
        )}

        <header className="shop-header reveal-up">
          <div className="shop-header__intro">
            <nav className="shop-breadcrumb" aria-label="Breadcrumb">
              <span>Home</span>
              <span>/</span>
              <span>Collections</span>
              <span>/</span>
              <strong>{collectionTitle}</strong>
            </nav>

            <h1 className="shop-header__title">{collectionTitle}</h1>
            {categoryDescription && (
              <p className="shop-header__description">{categoryDescription}</p>
            )}
          </div>

          <div className="shop-header__utility">
            <label className="shop-search-inline">
              <span className="shop-search-inline__icon">
                <IconSearch />
              </span>
              <input
                type="search"
                value={activeQuery}
                onChange={(event) => handleQueryChange(event.target.value)}
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

        {/* Dynamic child category tabs */}
        <section className="shop-collection-bar reveal-up" aria-label="Collection controls">
          <nav className="shop-tabs" aria-label="Collection tags">
            <button
              type="button"
              className={!subCategoryId || subCategoryId === "all" ? "is-active" : ""}
              onClick={() => handleSubCategoryChange("all")}
            >
              ALL
            </button>
            {childCategories.map((child) => {
              const active = String(child.id) === subCategoryId;
              return (
                <button
                  key={child.id}
                  type="button"
                  className={active ? "is-active" : ""}
                  onClick={() => handleSubCategoryChange(String(child.id))}
                >
                  {child.title.toUpperCase()}
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
              <select value={activeSortBy} onChange={(event) => handleSortChange(event.target.value)}>
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
                  className={categoryId === "" ? "is-active" : ""}
                  onClick={() => {
                    updateSearchParams({ category_id: null, sub_category_id: null, page: "1" });
                  }}
                >
                  All Collections
                </button>
                {categories.filter(c => c.isParent).map((category) => (
                  <button
                    key={category.id}
                    type="button"
                    className={categoryId === category.id ? "is-active" : ""}
                    onClick={() => {
                      updateSearchParams({ category_id: category.id, sub_category_id: null, page: "1" });
                    }}
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
                    className={activeSortBy === option.value ? "is-active" : ""}
                    onClick={() => handleSortChange(option.value)}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </section>
        )}

        <div className="shop-results-strip reveal-up">
          <p>{productCountText}</p>
          <p>Sorted by {sortLabel.toLowerCase()}</p>
        </div>

        {hasActiveFilters && (
          <div className="shop-active-filters reveal-up is-visible" aria-label="Applied filters">
            <span className="shop-active-filters__label">Active</span>
            {categoryId !== "" && (
              <button
                type="button"
                onClick={() => {
                  updateSearchParams({ category_id: null, sub_category_id: null, page: "1" });
                }}
              >
                {collectionTitle}
              </button>
            )}
            {activeQuery.trim().length > 0 && (
              <button type="button" onClick={() => handleQueryChange("")}>
                {activeQuery}
              </button>
            )}
            {activeSortBy !== "featured" && (
              <button type="button" onClick={() => handleSortChange("featured")}>
                {sortLabel}
              </button>
            )}
            {subCategoryId !== "" && (
              <button type="button" onClick={() => handleSubCategoryChange("all")}>
                {childCategories.find((c) => String(c.id) === subCategoryId)?.title || subCategoryId}
              </button>
            )}
            <button
              type="button"
              className="shop-active-filters__reset"
              onClick={() => {
                updateSearchParams({ category_id: null, sub_category_id: null, page: "1", q: null, sort_by: null });
              }}
            >
              Reset
            </button>
          </div>
        )}

        {pageError && (
          <article className="shop-empty-state reveal-up is-visible">
            <span className="shop-empty-state__eyebrow">Catalog notice</span>
            <h2 className="font-editorial">Live catalog is unavailable</h2>
            <p>{pageError}</p>
            <button type="button" onClick={() => setRetryCount((c) => c + 1)}>
              Retry catalog
            </button>
          </article>
        )}

        {/* loading / error / list states */}
        {pageLoading && !parentCategory ? (
          <div className={`shop-product-grid ${gridClass}`} aria-label="Loading products">
            {Array.from({ length: 8 }, (_, index) => (
              <div
                key={index}
                className="animate-shimmer min-h-[460px] rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--panel)]"
              />
            ))}
          </div>
        ) : !pageError && displayedProducts.length === 0 ? (
          <article className="shop-empty-state reveal-up is-visible">
            <span className="shop-empty-state__eyebrow">No match yet</span>
            <h2 className="font-editorial">We could not find products</h2>
            <p>No products found in this category.</p>
            <button
              type="button"
              onClick={() => {
                handleSubCategoryChange("all");
                handleQueryChange("");
              }}
            >
              Clear subcategory or search
            </button>
          </article>
        ) : (
          <>
            <div className={`shop-product-grid ${gridClass} ${pageLoading ? "opacity-50 pointer-events-none" : ""}`}>
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

            {/* Pagination Controls */}
            {pagination && pagination.total_pages > 1 && (
              <nav className="shop-pagination reveal-up is-visible" aria-label="Pagination">
                <button
                  type="button"
                  className="shop-pagination__arrow"
                  disabled={pagination.current_page === 1}
                  onClick={() => handlePageChange(pagination.current_page - 1)}
                >
                  &larr; Previous
                </button>
                {Array.from({ length: pagination.total_pages }, (_, i) => {
                  const pageNum = i + 1;
                  const active = pageNum === pagination.current_page;
                  return (
                    <button
                      key={pageNum}
                      type="button"
                      className={`shop-pagination__number ${active ? "is-active" : ""}`}
                      onClick={() => handlePageChange(pageNum)}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                <button
                  type="button"
                  className="shop-pagination__arrow"
                  disabled={pagination.current_page === pagination.total_pages}
                  onClick={() => handlePageChange(pagination.current_page + 1)}
                >
                  Next &rarr;
                </button>
              </nav>
            )}
          </>
        )}
      </div>
    </section>
  );
}
