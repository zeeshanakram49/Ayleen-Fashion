"use client";

import {
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type TouchEvent as ReactTouchEvent,
  type WheelEvent as ReactWheelEvent,
} from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { Banner } from "@/types/commerce";

type HeroSliderProps = {
  banners: Banner[];
  discountPercent?: number;
};

function HeroVideo({
  src,
  poster,
  active,
  first,
  onReady,
}: {
  src: string;
  poster: string | null;
  active: boolean;
  first: boolean;
  onReady: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (active) {
      void video.play().catch(() => undefined);
    } else {
      video.pause();
    }
  }, [active]);

  return (
    <video
      ref={videoRef}
      src={src}
      poster={poster || undefined}
      autoPlay={active}
      muted
      loop
      playsInline
      preload={first ? "auto" : "metadata"}
      className="hero-image hero-image-main h-full w-full object-cover object-center"
      onCanPlay={first ? onReady : undefined}
      onError={first ? onReady : undefined}
    />
  );
}

export function HeroSlider({ banners, discountPercent = 0 }: HeroSliderProps) {
  const [activeSlide, setActiveSlide] = useState(0);
  const [firstImageLoaded, setFirstImageLoaded] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const swipeStartRef = useRef({ x: 0, y: 0 });
  const trackpadAmountRef = useRef(0);
  const trackpadLockedRef = useRef(false);
  const trackpadEndTimerRef = useRef<number | null>(null);

  useEffect(() => {
    if (banners.length < 2 || !firstImageLoaded) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reducedMotion) return;

    const timer = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % banners.length);
    }, 6000);

    return () => window.clearInterval(timer);
  }, [activeSlide, banners.length, firstImageLoaded]);

  useEffect(
    () => () => {
      if (trackpadEndTimerRef.current !== null) {
        window.clearTimeout(trackpadEndTimerRef.current);
      }
    },
    [],
  );

  function moveSlide(direction: -1 | 1) {
    if (banners.length < 2) return;
    setActiveSlide(
      (current) => (current + direction + banners.length) % banners.length,
    );
  }

  function handlePointerDown(event: ReactPointerEvent<HTMLElement>) {
    if (event.pointerType !== "mouse") return;
    swipeStartRef.current = { x: event.clientX, y: event.clientY };
  }

  function handlePointerMove(event: ReactPointerEvent<HTMLElement>) {
    if (event.pointerType !== "mouse" || !sectionRef.current) return;
    const bounds = sectionRef.current.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    sectionRef.current.style.setProperty("--hero-x", x.toFixed(3));
    sectionRef.current.style.setProperty("--hero-y", y.toFixed(3));
  }

  function resetPointerDepth() {
    sectionRef.current?.style.setProperty("--hero-x", "0");
    sectionRef.current?.style.setProperty("--hero-y", "0");
  }

  function handlePointerUp(event: ReactPointerEvent<HTMLElement>) {
    if (event.pointerType !== "mouse") return;
    processSwipe(event.clientX, event.clientY);
  }

  function handleTouchStart(event: ReactTouchEvent<HTMLElement>) {
    const touch = event.touches[0];
    if (!touch) return;
    swipeStartRef.current = { x: touch.clientX, y: touch.clientY };
  }

  function handleTouchEnd(event: ReactTouchEvent<HTMLElement>) {
    const touch = event.changedTouches[0];
    if (!touch) return;
    processSwipe(touch.clientX, touch.clientY);
  }

  function processSwipe(endX: number, endY: number) {
    if (banners.length < 2) return;
    const distanceX = endX - swipeStartRef.current.x;
    const distanceY = endY - swipeStartRef.current.y;
    if (Math.abs(distanceX) < 45 || Math.abs(distanceX) <= Math.abs(distanceY))
      return;
    moveSlide(distanceX < 0 ? 1 : -1);
  }

  function handleTrackpadSwipe(event: ReactWheelEvent<HTMLElement>) {
    if (
      banners.length < 2 ||
      Math.abs(event.deltaX) <= Math.abs(event.deltaY) ||
      Math.abs(event.deltaX) < 2
    )
      return;

    event.preventDefault();
    if (trackpadEndTimerRef.current !== null) {
      window.clearTimeout(trackpadEndTimerRef.current);
    }
    trackpadEndTimerRef.current = window.setTimeout(() => {
      trackpadLockedRef.current = false;
      trackpadAmountRef.current = 0;
    }, 180);
    if (trackpadLockedRef.current) return;

    trackpadAmountRef.current += event.deltaX;
    if (Math.abs(trackpadAmountRef.current) < 30) return;

    moveSlide(trackpadAmountRef.current > 0 ? 1 : -1);
    trackpadAmountRef.current = 0;
    trackpadLockedRef.current = true;
  }

  return (
    <section
      ref={sectionRef}
      className="hero-shell relative h-[100svh] min-h-[600px] w-full touch-pan-y overflow-hidden overscroll-x-none bg-[#1b1b18] sm:min-h-[640px] md:min-h-[680px]"
      aria-roledescription="carousel"
      aria-label="Aylee seasonal collection"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={resetPointerDepth}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onWheel={handleTrackpadSwipe}
    >
      {banners.length ? (
        <div className="pointer-events-none absolute inset-0">
          {banners.map((banner, index) => {
            if (index > 0 && !firstImageLoaded) return null;
            return (
              <div
                key={banner.id}
                className={`hero-slide absolute inset-0 transition-[opacity,transform] duration-[1200ms] ease-[cubic-bezier(.22,1,.36,1)] ${
                  index === activeSlide
                    ? "z-[1] scale-100 opacity-100"
                    : "scale-[1.025] opacity-0"
                }`}
                aria-hidden={index !== activeSlide}
              >
                {banner.video ? (
                  <HeroVideo
                    src={banner.video}
                    poster={banner.image}
                    active={index === activeSlide}
                    first={index === 0}
                    onReady={() => setFirstImageLoaded(true)}
                  />
                ) : banner.image ? (
                  <Image
                    src={banner.image}
                    alt={banner.title || "Aylee seasonal collection"}
                    fill
                    preload={index === 0}
                    fetchPriority={index === 0 ? "high" : "auto"}
                    quality={70}
                    draggable={false}
                    sizes="100vw"
                    className="hero-image hero-image-main object-cover object-center"
                    onLoad={
                      index === 0 ? () => setFirstImageLoaded(true) : undefined
                    }
                    onError={
                      index === 0 ? () => setFirstImageLoaded(true) : undefined
                    }
                  />
                ) : null}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,#c9c1b4,#eeeae2_55%,#b5aa99)]" />
      )}
      <h1 className="sr-only">Aylee seasonal collection</h1>

      <div className="pointer-events-none absolute inset-0 z-[2] bg-gradient-to-t from-black/75 via-black/5 to-black/10 md:hidden" />
      <div className="absolute inset-x-0 bottom-20 z-[4] px-5 pb-5 text-white md:hidden">
        <p className="text-[0.65rem] font-semibold tracking-[0.22em] text-white/75 uppercase">
          Aylee store
        </p>
        <h2 className="serif mt-2 max-w-[18rem] text-[2.6rem] leading-[0.9] tracking-[-0.04em] text-balance">
          {discountPercent > 0
            ? `Up to ${discountPercent}% off`
            : banners[activeSlide]?.title || "Everyday style"}
        </h2>
        <p className="mt-3 max-w-[18rem] text-xs leading-5 text-white/80">
          {banners[activeSlide]?.description ||
            "Easy essentials, made for every day."}
        </p>
        <Link
          href={discountPercent > 0 ? "/sale" : "/shop"}
          className="pointer-events-auto mt-5 inline-flex min-h-11 items-center bg-white px-5 text-[0.68rem] font-bold tracking-[0.16em] text-[#171613] uppercase shadow-lg"
        >
          {discountPercent > 0 ? "Shop the sale" : "Shop now"}
        </Link>
      </div>

      {discountPercent > 0 ? (
        <Link
          href="/sale"
          aria-label={`Shop sale with discounts up to ${discountPercent}% off`}
          className="group absolute right-8 bottom-28 z-[4] hidden size-28 rotate-3 place-items-center rounded-full border border-white/45 bg-[#6f2d24] text-center text-white shadow-[0_18px_50px_rgb(0_0_0/0.28)] transition-transform duration-300 hover:scale-105 hover:rotate-0 md:grid lg:right-[max(2rem,calc((100vw-1440px)/2))]"
        >
          <span className="absolute inset-1.5 rounded-full border border-dashed border-white/45 transition-transform duration-700 group-hover:rotate-45" />
          <span className="relative flex flex-col items-center uppercase">
            <span className="text-[0.55rem] font-semibold tracking-[0.2em] text-white/75">
              Up to
            </span>
            <strong className="serif mt-0.5 text-[1.45rem] leading-none tracking-[-0.04em] md:text-[2rem]">
              {discountPercent}%
            </strong>
            <span className="mt-1 text-[0.58rem] font-bold tracking-[0.2em]">
              Off · Shop
            </span>
          </span>
        </Link>
      ) : null}

      {banners.length > 1 ? (
        <div className="container-site absolute inset-x-0 top-3 z-[5] flex items-end justify-between text-white md:top-auto md:bottom-10">
          <div
            className="flex w-full max-w-[45%] gap-2 md:max-w-[260px]"
            role="group"
            aria-label="Choose a banner"
          >
            {banners.map((banner, index) => (
              <button
                key={banner.id}
                type="button"
                className="group/step flex-1 py-3 text-left"
                aria-label={`Show banner ${index + 1}: ${banner.title}`}
                aria-current={index === activeSlide ? "true" : undefined}
                onClick={() => setActiveSlide(index)}
              >
                <span className="mb-2 block text-[0.62rem] tracking-[0.16em] text-white/65">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="block h-px overflow-hidden bg-white/30">
                  <span
                    className={`block h-full origin-left bg-white transition-transform duration-700 ${index === activeSlide ? "scale-x-100" : "scale-x-0 group-hover/step:scale-x-50"}`}
                  />
                </span>
              </button>
            ))}
          </div>
          <div className="hidden items-center gap-2 sm:flex">
            <button
              type="button"
              onClick={() => moveSlide(-1)}
              className="hero-control"
              aria-label="Previous banner"
            >
              <ArrowLeft size={17} />
            </button>
            <button
              type="button"
              onClick={() => moveSlide(1)}
              className="hero-control"
              aria-label="Next banner"
            >
              <ArrowRight size={17} />
            </button>
          </div>
        </div>
      ) : null}
    </section>
  );
}
