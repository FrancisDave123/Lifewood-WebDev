
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Database, ChevronLeft, Sparkles, Shield, Zap, Globe } from 'lucide-react';
import type { PageRoute } from '../routes/routeTypes';

interface TypeAProps {
  theme?: 'light' | 'dark';
  navigateTo?: (page: PageRoute) => void;
}

const features = [
  {
    id: '01',
    title: 'Objective',
    description: 'Scan documents for preservation, then extract and structure the data into a database.',
    image: 'https://framerusercontent.com/images/1edPwLJhGXCUhlh38ixQSMOTFA.png?width=1024&height=1024',
    label: 'Objective',
    icon: <Target className="w-6 h-6" />
  },
  {
    id: '02',
    title: 'Key Features',
    description: 'Includes auto-crop, de-skew, blur detection, foreign object detection, and AI-powered data extraction.',
    image: 'https://framerusercontent.com/images/m7OC7BU1eSVf04CkU0jmNPRkf8.png?width=1024&height=1024',
    label: 'Key Features',
    icon: <Zap className="w-6 h-6" />
  },
  {
    id: '03',
    title: 'Results',
    description: 'Delivers validated, scalable, multilingual data extraction with structured outputs and clear, easy-to-review results.',
    image: 'https://framerusercontent.com/images/iI5MBUQ9ctQdcDHjCLNvD4j4kxc.png?width=1024&height=1024',
    label: 'Results',
    icon: <Shield className="w-6 h-6" />
  }
];

import { Target } from 'lucide-react';

export const TypeA: React.FC<TypeAProps> = ({ theme = 'light', navigateTo }) => {
  const [activeIdx, setActiveIdx] = useState(0);

  const scrollToContact = () => navigateTo?.('contact-us');

  return (
    <div className="min-h-screen pt-24 pb-20 overflow-x-hidden">
      {/* Background Decorative Elements */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
            x: [0, 100, 0],
            y: [0, 50, 0]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-[10%] -right-[10%] w-[60%] h-[60%] bg-lifewood-green/5 dark:bg-lifewood-green/10 rounded-full blur-[120px]"
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.1, 1],
            x: [0, -50, 0],
            y: [0, 100, 0]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-[10%] -left-[10%] w-[50%] h-[50%] bg-lifewood-saffron/5 dark:bg-lifewood-saffron/10 rounded-full blur-[120px]"
        />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative bg-gradient-to-br from-lifewood-paper via-lifewood-seaSalt/50 dark:from-lifewood-serpent dark:via-lifewood-serpent/80 dark:to-lifewood-serpent rounded-[3rem] p-12 md:p-20 lg:p-24 overflow-hidden mb-16 md:mb-24 shadow-2xl border border-lifewood-green/20 dark:border-lifewood-green/30 backdrop-blur-sm hover:border-lifewood-green/40 dark:hover:border-lifewood-green/50 hover:-translate-y-1 hover:shadow-[0_40px_90px_-30px_rgba(4,98,65,0.35)] transition-all duration-500"
        >
          {/* Animated Background Elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <motion.div 
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.5, 0.3]
              }}
              transition={{ duration: 8, repeat: Infinity }}
              className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-lifewood-green/20 to-lifewood-yellow/10 rounded-full blur-3xl"
            />
            <motion.div 
              animate={{ 
                scale: [1.2, 1, 1.2],
                opacity: [0.2, 0.4, 0.2]
              }}
              transition={{ duration: 10, repeat: Infinity, delay: 1 }}
              className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-lifewood-green/15 to-transparent rounded-full blur-3xl"
            />
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center relative z-10">
            <div id="type-a-page-title" className="relative z-10">
              {/* Animated Accent Line */}
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: 60 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="h-1.5 bg-gradient-to-r from-lifewood-green to-lifewood-yellow rounded-full mb-8"
              />

              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                whileHover={{ scale: 1.02 }}
                className="text-6xl md:text-8xl font-heading font-black mb-2 leading-[1.1] tracking-tighter cursor-pointer transition-transform duration-300"
              >
                <span className="text-lifewood-serpent dark:text-white">Type </span>
                <span className="bg-gradient-to-r from-lifewood-green via-lifewood-yellow to-lifewood-green bg-clip-text text-transparent animate-pulse hover:animate-none transition-all">A</span>
                <span className="text-lifewood-serpent dark:text-white"> -</span>
              </motion.h1>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                whileHover={{ scale: 1.02, x: 5 }}
                className="text-5xl md:text-7xl font-heading font-black mb-8 bg-gradient-to-r from-lifewood-green to-lifewood-serpent dark:from-lifewood-yellow dark:to-lifewood-seaSalt bg-clip-text text-transparent cursor-pointer transition-transform duration-300"
              >
                Data Servicing
              </motion.h2>

              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-lg md:text-xl text-lifewood-serpent/80 dark:text-white/80 leading-relaxed mb-12 max-w-xl font-medium"
              >
                End-to-end data services specializing in multi-language datasets, including document capture, data collection and preparation, extraction, cleaning, labeling, annotation, quality assurance, and formatting.
              </motion.p>

              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={scrollToContact}
                className="group relative px-8 py-4 bg-lifewood-serpent dark:bg-lifewood-seaSalt text-white dark:text-lifewood-serpent rounded-full font-bold text-base flex items-center gap-3 transition-all hover:scale-105 active:scale-95 shadow-[0_15px_40px_rgba(19,48,32,0.15)] dark:shadow-[0_15px_40px_rgba(0,0,0,0.3)]"
              >
                Contact Us
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform duration-300" />
              </motion.button>
            </div>

            <div className="relative hidden h-[400px] lg:block lg:h-[600px]">
              <motion.div
                initial={{ opacity: 0, scale: 0.96, y: 24 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.7 }}
                className="relative h-full rounded-[3rem] overflow-hidden shadow-[0_35px_90px_-35px_rgba(0,0,0,0.45)] border border-white/20 dark:border-white/10"
              >
                <img
                  src="https://images.pexels.com/photos/8296993/pexels-photo-8296993.jpeg?cs=srgb&dl=pexels-mikhail-nilov-8296993.jpg&fm=jpg"
                  className="h-full w-full object-cover"
                  alt="Data servicing workspace"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-black/45 via-black/5 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
                  <div className="max-w-xs rounded-[1.5rem] border border-white/20 bg-white/85 px-5 py-4 backdrop-blur-md dark:bg-black/35">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-lifewood-serpent/55 dark:text-white/55 mb-2">
                      Data servicing
                    </p>
                    <p className="text-sm leading-relaxed text-lifewood-serpent dark:text-white">
                      Structured data capture, verification, and office-based processing.
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Info Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-24 md:mb-32">
          {[
            { 
              title: 'Global Research', 
              desc: 'Multi-language genealogy documents and archives for global research.',
              color: 'bg-lifewood-green/10',
              icon: <Globe className="w-6 h-6 text-lifewood-green" />
            },
            { 
              title: 'Linguistic Data', 
              desc: 'Millions of non-Chinese songs and lyrics for advanced NLP training.',
              color: 'bg-lifewood-saffron/10',
              icon: <Sparkles className="w-6 h-6 text-lifewood-saffron" />
            }
          ].map((item, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-12 rounded-[3rem] glass border border-white/30 dark:border-white/10 shadow-xl group hover:bg-white/50 dark:hover:bg-white/10 hover:-translate-y-2 hover:shadow-2xl transition-all duration-500 cursor-default"
            >
              <div className={`w-16 h-16 rounded-2xl ${item.color} flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-inner`}>
                {item.icon}
              </div>
              <h3 className="text-3xl font-black mb-4 text-lifewood-serpent dark:text-white tracking-tight">{item.title}</h3>
              <p className="text-lifewood-serpent/60 dark:text-white/60 font-medium leading-relaxed text-lg">{item.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Interactive Features Section */}
        <div className="py-12 md:py-20">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-6 mb-12 md:mb-20"
          >
            <div className="w-16 h-[2px] bg-lifewood-green"></div>
            <h2 className="text-4xl md:text-6xl font-heading font-black text-lifewood-serpent dark:text-white uppercase tracking-tighter">
              Industrialized <span className="text-lifewood-green">Workflows</span>
            </h2>
          </motion.div>
          
          <div className="flex flex-col lg:flex-row items-start lg:items-stretch gap-8 lg:gap-20">
            {/* Left: Content & Mobile Nav */}
            <div className="lg:w-1/3 flex flex-col justify-center order-2 lg:order-1 min-h-[450px] lg:h-[550px]">
              <div className="space-y-8 lg:h-full">
                <AnimatePresence mode="wait">
                  <motion.div 
                    key={activeIdx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="glass p-10 md:p-14 rounded-[3rem] border border-white/30 dark:border-white/10 shadow-2xl relative overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_40px_90px_-35px_rgba(4,98,65,0.35)] lg:h-full lg:flex lg:flex-col"
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-lifewood-green/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                    <div className="w-14 h-14 rounded-2xl bg-lifewood-green/10 flex items-center justify-center mb-8 text-lifewood-green shadow-inner">
                      {features[activeIdx].icon}
                    </div>
                    <h3 className="text-4xl font-black mb-6 text-lifewood-serpent dark:text-white tracking-tight">
                      {features[activeIdx].title}
                    </h3>
                    <p className="text-xl text-lifewood-serpent/70 dark:text-white/70 leading-relaxed font-medium lg:flex-1">
                      {features[activeIdx].description}
                    </p>
                  </motion.div>
                </AnimatePresence>

                {/* Mobile Navigation Dots */}
                <div className="flex lg:hidden justify-center gap-4 py-4">
                  {features.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveIdx(i)}
                      className={`h-3 rounded-full transition-all duration-500 ${activeIdx === i ? 'w-16 bg-lifewood-green' : 'w-3 bg-lifewood-serpent/20'}`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Image & Desktop Nav */}
            <div className="lg:w-2/3 flex flex-col md:flex-row gap-12 order-1 lg:order-2 md:h-[550px]">
              <div className="relative flex-1 aspect-[4/3] md:aspect-auto">
                <div className="relative h-full rounded-[3rem] md:rounded-[5rem] overflow-hidden shadow-[0_48px_96px_-16px_rgba(0,0,0,0.3)] bg-black group transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_55px_110px_-18px_rgba(0,0,0,0.45)]">
                  <AnimatePresence mode="wait">
                    <motion.img 
                      key={activeIdx}
                      src={features[activeIdx].image}
                      initial={{ opacity: 0, scale: 1.15 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                      className="w-full h-full object-cover"
                      alt=""
                    />
                  </AnimatePresence>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none" />
                  
                  <div className="absolute bottom-10 left-10 md:bottom-16 md:left-16 flex items-end gap-8">
                    <motion.div 
                      key={activeIdx}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-7xl md:text-9xl font-heading font-black text-white leading-none tracking-tighter"
                    >
                      {features[activeIdx].id}
                    </motion.div>
                    <div className="mb-4 md:mb-6">
                      <div className="text-xs font-black uppercase tracking-[0.4em] text-white/40 mb-2">Phase</div>
                      <motion.div 
                        key={activeIdx}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight"
                      >
                        {features[activeIdx].label}
                      </motion.div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Desktop Vertical Nav */}
              <div className="hidden md:flex flex-col gap-10 justify-center">
                {features.map((feature, i) => (
                  <motion.button
                    key={i}
                    onMouseEnter={() => setActiveIdx(i)}
                    className="group flex items-center gap-8 text-left"
                  >
                    <div className="relative">
                      <div className={`w-[2px] h-14 rounded-full transition-all duration-700 ${activeIdx === i ? 'bg-lifewood-green h-20 shadow-[0_0_20px_rgba(4,98,65,0.5)]' : 'bg-lifewood-serpent/10 group-hover:bg-lifewood-serpent/30'}`} />
                    </div>
                    <div className="py-2">
                      <div className={`text-xs font-black uppercase tracking-[0.3em] mb-2 transition-colors duration-500 ${activeIdx === i ? 'text-lifewood-green' : 'text-lifewood-serpent/30'}`}>
                        {feature.id}
                      </div>
                      <div className={`text-2xl font-black uppercase transition-all duration-500 tracking-tight ${activeIdx === i ? 'text-lifewood-serpent dark:text-white translate-x-4' : 'text-lifewood-serpent/10 dark:text-white/10 group-hover:text-lifewood-serpent/30'}`}>
                        {feature.label}
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
