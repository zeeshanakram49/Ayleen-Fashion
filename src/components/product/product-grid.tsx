import type { Product } from "@/types/commerce";
import { ProductCard } from "./product-card";
import { Reveal } from "@/components/motion/reveal";

export function ProductGrid({
  products,
  eagerCount = 0,
}: {
  products: Product[];
  eagerCount?: number;
}) {
  return (
    <div className="grid grid-cols-2 gap-x-3 gap-y-10 sm:gap-x-5 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-6 lg:gap-y-14">
      {products.map((product, index) => (
        <Reveal key={product.id} delay={(index % 4) * 0.08} y={20}>
          <ProductCard product={product} eager={index < eagerCount} />
        </Reveal>
      ))}
    </div>
  );
}
