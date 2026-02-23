
import React, { useState, useEffect, useRef } from 'react';

const PARTNERS = [
  { 
    name: 'Ancestry', 
    logo: 'https://framerusercontent.com/images/Yq2A1QFJLXgGQ3b7NZPthsD9RBk.png?scale-down-to=1024&width=1920&height=1080',
    displayWidth: 613.3333,
    aspectRatio: '1920 / 1080',
    fit: 'cover' as const,
  },
  { 
    name: 'Family Search', 
    logo: 'https://framerusercontent.com/images/2rRd2Mk1HzeDgPbL0e8wwkUPo.png?scale-down-to=1024&width=1920&height=1080',
    displayWidth: 577.7778,
    aspectRatio: '1920 / 1080',
    fit: 'cover' as const,
  },
  { 
    name: 'Microsoft', 
    logo: 'https://framerusercontent.com/images/5mxPuoDvu4IebUtQtNowrZOfWSg.png?scale-down-to=1024&width=1920&height=1080',
    displayWidth: 744.8889,
    aspectRatio: '1920 / 1080',
    fit: 'cover' as const,
  },
  { 
    name: 'Apple', 
    logo: 'https://framerusercontent.com/images/RyIkooWlUn6nQYbljETePWzd2Ac.png?scale-down-to=1024&width=1243&height=713',
    displayWidth: 592,
    aspectRatio: '1243 / 713',
    fit: 'cover' as const,
  },
  { 
    name: 'Google', 
    logo: 'https://framerusercontent.com/images/cjJDncfOy71yWizT3ZRdsZB4W0.png?scale-down-to=1024&width=1920&height=1080',
    displayWidth: 596,
    aspectRatio: '1920 / 1080',
    fit: 'cover' as const,
  },
  { 
    name: 'Moore Foundation', 
    logo: 'https://framerusercontent.com/images/HWbvpkExIBUbdXEGILLSX4PTcEE.png?scale-down-to=512&width=1920&height=551',
    displayWidth: 502,
    aspectRatio: '1920 / 551',
    fit: 'contain' as const,
  },
  { 
    name: 'BYU Pathway Worldwide', 
    logo: 'https://framerusercontent.com/images/m37jhLfPRl449iXOe8op7cY68c.png?scale-down-to=1024&width=1920&height=1080',
    displayWidth: 606.2222,
    aspectRatio: '1920 / 1080',
    fit: 'cover' as const,
  },
];

export const Clients: React.FC = () => {
  const [isInView, setIsInView] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  
  // Use exactly two sets for a perfect 50% translation loop
  const marqueeItems = [...PARTNERS, ...PARTNERS];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { 
        threshold: 0.2, // Trigger when 20% of the section is visible
        rootMargin: "0px 0px -100px 0px" // Trigger slightly before it leaves/enters
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section 
      ref={sectionRef}
      className="py-0 relative overflow-hidden bg-transparent"
    >
      <div className="container mx-auto px-6 text-center mb-8">
        <div className={`inline-flex items-center gap-2 px-6 py-2 rounded-full glass border border-lifewood-green/30 mb-8 bg-lifewood-green/5 transition-all duration-1000 transform ${isInView ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <span className="text-sm font-black uppercase tracking-[0.4em] text-lifewood-green dark:text-lifewood-saffron">Trusted By Global Leaders</span>
        </div>
        <h2 className={`text-4xl md:text-6xl font-heading font-black mb-6 tracking-tight transition-all duration-1000 delay-100 transform ${isInView ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          World-Class Partnerships
        </h2>
        <p className={`max-w-3xl mx-auto opacity-80 text-xl font-medium leading-relaxed transition-all duration-1000 delay-200 transform ${isInView ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          The engine behind precision data processing for the world's most innovative tech giants.
        </p>
      </div>

      <div className="relative w-full overflow-hidden py-0">
        {/* Marquee Container */}
        <div className="flex animate-marquee whitespace-nowrap items-center w-max" style={{ animationDuration: '28s' }}>
          {marqueeItems.map((partner, idx) => (
            <div 
              key={`${partner.name}-${idx}`} 
              className={`group relative flex flex-col items-center justify-center mx-6 md:mx-8 transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] transform ${
                isInView 
                  ? 'scale-100 opacity-100 rotate-0' 
                  : 'scale-0 opacity-0 rotate-12'
              }`}
              style={{ 
                transitionDelay: `${(idx % PARTNERS.length) * 100}ms`
              }}
            >
              {/* Logo Container */}
              <div
                className="relative flex items-center justify-center transition-all duration-700 group-hover:scale-105"
                style={{
                  width: `clamp(260px, 68vw, ${partner.displayWidth}px)`,
                  aspectRatio: partner.aspectRatio,
                }}
              >
                
                {/* Logo Image - Forced High Visibility */}
                <img 
                  src={partner.logo} 
                  alt={partner.name} 
                  className="w-full h-full transition-all duration-700 opacity-100"
                  style={{ objectFit: partner.fit }}
                />
                
                {/* Hover Glow */}
                <div className="absolute -inset-4 rounded-full bg-lifewood-green/5 opacity-0 group-hover:opacity-100 blur-2xl transition-opacity duration-500 -z-10"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
