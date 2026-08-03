import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  SlidersHorizontal,
  Grid2X2,
  Grid3X3,
  Square,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import axiosClient from "../api/axiosClient";
import { API_ROUTES } from "../api/apiRoutes";
import { mapApiProduct } from "../api/storeApi";
import { APP_ROUTES } from "../routes/appRoutes";
import { getHashUrl } from "../routes/routeUtils";
import { ProductCard } from "../components/ProductCard";
import { ProductGrid } from "../components/ProductGrid";
import { FilterDrawer } from "../components/FilterDrawer";
import { QuickViewModal } from "../components/QuickViewModal";
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
  const [parentCategory, setParentCategory] =
    useState<ParentCategoryData | null>(null);
  const [childCategories, setChildCategories] = useState<ChildCategoryData[]>(
    [],
  );
  const [apiProducts, setApiProducts] = useState<Product[]>([]);
  const [pagination, setPagination] = useState<PaginationData | null>(null);
  const [subCategoryId, setSubCategoryId] = useState<string>("all");
  const [pageLoading, setPageLoading] = useState(true);
  const [pageError, setPageError] = useState("");
  const [retryCount, setRetryCount] = useState(0);
  const [layout, setLayout] = useState<GridLayout>("quad");
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(
    null,
  );

  const [hashVersion, setHashVersion] = useState(0);

  useEffect(() => {
    const handleHashChange = () => setHashVersion((v) => v + 1);
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const parsedHash = useMemo(() => {
    const raw = window.location.hash.replace(/^#/, "");
    if (!raw.startsWith("/shop"))
      return { categoryId: "all", subCategoryId: "all" };
    const queryStr = raw.includes("?") ? raw.split("?")[1] : "";
    const params = new URLSearchParams(queryStr);
    return {
      categoryId: params.get("category") || params.get("category_id") || "all",
      subCategoryId:
        params.get("subcategory") || params.get("sub_category_id") || "all",
    };
  }, [hashVersion]);

  const selectedCategoryId = parsedHash.categoryId;

  useEffect(() => {
    setSubCategoryId(parsedHash.subCategoryId);
  }, [parsedHash.subCategoryId]);

  const activeCategoryObj = useMemo(
    () => categories.find((c) => c.id === selectedCategoryId) ?? null,
    [categories, selectedCategoryId],
  );

  const fetchCategoryData = async (
    catId: string,
    subId: string,
    pageNum = 1,
  ) => {
    setPageLoading(true);
    setPageError("");
    try {
      if (catId === "all" || !catId) {
        const res = await axiosClient.get<{
          responseCode: number;
          message: string;
          payload: {
            data: Record<string, unknown>[];
            pagination: PaginationData;
          };
        }>(API_ROUTES.catalog.products, {
          params: { page: pageNum, per_page: 24 },
        });
        const rawList = res.data.payload?.data || [];
        const mapped = rawList.map(mapApiProduct);
        setApiProducts(mapped);
        setPagination(res.data.payload?.pagination || null);
        setParentCategory(null);
        setChildCategories([]);
        onProductsLoaded(mapped);
      } else {
        const url = API_ROUTES.catalog.categoryWithProducts(catId);
        const params: Record<string, unknown> = { page: pageNum, per_page: 24 };
        if (subId && subId !== "all") params.sub_category_id = subId;

        const res = await axiosClient.get<CategoryProductsResponse>(url, {
          params,
        });
        const payload = res.data.payload || {};
        const rawProducts = payload.products?.data || payload.data || [];
        const mapped = rawProducts.map(mapApiProduct);

        setApiProducts(mapped);
        setPagination(
          payload.products?.pagination || payload.pagination || null,
        );
        if (payload.parent_category) setParentCategory(payload.parent_category);
        if (payload.child_categories)
          setChildCategories(payload.child_categories);
        onProductsLoaded(mapped);
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setPageError(
          err.response?.data?.message ||
            err.message ||
            "Failed to load products",
        );
      } else {
        setPageError("Failed to load products");
      }
    } finally {
      setPageLoading(false);
    }
  };

  useEffect(() => {
    fetchCategoryData(selectedCategoryId, subCategoryId, 1);
  }, [selectedCategoryId, subCategoryId, retryCount]);

  const handleSubCategoryChange = (newSubId: string) => {
    setSubCategoryId(newSubId);
    const raw = window.location.hash.replace(/^#/, "");
    const queryStr = raw.includes("?") ? raw.split("?")[1] : "";
    const params = new URLSearchParams(queryStr);
    if (newSubId && newSubId !== "all") {
      params.set("subcategory", newSubId);
    } else {
      params.delete("subcategory");
    }
    window.location.hash = `/shop?${params.toString()}`;
  };

  const handleQueryChange = (val: string) => {
    onQueryChange(val);
  };

  const handleSortChange = (val: string) => {
    onSortChange(val);
  };

  const handlePageChange = (newPage: number) => {
    fetchCategoryData(selectedCategoryId, subCategoryId, newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const displayedProducts = useMemo(() => {
    let list = [...apiProducts];

    // Strictly filter by selected category if not 'all'
    if (selectedCategoryId && selectedCategoryId !== "all") {
      const targetCat = selectedCategoryId.toLowerCase();
      const filtered = list.filter((p) => {
        const pCat = (p.categoryId || "").toLowerCase();
        const pLabel = (p.categoryLabel || "").toLowerCase();
        const pTitle = (p.title || "").toLowerCase();
        const pTags = (p.tags || []).join(" ").toLowerCase();

        return (
          pCat === targetCat ||
          pLabel === targetCat ||
          pTitle.includes(targetCat) ||
          pTags.includes(targetCat)
        );
      });
      if (filtered.length > 0) {
        list = filtered;
      }
    }

    if (activeQuery.trim()) {
      const q = activeQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.fit.toLowerCase().includes(q) ||
          p.categoryLabel.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q)),
      );
    }
    if (activeSortBy === "price-low") list.sort((a, b) => a.price - b.price);
    else if (activeSortBy === "price-high")
      list.sort((a, b) => b.price - a.price);
    else if (activeSortBy === "rating")
      list.sort((a, b) => b.rating - a.rating);
    return list;
  }, [apiProducts, selectedCategoryId, activeQuery, activeSortBy]);

  const parentTitle =
    parentCategory?.title || activeCategoryObj?.name || "ALL PRODUCTS";
  const visibleChildCategories = childCategories.filter(
    (c) => c.status === "active",
  );

  return (
    <section className="min-h-screen bg-[var(--paper)] py-8 text-[var(--ink)] lg:py-12">
      <div className="mx-auto max-w-[1700px] px-4 sm:px-8">
        {/* Header Title & Breadcrumb */}
        <div className="mb-8 border-b border-[var(--line)] pb-8">
          <div className="mb-2 flex items-center gap-2 text-xs font-semibold tracking-[0.2em] text-[var(--muted)] uppercase">
            <a
              href={getHashUrl(APP_ROUTES.home)}
              className="transition hover:text-[var(--ink)]"
            >
              Home
            </a>
            <span>/</span>
            <span className="text-[var(--ink)]">{parentTitle}</span>
          </div>

          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <h1 className="font-display text-4xl font-black tracking-tight text-[var(--ink)] uppercase sm:text-5xl">
                {parentTitle}
              </h1>
              <p className="mt-2 max-w-xl text-xs text-[var(--muted)]">
                Elevated men&apos;s streetwear and contemporary Pakistani
                apparel crafted for comfort, fit, and style.
              </p>
            </div>

            {/* Desktop Sort & Layout Controls */}
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => setFilterDrawerOpen(true)}
                className="flex items-center gap-2 rounded-full border border-[var(--line-strong)] bg-white px-4 py-2.5 text-xs font-bold tracking-wider text-[var(--ink)] uppercase shadow-sm lg:hidden"
              >
                <SlidersHorizontal size={16} /> Filters &amp; Sort
              </button>

              <div className="hidden items-center gap-2 rounded-xl border border-[var(--line-strong)] bg-white p-1 lg:flex">
                <button
                  type="button"
                  onClick={() => setLayout("single")}
                  className={`rounded-lg p-2 transition ${layout === "single" ? "bg-[var(--ink)] text-white" : "text-[var(--muted)]"}`}
                  aria-label="Single column layout"
                >
                  <Square size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => setLayout("double")}
                  className={`rounded-lg p-2 transition ${layout === "double" ? "bg-[var(--ink)] text-white" : "text-[var(--muted)]"}`}
                  aria-label="Double column layout"
                >
                  <Grid2X2 size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => setLayout("quad")}
                  className={`rounded-lg p-2 transition ${layout === "quad" ? "bg-[var(--ink)] text-white" : "text-[var(--muted)]"}`}
                  aria-label="Four column layout"
                >
                  <Grid3X3 size={16} />
                </button>
              </div>

              <div className="hidden items-center gap-2 lg:flex">
                <span className="text-xs font-bold tracking-wider text-[var(--muted)] uppercase">
                  Sort:
                </span>
                <select
                  value={activeSortBy}
                  onChange={(e) => handleSortChange(e.target.value)}
                  className="cursor-pointer rounded-xl border border-[var(--line-strong)] bg-white px-4 py-2 text-xs font-bold tracking-wider text-[var(--ink)] uppercase outline-none"
                >
                  {sortOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Subcategories Pills */}
          {visibleChildCategories.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2 border-t border-[var(--line)] pt-4">
              <button
                type="button"
                onClick={() => handleSubCategoryChange("all")}
                className={`rounded-full px-4 py-2 text-xs font-bold tracking-wider uppercase transition ${
                  subCategoryId === "all"
                    ? "bg-[var(--ink)] text-white shadow-md"
                    : "border border-[var(--line-strong)] bg-white text-[var(--ink)] hover:border-[var(--ink)]"
                }`}
              >
                All {parentTitle}
              </button>
              {visibleChildCategories.map((child) => (
                <button
                  key={child.id}
                  type="button"
                  onClick={() => handleSubCategoryChange(String(child.id))}
                  className={`rounded-full px-4 py-2 text-xs font-bold tracking-wider uppercase transition ${
                    subCategoryId === String(child.id)
                      ? "bg-[var(--ink)] text-white shadow-md"
                      : "border border-[var(--line-strong)] bg-white text-[var(--ink)] hover:border-[var(--ink)]"
                  }`}
                >
                  {child.title}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Grid Section */}
        {pageError ? (
          <div className="py-12 text-center">
            <p className="mb-4 text-sm font-semibold text-red-600">
              {pageError}
            </p>
            <button
              type="button"
              onClick={() => setRetryCount((c) => c + 1)}
              className="rounded-full bg-[var(--ink)] px-6 py-2.5 text-xs font-bold tracking-wider text-white uppercase"
            >
              Retry Loading Catalog
            </button>
          </div>
        ) : (
          <ProductGrid
            isLoading={pageLoading}
            layout={layout}
            count={displayedProducts.length}
            onResetFilters={() => {
              handleSubCategoryChange("all");
              handleQueryChange("");
            }}
          >
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
                onOpenQuickView={setQuickViewProduct}
                variant="catalog"
              />
            ))}
          </ProductGrid>
        )}

        {/* Pagination */}
        {pagination && pagination.total_pages > 1 && (
          <div className="mt-16 flex items-center justify-center gap-2 border-t border-[var(--line)] pt-8">
            <button
              type="button"
              disabled={pagination.current_page === 1}
              onClick={() => handlePageChange(pagination.current_page - 1)}
              className="flex items-center gap-1.5 rounded-xl border border-[var(--line-strong)] px-4 py-2 text-xs font-bold tracking-wider text-[var(--ink)] uppercase transition hover:bg-[var(--panel)] disabled:opacity-40"
            >
              <ArrowLeft size={14} /> Previous
            </button>
            <span className="px-4 font-mono text-xs font-bold text-[var(--ink)]">
              Page {pagination.current_page} of {pagination.total_pages}
            </span>
            <button
              type="button"
              disabled={pagination.current_page === pagination.total_pages}
              onClick={() => handlePageChange(pagination.current_page + 1)}
              className="flex items-center gap-1.5 rounded-xl border border-[var(--line-strong)] px-4 py-2 text-xs font-bold tracking-wider text-[var(--ink)] uppercase transition hover:bg-[var(--panel)] disabled:opacity-40"
            >
              Next <ArrowRight size={14} />
            </button>
          </div>
        )}
      </div>

      {/* Mobile Filter Drawer */}
      <FilterDrawer
        isOpen={filterDrawerOpen}
        categories={categories}
        activeCategory={selectedCategoryId}
        activeSortBy={activeSortBy}
        onSelectCategory={(catId) => {
          window.location.hash = `/shop?category=${catId}`;
        }}
        onSelectSortBy={handleSortChange}
        onClose={() => setFilterDrawerOpen(false)}
        onReset={() => {
          handleSubCategoryChange("all");
          handleQueryChange("");
        }}
      />

      {/* Quick View Modal */}
      {quickViewProduct && (
        <QuickViewModal
          product={quickViewProduct}
          liked={wishlist.includes(quickViewProduct.id)}
          pickedSize={selectedSize[quickViewProduct.id]}
          onClose={() => setQuickViewProduct(null)}
          onPickSize={onPickSize}
          onToggleWishlist={onToggleWishlist}
          onAddToCart={onAddToCart}
          onOpenProduct={onOpenProduct}
        />
      )}
    </section>
  );
}
