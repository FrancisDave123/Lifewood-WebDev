
import React from 'react';

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
    logo: 'https://framerusercontent.com/images/RyIkooWlUn6nQYbljETePWzd2Ac.png?scale-down-to=1024&width=1243&height=713' 
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
  // Use exactly two sets for a perfect 50% translation loop
  const marqueeItems = [...PARTNERS, ...PARTNERS];

  return (
    <section className="py-32 relative overflow-hidden bg-white/60 dark:bg-black/40 border-y border-lifewood-green/5">
      <div className="container mx-auto px-6 text-center mb-16">
        <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full glass border border-lifewood-green/30 mb-8 bg-lifewood-green/5">
          <span className="text-sm font-black uppercase tracking-[0.4em] text-lifewood-green dark:text-lifewood-saffron">Trusted By Global Leaders</span>
        </div>
        <h2 className="text-4xl md:text-6xl font-heading font-black mb-6 tracking-tight">World-Class Partnerships</h2>
        <p className="max-w-3xl mx-auto opacity-80 text-xl font-medium leading-relaxed">
          The engine behind precision data processing for the world's most innovative tech giants.
        </p>
      </div>

      <div className="relative w-full overflow-hidden py-16">
        {/* Stronger focus vignettes */}
        <div className="absolute inset-y-0 left-0 w-64 md:w-96 bg-gradient-to-r from-lifewood-seaSalt dark:from-[#020804] to-transparent z-10 pointer-events-none"></div>
        <div className="absolute inset-y-0 right-0 w-64 md:w-96 bg-gradient-to-l from-lifewood-seaSalt dark:from-[#020804] to-transparent z-10 pointer-events-none"></div>

        {/* Marquee Container */}
        <div className="flex animate-marquee whitespace-nowrap items-center w-max">
          {marqueeItems.map((partner, idx) => (
            <div 
              key={`${partner.name}-${idx}`} 
              className="group relative flex flex-col items-center justify-center mx-16 md:mx-28"
            >
              {/* Ultra-Visible Logo Plate - Pure white ensures visibility in any theme */}
              <div className="relative w-[220px] h-[220px] md:w-[260px] md:h-[260px] rounded-full bg-white shadow-[0_20px_60px_rgba(0,0,0,0.15)] dark:shadow-[0_20px_80px_rgba(0,0,0,0.4)] border border-black/5 flex items-center justify-center transition-all duration-700 group-hover:scale-110 group-hover:shadow-[0_25px_100px_rgba(4,98,65,0.2)]">
                
                {/* Logo Image - Forced High Visibility */}
                <img 
                  src={partner.logo} 
                  alt={partner.name} 
                  className="w-[150px] h-[150px] md:w-[180px] md:h-[180px] object-contain transition-all duration-700 opacity-100"
                />
                
                {/* Decorative Elements */}
                <div className="absolute inset-6 rounded-full border-2 border-dashed border-lifewood-green/10 opacity-40 pointer-events-none group-hover:rotate-45 transition-transform duration-1000"></div>
                
                {/* Hover Glow */}
                <div className="absolute -inset-4 rounded-full bg-lifewood-green/5 opacity-0 group-hover:opacity-100 blur-2xl transition-opacity duration-500 -z-10"></div>
              </div>
              
              {/* Partner Name Label */}
              <div className="mt-10 text-base md:text-lg font-black uppercase tracking-[0.4em] text-lifewood-serpent dark:text-white transition-all duration-300 group-hover:text-lifewood-green dark:group-hover:text-lifewood-saffron group-hover:scale-110">
                {partner.name}
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
