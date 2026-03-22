
import React, { useState } from 'react';
import { ArrowRight, Image as ImageIcon, Mic, FileText, Video as VideoIcon, Play, Sparkles, X, Layers, Share2, ShieldCheck, Database, Search, Target } from 'lucide-react';
import type { PageRoute } from '../routes/routeTypes';
import { StickyPageTitle } from './StickyPageTitle';

interface AIServicesProps {
  theme?: 'light' | 'dark';
  navigateTo?: (page: PageRoute) => void;
}

export const AIServices: React.FC<AIServicesProps> = ({ navigateTo }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const handleContactClick = () => {
    navigateTo?.('contact-us');
  };

  const handleJoinUsClick = () => {
    navigateTo?.('join-us');
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
  const videoId = "g_JvAVL0WY4";
  const si = "elnNvCuWEU_tuvzZ";
  const embedUrl = `https://www.youtube.com/embed/${videoId}?si=${si}&autoplay=1`;
  const thumbnailUrl = "https://i.ytimg.com/vi_webp/g_JvAVL0WY4/sddefault.webp";

  const solutionFolders = [
    {
      title: 'Data Validation',
      icon: <ShieldCheck className="w-6 h-6" />,
      description: 'Integrity checks that keep datasets consistent, accurate, and complete before they move downstream.',
      color: '#046241',
      cards: [
        { title: 'Rule Checks', description: 'Schema validation, duplicate detection, and constraint enforcement.' },
        { title: 'Quality Review', description: 'Exception handling and human oversight for critical datasets.' },
        { title: 'Audit Readiness', description: 'Traceability and reporting built into every validation pass.' }
      ]
    },
    {
      title: 'Data Collection',
      icon: <Database className="w-6 h-6" />,
      description: 'Multi-modal capture for text, audio, image, and video across diverse enterprise workflows.',
      color: '#FFB347',
      cards: [
        { title: 'Multi-Channel Capture', description: 'Text, audio, image, and video collection in one workflow.' },
        { title: 'Categorization', description: 'Fast tagging and labeling to organize incoming content.' },
        { title: 'Global Coverage', description: 'Flexible delivery across languages, regions, and time zones.' }
      ]
    },
    {
      title: 'Data Acquisition',
      icon: <Share2 className="w-6 h-6" />,
      description: 'End-to-end acquisition pipelines for large-scale, diverse datasets with simple handoff and control.',
      color: '#133020',
      cards: [
        { title: 'Capture Pipelines', description: 'Capture, process, and manage large-scale data at speed.' },
        { title: 'Source Integration', description: 'Link systems and teams through consistent acquisition flows.' },
        { title: 'Delivery Control', description: 'Structured handoff for downstream AI training and ops.' }
      ]
    },
    {
      title: 'Data Curation',
      icon: <Layers className="w-6 h-6" />,
      description: 'Sifting, selecting, and indexing data so it remains reliable, accessible, and easy to classify.',
      color: '#0e4b34',
      cards: [
        { title: 'Indexing', description: 'Organize and structure content for future retrieval.' },
        { title: 'Selection', description: 'Choose only the most relevant and trustworthy records.' },
        { title: 'Metadata', description: 'Attach context that improves search and interpretation.' }
      ]
    },
    {
      title: 'Data Annotation',
      icon: <Target className="w-6 h-6" />,
      description: 'Precise labelling for AI systems that need high-quality supervised and multimodal training data.',
      color: '#5227FF',
      cards: [
        { title: 'Precision Labelling', description: 'Bounding, tagging, and classification with detailed review.' },
        { title: 'CV Workflows', description: 'Object detection and computer vision annotation at scale.' },
        { title: 'Model Support', description: 'Training-ready datasets for downstream machine learning.' }
      ]
    }
  ];

  return (
    <div className="pt-32 pb-20 animate-pop-out opacity-0">
      <div className="container mx-auto px-6">
        {/* Header Section */}
        <div className="mb-20 max-w-4xl animate-pop-out opacity-0" style={{ animationDelay: '100ms' }}>
          <StickyPageTitle
            id="ai-services-page-title"
            wrapperClassName="mb-10"
            titleClassName="text-6xl md:text-7xl font-heading font-black tracking-tight text-lifewood-serpent dark:text-white uppercase"
            title="AI DATA SERVICES"
          />
          
          <p className="text-lg md:text-xl text-lifewood-serpent/60 dark:text-white/60 leading-relaxed mb-10 max-w-3xl font-medium">
            Lifewood delivers end-to-end AI data solutions—from multi-language data collection and annotation to model training and generative AI content. Leveraging our global workforce, industrialized methodology, and proprietary LIFT platform, we enable organizations to scale efficiently, reduce costs, and accelerate decision-making with high-quality, domain-specific datasets.
          </p>

          <button 
            onClick={handleContactClick}
            className="group relative px-8 py-3 bg-lifewood-serpent dark:bg-lifewood-seaSalt text-white dark:text-lifewood-serpent rounded-full font-bold text-sm flex items-center gap-3 transition-all hover:scale-105 active:scale-95 shadow-[0_10px_30px_rgba(19,48,32,0.15)] dark:shadow-[0_10px_30px_rgba(0,0,0,0.3)]"
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
              onClick={handleJoinUsClick}
              className="inline-flex items-center gap-4 px-8 py-4 bg-lifewood-serpent dark:bg-white text-white dark:text-lifewood-serpent rounded-full font-bold group hover:scale-105 transition-all shadow-2xl"
            >
              Get started now
              <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-12 gap-8 xl:gap-10">
            {solutionFolders.map((folder, index) => (
              <div
                key={folder.title}
                className={`group relative overflow-hidden rounded-[2.5rem] border border-lifewood-serpent/8 bg-white/92 dark:bg-[#08110d] p-8 shadow-[0_20px_60px_-30px_rgba(4,98,65,0.28)] backdrop-blur-md transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_30px_80px_-30px_rgba(4,98,65,0.45)] xl:col-span-4 ${index === 3 ? 'xl:col-start-3' : ''} ${index === 4 ? 'xl:col-start-7' : ''}`}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/0 via-white/0 to-white/0 transition-opacity duration-500 group-hover:opacity-0" />
                <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 bg-[radial-gradient(circle_at_top_left,rgba(255,179,71,0.18),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(4,98,65,0.14),transparent_35%)]" />
                <div className="absolute -inset-px opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-lifewood-green via-lifewood-saffron to-lifewood-green rounded-[2.5rem] blur-[2px]" />

                <div className="relative z-10">
                  <div className="mb-6 flex items-start gap-4">
                    <div className="mt-1 h-12 w-12 rounded-2xl bg-lifewood-serpent/5 dark:bg-white/10 flex items-center justify-center text-lifewood-saffron shadow-sm transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6">
                      {folder.icon}
                    </div>
                    <div>
                      <h3 className="text-2xl md:text-3xl font-heading font-black text-lifewood-serpent dark:text-white">
                        {folder.title}
                      </h3>
                      <p className="mt-2 max-w-md text-sm md:text-base text-lifewood-serpent/82 dark:text-white/75 leading-relaxed">
                        {folder.description}
                      </p>
                    </div>
                  </div>

                  <div className="relative mt-8 overflow-hidden rounded-[2rem] border border-lifewood-serpent/8 bg-white/95 dark:bg-white/5 p-5 shadow-inner">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/0 via-white/20 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="relative z-10 space-y-3">
                      {folder.cards.map((card, cardIndex) => (
                        <div
                          key={card.title}
                          className="rounded-2xl border border-lifewood-serpent/8 bg-white/95 dark:bg-white/8 p-4 transition-all duration-500 group-hover:translate-y-0 hover:bg-white dark:hover:bg-white/12 shadow-sm"
                          style={{ transitionDelay: `${cardIndex * 70}ms` }}
                        >
                          <div className="mb-2 flex items-center gap-3">
                            <span className="h-2 w-2 rounded-full bg-gradient-to-r from-lifewood-green to-lifewood-saffron" />
                            <h4 className="text-sm font-black uppercase tracking-[0.18em] text-lifewood-serpent dark:text-white">
                              {card.title}
                            </h4>
                          </div>
                          <p className="text-sm leading-relaxed text-lifewood-serpent/78 dark:text-white/75">
                            {card.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
