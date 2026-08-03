import { NextResponse } from "next/server";
import { commerceConfig } from "@/lib/commerce/config";
import { authenticatedCommerce } from "@/lib/commerce/customers";

export async function POST(request: Request) {
  const body = (await request.json()) as { productId?: string };
  const result = await authenticatedCommerce(
    commerceConfig.endpoints.wishlistAdd,
    { method: "POST", body: JSON.stringify({ productId: body.productId }) },
  );
  return NextResponse.json(
    { synced: result.ok },
    { status: result.status === 401 ? 202 : result.ok ? 200 : 202 },
  );
}

export async function DELETE(request: Request) {
  const body = (await request.json()) as { productId?: string };
  const result = await authenticatedCommerce(
    commerceConfig.endpoints.wishlistRemove(body.productId || ""),
    { method: "DELETE" },
  );
  return NextResponse.json(
    { synced: result.ok },
    { status: result.status === 401 ? 202 : result.ok ? 200 : 202 },
  );
}
