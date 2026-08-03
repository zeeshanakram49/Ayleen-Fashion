import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { checkoutSchema } from "@/lib/validation/schemas";
import { placeOrder } from "@/lib/commerce/checkout";
import { commerceConfig } from "@/lib/commerce/config";
import {
  asNumber,
  asString,
  isRecord,
  proxyCommerce,
  recordFromResponse,
} from "@/lib/commerce/http";

function findOrderId(value: unknown): string {
  const record = recordFromResponse(value);
  if (!record) return "";
  const nestedOrder = isRecord(record.order) ? record.order : null;
  return (
    asString(record.orderId) ||
    asString(record.order_id) ||
    asString(record.orderNumber) ||
    asString(record.order_number) ||
    asString(record.id) ||
    (nestedOrder
      ? asString(nestedOrder.order_number) || asString(nestedOrder.id)
      : "")
  );
}

function findTotal(value: unknown): number {
  const record = recordFromResponse(value);
  if (!record) return 0;
  const nestedOrder = isRecord(record.order) ? record.order : null;
  return (
    asNumber(record.total) ??
    asNumber(record.total_amount) ??
    (nestedOrder
      ? (asNumber(nestedOrder.total_amount) ?? asNumber(nestedOrder.total))
      : null) ??
    0
  );
}

function messageFrom(value: unknown, fallback: string): string {
  return isRecord(value) && typeof value.message === "string"
    ? value.message
    : fallback;
}

export async function POST(request: Request) {
  try {
    const input = checkoutSchema.parse(await request.json());
    const order = await placeOrder(input);
    if (!order.ok)
      return NextResponse.json(
        { message: messageFrom(order.data, "The order could not be placed.") },
        { status: order.status },
      );
    const orderId = findOrderId(order.data);
    if (!orderId)
      return NextResponse.json(
        {
          message:
            "The commerce backend did not return an order reference. No confirmation was created.",
        },
        { status: 502 },
      );
    let redirectUrl: string | undefined;

    if (input.payment !== "COD") {
      const path =
        input.payment === "CARD"
          ? commerceConfig.endpoints.payment.card
          : input.payment === "JAZZCASH"
            ? commerceConfig.endpoints.payment.jazzcash
            : commerceConfig.endpoints.payment.easypaisa;
      const payment = await proxyCommerce(path, {
        method: "POST",
        body: JSON.stringify({
          orderId,
          amount: findTotal(order.data),
          currency: "PKR",
          customer: {
            name: input.fullName,
            email: input.email,
            phone: input.phone,
          },
          successUrl: `${process.env.NEXT_PUBLIC_SITE_URL || "https://aylee.store"}/order-confirmation/${encodeURIComponent(orderId)}`,
          cancelUrl: `${process.env.NEXT_PUBLIC_SITE_URL || "https://aylee.store"}/checkout`,
        }),
      });
      if (!payment.ok)
        return NextResponse.json(
          {
            message: messageFrom(payment.data, "Payment could not be started."),
            orderId,
          },
          { status: payment.status },
        );
      const record = recordFromResponse(payment.data);
      redirectUrl = record
        ? asString(record.checkoutUrl) ||
          asString(record.checkout_url) ||
          asString(record.redirectUrl) ||
          asString(record.redirect_url) ||
          undefined
        : undefined;
    }

    return NextResponse.json({ orderId, redirectUrl });
  } catch (error) {
    if (error instanceof ZodError)
      return NextResponse.json(
        {
          message: "Check the highlighted checkout details.",
          errors: error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    return NextResponse.json(
      { message: "Checkout is temporarily unavailable." },
      { status: 503 },
    );
  }
}
