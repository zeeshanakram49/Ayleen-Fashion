"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Search, X } from "lucide-react";

type Suggestion = { slug: string; name: string; category: string | null };

export function SearchOverlay({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose, open]);

  useEffect(() => {
    if (!open || query.trim().length < 2) {
      setSuggestions([]);
      return;
    }
    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `/api/search-suggestions?q=${encodeURIComponent(query)}`,
          {
            signal: controller.signal,
          },
        );
        const body = (await response.json()) as { suggestions?: Suggestion[] };
        setSuggestions(body.suggestions || []);
      } catch {
        if (!controller.signal.aborted) setSuggestions([]);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }, 280);
    return () => {
      controller.abort();
      window.clearTimeout(timer);
    };
  }, [open, query]);

  if (!open) return null;

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const next = query.trim();
    if (!next) return;
    localStorage.setItem(
      "aylee_recent_searches",
      JSON.stringify(
        [
          next,
          ...JSON.parse(
            localStorage.getItem("aylee_recent_searches") || "[]",
          ).filter(
            (item: unknown) => typeof item === "string" && item !== next,
          ),
        ].slice(0, 5),
      ),
    );
    onClose();
    router.push(`/search?q=${encodeURIComponent(next)}`);
  }

  return (
    <div
      className="fixed inset-0 z-[70] bg-white"
      role="dialog"
      aria-modal="true"
      aria-label="Search products"
    >
      <div className="container-site flex min-h-20 items-center justify-between border-b border-[#dedbd2]">
        <p className="eyebrow">Search Aylee</p>
        <button
          type="button"
          onClick={onClose}
          className="p-3"
          aria-label="Close search"
        >
          <X size={23} />
        </button>
      </div>
      <div className="container-site mx-auto max-w-4xl pt-12 md:pt-24">
        <form
          onSubmit={submit}
          className="flex items-center border-b-2 border-[#171613]"
        >
          <Search aria-hidden size={25} />
          <input
            ref={inputRef}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="serif min-w-0 flex-1 bg-transparent px-4 py-4 text-3xl outline-none md:text-5xl"
            placeholder="What are you looking for?"
            aria-label="Search products"
            autoComplete="off"
          />
          <button type="submit" className="p-3" aria-label="Submit search">
            <ArrowRight size={25} />
          </button>
        </form>
        <div className="mt-8" aria-live="polite">
          {loading ? <p className="text-[#6c6961]">Finding products…</p> : null}
          {!loading && query.length >= 2 && suggestions.length === 0 ? (
            <p className="text-[#6c6961]">
              No suggestions yet. Press Enter to view all results.
            </p>
          ) : null}
          <ul className="divide-y divide-[#dedbd2]">
            {suggestions.map((suggestion) => (
              <li key={suggestion.slug}>
                <Link
                  href={`/products/${suggestion.slug}`}
                  onClick={onClose}
                  className="flex items-center justify-between py-4 hover:text-[#6f2d24]"
                >
                  <span>{suggestion.name}</span>
                  <span className="text-xs text-[#6c6961]">
                    {suggestion.category}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
