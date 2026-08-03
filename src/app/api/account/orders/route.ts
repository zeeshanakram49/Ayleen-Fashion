import { NextResponse } from "next/server";
import { commerceConfig } from "@/lib/commerce/config";
import { authenticatedCommerce } from "@/lib/commerce/customers";

export async function GET() {
  const result = await authenticatedCommerce(commerceConfig.endpoints.orders, {
    method: "GET",
  });
  return NextResponse.json(result.data, { status: result.status });
}
