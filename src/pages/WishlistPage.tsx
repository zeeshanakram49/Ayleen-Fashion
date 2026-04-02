import { ProductCard } from '../components/ProductCard';
import type { Product } from '../types/store';

type WishlistPageProps = {
  products: Product[];
  wishlist: string[];
  selectedSize: Record<string, string>;
  onPickSize: (productId: string, size: string) => void;
  onToggleWishlist: (productId: string) => void;
  onAddToCart: (productId: string, fallbackSize?: string, requireSelection?: boolean) => void;
  onOpenProduct: (slug: string) => void;
};

export function WishlistPage({
  products,
  wishlist,
  selectedSize,
  onPickSize,
  onToggleWishlist,
  onAddToCart,
  onOpenProduct,
}: WishlistPageProps) {
  return (
    <section className="mx-auto max-w-7xl px-6 py-14 md:py-20">
      <div className="reveal-up mb-8 flex items-end justify-between">
        <div>
          <p className="text-xs tracking-[0.3em] text-[var(--gold-deep)]">PERSONAL LIST</p>
          <h1 className="font-editorial mt-3 text-4xl sm:text-5xl">Your Wishlist</h1>
        </div>
        <p className="text-sm text-[var(--muted)]">{products.length} items saved</p>
      </div>

      {products.length === 0 ? (
        <article className="reveal-up is-visible rounded-3xl border border-[var(--line)] bg-[var(--panel)] p-10 text-center">
          <h2 className="font-editorial text-3xl">No saved items yet</h2>
          <a
            href="#/shop"
            className="mt-5 inline-flex rounded-full bg-[var(--ink)] px-6 py-3 text-xs tracking-[0.2em] text-[var(--champagne)]"
          >
            EXPLORE SHOP
          </a>
        </article>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {products.map((product, index) => (
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
        </div>
      )}
    </section>
  );
}
