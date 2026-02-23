import React from 'react';
import { Layers, Zap, Shield } from 'lucide-react';

export const Innovation: React.FC = () => {
  return (
    <section id="impact" className="py-32 relative overflow-hidden bg-lifewood-serpent/[0.02] dark:bg-white/[0.02]">
      {/* Decorative Rotating Rings */}
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[40rem] h-[40rem] pointer-events-none opacity-10">
        <div className="absolute inset-0 border-[40px] border-lifewood-green/20 rounded-full animate-spin-slow"></div>
        <div className="absolute inset-20 border-[20px] border-lifewood-saffron/20 rounded-full animate-spin-slow" style={{ animationDirection: 'reverse' }}></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row items-start justify-between mb-20 gap-8">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-lifewood-green/20 mb-6">
              <Zap className="w-4 h-4 text-lifewood-saffron" />
              <span className="text-xs font-bold uppercase tracking-[0.3em]">Next-Gen Solutions</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-heading font-extrabold mb-6 leading-[1.1]">
              Constant Innovation: <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-lifewood-green to-lifewood-saffron">Unlimited Possibilities</span>
            </h2>
            <p className="text-xl opacity-60 leading-relaxed">
              No matter the industry, size or the type of data involved, our solutions satisfy any AI-data requirement with surgical precision.
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* Global Scale Card */}
          <div className="lg:col-span-5 relative group rounded-[3rem] overflow-hidden [clip-path:inset(0_round_3rem)] shadow-2xl aspect-[1280/853] transform-gpu [transform:translateZ(0)] [backface-visibility:hidden]">
            <img 
              src="https://framerusercontent.com/images/EfuuWuqk2ibqcvZK8Q4ZM59MgsQ.jpeg?scale-down-to=512&width=1280&height=853" 
              alt="Global scale" 
              className="absolute inset-0 w-full h-full object-cover rounded-[3rem] transform-gpu [transform:translateZ(0)] [backface-visibility:hidden] group-hover:scale-105 transition-transform duration-[2s]" 
            />
            <div className="absolute inset-0 rounded-[3rem] bg-gradient-to-t from-black/80 via-black/10 to-transparent"></div>
            <div className="absolute bottom-10 left-10 text-white z-10">
              <div className="text-5xl md:text-6xl font-heading font-black mb-3">Global <span className="text-lifewood-yellow tracking-tighter">+</span></div>
              <p className="text-lg md:text-xl font-medium opacity-80 max-w-xs leading-snug">AI Data Projects Engineered for Infinite Scale</p>
            </div>
            <div className="absolute top-8 right-8 w-16 h-16 rounded-2xl glass border-white/20 flex items-center justify-center backdrop-blur-3xl shadow-2xl group-hover:rotate-12 transition-transform z-10">
              <Layers className="w-6 h-6 text-white" />
            </div>
          </div>

          <div className="lg:col-span-7 flex flex-col gap-8 h-full">
             {/* Precision-Driven Infrastructure Card - Updated with user image */}
             <div className="relative flex-1 min-h-[400px] group rounded-[3rem] overflow-hidden [clip-path:inset(0_round_3rem)] shadow-2xl glass-card border-none hover:ring-1 ring-lifewood-green/30 transition-all duration-500 transform-gpu [transform:translateZ(0)] [backface-visibility:hidden]" style={{ animationDelay: '1s' }}>
                <img 
                  src="https://framerusercontent.com/images/sNxmbNlbSdjE4PpCqPIEhhq1z8w.png?scale-down-to=1024&width=3362&height=1892" 
                  alt="Precision-Driven Infrastructure" 
                  className="absolute inset-0 w-full h-full object-cover rounded-[3rem] transform-gpu [transform:translateZ(0)] [backface-visibility:hidden] group-hover:scale-105 transition-transform duration-[2s] opacity-60 dark:opacity-40" 
                />
                <div className="absolute inset-0 rounded-[3rem] bg-gradient-to-t from-lifewood-serpent/90 via-transparent to-transparent md:bg-gradient-to-r md:from-lifewood-serpent/80 md:via-lifewood-serpent/20 md:to-transparent"></div>
                <div className="relative h-full flex flex-col justify-end p-10 md:p-12 z-10">
                  <div className="max-w-xl">
                    <div className="w-14 h-14 rounded-2xl bg-lifewood-green/20 backdrop-blur-md flex items-center justify-center mb-6 border border-white/10">
                      <Shield className="w-7 h-7 text-lifewood-green" />
                    </div>
                    <h3 className="text-3xl md:text-4xl font-heading font-bold mb-4 tracking-tight text-white">Precision-Driven <br />Infrastructure</h3>
                    <p className="text-lg md:text-xl text-white/80 leading-relaxed">
                      Leveraging cutting-edge models including Gemini 3 Pro and Veo, we act as a conduit bringing diverse interests together to foster breakthrough ventures.
                    </p>
                  </div>
                </div>
             </div>
             
             <div className="h-40 glass-card rounded-[2.5rem] p-8 md:p-10 flex items-center justify-between group hover:glow-green transition-all">
                <div>
                  <div className="text-xs font-bold uppercase tracking-[0.2em] opacity-40 mb-1">Our Philosophy</div>
                  <div className="text-xl md:text-2xl font-bold italic">"Turning complexity into clarity."</div>
                </div>
                <div className="w-16 h-16 rounded-full border border-lifewood-green/20 flex items-center justify-center relative">
                  <div className="absolute inset-0 bg-lifewood-green/5 rounded-full animate-ping"></div>
                  <Zap className="w-6 h-6 text-lifewood-green" />
                </div>
             </div>
          </div>
        </div>
      </div>
    </section>
  );
};
