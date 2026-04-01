import { ProductCard } from '../components/ProductCard';
import type { Category, Product } from '../types/store';

type ShopPageProps = {
  categories: Category[];
  products: Product[];
  activeCategory: string;
  query: string;
  wishlist: string[];
  onCategoryChange: (category: string) => void;
  onQueryChange: (query: string) => void;
  onToggleWishlist: (productId: string) => void;
  onAddToCart: (productId: string) => void;
  onOpenProduct: (slug: string) => void;
};

export function ShopPage({
  categories,
  products,
  activeCategory,
  query,
  wishlist,
  onCategoryChange,
  onQueryChange,
  onToggleWishlist,
  onAddToCart,
  onOpenProduct,
}: ShopPageProps) {
  return (
    <section className="mx-auto max-w-7xl px-6 py-14 md:py-20">
      <div className="reveal-up mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs tracking-[0.3em] text-[var(--gold-deep)]">FULL CATALOG</p>
          <h1 className="font-editorial mt-3 text-4xl sm:text-5xl">Shop All Products</h1>
        </div>
        <p className="text-sm text-[var(--muted)]">{products.length} products</p>
      </div>

      <div className="reveal-up mb-8 grid gap-3 md:grid-cols-[1fr_auto]">
        <input
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Search by product, category, or style"
          className="h-12 rounded-full border border-[var(--line-strong)] bg-white px-5 text-sm outline-none"
        />
        <div className="flex flex-wrap gap-2 text-[11px] font-semibold tracking-[0.15em]">
          <button
            type="button"
            onClick={() => onCategoryChange('all')}
            className={`rounded-full px-4 py-2 ${activeCategory === 'all' ? 'bg-[var(--ink)] text-[var(--champagne)]' : 'border border-[var(--line-strong)]'}`}
          >
            ALL
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => onCategoryChange(cat.id)}
              className={`rounded-full px-4 py-2 ${activeCategory === cat.id ? 'bg-[var(--ink)] text-[var(--champagne)]' : 'border border-[var(--line-strong)]'}`}
            >
              {cat.name.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {products.length === 0 ? (
        <article className="reveal-up rounded-3xl border border-[var(--line)] bg-[var(--panel)] p-10 text-center">
          <h2 className="font-editorial text-3xl">No products found</h2>
          <p className="mt-3 text-sm text-[var(--muted)]">Try changing category or clearing search.</p>
          <button
            type="button"
            onClick={() => {
              onQueryChange('');
              onCategoryChange('all');
            }}
            className="mt-5 rounded-full border border-[var(--line-strong)] px-5 py-2 text-xs tracking-[0.18em]"
          >
            RESET FILTERS
          </button>
        </article>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {products.map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              index={index}
              liked={wishlist.includes(product.id)}
              onToggleWishlist={onToggleWishlist}
              onAddToCart={onAddToCart}
              onOpenProduct={onOpenProduct}
            />
          ))}
        </div>
      )}
    </section>
  );
}
