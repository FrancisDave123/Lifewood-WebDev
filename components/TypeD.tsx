import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import type { PageRoute } from '../routes/routeTypes';
import { PageTitleBanner } from './PageTitleBanner';
import PixelTransition from './PixelTransition';

interface TypeDProps {
  navigateTo?: (page: PageRoute) => void;
}

interface DraggableElectricImageProps {
  src: string;
  alt: string;
  className: string;
  initialX: number;
  initialY: number;
  rotation: number;
}

interface PixelRevealImageProps {
  src: string;
  alt: string;
  className: string;
  overlayContent?: React.ReactNode;
}

const DraggableElectricImage: React.FC<DraggableElectricImageProps> = ({
  src,
  alt,
  className,
  initialX,
  initialY,
  rotation
}) => {
  const [position, setPosition] = useState({ x: initialX, y: initialY });
  const [dragging, setDragging] = useState(false);
  const dragState = useRef({ startX: 0, startY: 0, baseX: initialX, baseY: initialY });

  useEffect(() => {
    if (!dragging) return;

    const handlePointerMove = (event: PointerEvent) => {
      setPosition({
        x: dragState.current.baseX + (event.clientX - dragState.current.startX),
        y: dragState.current.baseY + (event.clientY - dragState.current.startY)
      });
    };

    const handlePointerUp = () => {
      setDragging(false);
      setPosition({ x: initialX, y: initialY });
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [dragging, position.x, position.y]);

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    dragState.current.startX = event.clientX;
    dragState.current.startY = event.clientY;
    dragState.current.baseX = position.x;
    dragState.current.baseY = position.y;
    setDragging(true);
  };

  return (
    <div
      className={`absolute select-none cursor-grab active:cursor-grabbing ${className}`}
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
        zIndex: dragging ? 40 : 10,
        touchAction: 'none',
        transition: dragging ? 'none' : 'transform 650ms cubic-bezier(0.22, 1, 0.36, 1)'
      }}
      onPointerDown={handlePointerDown}
    >
      <div className="type-d-counter-spin relative h-full w-full" style={{ transformOrigin: 'center center' }}>
        <div
          className="relative h-full w-full"
          style={{ opacity: 1, scale: 1, transformOrigin: 'center center' }}
        >
          <div
            className="type-d-card-wobble relative h-full w-full overflow-hidden rounded-[32px] shadow-[0_24px_70px_-30px_rgba(0,0,0,0.45)]"
            style={
              {
                willChange: 'transform',
                ['--type-d-base-rotation' as never]: `${rotation}deg`
              } as React.CSSProperties
            }
          >
            <img src={src} alt={alt} className="h-full w-full object-cover" draggable={false} />
          </div>
          <div
            className={`pointer-events-none absolute inset-0 -z-10 rounded-[2rem] blur-xl transition-opacity duration-300 ${
              dragging ? 'opacity-100' : 'opacity-60'
            }`}
            style={{ background: 'radial-gradient(circle, rgba(4,98,65,0.25), transparent 70%)' }}
          />
        </div>
      </div>
    </div>
  );
};

const PixelRevealImage: React.FC<PixelRevealImageProps> = ({ src, alt, className, overlayContent }) => {
  return (
    <PixelTransition
      className={`shadow-[0_24px_70px_-30px_rgba(0,0,0,0.45)] ${className}`}
      gridSize={10}
      pixelColor="#020804"
      firstContent={
        <div className="relative h-full w-full">
          <img src={src} alt={alt} className="h-full w-full object-cover blur-sm scale-[1.03]" loading="lazy" />
          <div className="absolute inset-0 bg-black/25" />
        </div>
      }
      secondContent={
        <div className="relative h-full w-full">
          <img src={src} alt={alt} className="h-full w-full object-cover" loading="lazy" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/5 to-transparent" />
          {overlayContent}
        </div>
      }
    />
  );
};

export const TypeD: React.FC<TypeDProps> = ({ navigateTo }) => {
  const scrollToContact = () => navigateTo?.('contact-us');

  return (
    <div id="type-d" className="relative min-h-screen bg-lifewood-seaSalt dark:bg-[#020804] overflow-hidden">
      <div className="container mx-auto px-6 py-28 relative z-10">
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <PageTitleBanner
            id="type-d-page-title"
            title="AI Generated Content (AIGC)"
            className="mb-6"
            titleClassName="text-4xl md:text-6xl font-heading font-bold tracking-tight text-lifewood-serpent dark:text-white uppercase whitespace-pre-line"
          />

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

          <div className="relative h-[460px] md:h-[560px]">
            <div className="type-d-orbit absolute inset-0">
              <DraggableElectricImage
                src="https://framerusercontent.com/images/1Pnyjmjwo7FWEAoCcEszS2Fngns.jpeg?scale-down-to=1024&width=1600&height=897"
                alt="Film crew camera setup"
                className="top-4 left-6 w-[58%] h-[56%]"
                initialX={0}
                initialY={0}
                rotation={5}
              />
              <DraggableElectricImage
                src="https://framerusercontent.com/images/ptHrgNDD082Sa0EZcDea0FYhulM.jpeg?scale-down-to=1024&width=1600&height=897"
                alt="Video editor workspace"
                className="top-20 right-4 w-[48%] h-[46%]"
                initialX={0}
                initialY={0}
                rotation={-8}
              />
              <DraggableElectricImage
                src="https://framerusercontent.com/images/2uF9Ksrf98DxfWsjGrIvBbyRWs.jpeg?scale-down-to=1024&width=1456&height=816"
                alt="Film crew in studio"
                className="bottom-6 left-14 w-[54%] h-[44%]"
                initialX={0}
                initialY={0}
                rotation={-6}
              />
            </div>
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
              <p className="text-2xl md:text-3xl leading-tight font-heading font-medium text-lifewood-serpent/90 dark:text-white/90 max-w-2xl">
                We use advanced film, video and editing techniques, combined with generative AI, to create cinematic worlds for your videos, advertisements and corporate communications.
              </p>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-3 gap-4">
                <PixelRevealImage
                  src="https://framerusercontent.com/images/pW4xMuxSlAXuophJZT96Q4LO0.jpeg?scale-down-to=512&width=800&height=386"
                  alt=""
                  className="h-40 w-full rounded-xl shadow-xl hover:-translate-y-1 transition-transform"
                />
                <PixelRevealImage
                  src="https://framerusercontent.com/images/3CdZeNunHzqH9P7TcEFjG2Imb4.jpg?scale-down-to=1024&width=4000&height=6000"
                  alt=""
                  className="h-40 w-full rounded-xl shadow-xl hover:-translate-y-1 transition-transform"
                />
                <PixelRevealImage
                  src="https://framerusercontent.com/images/ifVOmevTJG4uimv3rRPBuoDvYM.jpg?scale-down-to=1024&width=5245&height=7867"
                  alt=""
                  className="h-40 w-full rounded-xl shadow-xl hover:-translate-y-1 transition-transform"
                />
              </div>

              <div className="grid grid-cols-[2fr_1fr_0.8fr] gap-4">
                <PixelRevealImage
                  src="https://framerusercontent.com/images/8USU1OFCcARiIIvcdJBJlzA8EA4.jpg?scale-down-to=512&width=5184&height=3456"
                  alt=""
                  className="relative rounded-xl overflow-hidden shadow-xl hover:-translate-y-1 transition-transform h-64"
                  overlayContent={
                    <p className="absolute left-5 bottom-5 text-white font-semibold text-xl max-w-[70%] leading-tight">
                      the culture and language of your video to suit different world markets.
                    </p>
                  }
                />

                <PixelRevealImage
                  src="https://framerusercontent.com/images/UZnPJgTru2Os9pqnz20ckvASCI8.jpg?scale-down-to=1024&width=4160&height=6240"
                  alt=""
                  className="relative rounded-xl overflow-hidden shadow-xl hover:-translate-y-1 transition-transform h-64"
                  overlayContent={
                    <p className="absolute left-3 bottom-4 text-white text-sm font-bold">Multiple Languages</p>
                  }
                />

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
