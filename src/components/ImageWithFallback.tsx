import { useEffect, useState } from 'react';
import type { ImgHTMLAttributes, SyntheticEvent } from 'react';

type ImageWithFallbackProps = ImgHTMLAttributes<HTMLImageElement> & {
  fallbackSrc?: string;
};

const DEFAULT_FALLBACK_SRC = '';

export function ImageWithFallback({
  src,
  fallbackSrc = DEFAULT_FALLBACK_SRC,
  onError,
  alt,
  className,
  style,
  ...props
}: ImageWithFallbackProps) {
  const [currentSrc, setCurrentSrc] = useState(src);

  useEffect(() => {
    setCurrentSrc(src);
  }, [src]);

  function handleError(event: SyntheticEvent<HTMLImageElement, Event>) {
    if (currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc);
    }
    onError?.(event);
  }

  if (!currentSrc) {
    return (
      <span
        className={`image-placeholder ${className ?? ''}`}
        role={alt ? 'img' : undefined}
        aria-label={alt}
        style={style}
      />
    );
  }

  return (
    <img
      {...props}
      alt={alt}
      className={className}
      style={style}
      src={currentSrc}
      onError={handleError}
    />
  );
}
