import { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import axiosClient from "../api/axiosClient";
import { API_ROUTES } from "../api/apiRoutes";
import { mapApiProduct } from "../api/storeApi";
import { APP_ROUTES } from "../routes/appRoutes";
import { navigateToHash } from "../routes/routeUtils";
import { ProductCard } from "../components/ProductCard";
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
  onProductsLoaded: (products: Product[]) => void;
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
  gender?: string;
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
    parent_category?: ParentCategoryData;
    child_categories?: ChildCategoryData[];
    products?: {
      data: Record<string, unknown>[];
      pagination: PaginationData;
    };
    data?: Record<string, unknown>[];
    pagination?: PaginationData;
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

function IconSort() {
  return (
    <svg width="19" height="19" viewBox="0 0 19 19" fill="none" aria-hidden="true">
      <path d="M2.5 4.25h14M2.5 9.5h14M2.5 14.75h14" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" />
      <circle cx="6.25" cy="4.25" r="1.65" fill="white" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="12.75" cy="9.5" r="1.65" fill="white" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="8.75" cy="14.75" r="1.65" fill="white" stroke="currentColor" strokeWidth="1.2" />
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
  onProductsLoaded,
  onQueryChange,
  onSortChange,
  activeQuery,
  activeSortBy,
}: ShopPageProps) {
  const pageRef = useRef<HTMLElement | null>(null);
  const [gridLayout, setGridLayout] = useState<GridLayout>("quad");
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

        const response = await axiosClient.get<CategoryProductsResponse>(
          API_ROUTES.catalog.categoryWithProducts(categoryId),
          {
            params: fetchParams,
            signal: controller.signal,
          },
        );

        const data = response.data;
        if (data.responseCode === 200 && data.payload) {
          const productPayload = data.payload.products;
          const rawProducts = productPayload?.data ?? data.payload.data ?? [];
          const nextChildCategories = data.payload.child_categories || [];
          const childCategoryIds = new Set(
            nextChildCategories.map((child) => String(child.id)),
          );
          const mappedProducts = rawProducts
            .map((raw) => mapApiProduct(raw))
            .filter(
              (product) => {
                const belongsToSelectedParent =
                  product.categoryId === "all" ||
                  product.categoryId === categoryId;
                const belongsToSelectedChild =
                  childCategoryIds.has(product.categoryId) ||
                  (product.subCategoryId !== null &&
                    product.subCategoryId !== undefined &&
                    childCategoryIds.has(String(product.subCategoryId)));

                return belongsToSelectedParent || belongsToSelectedChild;
              },
            );

          setParentCategory(data.payload.parent_category ?? null);
          setChildCategories(nextChildCategories);
          setApiProducts(mappedProducts);
          onProductsLoaded(mappedProducts);
          setPagination(productPayload?.pagination ?? data.payload.pagination ?? null);
          setLastLoadedCategoryId(categoryId);
        } else {
          setPageError(data.message || "Failed to retrieve category products.");
        }
      } catch (err: unknown) {
        if (controller.signal.aborted || axios.isCancel(err)) {
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
  }, [categoryId, subCategoryId, page, retryCount, onProductsLoaded]);

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
      // A child tab must never show direct-parent or sibling products.
      if (subCategoryId && subCategoryId !== "all") {
        const belongsToSelectedSubcategory =
          String(product.subCategoryId ?? "") === subCategoryId ||
          (product.categoryId !== categoryId &&
            product.categoryId === subCategoryId);

        if (!belongsToSelectedSubcategory) {
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
  }, [apiProducts, categoryId, subCategoryId, activeQuery, activeSortBy]);

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

  const selectedCategory = categories.find((category) => category.id === categoryId);
  const collectionTitle = parentCategory?.title || selectedCategory?.name || "Collection";
  const normalizedGender = parentCategory?.gender?.toLowerCase();
  const audienceLabel =
    normalizedGender === "male"
      ? "Men"
      : normalizedGender === "female"
        ? "Women"
        : parentCategory?.gender || "Men";

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
    <section ref={pageRef} className="shop-page shop-page--category">
      <div className="shop-page__shell">
        <header className="shop-catalog-header reveal-up">
          <div className="shop-catalog-topline">
            <nav className="shop-breadcrumb" aria-label="Breadcrumb">
              <span>Home</span>
              <span>/</span>
              <span>{audienceLabel}</span>
              <span>/</span>
              <strong>{collectionTitle}</strong>
            </nav>

            <div className="shop-catalog-tools">
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
                  aria-label="Five column view"
                  aria-pressed={gridLayout === "quad"}
                  className={gridLayout === "quad" ? "is-active" : ""}
                  onClick={() => setGridLayout("quad")}
                >
                  <IconGridQuad />
                </button>
              </div>

              <label className="shop-sort-icon" title="Sort products">
                <span className="sr-only">Sort products</span>
                <select value={activeSortBy} onChange={(event) => handleSortChange(event.target.value)}>
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <IconSort />
              </label>
            </div>
          </div>

          {/* Only subcategories returned for the selected parent category */}
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
        </header>

        {/* loading / error / list states */}
        {pageLoading && apiProducts.length === 0 ? (
          <div className={`shop-product-grid ${gridClass}`} aria-label="Loading products">
            {Array.from({ length: 5 }, (_, index) => (
              <div
                key={index}
                className="shop-product-skeleton animate-shimmer"
              />
            ))}
          </div>
        ) : pageError ? (
          <article className="shop-empty-state reveal-up is-visible">
            <span className="shop-empty-state__eyebrow">Catalog notice</span>
            <h2 className="font-editorial">Products could not be loaded</h2>
            <p>{pageError}</p>
            <button type="button" onClick={() => setRetryCount((count) => count + 1)}>
              Try again
            </button>
          </article>
        ) : displayedProducts.length === 0 ? (
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
                  catalogAudience={audienceLabel}
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
