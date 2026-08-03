import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";

export async function POST(request: Request) {
  const secret = request.headers.get("x-revalidation-secret");
  if (
    !process.env.REVALIDATION_SECRET ||
    secret !== process.env.REVALIDATION_SECRET
  )
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  const body = (await request.json().catch(() => ({}))) as { tags?: string[] };
  const tags = Array.isArray(body.tags)
    ? body.tags
        .filter((tag) => typeof tag === "string" && tag.length <= 100)
        .slice(0, 20)
    : ["products", "categories", "banners"];
  for (const tag of tags) revalidateTag(tag, { expire: 0 });
  return NextResponse.json({ revalidated: true, tags });
}
