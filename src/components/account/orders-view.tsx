"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { formatPrice } from "@/lib/utils/format";

type Order = {
  id: string;
  number: string;
  status: string;
  total: number;
  createdAt: string;
};

function records(value: unknown): unknown[] {
  if (Array.isArray(value)) return value;
  if (!value || typeof value !== "object") return [];
  const record = value as Record<string, unknown>;
  if (Array.isArray(record.data)) return record.data;
  if (Array.isArray(record.payload)) return record.payload;
  if (
    record.payload &&
    typeof record.payload === "object" &&
    Array.isArray((record.payload as Record<string, unknown>).data)
  )
    return (record.payload as { data: unknown[] }).data;
  return [];
}

function normalize(value: unknown): Order | null {
  if (!value || typeof value !== "object") return null;
  const order = value as Record<string, unknown>;
  const id = String(order.order_number ?? order.orderNumber ?? order.id ?? "");
  if (!id) return null;
  return {
    id,
    number: id,
    status: String(order.status ?? "pending"),
    total: Number(order.total_amount ?? order.total ?? 0),
    createdAt: String(order.created_at ?? order.createdAt ?? ""),
  };
}

export function OrdersView() {
  const [state, setState] = useState<{
    loading: boolean;
    authenticated: boolean;
    orders: Order[];
  }>({ loading: true, authenticated: true, orders: [] });
  useEffect(() => {
    fetch("/api/account/orders", { cache: "no-store" })
      .then(async (response) => ({ response, body: await response.json() }))
      .then(({ response, body }) =>
        setState({
          loading: false,
          authenticated: response.status !== 401,
          orders: records(body)
            .map(normalize)
            .filter((order): order is Order => Boolean(order)),
        }),
      )
      .catch(() =>
        setState({ loading: false, authenticated: true, orders: [] }),
      );
  }, []);
  if (state.loading) return <div className="skeleton h-56" />;
  if (!state.authenticated)
    return (
      <div className="border border-[#dedbd2] bg-[#f7f5f0] p-8 text-center">
        <h2 className="serif text-3xl">Sign in to view orders</h2>
        <Link href="/account" className="button-primary mt-6">
          Sign in
        </Link>
      </div>
    );
  if (!state.orders.length)
    return (
      <div className="border border-[#dedbd2] bg-[#f7f5f0] p-8 text-center">
        <h2 className="serif text-3xl">No orders found</h2>
        <p className="mt-2 text-sm text-[#6c6961]">
          Orders from the commerce backend will appear here.
        </p>
        <Link href="/shop" className="button-primary mt-6">
          Start shopping
        </Link>
      </div>
    );
  return (
    <ul className="divide-y divide-[#dedbd2] border-y border-[#dedbd2]">
      {state.orders.map((order) => (
        <li
          key={order.id}
          className="grid gap-3 py-5 sm:grid-cols-4 sm:items-center"
        >
          <div>
            <p className="text-xs text-[#6c6961]">Order</p>
            <strong>{order.number}</strong>
          </div>
          <div>
            <p className="text-xs text-[#6c6961]">Date</p>
            <span>
              {order.createdAt
                ? new Date(order.createdAt).toLocaleDateString("en-PK")
                : "—"}
            </span>
          </div>
          <div>
            <p className="text-xs text-[#6c6961]">Status</p>
            <span className="capitalize">{order.status}</span>
          </div>
          <div className="sm:text-right">
            <strong>{formatPrice(order.total)}</strong>
          </div>
        </li>
      ))}
    </ul>
  );
}
