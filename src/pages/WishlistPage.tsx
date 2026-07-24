import { motion, AnimatePresence } from "framer-motion";
import { IoHeartOutline } from "react-icons/io5";
import { ProductCard } from "../components/ProductCard";
import type { Product } from "../types/store";

type WishlistPageProps = {
  products: Product[];
  wishlist: string[];
  selectedSize: Record<string, string>;
  onPickSize: (productId: string, size: string) => void;
  onToggleWishlist: (productId: string) => void;
  onAddToCart: (
    productId: string,
    fallbackSize?: string,
    requireSelection?: boolean,
    qty?: number,
  ) => void;
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
    <section className="mx-auto max-w-[1400px] px-6 py-24 md:px-12 md:py-32">
      {/* Header */}
      <div className="border-b border-black/5 pb-8 mb-12 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold tracking-[0.3em] text-[var(--gold-deep)] uppercase">
            Personal Curation
          </span>
          <h1 className="font-editorial text-4xl sm:text-5xl font-bold text-[var(--ink)] mt-3">
            Wishlist
          </h1>
        </div>
        <p className="text-xs font-semibold text-[var(--muted)] tracking-wider">
          {products.length} ITEMS SAVED
        </p>
      </div>

      {products.length === 0 ? (
        // Empty State
        <motion.article
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-3xl border border-black/5 bg-[var(--panel)] p-12 text-center max-w-lg mx-auto py-20"
        >
          <IoHeartOutline className="text-5xl text-black/20 border-2 border-dashed border-black/10 rounded-full p-2 mx-auto" />
          <h2 className="font-editorial text-2xl mt-6 font-semibold text-[var(--ink)]">
            Your wishlist is empty
          </h2>
          <p className="text-xs text-[var(--muted)] mt-2 leading-relaxed max-w-xs mx-auto">
            Save items that catch your eye here. Review and add them to your bag anytime.
          </p>
          <a
            href="#/shop"
            className="mt-8 inline-flex rounded-full bg-[var(--ink)] px-8 py-3.5 text-xs font-bold tracking-widest text-white hover:bg-[var(--gold-deep)] transition shadow-md"
          >
            DISCOVER PIECES
          </a>
        </motion.article>
      ) : (
        // Wishlist Grid
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence>
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                <ProductCard
                  product={product}
                  index={index}
                  liked={wishlist.includes(product.id)}
                  pickedSize={selectedSize[product.id]}
                  onPickSize={onPickSize}
                  onToggleWishlist={onToggleWishlist}
                  onAddToCart={onAddToCart}
                  onOpenProduct={onOpenProduct}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </section>
  );
}
