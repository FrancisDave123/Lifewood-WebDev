
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
  // Triple items for seamless loop
  const marqueeItems = [...PARTNERS, ...PARTNERS, ...PARTNERS];

  return (
    <section className="py-32 relative overflow-hidden bg-white/40 dark:bg-black/40">
      <div className="container mx-auto px-6 text-center mb-12">
        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full glass border border-lifewood-green/20 mb-8">
          <span className="text-xs font-black uppercase tracking-[0.4em] text-lifewood-green dark:text-lifewood-saffron">Trusted By Industry Giants</span>
        </div>
        <h2 className="text-4xl md:text-5xl font-heading font-black mb-6 tracking-tight">Our Global Partnerships</h2>
        <p className="max-w-3xl mx-auto opacity-70 text-lg font-medium leading-relaxed">
          Collaborating with the world's most influential technology leaders to build the future of AI infrastructure.
        </p>
      </div>

      <div className="relative w-full overflow-hidden py-10">
        {/* Soft side vignettes for focus */}
        <div className="absolute inset-y-0 left-0 w-64 bg-gradient-to-r from-lifewood-seaSalt dark:from-[#020804] to-transparent z-10 pointer-events-none"></div>
        <div className="absolute inset-y-0 right-0 w-64 bg-gradient-to-l from-lifewood-seaSalt dark:from-[#020804] to-transparent z-10 pointer-events-none"></div>

        <div className="flex animate-marquee whitespace-nowrap items-center">
          {marqueeItems.map((partner, idx) => (
            <div 
              key={`${partner.name}-${idx}`} 
              className="group relative flex flex-col items-center justify-center mx-12 md:mx-20"
            >
              {/* Distinctive Logo Plate for visibility */}
              <div className="relative w-[140px] h-[140px] rounded-full bg-white dark:bg-white/5 shadow-[0_10px_40px_rgba(0,0,0,0.05)] dark:shadow-none border border-black/[0.03] dark:border-white/[0.05] flex items-center justify-center transition-all duration-500 group-hover:shadow-2xl group-hover:border-lifewood-green/30">
                
                {/* 100x100 Image sizing with full opacity */}
                <img 
                  src={partner.logo} 
                  alt={partner.name} 
                  width="100"
                  height="100"
                  className="w-[100px] h-[100px] object-contain transition-all duration-700 opacity-90 group-hover:opacity-100 group-hover:scale-110"
                />
                
                {/* Ambient glow on hover */}
                <div className="absolute inset-0 rounded-full bg-lifewood-green/5 scale-0 group-hover:scale-110 transition-transform duration-500 -z-10"></div>
              </div>
              
              {/* Label that fades in */}
              <div className="mt-6 text-[12px] font-extrabold uppercase tracking-[0.2em] text-lifewood-serpent/60 dark:text-white/60 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                {partner.name}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Background Decorative Gradient Strip */}
      <div className="absolute top-1/2 left-0 w-full h-[140px] -translate-y-1/2 bg-lifewood-green/[0.03] -z-10 pointer-events-none"></div>
    </section>
  );
};
