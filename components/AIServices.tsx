
import React, { useState } from 'react';
import { ArrowRight, Image as ImageIcon, Mic, FileText, Video as VideoIcon, Play, Sparkles, X, Folder, Layers, Share2, MousePointer2, ShieldCheck, Database, Search, Target } from 'lucide-react';
import { LOGO_URL, LOGO_DARK_URL } from '../constants';

interface AIServicesProps {
  theme?: 'light' | 'dark';
}

export const AIServices: React.FC<AIServicesProps> = ({ theme = 'light' }) => {
  const [isPlaying, setIsPlaying] = useState(false);

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

  const videoId = "g_JvAVL0WY4";
  const si = "elnNvCuWEU_tuvzZ";
  const embedUrl = `https://www.youtube.com/embed/${videoId}?si=${si}&autoplay=1`;
  const thumbnailUrl = "https://i.ytimg.com/vi_webp/g_JvAVL0WY4/sddefault.webp";
  const dataValidationImg = "https://framerusercontent.com/images/ZywE1VmIeWyUjcGlRI6E373zLc.png?width=668&height=791";

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
          
          <p className="text-lg md:text-xl text-lifewood-serpent/60 dark:text-white/60 leading-relaxed mb-10 max-w-3xl font-medium">
            Lifewood delivers end-to-end AI data solutions—from multi-language data collection and annotation to model training and generative AI content. Leveraging our global workforce, industrialized methodology, and proprietary LIFT platform, we enable organizations to scale efficiently, reduce costs, and accelerate decision-making with high-quality, domain-specific datasets.
          </p>

          <button 
            onClick={scrollToContact}
            className="group flex items-center gap-2 px-6 py-3 bg-lifewood-saffron text-lifewood-serpent rounded-full font-bold text-sm hover:scale-105 transition-all shadow-lg"
          >
            Contact Us <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Interactive Marquee */}
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
              </div>
            ))}
          </div>
        </div>

        {/* Video Feature Section */}
        <div className="relative mt-20 mb-32 group animate-pop-out opacity-0" style={{ animationDelay: '400ms' }}>
          <div className="absolute -inset-4 bg-gradient-to-r from-lifewood-green/10 to-lifewood-saffron/10 rounded-[3.5rem] blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
          
          <div className="relative bg-[#0a0a0a] rounded-[3rem] overflow-hidden aspect-video shadow-2xl border-8 border-white dark:border-white/5 group-hover:border-lifewood-green/20 transition-all duration-500">
             {!isPlaying ? (
               <div 
                  className="absolute inset-0 flex items-center justify-center cursor-pointer group/btn" 
                  onClick={() => setIsPlaying(true)}
               >
                  <img 
                    src={thumbnailUrl} 
                    className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-1000" 
                    alt="Lifewood Vision" 
                  />
                  <div className="absolute inset-0 bg-black/40 mix-blend-multiply group-hover:bg-black/20 transition-colors"></div>
                  
                  <div className="relative z-10 flex flex-col items-center justify-center gap-6 transform transition-transform duration-500 group-hover/btn:scale-110">
                    <div className="w-24 h-24 rounded-full bg-lifewood-green text-white flex items-center justify-center shadow-[0_0_50px_rgba(4,98,65,0.5)] group-hover:bg-lifewood-saffron transition-colors">
                       <Play className="w-10 h-10 fill-white ml-1" />
                    </div>
                    <span className="text-white font-black tracking-[0.2em] uppercase text-sm drop-shadow-md">Watch Our Story</span>
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

        {/* Comprehensive Solutions Section */}
        <div className="py-20 relative overflow-hidden">
          {/* Decorative background pulse */}
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-lifewood-green/5 blur-[150px] rounded-full animate-pulse-slow pointer-events-none"></div>

          <div className="text-center mb-20 animate-pop-out opacity-0" style={{ animationDelay: '500ms' }}>
            <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full glass border border-lifewood-serpent/5 mb-6 shadow-sm">
              <Sparkles className="w-4 h-4 text-lifewood-saffron animate-pulse" /> 
              <span className="text-xs font-black uppercase tracking-[0.3em] text-lifewood-serpent dark:text-white/60">Modern Enterprise Standards</span>
            </div>
            <h2 className="text-6xl md:text-8xl font-heading font-black mb-10 text-lifewood-serpent dark:text-white leading-tight tracking-tighter">
              Comprehensive <br /> 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-lifewood-green to-lifewood-saffron">Data Solutions</span>
            </h2>
            <button 
              onClick={scrollToContact}
              className="inline-flex items-center gap-4 px-8 py-4 bg-lifewood-serpent dark:bg-white text-white dark:text-lifewood-serpent rounded-full font-bold group hover:scale-105 transition-all shadow-2xl"
            >
              Get started now
              <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            
            {/* 1. Data Validation - Glossy Onyx Card */}
            <div className="lg:col-span-4 group relative overflow-hidden rounded-[3.5rem] bg-[#050c08] border border-white/5 p-10 md:p-12 flex flex-col min-h-[600px] lg:min-h-[750px] shadow-2xl transition-all hover:scale-[1.01] hover:shadow-lifewood-green/10">
              <div className="absolute inset-0 bg-gradient-to-br from-lifewood-green/20 via-transparent to-transparent opacity-40 group-hover:opacity-60 transition-opacity"></div>
              
              {/* Loop animation: Shifting beam */}
              <div className="absolute -inset-[100%] bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12 animate-gradient-flow pointer-events-none"></div>

              <div className="relative z-10 flex flex-col h-full">
                <div className="w-16 h-16 rounded-2xl bg-lifewood-green/20 flex items-center justify-center mb-10 border border-white/10 group-hover:scale-110 group-hover:rotate-[-12deg] transition-all duration-500">
                  <ShieldCheck className="w-8 h-8 text-lifewood-green" />
                </div>
                <h3 className="text-4xl font-heading font-black text-white mb-8 tracking-tight">Data <br />Validation</h3>
                <div className="space-y-6 text-white/70 leading-relaxed font-medium">
                  <p className="text-lg">The goal is to create data that is consistent, accurate and complete, preventing data loss or errors in transfer, code or configuration.</p>
                  <p className="text-base opacity-60">We verify that data conforms to predefined standards, rules or constraints, ensuring the information is trustworthy and fit for its intended purpose.</p>
                </div>
                
                <div className="mt-auto pt-10">
                  <div className="relative w-full overflow-hidden rounded-3xl bg-transparent">
                    {/* Animated Data Visualization Layer */}
                    <div className="absolute inset-0 z-10 opacity-30 pointer-events-none">
                      {[...Array(15)].map((_, i) => (
                        <div 
                          key={i} 
                          className="absolute h-px bg-white animate-marquee"
                          style={{ 
                            top: `${i * 7}%`, 
                            left: 0, 
                            width: '100%', 
                            animationDelay: `${i * 0.15}s`,
                            animationDuration: '4s'
                          }}
                        />
                      ))}
                    </div>
                    {/* Main Specified Image */}
                    <img 
                      src={dataValidationImg} 
                      className="w-full h-auto object-contain transition-transform duration-[4s] group-hover:scale-110"
                      alt="Data Validation Asset"
                    />
                  </div>
                  <div className="mt-6 flex justify-between items-center opacity-40 text-[10px] uppercase tracking-widest font-black text-white">
                    <span>© 2025 Lifewood Data Technology</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 4 Cards Sub-grid */}
            <div className="lg:col-span-8 grid md:grid-cols-2 gap-10">
              
              {/* 2. Data Collection - Glossy White/Glass Card */}
              <div className="group relative bg-white dark:bg-white/5 rounded-[3.5rem] p-10 flex flex-col border border-lifewood-serpent/5 shadow-xl transition-all hover:-translate-y-2 hover:shadow-2xl overflow-hidden min-h-[480px]">
                <div className="absolute top-0 right-0 w-32 h-32 bg-lifewood-saffron/10 blur-3xl group-hover:bg-lifewood-saffron/20 transition-colors"></div>
                
                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-lifewood-saffron/10 flex items-center justify-center text-lifewood-saffron group-hover:rotate-12 transition-transform duration-500">
                      <Database className="w-6 h-6" />
                    </div>
                    <h3 className="text-2xl font-heading font-black dark:text-white">Data Collection</h3>
                  </div>
                  <p className="text-[0.95rem] text-lifewood-serpent/70 dark:text-white/50 leading-relaxed font-semibold mb-10">
                    Lifewood delivers multi-modal data collection across text, audio, image, and video, supported by advanced workflows for categorization, labeling, tagging, transcription, sentiment analysis, and subtitle generation.
                  </p>
                </div>

                <div className="mt-auto bg-[#0a0a0a] rounded-[2.5rem] p-10 relative group/inner overflow-hidden shadow-inner flex flex-col items-center justify-center">
                  {/* Scanning animation line */}
                  <div className="absolute top-0 left-0 w-full h-1 bg-lifewood-saffron/40 shadow-[0_0_15px_rgba(255,179,71,0.5)] animate-bounce z-20"></div>
                  
                  <div className="flex flex-col items-center text-center gap-5">
                    <div className="relative">
                      <Folder className="w-14 h-14 text-lifewood-saffron animate-float" />
                      <div className="absolute -bottom-2 w-full h-1 bg-lifewood-saffron/20 blur-md"></div>
                    </div>
                    <p className="text-white text-[11px] font-black uppercase tracking-[0.2em] leading-relaxed opacity-80 max-w-[220px]">
                      Scalable precision across 30+ Global Regions
                    </p>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-br from-lifewood-saffron/5 to-transparent opacity-0 group-hover/inner:opacity-100 transition-opacity"></div>
                </div>
              </div>

              {/* 3. Data Acquisition - Live Node Card */}
              <div className="group relative bg-white dark:bg-white/5 rounded-[3.5rem] p-10 flex flex-col border border-lifewood-serpent/5 shadow-xl transition-all hover:-translate-y-2 hover:shadow-2xl overflow-hidden min-h-[480px]">
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-lifewood-green/10 blur-3xl group-hover:bg-lifewood-green/20 transition-colors"></div>
                
                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-lifewood-green/10 flex items-center justify-center text-lifewood-green group-hover:scale-110 group-hover:rotate-[20deg] transition-all duration-500">
                      <Share2 className="w-6 h-6" />
                    </div>
                    <h3 className="text-2xl font-heading font-black dark:text-white">Data Acquisition</h3>
                  </div>
                  <p className="text-[0.95rem] text-lifewood-serpent/70 dark:text-white/50 leading-relaxed font-semibold mb-10">
                    We provide end-to-end data acquisition solutions—capturing, processing, and managing large-scale, diverse datasets.
                  </p>
                </div>

                <div className="mt-auto relative aspect-[4/3] flex items-center justify-center bg-gray-50/50 dark:bg-black/20 rounded-[2.5rem] overflow-hidden border border-lifewood-serpent/5">
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-1/2 left-0 w-full h-px bg-lifewood-green"></div>
                    <div className="absolute top-0 left-1/2 w-px h-full bg-lifewood-green"></div>
                  </div>
                  
                  <div className="relative z-10 w-24 h-24 rounded-full border-4 border-lifewood-green/20 bg-white dark:bg-black flex items-center justify-center shadow-2xl group-hover:rotate-180 transition-transform duration-1000">
                    <img src={currentLogo} className="h-4" alt="Core" />
                  </div>
                  
                  {/* Pulsing Nodes */}
                  <div className="absolute inset-0 pointer-events-none">
                    {[0, 120, 240].map((deg) => (
                      <div 
                        key={deg}
                        className="absolute w-3 h-3 bg-lifewood-green rounded-full animate-ping"
                        style={{ 
                          top: '50%', 
                          left: '50%', 
                          transform: `rotate(${deg}deg) translate(70px) rotate(-${deg}deg)` 
                        }}
                      />
                    ))}
                    <div className="absolute w-[180px] h-[180px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border border-dashed border-lifewood-green/10 rounded-full animate-spin-slow"></div>
                  </div>
                </div>
              </div>

              {/* 4. Data Curation - Vibrant Glass Gradient Card */}
              <div className="group relative bg-white dark:bg-white/5 rounded-[3.5rem] p-10 flex flex-col border border-lifewood-serpent/5 shadow-xl transition-all hover:-translate-y-2 hover:shadow-2xl overflow-hidden min-h-[480px]">
                <div className="absolute inset-0 bg-gradient-to-br from-lifewood-saffron/5 to-lifewood-green/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                
                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-lifewood-serpent/5 dark:bg-white/10 flex items-center justify-center text-lifewood-serpent dark:text-white group-hover:rotate-[45deg] transition-all duration-500">
                      <Search className="w-6 h-6" />
                    </div>
                    <h3 className="text-2xl font-heading font-black dark:text-white">Data Curation</h3>
                  </div>
                  <div className="space-y-4 text-[0.95rem] text-lifewood-serpent/70 dark:text-white/50 leading-relaxed font-semibold mb-10">
                    <p>We sift, select and index data to ensure reliability, accessibility and ease of classification.</p>
                    <p>Data can be curated to support business decisions, academic research, genealogies, scientific research and more.</p>
                  </div>
                </div>

                <div className="mt-auto flex items-center justify-center gap-5 py-10 relative">
                  {/* Floating Bubbles */}
                  <div className="flex gap-3">
                    {[
                      { color: '#046241', delay: '0s' },
                      { color: '#FFB347', delay: '0.2s' },
                      { color: '#133020', delay: '0.4s' },
                      { color: '#FFC370', delay: '0.6s' }
                    ].map((dot, i) => (
                      <div 
                        key={i} 
                        className="w-12 h-12 rounded-2xl shadow-xl animate-float group-hover:scale-110 transition-transform"
                        style={{ backgroundColor: dot.color, animationDelay: dot.delay }}
                      />
                    ))}
                  </div>
                  <div className="absolute inset-x-0 bottom-4 text-center">
                    <span className="text-[9px] font-black uppercase tracking-[0.4em] opacity-20">Intelligent Sifting Systems</span>
                  </div>
                </div>
              </div>

              {/* 5. Data Annotation - Dark Precise Card */}
              <div className="group relative bg-[#133020] rounded-[3.5rem] p-10 flex flex-col border border-white/5 shadow-2xl transition-all hover:-translate-y-2 hover:shadow-lifewood-green/20 overflow-hidden min-h-[480px]">
                <div className="absolute -top-20 -right-20 w-64 h-64 bg-lifewood-green/20 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
                
                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-lifewood-green group-hover:text-lifewood-saffron group-hover:rotate-12 transition-all duration-500">
                      <Target className="w-6 h-6" />
                    </div>
                    <h3 className="text-2xl font-heading font-black text-white">Data Annotation</h3>
                  </div>
                  <p className="text-[0.95rem] text-white/60 leading-relaxed font-semibold mb-10">
                    In the age of AI, data is the fuel for all analytic and machine learning. With our in-depth library of services, we’re here to be an integral part of your digital strategy, accelerating your organization’s cognitive systems development.
                  </p>
                </div>

                <div className="mt-auto">
                   <div className="bg-white rounded-[2rem] px-8 py-5 flex items-center gap-5 mb-8 transform -rotate-2 group-hover:rotate-0 transition-transform shadow-2xl border border-white/20">
                      <div className="w-10 h-10 rounded-xl bg-lifewood-serpent flex items-center justify-center animate-pulse">
                        <MousePointer2 className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-[11px] text-lifewood-serpent font-black uppercase tracking-tight leading-none">Precision CV Labelling Active</span>
                   </div>
                   <div className="relative h-28 rounded-[2rem] overflow-hidden opacity-40 group-hover:opacity-100 transition-all duration-500">
                      <img src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=400" className="w-full h-full object-cover grayscale brightness-150 transition-transform duration-[3s] group-hover:scale-110" />
                      <div className="absolute inset-0 bg-lifewood-green/20 mix-blend-overlay"></div>
                   </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
