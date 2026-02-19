
import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';

export const About: React.FC = () => {
  return (
    <section id="company" className="py-32 relative z-10 bg-lifewood-seaSalt dark:bg-[#020804] overflow-hidden shadow-[0_-50px_100px_rgba(0,0,0,0.1)]">
      {/* Section Background Decoration */}
      <div className="absolute top-1/2 left-0 w-1/3 h-1/2 bg-lifewood-green/5 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="container mx-auto px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-lifewood-green/20 mb-8">
                <Sparkles className="w-4 h-4 text-lifewood-green" />
                <span className="text-xs font-bold uppercase tracking-[0.3em]">About Us</span>
              </div>
              <h3 className="text-4xl md:text-6xl font-heading font-extrabold mb-8 leading-[1.15]">
                Empowering the future <br /> through <span className="text-lifewood-green relative">
                  data-driven
                  <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 8" fill="none"><path d="M1 5.5C40 2.5 120 2.5 199 5.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                </span> harmony.
              </h3>
              <p className="text-xl opacity-70 leading-relaxed mb-10 max-w-xl">
                At <span className="font-bold text-lifewood-green">Lifewood</span>, we empower our company and our clients to realize the transformative power of AI: bringing big data to life: launching new ways of thinking, learning and doing; for the good of humankind.
              </p>
              <button className="group px-10 py-4 glass border-lifewood-green/20 rounded-full font-bold hover:bg-lifewood-green hover:text-white transition-all duration-500 flex items-center gap-2 hover:glow-green">
                Know Us Better <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-6 relative perspective-1000">
              <div className="space-y-6">
                <div className="h-72 rounded-[2.5rem] overflow-hidden glass shadow-2xl animate-float group">
                  <img src="https://framerusercontent.com/images/sTK6sybbKO4rqkc70E4AtawoRc.jpg?width=2560&height=1440" alt="Team" className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700" />
                </div>
                <div className="h-56 rounded-[2.5rem] overflow-hidden glass shadow-2xl animate-float" style={{ animationDelay: '1.2s' }}>
                  <img src="https://framerusercontent.com/images/iCuv1hnq9hAalYZSbiXDKScy31M.jpg?scale-down-to=512&width=2560&height=1707" alt="Office" className="w-full h-full object-cover grayscale hover:grayscale-0 hover:scale-110 transition-all duration-700" />
                </div>
              </div>
              <div className="space-y-6 pt-16">
                <div className="h-56 rounded-[2.5rem] overflow-hidden glass shadow-2xl animate-float" style={{ animationDelay: '0.6s' }}>
                  <img src="https://framerusercontent.com/images/pi5OJpoXVOCoeElqYLWoXIdGn1U.png?scale-down-to=1024&width=946&height=1180" alt="Tech" className="w-full h-full object-cover grayscale hover:grayscale-0 hover:scale-110 transition-all duration-700" />
                </div>
                <div className="h-72 rounded-[2.5rem] overflow-hidden glass shadow-2xl animate-float" style={{ animationDelay: '1.8s' }}>
                  <img src="https://framerusercontent.com/images/5W3fKf5FwyglyFVBHEXLuqopg.png?scale-down-to=1024&width=1536&height=1024" alt="Data" className="w-full h-full object-cover grayscale hover:grayscale-0 hover:scale-110 transition-all duration-700" />
                </div>
              </div>
              
              {/* Stats Overlay - Floating Glass Panel */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-10 glass-card rounded-[2rem] border-white/40 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] text-center min-w-[240px] z-20 backdrop-blur-3xl ring-1 ring-white/20">
                <div className="text-5xl font-heading font-black text-lifewood-green mb-2">20+</div>
                <div className="text-sm uppercase font-bold tracking-[0.2em] opacity-60">Years Expertise</div>
                <div className="w-12 h-1 bg-lifewood-saffron mx-auto mt-6 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
