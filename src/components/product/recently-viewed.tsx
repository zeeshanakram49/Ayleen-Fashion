"use client";

import { useEffect, useState } from "react";
import type { Product } from "@/types/commerce";
import { ProductGrid } from "./product-grid";

const KEY = "aylee_recently_viewed";

export function RecentlyViewed({
  currentId,
  products,
}: {
  currentId: string;
  products: Product[];
}) {
  const [recentIds, setRecentIds] = useState<string[]>([]);

  useEffect(() => {
    try {
      const parsed: unknown = JSON.parse(localStorage.getItem(KEY) || "[]");
      const previous = Array.isArray(parsed)
        ? parsed.filter((id): id is string => typeof id === "string")
        : [];
      // Hydrate device-local history after the client mounts.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setRecentIds(previous.filter((id) => id !== currentId));
      localStorage.setItem(
        KEY,
        JSON.stringify(
          [currentId, ...previous.filter((id) => id !== currentId)].slice(0, 8),
        ),
      );
    } catch {
      setRecentIds([]);
    }
  }, [currentId]);

  const recent = recentIds
    .map((id) => products.find((product) => product.id === id))
    .filter((product): product is Product => Boolean(product))
    .slice(0, 4);
  if (!recent.length) return null;

  return (
    <section className="section-pad container-site !pt-0">
      <h2 className="serif mb-8 text-4xl tracking-[-0.04em]">
        Recently viewed
      </h2>
      <ProductGrid products={recent} />
    </section>
  );
}
