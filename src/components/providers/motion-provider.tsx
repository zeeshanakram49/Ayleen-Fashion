"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function MotionProvider() {
  const pathname = usePathname();

  useEffect(() => {
    const elements = Array.from(
      document.querySelectorAll<HTMLElement>("[data-reveal]"),
    );
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (!elements.length || reducedMotion) {
      elements.forEach((element) => {
        element.removeAttribute("data-reveal-ready");
        element.setAttribute("data-visible", "true");
      });
      document.documentElement.classList.add("motion-ready");
      return;
    }

    // Hard reloads can restore the previous scroll position before hydration.
    // Keep anything already reached by the viewport visible so hydration never
    // turns the current screen into an empty reveal placeholder.
    const revealLine = window.innerHeight * 0.92;
    const pendingElements = elements.filter((element) => {
      if (element.getBoundingClientRect().top <= revealLine) {
        element.removeAttribute("data-reveal-ready");
        element.setAttribute("data-visible", "true");
        return false;
      }
      element.setAttribute("data-reveal-ready", "true");
      element.removeAttribute("data-visible");
      return true;
    });

    document.documentElement.classList.add("motion-ready");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.setAttribute("data-visible", "true");
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -8%", threshold: 0.08 },
    );

    pendingElements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [pathname]);

  return null;
}
