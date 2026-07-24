import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Navigation, Thumbs } from "swiper/modules";
import {
  IoHeartOutline,
  IoHeart,
  IoHelpCircleOutline,
  IoAddOutline,
  IoRemoveOutline,
  IoCloseOutline,
} from "react-icons/io5";

// Swiper Styles
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";

import { ProductCard } from "../components/ProductCard";
import { discountPercent, installmentAmount, money } from "../lib/store";
import { products } from "../data/store";
import type { Product } from "../types/store";

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
  onCardAddToCart: (
    productId: string,
    fallbackSize?: string,
    requireSelection?: boolean,
    qty?: number,
  ) => void;
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
  const [thumbsSwiper, setThumbsSwiper] = useState<any>(null);
  const [qty, setQty] = useState(1);
  const [selectedColor, setSelectedColor] = useState(product.colors[0] || "");
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [activeTab, setActiveTab] = useState<"fabric" | "delivery" | "returns">("fabric");
  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>([]);
  const [isStickyVisible, setIsStickyVisible] = useState(false);

  const salePercent = discountPercent(product.price, product.oldPrice);

  // Recently Viewed Logic
  useEffect(() => {
    try {
      const stored = localStorage.getItem("ayleen_recently_viewed");
      let list: string[] = stored ? JSON.parse(stored) : [];
      // Remove current product if already exists, then prepend
      list = list.filter((id) => id !== product.id);
      list.unshift(product.id);
      // Limit to 4 items
      list = list.slice(0, 5);
      localStorage.setItem("ayleen_recently_viewed", JSON.stringify(list));

      // Load product details
      const viewedProducts = list
        .map((id) => products.find((p) => p.id === id))
        .filter((p): p is Product => p !== undefined && p.id !== product.id)
        .slice(0, 4);

      setRecentlyViewed(viewedProducts);
    } catch (e) {
      console.error(e);
    }
  }, [product.id]);

  // Scroll Listener for Sticky Bar
  useEffect(() => {
    const handleScroll = () => {
      const mainBtn = document.getElementById("main-add-to-cart-btn");
      if (mainBtn) {
        const rect = mainBtn.getBoundingClientRect();
        setIsStickyVisible(rect.bottom < 0);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleBuyNow = () => {
    // Add to cart and redirect immediately to checkout
    onAddToCart();
    window.location.hash = "/checkout";
  };

  return (
    <section className="mx-auto max-w-[1500px] px-6 py-24 md:px-12 md:py-32">
      {/* Breadcrumbs */}
      <div className="text-xs text-[var(--muted)] mb-8 flex gap-2 items-center tracking-wider font-semibold">
        <a href="#/" className="hover:text-[var(--ink)]">HOME</a>
        <span>/</span>
        <a href="#/shop" className="hover:text-[var(--ink)]">SHOP</a>
        <span>/</span>
        <span className="text-[var(--ink)] select-none truncate uppercase">{product.title}</span>
      </div>

      <div className="grid gap-12 lg:grid-cols-12 items-start">
        {/* Left Column - Large Galleries & Thumbnails */}
        <div className="lg:col-span-7 space-y-4">
          <Swiper
            style={{
              "--swiper-navigation-color": "#111",
              "--swiper-pagination-color": "#111",
            } as any}
            spaceBetween={10}
            navigation={true}
            thumbs={{ swiper: thumbsSwiper }}
            modules={[FreeMode, Navigation, Thumbs]}
            className="aspect-[3/4] w-full rounded-3xl bg-[var(--panel)] overflow-hidden"
          >
            {product.gallery.map((img, idx) => (
              <SwiperSlide key={idx} className="h-full w-full">
                <img
                  src={img}
                  alt={`${product.title} view ${idx + 1}`}
                  className="h-full w-full object-cover object-top"
                />
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Thumbnail Slider */}
          <Swiper
            onSwiper={setThumbsSwiper}
            spaceBetween={10}
            slidesPerView={4}
            freeMode={true}
            watchSlidesProgress={true}
            modules={[FreeMode, Navigation, Thumbs]}
            className="h-24 w-full"
          >
            {product.gallery.map((img, idx) => (
              <SwiperSlide
                key={idx}
                className="rounded-xl overflow-hidden bg-[var(--panel)] cursor-pointer opacity-60 hover:opacity-100 transition [&.swiper-slide-thumb-active]:opacity-100 [&.swiper-slide-thumb-active]:border [&.swiper-slide-thumb-active]:border-[var(--ink)]"
              >
                <img
                  src={img}
                  alt={`${product.title} thumb ${idx + 1}`}
                  className="h-full w-full object-cover object-center"
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Right Column - Product Information */}
        <div className="lg:col-span-5 space-y-8">
          <div className="space-y-4">
            <span className="text-[10px] font-bold tracking-[0.3em] text-[var(--gold-deep)] uppercase">
              {product.categoryLabel}
            </span>
            <h1 className="font-editorial text-4xl md:text-5xl font-bold text-[var(--ink)] leading-tight">
              {product.title}
            </h1>

            <div className="flex items-baseline gap-3">
              <span className="text-2xl font-semibold text-[var(--ink)]">
                {money(product.price)}
              </span>
              {product.oldPrice > product.price && (
                <span className="text-base text-[var(--muted)] line-through">
                  {money(product.oldPrice)}
                </span>
              )}
              {salePercent > 0 && (
                <span className="rounded-full bg-red-50 text-red-600 px-3 py-1 text-[10px] font-bold tracking-wider">
                  SAVE {salePercent}%
                </span>
              )}
            </div>

            <p className="text-xs text-[var(--muted)] leading-relaxed">
              Or 3 interest-free installments of <span className="font-bold text-[var(--ink)]">{money(installmentAmount(product.price))}</span> with custom payment terms.
            </p>
          </div>

          {/* Description */}
          <p className="text-sm text-[var(--muted)] leading-relaxed">
            {product.description}
          </p>

          <hr className="border-black/5" />

          {/* Color Swatches */}
          <div className="space-y-3">
            <div className="flex justify-between text-xs">
              <span className="font-bold tracking-wider text-[var(--ink)]">COLOR</span>
              <span className="text-[var(--muted)] uppercase">{selectedColor}</span>
            </div>
            <div className="flex gap-2">
              {product.colors.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setSelectedColor(color)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold border transition ${
                    selectedColor === color
                      ? "bg-[var(--ink)] border-[var(--ink)] text-white"
                      : "bg-white border-black/10 hover:border-black/30 text-[var(--ink)]"
                  }`}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>

          {/* Sizes and Size Guide */}
          <div className="space-y-3">
            <div className="flex justify-between text-xs">
              <span className="font-bold tracking-wider text-[var(--ink)]">SIZE</span>
              <button
                onClick={() => setShowSizeGuide(true)}
                className="text-[var(--gold-deep)] hover:underline flex items-center gap-1 font-semibold"
              >
                <IoHelpCircleOutline className="text-base" />
                <span>Size Guide</span>
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => onPickSize(size)}
                  className={`h-11 min-w-11 rounded-xl border text-xs font-bold flex items-center justify-center px-3 transition ${
                    pickedSize === size
                      ? "bg-[var(--ink)] border-[var(--ink)] text-white"
                      : "border-black/10 hover:border-black/30 text-[var(--ink)]"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity Selector */}
          <div className="space-y-3">
            <span className="text-xs font-bold tracking-wider text-[var(--ink)]">QUANTITY</span>
            <div className="flex items-center border border-black/10 rounded-xl overflow-hidden h-11 w-32 bg-white">
              <button
                type="button"
                onClick={() => setQty((prev) => Math.max(1, prev - 1))}
                className="flex h-full w-10 items-center justify-center text-lg text-[var(--muted)] hover:bg-black/5"
              >
                <IoRemoveOutline />
              </button>
              <span className="flex-1 text-center text-sm font-semibold text-[var(--ink)]">
                {qty}
              </span>
              <button
                type="button"
                onClick={() => setQty((prev) => Math.min(product.stock, prev + 1))}
                className="flex h-full w-10 items-center justify-center text-lg text-[var(--muted)] hover:bg-black/5"
              >
                <IoAddOutline />
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid gap-3 sm:grid-cols-2 pt-2">
            <button
              id="main-add-to-cart-btn"
              onClick={onAddToCart}
              className="h-12 w-full rounded-xl bg-[var(--ink)] text-white text-xs font-bold tracking-[0.2em] transition hover:bg-[var(--gold-deep)] shadow-sm"
            >
              ADD TO BAG
            </button>
            <button
              onClick={handleBuyNow}
              className="h-12 w-full rounded-xl border-2 border-[var(--ink)] text-[var(--ink)] text-xs font-bold tracking-[0.2em] transition hover:bg-[var(--ink)] hover:text-white"
            >
              BUY IT NOW
            </button>
          </div>

          {/* Wishlist Button */}
          <button
            onClick={onToggleWishlist}
            className="w-full h-11 flex items-center justify-center gap-2 border border-black/10 rounded-xl text-xs font-bold tracking-wider text-[var(--ink)] hover:bg-black/[0.02] transition"
          >
            {liked ? (
              <>
                <IoHeart className="text-red-500 text-lg" />
                <span>REMOVE FROM WISHLIST</span>
              </>
            ) : (
              <>
                <IoHeartOutline className="text-lg" />
                <span>ADD TO WISHLIST</span>
              </>
            )}
          </button>

          <hr className="border-black/5" />

          {/* Tabs for Fabric, Shipping, Returns */}
          <div className="space-y-4">
            <div className="flex border-b border-black/5">
              {[
                { id: "fabric", label: "FABRIC & CARE" },
                { id: "delivery", label: "SHIPPING" },
                { id: "returns", label: "RETURNS" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex-1 py-3 text-[9px] font-bold tracking-widest text-center relative transition ${
                    activeTab === tab.id ? "text-[var(--ink)]" : "text-[var(--muted)]"
                  }`}
                >
                  {tab.label}
                  {activeTab === tab.id && (
                    <motion.div
                      layoutId="activeProductTabLine"
                      className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[var(--ink)]"
                    />
                  )}
                </button>
              ))}
            </div>

            <div className="text-xs text-[var(--muted)] leading-relaxed p-2 min-h-[80px]">
              {activeTab === "fabric" && (
                <p>
                  Crafted from a premium blend of {product.material || "long-staple cotton"}. Hand wash cold or dry clean recommended to maintain texture structure. Lay flat to dry in shade. Iron low if needed.
                </p>
              )}
              {activeTab === "delivery" && (
                <p>
                  Complimentary nationwide shipping on orders above PKR 6,000. Under threshold, flat shipping of PKR 250 applies. Delivery takes 2 to 4 working days for major cities and 5 to 7 days elsewhere.
                </p>
              )}
              {activeTab === "returns" && (
                <p>
                  We offer hassle-free exchanges within 7 days of delivery. The item must be unworn, in original packaging, and with all product tags intact. Sale items are eligible for size exchanges only.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Related Products Slider */}
      {relatedProducts.length > 0 && (
        <div className="mt-28">
          <div className="mb-8">
            <span className="text-[10px] font-bold tracking-[0.3em] text-[var(--gold-deep)] uppercase">
              Curated Pairs
            </span>
            <h2 className="font-editorial mt-3 text-3xl font-bold text-[var(--ink)]">
              You May Also Like
            </h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
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

      {/* Recently Viewed Slider */}
      {recentlyViewed.length > 0 && (
        <div className="mt-20">
          <div className="mb-8">
            <span className="text-[10px] font-bold tracking-[0.3em] text-[var(--gold-deep)] uppercase">
              Recent History
            </span>
            <h2 className="font-editorial mt-3 text-3xl font-bold text-[var(--ink)]">
              Recently Viewed
            </h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {recentlyViewed.map((item, index) => (
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

      {/* 5. SIZE GUIDE MODAL */}
      <AnimatePresence>
        {showSizeGuide && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSizeGuide(false)}
              className="fixed inset-0 z-50 bg-black"
            />
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-x-4 top-1/2 -translate-y-1/2 z-50 mx-auto max-w-lg rounded-3xl bg-white p-6 md:p-8 shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-black/5 pb-4 mb-6">
                <h3 className="font-editorial text-2xl font-bold text-[var(--ink)]">
                  Size Chart Guide
                </h3>
                <button
                  onClick={() => setShowSizeGuide(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-black/5 text-xl"
                >
                  <IoCloseOutline />
                </button>
              </div>

              <div className="space-y-4">
                <p className="text-xs text-[var(--muted)] leading-relaxed">
                  Measurements are taken flat in inches. Fits may vary slightly depending on the fabric structure and style.
                </p>
                <div className="overflow-x-auto rounded-xl border border-black/5">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-black/[0.02] font-bold text-[var(--ink)] border-b border-black/5">
                      <tr>
                        <th className="p-3">SIZE</th>
                        <th className="p-3">CHEST</th>
                        <th className="p-3">LENGTH</th>
                        <th className="p-3">SHOULDER</th>
                        <th className="p-3">SLEEVE</th>
                      </tr>
                    </thead>
                    <tbody className="text-[var(--muted)] divide-y divide-black/5">
                      {[
                        { size: "XS", chest: "38\"", length: "26.5\"", shoulder: "17\"", sleeve: "7.5\"" },
                        { size: "S", chest: "40\"", length: "27\"", shoulder: "17.5\"", sleeve: "8\"" },
                        { size: "M", chest: "42\"", length: "28\"", shoulder: "18.5\"", sleeve: "8.5\"" },
                        { size: "L", chest: "44\"", length: "29\"", shoulder: "19.5\"", sleeve: "9\"" },
                        { size: "XL", chest: "47\"", length: "30\"", shoulder: "20.5\"", sleeve: "9.5\"" },
                      ].map((row) => (
                        <tr key={row.size} className="hover:bg-black/[0.005]">
                          <td className="p-3 font-bold text-[var(--ink)]">{row.size}</td>
                          <td className="p-3">{row.chest}</td>
                          <td className="p-3">{row.length}</td>
                          <td className="p-3">{row.shoulder}</td>
                          <td className="p-3">{row.sleeve}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* 6. MOBILE STICKY ADD-TO-BAG BAR */}
      <AnimatePresence>
        {isStickyVisible && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed bottom-0 left-0 right-0 z-40 border-t border-black/5 bg-white/95 backdrop-blur px-6 py-4 flex items-center justify-between gap-4 lg:hidden"
          >
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-xs text-[var(--ink)] truncate uppercase">
                {product.title}
              </h4>
              <p className="text-xs font-bold text-[var(--gold-deep)] mt-0.5">
                {money(product.price)}
              </p>
            </div>
            <div className="flex gap-2 shrink-0">
              <button
                onClick={onAddToCart}
                className="h-10 rounded-xl bg-[var(--ink)] px-5 text-[10px] font-bold tracking-widest text-white hover:bg-[var(--gold-deep)] transition"
              >
                ADD TO BAG
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
