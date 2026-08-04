import type { Product } from "@/types/commerce";
import { ProductCard } from "./product-card";

export function ProductGrid({
  products,
  eagerCount = 0,
}: {
  products: Product[];
  eagerCount?: number;
}) {
  return (
    <div
      data-reveal
      data-stagger
      className="grid grid-cols-2 gap-x-3 gap-y-10 sm:gap-x-5 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-6 lg:gap-y-14"
    >
      {products.map((product, index) => (
        <ProductCard
          key={product.id}
          product={product}
          eager={index < eagerCount}
        />
      ))}
    </div>
  );
}
