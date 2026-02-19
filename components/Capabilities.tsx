
import React from 'react';
import { CAPABILITIES } from '../constants';
import { Mic, FileText, Image, Video, ChevronRight } from 'lucide-react';

const icons = {
  'Audio': Mic,
  'Text': FileText,
  'Image': Image,
  'Video': Video,
};

export const Capabilities: React.FC = () => {
  return (
    <section id="offer" className="py-32 relative scroll-mt-20 bg-gradient-to-b from-transparent to-lifewood-green/[0.03]">
      {/* Background Particles Decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        {[...Array(6)].map((_, i) => (
          <div 
            key={i} 
            className="absolute rounded-full glass border border-white/20 animate-float"
            style={{
              width: `${Math.random() * 100 + 50}px`,
              height: `${Math.random() * 100 + 50}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${i * 1.5}s`,
              animationDuration: `${Math.random() * 5 + 10}s`
            }}
          />
        ))}
      </div>

      <div id="careers" className="container mx-auto px-6 scroll-mt-20 relative z-10">
        <div className="mb-20 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-lifewood-green/20 mb-6">
            <span className="text-xs font-bold uppercase tracking-[0.4em]">Core Capabilities</span>
          </div>
          <h3 className="text-4xl md:text-6xl font-heading font-black tracking-tight mb-6">Diverse Data Modalities</h3>
          <p className="max-w-2xl mx-auto text-lg opacity-60">High-fidelity datasets engineered specifically for large language models and frontier AI research.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {CAPABILITIES.map((cap, idx) => {
            const Icon = icons[cap.title as keyof typeof icons];
            return (
              <div 
                key={cap.title}
                className="group relative h-[550px] rounded-[3.5rem] overflow-hidden shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] hover:shadow-[0_50px_100px_-20px_rgba(4,98,65,0.2)] transition-all duration-700 hover:-translate-y-4 animate-float"
                style={{ animationDelay: `${idx * 0.4}s` }}
              >
                {/* Background Image */}
                <img 
                  src={cap.imageUrl} 
                  alt={cap.title} 
                  className="absolute inset-0 w-full h-full object-cover grayscale brightness-75 transition-all duration-1000 group-hover:grayscale-0 group-hover:scale-125 group-hover:brightness-100" 
                />
                
                {/* Dynamic Gradient Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${cap.gradient} opacity-40 group-hover:opacity-60 transition-opacity duration-700`}></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80"></div>
                
                {/* Content - Elevated Floating Look */}
                <div className="absolute inset-x-6 bottom-6 glass p-8 rounded-[2.5rem] border-white/20 backdrop-blur-2xl translate-y-4 group-hover:translate-y-0 transition-all duration-700 shadow-2xl ring-1 ring-white/10">
                  <div className="flex items-center gap-5 mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-lifewood-green text-white flex items-center justify-center shadow-lg group-hover:rotate-[360deg] transition-transform duration-1000">
                      <Icon className="w-7 h-7" />
                    </div>
                    <h4 className="text-3xl font-heading font-black tracking-tighter text-white">{cap.title}</h4>
                  </div>
                  <p className="text-base text-white/70 leading-relaxed mb-6 opacity-0 group-hover:opacity-100 max-h-0 group-hover:max-h-32 transition-all duration-700 overflow-hidden">
                    {cap.description}
                  </p>
                  <div className="flex items-center justify-between text-white/50 group-hover:text-lifewood-yellow transition-colors font-bold text-sm tracking-widest uppercase">
                    <span>Explore Data</span>
                    <ChevronRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
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
