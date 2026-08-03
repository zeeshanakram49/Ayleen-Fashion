"use client";

import { EmptyState } from "@/components/common/empty-state";
import { useStore } from "@/components/providers/store-provider";
import { ProductGrid } from "./product-grid";
import type { Product } from "@/types/commerce";

export function WishlistView({ products }: { products: Product[] }) {
  const { wishlist } = useStore();
  const saved = products.filter((product) => wishlist.includes(product.id));
  if (!saved.length)
    return (
      <EmptyState
        title="Your wishlist is empty"
        message="Use the heart on any product to save it for later on this device."
      />
    );
  return <ProductGrid products={saved} />;
}
