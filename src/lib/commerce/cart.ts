import type { CartLine } from "@/types/commerce";
import { amountUntilFreeShipping, cartSubtotal } from "@/lib/utils/format";
import { siteConfig } from "@/config/site";

export function cartLineKey(productId: string, size = "", color = ""): string {
  return [productId, size || "standard", color || "default"].join(":");
}

export function cartSummary(lines: CartLine[]) {
  const subtotal = cartSubtotal(lines);
  const remainingForFreeShipping = amountUntilFreeShipping(subtotal);
  const hasFreeShipping = remainingForFreeShipping === 0;
  const shippingFee =
    hasFreeShipping || lines.length === 0 ? 0 : siteConfig.shippingFee;
  return {
    itemCount: lines.reduce((count, line) => count + line.quantity, 0),
    subtotal,
    remainingForFreeShipping,
    hasFreeShipping,
    shippingFee,
    total: subtotal + shippingFee,
  };
}
