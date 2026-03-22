import React, { CSSProperties, ReactNode, useEffect, useRef, useState } from 'react';
import './PixelTransition.css';

interface PixelTransitionProps {
  firstContent: ReactNode;
  secondContent: ReactNode;
  gridSize?: number;
  pixelColor?: string;
  className?: string;
  style?: CSSProperties;
}

const PixelTransition: React.FC<PixelTransitionProps> = ({
  firstContent,
  secondContent,
  gridSize = 10,
  pixelColor = '#020804',
  className = '',
  style = {}
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isActive, setIsActive] = useState(false);
  const hasAnimatedRef = useRef(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      entries => {
        const entry = entries[0];
        if (!entry) return;

        if (entry.isIntersecting && !hasAnimatedRef.current) {
          hasAnimatedRef.current = true;
          setIsActive(true);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(container);

    return () => observer.disconnect();
  }, []);

  const pixels = Array.from({ length: gridSize * gridSize }, (_, index) => index);

  return (
    <div ref={containerRef} className={`pixelated-image-card ${className}`} style={style}>
      <div className="pixelated-image-card__default" aria-hidden={isActive}>
        {firstContent}
      </div>
      <div className={`pixelated-image-card__active ${isActive ? 'is-visible' : ''}`} aria-hidden={!isActive}>
        {secondContent}
      </div>
      <div className={`pixelated-image-card__pixels ${isActive ? 'is-hiding' : ''}`}>
        {pixels.map((pixel) => (
          <span
            key={pixel}
            className="pixelated-image-card__pixel"
            style={{
              backgroundColor: pixelColor,
              width: `${100 / gridSize}%`,
              height: `${100 / gridSize}%`,
              left: `${(pixel % gridSize) * (100 / gridSize)}%`,
              top: `${Math.floor(pixel / gridSize) * (100 / gridSize)}%`,
              transitionDelay: `${(pixel % (gridSize * 2)) * 28}ms`
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default PixelTransition;
