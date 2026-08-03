import "server-only";

import { unstable_cache } from "next/cache";
import type {
  Banner,
  Category,
  Product,
  ProductImage,
  ProductQuery,
} from "@/types/commerce";
import { slugify, stripHtml } from "@/lib/utils/format";
import { commerceConfig } from "./config";
import { getCategories } from "./collections";
import {
  asNumber,
  asString,
  fetchCommerce,
  isRecord,
  listFromResponse,
  recordFromResponse,
} from "./http";
import { fallbackBanners, fallbackProducts } from "./fallback";

function normalizeImageUrl(value: string): string {
  if (!value) return "";
  if (/^https?:\/\//i.test(value))
    return value.replace(/^http:\/\//i, "https://");
  const path = value.startsWith("/") ? value : `/${value}`;
  return `${commerceConfig.apiUrl}${path}`;
}

function stringList(value: unknown): string[] {
  if (Array.isArray(value))
    return [...new Set(value.map(asString).filter(Boolean))];
  const raw = asString(value);
  if (!raw) return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    if (Array.isArray(parsed))
      return [...new Set(parsed.map(asString).filter(Boolean))];
  } catch {
    // Delimited fields are handled below.
  }
  return [
    ...new Set(
      raw
        .split(/[|,]/)
        .map((entry) => entry.trim())
        .filter(Boolean),
    ),
  ];
}

function normalizeImages(value: unknown, productName: string): ProductImage[] {
  const photos = Array.isArray(value) ? value : value ? [value] : [];
  return photos
    .map((photo, index): ProductImage | null => {
      if (typeof photo === "string") {
        const url = normalizeImageUrl(photo);
        return url
          ? {
              id: String(index),
              url,
              thumbnailUrl: url,
              alt: `${productName} view ${index + 1}`,
            }
          : null;
      }
      if (!isRecord(photo)) return null;
      const url = normalizeImageUrl(
        asString(photo.url) || asString(photo.image) || asString(photo.path),
      );
      if (!url) return null;
      return {
        id: asString(photo.id) || String(index),
        url,
        thumbnailUrl: normalizeImageUrl(asString(photo.thumbnail_url)) || url,
        alt: index === 0 ? productName : `${productName} view ${index + 1}`,
      };
    })
    .filter((entry): entry is ProductImage => Boolean(entry));
}

function categoryForProduct(
  value: unknown,
  categories: Category[],
): Product["category"] {
  if (!isRecord(value)) return null;
  const id = asString(value.id);
  const name = asString(value.name) || asString(value.title);
  const match = categories.find(
    (category) => category.id === id || category.name === name,
  );
  if (match) return { id: match.id, slug: match.slug, name: match.name };
  if (!id && !name) return null;
  return {
    id: id || slugify(name),
    slug: slugify(name || id),
    name: name || "Collection",
  };
}

export function normalizeProduct(
  value: unknown,
  categories: Category[] = [],
): Product | null {
  if (!isRecord(value)) return null;
  const name = asString(value.title) || asString(value.name);
  const id = asString(value.id) || asString(value.product_id);
  if (!name || !id) return null;

  const basePrice = asNumber(value.price) ?? asNumber(value.regular_price) ?? 0;
  const explicitSalePrice =
    asNumber(value.sale_price) ?? asNumber(value.discount_price);
  const rawDiscount = asNumber(value.discount) ?? 0;
  const discountPercent =
    rawDiscount > 0 && rawDiscount <= 100 ? Math.round(rawDiscount) : null;
  const calculatedPrice = discountPercent
    ? basePrice * (1 - discountPercent / 100)
    : basePrice;
  const price = explicitSalePrice ?? calculatedPrice;
  const compareAtPrice = price < basePrice ? basePrice : null;
  const stock = Math.max(
    0,
    Math.round(asNumber(value.stock) ?? asNumber(value.quantity) ?? 0),
  );
  const images = normalizeImages(
    value.photo ?? value.images ?? value.gallery ?? value.image,
    name,
  );
  const category = categoryForProduct(value.category, categories);
  const colors = stringList(
    value.colors ?? value.color ?? value.available_colors,
  );
  const sizes = stringList(
    value.size ?? value.sizes ?? value.available_sizes,
  ).map((size) => size.toUpperCase());
  const description = stripHtml(
    asString(value.description) ||
      asString(value.summary) ||
      asString(value.short_description),
  );
  const tags = [name, category?.name ?? "", ...colors, ...sizes]
    .flatMap((entry) => entry.split(/\s+/).map(slugify))
    .filter(Boolean);

  return {
    id,
    slug: slugify(asString(value.slug) || name),
    name,
    description,
    price,
    compareAtPrice,
    discountPercent,
    currency: "PKR",
    images,
    stock,
    sizes: [...new Set(sizes)],
    colors: [...new Set(colors)],
    category,
    sku: asString(value.sku) || null,
    brand: isRecord(value.brand)
      ? asString(value.brand.name) || "Aylee"
      : "Aylee",
    isFeatured:
      value.is_featured === true ||
      value.is_featured === 1 ||
      value.is_featured === "1",
    isAvailable:
      asString(value.status).toLowerCase() !== "inactive" && stock > 0,
    createdAt: asString(value.created_at) || null,
    tags: [...new Set(tags)],
  };
}

const getAllProductsCached = unstable_cache(
  async (): Promise<Product[]> => {
    try {
      const categories = await getCategories();
      const first = await fetchCommerce(
        commerceConfig.endpoints.products,
        {},
        { tags: ["products"] },
      );
      const values = listFromResponse(first);
      return values
        .map((value) => normalizeProduct(value, categories))
        .filter((product): product is Product => Boolean(product));
    } catch {
      return fallbackProducts;
    }
  },
  ["commerce-products"],
  { revalidate: commerceConfig.revalidateSeconds, tags: ["products"] },
);

export async function getProducts(
  query: ProductQuery = {},
): Promise<Product[]> {
  let products = [...(await getAllProductsCached())];
  const search = query.query?.trim().toLowerCase();
  if (search) {
    products = products.filter((product) =>
      [
        product.name,
        product.category?.name ?? "",
        product.sku ?? "",
        ...product.tags,
      ]
        .join(" ")
        .toLowerCase()
        .includes(search),
    );
  }
  if (query.category) {
    products = products.filter(
      (product) =>
        product.category?.slug === query.category ||
        product.category?.id === query.category,
    );
  }
  if (query.sale)
    products = products.filter((product) => Boolean(product.compareAtPrice));
  if (query.availability === "in-stock")
    products = products.filter((product) => product.isAvailable);
  if (query.availability === "out-of-stock")
    products = products.filter((product) => !product.isAvailable);
  if (query.minPrice !== undefined)
    products = products.filter((product) => product.price >= query.minPrice!);
  if (query.maxPrice !== undefined)
    products = products.filter((product) => product.price <= query.maxPrice!);
  if (query.size)
    products = products.filter((product) =>
      product.sizes.includes(query.size!.toUpperCase()),
    );
  if (query.color)
    products = products.filter((product) =>
      product.colors.some(
        (color) => color.toLowerCase() === query.color!.toLowerCase(),
      ),
    );

  switch (query.sort) {
    case "newest":
      products.sort(
        (a, b) =>
          Date.parse(b.createdAt || "0") - Date.parse(a.createdAt || "0"),
      );
      break;
    case "price-asc":
      products.sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      products.sort((a, b) => b.price - a.price);
      break;
    case "featured":
    case "best-selling":
    default:
      products.sort((a, b) => Number(b.isFeatured) - Number(a.isFeatured));
  }

  return query.limit ? products.slice(0, query.limit) : products;
}

export async function getProduct(slug: string): Promise<Product | null> {
  const categories = await getCategories();
  try {
    const response = await fetchCommerce(
      commerceConfig.endpoints.product(slug),
      {},
      { tags: [`product:${slug}`] },
    );
    const product = normalizeProduct(recordFromResponse(response), categories);
    if (product) return product;
  } catch {
    // The live detail endpoint currently returns 500 for some slugs; use the catalog record.
  }
  const products = await getAllProductsCached();
  return products.find((product) => product.slug === slug) ?? null;
}

export async function getRelatedProducts(
  product: Product,
  limit = 4,
): Promise<Product[]> {
  const products = await getProducts({ category: product.category?.slug });
  return products.filter((entry) => entry.id !== product.id).slice(0, limit);
}

const getBannersCached = unstable_cache(
  async (): Promise<Banner[]> => {
    try {
      const response = await fetchCommerce(
        commerceConfig.endpoints.banners,
        {},
        { tags: ["banners"] },
      );
      return listFromResponse(response)
        .map((value): Banner | null => {
          if (!isRecord(value)) return null;
          const image = normalizeImageUrl(
            asString(value.photo) || asString(value.image),
          );
          if (!image) return null;
          return {
            id: asString(value.id) || image,
            title: asString(value.title) || "Aylee",
            description: asString(value.description) || null,
            image,
          };
        })
        .filter((banner): banner is Banner => Boolean(banner));
    } catch {
      return fallbackBanners;
    }
  },
  ["commerce-banners"],
  { revalidate: commerceConfig.revalidateSeconds, tags: ["banners"] },
);

export async function getBanners(): Promise<Banner[]> {
  return getBannersCached();
}
