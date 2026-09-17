"use client";

import { useEffect, useRef } from "react";
import { useStore } from "@/components/providers/store-provider";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

type PurchasePayload = {
  orderId: string;
  value: number;
  currency: string;
  content_ids: string[];
  contents: Array<{
    id: string;
    quantity: number;
    item_price: number;
  }>;
  num_items: number;
};

export function PurchaseEvent({
  orderId,
}: {
  orderId: string;
}) {
  const { clearCart } = useStore();

  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;

    started.current = true;

    const purchaseKey = `aylee_meta_purchase:${orderId}`;

    const trackedKey = `aylee_meta_purchase_tracked:${orderId}`;

    /*
     * Prevent duplicate Purchase events
     * when the confirmation page reloads.
     */
    const alreadyTracked =
      window.sessionStorage.getItem(trackedKey);

    if (alreadyTracked === "1") {
      window.sessionStorage.removeItem(purchaseKey);
      return;
    }

    /*
     * Purchase data was saved during checkout.
     */
    const raw =
      window.sessionStorage.getItem(purchaseKey);

    if (!raw) {
      return;
    }

    let payload: PurchasePayload;

    try {
      payload = JSON.parse(raw) as PurchasePayload;
    } catch {
      return;
    }

    /*
     * Safety check:
     * confirmation order must match stored order.
     */
    if (
      String(payload.orderId) !==
      String(orderId)
    ) {
      return;
    }

    /*
     * Customer has successfully reached
     * the order confirmation page.
     *
     * Cart can now be cleared.
     */
    clearCart();

    const firePurchase = () => {
      if (
        typeof window.fbq !== "function"
      ) {
        return false;
      }

      window.fbq("track", "Purchase", {
        value: Number(payload.value),

        currency:
          payload.currency || "PKR",

        content_ids:
          payload.content_ids,

        content_type: "product",

        contents:
          payload.contents,

        num_items:
          payload.num_items,

        order_id:
          payload.orderId,
      });

      /*
       * Mark this order as already tracked.
       */
      window.sessionStorage.setItem(
        trackedKey,
        "1",
      );

      /*
       * Purchase payload is no longer needed.
       */
      window.sessionStorage.removeItem(
        purchaseKey,
      );

      return true;
    };

    /*
     * Normally Meta Pixel should already
     * be available.
     */
    if (firePurchase()) {
      return;
    }

    /*
     * If Pixel loads slightly late,
     * retry for approximately 5 seconds.
     */
    let attempts = 0;

    const interval =
      window.setInterval(() => {
        attempts += 1;

        if (
          firePurchase() ||
          attempts >= 20
        ) {
          window.clearInterval(
            interval,
          );
        }
      }, 250);

    return () => {
      window.clearInterval(interval);
    };
  }, [orderId, clearCart]);

  return null;
}