
import React, { useState } from 'react';
import { STATS } from '../constants';
import { Counter } from './Counter';
import { Plus, Minus, Globe2, ChevronRight } from 'lucide-react';

export const Stats: React.FC = () => {
  const [activeIdx, setActiveIdx] = useState<number | null>(0);

  // Mapping STATS to Brand Palette from PDF Page 15 & 20
  // Optimized for high contrast and accessibility
  const cardStyles = [
    {
      id: 'green',
      bg: 'bg-[#046241]', // Castleton Green
      bgShade: 'bg-[#046241]/25', // Increased for visibility
      textActive: 'text-[#F9F7F7]', // Sea Salt
      textInactive: 'text-[#046241]', 
      accent: 'text-[#FFB347]', 
      glow: 'shadow-[0_40px_80px_-20px_rgba(4,98,65,0.4)]',
      border: 'border-[#046241]/40' // Pronounced border
    },
    {
      id: 'saffron',
      bg: 'bg-[#FFB347]', // Saffron
      bgShade: 'bg-[#FFB347]/30', // Increased for visibility
      textActive: 'text-[#133020]', // Dark Serpent
      textInactive: 'text-[#133020]', 
      accent: 'text-[#046241]', 
      glow: 'shadow-[0_40px_80px_-20px_rgba(255,179,71,0.4)]',
      border: 'border-[#FFB347]/50' // Pronounced border
    },
    {
      id: 'yellow',
      bg: 'bg-[#FFC370]', // Earth Yellow
      bgShade: 'bg-[#FFC370]/30', // Increased for visibility
      textActive: 'text-[#133020]', // Dark Serpent
      textInactive: 'text-[#133020]', 
      accent: 'text-[#046241]', 
      glow: 'shadow-[0_40px_80px_-20px_rgba(255,195,112,0.4)]',
      border: 'border-[#FFC370]/50' // Pronounced border
    },
    {
      id: 'serpent',
      bg: 'bg-[#133020]', // Dark Serpent
      bgShade: 'bg-[#133020]/20', // Increased for visibility
      textActive: 'text-[#f5eedb]', // Paper
      textInactive: 'text-[#133020]', 
      accent: 'text-[#FFC370]', 
      glow: 'shadow-[0_40px_80px_-20px_rgba(19,48,32,0.6)]',
      border: 'border-[#133020]/40' // Pronounced border
    }
  ];

  return (
    <section id="initiatives" className="py-32 relative z-10 overflow-hidden bg-white/30 dark:bg-black/20">
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-lifewood-saffron/5 rounded-full blur-[140px] animate-spin-slow"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-lifewood-green/10 rounded-full blur-[120px] animate-spin-slow" style={{ animationDirection: 'reverse' }}></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="w-20 h-20 glass-card rounded-3xl flex items-center justify-center mx-auto mb-8 animate-float shadow-xl border border-lifewood-green/30">
            <Globe2 className="w-10 h-10 text-lifewood-green" />
          </div>
          <h2 className="text-4xl md:text-6xl font-heading font-black mb-6 tracking-tight uppercase">Global Influence</h2>
          <p className="opacity-70 text-lg md:text-xl leading-relaxed font-bold">
            Bridging cultures and technology through our expansive physical and digital infrastructure.
          </p>
        </div>

        <div className="max-w-6xl mx-auto grid gap-8">
          {STATS.map((stat, idx) => {
            const style = cardStyles[idx % cardStyles.length];
            const isActive = activeIdx === idx;

            return (
              <div 
                key={idx}
                onMouseEnter={() => setActiveIdx(idx)}
                onMouseLeave={() => setActiveIdx(null)}
                className={`group rounded-[3.5rem] transition-all duration-700 overflow-hidden cursor-default border-2 ${
                  isActive 
                    ? `${style.bg} ${style.textActive} ${style.glow} scale-[1.03] border-transparent` 
                    : `${style.bgShade} ${style.border} hover:translate-x-2`
                }`}
              >
                <div className="w-full px-8 md:px-12 py-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 md:gap-12">
                    {/* The Number - High Visibility Brand Styling */}
                    <div className={`text-6xl md:text-8xl font-heading font-black tracking-tighter transition-all duration-500 ${
                      isActive ? 'opacity-100 scale-105' : `${style.textInactive} opacity-70`
                    }`}>
                      <Counter end={stat.value} />{stat.suffix}
                    </div>
                    
                    <div className="text-left">
                      <h3 className={`text-2xl md:text-4xl font-black uppercase tracking-tight transition-colors duration-500 leading-tight ${
                        isActive ? 'opacity-100' : `${style.textInactive} opacity-90`
                      }`}>
                        {stat.label}
                      </h3>
                      <div className={`flex items-center gap-2 text-sm font-black mt-3 transition-all duration-500 uppercase tracking-[0.3em] ${
                        isActive ? 'opacity-40' : `opacity-0 group-hover:opacity-100 ${style.textInactive}`
                      }`}>
                        {isActive ? 'Details Below' : 'Explore Reach'} <ChevronRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>

                  {/* Toggle Icon - High Contrast */}
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-500 flex-shrink-0 ${
                    isActive 
                      ? 'bg-white/20 text-current rotate-180 shadow-inner' 
                      : 'bg-black/10 dark:bg-white/10 group-hover:scale-110 shadow-sm border border-black/5'
                  }`}>
                    {isActive ? <Minus className="w-8 h-8" strokeWidth={3} /> : <Plus className="w-8 h-8" strokeWidth={3} />}
                  </div>
                </div>
                
                {/* Expanded Content Section - Improved Typography Ratios */}
                <div className={`transition-all duration-700 ease-[cubic-bezier(0.16, 1, 0.3, 1)] overflow-hidden ${
                  isActive ? 'max-h-[800px] opacity-100 pb-16' : 'max-h-0 opacity-0'
                }`}>
                  <div className="px-8 md:px-12 md:pl-[12.5rem]">
                    <div className={`w-24 h-2 mb-10 rounded-full ${isActive ? 'bg-current opacity-40' : 'bg-lifewood-green'}`}></div>
                    <p className="text-xl md:text-2xl font-bold leading-relaxed max-w-4xl opacity-100">
                      {stat.description}
                    </p>
                    
                    {/* Visual Graphic Representation Hint (PDF Page 22) */}
                    <div className="mt-12 flex gap-4 opacity-40">
                       <div className="h-2 w-32 bg-current rounded-full"></div>
                       <div className="h-2 w-16 bg-current rounded-full"></div>
                       <div className="h-2 w-24 bg-current rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
