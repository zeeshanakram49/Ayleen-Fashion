"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type WheelEvent as ReactWheelEvent,
} from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Expand,
  Minus,
  Plus,
  RotateCcw,
  X,
} from "lucide-react";
import type { ProductImage } from "@/types/commerce";

const MIN_ZOOM = 1;
const MAX_ZOOM = 3;
const ZOOM_STEP = 0.5;

export function ProductGallery({
  images,
  productName,
}: {
  images: ProductImage[];
  productName: string;
}) {
  const [active, setActive] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [zoom, setZoom] = useState(MIN_ZOOM);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [modalImageLoaded, setModalImageLoaded] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const pointerStartRef = useRef({ x: 0, y: 0, panX: 0, panY: 0 });
  const image = images[active];

  const resetZoom = useCallback(() => {
    setZoom(MIN_ZOOM);
    setPan({ x: 0, y: 0 });
    setDragging(false);
  }, []);

  const moveSlide = useCallback(
    (direction: -1 | 1) => {
      if (images.length < 2) return;
      setActive(
        (current) => (current + direction + images.length) % images.length,
      );
      setModalImageLoaded(false);
      resetZoom();
    },
    [images.length, resetZoom],
  );

  const selectSlide = useCallback(
    (index: number) => {
      setActive(index);
      setModalImageLoaded(false);
      resetZoom();
    },
    [resetZoom],
  );

  const openFullscreen = useCallback(() => {
    if (image) {
      const preload = new window.Image();
      preload.src = image.url;
    }
    setModalImageLoaded(false);
    resetZoom();
    setExpanded(true);
  }, [image, resetZoom]);

  const closeFullscreen = useCallback(() => {
    setExpanded(false);
    resetZoom();
  }, [resetZoom]);

  useEffect(() => {
    if (!expanded) return;

    previousFocusRef.current = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusTimer = window.requestAnimationFrame(() => {
      closeButtonRef.current?.focus();
    });

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeFullscreen();
      if (event.key === "ArrowLeft") moveSlide(-1);
      if (event.key === "ArrowRight") moveSlide(1);
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.cancelAnimationFrame(focusTimer);
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
      previousFocusRef.current?.focus();
    };
  }, [closeFullscreen, expanded, moveSlide]);

  useEffect(() => {
    if (!expanded || images.length < 2) return;
    const adjacentIndexes = [
      (active - 1 + images.length) % images.length,
      (active + 1) % images.length,
    ];
    adjacentIndexes.forEach((index) => {
      const adjacentImage = images[index];
      if (!adjacentImage) return;
      const preload = new window.Image();
      preload.src = adjacentImage.url;
    });
  }, [active, expanded, images]);

  function changeZoom(nextZoom: number) {
    const clamped = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, nextZoom));
    setZoom(clamped);
    if (clamped === MIN_ZOOM) setPan({ x: 0, y: 0 });
  }

  function handleWheel(event: ReactWheelEvent<HTMLDivElement>) {
    event.preventDefault();
    changeZoom(zoom + (event.deltaY < 0 ? 0.25 : -0.25));
  }

  function handlePointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    pointerStartRef.current = {
      x: event.clientX,
      y: event.clientY,
      panX: pan.x,
      panY: pan.y,
    };
    if (zoom > MIN_ZOOM) {
      setDragging(true);
      event.currentTarget.setPointerCapture(event.pointerId);
    }
  }

  function handlePointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    if (!dragging || zoom <= MIN_ZOOM) return;
    const viewport = viewportRef.current;
    const maxX = viewport ? (viewport.clientWidth * (zoom - 1)) / 2 : Infinity;
    const maxY = viewport ? (viewport.clientHeight * (zoom - 1)) / 2 : Infinity;
    const nextX =
      pointerStartRef.current.panX + event.clientX - pointerStartRef.current.x;
    const nextY =
      pointerStartRef.current.panY + event.clientY - pointerStartRef.current.y;
    setPan({
      x: Math.min(maxX, Math.max(-maxX, nextX)),
      y: Math.min(maxY, Math.max(-maxY, nextY)),
    });
  }

  function handlePointerUp(event: ReactPointerEvent<HTMLDivElement>) {
    if (dragging) {
      setDragging(false);
      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId);
      }
      return;
    }
    if (zoom > MIN_ZOOM || event.pointerType === "mouse") return;
    const distance = event.clientX - pointerStartRef.current.x;
    if (Math.abs(distance) > 45) moveSlide(distance > 0 ? -1 : 1);
  }

  if (!image) {
    return (
      <div className="serif flex aspect-[4/5] items-center justify-center bg-[#efede7] text-3xl text-[#928e84]">
        Aylee
      </div>
    );
  }

  return (
    <div>
      <div className="group relative aspect-[4/5] overflow-hidden bg-[#efede7]">
        <AnimatePresence initial={false} mode="popLayout">
          <motion.button
            key={image.id}
            type="button"
            onClick={openFullscreen}
            onPointerEnter={() => {
              const preload = new window.Image();
              preload.src = image.url;
            }}
            className="absolute inset-0 cursor-zoom-in focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#171613]"
            aria-label={`Open ${productName} image ${active + 1} in fullscreen`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <Image
              src={image.url}
              alt={image.alt || productName}
              fill
              sizes="(max-width: 1024px) calc(100vw - 2rem), 58vw"
              className="object-cover"
              loading="eager"
            />
          </motion.button>
        </AnimatePresence>
        {images.length > 1 ? (
          <>
            <button
              type="button"
              onClick={() => moveSlide(-1)}
              className="absolute top-1/2 left-3 grid size-10 -translate-y-1/2 place-items-center rounded-full bg-white/90 shadow-sm transition md:opacity-0 md:group-hover:opacity-100 md:focus:opacity-100"
              aria-label="Show previous product image"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              type="button"
              onClick={() => moveSlide(1)}
              className="absolute top-1/2 right-3 grid size-10 -translate-y-1/2 place-items-center rounded-full bg-white/90 shadow-sm transition md:opacity-0 md:group-hover:opacity-100 md:focus:opacity-100"
              aria-label="Show next product image"
            >
              <ChevronRight size={20} />
            </button>
          </>
        ) : null}
        <button
          type="button"
          onClick={openFullscreen}
          onPointerEnter={() => {
            const preload = new window.Image();
            preload.src = image.url;
          }}
          className="absolute right-4 bottom-4 grid size-11 place-items-center rounded-full bg-white/90 shadow-sm transition hover:scale-105"
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
              onClick={() => selectSlide(index)}
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

      {expanded ? (
        <div
          className="fixed inset-0 z-[100] flex flex-col bg-[#f8f7f3] text-[#171613]"
          role="dialog"
          aria-modal="true"
          aria-label={`${productName} fullscreen gallery`}
        >
          <div className="flex h-16 shrink-0 items-center justify-between border-b border-[#dedbd2] bg-white/95 px-4 backdrop-blur md:px-7">
            <div className="min-w-0">
              <p className="truncate text-xs font-bold tracking-[0.14em] uppercase">
                {productName}
              </p>
              <p className="mt-0.5 text-xs text-[#6c6961]">
                {active + 1} / {images.length}
              </p>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => changeZoom(zoom - ZOOM_STEP)}
                disabled={zoom === MIN_ZOOM}
                className="grid size-10 place-items-center rounded-full border border-[#dedbd2] bg-white disabled:opacity-35"
                aria-label="Zoom out"
              >
                <Minus size={18} />
              </button>
              <span className="hidden min-w-12 text-center text-xs font-semibold sm:block">
                {Math.round(zoom * 100)}%
              </span>
              <button
                type="button"
                onClick={() => changeZoom(zoom + ZOOM_STEP)}
                disabled={zoom === MAX_ZOOM}
                className="grid size-10 place-items-center rounded-full border border-[#dedbd2] bg-white disabled:opacity-35"
                aria-label="Zoom in"
              >
                <Plus size={18} />
              </button>
              {zoom > MIN_ZOOM ? (
                <button
                  type="button"
                  onClick={resetZoom}
                  className="grid size-10 place-items-center rounded-full border border-[#dedbd2] bg-white"
                  aria-label="Reset zoom"
                >
                  <RotateCcw size={17} />
                </button>
              ) : null}
              <button
                ref={closeButtonRef}
                type="button"
                onClick={closeFullscreen}
                className="ml-1 grid size-10 place-items-center rounded-full bg-[#171613] text-white"
                aria-label="Close fullscreen gallery"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          <div
            ref={viewportRef}
            className={`relative min-h-0 flex-1 touch-none overflow-hidden ${
              zoom > MIN_ZOOM
                ? dragging
                  ? "cursor-grabbing"
                  : "cursor-grab"
                : "cursor-zoom-in"
            }`}
            onWheel={handleWheel}
            onDoubleClick={() => changeZoom(zoom === MIN_ZOOM ? 2 : MIN_ZOOM)}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={() => setDragging(false)}
          >
            {!modalImageLoaded ? (
              <div className="absolute inset-0 z-20 grid place-items-center bg-[#f8f7f3]">
                <div className="text-center">
                  <span className="mx-auto block size-9 animate-spin rounded-full border-2 border-[#cbc7be] border-t-[#171613]" />
                  <p className="mt-4 text-xs font-semibold tracking-[0.14em] text-[#6c6961] uppercase">
                    Loading image
                  </p>
                </div>
              </div>
            ) : null}

            <div
              className={`absolute inset-4 transition-transform duration-200 md:inset-8 ${dragging ? "!duration-0" : ""}`}
              style={{
                transform: `translate3d(${pan.x}px, ${pan.y}px, 0) scale(${zoom})`,
              }}
            >
              <Image
                key={image.id}
                src={image.url}
                alt={image.alt || `${productName} image ${active + 1}`}
                fill
                sizes="100vw"
                unoptimized
                priority
                className={`pointer-events-none object-contain transition-opacity duration-200 ${modalImageLoaded ? "opacity-100" : "opacity-0"}`}
                onLoad={() => setModalImageLoaded(true)}
              />
            </div>

            {images.length > 1 && zoom === MIN_ZOOM ? (
              <>
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    moveSlide(-1);
                  }}
                  className="absolute top-1/2 left-3 z-30 grid size-11 -translate-y-1/2 place-items-center rounded-full border border-[#dedbd2] bg-white/90 shadow md:left-6 md:size-12"
                  aria-label="Previous image"
                >
                  <ChevronLeft size={23} />
                </button>
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    moveSlide(1);
                  }}
                  className="absolute top-1/2 right-3 z-30 grid size-11 -translate-y-1/2 place-items-center rounded-full border border-[#dedbd2] bg-white/90 shadow md:right-6 md:size-12"
                  aria-label="Next image"
                >
                  <ChevronRight size={23} />
                </button>
              </>
            ) : null}
          </div>

          {images.length > 1 ? (
            <div className="shrink-0 border-t border-[#dedbd2] bg-white/95 px-4 py-3 backdrop-blur">
              <div className="mx-auto flex max-w-4xl gap-2 overflow-x-auto">
                {images.map((item, index) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => selectSlide(index)}
                    className={`relative h-16 w-13 shrink-0 overflow-hidden bg-[#efede7] transition md:h-20 md:w-16 ${
                      active === index
                        ? "ring-2 ring-[#171613] ring-offset-2"
                        : "opacity-60 hover:opacity-100"
                    }`}
                    aria-label={`Show fullscreen image ${index + 1}`}
                    aria-pressed={active === index}
                  >
                    <Image
                      src={item.thumbnailUrl || item.url}
                      alt=""
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
