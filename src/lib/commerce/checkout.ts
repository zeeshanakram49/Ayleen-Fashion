import "server-only";

import { cookies } from "next/headers";
import { randomUUID } from "node:crypto";
import { checkoutSchema, type CheckoutInput } from "@/lib/validation/schemas";
import { commerceConfig } from "./config";
import { proxyCommerce } from "./http";

export async function getGuestToken(): Promise<string> {
  const cookieStore = await cookies();
  return cookieStore.get("aylee_guest")?.value || randomUUID();
}

export async function placeOrder(input: CheckoutInput) {
  const data = checkoutSchema.parse(input);
  const guestToken = await getGuestToken();
  return proxyCommerce(
    commerceConfig.endpoints.checkout,
    {
      method: "POST",
      body: JSON.stringify({
        shipping_address: {
          name: data.fullName,
          email: data.email,
          phone: data.phone,
          address: data.address,
          address2: data.address2,
          city: data.city,
          country: data.country,
          post_code: data.postCode,
        },
        // The order endpoint creates the order with its default COD state.
        // Hosted card/wallet payments are initiated separately after creation.
        note: data.note,
        items: data.lines.map((line) => ({
          product_id: line.productId,
          size: line.size,
          color: line.color,
          quantity: line.quantity,
        })),
      }),
    },
    { guestToken },
  );
}
