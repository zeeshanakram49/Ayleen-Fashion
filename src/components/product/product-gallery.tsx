"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Expand, X } from "lucide-react";
import type { ProductImage } from "@/types/commerce";

export function ProductGallery({
  images,
  productName,
}: {
  images: ProductImage[];
  productName: string;
}) {
  const [active, setActive] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const image = images[active];

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (expanded && !dialog.open) dialog.showModal();
    if (!expanded && dialog.open) dialog.close();
  }, [expanded]);

  if (!image) {
    return (
      <div className="serif flex aspect-[4/5] items-center justify-center bg-[#efede7] text-3xl text-[#928e84]">
        Aylee
      </div>
    );
  }

  return (
    <div>
      <div className="relative aspect-[4/5] overflow-hidden bg-[#efede7]">
        <Image
          src={image.url}
          alt={image.alt || productName}
          fill
          sizes="(max-width: 1024px) calc(100vw - 2rem), 58vw"
          className="object-cover"
          loading="eager"
        />
        <button
          type="button"
          onClick={() => setExpanded(true)}
          className="absolute right-4 bottom-4 grid size-11 place-items-center rounded-full bg-white/90"
          aria-label="Expand product image"
        >
          <Expand size={18} />
        </button>
      </div>
      {images.length > 1 ? (
        <div className="mt-3 grid grid-cols-5 gap-2">
          {images.slice(0, 10).map((item, index) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setActive(index)}
              className={`relative aspect-[4/5] overflow-hidden bg-[#efede7] ${active === index ? "ring-2 ring-[#171613] ring-offset-2" : ""}`}
              aria-label={`Show image ${index + 1}`}
              aria-pressed={active === index}
            >
              <Image
                src={item.thumbnailUrl || item.url}
                alt=""
                fill
                sizes="100px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      ) : null}
      <dialog
        ref={dialogRef}
        onClose={() => setExpanded(false)}
        className="m-auto h-[100dvh] w-screen max-w-none bg-white backdrop:bg-black/60"
      >
        <button
          type="button"
          onClick={() => setExpanded(false)}
          className="absolute top-4 right-4 z-10 grid size-12 place-items-center rounded-full bg-white shadow"
          aria-label="Close expanded image"
        >
          <X size={22} />
        </button>
        {expanded ? (
          <div className="relative h-full w-full">
            <Image
              src={image.url}
              alt={image.alt || productName}
              fill
              sizes="100vw"
              className="object-contain"
            />
          </div>
        ) : null}
      </dialog>
    </div>
  );
}
