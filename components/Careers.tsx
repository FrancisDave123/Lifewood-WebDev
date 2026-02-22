import React, { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { ArrowRight } from 'lucide-react';

interface CareersProps {
  navigateTo?: (page: 'home' | 'services' | 'projects' | 'contact' | 'about' | 'offices' | 'impact' | 'careers' | 'type-a' | 'type-b' | 'type-c' | 'type-d') => void;
}

export const Careers: React.FC<CareersProps> = ({ navigateTo }) => {
  const row1 = useMemo(() => ['Innovative', 'Flexible', 'Supportive', 'Collaborative'], []);
  const row2 = useMemo(() => ['Transparent', 'Engaging', 'Diverse', 'Purpose-driven'], []);
  const row3 = useMemo(() => ['Balanced (work-life balance)', 'Trustworthy', 'Professional', 'Reliable'], []);

  const PianoLine: React.FC<{ text: string }> = ({ text }) => (
    <span className="inline-block">
      {text.split('').map((char, idx) => (
        <span
          key={`${char}-${idx}`}
          className={char === ' ' ? '' : 'piano-char'}
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </span>
  );

  const MarqueeRow: React.FC<{ items: string[]; reverse?: boolean; duration?: number }> = ({
    items,
    reverse = false,
    duration = 20
  }) => {
    const setRef = useRef<HTMLDivElement | null>(null);
    const [setWidth, setSetWidth] = useState(0);

    useLayoutEffect(() => {
      const update = () => {
        if (setRef.current) {
          setSetWidth(setRef.current.getBoundingClientRect().width);
        }
      };

      update();
      // Small delay to ensure layout is settled
      const timer = setTimeout(update, 100);
      window.addEventListener('resize', update);
      return () => {
        window.removeEventListener('resize', update);
        clearTimeout(timer);
      };
    }, [items]);

    // For a seamless loop, we move by exactly one set width.
    const fromX = reverse ? -setWidth : 0;
    const toX = reverse ? 0 : -setWidth;

    const content = (
      <div className="flex items-center gap-8 pr-8">
        {items.map((tag, idx) => (
          <span
            key={`${tag}-${idx}`}
            className="shrink-0 px-5 py-2.5 rounded-full bg-lifewood-yellow/35 dark:bg-lifewood-yellow/20 text-lifewood-serpent dark:text-white text-sm md:text-base font-semibold border border-white/40 dark:border-white/10 backdrop-blur-sm whitespace-nowrap"
          >
            {tag}
          </span>
        ))}
      </div>
    );

    return (
      <section
        className="flex w-full items-center overflow-hidden py-1.5"
        style={{
          maskImage:
            'linear-gradient(to right, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 12.5%, rgba(0,0,0,1) 87.5%, rgba(0,0,0,0) 100%)'
        }}
      >
        <div
          className="flex w-max items-center will-change-transform"
          style={
            {
              '--from-x': `${fromX}px`,
              '--to-x': `${toX}px`,
              animation: `marquee-track-px ${duration}s linear infinite`
            } as React.CSSProperties
          }
        >
          <div ref={setRef} className="flex items-center">
            {content}
          </div>
          <div aria-hidden="true" className="flex items-center">
            {content}
          </div>
          <div aria-hidden="true" className="flex items-center">
            {content}
          </div>
          <div aria-hidden="true" className="flex items-center">
            {content}
          </div>
        </div>
      </section>
    );
  };

  const marqueeRows = useMemo(
    () => [
      { items: row1, reverse: false, duration: 20 },
      { items: row2, reverse: true, duration: 18 },
      { items: row3, reverse: false, duration: 22 }
    ],
    [row1, row2, row3]
  );

  return (
    <section id="careers" className="pt-32 pb-20 relative overflow-x-hidden bg-lifewood-seaSalt dark:bg-[#020804] animate-pop-out opacity-0">
      <style>{`
        .piano-char {
          display: inline-block;
          transition: transform 220ms ease, text-shadow 220ms ease, font-weight 220ms ease, color 220ms ease;
        }
        .piano-char:hover {
          transform: translateY(-6px) scale(1.16);
          font-weight: 900;
          color: #0e4b34;
          text-shadow:
            0 0 6px rgba(4, 98, 65, 0.38),
            0 0 14px rgba(4, 98, 65, 0.25),
            0 0 26px rgba(255, 179, 71, 0.22);
        }
        .dark .piano-char:hover {
          color: #fff;
          text-shadow:
            0 0 8px rgba(255, 255, 255, 0.45),
            0 0 18px rgba(4, 98, 65, 0.35),
            0 0 30px rgba(255, 179, 71, 0.28);
        }
        @keyframes marquee-track-px {
          0% { transform: translateX(var(--from-x)); }
          100% { transform: translateX(var(--to-x)); }
        }
      `}</style>
      <div className="container mx-auto px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-end mb-16 md:mb-20 animate-pop-out opacity-0" style={{ animationDelay: '100ms' }}>
            <div>
              <h1 className="text-5xl md:text-7xl font-heading font-black tracking-tight leading-[0.95] text-lifewood-serpent dark:text-white mb-8">
                Careers in
                <br />
                Lifewood
              </h1>
              <button
                onClick={() => navigateTo?.('contact')}
                className="group px-8 py-3 bg-lifewood-saffron text-lifewood-serpent rounded-full text-lg font-bold inline-flex items-center gap-3 hover:scale-105 transition-transform"
              >
                Join Us
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            <p className="text-lg md:text-3xl text-lifewood-serpent/80 dark:text-white/80 leading-relaxed max-w-xl">
              Innovation, adaptability and the rapid development of new services separates companies that constantly deliver at the highest level from their competitors.
            </p>
          </div>

          <div className="mb-16 md:mb-20 animate-pop-out opacity-0" style={{ animationDelay: '220ms' }}>
            <div className="rounded-[2.5rem] overflow-hidden shadow-2xl">
              <img
                src="https://framerusercontent.com/images/DF2gzPqqVW8QGp7Jxwp1y5257xk.jpg?scale-down-to=2048&width=6000&height=4000"
                alt="Careers at Lifewood"
                className="w-full h-[320px] md:h-[520px] object-cover"
              />
            </div>
          </div>

          <div className="text-center mb-16 animate-pop-out opacity-0" style={{ animationDelay: '320ms' }}>
            <h2 className="text-5xl md:text-7xl font-heading font-bold leading-[0.95] text-lifewood-serpent dark:text-white mb-6">
              <PianoLine text="It means motivating" />
              <br />
              <PianoLine text="and growing teams" />
            </h2>
            <p className="text-lg md:text-2xl text-lifewood-serpent/70 dark:text-white/70 max-w-4xl mx-auto leading-relaxed">
              Teams that can initiate and learn on the run in order to deliver evolving technologies and targets. It&apos;s a big challenge, but innovation, especially across borders, has never been the easy path.
            </p>
          </div>

          <div className="max-w-5xl mx-auto mb-16 space-y-6 animate-pop-out opacity-0" style={{ animationDelay: '420ms' }}>
            {marqueeRows.map((row, rowIdx) => (
              <MarqueeRow key={`row-${rowIdx}`} items={row.items} reverse={row.reverse} duration={row.duration} />
            ))}
          </div>

          <div className="text-center max-w-6xl mx-auto animate-pop-out opacity-0" style={{ animationDelay: '520ms' }}>
            <p className="text-3xl md:text-5xl font-heading text-lifewood-serpent dark:text-white leading-tight">
              If you&apos;re looking to turn the page on a new chapter in your career, make contact with us today.
              At Lifewood, the adventure is always before you, it&apos;s why we&apos;ve been described as <span className="text-lifewood-green">&quot;always on, never off.&quot;</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
