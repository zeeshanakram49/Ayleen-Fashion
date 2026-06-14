import { ImageWithFallback } from '../components/ImageWithFallback';
import { ProductCard } from '../components/ProductCard';
import { discountPercent, installmentAmount, money } from '../lib/store';
import type { Product } from '../types/store';

type ProductPageProps = {
  product: Product;
  relatedProducts: Product[];
  pickedSize: string;
  liked: boolean;
  wishlist: string[];
  selectedSize: Record<string, string>;
  onPickSize: (size: string) => void;
  onAddToCart: () => void;
  onToggleWishlist: () => void;
  onOpenProduct: (slug: string) => void;
  onCardAddToCart: (productId: string, fallbackSize?: string, requireSelection?: boolean, qty?: number) => void;
  onCardPickSize: (productId: string, size: string) => void;
  onCardToggleWishlist: (productId: string) => void;
};

export function ProductPage({
  product,
  relatedProducts,
  pickedSize,
  liked,
  wishlist,
  selectedSize,
  onPickSize,
  onAddToCart,
  onToggleWishlist,
  onOpenProduct,
  onCardAddToCart,
  onCardPickSize,
  onCardToggleWishlist,
}: ProductPageProps) {
  const salePercent = discountPercent(product.price, product.oldPrice);

  return (
    <section className="mx-auto max-w-7xl px-5 py-12 sm:px-6 md:py-16 lg:py-20">
      <a
        href="#/shop"
        className="reveal-up inline-flex rounded-[var(--radius-sm)] border border-[var(--line-strong)] px-4 py-2 text-xs tracking-[0.14em] transition hover:border-[var(--ink)]"
      >
        BACK TO SHOP
      </a>

      <div className="mt-6 grid gap-8 lg:grid-cols-[1.08fr_0.92fr]">
        <div className="reveal-up grid gap-4 sm:grid-cols-2">
          {product.gallery.map((image) => (
            <ImageWithFallback
              key={image}
              src={image}
              alt={product.title}
              className="cinema-card media-zoom h-[320px] w-full rounded-[var(--radius-lg)] object-cover sm:h-[360px]"
            />
          ))}
        </div>

        <article className="reveal-up delay-1 soft-panel rounded-[var(--radius-lg)] border border-[var(--line)] p-5 sm:p-7">
          <p className="text-xs tracking-[0.22em] text-[var(--gold-deep)]">{product.categoryLabel.toUpperCase()}</p>
          <h1 className="font-editorial mt-3 text-4xl leading-[1.02] sm:text-5xl">{product.title}</h1>
          <p className="mt-2 text-sm text-[var(--muted)]">{product.description}</p>
          <p className="mt-2 text-xs tracking-[0.18em] text-[var(--muted)]">{product.fit}</p>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="text-xl font-semibold">{money(product.price)}</span>
            <span className="text-sm text-[var(--muted)] line-through">{money(product.oldPrice)}</span>
            {salePercent > 0 && (
              <span className="rounded-full bg-[var(--ink)] px-3 py-1 text-[10px] tracking-[0.15em] text-[var(--champagne)]">
                SAVE {salePercent}%
              </span>
            )}
            <span className="ml-2 text-xs text-[var(--gold-deep)]">
              {product.rating} ({product.reviews} reviews)
            </span>
          </div>
          <p className="mt-2 text-sm text-[var(--muted)]">
            Pay in 3 installments of {money(installmentAmount(product.price))}
          </p>

          <div className="mt-6 grid gap-3 rounded-[var(--radius-md)] border border-[var(--line)] bg-white/72 p-4 text-sm text-[var(--muted)]">
            <p>Premium fabric: {product.material}</p>
            <p>Ready stock: {product.stock} units</p>
            <p>Delivery: 2 to 5 working days nationwide</p>
            <p>Exchange window: 7 days from delivery date</p>
          </div>

          <div className="mt-5">
            <p className="text-xs tracking-[0.18em]">COLORS</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {product.colors.map((color) => (
                <span
                  key={color}
                  className="rounded-[var(--radius-sm)] border border-[var(--line-strong)] px-4 py-2 text-xs tracking-[0.12em]"
                >
                  {color}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-5">
            <p className="text-xs tracking-[0.18em]">SIZE</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => onPickSize(size)}
                  className={`rounded-[var(--radius-sm)] px-4 py-2 text-xs tracking-[0.12em] ${pickedSize === size ? 'bg-[var(--ink)] text-[var(--champagne)]' : 'border border-[var(--line-strong)]'}`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <p className="mt-5 text-sm leading-7 text-[var(--muted)]">{product.details}</p>

          <div className="mt-7 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={onAddToCart}
              className="magnetic-btn rounded-[var(--radius-sm)] bg-[var(--ink)] px-7 py-3 text-xs tracking-[0.18em] text-[var(--champagne)]"
            >
              ADD TO CART
            </button>
            <button
              type="button"
              onClick={onToggleWishlist}
              className="ghost-btn rounded-[var(--radius-sm)] border border-[var(--line-strong)] px-7 py-3 text-xs tracking-[0.18em]"
            >
              {liked ? 'SAVED' : 'SAVE ITEM'}
            </button>
          </div>
        </article>
      </div>

      {relatedProducts.length > 0 && (
        <div className="mt-16">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs tracking-[0.3em] text-[var(--gold-deep)]">YOU MAY ALSO LIKE</p>
              <h2 className="font-editorial mt-3 text-4xl">Related Picks</h2>
            </div>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {relatedProducts.map((item, index) => (
              <ProductCard
                key={item.id}
                product={item}
                index={index}
                liked={wishlist.includes(item.id)}
                pickedSize={selectedSize[item.id]}
                compact
                onPickSize={onCardPickSize}
                onToggleWishlist={onCardToggleWishlist}
                onAddToCart={onCardAddToCart}
                onOpenProduct={onOpenProduct}
              />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
