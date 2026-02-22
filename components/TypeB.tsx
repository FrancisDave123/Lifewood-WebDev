
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Mic, Globe, Languages, Database, Sparkles, ChevronLeft, Zap, Shield, Target } from 'lucide-react';

interface TypeBProps {
  theme?: 'light' | 'dark';
  navigateTo?: (page: 'home' | 'services' | 'projects' | 'contact' | 'about' | 'offices' | 'type-a' | 'type-b' | 'type-c') => void;
}

const features = [
  {
    id: '01',
    title: 'Target',
    description: 'Capture and transcribe recordings from native speakers from 23 different countries. Voice content involves 6 project types and 9 data domains. A total of 25,400 valid hours durations.',
    image: 'https://framerusercontent.com/images/2GAiSbiawE1R7sXuFDwNLfEovRM.jpg?width=711&height=400',
    label: 'Target',
    icon: <Target className="w-6 h-6" />
  },
  {
    id: '02',
    title: 'Solutions',
    description: '30,000+ native speaking human resources from more than 30 countries were mobilized.    Use our flexible industrial processes and continuously optimize them.    Use PBI to track the progress of daily collection and transcription in real time, analyze and improve the results in real time.',
    image: 'https://framerusercontent.com/images/AtSZKyVin3X5lENphObnH6Puw.jpg?lossless=1&width=612&height=408',
    label: 'Solutions',
    icon: <Zap className="w-6 h-6" />
  },
  {
    id: '03',
    title: 'Results',
    description: '5 months to complete the voice collection and annotation of 25,400 valid hours on time and with quality.',
    image: 'https://framerusercontent.com/images/prEubFztlVx6VnuokfOrkAs.jpg?width=612&height=353',
    label: 'Results',
    icon: <Shield className="w-6 h-6" />
  }
];

export const TypeB: React.FC<TypeBProps> = ({ theme = 'light', navigateTo }) => {
  const [activeIdx, setActiveIdx] = useState(0);

  const scrollToContact = () => navigateTo?.('contact');

  return (
    <div className="min-h-screen pt-24 pb-20 overflow-x-hidden">
      {/* Background Decorative Elements */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <motion.div 
          animate={{ 
            scale: [1, 1.3, 1],
            x: [0, -100, 0],
            y: [0, 50, 0]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute top-[20%] -left-[10%] w-[70%] h-[70%] bg-lifewood-saffron/5 dark:bg-lifewood-saffron/10 rounded-full blur-[150px]"
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
            <div className="relative z-10">
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
                <span className="bg-gradient-to-r from-lifewood-green via-lifewood-yellow to-lifewood-green bg-clip-text text-transparent animate-pulse hover:animate-none transition-all">B</span>
                <span className="text-lifewood-serpent dark:text-white"> -</span>
              </motion.h1>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                whileHover={{ scale: 1.02, x: 5 }}
                className="text-5xl md:text-7xl font-heading font-black mb-8 bg-gradient-to-r from-lifewood-green to-lifewood-serpent dark:from-lifewood-yellow dark:to-lifewood-seaSalt bg-clip-text text-transparent cursor-pointer transition-transform duration-300"
              >
                Horizontal LLM Data
              </motion.h2>

              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-lg md:text-xl text-lifewood-serpent/80 dark:text-white/80 leading-relaxed mb-12 max-w-xl font-medium"
              >
                Comprehensive AI data solutions covering the entire spectrum from collection to model testing for deep learning, with a focus on multimodal datasets and cross-language performance.
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

            <div className="relative h-[400px] lg:h-[600px] hidden lg:block">
              {/* Floating 3D Shapes from Screenshot */}
              <motion.img 
                src="https://framerusercontent.com/images/Es0UNVEZFUO6pTmc3NI38eovew.png"
                initial={{ opacity: 0, scale: 0.72, rotate: -170 }}
                animate={{ opacity: 1, scale: [1.05, 1, 1.03], x: [0, 20, 0], y: [0, -16, 0], rotate: [-170, 560, 760, 1080] }}
                transition={{
                  opacity: { duration: 0.7 },
                  scale: { duration: 6.8, repeat: Infinity, ease: "easeInOut" },
                  x: { duration: 9.2, repeat: Infinity, ease: "easeInOut" },
                  y: { duration: 8.4, repeat: Infinity, ease: "easeInOut" },
                  rotate: { duration: 12.4, repeat: Infinity, ease: "linear", times: [0, 0.1, 0.48, 1] }
                }}
                whileHover={{ scale: 1.15, filter: "drop-shadow(0 25px 25px rgba(0, 0, 0, 0.3))" }}
                className="absolute top-[6%] right-[-2%] w-56 h-56 object-contain drop-shadow-2xl cursor-pointer transition-all duration-300"
                alt=""
              />
              <motion.img 
                src="https://framerusercontent.com/images/Tq3lgO9Qy66CFuDaYW99KQ5xoLM.png"
                initial={{ opacity: 0, scale: 0.72, rotate: 140 }}
                animate={{ opacity: 1, y: [0, 20, 0], x: [0, -16, 0], rotate: [140, -520, -720, -1020] }}
                transition={{
                  opacity: { duration: 0.7, delay: 0.1 },
                  y: { duration: 8.6, repeat: Infinity, ease: "easeInOut", delay: 0.6 },
                  x: { duration: 10.2, repeat: Infinity, ease: "easeInOut", delay: 0.6 },
                  rotate: { duration: 13.2, repeat: Infinity, ease: "linear", times: [0, 0.12, 0.52, 1], delay: 0.1 }
                }}
                whileHover={{ scale: 1.15, filter: "drop-shadow(0 25px 25px rgba(0, 0, 0, 0.3))" }}
                className="absolute bottom-[-2%] right-[24%] w-72 h-72 object-contain drop-shadow-2xl cursor-pointer transition-all duration-300"
                alt=""
              />
              <motion.img 
                src="https://framerusercontent.com/images/LFAxsa4CpX7e4qBI72ijOV2sHg.png"
                initial={{ opacity: 0, scale: 0.74, rotate: -130 }}
                animate={{ opacity: 1, scale: [1, 1.08, 1], y: [0, -12, 0], x: [0, 12, 0], rotate: [-130, 500, 650, 920] }}
                transition={{
                  opacity: { duration: 0.7, delay: 0.2 },
                  scale: { duration: 7.4, repeat: Infinity, ease: "easeInOut", delay: 0.4 },
                  y: { duration: 8, repeat: Infinity, ease: "easeInOut", delay: 0.4 },
                  x: { duration: 9, repeat: Infinity, ease: "easeInOut", delay: 0.4 },
                  rotate: { duration: 11.8, repeat: Infinity, ease: "linear", times: [0, 0.09, 0.45, 1], delay: 0.2 }
                }}
                whileHover={{ scale: 1.2, filter: "drop-shadow(0 25px 25px rgba(0, 0, 0, 0.3))" }}
                className="absolute top-[38%] left-[-4%] w-64 h-64 object-contain drop-shadow-2xl cursor-pointer transition-all duration-300"
                alt=""
              />
            </div>
          </div>
        </motion.div>

        {/* Use Cases */}
        <div className="grid md:grid-cols-2 gap-8 mb-24 md:mb-32">
          {[
            { 
              title: 'Apple Intelligence', 
              desc: 'Voice, image and text datasets provided for next-gen AI systems.',
              icon: <Mic className="w-6 h-6 text-lifewood-saffron" />
            },
            { 
              title: '50+ Languages', 
              desc: 'Hyper-localized data solutions across all major global language sets.',
              icon: <Globe className="w-6 h-6 text-lifewood-green" />
            }
          ].map((item, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="p-12 rounded-[3rem] glass border border-white/30 dark:border-white/10 shadow-xl group hover:bg-lifewood-saffron/5 hover:-translate-y-2 hover:shadow-2xl transition-all duration-500 cursor-default"
            >
              <div className="w-16 h-16 rounded-2xl bg-white/50 dark:bg-white/5 flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg">
                {item.icon}
              </div>
              <h3 className="text-3xl font-black mb-4 text-lifewood-serpent dark:text-white tracking-tight">{item.title}</h3>
              <p className="text-lifewood-serpent/60 dark:text-white/60 font-medium leading-relaxed text-lg">{item.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Interactive Section */}
        <div className="py-12 md:py-20">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-6 mb-12 md:mb-20"
          >
            <div className="w-16 h-[2px] bg-lifewood-saffron"></div>
            <h2 className="text-4xl md:text-6xl font-heading font-black text-lifewood-serpent dark:text-white uppercase tracking-tighter">
              AI Data <span className="text-lifewood-saffron">Project (Audio)</span>
            </h2>
          </motion.div>
          
          <div className="flex flex-col lg:flex-row items-start gap-8 lg:gap-20">
            <div className="lg:w-1/3 flex flex-col justify-center order-2 lg:order-1 min-h-[450px]">
              <AnimatePresence mode="wait">
                <motion.div 
                  key={activeIdx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="glass p-10 md:p-14 rounded-[3rem] border border-white/30 dark:border-white/10 shadow-2xl relative overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_40px_90px_-35px_rgba(255,179,71,0.35)]"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-lifewood-saffron/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                  <div className="w-14 h-14 rounded-2xl bg-lifewood-saffron/10 flex items-center justify-center mb-8 text-lifewood-saffron shadow-inner">
                    {features[activeIdx].icon}
                  </div>
                  <h3 className="text-4xl font-black mb-6 text-lifewood-serpent dark:text-white tracking-tight">
                    {features[activeIdx].title}
                  </h3>
                  <p className="text-xl text-lifewood-serpent/70 dark:text-white/70 leading-relaxed font-medium">
                    {features[activeIdx].description}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="lg:w-2/3 flex flex-col md:flex-row gap-12 order-1 lg:order-2 md:h-[550px]">
              <div className="relative flex-1 aspect-[16/10] md:aspect-auto">
                <div className="relative h-full rounded-[3rem] md:rounded-[5rem] overflow-hidden shadow-[0_48px_96px_-16px_rgba(0,0,0,0.3)] bg-black group transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_55px_110px_-18px_rgba(0,0,0,0.45)]">
                  <AnimatePresence mode="wait">
                    <motion.img 
                      key={activeIdx}
                      src={features[activeIdx].image}
                      initial={{ opacity: 0, scale: 1.15 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                      className="w-full h-full object-cover opacity-70"
                      alt=""
                    />
                  </AnimatePresence>
                  <div className="absolute inset-0 bg-gradient-to-t from-lifewood-saffron/60 via-transparent to-transparent pointer-events-none" />
                  
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
                      <div className="text-xs font-black uppercase tracking-[0.4em] text-white/40 mb-2">Target</div>
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

              <div className="hidden md:flex flex-col gap-10 justify-center">
                {features.map((feature, i) => (
                  <motion.button
                    key={i}
                    onMouseEnter={() => setActiveIdx(i)}
                    className="group flex items-center gap-8 text-left"
                  >
                    <div className={`w-[2px] h-14 rounded-full transition-all duration-700 ${activeIdx === i ? 'bg-lifewood-saffron h-20 shadow-[0_0_20px_rgba(255,179,71,0.5)]' : 'bg-lifewood-serpent/10 group-hover:bg-lifewood-serpent/30'}`} />
                    <div className="py-2">
                      <div className={`text-xs font-black uppercase tracking-[0.3em] mb-2 transition-colors duration-500 ${activeIdx === i ? 'text-lifewood-saffron' : 'text-lifewood-serpent/30'}`}>
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
