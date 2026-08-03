import type { CartLine } from "@/types/commerce";
import { amountUntilFreeShipping, cartSubtotal } from "@/lib/utils/format";

export function cartLineKey(productId: string, size = "", color = ""): string {
  return [productId, size || "standard", color || "default"].join(":");
}

export function cartSummary(lines: CartLine[]) {
  const subtotal = cartSubtotal(lines);
  return {
    itemCount: lines.reduce((count, line) => count + line.quantity, 0),
    subtotal,
    remainingForFreeShipping: amountUntilFreeShipping(subtotal),
    hasFreeShipping: amountUntilFreeShipping(subtotal) === 0,
  };
}
