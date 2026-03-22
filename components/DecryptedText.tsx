import React, { useEffect, useMemo, useRef, useState } from 'react';
import './DecryptedText.css';

interface DecryptedTextProps extends React.HTMLAttributes<HTMLSpanElement> {
  text: string;
  speed?: number;
  maxIterations?: number;
  animateOn?: 'view';
  className?: string;
  parentClassName?: string;
  encryptedClassName?: string;
}

export default function DecryptedText({
  text,
  speed = 260,
  maxIterations = 40,
  animateOn = 'view',
  className = '',
  parentClassName = '',
  encryptedClassName = '',
  ...props
}: DecryptedTextProps) {
  const containerRef = useRef<HTMLSpanElement | null>(null);
  const [displayText, setDisplayText] = useState(text);
  const [isRevealed, setIsRevealed] = useState(false);

  const characters = useMemo(() => 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*()_+', []);

  useEffect(() => {
    setDisplayText(text);
    setIsRevealed(false);
  }, [text]);

  useEffect(() => {
    if (animateOn !== 'view') return;

    const container = containerRef.current;
    if (!container) return;

    let animationTimer: ReturnType<typeof setInterval> | undefined;
    let observerInstance: IntersectionObserver | undefined;

    observerInstance = new IntersectionObserver(
      entries => {
        if (!entries.some(entry => entry.isIntersecting)) return;

        observerInstance?.disconnect();

        let iteration = 0;
        animationTimer = setInterval(() => {
          iteration += 1;

          if (iteration >= maxIterations) {
            setDisplayText(text);
            setIsRevealed(true);
            if (animationTimer) clearInterval(animationTimer);
            return;
          }

          const revealedCount = Math.floor((iteration / maxIterations) * text.length);
          const nextText = text
            .split('')
            .map((char, index) => {
              if (char === ' ') return ' ';
              if (index < revealedCount) return char;
              return characters[Math.floor(Math.random() * characters.length)] ?? char;
            })
            .join('');

          setDisplayText(nextText);
        }, speed);
      },
      { threshold: 0.2 }
    );

    const attachObserver = () => observerInstance?.observe(container);

    if (document.readyState === 'complete') {
      window.requestAnimationFrame(attachObserver);
    } else {
      window.addEventListener('load', attachObserver, { once: true });
    }

    return () => {
      window.removeEventListener('load', attachObserver);
      observerInstance?.disconnect();
      if (animationTimer) clearInterval(animationTimer);
    };
  }, [animateOn, characters, maxIterations, speed, text]);

  return (
    <span ref={containerRef} className={`decrypted-text ${parentClassName}`.trim()} {...props}>
      <span className="decrypted-text__sr-only">{text}</span>
      <span aria-hidden="true" className={`decrypted-text__display ${className}`.trim()}>
        {displayText.split('').map((char, index) => (
          <span key={index} className={isRevealed ? '' : encryptedClassName}>
            {char}
          </span>
        ))}
      </span>
    </span>
  );
}
