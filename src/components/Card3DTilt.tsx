import { useState, useRef, type ReactNode, type MouseEvent } from 'react';

type Card3DTiltProps = {
  children: ReactNode;
  maxDegree?: number;
  className?: string;
};

export function Card3DTilt({
  children,
  maxDegree = 5,
  className = '',
}: Card3DTiltProps) {
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    // Disable on touch devices
    if ('ontouchstart' in window) return;

    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const rotX = ((mouseY - height / 2) / (height / 2)) * -maxDegree;
    const rotY = ((mouseX - width / 2) / (width / 2)) * maxDegree;

    setRotateX(rotX);
    setRotateY(rotY);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`card-depth-container ${className}`}
    >
      <div
        className="card-depth-tilt h-full w-full"
        style={{
          transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
        }}
      >
        {children}
      </div>
    </div>
  );
}
