import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Film, MessageSquareQuote, Sparkles, Wand2 } from 'lucide-react';
import type { PageRoute } from '../routes/routeTypes';
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
          <div className="relative overflow-hidden rounded-[2.5rem] border border-lifewood-serpent/10 bg-gradient-to-br from-white via-lifewood-seaSalt/90 to-lifewood-green/5 p-8 shadow-[0_30px_90px_-45px_rgba(4,98,65,0.45)] dark:border-white/10 dark:from-[#0a120e] dark:via-[#020804] dark:to-[#0d2218] md:p-12">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(4,98,65,0.12),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(255,179,71,0.12),transparent_30%)]" />
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(4,98,65,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(4,98,65,0.04)_1px,transparent_1px)] bg-[size:44px_44px] opacity-35 dark:opacity-20" />

            <div className="relative">
              <div className="mb-5 flex items-center gap-4">
                <div className="h-px w-14 bg-gradient-to-r from-lifewood-green via-lifewood-saffron to-transparent" />
                <span className="text-[11px] font-black uppercase tracking-[0.34em] text-lifewood-serpent/55 dark:text-white/55">
                  AIGC production
                </span>
              </div>

              <h1
                id="type-d-page-title"
                className="text-4xl md:text-6xl font-heading font-black tracking-tight leading-[0.95] text-lifewood-serpent dark:text-white uppercase whitespace-pre-line max-w-4xl"
              >
                AI Generated Content (AIGC)
              </h1>

              <div className="grid gap-8 lg:grid-cols-[1.3fr_0.7fr] lg:items-end">
                <div>
                  <div className="mb-5 h-1.5 w-24 rounded-full bg-gradient-to-r from-lifewood-green via-lifewood-saffron to-transparent" />
                  <p className="max-w-5xl text-base leading-relaxed text-lifewood-serpent/75 dark:text-white/75 md:text-lg">
                    Lifewood&apos;s early adoption of AI tools has seen the company rapidly evolve the use of AI generated content, which has been integrated into video production for the company&apos;s communication requirements. This has been enormously successful, and these text, voice, image and video skills that comprise AIGC production, combined with more traditional production methods and our story development skills, are now being sought by other companies.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <div className="rounded-[1.5rem] border border-lifewood-green/15 bg-white/70 p-4 shadow-[0_18px_40px_-28px_rgba(4,98,65,0.35)] backdrop-blur-sm dark:border-white/10 dark:bg-white/5">
                    <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-lifewood-green/10 text-lifewood-green dark:bg-white/10 dark:text-white">
                      <Sparkles className="h-5 w-5" />
                    </div>
                    <p className="text-[11px] font-black uppercase tracking-[0.24em] text-lifewood-serpent/45 dark:text-white/45">AI Adoption</p>
                    <p className="mt-2 text-sm font-semibold leading-snug text-lifewood-serpent dark:text-white">Early experiments turned into a repeatable production workflow.</p>
                  </div>
                  <div className="rounded-[1.5rem] border border-lifewood-saffron/20 bg-gradient-to-b from-white/85 to-lifewood-saffron/10 p-4 shadow-[0_18px_40px_-28px_rgba(255,179,71,0.35)] backdrop-blur-sm dark:border-white/10 dark:from-white/10 dark:to-white/5">
                    <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-lifewood-saffron/15 text-lifewood-serpent dark:bg-lifewood-saffron/20 dark:text-white">
                      <Film className="h-5 w-5" />
                    </div>
                    <p className="text-[11px] font-black uppercase tracking-[0.24em] text-lifewood-serpent/45 dark:text-white/45">Video Production</p>
                    <p className="mt-2 text-sm font-semibold leading-snug text-lifewood-serpent dark:text-white">AI generated content now sits naturally inside Lifewood video work.</p>
                  </div>
                  <div className="rounded-[1.5rem] border border-lifewood-serpent/10 bg-lifewood-serpent/5 p-4 shadow-[0_18px_40px_-28px_rgba(19,48,32,0.18)] backdrop-blur-sm dark:border-white/10 dark:bg-white/5">
                    <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-lifewood-serpent/10 text-lifewood-serpent dark:bg-white/10 dark:text-white">
                      <MessageSquareQuote className="h-5 w-5" />
                    </div>
                    <p className="text-[11px] font-black uppercase tracking-[0.24em] text-lifewood-serpent/45 dark:text-white/45">Story Development</p>
                    <p className="mt-2 text-sm font-semibold leading-snug text-lifewood-serpent dark:text-white">Voice, image and narrative skills strengthen the final message.</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-start">
                <button
                  onClick={scrollToContact}
                  className="group inline-flex items-center gap-2 rounded-full bg-lifewood-green px-6 py-3 text-sm font-bold text-white shadow-[0_18px_40px_-18px_rgba(4,98,65,0.55)] transition-transform hover:scale-[1.03]"
                >
                  Contact Us
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </div>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-24"
        >
          <div className="relative overflow-hidden rounded-[2.75rem] border border-lifewood-serpent/10 bg-lifewood-serpent shadow-[0_45px_110px_-35px_rgba(0,0,0,0.48)] dark:border-white/10">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,179,71,0.12),transparent_28%),radial-gradient(circle_at_80%_80%,rgba(4,98,65,0.24),transparent_32%)]" />
            <video
              autoPlay
              loop
              muted
              playsInline
              className="relative h-[320px] w-full object-cover md:h-[520px] opacity-92"
              poster="https://framerusercontent.com/images/2uF9Ksrf98DxfWsjGrIvBbyRWs.jpeg?scale-down-to=1024&width=1456&height=816"
            >
              <source src="https://framerusercontent.com/assets/OYykWaWrUmfZYDy3CJnT4GUNL8.mp4" type="video/mp4" />
            </video>
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/30 to-transparent" />
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-24"
        >
          <div className="grid gap-10 lg:grid-cols-[0.88fr_1.12fr] lg:items-center">
            <div className="relative overflow-hidden rounded-[2.5rem] border border-lifewood-serpent/10 bg-gradient-to-br from-white via-white to-lifewood-green/5 p-8 shadow-[0_30px_90px_-50px_rgba(19,48,32,0.4)] dark:border-white/10 dark:from-white/5 dark:via-white/5 dark:to-white/0 md:p-10">
              <div className="absolute left-0 top-8 h-24 w-1.5 rounded-r-full bg-gradient-to-b from-lifewood-green via-lifewood-saffron to-transparent" />
              <div className="absolute right-6 top-6 h-28 w-28 rounded-full border border-lifewood-green/10 bg-gradient-to-br from-lifewood-green/10 via-white/50 to-lifewood-saffron/10 shadow-[inset_0_1px_16px_rgba(255,255,255,0.65)] dark:from-white/10 dark:via-white/5 dark:to-lifewood-green/10">
                <div className="flex h-full w-full items-center justify-center">
                  <div className="rounded-full bg-white/85 p-3 shadow-[0_12px_30px_-16px_rgba(19,48,32,0.45)] backdrop-blur-sm dark:bg-[#07110c]/90">
                    <Wand2 className="h-6 w-6 text-lifewood-green dark:text-lifewood-saffron" />
                  </div>
                </div>
              </div>
              <h2 className="mb-6 font-heading text-3xl font-bold tracking-tight text-lifewood-serpent dark:text-white md:text-5xl">
                Our Approach
              </h2>
              <p className="max-w-xl text-lg leading-relaxed text-lifewood-serpent/72 dark:text-white/72 md:text-xl">
                Our motivation is to express the personality of your brand in a compelling and distinctive way. We specialize in story-driven content, for companies looking to join the communication revolution.
              </p>
              <div className="mt-8 grid grid-cols-3 gap-3">
                <div className="h-1 rounded-full bg-gradient-to-r from-lifewood-green to-transparent" />
                <div className="h-1 rounded-full bg-gradient-to-r from-lifewood-saffron to-transparent" />
                <div className="h-1 rounded-full bg-gradient-to-r from-lifewood-serpent/50 to-transparent dark:from-white/50" />
              </div>
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
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-24"
        >
          <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
            <div className="relative overflow-hidden rounded-[2.5rem] border border-lifewood-serpent/10 bg-gradient-to-br from-lifewood-serpent via-[#0c1f16] to-[#06100b] p-8 shadow-[0_35px_90px_-45px_rgba(0,0,0,0.55)] dark:border-white/10 md:p-10">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,179,71,0.15),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(4,98,65,0.22),transparent_38%)]" />
              <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/30 to-transparent" />
              <div className="relative">
                <div className="mb-6 h-1.5 w-24 rounded-full bg-gradient-to-r from-lifewood-saffron via-lifewood-green to-transparent" />
                <p className="max-w-2xl text-2xl leading-tight font-heading font-medium text-white md:text-4xl">
                  We use advanced film, video and editing techniques, combined with generative AI, to create cinematic worlds for your videos, advertisements and corporate communications.
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-3 gap-4">
                <PixelRevealImage
                  src="https://framerusercontent.com/images/pW4xMuxSlAXuophJZT96Q4LO0.jpeg?scale-down-to=512&width=800&height=386"
                  alt=""
                  className="h-40 w-full rounded-[1.25rem] shadow-xl ring-1 ring-black/5 transition-transform hover:-translate-y-1"
                />
                <PixelRevealImage
                  src="https://framerusercontent.com/images/3CdZeNunHzqH9P7TcEFjG2Imb4.jpg?scale-down-to=1024&width=4000&height=6000"
                  alt=""
                  className="h-40 w-full rounded-[1.25rem] shadow-xl ring-1 ring-black/5 transition-transform hover:-translate-y-1"
                />
                <PixelRevealImage
                  src="https://framerusercontent.com/images/ifVOmevTJG4uimv3rRPBuoDvYM.jpg?scale-down-to=1024&width=5245&height=7867"
                  alt=""
                  className="h-40 w-full rounded-[1.25rem] shadow-xl ring-1 ring-black/5 transition-transform hover:-translate-y-1"
                />
              </div>

              <div className="grid grid-cols-[2fr_1fr_0.8fr] gap-4">
                <PixelRevealImage
                  src="https://framerusercontent.com/images/8USU1OFCcARiIIvcdJBJlzA8EA4.jpg?scale-down-to=512&width=5184&height=3456"
                  alt=""
                  className="relative h-64 overflow-hidden rounded-[1.5rem] shadow-xl ring-1 ring-black/5 transition-transform hover:-translate-y-1"
                  overlayContent={
                    <p className="absolute left-5 bottom-5 max-w-[70%] text-xl font-semibold leading-tight text-white">
                      the culture and language of your video to suit different world markets.
                    </p>
                  }
                />

                <PixelRevealImage
                  src="https://framerusercontent.com/images/UZnPJgTru2Os9pqnz20ckvASCI8.jpg?scale-down-to=1024&width=4160&height=6240"
                  alt=""
                  className="relative h-64 overflow-hidden rounded-[1.5rem] shadow-xl ring-1 ring-black/5 transition-transform hover:-translate-y-1"
                  overlayContent={
                    <p className="absolute left-3 bottom-4 text-sm font-bold text-white">Multiple Languages</p>
                  }
                />

                <div className="flex h-64 items-center justify-center rounded-[1.5rem] border border-lifewood-serpent/10 bg-white/70 text-center shadow-xl backdrop-blur-sm transition-transform hover:-translate-y-1 dark:border-white/10 dark:bg-white/5">
                  <div>
                    <p className="text-6xl font-black leading-none text-lifewood-serpent dark:text-white">100+</p>
                    <p className="mt-2 font-medium text-lifewood-serpent/60 dark:text-white/60">Countries</p>
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
          className="max-w-5xl mx-auto py-10"
        >
          <div className="relative overflow-hidden rounded-[2.5rem] border border-lifewood-serpent/10 bg-white/75 px-8 py-10 shadow-[0_24px_80px_-45px_rgba(19,48,32,0.35)] backdrop-blur-sm dark:border-white/10 dark:bg-white/5 md:px-12 md:py-14">
            <div className="absolute left-0 top-0 h-full w-2 bg-gradient-to-b from-lifewood-green via-lifewood-saffron to-transparent" />
            <div className="absolute right-8 top-8 h-28 w-28 rounded-full bg-lifewood-green/10 blur-3xl" />
            <blockquote className="relative text-2xl font-heading font-medium leading-tight text-lifewood-serpent dark:text-white md:text-4xl">
              &ldquo;We understand that your customers spend hours looking at screens: so finding the one, most important thing, on which to build your message is integral to our approach, as we seek to deliver surprise and originality.&rdquo;
            </blockquote>
            <p className="relative mt-6 font-medium text-lifewood-serpent/50 dark:text-white/50">- Lifewood -</p>
          </div>
        </motion.section>
      </div>
    </div>
  );
};
