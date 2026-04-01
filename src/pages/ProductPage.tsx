import { money } from '../lib/store';
import type { Product } from '../types/store';

type ProductPageProps = {
  product: Product;
  pickedSize: string;
  liked: boolean;
  onPickSize: (size: string) => void;
  onAddToCart: () => void;
  onToggleWishlist: () => void;
};

export function ProductPage({
  product,
  pickedSize,
  liked,
  onPickSize,
  onAddToCart,
  onToggleWishlist,
}: ProductPageProps) {
  return (
    <section className="mx-auto max-w-7xl px-6 py-14 md:py-20">
      <a
        href="#/shop"
        className="reveal-up inline-flex rounded-full border border-[var(--line-strong)] px-4 py-2 text-xs tracking-[0.16em]"
      >
        BACK TO SHOP
      </a>

      <div className="mt-6 grid gap-8 lg:grid-cols-[1.1fr_1fr]">
        <div className="reveal-up grid gap-4 sm:grid-cols-2">
          {product.gallery.map((image) => (
            <img
              key={image}
              src={image}
              alt={product.title}
              className="cinema-card media-zoom h-[360px] w-full rounded-[1.8rem] object-cover"
            />
          ))}
        </div>

        <article className="reveal-up delay-1 soft-panel rounded-[2rem] border border-[var(--line)] p-7">
          <p className="text-xs tracking-[0.22em] text-[var(--gold-deep)]">{product.categoryLabel.toUpperCase()}</p>
          <h1 className="font-editorial mt-3 text-5xl leading-[0.95]">{product.title}</h1>
          <p className="mt-2 text-sm text-[var(--muted)]">{product.description}</p>
          <div className="mt-4 flex items-center gap-2">
            <span className="text-xl font-semibold">{money(product.price)}</span>
            <span className="text-sm text-[var(--muted)] line-through">{money(product.oldPrice)}</span>
            <span className="ml-2 text-xs text-[var(--gold-deep)]">
              {product.rating} ({product.reviews} reviews)
            </span>
          </div>

          <div className="mt-5">
            <p className="text-xs tracking-[0.18em]">SIZE</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => onPickSize(size)}
                  className={`rounded-full px-4 py-2 text-xs tracking-[0.15em] ${pickedSize === size ? 'bg-[var(--ink)] text-[var(--champagne)]' : 'border border-[var(--line-strong)]'}`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <p className="mt-5 text-sm text-[var(--muted)]">{product.details}</p>
          <p className="mt-3 text-sm">
            <span className="font-semibold">Material:</span> {product.material}
          </p>
          <p className="mt-1 text-sm">
            <span className="font-semibold">Stock:</span> {product.stock} units
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={onAddToCart}
              className="magnetic-btn rounded-full bg-[var(--ink)] px-7 py-3 text-xs tracking-[0.2em] text-[var(--champagne)]"
            >
              ADD TO CART
            </button>
            <button
              type="button"
              onClick={onToggleWishlist}
              className="ghost-btn rounded-full border border-[var(--line-strong)] px-7 py-3 text-xs tracking-[0.2em]"
            >
              {liked ? 'SAVED' : 'SAVE ITEM'}
            </button>
          </div>
        </article>
      </div>
    </section>
  );
}
