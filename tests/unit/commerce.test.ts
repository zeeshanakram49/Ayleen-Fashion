import { describe, expect, it } from "vitest";
import { cartLineKey, cartSummary } from "@/lib/commerce/cart";
import { createMetadata } from "@/lib/seo/metadata";
import {
  amountUntilFreeShipping,
  calculateDiscount,
  cartSubtotal,
  formatPrice,
} from "@/lib/utils/format";
import {
  isProductAvailable,
  isVariantSelectionComplete,
} from "@/lib/utils/product";
import { isLightColorCode, resolveProductColorCode } from "@/lib/utils/color";
import type { CartLine } from "@/types/commerce";

const line: CartLine = {
  key: "14:M:default",
  productId: "14",
  slug: "relaxed-t-shirt",
  name: "Relaxed T Shirt",
  image: null,
  price: 2025,
  size: "M",
  color: "",
  quantity: 2,
  stock: 14,
};

describe("commerce utilities", () => {
  it("formats Pakistani Rupees consistently", () =>
    expect(formatPrice(4500)).toBe("Rs. 4,500"));
  it("calculates a real discount percentage", () =>
    expect(calculateDiscount(2025, 2250)).toBe(10));
  it("does not report invalid discounts", () =>
    expect(calculateDiscount(2250, 2025)).toBe(0));
  it("calculates cart totals", () => expect(cartSubtotal([line])).toBe(4050));
  it("calculates shipping threshold remaining", () =>
    expect(amountUntilFreeShipping(1500, 2500)).toBe(1000));
  it("never returns negative shipping threshold remaining", () =>
    expect(amountUntilFreeShipping(3000, 2500)).toBe(0));
  it("creates stable variant line keys", () =>
    expect(cartLineKey("14", "M", "Black")).toBe("14:M:Black"));
  it("summarizes quantities and free shipping", () =>
    expect(cartSummary([line])).toMatchObject({
      itemCount: 2,
      subtotal: 4050,
      hasFreeShipping: true,
    }));
});

describe("product availability and variants", () => {
  it("requires both stock and available state", () => {
    expect(isProductAvailable({ stock: 2, isAvailable: true })).toBe(true);
    expect(isProductAvailable({ stock: 0, isAvailable: true })).toBe(false);
  });
  it("requires published variants but not absent variant groups", () => {
    expect(
      isVariantSelectionComplete(
        { sizes: ["S", "M"], colors: [] },
        { size: "M" },
      ),
    ).toBe(true);
    expect(
      isVariantSelectionComplete({ sizes: ["S", "M"], colors: [] }, {}),
    ).toBe(false);
  });
});

describe("product colours", () => {
  it("replaces the API black placeholder for a named colour", () => {
    expect(resolveProductColorCode("Smoke Grey", "#000000")).toBe("#6b7075");
    expect(resolveProductColorCode("Maroon", "#000000")).toBe("#800000");
    expect(resolveProductColorCode("White", "#000000")).toBe("#ffffff");
    expect(resolveProductColorCode("Olive", "#000000")).toBe("#6b6b24");
    expect(resolveProductColorCode("Burgundy", "#000000")).toBe("#800020");
  });

  it("keeps real black and valid API colour codes", () => {
    expect(resolveProductColorCode("Black", "#000000")).toBe("#000000");
    expect(resolveProductColorCode("Olive", "#556b2f")).toBe("#556b2f");
  });

  it("identifies light swatches whose labels need extra contrast", () => {
    expect(isLightColorCode("#ffffff")).toBe(true);
    expect(isLightColorCode("#800000")).toBe(false);
  });
});

describe("SEO metadata", () => {
  it("creates canonical and noindex metadata", () => {
    const metadata = createMetadata({
      title: "Search",
      description: "Find products",
      path: "/search",
      noIndex: true,
    });
    expect(metadata.alternates?.canonical).toBe("https://aylee.store/search");
    expect(metadata.robots).toMatchObject({ index: false, follow: true });
  });
});
