import type { MetadataRoute } from "next";
import { getCategories } from "@/lib/commerce/collections";
import { getProducts } from "@/lib/commerce/products";
import { siteConfig } from "@/config/site";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, categories] = await Promise.all([
    getProducts(),
    getCategories(),
  ]);
  const staticPaths = [
    "",
    "/shop",
    "/collections",
    "/new-arrivals",
    "/sale",
    "/stores",
    "/about",
    "/contact",
    "/size-guide",
    "/shipping-policy",
    "/exchange-policy",
  ];
  return [
    ...staticPaths.map((path) => ({
      url: `${siteConfig.url}${path}`,
      lastModified: new Date(),
      changeFrequency:
        path === "" || path === "/shop"
          ? ("daily" as const)
          : ("monthly" as const),
      priority: path === "" ? 1 : path === "/shop" ? 0.9 : 0.6,
    })),
    ...categories
      .flatMap((category) => [category, ...category.children])
      .map((category) => ({
        url: `${siteConfig.url}/collections/${category.slug}`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.7,
      })),
    ...products.map((product) => ({
      url: `${siteConfig.url}/products/${product.slug}`,
      lastModified: product.createdAt
        ? new Date(product.createdAt)
        : new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
