import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, TrendingUp, ArrowRight } from 'lucide-react';
import { ImageWithFallback } from './ImageWithFallback';
import type { Product } from '../types/store';
import { money } from '../lib/store';

type SearchOverlayProps = {
  isOpen: boolean;
  query: string;
  products: Product[];
  onQueryChange: (query: string) => void;
  onSelectProduct: (slug: string) => void;
  onSearchSubmit: (query: string) => void;
  onClose: () => void;
};

const popularSearches = [
  'Oversized Tee',
  'Cargo Pants',
  'Hoodies',
  'Denim Jackets',
  'Polo Shirts',
  'Sale Essentials',
];

export function SearchOverlay({
  isOpen,
  query,
  products,
  onQueryChange,
  onSelectProduct,
  onSearchSubmit,
  onClose,
}: SearchOverlayProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredProducts = query.trim()
    ? products.filter(
        (p) =>
          p.title.toLowerCase().includes(query.toLowerCase()) ||
          p.categoryLabel.toLowerCase().includes(query.toLowerCase()) ||
          p.fit.toLowerCase().includes(query.toLowerCase()) ||
          p.tags.some((t) => t.toLowerCase().includes(query.toLowerCase()))
      ).slice(0, 6)
    : [];

  return (
    <AnimatePresence>
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label="Search Catalog"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-[9990] flex flex-col bg-white/95 backdrop-blur-2xl text-[var(--ink)]"
      >
        {/* Header Search Input Bar */}
        <div className="w-full border-b border-[var(--line)] px-4 sm:px-12 py-6">
          <div className="mx-auto flex max-w-4xl items-center gap-4">
            <Search className="h-6 w-6 text-[var(--muted)] shrink-0" />
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (query.trim()) {
                  onSearchSubmit(query);
                  onClose();
                }
              }}
              className="flex-1"
            >
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => onQueryChange(e.target.value)}
                placeholder="Search men's streetwear, t-shirts, jackets, sale..."
                className="w-full bg-transparent font-sans text-xl sm:text-2xl font-light text-[var(--ink)] placeholder-[var(--muted)] outline-none"
              />
            </form>
            {query && (
              <button
                type="button"
                onClick={() => onQueryChange('')}
                className="text-xs uppercase tracking-widest text-[var(--muted)] hover:text-[var(--ink)] transition"
              >
                CLEAR
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close search"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--line-strong)] text-[var(--ink)] hover:bg-[var(--panel)] transition"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Content Container */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-12 py-8">
          <div className="mx-auto max-w-4xl space-y-10">
            {/* Live Search Results */}
            {query.trim() ? (
              <div>
                <div className="flex items-center justify-between border-b border-[var(--line)] pb-3">
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--muted)]">
                    Matching Products ({filteredProducts.length})
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      onSearchSubmit(query);
                      onClose();
                    }}
                    className="flex items-center gap-1 text-xs font-medium uppercase tracking-wider text-[var(--ink)] hover:underline"
                  >
                    View all results <ArrowRight className="h-3 w-3" />
                  </button>
                </div>

                {filteredProducts.length > 0 ? (
                  <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-6">
                    {filteredProducts.map((product) => (
                      <article
                        key={product.id}
                        onClick={() => {
                          onSelectProduct(product.slug);
                          onClose();
                        }}
                        className="group cursor-pointer rounded-lg border border-[var(--line)] bg-[var(--paper)] p-3 transition hover:shadow-lg hover:-translate-y-1"
                      >
                        <div className="aspect-[3/4] w-full overflow-hidden rounded bg-[var(--panel)]">
                          <ImageWithFallback
                            src={product.image}
                            alt={product.title}
                            className="h-full w-full object-cover group-hover:scale-105 transition duration-300"
                          />
                        </div>
                        <div className="mt-3">
                          <p className="text-[10px] uppercase tracking-widest text-[var(--muted)]">
                            {product.fit}
                          </p>
                          <h4 className="text-sm font-medium line-clamp-1 text-[var(--ink)] group-hover:text-[var(--gold)]">
                            {product.title}
                          </h4>
                          <p className="mt-1 text-xs font-bold text-[var(--ink)]">
                            {money(product.price).replace('PKR ', 'Rs. ')}
                          </p>
                        </div>
                      </article>
                    ))}
                  </div>
                ) : (
                  <div className="py-12 text-center">
                    <p className="text-lg font-light text-[var(--muted)]">
                      No products found matching &ldquo;<span className="text-[var(--ink)] font-normal">{query}</span>&rdquo;
                    </p>
                  </div>
                )}
              </div>
            ) : (
              /* Popular Searches & Suggestions */
              <div className="space-y-8">
                <div>
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--muted)] mb-4">
                    <TrendingUp className="h-4 w-4" /> Trending Searches
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {popularSearches.map((term) => (
                      <button
                        key={term}
                        type="button"
                        onClick={() => {
                          onQueryChange(term);
                          onSearchSubmit(term);
                          onClose();
                        }}
                        className="rounded-full border border-[var(--line-strong)] px-4 py-2 text-xs font-medium tracking-wide text-[var(--ink)] transition hover:border-[var(--ink)] hover:bg-[var(--ink)] hover:text-white"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--muted)] block mb-4">
                    Curated Categories
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {['Men Shirts', 'Graphic Tees', 'Trousers & Shorts', 'New Arrivals'].map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => {
                          onQueryChange(cat);
                          onSearchSubmit(cat);
                          onClose();
                        }}
                        className="flex flex-col items-start rounded-lg border border-[var(--line)] bg-[var(--panel)] p-4 text-left transition hover:border-[var(--ink)] hover:bg-white"
                      >
                        <span className="text-sm font-semibold uppercase tracking-wider text-[var(--ink)]">
                          {cat}
                        </span>
                        <span className="text-[11px] text-[var(--muted)] mt-1">Explore Collection &rarr;</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
