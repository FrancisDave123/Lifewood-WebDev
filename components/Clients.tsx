
import React, { useState, useEffect, useRef } from 'react';

const PARTNERS = [
  { 
    name: 'Ancestry', 
    logo: 'https://framerusercontent.com/images/Yq2A1QFJLXgGQ3b7NZPthsD9RBk.png?scale-down-to=1024&width=1920&height=1080' 
  },
  { 
    name: 'Family Search', 
    logo: 'https://framerusercontent.com/images/2rRd2Mk1HzeDgPbL0e8wwkUPo.png?scale-down-to=1024&width=1920&height=1080' 
  },
  { 
    name: 'Microsoft', 
    logo: 'https://framerusercontent.com/images/5mxPuoDvu4IebUtQtNowrZOfWSg.png?scale-down-to=1024&width=1920&height=1080' 
  },
  { 
    name: 'Apple', 
    logo: 'https://framerusercontent.com/images/RyIkooWlUn6nQYbljETePWzd2Ac.png?scale-down-to=1024&width=1243&height=713',
  },
  { 
    name: 'Google', 
    logo: 'https://framerusercontent.com/images/cjJDncfOy71yWizT3ZRdsZB4W0.png?scale-down-to=1024&width=1920&height=1080' 
  },
  { 
    name: 'Moore Foundation', 
    logo: 'https://framerusercontent.com/images/HWbvpkExIBUbdXEGILLSX4PTcEE.png?scale-down-to=512&width=1920&height=551' 
  },
  { 
    name: 'BYU Pathway Worldwide', 
    logo: 'https://framerusercontent.com/images/m37jhLfPRl449iXOe8op7cY68c.png?scale-down-to=1024&width=1920&height=1080' 
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
      className="py-12 relative overflow-hidden bg-white/60 dark:bg-black/40 border-y border-lifewood-green/5"
    >
      <div className="container mx-auto px-6 text-center mb-16">
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

      <div className="relative w-full overflow-hidden py-8">
        {/* Stronger focus vignettes */}
        <div className="absolute inset-y-0 left-0 w-64 md:w-96 bg-gradient-to-r from-lifewood-seaSalt dark:from-[#020804] to-transparent z-10 pointer-events-none"></div>
        <div className="absolute inset-y-0 right-0 w-64 md:w-96 bg-gradient-to-l from-lifewood-seaSalt dark:from-[#020804] to-transparent z-10 pointer-events-none"></div>

        {/* Marquee Container */}
        <div className="flex animate-marquee whitespace-nowrap items-center w-max">
          {marqueeItems.map((partner, idx) => (
            <div 
              key={`${partner.name}-${idx}`} 
              className={`group relative flex flex-col items-center justify-center mx-16 md:mx-28 transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] transform ${
                isInView 
                  ? 'scale-100 opacity-100 rotate-0' 
                  : 'scale-0 opacity-0 rotate-12'
              }`}
              style={{ 
                transitionDelay: `${(idx % PARTNERS.length) * 100}ms`
              }}
            >
              {/* Logo Container */}
              <div className="relative w-[200px] h-[200px] md:w-[240px] md:h-[240px] flex items-center justify-center transition-all duration-700 group-hover:scale-110">
                
                {/* Logo Image - Forced High Visibility */}
                <img 
                  src={partner.logo} 
                  alt={partner.name} 
                  className="w-[140px] h-[140px] md:w-[170px] md:h-[170px] object-contain transition-all duration-700 opacity-100"
                />
                
                {/* Hover Glow */}
                <div className="absolute -inset-4 rounded-full bg-lifewood-green/5 opacity-0 group-hover:opacity-100 blur-2xl transition-opacity duration-500 -z-10"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Dynamic background accent lines */}
      <div className="absolute top-1/2 left-0 w-full h-[2px] -translate-y-1/2 bg-gradient-to-r from-transparent via-lifewood-green/20 to-transparent -z-10 pointer-events-none"></div>
      <div className="absolute top-[15%] left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-lifewood-green/5 to-transparent pointer-events-none"></div>
      <div className="absolute bottom-[15%] left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-lifewood-green/5 to-transparent pointer-events-none"></div>
    </section>
  );
};
