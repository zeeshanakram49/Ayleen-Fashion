import axiosClient from "./axiosClient";
import type { Banner, Category, Product } from "../types/store";
import { API_ROUTES } from "./apiRoutes";
import { ENV } from "../config/env";

type RawCategory = Record<string, unknown>;
type RawProduct = Record<string, unknown>;
type RawBanner = Record<string, unknown>;

type CatalogData = {
  categories: Category[];
  products: Product[];
};

const DEFAULT_PRODUCT_IMAGE = "";
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
  if (typeof value === "number" || typeof value === "bigint")
    return String(value);
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

export function stripHtml(value: string): string {
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

export function normalizeImageUrl(value: string): string {
  if (!value) return DEFAULT_PRODUCT_IMAGE;
  if (/^(https?:)?\/\//i.test(value) || value.startsWith("data:")) return value;

  const absoluteBase = ENV.API_BASE_URL;
  let path = value;

  if (path.startsWith("uploads/") || path.startsWith("/uploads/")) {
    const cleanPath = path.startsWith("/") ? path : `/${path}`;
    return `${absoluteBase}${cleanPath}`;
  }

  if (!path.startsWith("storage/") && !path.startsWith("/storage/")) {
    path = path.startsWith("/") ? `/storage${path}` : `/storage/${path}`;
  } else {
    path = path.startsWith("/") ? path : `/${path}`;
  }

  return `${absoluteBase}${path}`;
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
    raw.photo,
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
      typeof raw.photo === "string" ? raw.photo : "",
      firstNonEmptyString(
        raw.image,
        raw.thumbnail,
        raw.featured_image,
        raw.featuredImage,
      ),
      ...imageObjects,
    ]
      .filter(Boolean)
      .map((entry) => normalizeImageUrl(entry))
      .filter(Boolean),
  );
}

function inferColorsFromTitle(title: string): string[] {
  const normalizedTitle = title.toLowerCase();

  return KNOWN_COLORS.filter((color) => normalizedTitle.includes(color)).map(
    (color) => color.charAt(0).toUpperCase() + color.slice(1),
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

  if (directSizes.length > 0)
    return dedupeStrings(directSizes.map((size) => size.toUpperCase()));
  return DEFAULT_SIZES;
}

function buildTags(
  raw: RawProduct,
  title: string,
  categoryLabel: string,
  badge: string,
  colors: string[],
  fit: string,
): string[] {
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

function resolveBadge(
  raw: RawProduct,
  price: number,
  oldPrice: number,
): string {
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
  if (Array.isArray(payload.payload)) return payload.payload as T[];
  if (isRecord(payload.payload)) {
    const nestedPayload = payload.payload;
    if (Array.isArray(nestedPayload.data)) return nestedPayload.data as T[];
    if (Array.isArray(nestedPayload.products))
      return nestedPayload.products as T[];
    if (Array.isArray(nestedPayload.categories))
      return nestedPayload.categories as T[];
    if (Array.isArray(nestedPayload.favorites))
      return nestedPayload.favorites as T[];
  }

  if (Array.isArray(payload.products)) return payload.products as T[];
  if (Array.isArray(payload.categories)) return payload.categories as T[];
  if (Array.isArray(payload.favorites)) return payload.favorites as T[];
  return [];
}

function extractRecordData(payload: unknown): RawProduct | null {
  if (!isRecord(payload)) return null;
  if (isRecord(payload.data)) return payload.data;
  if (isRecord(payload.product)) return payload.product;

  if (isRecord(payload.payload)) {
    const nestedPayload = payload.payload;
    if (isRecord(nestedPayload.data)) return nestedPayload.data;
    if (isRecord(nestedPayload.product)) return nestedPayload.product;
    return nestedPayload;
  }

  return payload;
}

function extractTotalPages(payload: unknown): number {
  if (!isRecord(payload)) return 1;

  const directPagination = isRecord(payload.pagination)
    ? payload.pagination
    : null;
  if (directPagination) {
    return Math.max(1, Number(directPagination.total_pages ?? 1) || 1);
  }

  const nestedPayload = isRecord(payload.payload) ? payload.payload : null;
  const nestedPagination =
    nestedPayload && isRecord(nestedPayload.pagination)
      ? nestedPayload.pagination
      : null;
  return Math.max(1, Number(nestedPagination?.total_pages ?? 1) || 1);
}

async function fetchPaginatedItems<T extends Record<string, unknown>>(
  endpoint: string,
): Promise<T[]> {
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
  const photoVal = Array.isArray(raw.photo) ? raw.photo[0] : raw.photo;

  return {
    id: raw.id ? String(raw.id) : slug || firstNonEmptyString(raw.id, name),
    name,
    subtitle:
      stripHtml(firstNonEmptyString(raw.summary, `Shop ${name}`)) ||
      `Shop ${name}`,
    items: 0,
    image: normalizeImageUrl(firstNonEmptyString(photoVal)),
    isParent:
      raw.is_parent === "1" || raw.is_parent === 1 || raw.isParent === true,
    parentId: raw.parent_id ? String(raw.parent_id) : null,
    gender: firstNonEmptyString(raw.gender),
  };
}

function extractSortedImages(raw: RawProduct): string[] {
  const photoVal = raw.photo;
  if (!Array.isArray(photoVal)) {
    return collectImageCandidates(raw);
  }

  const parsedPhotos = photoVal
    .map((item) => {
      if (typeof item === "string") {
        return {
          url: normalizeImageUrl(item),
          isPrimary: false,
          sortOrder: 999,
        };
      }
      if (isRecord(item)) {
        const url = firstNonEmptyString(
          item.url,
          item.photo,
          item.image,
          item.path,
          item.src,
        );
        const isPrimary =
          item.is_primary === true ||
          item.is_primary === 1 ||
          item.is_primary === "1" ||
          item.isPrimary === true;
        const sortOrder = toNumberValue(item.sort_order) ?? 999;
        return {
          url: normalizeImageUrl(url),
          isPrimary,
          sortOrder,
        };
      }
      return null;
    })
    .filter(
      (p): p is { url: string; isPrimary: boolean; sortOrder: number } =>
        p !== null && p.url !== "",
    );

  if (parsedPhotos.length === 0) {
    return collectImageCandidates(raw);
  }

  parsedPhotos.sort((a, b) => {
    if (a.isPrimary && !b.isPrimary) return -1;
    if (!a.isPrimary && b.isPrimary) return 1;
    return a.sortOrder - b.sortOrder;
  });

  return dedupeStrings(parsedPhotos.map((p) => p.url));
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
      categoryRecord?.name,
    ),
  );
  const matchedCategory =
    categoriesByBackendId.get(rawCategoryId) ??
    categoriesBySlug.get(rawCategorySlug) ??
    null;

  const categoryId = matchedCategory?.id || rawCategoryId || "all";
  const categoryLabel =
    matchedCategory?.name ||
    firstNonEmptyString(
      raw.category_name,
      raw.category_title,
      categoryRecord?.title,
      categoryRecord?.name,
      "Collection",
    );

  const subCategoryRecord = isRecord(raw.sub_category)
    ? raw.sub_category
    : null;
  const subCategoryId = subCategoryRecord
    ? toNumberValue(subCategoryRecord.id)
    : null;

  const gallery = extractSortedImages(raw);
  const image = gallery[0] ?? DEFAULT_PRODUCT_IMAGE;
  const fit = firstNonEmptyString(raw.fit, raw.style, raw.type, "Regular Fit");
  const basePrice =
    firstFiniteNumber(
      raw.sale_price,
      raw.discount_price,
      raw.final_price,
      raw.special_price,
      raw.price,
      raw.regular_price,
      raw.mrp,
      0,
    ) ?? 0;
  const rawDiscount = toNumberValue(raw.discount) ?? 0;

  let price = basePrice;
  let oldPrice = basePrice;

  if (rawDiscount > 0) {
    if (rawDiscount <= 100) {
      price = basePrice * (1 - rawDiscount / 100);
      oldPrice = basePrice;
    } else {
      price = Math.max(0, basePrice - rawDiscount);
      oldPrice = basePrice;
    }
  } else {
    oldPrice = Math.max(
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
  }
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
    Math.round(
      firstFiniteNumber(raw.stock, raw.quantity, raw.qty, raw.inventory, 10) ??
        10,
    ),
  );
  const sizes = extractSizes(raw);
  const rating =
    firstFiniteNumber(raw.rating, raw.avg_rating, raw.average_rating, 4.8) ??
    4.8;
  const reviews = Math.max(
    0,
    Math.round(
      firstFiniteNumber(raw.reviews, raw.review_count, raw.total_reviews, 0) ??
        0,
    ),
  );

  const product = {
    id: firstNonEmptyString(raw.id, raw.product_id, slugify(title)),
    slug:
      slugify(firstNonEmptyString(raw.slug, title, raw.id)) || slugify(title),
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
    subCategoryId: subCategoryId ? String(subCategoryId) : null,
  };

  return product;
}

export function mapApiProduct(raw: RawProduct): Product {
  return mapRawProduct(raw, new Map(), new Map());
}

export async function fetchProductDetail(
  productSlug: string,
): Promise<Product | null> {
  const response = await axiosClient.get(
    API_ROUTES.catalog.productBySlug(productSlug),
  );
  const rawProduct = extractRecordData(response.data);
  return rawProduct ? mapApiProduct(rawProduct) : null;
}

export async function fetchCatalog(): Promise<CatalogData> {
  const rawProducts = await fetchPaginatedItems<RawProduct>(
    API_ROUTES.catalog.products,
  );
  let rawCategories: RawCategory[] = [];

  try {
    rawCategories = await fetchPaginatedItems<RawCategory>(
      API_ROUTES.catalog.categories,
    );
  } catch {
    rawCategories = [];
  }

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

  const productCountByCategory = products.reduce<Record<string, number>>(
    (acc, product) => {
      acc[product.categoryId] = (acc[product.categoryId] ?? 0) + 1;
      return acc;
    },
    {},
  );

  const finalizedCategories = Array.from(categories.values()).map(
    (category) => ({
      ...category,
      items: productCountByCategory[category.id] ?? 0,
    }),
  );

  return {
    categories: finalizedCategories,
    products,
  };
}

function mapRawBanner(raw: RawBanner): Banner {
  const title = firstNonEmptyString(raw.title, raw.name, "Aylee Banner");
  const description = stripHtml(
    firstNonEmptyString(raw.description, raw.summary, raw.subtitle),
  );

  return {
    id: firstNonEmptyString(raw.id, raw.slug, title),
    title,
    description,
    image: normalizeImageUrl(
      firstNonEmptyString(raw.photo, raw.image, raw.banner, raw.url),
    ),
  };
}

export async function fetchBanners(): Promise<Banner[]> {
  const response = await axiosClient.get(API_ROUTES.catalog.banners);
  return extractListData<RawBanner>(response.data).map(mapRawBanner);
}

function extractFavoriteProductId(item: unknown): string {
  if (typeof item === "string" || typeof item === "number") {
    return String(item);
  }

  if (!isRecord(item)) return "";

  if (item.product_id !== undefined && item.product_id !== null) {
    return String(item.product_id);
  }

  if (
    isRecord(item.product) &&
    item.product.id !== undefined &&
    item.product.id !== null
  ) {
    return String(item.product.id);
  }

  const title = firstNonEmptyString(item.title, item.name, item.product_name);
  const looksLikeProduct =
    title || item.price !== undefined || item.slug !== undefined;
  if (looksLikeProduct && item.id !== undefined && item.id !== null) {
    return String(item.id);
  }

  return "";
}

export async function fetchFavoriteProductIds(): Promise<string[]> {
  try {
    const response = await axiosClient.get(API_ROUTES.wishlist.legacyList);
    const favorites = extractListData<unknown>(response.data);

    return dedupeStrings(
      favorites.map((item) => extractFavoriteProductId(item)).filter(Boolean),
    );
  } catch {
    return [];
  }
}

export async function addFavoriteProduct(productId: string): Promise<unknown> {
  const formData = new FormData();
  formData.append("product_id", productId);

  const response = await axiosClient.post(
    API_ROUTES.wishlist.legacyAdd,
    formData,
  );
  return response.data;
}

export async function removeFavoriteProduct(
  productId: string,
): Promise<unknown> {
  const formData = new FormData();
  formData.append("product_id", productId);

  const response = await axiosClient.post(
    API_ROUTES.wishlist.legacyRemove,
    formData,
  );
  return response.data;
}

export async function fetchFocusProducts(): Promise<Product[]> {
  const response = await axiosClient.get(API_ROUTES.catalog.focus);
  const rawProducts = extractListData<RawProduct>(response.data);
  return rawProducts.map((rawProduct) => mapApiProduct(rawProduct));
}

export async function fetchMustHavesProducts(): Promise<Product[]> {
  const response = await axiosClient.get(API_ROUTES.catalog.mustHaves);
  const rawProducts = extractListData<RawProduct>(response.data);
  return rawProducts.map((rawProduct) => mapApiProduct(rawProduct));
}

export async function fetchSaleEssentialsProducts(): Promise<Product[]> {
  const response = await axiosClient.get(API_ROUTES.catalog.saleEssentials);
  const rawProducts = extractListData<RawProduct>(response.data);
  return rawProducts.map((rawProduct) => mapApiProduct(rawProduct));
}
