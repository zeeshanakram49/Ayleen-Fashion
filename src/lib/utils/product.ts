import type { Product } from "@/types/commerce";

export function isProductAvailable(
  product: Pick<Product, "stock" | "isAvailable">,
): boolean {
  return product.isAvailable && product.stock > 0;
}

export function isVariantSelectionComplete(
  product: Pick<Product, "sizes" | "colors">,
  selected: { size?: string; color?: string },
): boolean {
  const sizeComplete = product.sizes.length === 0 || Boolean(selected.size);
  const colorComplete = product.colors.length === 0 || Boolean(selected.color);
  return sizeComplete && colorComplete;
}
