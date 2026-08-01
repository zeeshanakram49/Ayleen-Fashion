import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check } from 'lucide-react';
import type { Category } from '../types/store';

type FilterDrawerProps = {
  isOpen: boolean;
  categories: Category[];
  activeCategory: string;
  activeSortBy: string;
  onSelectCategory: (catId: string) => void;
  onSelectSortBy: (sort: string) => void;
  onClose: () => void;
  onReset: () => void;
};

const sortOptions = [
  { label: 'Featured', value: 'featured' },
  { label: 'Newest Arrivals', value: 'newest' },
  { label: 'Best Rated', value: 'rating' },
  { label: 'Price: Low to High', value: 'price-low' },
  { label: 'Price: High to Low', value: 'price-high' },
];

export function FilterDrawer({
  isOpen,
  categories,
  activeCategory,
  activeSortBy,
  onSelectCategory,
  onSelectSortBy,
  onClose,
  onReset,
}: FilterDrawerProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label="Filters and Sorting"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-[9980] bg-black/60 backdrop-blur-sm"
      >
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 250 }}
          onClick={(e) => e.stopPropagation()}
          className="fixed bottom-0 inset-x-0 z-[9985] flex flex-col rounded-t-3xl bg-white p-6 shadow-2xl max-h-[85vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[var(--line)] pb-4">
            <h3 className="text-lg font-bold uppercase tracking-wider text-[var(--ink)]">
              Filters &amp; Sort
            </h3>
            <button
              type="button"
              onClick={onClose}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--line-strong)] hover:bg-[var(--panel)] transition"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-6 space-y-6 flex-1 overflow-y-auto">
            {/* Sort Options */}
            <div>
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--muted)] block mb-3">
                Sort By
              </span>
              <div className="grid grid-cols-1 gap-2">
                {sortOptions.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => onSelectSortBy(opt.value)}
                    className={`flex items-center justify-between rounded-lg p-3 text-sm font-medium transition ${
                      activeSortBy === opt.value
                        ? 'bg-[var(--ink)] text-white'
                        : 'bg-[var(--panel)] text-[var(--ink)] hover:bg-[var(--line)]'
                    }`}
                  >
                    <span>{opt.label}</span>
                    {activeSortBy === opt.value && <Check className="h-4 w-4" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Categories */}
            <div>
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--muted)] block mb-3">
                Categories
              </span>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => onSelectCategory('all')}
                  className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wider transition ${
                    activeCategory === 'all'
                      ? 'bg-[var(--ink)] text-white'
                      : 'border border-[var(--line-strong)] text-[var(--ink)] hover:border-[var(--ink)]'
                  }`}
                >
                  All Products
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => onSelectCategory(cat.id)}
                    className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wider transition ${
                      activeCategory === cat.id
                        ? 'bg-[var(--ink)] text-white'
                        : 'border border-[var(--line-strong)] text-[var(--ink)] hover:border-[var(--ink)]'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="mt-6 flex items-center gap-3 border-t border-[var(--line)] pt-4 pb-safe">
            <button
              type="button"
              onClick={() => {
                onReset();
                onClose();
              }}
              className="flex-1 rounded-xl border border-[var(--line-strong)] py-3 text-xs font-bold uppercase tracking-widest text-[var(--ink)] hover:bg-[var(--panel)] transition"
            >
              Reset
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl bg-[var(--ink)] py-3 text-xs font-bold uppercase tracking-widest text-white hover:bg-neutral-800 transition shadow-lg"
            >
              Apply Filters
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
