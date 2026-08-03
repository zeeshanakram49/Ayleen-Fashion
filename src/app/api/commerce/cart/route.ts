import { randomUUID } from "node:crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { commerceConfig } from "@/lib/commerce/config";
import { isRecord, listFromResponse, proxyCommerce } from "@/lib/commerce/http";

async function guestToken() {
  return (await cookies()).get("aylee_guest")?.value || randomUUID();
}

function responseWithGuest(body: object, token: string, status = 200) {
  const response = NextResponse.json(body, { status });
  response.cookies.set("aylee_guest", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 365,
    path: "/",
  });
  return response;
}

function normalizedLines(value: unknown) {
  return listFromResponse(value)
    .flatMap((line) => {
      if (!isRecord(line)) return [];
      return [
        {
          productId: String(line.productId ?? line.product_id ?? line.id ?? ""),
          size: String(line.size ?? ""),
          quantity: Number(line.quantity ?? line.qty ?? 0),
        },
      ];
    })
    .filter((line) => line.productId && line.quantity > 0);
}

export async function GET() {
  const token = await guestToken();
  const upstream = await proxyCommerce(
    commerceConfig.endpoints.cart,
    { method: "GET" },
    { guestToken: token },
  );
  return responseWithGuest(
    {
      synced: upstream.ok,
      lines: upstream.ok ? normalizedLines(upstream.data) : [],
    },
    token,
    upstream.ok ? 200 : 202,
  );
}

export async function POST(request: Request) {
  const token = await guestToken();
  const body = (await request.json()) as {
    productId?: string;
    quantity?: number;
    size?: string;
    color?: string;
  };
  const formData = new FormData();
  formData.set("product_id", body.productId || "");
  formData.set("quantity", String(body.quantity || 1));
  if (body.size) formData.set("size", body.size);
  if (body.color) formData.set("color", body.color);
  const upstream = await proxyCommerce(
    commerceConfig.endpoints.cartAdd,
    { method: "POST", body: formData },
    { guestToken: token },
  );
  return responseWithGuest(
    { synced: upstream.ok },
    token,
    upstream.ok ? 200 : 202,
  );
}

export async function PATCH(request: Request) {
  const token = await guestToken();
  const body: unknown = await request.json();
  const upstream = await proxyCommerce(
    commerceConfig.endpoints.cartUpdate,
    { method: "POST", body: JSON.stringify(body) },
    { guestToken: token },
  );
  return responseWithGuest(
    { synced: upstream.ok },
    token,
    upstream.ok ? 200 : 202,
  );
}

export async function DELETE(request: Request) {
  const token = await guestToken();
  const body = (await request.json()) as { clear?: boolean };
  const path = body.clear
    ? "/api/cart/clear"
    : commerceConfig.endpoints.cartRemove;
  const upstream = await proxyCommerce(
    path,
    { method: "POST", body: JSON.stringify(body) },
    { guestToken: token },
  );
  return responseWithGuest(
    { synced: upstream.ok },
    token,
    upstream.ok ? 200 : 202,
  );
}
