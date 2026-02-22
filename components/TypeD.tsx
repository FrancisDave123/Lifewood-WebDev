import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

interface TypeDProps {
  navigateTo?: (page: string) => void;
}

export const TypeD: React.FC<TypeDProps> = ({ navigateTo }) => {
  const scrollToContact = () => navigateTo?.('contact');

  return (
    <div id="type-d" className="relative min-h-screen bg-lifewood-seaSalt dark:bg-[#020804] overflow-hidden">
      <div className="container mx-auto px-6 py-28 relative z-10">
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="flex gap-2">
              <div className="w-4 h-4 rounded-full bg-lifewood-saffron"></div>
              <div className="w-4 h-4 rounded-full border-2 border-lifewood-serpent dark:border-white"></div>
            </div>
            <div className="w-24 h-px bg-lifewood-serpent/30 dark:bg-white/30 border-dashed border-t"></div>
          </div>

          <h1 className="text-4xl md:text-6xl font-heading font-bold tracking-tight text-lifewood-serpent dark:text-white mb-6">
            AI Generated Content (AIGC)
          </h1>

          <p className="text-base md:text-lg text-lifewood-serpent/70 dark:text-white/70 max-w-5xl leading-relaxed mb-8">
            Lifewood&apos;s early adoption of AI tools has seen the company rapidly evolve the use of AI generated content, which has been integrated into video production for the company&apos;s communication requirements. This has been enormously successful, and these text, voice, image and video skills that comprise AIGC production, combined with more traditional production methods and our story development skills, are now being sought by other companies.
          </p>

          <button
            onClick={scrollToContact}
            className="group px-6 py-3 bg-lifewood-green text-white rounded-full text-sm font-bold inline-flex items-center gap-2 hover:scale-105 transition-transform"
          >
            Contact Us
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-24 rounded-[2.5rem] overflow-hidden shadow-[0_45px_110px_-35px_rgba(0,0,0,0.45)]"
        >
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-[320px] md:h-[520px] object-cover"
            poster="https://framerusercontent.com/images/2uF9Ksrf98DxfWsjGrIvBbyRWs.jpeg?scale-down-to=1024&width=1456&height=816"
          >
            <source src="https://framerusercontent.com/assets/OYykWaWrUmfZYDy3CJnT4GUNL8.mp4" type="video/mp4" />
          </video>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid lg:grid-cols-2 gap-12 items-center mb-24"
        >
          <div>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-lifewood-serpent dark:text-white mb-6">
              Our Approach
            </h2>
            <p className="text-lg text-lifewood-serpent/70 dark:text-white/70 max-w-xl leading-relaxed">
              Our motivation is to express the personality of your brand in a compelling and distinctive way. We specialize in story-driven content, for companies looking to join the communication revolution.
            </p>
          </div>

          <div className="relative h-[430px] md:h-[520px]">
            <img
              src="https://framerusercontent.com/images/1Pnyjmjwo7FWEAoCcEszS2Fngns.jpeg?scale-down-to=1024&width=1600&height=897"
              alt=""
              className="absolute top-2 right-8 w-[54%] rounded-xl shadow-2xl rotate-[4deg] hover:-translate-y-2 transition-transform"
            />
            <img
              src="https://framerusercontent.com/images/ptHrgNDD082Sa0EZcDea0FYhulM.jpeg?scale-down-to=1024&width=1600&height=897"
              alt=""
              className="absolute top-24 right-2 w-[58%] rounded-xl shadow-2xl -rotate-[8deg] hover:-translate-y-2 transition-transform"
            />
            <img
              src="https://framerusercontent.com/images/2uF9Ksrf98DxfWsjGrIvBbyRWs.jpeg?scale-down-to=1024&width=1456&height=816"
              alt=""
              className="absolute bottom-10 left-14 w-[66%] rounded-xl shadow-2xl -rotate-[8deg] hover:-translate-y-2 transition-transform"
            />
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-24"
        >
          <div className="grid lg:grid-cols-[1fr_1.15fr] gap-10 items-start">
            <div>
              <div className="w-6 h-6 text-lifewood-serpent/30 dark:text-white/30 text-3xl leading-none mb-6">8</div>
              <p className="text-2xl md:text-3xl leading-tight font-heading font-medium text-lifewood-serpent/90 dark:text-white/90 max-w-2xl">
                We use advanced film, video and editing techniques, combined with generative AI, to create cinematic worlds for your videos, advertisements and corporate communications.
              </p>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-3 gap-4">
                <img
                  src="https://framerusercontent.com/images/pW4xMuxSlAXuophJZT96Q4LO0.jpeg?scale-down-to=512&width=800&height=386"
                  alt=""
                  className="h-40 w-full object-cover rounded-xl shadow-xl hover:-translate-y-1 transition-transform"
                />
                <img
                  src="https://framerusercontent.com/images/3CdZeNunHzqH9P7TcEFjG2Imb4.jpg?scale-down-to=1024&width=4000&height=6000"
                  alt=""
                  className="h-40 w-full object-cover rounded-xl shadow-xl hover:-translate-y-1 transition-transform"
                />
                <img
                  src="https://framerusercontent.com/images/ifVOmevTJG4uimv3rRPBuoDvYM.jpg?scale-down-to=1024&width=5245&height=7867"
                  alt=""
                  className="h-40 w-full object-cover rounded-xl shadow-xl hover:-translate-y-1 transition-transform"
                />
              </div>

              <div className="grid grid-cols-[2fr_1fr_0.8fr] gap-4">
                <div className="relative rounded-xl overflow-hidden shadow-xl hover:-translate-y-1 transition-transform">
                  <img
                    src="https://framerusercontent.com/images/8USU1OFCcARiIIvcdJBJlzA8EA4.jpg?scale-down-to=512&width=5184&height=3456"
                    alt=""
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/55 to-transparent"></div>
                  <p className="absolute left-5 bottom-5 text-white font-semibold text-xl max-w-[70%] leading-tight">
                    the culture and language of your video to suit different world markets.
                  </p>
                </div>

                <div className="relative rounded-xl overflow-hidden shadow-xl hover:-translate-y-1 transition-transform">
                  <img
                    src="https://framerusercontent.com/images/UZnPJgTru2Os9pqnz20ckvASCI8.jpg?scale-down-to=1024&width=4160&height=6240"
                    alt=""
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute inset-0 bg-black/35"></div>
                  <p className="absolute left-3 bottom-4 text-white text-sm font-bold">Multiple Languages</p>
                </div>

                <div className="bg-black/5 dark:bg-white/10 rounded-xl h-64 flex items-center justify-center text-center shadow-xl hover:-translate-y-1 transition-transform">
                  <div>
                    <p className="text-6xl font-black text-lifewood-serpent dark:text-white leading-none">100+</p>
                    <p className="text-lifewood-serpent/60 dark:text-white/60 font-medium mt-2">Countries</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-5xl mx-auto py-10"
        >
          <blockquote className="text-2xl md:text-4xl leading-tight font-heading font-medium text-lifewood-serpent dark:text-white">
            &ldquo;We understand that your customers spend hours looking at screens: so finding the one, most important thing, on which to build your message is integral to our approach, as we seek to deliver surprise and originality.&rdquo;
          </blockquote>
          <p className="mt-6 text-lifewood-serpent/50 dark:text-white/50 font-medium">- Lifewood -</p>
        </motion.section>
      </div>
    </div>
  );
};
