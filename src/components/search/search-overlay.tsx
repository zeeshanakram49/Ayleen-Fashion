"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Search, X } from "lucide-react";
import { formatPrice } from "@/lib/utils/format";

type Suggestion = {
  slug: string;
  name: string;
  category: string | null;
  image: string | null;
  price: number;
};

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

  const trimmedQuery = query.trim();
  const showResults = trimmedQuery.length >= 2;

  return (
    <div
      className="fixed inset-0 z-[70] overflow-y-auto bg-[#171613]/60 backdrop-blur-[6px]"
      role="dialog"
      aria-modal="true"
      aria-label="Search products"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="mx-auto w-full max-w-5xl px-4 pt-[10svh] pb-6 md:px-6">
        <div className="flex items-center gap-2.5 md:gap-4">
          <form
            onSubmit={submit}
            className="flex h-14 min-w-0 flex-1 items-center rounded-full bg-white pr-1.5 pl-5 shadow-[0_18px_60px_rgb(0_0_0/0.24)] ring-1 ring-black/10 md:h-16 md:pr-2 md:pl-6"
          >
            <Search
              aria-hidden
              size={25}
              strokeWidth={1.7}
              className="shrink-0 text-[#171613]"
            />
            <input
              ref={inputRef}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="search-overlay-input min-w-0 flex-1 bg-transparent px-3 text-base text-[#171613] outline-none placeholder:text-[#8d8981] md:px-4 md:text-xl"
              placeholder="What are you looking for?"
              aria-label="Search products"
              autoComplete="off"
            />
            {query ? (
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  inputRef.current?.focus();
                }}
                className="grid size-10 shrink-0 place-items-center rounded-full text-[#77736b] transition hover:bg-[#f1efe9] hover:text-[#171613]"
                aria-label="Clear search"
              >
                <X size={18} />
              </button>
            ) : null}
            <button
              type="submit"
              className="grid size-10 shrink-0 place-items-center rounded-full bg-[#171613] text-white transition hover:bg-[#6f2d24] md:size-12"
              aria-label="Submit search"
            >
              <ArrowRight size={22} />
            </button>
          </form>
          <button
            type="button"
            onClick={onClose}
            className="grid size-11 shrink-0 place-items-center rounded-full border border-white/40 bg-black/20 text-white backdrop-blur transition hover:bg-white hover:text-[#171613] md:size-12"
            aria-label="Close search"
          >
            <X size={27} strokeWidth={1.5} />
          </button>
        </div>

        {showResults ? (
          <div
            className="mt-4 mr-[3.625rem] max-h-[calc(100svh-12rem)] overflow-y-auto rounded-[1.5rem] bg-white p-5 shadow-[0_24px_80px_rgb(0_0_0/0.28)] md:mt-5 md:mr-16 md:max-h-[calc(100svh-14rem)] md:rounded-[1.75rem] md:p-7"
            aria-live="polite"
            aria-busy={loading}
          >
            <div className="flex items-center justify-between gap-4 border-b border-[#dedbd2] pb-4 md:pb-5">
              <div>
                <p className="eyebrow">Suggested products</p>
                <p className="mt-1 text-sm text-[#6c6961]">
                  Results for “{trimmedQuery}”
                </p>
              </div>
              {!loading && suggestions.length ? (
                <Link
                  href={`/search?q=${encodeURIComponent(trimmedQuery)}`}
                  onClick={onClose}
                  className="inline-flex shrink-0 items-center gap-2 text-xs font-bold tracking-[0.1em] uppercase underline-offset-4 hover:underline"
                >
                  View all <ArrowRight size={15} />
                </Link>
              ) : null}
            </div>

            {loading ? (
              <div className="grid gap-3 pt-5 md:grid-cols-2 md:gap-4">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div
                    key={index}
                    className="flex animate-pulse items-center gap-4"
                  >
                    <div className="h-20 w-16 shrink-0 bg-[#ece9e2] md:h-24 md:w-20" />
                    <div className="flex-1">
                      <div className="h-3 w-20 bg-[#ece9e2]" />
                      <div className="mt-3 h-4 w-3/4 bg-[#ece9e2]" />
                      <div className="mt-3 h-3 w-24 bg-[#ece9e2]" />
                    </div>
                  </div>
                ))}
              </div>
            ) : suggestions.length ? (
              <ul className="grid gap-x-8 md:grid-cols-2">
                {suggestions.map((suggestion) => (
                  <li
                    key={suggestion.slug}
                    className="border-b border-[#dedbd2]"
                  >
                    <Link
                      href={`/products/${suggestion.slug}`}
                      onClick={onClose}
                      className="group flex items-center gap-4 py-4"
                    >
                      <span className="relative h-20 w-16 shrink-0 overflow-hidden bg-[#efede7] md:h-24 md:w-20">
                        {suggestion.image ? (
                          <Image
                            src={suggestion.image}
                            alt=""
                            fill
                            sizes="80px"
                            className="object-cover transition duration-300 group-hover:scale-105"
                          />
                        ) : (
                          <span className="serif grid h-full place-items-center text-xs text-[#8d8981]">
                            Aylee
                          </span>
                        )}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-xs text-[#6c6961]">
                          {suggestion.category || "Aylee"}
                        </span>
                        <span className="mt-1 block truncate font-medium group-hover:text-[#6f2d24]">
                          {suggestion.name}
                        </span>
                        <span className="mt-1 block text-sm font-semibold">
                          {formatPrice(suggestion.price)}
                        </span>
                      </span>
                      <ArrowRight
                        size={18}
                        className="shrink-0 transition-transform group-hover:translate-x-1"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="py-10 text-center md:py-14">
                <p className="serif text-2xl md:text-3xl">
                  No matching products found.
                </p>
                <p className="mt-2 text-sm text-[#6c6961]">
                  Try another product or category name.
                </p>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}
