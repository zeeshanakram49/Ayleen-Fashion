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
import { SplitText } from "@/components/motion/text-reveal";
import { MagneticButton } from "@/components/motion/magnetic-button";

type HeroSliderProps = {
  banners: Banner[];
};

export function HeroSlider({ banners }: HeroSliderProps) {
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
      className="hero-shell relative h-[100svh] min-h-[680px] w-full touch-pan-y overflow-hidden overscroll-x-none bg-[#1b1b18]"
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
                <Image
                  src={banner.image}
                  alt={banner.title || "Aylee seasonal collection"}
                  fill
                  preload={index === 0}
                  fetchPriority={index === 0 ? "high" : "auto"}
                  quality={70}
                  draggable={false}
                  sizes="100vw"
                  className={`hero-image object-cover object-center ${index === activeSlide ? "is-active" : ""}`}
                  onLoad={
                    index === 0 ? () => setFirstImageLoaded(true) : undefined
                  }
                  onError={
                    index === 0 ? () => setFirstImageLoaded(true) : undefined
                  }
                />
              </div>
            );
          })}
        </div>
      ) : (
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,#c9c1b4,#eeeae2_55%,#b5aa99)]" />
      )}

      <div className="pointer-events-none absolute inset-0 z-[2] bg-[linear-gradient(90deg,rgba(10,10,9,.72)_0%,rgba(10,10,9,.35)_43%,rgba(10,10,9,.08)_75%),linear-gradient(0deg,rgba(10,10,9,.58)_0%,transparent_42%)]" />
      <div className="hero-noise pointer-events-none absolute inset-0 z-[3] opacity-[0.16]" />

      <div className="container-site relative z-[4] flex h-full items-end pb-28 text-white md:items-center md:pb-0">
        <div key={activeSlide} className="hero-copy max-w-3xl pt-24">
          <p className="eyebrow flex items-center gap-3 !text-white/70">
            <span className="h-px w-8 bg-white/60" /> The new Aylee edit
          </p>
          <h1 className="display-title mt-5 text-balance drop-shadow-sm">
            <SplitText
              text={banners[activeSlide]?.title || "Everyday, considered."}
              animateKey={activeSlide}
            />
          </h1>
          <p className="mt-6 max-w-lg text-sm leading-7 text-white/75 md:text-base">
            {banners[activeSlide]?.description ||
              "Modern essentials shaped for real days—quietly confident, effortlessly yours."}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <MagneticButton>
              <Link
                href="/shop"
                className="button-primary button-arrow !border-white !bg-white !text-[#171613] hover:!border-[#f2eee7] hover:!bg-[#f2eee7]"
              >
                Shop collection <ArrowRight size={16} />
              </Link>
            </MagneticButton>
            <Link
              href="/collections"
              className="button-secondary !border-white/55 !text-white hover:!border-white hover:!bg-white hover:!text-[#171613]"
            >
              Explore edits
            </Link>
          </div>
        </div>
      </div>

      {banners.length > 1 ? (
        <div className="container-site absolute inset-x-0 bottom-7 z-[5] flex items-end justify-between text-white md:bottom-10">
          <div
            className="flex w-full max-w-[260px] gap-2"
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
