import type { ReactNode } from 'react';
import { ShoppingBag, RefreshCw } from 'lucide-react';

type ProductGridProps = {
  children?: ReactNode;
  isLoading?: boolean;
  layout?: 'single' | 'double' | 'quad';
  count?: number;
  onResetFilters?: () => void;
};

export function ProductGrid({
  children,
  isLoading = false,
  layout = 'quad',
  count = 0,
  onResetFilters,
}: ProductGridProps) {
  if (isLoading) {
    return (
      <div
        className={`grid gap-4 sm:gap-6 ${
          layout === 'single'
            ? 'grid-cols-1 max-w-xl mx-auto'
            : layout === 'double'
              ? 'grid-cols-1 sm:grid-cols-2'
              : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4'
        }`}
      >
        {Array.from({ length: 8 }).map((_, idx) => (
          <div
            key={idx}
            className="animate-pulse rounded-xl border border-[var(--line)] bg-[var(--paper)] p-3 space-y-3"
          >
            <div className="aspect-[3/4] w-full rounded-lg bg-[var(--panel-strong)]" />
            <div className="h-3 w-1/3 rounded bg-[var(--panel-strong)]" />
            <div className="h-4 w-3/4 rounded bg-[var(--panel-strong)]" />
            <div className="h-4 w-1/2 rounded bg-[var(--panel-strong)]" />
          </div>
        ))}
      </div>
    );
  }

  if (count === 0 && !children) {
    return (
      <div className="my-16 flex flex-col items-center justify-center rounded-2xl border border-dashed border-[var(--line-strong)] bg-[var(--panel)] p-12 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--paper)] shadow-md text-[var(--muted)] mb-4">
          <ShoppingBag size={28} />
        </div>
        <h3 className="text-xl font-bold uppercase tracking-wider text-[var(--ink)]">
          No Products Found
        </h3>
        <p className="mt-2 text-sm text-[var(--muted)] max-w-md">
          We couldn&apos;t find any items matching your selected category or search criteria. Try checking your spellings or resetting filters.
        </p>
        {onResetFilters && (
          <button
            type="button"
            onClick={onResetFilters}
            className="mt-6 flex items-center gap-2 rounded-full bg-[var(--ink)] px-6 py-3 text-xs font-bold uppercase tracking-widest text-white hover:bg-neutral-800 transition active:scale-95 shadow-md"
          >
            <RefreshCw size={14} /> Clear All Filters
          </button>
        )}
      </div>
    );
  }

  return (
    <div
      className={`grid gap-4 sm:gap-6 ${
        layout === 'single'
          ? 'grid-cols-1 max-w-xl mx-auto'
          : layout === 'double'
            ? 'grid-cols-1 sm:grid-cols-2'
            : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4'
      }`}
    >
      {children}
    </div>
  );
}
