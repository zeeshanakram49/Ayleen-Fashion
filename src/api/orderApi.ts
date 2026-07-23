import axiosClient from "./axiosClient";
import { API_ROUTES } from "./apiRoutes";
import type { Order } from "./apiTypes";
import type { ApiResponse } from "./apiTypes";
import { getOrCreateGuestToken } from "../services/guestTokenService";

export interface CreateOrderPayload {
  shipping_address: {
    name: string;
    phone: string;
    address: string;
    city?: string;
    country?: string;
    email?: string;
    post_code?: string;
    address2?: string;
  };
}

type UnknownRecord = Record<string, unknown>;

function asRecord(value: unknown): UnknownRecord | null {
  return value !== null && typeof value === "object" && !Array.isArray(value)
    ? (value as UnknownRecord)
    : null;
}

function firstString(
  records: Array<UnknownRecord | null>,
  keys: string[],
): string {
  for (const record of records) {
    if (!record) continue;

    for (const key of keys) {
      const value = record[key];
      if (typeof value === "string" && value.trim()) return value.trim();
      if (typeof value === "number" && Number.isFinite(value)) return String(value);
    }
  }

  return "";
}

function firstNumber(
  records: Array<UnknownRecord | null>,
  keys: string[],
): number {
  for (const record of records) {
    if (!record) continue;

    for (const key of keys) {
      const value = record[key];
      const parsed =
        typeof value === "number"
          ? value
          : typeof value === "string"
            ? Number(value.replace(/[^\d.-]/g, ""))
            : Number.NaN;

      if (Number.isFinite(parsed)) return parsed;
    }
  }

  return 0;
}

export function normalizeOrder(raw: unknown): Order | null {
  const rootObj = asRecord(raw);
  if (!rootObj) return null;

  const responsePayload = asRecord(rootObj.payload);
  const responseData = asRecord(rootObj.data);

  const orderRecord =
    asRecord(responsePayload?.order) ??
    asRecord(responseData?.order) ??
    asRecord(rootObj.order) ??
    responsePayload ??
    responseData ??
    rootObj;

  const addressRecord = asRecord(orderRecord.shipping_address) ?? {};

  const firstName = firstString([addressRecord], ["first_name", "firstName", "name"]);
  const lastName = firstString([addressRecord], ["last_name", "lastName"]);
  const customerName = [firstName, lastName].filter(Boolean).join(" ") || "Valued Customer";

  const address1 = firstString([addressRecord], ["address1", "address", "street"]);
  const address2 = firstString([addressRecord], ["address2", "landmark"]);
  const city = firstString([addressRecord], ["city"]);
  const country = firstString([addressRecord], ["country"]) || "Pakistan";
  const postCode = firstString([addressRecord], ["post_code", "postCode", "zip"]);

  const fullAddress = [address1, address2, city, postCode, country].filter(Boolean).join(", ");

  const rawItems = Array.isArray(orderRecord.items) ? orderRecord.items : [];
  const items = rawItems.map((item: unknown) => {
    const itemObj = asRecord(item) ?? {};
    return {
      productId: firstString([itemObj], ["product_id", "productId", "id"]),
      productTitle: firstString([itemObj], ["product_name", "productTitle", "title", "name"]) || "Product",
      qty: firstNumber([itemObj], ["quantity", "qty", "count"]) || 1,
      price: firstNumber([itemObj], ["price", "unit_price"]) || 0,
      size: firstString([itemObj], ["size", "variant"]) || "Standard",
    };
  });

  const orderNumber =
    firstString([orderRecord], ["order_number", "orderNumber", "order_id", "orderId", "id"]) || "ORD-000000";
  const total = firstNumber([orderRecord], ["total_amount", "total", "grand_total", "payable_amount"]);
  const subtotal = firstNumber([orderRecord], ["sub_total", "subtotal"]) || total;
  const paymentStatusRaw = firstString([orderRecord], ["payment_status", "paymentStatus"]) || "unpaid";

  return {
    id: firstString([orderRecord], ["id", "order_id", "orderId"]) || orderNumber,
    orderNumber,
    customerName,
    customerEmail: firstString([addressRecord, orderRecord], ["email", "customer_email"]),
    customerPhone: firstString([addressRecord, orderRecord], ["phone", "mobile", "customer_phone"]),
    shippingAddress: fullAddress,
    city,
    items,
    subtotal,
    shippingFee: firstNumber([orderRecord], ["shipping_fee", "shipping", "delivery_fee"]),
    tax: firstNumber([orderRecord], ["tax", "tax_amount"]),
    total,
    paymentMethod: "COD",
    status: (firstString([orderRecord], ["status"]) as any) || "pending",
    paymentStatus: paymentStatusRaw === "paid" ? "paid" : "pending",
    createdAt: firstString([orderRecord], ["created_at", "createdAt"]) || new Date().toISOString(),
  };
}

export async function createOrderApi(payload: CreateOrderPayload): Promise<ApiResponse<{ orderId: string; total: number }>> {
  const response = await axiosClient.post(API_ROUTES.orders.create, payload, {
    headers: {
      "X-Guest-Token": getOrCreateGuestToken(),
      Accept: "application/json",
    },
  });

  const root = asRecord(response.data) ?? {};
  const normalized = normalizeOrder(response.data);
  const orderId =
    normalized?.orderNumber ||
    firstString([root], [
      "order_id",
      "orderId",
      "order_number",
      "orderNumber",
      "id",
    ]);
  const total = normalized?.total || firstNumber([root], ["total", "grand_total", "total_amount"]);

  if (normalized && typeof window !== "undefined" && orderId) {
    try {
      sessionStorage.setItem(`ayleen_order_${orderId}`, JSON.stringify(normalized));
    } catch {
      // Ignore storage error
    }
  }

  const responseCode = typeof root.responseCode === "number" ? root.responseCode : Number(root.responseCode);
  const success =
    typeof root.success === "boolean"
      ? root.success
      : typeof root.status === "boolean"
        ? root.status
        : Number.isFinite(responseCode)
          ? responseCode >= 200 && responseCode < 300
          : true;

  return {
    success,
    message: typeof root.message === "string" ? root.message : undefined,
    payload: {
      orderId,
      total,
    },
  };
}

export async function fetchOrdersApi(): Promise<ApiResponse<Order[]>> {
  const response = await axiosClient.get(API_ROUTES.orders.list);
  return response.data;
}

export async function fetchOrderDetailApi(orderId: string): Promise<ApiResponse<Order>> {
  if (typeof window !== "undefined" && orderId) {
    try {
      const stored = sessionStorage.getItem(`ayleen_order_${orderId}`);
      if (stored) {
        const parsed = JSON.parse(stored) as Order;
        if (parsed && parsed.orderNumber) {
          return { success: true, payload: parsed, data: parsed };
        }
      }
    } catch {
      // Ignore storage error
    }
  }

  const response = await axiosClient.get(API_ROUTES.orders.detail(orderId));
  const normalized = normalizeOrder(response.data);
  return {
    success: response.data?.success ?? true,
    message: response.data?.message,
    payload: normalized ?? undefined,
    data: normalized ?? undefined,
  };
}

export async function cancelOrderApi(orderId: string): Promise<ApiResponse<void>> {
  const response = await axiosClient.post(API_ROUTES.orders.cancel(orderId));
  return response.data;
}
