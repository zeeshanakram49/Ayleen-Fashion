import "server-only";

import { unstable_cache } from "next/cache";
import type { Category } from "@/types/commerce";
import { slugify, stripHtml } from "@/lib/utils/format";
import { commerceConfig } from "./config";
import { asString, fetchCommerce, isRecord, listFromResponse } from "./http";
import { fallbackCategories } from "./fallback";

function normalizeImage(value: string): string | null {
  if (!value) return null;
  if (/^https?:\/\//i.test(value))
    return value.replace(/^http:\/\//i, "https://");
  const path = value.startsWith("/") ? value : `/${value}`;
  return `${commerceConfig.apiUrl}${path}`;
}

function normalizeCategory(value: unknown): Category | null {
  if (!isRecord(value)) return null;
  const name = asString(value.title) || asString(value.name);
  if (!name) return null;
  const rawPhoto = Array.isArray(value.photo) ? value.photo[0] : value.photo;
  const slug = slugify(asString(value.slug) || name);
  const children = Array.isArray(value.child_cat)
    ? value.child_cat
        .map(normalizeCategory)
        .filter((entry): entry is Category => Boolean(entry))
    : [];

  return {
    id: asString(value.id) || slug,
    slug,
    name,
    description: stripHtml(asString(value.summary)),
    image: normalizeImage(asString(rawPhoto)),
    gender: asString(value.gender) || null,
    parentId: asString(value.parent_id) || null,
    children,
  };
}

const getCategoriesCached = unstable_cache(
  async (): Promise<Category[]> => {
    try {
      const response = await fetchCommerce(
        commerceConfig.endpoints.categories,
        {},
        { tags: ["categories"] },
      );
      return listFromResponse(response)
        .map(normalizeCategory)
        .filter((entry): entry is Category => Boolean(entry));
    } catch {
      return fallbackCategories;
    }
  },
  ["commerce-categories"],
  { revalidate: commerceConfig.revalidateSeconds, tags: ["categories"] },
);

export async function getCategories(): Promise<Category[]> {
  return getCategoriesCached();
}

export async function getCategory(slug: string): Promise<Category | null> {
  const categories = await getCategories();
  const all = categories.flatMap((category) => [
    category,
    ...category.children,
  ]);
  return all.find((category) => category.slug === slug) ?? null;
}
