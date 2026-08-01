import { useEffect, useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import { ImageWithFallback } from './ImageWithFallback';

type FullscreenProductGalleryProps = {
  isOpen: boolean;
  images: string[];
  initialIndex?: number;
  productTitle?: string;
  onClose: () => void;
};

export function FullscreenProductGallery({
  isOpen,
  images,
  initialIndex = 0,
  productTitle = 'Product Image',
  onClose,
}: FullscreenProductGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const touchStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Sync index when initialIndex changes or modal opens
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex);
      setZoomLevel(1);
      setPanOffset({ x: 0, y: 0 });
    }
  }, [isOpen, initialIndex]);

  // Lock body scroll while gallery is open
  useEffect(() => {
    if (!isOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, currentIndex, images.length]);

  const handlePrev = useCallback(() => {
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  }, [images.length]);

  const handleNext = useCallback(() => {
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  }, [images.length]);

  const toggleZoom = () => {
    if (zoomLevel > 1) {
      setZoomLevel(1);
      setPanOffset({ x: 0, y: 0 });
    } else {
      setZoomLevel(2.2);
    }
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    if (e.deltaY < 0) {
      setZoomLevel((prev) => Math.min(prev + 0.3, 3.5));
    } else {
      setZoomLevel((prev) => {
        const next = Math.max(prev - 0.3, 1);
        if (next === 1) setPanOffset({ x: 0, y: 0 });
        return next;
      });
    }
  };

  // Mouse pan handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoomLevel <= 1) return;
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX - panOffset.x, y: e.clientY - panOffset.y };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || zoomLevel <= 1) return;
    setPanOffset({
      x: e.clientX - dragStartRef.current.x,
      y: e.clientY - dragStartRef.current.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Mobile Touch Swipe Handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      touchStartRef.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      };
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (zoomLevel > 1) return;
    if (e.changedTouches.length === 1) {
      const deltaX = e.changedTouches[0].clientX - touchStartRef.current.x;
      const deltaY = e.changedTouches[0].clientY - touchStartRef.current.y;

      // Swipe horizontally if X movement is dominant and > 40px
      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 40) {
        if (deltaX > 0) {
          handlePrev();
        } else {
          handleNext();
        }
      }
    }
  };

  if (!isOpen || images.length === 0) return null;

  const currentImage = images[currentIndex] || images[0];

  return (
    <AnimatePresence>
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label={`${productTitle} Fullscreen Gallery`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        className="fixed inset-0 z-[9999] flex flex-col justify-between bg-black/95 text-white backdrop-blur-2xl select-none"
      >
        {/* Top Header Bar */}
        <header className="flex h-16 w-full items-center justify-between px-4 sm:px-8 border-b border-white/10 bg-black/40 backdrop-blur-md z-10">
          <div className="flex items-center gap-3">
            <span className="text-xs tracking-[0.2em] font-semibold text-neutral-300 uppercase">
              AYLEE GALLERY
            </span>
            <span className="text-xs text-neutral-500">•</span>
            <span className="text-xs font-mono text-neutral-400">
              {currentIndex + 1} / {images.length}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleZoom}
              aria-label={zoomLevel > 1 ? 'Zoom Out' : 'Zoom In'}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition active:scale-95"
            >
              {zoomLevel > 1 ? <ZoomOut size={18} /> : <ZoomIn size={18} />}
            </button>
            {zoomLevel > 1 && (
              <button
                type="button"
                onClick={() => {
                  setZoomLevel(1);
                  setPanOffset({ x: 0, y: 0 });
                }}
                aria-label="Reset Zoom"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition active:scale-95"
              >
                <RotateCcw size={16} />
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close Gallery"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-white hover:bg-white/30 transition active:scale-95"
            >
              <X size={20} />
            </button>
          </div>
        </header>

        {/* Main Image Viewport Area */}
        <div
          ref={containerRef}
          onWheel={handleWheel}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onDoubleClick={toggleZoom}
          className={`relative flex-1 w-full flex items-center justify-center overflow-hidden p-2 sm:p-6 ${
            zoomLevel > 1 ? (isDragging ? 'cursor-grabbing' : 'cursor-grab') : 'cursor-zoom-in'
          }`}
        >
          {/* Navigation Arrows for Desktop */}
          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrev();
                }}
                aria-label="Previous Image"
                className="absolute left-4 top-1/2 -translate-y-1/2 z-20 hidden sm:flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md transition hover:bg-white/25 active:scale-90"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleNext();
                }}
                aria-label="Next Image"
                className="absolute right-4 top-1/2 -translate-y-1/2 z-20 hidden sm:flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md transition hover:bg-white/25 active:scale-90"
              >
                <ChevronRight size={24} />
              </button>
            </>
          )}

          {/* Active Image Container */}
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{
              opacity: 1,
              scale: zoomLevel,
              x: panOffset.x,
              y: panOffset.y,
            }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="flex items-center justify-center max-h-full max-w-full"
          >
            <ImageWithFallback
              src={currentImage}
              alt={`${productTitle} view ${currentIndex + 1}`}
              className="max-h-[82vh] max-w-[92vw] object-contain drop-shadow-2xl pointer-events-none"
            />
          </motion.div>
        </div>

        {/* Bottom Thumbnail Strip Footer */}
        {images.length > 1 && (
          <footer className="h-20 w-full flex items-center justify-center px-4 border-t border-white/10 bg-black/40 backdrop-blur-md">
            <div className="flex items-center gap-2 overflow-x-auto py-2 max-w-full no-scrollbar">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setZoomLevel(1);
                    setPanOffset({ x: 0, y: 0 });
                    setCurrentIndex(idx);
                  }}
                  className={`relative h-14 w-11 shrink-0 overflow-hidden rounded border-2 transition-all ${
                    idx === currentIndex
                      ? 'border-white scale-105 opacity-100 shadow-md'
                      : 'border-transparent opacity-50 hover:opacity-80'
                  }`}
                >
                  <ImageWithFallback
                    src={img}
                    alt={`Thumbnail ${idx + 1}`}
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          </footer>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
