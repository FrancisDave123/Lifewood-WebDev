
import React from 'react';
import { ArrowRight, Image as ImageIcon, Mic, FileText, Video as VideoIcon, Play, Sparkles } from 'lucide-react';
import { LOGO_URL } from '../constants';

export const AIServices: React.FC = () => {
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

  return (
    <div className="pt-32 pb-20 animate-in fade-in duration-700">
      <div className="container mx-auto px-6">
        {/* Header Section */}
        <div className="mb-20 max-w-4xl">
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

          <button className="group flex items-center gap-2 px-6 py-3 bg-lifewood-saffron text-lifewood-serpent rounded-full font-bold text-sm hover:scale-105 transition-all shadow-lg">
            Contact Us <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Services Slider/Grid */}
        <div className="flex overflow-x-auto pb-12 gap-6 no-scrollbar -mx-6 px-6">
          {services.map((service, idx) => (
            <div 
              key={idx}
              className="min-w-[300px] flex-shrink-0 glass-card p-10 rounded-[2.5rem] border-white/40 shadow-xl hover:-translate-y-2 transition-transform duration-500 group"
            >
              <div className="w-12 h-12 rounded-2xl bg-lifewood-green/10 flex items-center justify-center mb-6 text-lifewood-green">
                {service.icon}
              </div>
              <h3 className="text-3xl font-heading font-bold mb-6 text-lifewood-serpent dark:text-white">{service.title}</h3>
              <p className="text-lifewood-serpent/50 dark:text-white/40 leading-relaxed font-medium">
                {service.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Video Feature Section */}
        <div className="relative mt-20 mb-32 group">
          <div className="absolute -inset-4 bg-gradient-to-r from-lifewood-green/10 to-lifewood-saffron/10 rounded-[3rem] blur-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="relative bg-[#0a0a0a] rounded-[3rem] overflow-hidden aspect-video shadow-2xl border-8 border-white dark:border-white/5">
             <div className="absolute inset-0 flex items-center justify-center">
                <img 
                  src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5ce?auto=format&fit=crop&q=80&w=2000" 
                  className="w-full h-full object-cover opacity-50 grayscale" 
                  alt="Global network" 
                />
                <div className="absolute inset-0 bg-lifewood-green/20 mix-blend-overlay"></div>
                <button className="w-20 h-20 rounded-full bg-lifewood-green/90 text-white flex items-center justify-center shadow-2xl hover:scale-110 transition-transform z-10">
                   <Play className="w-8 h-8 fill-white ml-1" />
                </button>
             </div>
             <div className="absolute bottom-10 left-10 text-white/80 font-medium text-lg">
                Lifewood enable scalable, always on data collection
             </div>
             <img src={LOGO_URL} className="absolute top-10 right-10 h-10 brightness-0 invert opacity-60" alt="Lifewood" />
          </div>
        </div>

        {/* Comprehensive Solutions Callout */}
        <div className="text-center py-20 relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-lifewood-green/5 blur-[150px] rounded-full pointer-events-none"></div>
          <div className="relative z-10">
             <div className="inline-flex items-center gap-2 text-lifewood-serpent/40 dark:text-white/40 font-bold uppercase tracking-[0.3em] mb-6 text-sm">
                <Sparkles className="w-4 h-4" /> Why brands trust us
             </div>
             <h2 className="text-6xl md:text-8xl font-heading font-black mb-12 text-lifewood-serpent/10 dark:text-white/10 leading-none">
                Comprehensive <br /> Data Solutions
             </h2>
             <button className="inline-flex items-center gap-4 text-xl font-bold group">
                Get started 
                <div className="w-12 h-12 rounded-full bg-lifewood-serpent dark:bg-white text-white dark:text-lifewood-serpent flex items-center justify-center group-hover:scale-110 transition-all">
                   <ArrowRight className="w-6 h-6" />
                </div>
             </button>
          </div>
        </div>

        {/* Bottom Imagery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-20">
           <div className="aspect-[4/3] rounded-[3rem] overflow-hidden bg-gray-100 dark:bg-white/5 relative group">
              <img src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=1200" className="w-full h-full object-cover grayscale transition-all duration-1000 group-hover:grayscale-0 group-hover:scale-105" />
              <div className="absolute bottom-8 left-8 text-white text-lg font-bold drop-shadow-lg">
                 accuracy and cultural nuance across 30+ languages and regions.
              </div>
           </div>
           <div className="aspect-[4/3] rounded-[3rem] overflow-hidden bg-gray-100 dark:bg-white/5 relative flex items-center justify-center p-20">
              <div className="absolute inset-0 bg-white/50 dark:bg-black/20 blur-xl"></div>
              <img src={LOGO_URL} className="h-48 md:h-64 relative z-10" alt="Lifewood" />
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-10 mb-20">
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
