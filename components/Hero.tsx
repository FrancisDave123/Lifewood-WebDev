
import React, { useEffect, useState } from 'react';
import { ArrowRight, Play, Globe } from 'lucide-react';

interface HeroProps {
  navigateTo?: (page: 'home' | 'services' | 'projects' | 'contact') => void;
}

export const Hero: React.FC<HeroProps> = ({ navigateTo }) => {
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  const openVideoModal = () => setIsVideoOpen(true);
  const closeVideoModal = () => setIsVideoOpen(false);

  useEffect(() => {
    document.body.style.overflow = isVideoOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isVideoOpen]);

  return (
    <section 
      id="home" 
      className={`sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden bg-white dark:bg-[#020804] transition-colors duration-700 ${isVideoOpen ? 'z-[10000]' : 'z-0'} pt-20 md:pt-24`}
    >
      {/* Video Background Layer */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source 
            src="https://www.pexels.com/download/video/10922866/" 
            type="video/mp4" 
          />
          Your browser does not support the video tag.
        </video>
        {/* Dynamic Overlay to maintain contrast and blend with theme */}
        <div className="absolute inset-0 bg-white/40 dark:bg-[#020804]/75 backdrop-blur-[1px]"></div>
        
        {/* Animated Gradient Grids for extra depth */}
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.08]" style={{ backgroundImage: 'radial-gradient(#046241 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
      </div>

      {/* Premium Animated Background Blobs (Softened to blend with video) */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-5%] w-[50rem] h-[50rem] bg-lifewood-green/[0.05] dark:bg-lifewood-green/[0.1] rounded-full blur-[120px] animate-pulse-slow"></div>
        <div className="absolute bottom-[5%] right-[-5%] w-[60rem] h-[60rem] bg-lifewood-saffron/[0.03] dark:bg-lifewood-saffron/[0.05] rounded-full blur-[150px] animate-pulse-slow" style={{ animationDelay: '3s' }}></div>
      </div>

      {/* Hero Content with Pop-out animation */}
      <div className="container mx-auto px-6 relative z-10 text-center -mt-12 md:-mt-16 animate-pop-out opacity-0">
        {/* Modernized Floating Badge */}
        <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full glass border border-lifewood-green/10 mb-6 animate-float shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-xl group hover:border-lifewood-green/30 transition-all duration-500">
          <div className="relative">
            <span className="flex w-2.5 h-2.5 rounded-full bg-lifewood-green group-hover:scale-125 transition-transform"></span>
            <span className="absolute inset-0 rounded-full bg-lifewood-green animate-ping opacity-40"></span>
          </div>
          <span className="text-xs font-extrabold uppercase tracking-[0.2em] text-lifewood-serpent/60 dark:text-white/60 flex items-center gap-2">
             <Globe className="w-3.5 h-3.5 text-lifewood-green" /> Global Leaders in AI Data
          </span>
        </div>
        
        <div className="perspective-1000">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-heading font-black tracking-tight mb-8 leading-[1.15] text-lifewood-serpent dark:text-white max-w-5xl mx-auto">
            The world’s leading <br />
            <span className="relative inline-block mt-1">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-lifewood-green via-[#068a5c] to-lifewood-saffron inline-block transform hover:scale-[1.01] transition-transform duration-700">
                provider of AI-powered
              </span>
              <div className="absolute -bottom-1 left-0 w-full h-1 bg-lifewood-green/10 rounded-full scale-x-0 group-hover:scale-x-100 transition-transform"></div>
            </span> <br />
            data solutions.
          </h1>
        </div>

        <p className="max-w-2xl mx-auto text-base md:text-lg text-lifewood-serpent/70 dark:text-white/70 mb-10 leading-relaxed font-medium">
          Powering the next generation of artificial intelligence with precision-curated, globally-sourced data sets engineered for scale.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
          <button
            onClick={() => navigateTo?.('contact')}
            className="group relative px-8 py-4 bg-lifewood-serpent dark:bg-lifewood-seaSalt text-white dark:text-lifewood-serpent rounded-full font-bold text-base flex items-center gap-3 transition-all hover:scale-105 hover:glow-green active:scale-95 shadow-[0_15px_40px_rgba(19,48,32,0.15)] dark:shadow-[0_15px_40px_rgba(0,0,0,0.3)]"
          >
            Contact Us
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform duration-300" />
          </button>
          <button
            onClick={openVideoModal}
            className="flex items-center gap-3 px-8 py-4 font-bold text-base group glass border-lifewood-serpent/5 dark:border-white/10 rounded-full hover:bg-lifewood-serpent/[0.02] dark:hover:bg-white/[0.05] transition-all hover:shadow-xl"
          >
            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-white dark:bg-lifewood-serpent/20 shadow-lg group-hover:scale-110 transition-all border border-lifewood-green/20 group-hover:border-lifewood-green">
              <Play className="w-4 h-4 fill-lifewood-green text-lifewood-green ml-0.5" />
            </div>
            <span className="text-lifewood-serpent dark:text-white group-hover:text-lifewood-green transition-colors">Learn More</span>
          </button>
        </div>
      </div>

      {isVideoOpen && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center px-4 py-6"
          role="dialog"
          aria-modal="true"
        >
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={closeVideoModal}
            aria-hidden="true"
          />
          <div className="absolute top-5 right-5 z-[10001]">
            <button
              type="button"
              onClick={closeVideoModal}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/40 bg-white/10 text-white transition hover:bg-white/20"
              aria-label="Close video modal"
            >
              X
            </button>
          </div>
          <div className="relative z-[10000] w-full max-w-4xl">
            <div className="relative rounded-3xl border border-white/20 bg-black/90 shadow-[0_25px_120px_rgba(0,0,0,0.7)] overflow-hidden" style={{ paddingTop: '56.25%' }}>
              <iframe
                className="absolute inset-0 h-full w-full"
                src="https://www.youtube.com/embed/WocWafisMUI?si=CSgU6okjp4PdNpse"
                title="Lifewood Learn More video"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}

      {/* Floating Modern Accent Elements */}
      <div className="absolute top-[20%] left-[8%] hidden xl:block animate-float-slow opacity-20 dark:opacity-30 pointer-events-none">
        <div className="w-16 h-16 glass rounded-[1.2rem] rotate-12 border-lifewood-green/20"></div>
      </div>
      <div className="absolute bottom-[25%] right-[10%] hidden xl:block animate-float opacity-20 dark:opacity-30 pointer-events-none" style={{ animationDelay: '2s' }}>
        <div className="w-20 h-20 glass rounded-full border-lifewood-saffron/20"></div>
      </div>
    </section>
  );
};
