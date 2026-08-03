import "server-only";

import { commerceConfig, commerceUrl } from "./config";
import type { UnknownRecord, UpstreamResponse } from "./types";

export function isRecord(value: unknown): value is UnknownRecord {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

export function asString(value: unknown): string {
  if (typeof value === "string") return value.trim();
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  return "";
}

export function asNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value !== "string") return null;
  const parsed = Number(value.replace(/[^\d.-]/g, ""));
  return Number.isFinite(parsed) ? parsed : null;
}

export function listFromResponse(value: unknown): unknown[] {
  if (Array.isArray(value)) return value;
  if (!isRecord(value)) return [];

  if (Array.isArray(value.data)) return value.data;
  if (Array.isArray(value.payload)) return value.payload;
  if (isRecord(value.payload)) {
    if (Array.isArray(value.payload.data)) return value.payload.data;
    if (Array.isArray(value.payload.products)) return value.payload.products;
    if (Array.isArray(value.payload.categories))
      return value.payload.categories;
  }
  return [];
}

export function recordFromResponse(value: unknown): UnknownRecord | null {
  if (!isRecord(value)) return null;
  if (isRecord(value.data)) return value.data;
  if (isRecord(value.product)) return value.product;
  if (isRecord(value.payload)) {
    if (isRecord(value.payload.data)) return value.payload.data;
    if (isRecord(value.payload.product)) return value.payload.product;
    return value.payload;
  }
  return value;
}

export async function fetchCommerce(
  path: string,
  init: RequestInit = {},
  options: { revalidate?: number | false; tags?: string[] } = {},
): Promise<unknown> {
  const controller = new AbortController();
  const timeout = setTimeout(
    () => controller.abort(),
    commerceConfig.requestTimeoutMs,
  );

  try {
    const response = await fetch(commerceUrl(path), {
      ...init,
      headers: {
        Accept: "application/json",
        ...(process.env.COMMERCE_API_TOKEN
          ? { Authorization: `Bearer ${process.env.COMMERCE_API_TOKEN}` }
          : {}),
        ...init.headers,
      },
      signal: controller.signal,
      next:
        options.revalidate === false
          ? undefined
          : {
              revalidate:
                options.revalidate ?? commerceConfig.revalidateSeconds,
              tags: options.tags,
            },
      cache: options.revalidate === false ? "no-store" : undefined,
    });

    const data: unknown = await response.json().catch(() => null);
    if (!response.ok) {
      throw new Error(
        `Commerce API request failed with status ${response.status}`,
      );
    }
    return data;
  } finally {
    clearTimeout(timeout);
  }
}

export async function proxyCommerce(
  path: string,
  init: RequestInit,
  headers: { guestToken?: string; bearerToken?: string } = {},
): Promise<UpstreamResponse> {
  try {
    const response = await fetch(commerceUrl(path), {
      ...init,
      cache: "no-store",
      headers: {
        Accept: "application/json",
        ...(init.body instanceof FormData
          ? {}
          : { "Content-Type": "application/json" }),
        ...(headers.guestToken ? { "X-Guest-Token": headers.guestToken } : {}),
        ...(headers.bearerToken
          ? { Authorization: `Bearer ${headers.bearerToken}` }
          : {}),
        ...init.headers,
      },
    });
    return {
      ok: response.ok,
      status: response.status,
      data: await response.json().catch(() => null),
    };
  } catch (error) {
    return {
      ok: false,
      status: 503,
      data: {
        message:
          error instanceof Error
            ? error.message
            : "Commerce service unavailable",
      },
    };
  }
}
