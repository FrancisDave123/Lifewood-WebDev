
import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';

interface InternalNewsProps {
  navigateTo?: (page: 'home' | 'services' | 'projects' | 'contact' | 'about' | 'offices' | 'impact' | 'careers' | 'type-a' | 'type-b' | 'type-c' | 'type-d' | 'internal-news') => void;
}

export const InternalNews: React.FC<InternalNewsProps> = ({ navigateTo }) => {
  const handleContactClick = () => {
    navigateTo?.('contact');
  };

  return (
    <div className="pt-32 pb-20 min-h-screen bg-lifewood-seaSalt dark:bg-[#020804] relative overflow-x-hidden animate-pop-out opacity-0">
      {/* Animated background elements to match AboutUs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-lifewood-green/10 dark:bg-lifewood-green/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-lifewood-saffron/10 dark:bg-lifewood-saffron/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Header Section */}
        <div className="mb-20 animate-pop-out opacity-0" style={{ animationDelay: '100ms' }}>
          <div className="flex items-center gap-4 mb-6">
            <div className="flex gap-2">
              <div className="w-4 h-4 rounded-full bg-lifewood-saffron"></div>
              <div className="w-4 h-4 rounded-full border-2 border-lifewood-serpent dark:border-white"></div>
            </div>
            <div className="w-24 h-px bg-lifewood-serpent/30 dark:bg-white/30 border-dashed border-t"></div>
          </div>

          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full glass border border-lifewood-green/20 mb-6">
            <Sparkles className="w-4 h-4 text-lifewood-green" />
            <span className="text-xs font-black uppercase tracking-[0.24em] text-lifewood-serpent/70 dark:text-white/70">
              Internal News
            </span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-heading font-black mb-10 tracking-tight text-lifewood-serpent dark:text-white uppercase">
            Rootstech 2026
          </h1>
          
          <p className="text-lg md:text-xl text-lifewood-serpent/60 dark:text-white/60 leading-relaxed mb-10 max-w-4xl font-medium">
            Coming Soon! Stay tuned for more updates on our participation in Rootstech 2026. We are excited to showcase our latest innovations in AI data solutions and global research capabilities.
          </p>
          
          <button 
            onClick={handleContactClick}
            className="group relative px-8 py-3 bg-lifewood-serpent dark:bg-lifewood-seaSalt text-white dark:text-lifewood-serpent rounded-full font-bold text-sm flex items-center gap-3 transition-all hover:scale-105 active:scale-95 shadow-[0_10px_30px_rgba(19,48,32,0.15)] dark:shadow-[0_10px_30px_rgba(0,0,0,0.3)]"
          >
            Contact Us <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Video Section */}
        <div className="animate-pop-out opacity-0" style={{ animationDelay: '200ms' }}>
          <div className="bg-gray-100 dark:bg-white/5 rounded-[2.5rem] p-4 md:p-8 shadow-inner">
            <div className="relative aspect-video w-full rounded-2xl overflow-hidden shadow-2xl">
              <iframe 
                className="absolute inset-0 w-full h-full"
                src="https://www.youtube.com/embed/ccyrQ87EJag?si=IaEMhioSCF9R-Q-4" 
                title="YouTube video player" 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                referrerPolicy="strict-origin-when-cross-origin" 
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
