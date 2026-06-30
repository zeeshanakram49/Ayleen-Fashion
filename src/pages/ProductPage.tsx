import { useMemo } from 'react';
import { ImageWithFallback } from '../components/ImageWithFallback';
import { ProductCard } from '../components/ProductCard';
import { discountPercent, installmentAmount, money } from '../lib/store';
import { APP_ROUTES } from '../routes/appRoutes';
import { getHashUrl } from '../routes/routeUtils';
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

const displaySizes = ['S', 'M', 'L', 'XL', 'XXL'];

function swatchTone(color: string) {
  const tone = color.toLowerCase();

  if (tone.includes('sand') || tone.includes('khaaki') || tone.includes('khaki')) {
    return '#aa9765';
  }

  if (tone.includes('olive') || tone.includes('green')) {
    return '#7d8561';
  }

  if (tone.includes('ice') || tone.includes('white') || tone.includes('cream')) {
    return '#f1ead8';
  }

  if (tone.includes('grey') || tone.includes('gray')) {
    return '#d7d7d2';
  }

  if (tone.includes('black')) {
    return '#121212';
  }

  return '#cfc8bb';
}

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
  const galleryImages = useMemo(
    () => Array.from(new Set([product.image, ...product.gallery])),
    [product],
  );
  const colorVariants = useMemo(() => {
    const seen = new Set<string>();
    return [product, ...relatedProducts].filter((item) => {
      const key = (item.colors[0] ?? item.title).toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [product, relatedProducts]);
  const installment = money(installmentAmount(product.price)).replace('PKR ', 'Rs. ');
  const currentColor = product.colors[0] ?? 'Selected tone';
  const detailPanels = [
    {
      title: 'PRODUCT DESCRIPTION',
      defaultOpen: true,
      body: (
        <>
          <p>{product.description}</p>
          <p className="mt-5">
            Model Details: Relaxed everyday silhouette with a clean drape and easy movement.
          </p>
        </>
      ),
    },
    {
      title: 'PRODUCT DETAILS & COMPOSITION',
      defaultOpen: false,
      body: (
        <>
          <p>{product.details}</p>
          <p className="mt-5">Material: {product.material}</p>
          <p className="mt-2">Fit: {product.fit}</p>
          <p className="mt-2">Stock available: {product.stock} pieces</p>
        </>
      ),
    },
    {
      title: 'DELIVERIES & RETURNS',
      defaultOpen: false,
      body: (
        <>
          <p>Nationwide delivery in 2 to 5 working days.</p>
          <p className="mt-5">Exchange available within 7 days for unused articles with tags attached.</p>
        </>
      ),
    },
  ];

  return (
    <section className="mx-auto max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <div className="reveal-up mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-[var(--line)] pb-4 text-[11px] tracking-[0.18em] text-[var(--muted)]">
        <div className="flex flex-wrap items-center gap-2">
          <a href={getHashUrl(APP_ROUTES.home)} className="transition hover:text-[var(--ink)]">
            HOME
          </a>
          <span>/</span>
          <a href={getHashUrl(APP_ROUTES.shop)} className="transition hover:text-[var(--ink)]">
            SHOP
          </a>
          <span>/</span>
          <span className="text-[var(--ink)]">{product.title.toUpperCase()}</span>
        </div>
        <a href={getHashUrl(APP_ROUTES.shop)} className="transition hover:text-[var(--ink)]">
          BACK TO SHOP
        </a>
      </div>

      <div className="grid gap-8 xl:grid-cols-[minmax(0,1.5fr)_minmax(380px,0.82fr)] xl:gap-12">
        <div className="reveal-up grid gap-3 sm:grid-cols-2">
          {galleryImages.map((image, index) => (
            <div
              key={`${product.id}-${image}`}
              className={`group overflow-hidden bg-[#f5f5f1] text-left ${
                index < 2 ? 'min-h-[420px] sm:min-h-[620px]' : 'min-h-[250px] sm:min-h-[320px]'
              }`}
            >
              <ImageWithFallback
                src={image}
                alt={`${product.title} view ${index + 1}`}
                className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
              />
            </div>
          ))}
        </div>

        <article className="reveal-up delay-1 xl:sticky xl:top-24 xl:self-start">
          <div className="rounded-[1.1rem] border border-[var(--line)] bg-white p-5 shadow-[0_18px_50px_-40px_rgba(0,0,0,0.25)] sm:p-7">
            <p className="text-[11px] tracking-[0.24em] text-[var(--muted)]">
              {product.categoryLabel.toUpperCase()} / {product.fit.toUpperCase()}
            </p>
            <h1 className="mt-4 max-w-[18ch] text-[1.9rem] font-semibold uppercase leading-[1.08] text-[var(--ink)] sm:text-[2.35rem]">
              {product.title}
            </h1>

            <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-2">
              <span className="text-sm font-semibold uppercase tracking-[0.12em] text-[var(--muted)] line-through">
                {money(product.oldPrice)}
              </span>
              <span className="text-[1.8rem] font-semibold leading-none text-[var(--ink)]">
                {money(product.price)}
              </span>
              {salePercent > 0 && (
                <span className="text-lg font-semibold leading-none text-[var(--ink)]">-{salePercent}%</span>
              )}
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-[var(--muted)]">
              <span className="rounded-full bg-[#5f2ee8] px-3 py-1 font-semibold text-white">baadmay</span>
              <span>
                Pay in 3 Installments of <strong className="text-[#5f2ee8]">{installment}</strong>
              </span>
            </div>

            <div className="mt-8">
              <p className="text-sm text-[var(--muted)]">{currentColor}</p>
              <div className="mt-4 flex flex-wrap gap-3">
                {colorVariants.map((item) => {
                  const color = item.colors[0] ?? item.title;
                  const selected = item.id === product.id;

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => onOpenProduct(item.slug)}
                      aria-label={`Open ${color} variant`}
                      className={`relative h-7 w-7 border transition ${
                        selected ? 'border-[var(--ink)]' : 'border-[rgba(18,18,18,0.25)]'
                      }`}
                      title={color}
                    >
                      <span
                        className="absolute inset-[3px] border border-black/10"
                        style={{ backgroundColor: swatchTone(color) }}
                      />
                      {selected && <span className="absolute -bottom-2 left-0 h-[2px] w-full bg-[var(--ink)]" />}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-9">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-medium text-[var(--ink)]">SELECT SIZE</p>
                {pickedSize && <p className="text-xs tracking-[0.18em] text-[var(--muted)]">SIZE {pickedSize}</p>}
              </div>
              <div className="mt-4 flex flex-wrap gap-x-7 gap-y-4">
                {displaySizes.map((size) => {
                  const available = product.sizes.includes(size);
                  const selected = pickedSize === size;

                  return (
                    <button
                      key={size}
                      type="button"
                      onClick={() => available && onPickSize(size)}
                      disabled={!available}
                      className={`border-b pb-1 text-lg transition ${
                        !available
                          ? 'cursor-not-allowed border-transparent text-[rgba(18,18,18,0.32)] line-through'
                          : selected
                            ? 'border-[var(--ink)] font-semibold text-[var(--ink)]'
                            : 'border-transparent text-[var(--ink)] hover:border-[rgba(18,18,18,0.3)]'
                      }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-10 space-y-3">
              <button
                type="button"
                onClick={onAddToCart}
                className="flex w-full items-center justify-center gap-3 bg-[var(--ink)] px-6 py-4 text-center text-base font-semibold tracking-[0.08em] text-white transition hover:bg-black"
              >
                <span>ADD TO CART</span>
                <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current stroke-[1.8]">
                  <path d="M7 8V6a5 5 0 0 1 10 0v2" />
                  <path d="M4 8h16l-1 12H5L4 8Z" />
                </svg>
              </button>

              <button
                type="button"
                onClick={onToggleWishlist}
                className="inline-flex items-center gap-2 text-sm text-[var(--muted)] transition hover:text-[var(--ink)]"
              >
                <span className="text-lg leading-none">{liked ? '♥' : '♡'}</span>
                <span>{liked ? 'Saved to wishlist' : 'Save this item'}</span>
              </button>
            </div>

            <div className="mt-10 space-y-1 border-t border-[var(--line)] pt-3">
              {detailPanels.map((panel) => (
                <details
                  key={panel.title}
                  className="group border-b border-[var(--line)]"
                  open={panel.defaultOpen}
                >
                  <summary className="flex list-none items-center justify-between gap-4 py-5 text-[0.98rem] font-medium text-[var(--ink)]">
                    <span>{panel.title}</span>
                    <span className="text-xl leading-none text-[var(--muted)] transition group-open:rotate-45">+</span>
                  </summary>
                  <div className="pb-6 text-[0.98rem] leading-8 text-[var(--muted)]">{panel.body}</div>
                </details>
              ))}
            </div>

            <div className="mt-6 rounded-[0.9rem] bg-[var(--panel)] px-4 py-4 text-sm text-[var(--muted)]">
              <p>Premium fabric: {product.material}</p>
              <p className="mt-2">Customer rating: {product.rating} from {product.reviews} reviews</p>
            </div>
          </div>
        </article>
      </div>

      {relatedProducts.length > 0 && (
        <div className="mt-16 border-t border-[var(--line)] pt-12">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs tracking-[0.3em] text-[var(--gold-deep)]">YOU MAY ALSO LIKE</p>
              <h2 className="mt-3 text-3xl font-semibold uppercase sm:text-4xl">Related Picks</h2>
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
