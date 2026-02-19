
import React, { useState, useEffect } from 'react';
import { ArrowRight, Image as ImageIcon, Mic, FileText, Video as VideoIcon, Play, Sparkles, X } from 'lucide-react';
import { LOGO_URL, LOGO_DARK_URL } from '../constants';

interface AIServicesProps {
  theme?: 'light' | 'dark';
}

export const AIServices: React.FC<AIServicesProps> = ({ theme = 'light' }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [embedUrl, setEmbedUrl] = useState('');

  // Resolution for Error 153:
  // We must pass the origin to YouTube for security verification in sandboxed environments.
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const origin = window.location.origin;
      const videoId = "g_JvAVL0WY4";
      const si = "elnNvCuWEU_tuvzZ";
      // We use the exact URL provided by you, adding autoplay and origin validation.
      setEmbedUrl(`https://www.youtube.com/embed/${videoId}?si=${si}&autoplay=1&enablejsapi=1&origin=${encodeURIComponent(origin)}`);
    }
  }, []);

  const scrollToContact = () => {
    const el = document.getElementById('contact');
    if (el) {
      const offset = 80;
      const elementPosition = el.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  };

  const services = [
    {
      title: 'Image',
      icon: <ImageIcon className="w-6 h-6" />,
      desc: 'Collection, labelling, classification, audit, object detection and tagging'
    },
    {
      title: 'Audio',
      icon: <Mic className="w-6 h-6" />,
      desc: 'Collection, labelling, voice categorization, music categorization, intelligent cs'
    },
    {
      title: 'Text',
      icon: <FileText className="w-6 h-6" />,
      desc: 'Text collection, labelling, transcription, utterance collection, sentiment analysis'
    },
    {
      title: 'Video',
      icon: <VideoIcon className="w-6 h-6" />,
      desc: 'Collection, labelling, audit, live broadcast, subtitle generation'
    },
    {
      title: 'Multimodal',
      icon: <Sparkles className="w-6 h-6" />,
      desc: 'Cross-platform dataset merging, semantic alignment, and frontier model RLHF'
    }
  ];

  const marqueeItems = [...services, ...services];
  const currentLogo = theme === 'dark' ? LOGO_DARK_URL : LOGO_URL;

  return (
    <div className="pt-32 pb-20 animate-pop-out opacity-0">
      <div className="container mx-auto px-6">
        {/* Header Section */}
        <div className="mb-20 max-w-4xl animate-pop-out opacity-0" style={{ animationDelay: '100ms' }}>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-0.5 bg-lifewood-serpent/20"></div>
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-lifewood-serpent"></div>
              <div className="w-3 h-3 rounded-full bg-lifewood-serpent/20"></div>
            </div>
            <div className="w-32 h-0.5 bg-lifewood-serpent/20 border-dashed border-t"></div>
          </div>
          
          <h1 className="text-6xl md:text-7xl font-heading font-black mb-10 tracking-tight text-lifewood-serpent dark:text-white uppercase">
            AI DATA SERVICES
          </h1>
          
          <p className="text-lg md:text-xl text-lifewood-serpent/60 dark:text-white/60 leading-relaxed mb-10 max-w-3xl">
            Lifewood delivers end-to-end AI data solutions—from multi-language data collection and annotation to model training and generative AI content. Leveraging our global workforce, industrialized methodology, and proprietary LIFT platform, we enable organizations to scale efficiently, reduce costs, and accelerate decision-making with high-quality, domain-specific datasets.
          </p>

          <button 
            onClick={scrollToContact}
            className="group flex items-center gap-2 px-6 py-3 bg-lifewood-saffron text-lifewood-serpent rounded-full font-bold text-sm hover:scale-105 transition-all shadow-lg"
          >
            Contact Us <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Interactive Marquee Services Section */}
        <div className="relative w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] overflow-hidden py-10 animate-pop-out opacity-0" style={{ animationDelay: '200ms' }}>
          <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-lifewood-seaSalt dark:from-[#020804] to-transparent z-10 pointer-events-none"></div>
          <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-lifewood-seaSalt dark:from-[#020804] to-transparent z-10 pointer-events-none"></div>

          <div className="flex animate-marquee hover:[animation-play-state:paused] whitespace-nowrap items-center w-max">
            {marqueeItems.map((service, idx) => (
              <div 
                key={idx}
                className="inline-block mx-4 min-w-[320px] max-w-[320px] glass-card p-10 rounded-[3rem] border-white/40 shadow-xl transition-all duration-500 group relative overflow-hidden whitespace-normal cursor-pointer hover:-translate-y-4 hover:scale-105 hover:glow-green"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-lifewood-green/0 to-lifewood-green/5 group-hover:from-lifewood-green/10 group-hover:to-lifewood-saffron/10 transition-all duration-500 opacity-0 group-hover:opacity-100"></div>
                
                <div className="relative z-10">
                  <div className="w-14 h-14 rounded-2xl bg-lifewood-green/10 flex items-center justify-center mb-6 text-lifewood-green group-hover:scale-110 group-hover:rotate-12 transition-all">
                    {service.icon}
                  </div>
                  <h3 className="text-3xl font-heading font-bold mb-4 text-lifewood-serpent dark:text-white group-hover:text-lifewood-green transition-colors">{service.title}</h3>
                  <p className="text-lifewood-serpent/60 dark:text-white/40 leading-relaxed font-medium text-sm md:text-base">
                    {service.desc}
                  </p>
                </div>

                <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                   <Sparkles className="w-5 h-5 text-lifewood-saffron" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Video Feature Section - Embedded YouTube */}
        <div className="relative mt-20 mb-32 group animate-pop-out opacity-0" style={{ animationDelay: '400ms' }}>
          <div className="absolute -inset-4 bg-gradient-to-r from-lifewood-green/10 to-lifewood-saffron/10 rounded-[3.5rem] blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
          
          <div className="relative bg-[#0a0a0a] rounded-[3rem] overflow-hidden aspect-video shadow-2xl border-8 border-white dark:border-white/5 group-hover:border-lifewood-green/20 transition-all duration-500">
             {!isPlaying ? (
               <div className="absolute inset-0 flex items-center justify-center cursor-pointer" onClick={() => setIsPlaying(true)}>
                  <img 
                    src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5ce?auto=format&fit=crop&q=80&w=2000" 
                    className="w-full h-full object-cover opacity-60 grayscale group-hover:scale-105 transition-transform duration-1000" 
                    alt="Lifewood Vision" 
                  />
                  <div className="absolute inset-0 bg-lifewood-green/20 mix-blend-overlay"></div>
                  
                  <div className="relative z-10 flex flex-col items-center gap-6">
                    <div className="w-24 h-24 rounded-full bg-lifewood-green text-white flex items-center justify-center shadow-[0_0_50px_rgba(4,98,65,0.5)] group-hover:scale-110 group-hover:bg-lifewood-saffron transition-all duration-500">
                       <Play className="w-10 h-10 fill-white ml-1" />
                    </div>
                    <span className="text-white font-black tracking-[0.2em] uppercase text-sm drop-shadow-md">Watch Our Story</span>
                  </div>
                  
                  <img src={LOGO_DARK_URL} className="absolute top-10 right-10 h-10 opacity-60" alt="Lifewood" />
                  
                  <div className="absolute bottom-10 left-10 text-white/90 font-bold text-xl flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-lifewood-saffron animate-pulse"></div>
                    Lifewood: Global AI Data Engineering
                  </div>
               </div>
             ) : (
               <div className="relative w-full h-full bg-black">
                 <iframe 
                   className="w-full h-full"
                   src={embedUrl} 
                   title="YouTube video player" 
                   frameBorder="0" 
                   allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                   referrerPolicy="strict-origin-when-cross-origin"
                   allowFullScreen
                 ></iframe>
                 <button 
                   onClick={() => setIsPlaying(false)}
                   className="absolute top-6 right-6 w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/80 transition-colors z-20"
                 >
                   <X className="w-6 h-6" />
                 </button>
               </div>
             )}
          </div>
        </div>

        {/* Comprehensive Solutions Callout */}
        <div className="text-center py-20 relative overflow-hidden animate-pop-out opacity-0" style={{ animationDelay: '500ms' }}>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-lifewood-green/5 blur-[150px] rounded-full pointer-events-none"></div>
          <div className="relative z-10">
             <div className="inline-flex items-center gap-2 text-lifewood-serpent/40 dark:text-white/40 font-bold uppercase tracking-[0.3em] mb-6 text-sm">
                <Sparkles className="w-4 h-4" /> Why brands trust us
             </div>
             <h2 className="text-6xl md:text-8xl font-heading font-black mb-12 text-lifewood-serpent/10 dark:text-white/10 leading-none">
                Comprehensive <br /> Data Solutions
             </h2>
             <button 
                onClick={scrollToContact}
                className="inline-flex items-center gap-4 text-xl font-bold group"
              >
                Get started 
                <div className="w-12 h-12 rounded-full bg-lifewood-serpent dark:bg-white text-white dark:text-lifewood-serpent flex items-center justify-center group-hover:scale-110 transition-all">
                   <ArrowRight className="w-6 h-6" />
                </div>
             </button>
          </div>
        </div>

        {/* Bottom Imagery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-20 animate-pop-out opacity-0" style={{ animationDelay: '600ms' }}>
           <div className="aspect-[4/3] rounded-[3rem] overflow-hidden bg-gray-100 dark:bg-white/5 relative group">
              <img src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=1200" className="w-full h-full object-cover grayscale transition-all duration-1000 group-hover:grayscale-0 group-hover:scale-105" />
              <div className="absolute bottom-8 left-8 text-white text-lg font-bold drop-shadow-lg">
                 accuracy and cultural nuance across 30+ languages and regions.
              </div>
           </div>
           <div className="aspect-[4/3] rounded-[3rem] overflow-hidden bg-gray-100 dark:bg-white/5 relative flex items-center justify-center p-20">
              <div className="absolute inset-0 bg-white/50 dark:bg-black/20 blur-xl"></div>
              <img src={currentLogo} className="h-48 md:h-64 relative z-10" alt="Lifewood" />
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-10 mb-20 animate-pop-out opacity-0" style={{ animationDelay: '700ms' }}>
           <div className="aspect-[4/3] rounded-[3rem] overflow-hidden bg-gray-200 dark:bg-white/10 relative group">
              <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1200" className="w-full h-full object-cover grayscale transition-all duration-1000 group-hover:grayscale-0 group-hover:scale-105" />
              <div className="absolute bottom-8 left-8 text-white text-lg font-bold drop-shadow-lg">
                 © 2026 Lifewood Data Technology
              </div>
           </div>
           <div className="aspect-[4/3] rounded-[3rem] p-12 glass-card border-none flex flex-col justify-center">
              <p className="text-xl text-lifewood-serpent/40 dark:text-white/40 leading-relaxed">
                research, genealogies, scientific research and more.
              </p>
              <div className="mt-10 w-16 h-16 rounded-full bg-lifewood-saffron/10 border border-lifewood-saffron/20"></div>
           </div>
        </div>
      </div>
    </div>
  );
};
