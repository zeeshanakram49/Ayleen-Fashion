import axiosClient from "./axiosClient";
import type { Category, Product } from "../types/store";
import { API_ROUTES } from "./apiRoutes";

type RawCategory = Record<string, unknown>;
type RawProduct = Record<string, unknown>;

type CatalogData = {
  categories: Category[];
  products: Product[];
};

const DEFAULT_PRODUCT_IMAGE = "/product-fallback.svg";
const DEFAULT_SIZES = ["S", "M", "L", "XL"];
const KNOWN_COLORS = [
  "sand",
  "ice",
  "olive",
  "black",
  "white",
  "cream",
  "grey",
  "gray",
  "navy",
  "blue",
  "green",
  "brown",
  "beige",
  "maroon",
  "red",
];

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function toStringValue(value: unknown): string {
  if (typeof value === "string") return value.trim();
  if (typeof value === "number" || typeof value === "bigint") return String(value);
  return "";
}

function toNumberValue(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const normalized = value.replace(/[^\d.-]/g, "");
    if (!normalized) return null;
    const parsed = Number(normalized);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

function firstNonEmptyString(...values: unknown[]): string {
  for (const value of values) {
    const next = toStringValue(value);
    if (next) return next;
  }
  return "";
}

function firstFiniteNumber(...values: unknown[]): number | null {
  for (const value of values) {
    const next = toNumberValue(value);
    if (next !== null) return next;
  }
  return null;
}

function stripHtml(value: string): string {
  return value
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function dedupeStrings(values: string[]): string[] {
  return Array.from(new Set(values.filter(Boolean)));
}

function normalizeImageUrl(value: string): string {
  if (!value) return DEFAULT_PRODUCT_IMAGE;
  if (/^(https?:)?\/\//i.test(value) || value.startsWith("data:")) return value;
  if (value === DEFAULT_PRODUCT_IMAGE || value.startsWith("/products/")) return value;

  const baseUrl = String(import.meta.env.VITE_API_BASE_URL ?? "").replace(/\/+$/, "");
  const normalizedPath = value.startsWith("/") ? value : `/${value}`;
  return baseUrl ? `${baseUrl}${normalizedPath}` : normalizedPath;
}

function parseStringArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return dedupeStrings(value.map((entry) => toStringValue(entry)));
  }

  if (typeof value !== "string") return [];

  const trimmed = value.trim();
  if (!trimmed) return [];

  try {
    const parsed = JSON.parse(trimmed) as unknown;
    if (Array.isArray(parsed)) {
      return dedupeStrings(parsed.map((entry) => toStringValue(entry)));
    }
  } catch {
    // Fall back to delimited parsing below.
  }

  return dedupeStrings(
    trimmed
      .split(/[|,/]/)
      .map((entry) => entry.trim())
      .filter(Boolean),
  );
}

function collectImageCandidates(raw: RawProduct): string[] {
  const nestedArrays = [
    raw.gallery,
    raw.images,
    raw.photos,
    raw.product_images,
    raw.media,
  ];

  const imageObjects = nestedArrays.flatMap((entry) => {
    if (!Array.isArray(entry)) return [];
    return entry.flatMap((item) => {
      if (typeof item === "string") return [item];
      if (!isRecord(item)) return [];
      return [
        firstNonEmptyString(
          item.url,
          item.photo,
          item.image,
          item.path,
          item.src,
        ),
      ];
    });
  });

  return dedupeStrings(
    [
      firstNonEmptyString(
        raw.photo,
        raw.image,
        raw.thumbnail,
        raw.featured_image,
        raw.featuredImage,
      ),
      ...imageObjects,
    ]
      .map((entry) => normalizeImageUrl(entry))
      .filter(Boolean),
  );
}

function inferColorsFromTitle(title: string): string[] {
  const normalizedTitle = title.toLowerCase();

  return KNOWN_COLORS.filter((color) => normalizedTitle.includes(color)).map((color) =>
    color.charAt(0).toUpperCase() + color.slice(1),
  );
}

function extractColors(raw: RawProduct, title: string): string[] {
  const directColors = [
    ...parseStringArray(raw.colors),
    ...parseStringArray(raw.color),
    ...parseStringArray(raw.colour),
    ...parseStringArray(raw.available_colors),
  ];

  if (directColors.length > 0) return dedupeStrings(directColors);

  const inferred = inferColorsFromTitle(title);
  return inferred.length > 0 ? inferred : ["Default"];
}

function extractSizes(raw: RawProduct): string[] {
  const directSizes = [
    ...parseStringArray(raw.sizes),
    ...parseStringArray(raw.size),
    ...parseStringArray(raw.available_sizes),
  ];

  if (directSizes.length > 0) return dedupeStrings(directSizes.map((size) => size.toUpperCase()));
  return DEFAULT_SIZES;
}

function buildTags(raw: RawProduct, title: string, categoryLabel: string, badge: string, colors: string[], fit: string): string[] {
  const seed = [
    ...parseStringArray(raw.tags),
    ...parseStringArray(raw.keywords),
    title,
    categoryLabel,
    badge,
    fit,
    ...colors,
  ];

  const exploded = seed.flatMap((entry) =>
    entry
      .split(/\s+/)
      .map((piece) => slugify(piece))
      .filter(Boolean),
  );

  if (badge.toLowerCase().includes("sale")) exploded.push("sale");
  if (badge.toLowerCase().includes("new")) exploded.push("new-in");

  return dedupeStrings(exploded);
}

function resolveBadge(raw: RawProduct, price: number, oldPrice: number): string {
  const explicitBadge = firstNonEmptyString(raw.badge, raw.label, raw.ribbon);
  if (explicitBadge) return explicitBadge;

  if (oldPrice > price) return "Sale";

  const createdAt = firstNonEmptyString(raw.created_at, raw.createdAt);
  if (createdAt) {
    const createdTime = Date.parse(createdAt);
    if (!Number.isNaN(createdTime)) {
      const daysOld = Math.floor((Date.now() - createdTime) / 86_400_000);
      if (daysOld <= 30) return "New In";
    }
  }

  return "Featured";
}

function extractListData<T>(payload: unknown): T[] {
  if (Array.isArray(payload)) return payload as T[];
  if (!isRecord(payload)) return [];

  if (Array.isArray(payload.data)) return payload.data as T[];
  if (isRecord(payload.payload)) {
    const nestedPayload = payload.payload;
    if (Array.isArray(nestedPayload.data)) return nestedPayload.data as T[];
    if (Array.isArray(nestedPayload.products)) return nestedPayload.products as T[];
    if (Array.isArray(nestedPayload.categories)) return nestedPayload.categories as T[];
    if (Array.isArray(nestedPayload.favorites)) return nestedPayload.favorites as T[];
  }

  if (Array.isArray(payload.products)) return payload.products as T[];
  if (Array.isArray(payload.categories)) return payload.categories as T[];
  if (Array.isArray(payload.favorites)) return payload.favorites as T[];
  return [];
}

function extractTotalPages(payload: unknown): number {
  if (!isRecord(payload)) return 1;

  const directPagination = isRecord(payload.pagination) ? payload.pagination : null;
  if (directPagination) {
    return Math.max(1, Number(directPagination.total_pages ?? 1) || 1);
  }

  const nestedPayload = isRecord(payload.payload) ? payload.payload : null;
  const nestedPagination =
    nestedPayload && isRecord(nestedPayload.pagination) ? nestedPayload.pagination : null;
  return Math.max(1, Number(nestedPagination?.total_pages ?? 1) || 1);
}

async function fetchPaginatedItems<T extends Record<string, unknown>>(endpoint: string): Promise<T[]> {
  const items: T[] = [];
  let currentPage = 1;
  let totalPages = 1;

  do {
    const response = await axiosClient.get(endpoint, {
      params: currentPage > 1 ? { page: currentPage } : undefined,
    });
    const pageItems = extractListData<T>(response.data);
    items.push(...pageItems);
    totalPages = extractTotalPages(response.data);
    currentPage += 1;
  } while (currentPage <= totalPages && currentPage <= 50);

  return items;
}

function mapRawCategory(raw: RawCategory): Category {
  const name = firstNonEmptyString(raw.title, raw.name, raw.slug, "Collection");
  const slug = slugify(firstNonEmptyString(raw.slug, name, raw.id));

  return {
    id: slug || firstNonEmptyString(raw.id, name),
    name,
    subtitle: stripHtml(firstNonEmptyString(raw.summary, `Shop ${name}`)) || `Shop ${name}`,
    items: 0,
    image: normalizeImageUrl(firstNonEmptyString(raw.photo)),
  };
}

function mapRawProduct(
  raw: RawProduct,
  categoriesByBackendId: Map<string, Category>,
  categoriesBySlug: Map<string, Category>,
): Product {
  const title = firstNonEmptyString(
    raw.title,
    raw.name,
    raw.product_name,
    raw.label,
    "Untitled Product",
  );
  const categoryRecord = isRecord(raw.category) ? raw.category : null;
  const rawCategoryId = firstNonEmptyString(
    raw.category_id,
    raw.categoryId,
    categoryRecord?.id,
  );
  const rawCategorySlug = slugify(
    firstNonEmptyString(
      raw.category_slug,
      raw.categorySlug,
      categoryRecord?.slug,
      raw.category_name,
      raw.category_title,
      categoryRecord?.title,
    ),
  );
  const matchedCategory =
    categoriesByBackendId.get(rawCategoryId) ??
    categoriesBySlug.get(rawCategorySlug) ??
    null;

  const categoryId = matchedCategory?.id || rawCategorySlug || "all";
  const categoryLabel =
    matchedCategory?.name ||
    firstNonEmptyString(
      raw.category_name,
      raw.category_title,
      categoryRecord?.title,
      "Collection",
    );
  const gallery = collectImageCandidates(raw);
  const image = gallery[0] ?? DEFAULT_PRODUCT_IMAGE;
  const fit = firstNonEmptyString(raw.fit, raw.style, raw.type, "Regular Fit");
  const price = firstFiniteNumber(
    raw.sale_price,
    raw.discount_price,
    raw.final_price,
    raw.special_price,
    raw.price,
    raw.regular_price,
    raw.mrp,
    0,
  ) ?? 0;
  const oldPrice = Math.max(
    price,
    firstFiniteNumber(
      raw.old_price,
      raw.compare_at_price,
      raw.original_price,
      raw.regular_price,
      raw.price,
      raw.mrp,
      price,
    ) ?? price,
  );
  const colors = extractColors(raw, title);
  const badge = resolveBadge(raw, price, oldPrice);
  const description =
    stripHtml(
      firstNonEmptyString(
        raw.description,
        raw.summary,
        raw.short_description,
        raw.shortDescription,
      ),
    ) || title;
  const details =
    stripHtml(
      firstNonEmptyString(
        raw.details,
        raw.long_description,
        raw.longDescription,
        raw.description,
        raw.summary,
      ),
    ) || description;
  const material = firstNonEmptyString(
    raw.material,
    raw.fabric,
    raw.composition,
    "Premium Blend",
  );
  const stock = Math.max(
    0,
    Math.round(firstFiniteNumber(raw.stock, raw.quantity, raw.qty, raw.inventory, 10) ?? 10),
  );
  const sizes = extractSizes(raw);
  const rating = firstFiniteNumber(raw.rating, raw.avg_rating, raw.average_rating, 4.8) ?? 4.8;
  const reviews = Math.max(
    0,
    Math.round(firstFiniteNumber(raw.reviews, raw.review_count, raw.total_reviews, 0) ?? 0),
  );

  return {
    id: firstNonEmptyString(raw.id, raw.product_id, slugify(title)),
    slug: slugify(firstNonEmptyString(raw.slug, title, raw.id)) || slugify(title),
    title,
    categoryId,
    categoryLabel,
    tags: buildTags(raw, title, categoryLabel, badge, colors, fit),
    fit,
    price,
    oldPrice,
    badge,
    image,
    gallery: gallery.length > 0 ? gallery : [image],
    colors,
    description,
    details,
    material,
    stock,
    sizes,
    rating,
    reviews,
  };
}

export async function fetchCatalog(): Promise<CatalogData> {
  const [rawCategories, rawProducts] = await Promise.all([
    fetchPaginatedItems<RawCategory>(API_ROUTES.catalog.categories),
    fetchPaginatedItems<RawProduct>(API_ROUTES.catalog.products),
  ]);

  const categories = new Map<string, Category>();
  const categoriesByBackendId = new Map<string, Category>();
  const categoriesBySlug = new Map<string, Category>();

  rawCategories.forEach((rawCategory) => {
    const mapped = mapRawCategory(rawCategory);

    if (!categories.has(mapped.id)) {
      categories.set(mapped.id, mapped);
    }

    const stableCategory = categories.get(mapped.id) ?? mapped;
    const backendId = firstNonEmptyString(rawCategory.id);
    if (backendId) categoriesByBackendId.set(backendId, stableCategory);
    categoriesBySlug.set(stableCategory.id, stableCategory);
  });

  const products = rawProducts.map((rawProduct) =>
    mapRawProduct(rawProduct, categoriesByBackendId, categoriesBySlug),
  );

  products.forEach((product) => {
    if (!categories.has(product.categoryId)) {
      categories.set(product.categoryId, {
        id: product.categoryId,
        name: product.categoryLabel,
        subtitle: `Shop ${product.categoryLabel}`,
        items: 0,
        image: product.image,
      });
    }
  });

  const productCountByCategory = products.reduce<Record<string, number>>((acc, product) => {
    acc[product.categoryId] = (acc[product.categoryId] ?? 0) + 1;
    return acc;
  }, {});

  const finalizedCategories = Array.from(categories.values()).map((category) => ({
    ...category,
    items: productCountByCategory[category.id] ?? 0,
  }));

  return {
    categories: finalizedCategories,
    products,
  };
}

function extractFavoriteProductId(item: unknown): string {
  if (typeof item === "string" || typeof item === "number") {
    return String(item);
  }

  if (!isRecord(item)) return "";

  if (item.product_id !== undefined && item.product_id !== null) {
    return String(item.product_id);
  }

  if (isRecord(item.product) && item.product.id !== undefined && item.product.id !== null) {
    return String(item.product.id);
  }

  const title = firstNonEmptyString(item.title, item.name, item.product_name);
  const looksLikeProduct = title || item.price !== undefined || item.slug !== undefined;
  if (looksLikeProduct && item.id !== undefined && item.id !== null) {
    return String(item.id);
  }

  return "";
}

export async function fetchFavoriteProductIds(): Promise<string[]> {
  const response = await axiosClient.get(API_ROUTES.wishlist.legacyList);
  const favorites = extractListData<unknown>(response.data);

  return dedupeStrings(
    favorites
      .map((item) => extractFavoriteProductId(item))
      .filter(Boolean),
  );
}

export async function addFavoriteProduct(productId: string): Promise<unknown> {
  const formData = new FormData();
  formData.append("product_id", productId);

  const response = await axiosClient.post(API_ROUTES.wishlist.legacyAdd, formData);
  return response.data;
}

export async function removeFavoriteProduct(productId: string): Promise<unknown> {
  const formData = new FormData();
  formData.append("product_id", productId);

  const response = await axiosClient.post(API_ROUTES.wishlist.legacyRemove, formData);
  return response.data;
}
