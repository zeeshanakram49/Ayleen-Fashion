import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoFilterOutline, IoCloseOutline } from "react-icons/io5";
import { ProductCard } from "../components/ProductCard";
import type { Product } from "../types/store";

type ShopPageProps = {
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

const PRICE_RANGES = [
  { label: "All Prices", min: 0, max: 99999 },
  { label: "Under PKR 5,000", min: 0, max: 5000 },
  { label: "PKR 5,000 - 8,000", min: 5000, max: 8000 },
  { label: "PKR 8,000 - 12,000", min: 8000, max: 12000 },
  { label: "Over PKR 12,000", min: 12000, max: 99999 },
];

const ALL_SIZES = ["XS", "S", "M", "L", "XL", "40", "41", "42", "43", "44", "One Size"];

const ALL_COLORS = [
  "White",
  "Black",
  "Ivory",
  "Sand",
  "Khaki",
  "Cloud Grey",
  "Mocha",
  "Taupe",
  "Olive",
];

export function ShopPage({
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
  // Filter States
  const [selectedPrice, setSelectedPrice] = useState(PRICE_RANGES[0]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [visibleCount, setVisibleCount] = useState(8);

  // Trigger loading effect when filters change to demonstrate skeleton loader
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, [activeCategory, query, sortBy, selectedPrice, selectedSizes, selectedColors]);

  // Reset pagination on filter change
  useEffect(() => {
    setVisibleCount(8);
  }, [activeCategory, query, sortBy, selectedPrice, selectedSizes, selectedColors]);

  // 1. Core Filter Logic
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Category filter (matches gender/category)
      const categoryMatch =
        activeCategory === "all" ||
        product.categoryId === activeCategory ||
        product.tags.includes(activeCategory);

      // Search query filter
      const q = query.trim().toLowerCase();
      const queryMatch =
        q.length === 0 ||
        product.title.toLowerCase().includes(q) ||
        product.description.toLowerCase().includes(q) ||
        product.categoryLabel.toLowerCase().includes(q);

      // Price filter
      const priceMatch =
        product.price >= selectedPrice.min && product.price <= selectedPrice.max;

      // Size filter
      const sizeMatch =
        selectedSizes.length === 0 ||
        product.sizes.some((size) => selectedSizes.includes(size));

      // Color filter
      const colorMatch =
        selectedColors.length === 0 ||
        product.colors.some((color) => selectedColors.includes(color));

      return categoryMatch && queryMatch && priceMatch && sizeMatch && colorMatch;
    });
  }, [products, activeCategory, query, selectedPrice, selectedSizes, selectedColors]);

  // 2. Sort Logic
  const sortedProducts = useMemo(() => {
    const list = [...filteredProducts];
    if (sortBy === "price-low") return list.sort((a, b) => a.price - b.price);
    if (sortBy === "price-high") return list.sort((a, b) => b.price - a.price);
    if (sortBy === "rating") return list.sort((a, b) => b.rating - a.rating);
    if (sortBy === "newest") return list.reverse(); // Mock newest by reversing array
    return list; // default featured
  }, [filteredProducts, sortBy]);

  const displayedProducts = sortedProducts.slice(0, visibleCount);

  const toggleSizeFilter = (size: string) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const toggleColorFilter = (color: string) => {
    setSelectedColors((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]
    );
  };

  const resetAllFilters = () => {
    onCategoryChange("all");
    onQueryChange("");
    onSortChange("featured");
    setSelectedPrice(PRICE_RANGES[0]);
    setSelectedSizes([]);
    setSelectedColors([]);
  };

  return (
    <section className="mx-auto max-w-[1600px] px-6 py-24 md:px-12 md:py-32">
      {/* Page Header */}
      <div className="border-b border-black/5 pb-8 mb-12">
        <span className="text-[10px] font-bold tracking-[0.3em] text-[var(--gold-deep)] uppercase">
          Collections Catalogue
        </span>
        <div className="mt-4 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <h1 className="font-editorial text-4xl sm:text-5xl font-bold text-[var(--ink)]">
              {activeCategory === "all"
                ? "All Collections"
                : activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)}
            </h1>
            <p className="mt-3 max-w-xl text-xs text-[var(--muted)] leading-relaxed">
              Explore premium apparel crafted with minimalist design, textured knit structures, and premium natural fabrics.
            </p>
          </div>
          <p className="text-xs font-semibold text-[var(--muted)] shrink-0">
            SHOWING {displayedProducts.length} OF {sortedProducts.length} PRODUCTS
          </p>
        </div>
      </div>

      {/* Control Bar (Mobile Toggle + Search + Sort) */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-b border-black/5 pb-6 mb-8">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="flex lg:hidden items-center justify-center gap-2 rounded-xl border border-black/10 px-4 py-2.5 text-xs font-bold tracking-wider text-[var(--ink)] bg-white"
          >
            <IoFilterOutline />
            <span>FILTER / SORT</span>
          </button>
        </div>

        <div className="flex-1 max-w-md">
          <input
            type="text"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Search by name, fabric, or style..."
            className="w-full h-10 rounded-xl border border-black/10 bg-white px-4 text-xs outline-none focus:border-[var(--ink)]"
          />
        </div>

        <div className="hidden lg:block">
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="h-10 rounded-xl border border-black/10 bg-white px-4 text-xs outline-none font-bold tracking-wider text-[var(--ink)] cursor-pointer"
          >
            <option value="featured">SORT: FEATURED</option>
            <option value="newest">SORT: NEWEST</option>
            <option value="price-low">SORT: PRICE LOW-HIGH</option>
            <option value="price-high">SORT: PRICE HIGH-LOW</option>
            <option value="rating">SORT: TOP RATED</option>
          </select>
        </div>
      </div>

      <div className="grid gap-10 lg:grid-cols-[250px_1fr]">
        {/* 3. DESKTOP FILTERS SIDEBAR */}
        <aside className="hidden lg:block space-y-8">
          {/* Category Filter */}
          <div className="space-y-3">
            <h4 className="text-[10px] font-bold tracking-widest text-[var(--ink)] uppercase">
              Category
            </h4>
            <div className="flex flex-col gap-2">
              {[
                { id: "all", name: "All Collections" },
                { id: "men", name: "Men" },
                { id: "women", name: "Women" },
                { id: "juniors", name: "Kids / Juniors" },
                { id: "accessories", name: "Accessories" },
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => onCategoryChange(cat.id)}
                  className={`text-left text-xs font-medium py-1 transition ${
                    activeCategory === cat.id
                      ? "text-[var(--gold-deep)] font-bold"
                      : "text-[var(--muted)] hover:text-[var(--ink)]"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Price Filter */}
          <div className="space-y-3">
            <h4 className="text-[10px] font-bold tracking-widest text-[var(--ink)] uppercase">
              Price Range
            </h4>
            <div className="flex flex-col gap-2">
              {PRICE_RANGES.map((range, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedPrice(range)}
                  className={`text-left text-xs font-medium py-1 transition ${
                    selectedPrice.label === range.label
                      ? "text-[var(--gold-deep)] font-bold"
                      : "text-[var(--muted)] hover:text-[var(--ink)]"
                  }`}
                >
                  {range.label}
                </button>
              ))}
            </div>
          </div>

          {/* Size Filter */}
          <div className="space-y-3">
            <h4 className="text-[10px] font-bold tracking-widest text-[var(--ink)] uppercase">
              Sizes
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {ALL_SIZES.map((size) => {
                const isSelected = selectedSizes.includes(size);
                return (
                  <button
                    key={size}
                    onClick={() => toggleSizeFilter(size)}
                    className={`h-8 min-w-8 rounded-lg border text-[10px] font-bold px-2 flex items-center justify-center transition ${
                      isSelected
                        ? "bg-[var(--ink)] border-[var(--ink)] text-white"
                        : "border-black/10 hover:border-black/30 text-[var(--ink)]"
                    }`}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Color Filter */}
          <div className="space-y-3">
            <h4 className="text-[10px] font-bold tracking-widest text-[var(--ink)] uppercase">
              Colors
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {ALL_COLORS.map((color) => {
                const isSelected = selectedColors.includes(color);
                return (
                  <button
                    key={color}
                    onClick={() => toggleColorFilter(color)}
                    className={`rounded-full border px-3 py-1 text-[9px] font-bold tracking-wider uppercase transition ${
                      isSelected
                        ? "bg-[var(--ink)] border-[var(--ink)] text-white"
                        : "bg-white border-black/10 hover:border-black/30 text-[var(--muted)]"
                    }`}
                  >
                    {color}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Reset button */}
          {(activeCategory !== "all" ||
            query !== "" ||
            selectedPrice.label !== "All Prices" ||
            selectedSizes.length > 0 ||
            selectedColors.length > 0) && (
            <button
              onClick={resetAllFilters}
              className="w-full rounded-xl border border-red-200 text-red-500 py-2.5 text-xs font-bold tracking-wider hover:bg-red-50 transition"
            >
              RESET ALL FILTERS
            </button>
          )}
        </aside>

        {/* 4. PRODUCT GRID & STATES */}
        <div className="space-y-12">
          <AnimatePresence mode="wait">
            {isLoading ? (
              // Loading Skeletons
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                key="skeletons"
                className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3"
              >
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="border border-black/5 bg-white p-4 rounded-3xl space-y-4 animate-pulse"
                  >
                    <div className="aspect-[3/4] w-full bg-black/5 rounded-2xl" />
                    <div className="h-4 bg-black/5 rounded w-1/3" />
                    <div className="h-6 bg-black/5 rounded w-3/4" />
                    <div className="h-4 bg-black/5 rounded w-1/4" />
                  </div>
                ))}
              </motion.div>
            ) : sortedProducts.length === 0 ? (
              // Empty State
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                key="empty-state"
                className="rounded-3xl border border-black/5 bg-[var(--panel)] p-12 text-center max-w-lg mx-auto py-20"
              >
                <IoCloseOutline className="text-5xl text-black/20 border-2 border-dashed border-black/10 rounded-full p-2 mx-auto" />
                <h3 className="font-editorial text-2xl mt-6 font-semibold text-[var(--ink)]">
                  No matching garments
                </h3>
                <p className="text-xs text-[var(--muted)] mt-2 leading-relaxed max-w-xs mx-auto">
                  We couldn't find any products matching your selected filters. Try broadening your criteria.
                </p>
                <button
                  onClick={resetAllFilters}
                  className="mt-8 rounded-full bg-[var(--ink)] px-8 py-3.5 text-xs font-bold tracking-widest text-white hover:bg-[var(--gold-deep)] transition shadow-md"
                >
                  CLEAR ALL FILTERS
                </button>
              </motion.div>
            ) : (
              // Product Grid
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                key="grid"
                className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3"
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
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Pagination Load More Button */}
          {sortedProducts.length > displayedProducts.length && !isLoading && (
            <div className="text-center pt-6">
              <button
                onClick={() => setVisibleCount((prev) => prev + 6)}
                className="px-8 py-3.5 rounded-full border border-[var(--line-strong)] text-[var(--ink)] text-xs font-bold tracking-[0.2em] transition hover:bg-[var(--ink)] hover:text-white hover:border-[var(--ink)]"
              >
                LOAD MORE ITEMS
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 5. MOBILE FILTER DRAWER */}
      <AnimatePresence>
        {mobileFilterOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileFilterOpen(false)}
              className="fixed inset-0 z-50 bg-black"
            />

            {/* Drawer */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "tween", duration: 0.35 }}
              className="fixed bottom-0 left-0 right-0 z-50 max-h-[85vh] overflow-y-auto rounded-t-3xl bg-white p-6 shadow-2xl flex flex-col"
            >
              <div className="flex items-center justify-between border-b border-black/5 pb-4 mb-6">
                <span className="text-sm font-bold tracking-widest text-[var(--ink)] uppercase flex items-center gap-2">
                  <IoFilterOutline />
                  <span>Filters & Sorting</span>
                </span>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-black/5 text-xl text-[var(--ink)]"
                >
                  <IoCloseOutline />
                </button>
              </div>

              <div className="flex-1 space-y-6 overflow-y-auto pb-8">
                {/* Sorting */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold tracking-widest text-[var(--muted)] uppercase">
                    Sort By
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => onSortChange(e.target.value)}
                    className="w-full h-11 rounded-xl border border-black/10 bg-white px-4 text-xs outline-none font-bold text-[var(--ink)]"
                  >
                    <option value="featured">Featured</option>
                    <option value="newest">Newest</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Top Rated</option>
                  </select>
                </div>

                {/* Categories */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold tracking-widest text-[var(--muted)] uppercase">
                    Category
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { id: "all", name: "All" },
                      { id: "men", name: "Men" },
                      { id: "women", name: "Women" },
                      { id: "juniors", name: "Kids / Juniors" },
                      { id: "accessories", name: "Accessories" },
                    ].map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => onCategoryChange(cat.id)}
                        className={`px-4 py-2 rounded-xl text-xs font-semibold border transition ${
                          activeCategory === cat.id
                            ? "bg-[var(--ink)] border-[var(--ink)] text-white"
                            : "bg-white border-black/10 text-[var(--ink)]"
                        }`}
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold tracking-widest text-[var(--muted)] uppercase">
                    Price Range
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {PRICE_RANGES.map((range, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedPrice(range)}
                        className={`px-3 py-2.5 rounded-xl text-[11px] font-semibold border text-center transition ${
                          selectedPrice.label === range.label
                            ? "bg-[var(--ink)] border-[var(--ink)] text-white"
                            : "bg-white border-black/10 text-[var(--ink)]"
                        }`}
                      >
                        {range.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sizes */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold tracking-widest text-[var(--muted)] uppercase">
                    Sizes
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {ALL_SIZES.map((size) => {
                      const isSelected = selectedSizes.includes(size);
                      return (
                        <button
                          key={size}
                          onClick={() => toggleSizeFilter(size)}
                          className={`h-9 min-w-9 rounded-xl border text-[11px] font-bold px-2.5 flex items-center justify-center transition ${
                            isSelected
                              ? "bg-[var(--ink)] border-[var(--ink)] text-white"
                              : "border-black/10 text-[var(--ink)]"
                          }`}
                        >
                          {size}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Colors */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold tracking-widest text-[var(--muted)] uppercase">
                    Colors
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {ALL_COLORS.map((color) => {
                      const isSelected = selectedColors.includes(color);
                      return (
                        <button
                          key={color}
                          onClick={() => toggleColorFilter(color)}
                          className={`rounded-xl border px-3.5 py-2 text-[10px] font-bold tracking-wider uppercase transition ${
                            isSelected
                              ? "bg-[var(--ink)] border-[var(--ink)] text-white"
                              : "bg-white border-black/10 text-[var(--muted)]"
                          }`}
                        >
                          {color}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Drawer Footer Actions */}
              <div className="border-t border-black/5 pt-4 mt-auto flex gap-3">
                <button
                  onClick={resetAllFilters}
                  className="flex-1 rounded-xl border border-black/10 py-3 text-xs font-bold tracking-wider text-[var(--ink)]"
                >
                  RESET ALL
                </button>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="flex-1 rounded-xl bg-[var(--ink)] py-3 text-xs font-bold tracking-wider text-white"
                >
                  APPLY FILTERS
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </section>
  );
}
