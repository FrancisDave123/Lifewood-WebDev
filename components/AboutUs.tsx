import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, Sparkles, X } from 'lucide-react';

interface AboutUsProps {
  theme?: 'light' | 'dark';
  navigateTo?: (page: 'home' | 'services' | 'projects' | 'contact' | 'about') => void;
}

export const AboutUs: React.FC<AboutUsProps> = ({ theme = 'light', navigateTo }) => {
  const ABOUT_US_BE_AMAZED_LOGO_URL = 'https://framerusercontent.com/images/BZSiFYgRc4wDUAuEybhJbZsIBQY.png?width=1519&height=429';
  const accentGlowOpacity = theme === 'dark' ? 'opacity-55' : 'opacity-40';
  const carouselSceneRef = useRef<HTMLDivElement>(null);
  const dragStateRef = useRef({ isDragging: false, startX: 0, startRotation: 0, moved: false });
  const wheelBoostRef = useRef(0);
  const suppressClickRef = useRef(false);
  const [isCarouselHovered, setIsCarouselHovered] = useState(false);
  const [carouselRotation, setCarouselRotation] = useState(0);
  const [activeGalleryImageIndex, setActiveGalleryImageIndex] = useState<number | null>(null);

  const coreValues = [
    {
      letter: 'D',
      title: 'Diversity',
      description: 'We celebrate differences in belief, philosophy and ways of life, because they bring unique perspectives and ideas that encourage everyone to move forward.'
    },
    {
      letter: 'C',
      title: 'Caring',
      description: 'We care for every person deeply and equally, because without care work becomes meaningless.'
    },
    {
      letter: 'I',
      title: 'Innovation',
      description: 'Innovation is at the heart of all we do, enriching our lives and challenging us to continually improve ourselves and our service.'
    },
    {
      letter: 'I',
      title: 'Integrity',
      description: 'We  are dedicated to act ethically and sustainably in everything we do. More than just the bare minimum. It is the basis of our existence as a company.'
    }
  ];

  const galleryLeftImages = [
    {
      src: 'https://framerusercontent.com/images/4hASBG5DwObUZ6HSxm1j5gic.jpeg?scale-down-to=1024&width=853&height=1280',
      cardClass: 'w-[180px] h-[240px] md:w-[230px] md:h-[310px]'
    },
    {
      src: 'https://framerusercontent.com/images/iCuv1hnq9hAalYZSbiXDKScy31M.jpg?scale-down-to=512&width=2560&height=1707',
      cardClass: 'w-[180px] h-[240px] md:w-[230px] md:h-[310px]'
    },
    {
      src: 'https://framerusercontent.com/images/cMKEugcBZTYApEhuh47taqgdc8Q.jpg?scale-down-to=512&width=612&height=422',
      cardClass: 'w-[180px] h-[240px] md:w-[230px] md:h-[310px]'
    }
  ];

  const galleryRightImages = [
    {
      src: 'https://framerusercontent.com/images/VDjJLyomenB1LFHPI6jBfB068.png?scale-down-to=1024&width=2268&height=3402',
      cardClass: 'w-[180px] h-[240px] md:w-[230px] md:h-[310px]'
    },
    {
      src: 'https://framerusercontent.com/images/KNYITojpSxAW0RVdzBr8gV0gxg.jpg?scale-down-to=512&width=3000&height=3000',
      cardClass: 'w-[180px] h-[240px] md:w-[230px] md:h-[310px]'
    },
    {
      src: 'https://framerusercontent.com/images/5W3fKf5FwyglyFVBHEXLuqopg.png?scale-down-to=1024&width=1536&height=1024',
      cardClass: 'w-[180px] h-[240px] md:w-[230px] md:h-[310px]'
    }
  ];
  const beAmazedGalleryImages = [...galleryLeftImages, ...galleryRightImages];
  const carouselImages = beAmazedGalleryImages;
  const carouselCardCount = carouselImages.length;
  const carouselRadius = 280;

  useEffect(() => {
    let frameId = 0;
    const animate = () => {
      if (!dragStateRef.current.isDragging && activeGalleryImageIndex === null) {
        const baseSpeed = isCarouselHovered ? 0 : 0.22;
        const wheelBoost = wheelBoostRef.current;
        if (baseSpeed !== 0 || Math.abs(wheelBoost) > 0.001) {
          setCarouselRotation((prev) => (prev + baseSpeed + wheelBoost) % 360);
        }
      }

      wheelBoostRef.current *= 0.9;
      if (Math.abs(wheelBoostRef.current) < 0.001) wheelBoostRef.current = 0;
      frameId = window.requestAnimationFrame(animate);
    };

    frameId = window.requestAnimationFrame(animate);
    return () => window.cancelAnimationFrame(frameId);
  }, [isCarouselHovered, activeGalleryImageIndex]);

  useEffect(() => {
    if (activeGalleryImageIndex === null) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setActiveGalleryImageIndex(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeGalleryImageIndex]);

  const handleGalleryPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    const scene = carouselSceneRef.current;
    if (!scene) return;
    dragStateRef.current.isDragging = true;
    dragStateRef.current.startX = event.clientX;
    dragStateRef.current.startRotation = carouselRotation;
    dragStateRef.current.moved = false;
    suppressClickRef.current = false;
    scene.setPointerCapture(event.pointerId);
  };

  const handleGalleryPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!dragStateRef.current.isDragging) return;

    const deltaX = event.clientX - dragStateRef.current.startX;
    if (Math.abs(deltaX) > 6) {
      dragStateRef.current.moved = true;
      suppressClickRef.current = true;
    }

    const deltaRotation = deltaX * 0.22;
    const nextRotation = dragStateRef.current.startRotation + deltaRotation;
    setCarouselRotation(((nextRotation % 360) + 360) % 360);
  };

  const handleGalleryPointerEnd = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!dragStateRef.current.isDragging) return;
    dragStateRef.current.isDragging = false;
    if (dragStateRef.current.moved) {
      window.setTimeout(() => {
        suppressClickRef.current = false;
      }, 0);
    }

    dragStateRef.current.moved = false;
    const scene = carouselSceneRef.current;
    if (scene?.hasPointerCapture(event.pointerId)) {
      scene.releasePointerCapture(event.pointerId);
    }
  };

  const handleCarouselWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    if (!isCarouselHovered || dragStateRef.current.isDragging || activeGalleryImageIndex !== null) return;
    const direction = event.deltaY === 0 ? 0 : Math.sign(event.deltaY);
    if (direction === 0) return;

    const intensity = Math.min(Math.abs(event.deltaY), 120);
    const addedBoost = direction * intensity * 0.004;
    const nextBoost = wheelBoostRef.current + addedBoost;
    wheelBoostRef.current = Math.max(-4, Math.min(4, nextBoost));
  };

  return (
    <div className="pt-32 pb-20 relative overflow-x-hidden animate-pop-out opacity-0">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-lifewood-green/10 dark:bg-lifewood-green/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-lifewood-saffron/10 dark:bg-lifewood-saffron/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className={`absolute top-1/4 left-1/2 -translate-x-1/2 w-[36rem] h-[36rem] bg-gradient-to-br from-lifewood-green/10 to-lifewood-saffron/10 rounded-full blur-[140px] ${accentGlowOpacity}`}></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Header Section */}
        <div className="mb-20 animate-pop-out opacity-0" style={{ animationDelay: '100ms' }}>
          <div className="flex items-center gap-4 mb-6">
            <div className="flex gap-2">
              <div className="w-4 h-4 rounded-full bg-lifewood-saffron"></div>
              <div className="w-4 h-4 rounded-full border-2 border-lifewood-serpent dark:border-white"></div>
            </div>
            <div className="w-24 h-px bg-lifewood-serpent/30 dark:bg-white/30 border-dashed border-t"></div>
          </div>

          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full glass border border-lifewood-green/20 mb-6">
            <Sparkles className="w-4 h-4 text-lifewood-green" />
            <span className="text-xs font-black uppercase tracking-[0.24em] text-lifewood-serpent/70 dark:text-white/70">
              About Lifewood
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-heading font-black mb-10 tracking-tight text-lifewood-serpent dark:text-white uppercase">
            About our company
          </h1>

          <p className="text-lg md:text-xl text-lifewood-serpent/60 dark:text-white/60 leading-relaxed mb-10 max-w-4xl font-medium">
            While we are motivated by business and economic objectives, we remain committed to our core business beliefs that shape our corporate and individual behaviour around the world.
          </p>
        </div>

        {/* Images Grid Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20 animate-pop-out opacity-0" style={{ animationDelay: '200ms' }}>
          <div className="relative rounded-3xl overflow-hidden h-64 md:h-80 shadow-xl group border border-white/20">
            <img
              src="https://framerusercontent.com/images/sTK6sybbKO4rqkc70E4AtawoRc.jpg?width=2560&height=1440"
              alt="Team collaboration"
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-white/5"></div>
            <div className="absolute -top-20 -right-12 w-48 h-48 rounded-full bg-white/30 blur-2xl opacity-60"></div>
          </div>

          <div className="relative rounded-3xl overflow-hidden h-64 md:h-80 shadow-xl group border border-white/20">
            <img
              src="https://framerusercontent.com/images/pi5OJpoXVOCoeElqYLWoXIdGn1U.png?scale-down-to=1024&width=946&height=1180"
              alt="Team working together"
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-white/5"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center glass px-6 py-4 rounded-2xl border border-white/20 backdrop-blur-xl">
                <p className="text-white font-bold text-lg">Let's collaborate</p>
              </div>
            </div>
          </div>
        </div>

        {/* Core Values Section */}
        <div className="mb-20 animate-pop-out opacity-0" style={{ animationDelay: '300ms' }}>
          <h2 className="text-4xl md:text-5xl font-heading font-black mb-16 text-lifewood-serpent dark:text-white">
            <span className="text-lifewood-saffron">CORE</span> <span>VALUE</span>
          </h2>

          <p className="text-lg md:text-xl text-lifewood-serpent/60 dark:text-white/60 leading-relaxed mb-12 max-w-3xl font-medium">
            At Lifewood we empower our company and our clients to realise the transformative power of Al: Bringing big data to life, launching new ways of thinking, innovating, learning, and doing.
          </p>

          {/* Values Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {coreValues.map((value, idx) => (
              <div
                key={idx}
                className="group relative"
              >
                <div className="relative bg-lifewood-serpent/95 dark:bg-lifewood-green/90 h-full rounded-2xl p-8 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 min-h-[19rem] border border-white/10 overflow-hidden">
                  <div className="absolute -top-16 -right-10 w-32 h-32 rounded-full bg-white/15 blur-2xl group-hover:scale-125 transition-transform duration-700"></div>
                  <div className="relative z-10 h-full flex flex-col">
                    <div className="flex-1 flex flex-col justify-center transition-transform duration-300 group-hover:-translate-y-5">
                      <div className="text-6xl md:text-7xl font-black text-white/20 mb-4">
                        {value.letter}
                      </div>
                      <h3 className="text-2xl font-bold text-white">
                        {value.title}
                      </h3>
                    </div>
                    <div className="w-full overflow-hidden max-h-0 opacity-0 translate-y-2 group-hover:max-h-40 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                      <p className="text-white/80 text-sm leading-relaxed pt-3 border-t border-white/20">
                        {value.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mission & Vision Section */}
        <div className="mb-20 animate-pop-out opacity-0" style={{ animationDelay: '400ms' }}>
          <h2 className="text-4xl md:text-5xl font-heading font-black mb-16 text-center text-lifewood-serpent dark:text-white">
            What drives us today, and what inspires us for tomorrow
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Mission */}
            <div className="relative">
              <div className="relative rounded-3xl overflow-hidden h-80 shadow-xl mb-6 group">
                <img
                  src="https://framerusercontent.com/images/pqtsyQSdo9BC1b4HN1mpIHnwAA.png?scale-down-to=2048&width=2780&height=1552"
                  alt="Our mission"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>

              <div className="glass-alt rounded-2xl p-8 border border-white/20 mt-6 shadow-xl">
                <h3 className="text-2xl font-bold text-lifewood-serpent dark:text-white mb-4">
                  Our Mission
                </h3>
                <p className="text-lifewood-serpent/70 dark:text-white/70 leading-relaxed">
                 To develop and deploy cutting edge Al technologies that solve real-world problems, empower communities, and advance sustainable practices. We are committed to fostering a culture of innovation, collaborating with stakeholders across sectors, and making a meaningful impact on society and the environment.
                </p>
              </div>
            </div>

            {/* Vision */}
            <div>
              <div className="glass-alt rounded-2xl p-8 border border-white/20 mb-6 shadow-xl">
                <h3 className="text-2xl font-bold text-lifewood-serpent dark:text-white mb-4">
                  Vision
                </h3>
                <p className="text-lifewood-serpent/70 dark:text-white/70 leading-relaxed">
                  To be the global champion in Al data solutions, igniting a culture of innovation and sustainability that enriches lives and transforms communities worldwide.
                </p>
              </div>

              <div className="relative rounded-3xl overflow-hidden h-80 shadow-xl group">
                <img
                  src="https://framerusercontent.com/images/bkXSwutgFfDhSf6t2tQyzrIppzM.jpg?width=1200&height=1200"
                  alt="Our vision"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
            </div>
          </div>
        </div>
        {/* Project Showcase */}
        <div className="mb-20 animate-pop-out opacity-0" style={{ animationDelay: '500ms' }}>
          <div className="relative">
            <div className="sticky top-24 z-30 flex justify-center mb-8 md:mb-10">
              <div className="text-center px-6 py-4 rounded-2xl glass border border-white/20">
                <img
                  src={ABOUT_US_BE_AMAZED_LOGO_URL}
                  alt="Lifewood"
                  className="h-14 md:h-16 w-auto mx-auto"
                />
                <p className="mt-4 text-xl md:text-3xl font-medium text-lifewood-serpent dark:text-white">
                  Be Amazed
                </p>
              </div>
            </div>

            <div className="relative pt-8 md:pt-12">
              <div
                ref={carouselSceneRef}
                className="relative mx-auto h-[560px] md:h-[700px] max-w-6xl rounded-[2.5rem] border border-white/20 glass-alt overflow-hidden cursor-grab active:cursor-grabbing select-none [perspective:1400px]"
                onMouseEnter={() => setIsCarouselHovered(true)}
                onMouseLeave={() => setIsCarouselHovered(false)}
                onPointerDown={handleGalleryPointerDown}
                onPointerMove={handleGalleryPointerMove}
                onPointerUp={handleGalleryPointerEnd}
                onPointerCancel={handleGalleryPointerEnd}
                onWheel={handleCarouselWheel}
              >
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(4,98,65,0.18),transparent_58%)]"></div>
                <div className="absolute inset-0 [transform-style:preserve-3d]" style={{ transform: `rotateY(${carouselRotation}deg)` }}>
                  {carouselImages.map((image, idx) => {
                    const angle = idx * (360 / carouselCardCount);
                    const absoluteAngle = angle + carouselRotation;
                    const frontDepth = (Math.cos((absoluteAngle * Math.PI) / 180) + 1) / 2;
                    const zIndex = 100 + Math.round(frontDepth * 250);

                    return (
                      <button
                        type="button"
                        key={`carousel-image-${idx}`}
                        className={`group absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-[1.9rem] overflow-hidden border border-white/25 shadow-[0_20px_55px_-18px_rgba(0,0,0,0.5)] ${image.cardClass} transition-[box-shadow,opacity,filter] duration-500 hover:shadow-[0_35px_75px_-20px_rgba(4,98,65,0.55)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lifewood-green/70`}
                        style={{
                          transform: `translate(-50%, -50%) rotateX(-8deg) rotateY(${angle}deg) translateZ(${carouselRadius}px)`,
                          zIndex,
                          opacity: 0.22 + frontDepth * 0.86,
                          filter: `saturate(${0.65 + frontDepth * 0.55})`,
                          pointerEvents: frontDepth > 0.16 ? 'auto' : 'none',
                        }}
                        onClick={() => {
                          if (suppressClickRef.current) return;
                          setActiveGalleryImageIndex(idx);
                        }}
                      >
                        <img
                          src={image.src}
                          alt={`Lifewood gallery image ${idx + 1}`}
                          className="w-full h-full object-cover pointer-events-none transition-transform duration-700 group-hover:scale-[1.08]"
                          draggable={false}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent opacity-80 pointer-events-none"></div>
                      </button>
                    );
                  })}
                </div>

                <div className="pointer-events-none absolute bottom-5 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full text-xs md:text-sm uppercase tracking-[0.18em] font-semibold text-lifewood-serpent/70 dark:text-white/80 bg-white/45 dark:bg-black/30 border border-white/30 backdrop-blur-lg">
                  <span className="inline-block [animation:bounce_1.3s_infinite,pulse_2.2s_cubic-bezier(0.4,0,0.6,1)_infinite]">
                    DRAG TO ROTATE
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {activeGalleryImageIndex !== null && (
          <div
            className="fixed inset-0 z-[120] bg-black/85 backdrop-blur-md px-4 py-8 md:p-10 flex items-center justify-center"
            onClick={() => setActiveGalleryImageIndex(null)}
          >
            <button
              type="button"
              className="absolute top-5 right-5 md:top-8 md:right-8 w-11 h-11 rounded-full bg-white/15 hover:bg-white/25 border border-white/25 text-white flex items-center justify-center transition-colors"
              onClick={() => setActiveGalleryImageIndex(null)}
              aria-label="Close gallery preview"
            >
              <X className="w-5 h-5" />
            </button>

            <img
              src={beAmazedGalleryImages[activeGalleryImageIndex].src}
              alt={`Lifewood gallery preview ${activeGalleryImageIndex + 1}`}
              className="max-h-[86vh] w-auto max-w-[92vw] object-contain rounded-3xl border border-white/20 shadow-[0_30px_100px_-20px_rgba(0,0,0,0.7)]"
              onClick={(event) => event.stopPropagation()}
            />
          </div>
        )}
        {/* CTA Section */}
        <div className="p-12 rounded-3xl glass-alt border border-white/20 text-center shadow-2xl relative overflow-hidden animate-pop-out opacity-0" style={{ animationDelay: '600ms' }}>
          <div className="absolute inset-0 bg-gradient-to-br from-lifewood-green/10 via-transparent to-lifewood-saffron/10 pointer-events-none"></div>
          <h3 className="text-3xl md:text-4xl font-heading font-bold text-lifewood-serpent dark:text-white mb-4">
            Ready to Transform Your Data?
          </h3>
          <p className="text-lg text-lifewood-serpent/60 dark:text-white/60 mb-8 max-w-2xl mx-auto">
            Join us on our mission to revolutionize AI through ethical data solutions.
          </p>
          <div className="flex justify-center">
            <button 
              onClick={() => navigateTo?.('contact')}
              className="group relative px-8 py-4 bg-lifewood-serpent dark:bg-lifewood-seaSalt text-white dark:text-lifewood-serpent rounded-full font-bold text-base flex items-center gap-3 transition-all hover:scale-105 active:scale-95 shadow-[0_15px_40px_rgba(19,48,32,0.15)] dark:shadow-[0_15px_40px_rgba(0,0,0,0.3)]"
            >
              Contact Us
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform duration-300" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};






