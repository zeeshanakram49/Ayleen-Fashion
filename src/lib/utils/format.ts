import { siteConfig } from "@/config/site";

export function formatPrice(value: number): string {
  const safeValue = Number.isFinite(value) ? value : 0;
  return `${siteConfig.currencyLabel} ${new Intl.NumberFormat("en-PK", {
    maximumFractionDigits: 0,
  }).format(Math.round(safeValue))}`;
}

export function calculateDiscount(
  price: number,
  compareAtPrice: number | null,
): number {
  if (!compareAtPrice || compareAtPrice <= price || compareAtPrice <= 0)
    return 0;
  return Math.round(((compareAtPrice - price) / compareAtPrice) * 100);
}

export function cartSubtotal(
  lines: Array<{ price: number; quantity: number }>,
): number {
  return lines.reduce((total, line) => total + line.price * line.quantity, 0);
}

export function amountUntilFreeShipping(
  subtotal: number,
  threshold = siteConfig.freeShippingThreshold,
): number {
  return Math.max(0, threshold - subtotal);
}

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function stripHtml(value: string): string {
  return value
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#039;/gi, "'")
    .replace(/\s+/g, " ")
    .trim();
}
