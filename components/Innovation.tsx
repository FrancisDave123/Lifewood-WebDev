
import React from 'react';
import { ExternalLink, Layers, Zap, Shield } from 'lucide-react';

export const Innovation: React.FC = () => {
  return (
    <section id="impact" className="py-32 relative overflow-hidden bg-lifewood-serpent/[0.02] dark:bg-white/[0.02]">
      {/* Decorative Rotating Rings */}
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[40rem] h-[40rem] pointer-events-none opacity-10">
        <div className="absolute inset-0 border-[40px] border-lifewood-green/20 rounded-full animate-spin-slow"></div>
        <div className="absolute inset-20 border-[20px] border-lifewood-saffron/20 rounded-full animate-spin-slow" style={{ animationDirection: 'reverse' }}></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row items-end justify-between mb-20 gap-8">
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
          <button className="group flex items-center gap-3 px-10 py-5 rounded-full glass border-white/20 hover:bg-lifewood-green hover:text-white transition-all duration-500 hover:glow-green hover:-translate-y-1 shadow-xl">
            View Case Studies <ExternalLink className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </button>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 min-h-[700px]">
          <div className="lg:col-span-5 relative group rounded-[3rem] overflow-hidden shadow-2xl animate-float">
            <img src="https://picsum.photos/seed/innovation1/900/1200" alt="Global scale" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2s]" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
            <div className="absolute bottom-12 left-12 text-white">
              <div className="text-7xl font-heading font-black mb-4">Global <span className="text-lifewood-yellow tracking-tighter">+</span></div>
              <p className="text-2xl font-medium opacity-80 max-w-xs leading-snug">AI Data Projects Engineered for Infinite Scale</p>
            </div>
            <div className="absolute top-10 right-10 w-20 h-20 rounded-3xl glass border-white/20 flex items-center justify-center backdrop-blur-3xl shadow-2xl group-hover:rotate-12 transition-transform">
              <Layers className="w-8 h-8 text-white" />
            </div>
          </div>

          <div className="lg:col-span-7 flex flex-col gap-8">
             <div className="relative flex-1 group rounded-[3rem] overflow-hidden shadow-2xl glass-card border-none hover:ring-1 ring-lifewood-green/30 transition-all duration-500 animate-float" style={{ animationDelay: '1s' }}>
                <img src="https://picsum.photos/seed/innovation2/1200/600" alt="Innovation" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2s] opacity-40 dark:opacity-30" />
                <div className="relative h-full flex flex-col justify-end p-12">
                  <div className="max-w-xl">
                    <div className="w-16 h-16 rounded-2xl bg-lifewood-green/10 flex items-center justify-center mb-8">
                      <Shield className="w-8 h-8 text-lifewood-green" />
                    </div>
                    <h3 className="text-4xl font-heading font-bold mb-6 tracking-tight">Precision-Driven <br />Infrastructure</h3>
                    <p className="text-xl opacity-70 leading-relaxed">
                      Leveraging cutting-edge models including Gemini 3 Pro and Veo, we act as a conduit bringing diverse interests together to foster breakthrough ventures.
                    </p>
                  </div>
                </div>
             </div>
             
             <div className="h-48 glass-card rounded-[2.5rem] p-10 flex items-center justify-between group hover:glow-green transition-all animate-float" style={{ animationDelay: '2s' }}>
                <div>
                  <div className="text-sm font-bold uppercase tracking-[0.2em] opacity-40 mb-2">Our Philosophy</div>
                  <div className="text-2xl font-bold italic">"Turning complexity into clarity."</div>
                </div>
                <div className="w-20 h-20 rounded-full border border-lifewood-green/20 flex items-center justify-center relative">
                  <div className="absolute inset-0 bg-lifewood-green/5 rounded-full animate-ping"></div>
                  <Zap className="w-8 h-8 text-lifewood-green" />
                </div>
             </div>
          </div>
        </div>
      </div>
    </section>
  );
};
