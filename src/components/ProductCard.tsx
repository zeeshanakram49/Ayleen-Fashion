import type { Product } from '../types/store';
import { money } from '../lib/store';

type ProductCardProps = {
  product: Product;
  index: number;
  liked: boolean;
  onToggleWishlist: (productId: string) => void;
  onAddToCart: (productId: string) => void;
  onOpenProduct: (slug: string) => void;
};

export function ProductCard({
  product,
  index,
  liked,
  onToggleWishlist,
  onAddToCart,
  onOpenProduct,
}: ProductCardProps) {
  return (
    <article
      className="group product-card reveal-up rounded-[1.8rem] border border-[var(--line)] bg-[var(--panel)] p-4 transition hover:-translate-y-1 hover:shadow-xl"
      style={{ animationDelay: `${80 + index * 90}ms` }}
    >
      <div className="relative overflow-hidden rounded-2xl">
        <img
          src={product.image}
          alt={product.title}
          className="media-zoom h-[340px] w-full object-cover transition duration-700 group-hover:scale-105"
        />
        <span className="absolute left-3 top-3 rounded-full bg-[var(--champagne)] px-3 py-1 text-[10px] font-semibold tracking-[0.16em] text-[var(--ink)]">
          {product.badge}
        </span>
        <button
          type="button"
          onClick={() => onToggleWishlist(product.id)}
          className="absolute right-3 top-3 rounded-full border border-white/70 bg-black/25 px-3 py-1 text-xs text-white backdrop-blur"
        >
          {liked ? 'SAVED' : 'SAVE'}
        </button>
      </div>

      <div className="mt-4 flex items-start justify-between gap-4">
        <div>
          <button
            type="button"
            onClick={() => onOpenProduct(product.slug)}
            className="font-editorial text-left text-2xl transition hover:text-[var(--gold-deep)]"
          >
            {product.title}
          </button>
          <p className="mt-1 text-xs tracking-[0.12em] text-[var(--muted)]">{product.categoryLabel}</p>
          <div className="mt-2 flex items-center gap-2 text-sm">
            <span className="font-semibold">{money(product.price)}</span>
            <span className="text-[var(--muted)] line-through">{money(product.oldPrice)}</span>
          </div>
        </div>
        <button
          type="button"
          onClick={() => onAddToCart(product.id)}
          className="rounded-full border border-[var(--line-strong)] px-4 py-2 text-[10px] font-semibold tracking-[0.16em] transition hover:border-[var(--gold-deep)] hover:text-[var(--gold-deep)]"
        >
          ADD
        </button>
      </div>
    </article>
  );
}
