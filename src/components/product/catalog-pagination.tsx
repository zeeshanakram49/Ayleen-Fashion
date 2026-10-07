"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

function visiblePages(currentPage: number, totalPages: number) {
  const pages = new Set([
    1,
    totalPages,
    currentPage - 1,
    currentPage,
    currentPage + 1,
  ]);

  return [...pages]
    .filter((page) => page >= 1 && page <= totalPages)
    .sort((a, b) => a - b);
}

export function CatalogPagination({
  currentPage,
  totalPages,
}: {
  currentPage: number;
  totalPages: number;
}) {
  const pathname = usePathname() || "/shop";
  const searchParams = useSearchParams();

  if (totalPages <= 1) return null;

  const hrefFor = (page: number) => {
    const params = new URLSearchParams(searchParams?.toString() || "");

    if (page === 1) {
      params.delete("page");
    } else {
      params.set("page", String(page));
    }

    const query = params.toString();
    return query ? `${pathname}?${query}` : pathname;
  };

  const pages = visiblePages(currentPage, totalPages);

  return (
    <nav
      className="mt-14 flex items-center justify-center gap-2"
      aria-label="Product pagination"
    >
      {currentPage > 1 ? (
        <Link
          href={hrefFor(currentPage - 1)}
          className="grid size-11 place-items-center border border-[#dedbd2] transition-colors hover:border-[#171613]"
          aria-label="Previous product page"
          scroll
        >
          <ChevronLeft size={17} />
        </Link>
      ) : (
        <span
          className="grid size-11 place-items-center border border-[#dedbd2] text-[#aaa69d]"
          aria-hidden="true"
        >
          <ChevronLeft size={17} />
        </span>
      )}

      {pages.map((page, index) => {
        const previous = pages[index - 1];
        const showGap = previous !== undefined && page - previous > 1;
        const active = page === currentPage;

        return (
          <span key={page} className="contents">
            {showGap ? (
              <span className="grid size-8 place-items-center text-[#6c6961]">
                …
              </span>
            ) : null}
            <Link
              href={hrefFor(page)}
              className={`grid size-11 place-items-center border text-sm font-semibold transition-colors ${
                active
                  ? "border-[#171613] bg-[#171613] text-white"
                  : "border-[#dedbd2] hover:border-[#171613]"
              }`}
              aria-current={active ? "page" : undefined}
              aria-label={`Product page ${page}`}
              scroll
            >
              {page}
            </Link>
          </span>
        );
      })}

      {currentPage < totalPages ? (
        <Link
          href={hrefFor(currentPage + 1)}
          className="grid size-11 place-items-center border border-[#dedbd2] transition-colors hover:border-[#171613]"
          aria-label="Next product page"
          scroll
        >
          <ChevronRight size={17} />
        </Link>
      ) : (
        <span
          className="grid size-11 place-items-center border border-[#dedbd2] text-[#aaa69d]"
          aria-hidden="true"
        >
          <ChevronRight size={17} />
        </span>
      )}
    </nav>
  );
}
