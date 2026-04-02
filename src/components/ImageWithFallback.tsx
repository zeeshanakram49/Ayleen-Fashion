import { useEffect, useState } from 'react';
import type { ImgHTMLAttributes, SyntheticEvent } from 'react';

type ImageWithFallbackProps = ImgHTMLAttributes<HTMLImageElement> & {
  fallbackSrc?: string;
};

const DEFAULT_FALLBACK_SRC = '/product-fallback.svg';

export function ImageWithFallback({
  src,
  fallbackSrc = DEFAULT_FALLBACK_SRC,
  onError,
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

  return <img {...props} src={currentSrc} onError={handleError} />;
}
