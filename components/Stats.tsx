
import React, { useState } from 'react';
import { STATS } from '../constants';
import { Counter } from './Counter';
import { Plus, Minus, Globe2, ChevronRight } from 'lucide-react';

export const Stats: React.FC = () => {
  const [activeIdx, setActiveIdx] = useState<number | null>(0);

  return (
    <section id="initiatives" className="py-32 relative z-10 overflow-hidden bg-white/30 dark:bg-black/20">
      {/* Unique Animated Background Layer */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-lifewood-saffron/5 rounded-full blur-[140px] animate-spin-slow"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-lifewood-green/10 rounded-full blur-[120px] animate-spin-slow" style={{ animationDirection: 'reverse' }}></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="w-20 h-20 glass-card rounded-3xl flex items-center justify-center mx-auto mb-8 animate-float shadow-xl">
            <Globe2 className="w-10 h-10 text-lifewood-green" />
          </div>
          <h2 className="text-4xl md:text-5xl font-heading font-extrabold mb-6 tracking-tight">Our Global Reach</h2>
          <p className="opacity-60 text-lg leading-relaxed">
            Connecting local expertise with our global AI data infrastructure to create inclusive opportunities worldwide.
          </p>
        </div>

        <div className="max-w-5xl mx-auto grid gap-6">
          {STATS.map((stat, idx) => (
            <div 
              key={idx}
              onMouseEnter={() => setActiveIdx(idx)}
              onMouseLeave={() => setActiveIdx(null)}
              className={`group rounded-[2.5rem] transition-all duration-700 overflow-hidden cursor-default ${
                activeIdx === idx 
                  ? 'glass-card ring-1 ring-lifewood-green/40 shadow-[0_40px_80px_-20px_rgba(4,98,65,0.15)] scale-[1.02]' 
                  : 'bg-white/40 dark:bg-white/5 hover:bg-white/70 dark:hover:bg-white/10 hover:translate-x-2'
              }`}
            >
              <div className="w-full px-10 py-8 flex items-center justify-between">
                <div className="flex items-center gap-10">
                  <div className={`text-5xl md:text-7xl font-heading font-black tracking-tighter transition-all duration-500 ${
                    activeIdx === idx ? 'text-lifewood-green' : 'opacity-20 group-hover:opacity-40'
                  }`}>
                    <Counter end={stat.value} />{stat.suffix}
                  </div>
                  <div className="text-left">
                    <h3 className="text-xl md:text-2xl font-bold tracking-tight">{stat.label}</h3>
                    {activeIdx !== idx && (
                      <div className="flex items-center gap-2 text-xs font-bold text-lifewood-green mt-2 opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-widest">
                        Hover to Expand <ChevronRight className="w-3 h-3" />
                      </div>
                    )}
                  </div>
                </div>
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 ${
                  activeIdx === idx ? 'bg-lifewood-green text-white rotate-180 shadow-lg glow-green' : 'bg-black/5 dark:bg-white/5 group-hover:scale-110'
                }`}>
                  {activeIdx === idx ? <Minus className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
                </div>
              </div>
              
              <div className={`transition-all duration-700 ease-[cubic-bezier(0.16, 1, 0.3, 1)] overflow-hidden ${
                activeIdx === idx ? 'max-h-[500px] opacity-100 mb-10' : 'max-h-0 opacity-0'
              }`}>
                <div className="px-10">
                  <div className="w-20 h-1 bg-gradient-to-r from-lifewood-green to-lifewood-saffron mb-8 rounded-full"></div>
                  <p className="text-xl opacity-70 leading-relaxed max-w-3xl">
                    {stat.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
