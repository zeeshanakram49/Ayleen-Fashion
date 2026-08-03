import { NextResponse } from "next/server";
import { getProducts } from "@/lib/commerce/products";

export async function GET(request: Request) {
  const query = new URL(request.url).searchParams.get("q")?.trim() || "";
  if (query.length < 2) return NextResponse.json({ suggestions: [] });
  const products = await getProducts({ query, limit: 6 });
  return NextResponse.json({
    suggestions: products.map((product) => ({
      slug: product.slug,
      name: product.name,
      category: product.category?.name || null,
    })),
  });
}
