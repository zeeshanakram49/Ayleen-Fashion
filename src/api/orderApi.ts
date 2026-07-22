import axiosClient from "./axiosClient";
import { API_ROUTES } from "./apiRoutes";
import type { Order } from "./apiTypes";
import type { ApiResponse } from "./apiTypes";

export interface CreateOrderPayload {
  shipping_address: {
    name: string;
    phone: string;
    address: string;
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

export async function createOrderApi(payload: CreateOrderPayload): Promise<ApiResponse<{ orderId: string; total: number }>> {
  const response = await axiosClient.post(API_ROUTES.orders.create, payload);
  const root = asRecord(response.data) ?? {};
  const responsePayload = asRecord(root.payload);
  const responseData = asRecord(root.data);
  const order =
    asRecord(responsePayload?.order) ??
    asRecord(responseData?.order) ??
    asRecord(root.order);
  const records = [order, responsePayload, responseData, root];
  const responseCode =
    typeof root.responseCode === "number"
      ? root.responseCode
      : Number(root.responseCode);
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
      orderId: firstString(records, [
        "order_id",
        "orderId",
        "order_number",
        "orderNumber",
        "order_code",
        "orderCode",
        "invoice_no",
        "invoiceNumber",
        "id",
      ]),
      total: firstNumber(records, [
        "total",
        "grand_total",
        "total_amount",
        "total_price",
        "payable_amount",
      ]),
    },
  };
}

export async function fetchOrdersApi(): Promise<ApiResponse<Order[]>> {
  const response = await axiosClient.get(API_ROUTES.orders.list);
  return response.data;
}

export async function fetchOrderDetailApi(orderId: string): Promise<ApiResponse<Order>> {
  const response = await axiosClient.get(API_ROUTES.orders.detail(orderId));
  return response.data;
}

export async function cancelOrderApi(orderId: string): Promise<ApiResponse<void>> {
  const response = await axiosClient.post(API_ROUTES.orders.cancel(orderId));
  return response.data;
}
