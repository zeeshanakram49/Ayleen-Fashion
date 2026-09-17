"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

type ProductViewEventProps = {
  contentId: string;
  contentName: string;
  value: number;
  currency: string;
};

export function ProductViewEvent({
  contentId,
  contentName,
  value,
  currency,
}: ProductViewEventProps) {
  const fired = useRef(false);

  useEffect(() => {
    let attempts = 0;

    const trackViewContent = () => {
      if (fired.current) return true;

      if (typeof window.fbq === "function") {
        window.fbq("track", "ViewContent", {
          content_ids: [contentId],
          content_name: contentName,
          content_type: "product",
          value,
          currency,
        });

        fired.current = true;
        return true;
      }

      return false;
    };

    if (trackViewContent()) return;

    const interval = window.setInterval(() => {
      attempts += 1;

      if (trackViewContent() || attempts >= 20) {
        window.clearInterval(interval);
      }
    }, 250);

    return () => window.clearInterval(interval);
  }, [contentId, contentName, value, currency]);

  return null;
}