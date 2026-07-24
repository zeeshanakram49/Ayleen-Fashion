import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoCloseOutline, IoSearchOutline } from "react-icons/io5";
import { products } from "../data/store";
import { money } from "../lib/store";
import type { Product } from "../types/store";

type SearchOverlayProps = {
  isOpen: boolean;
  onClose: () => void;
  onOpenProduct: (slug: string) => void;
};

const POPULAR_SEARCHES = ["Polo", "Knit", "Henley", "Silk", "White Shirt", "Tote Bag"];

export function SearchOverlay({ isOpen, onClose, onOpenProduct }: SearchOverlayProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = "hidden";
    } else {
      setQuery("");
      setResults([]);
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    if (query.trim() === "") {
      setResults([]);
      return;
    }
    const q = query.toLowerCase();
    const filtered = products.filter(
      (product) =>
        product.title.toLowerCase().includes(q) ||
        product.description.toLowerCase().includes(q) ||
        product.categoryLabel.toLowerCase().includes(q) ||
        product.tags.some((tag) => tag.toLowerCase().includes(q))
    );
    setResults(filtered.slice(0, 5));
  }, [query]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: "easeInOut" }}
          className="fixed inset-0 z-[100] flex flex-col bg-white/98 backdrop-blur-xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-black/5 px-6 py-6 md:px-12">
            <span className="text-xs font-bold tracking-[0.3em] text-[var(--ink)]">SEARCH THE BRAND</span>
            <button
              onClick={onClose}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-black/5 text-2xl transition hover:bg-black/10"
              aria-label="Close search"
            >
              <IoCloseOutline />
            </button>
          </div>

          {/* Search Box */}
          <div className="mx-auto w-full max-w-4xl px-6 py-12 md:py-20">
            <div className="relative flex items-center border-b border-[var(--ink)] pb-4">
              <IoSearchOutline className="absolute left-0 text-3xl text-[var(--muted)]" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Type to search products..."
                className="w-full bg-transparent pl-12 pr-4 text-2xl font-light tracking-wide text-[var(--ink)] outline-none md:text-4xl"
              />
            </div>

            {/* Content Area */}
            <div className="mt-12 grid gap-12 md:grid-cols-3">
              {/* Popular Searches */}
              <div className="md:col-span-1">
                <h4 className="text-[10px] font-bold tracking-[0.25em] text-[var(--muted)] uppercase">
                  Popular Searches
                </h4>
                <div className="mt-4 flex flex-col gap-3">
                  {POPULAR_SEARCHES.map((search) => (
                    <button
                      key={search}
                      onClick={() => setQuery(search)}
                      className="text-left text-sm text-[var(--ink)] transition hover:text-[var(--gold-deep)] hover:translate-x-1 duration-200"
                    >
                      {search}
                    </button>
                  ))}
                </div>
              </div>

              {/* Search Results */}
              <div className="md:col-span-2">
                <h4 className="text-[10px] font-bold tracking-[0.25em] text-[var(--muted)] uppercase">
                  {query ? "Search Results" : "Featured Suggestions"}
                </h4>

                <div className="mt-6 space-y-4">
                  {results.length > 0 ? (
                    results.map((product) => (
                      <div
                        key={product.id}
                        onClick={() => {
                          onOpenProduct(product.slug);
                          onClose();
                        }}
                        className="flex cursor-pointer items-center gap-4 rounded-xl border border-black/5 p-3 transition hover:bg-black/[0.02] hover:shadow-sm"
                      >
                        <img
                          src={product.image}
                          alt={product.title}
                          className="h-20 w-16 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <p className="text-[9px] font-semibold tracking-wider text-[var(--gold-deep)] uppercase">
                            {product.categoryLabel}
                          </p>
                          <h5 className="mt-0.5 font-medium text-[var(--ink)]">{product.title}</h5>
                          <div className="mt-1 flex items-center gap-2 text-xs">
                            <span className="font-semibold text-[var(--ink)]">
                              {money(product.price)}
                            </span>
                            {product.oldPrice > product.price && (
                              <span className="text-[var(--muted)] line-through">
                                {money(product.oldPrice)}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : query ? (
                    <p className="text-sm text-[var(--muted)] py-4">
                      No results found for "{query}". Try checking your spelling.
                    </p>
                  ) : (
                    // Show some default products (first 3)
                    products.slice(0, 3).map((product) => (
                      <div
                        key={product.id}
                        onClick={() => {
                          onOpenProduct(product.slug);
                          onClose();
                        }}
                        className="flex cursor-pointer items-center gap-4 rounded-xl border border-black/5 p-3 transition hover:bg-black/[0.02] hover:shadow-sm"
                      >
                        <img
                          src={product.image}
                          alt={product.title}
                          className="h-20 w-16 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <p className="text-[9px] font-semibold tracking-wider text-[var(--gold-deep)] uppercase">
                            {product.categoryLabel}
                          </p>
                          <h5 className="mt-0.5 font-medium text-[var(--ink)]">{product.title}</h5>
                          <div className="mt-1 flex items-center gap-2 text-xs">
                            <span className="font-semibold text-[var(--ink)]">
                              {money(product.price)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
