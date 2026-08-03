"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { SlidersHorizontal } from "lucide-react";
import type { Category } from "@/types/commerce";

export function ShopFilters({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function setParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams?.toString() || "");
    if (value) params.set(key, value);
    else params.delete(key);
    router.push(`/shop${params.size ? `?${params}` : ""}`, { scroll: false });
  }

  return (
    <div className="grid gap-3 border-y border-[#dedbd2] py-4 sm:grid-cols-2 lg:grid-cols-[auto_1fr_1fr_1fr] lg:items-center">
      <p className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase">
        <SlidersHorizontal size={16} /> Filters
      </p>
      <label className="text-xs">
        <span className="sr-only">Category</span>
        <select
          className="field !min-h-11"
          value={searchParams?.get("category") || ""}
          onChange={(event) => setParam("category", event.target.value)}
        >
          <option value="">All categories</option>
          {categories.map((category) => (
            <option key={category.id} value={category.slug}>
              {category.name}
            </option>
          ))}
        </select>
      </label>
      <label className="text-xs">
        <span className="sr-only">Availability</span>
        <select
          className="field !min-h-11"
          value={searchParams?.get("availability") || ""}
          onChange={(event) => setParam("availability", event.target.value)}
        >
          <option value="">Any availability</option>
          <option value="in-stock">In stock</option>
          <option value="out-of-stock">Out of stock</option>
        </select>
      </label>
      <label className="text-xs">
        <span className="sr-only">Sort products</span>
        <select
          className="field !min-h-11"
          value={searchParams?.get("sort") || "featured"}
          onChange={(event) => setParam("sort", event.target.value)}
        >
          <option value="featured">Featured</option>
          <option value="newest">Newest</option>
          <option value="price-asc">Price: low to high</option>
          <option value="price-desc">Price: high to low</option>
          <option value="best-selling">Best selling</option>
        </select>
      </label>
    </div>
  );
}
