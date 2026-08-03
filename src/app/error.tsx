"use client";

import { useEffect } from "react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Storefront route error", error.digest || error.message);
  }, [error]);
  return (
    <div className="container-site flex min-h-[60vh] items-center justify-center py-20 text-center">
      <div>
        <p className="eyebrow">Something went wrong</p>
        <h1 className="page-title mt-4">We couldn&apos;t load this page.</h1>
        <p className="mx-auto mt-5 max-w-lg text-[#6c6961]">
          Try again. If the commerce service is temporarily unavailable, your
          saved bag remains on this device.
        </p>
        <button type="button" onClick={reset} className="button-primary mt-8">
          Try again
        </button>
      </div>
    </div>
  );
}
