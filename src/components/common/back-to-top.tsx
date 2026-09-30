"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const updateVisibility = () => setVisible(window.scrollY >= 300);

    updateVisibility();
    window.addEventListener("scroll", updateVisibility, { passive: true });
    return () => window.removeEventListener("scroll", updateVisibility);
  }, []);

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Back to top"
      className={`fixed right-4 bottom-24 z-[75] flex h-12 items-center gap-1.5 rounded-full border border-white/50 bg-[#6f2d24] px-4 text-white shadow-[0_12px_35px_rgb(0_0_0/0.3)] transition duration-300 hover:-translate-y-1 hover:bg-[#4d1f19] md:right-7 md:bottom-7 md:grid md:size-12 md:place-items-center md:px-0 ${
        visible
          ? "pointer-events-auto translate-y-0 opacity-100"
          : "pointer-events-none translate-y-4 opacity-0"
      }`}
    >
      <ArrowUp size={20} strokeWidth={1.8} />
      <span className="text-[0.62rem] font-bold tracking-[0.12em] uppercase md:hidden">
        Top
      </span>
    </button>
  );
}
