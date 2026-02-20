import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { LOGO_DARK_URL, LOGO_URL } from '../constants';

interface AboutUsProps {
  theme?: 'light' | 'dark';
  navigateTo?: (page: 'home' | 'services' | 'projects' | 'contact' | 'about') => void;
}

export const AboutUs: React.FC<AboutUsProps> = ({ theme = 'light', navigateTo }) => {
  const accentGlowOpacity = theme === 'dark' ? 'opacity-55' : 'opacity-40';
  const currentLogo = theme === 'dark' ? LOGO_DARK_URL : LOGO_URL;
  const gallerySectionRef = useRef<HTMLDivElement>(null);
  const [visibleGalleryCards, setVisibleGalleryCards] = useState<Record<number, boolean>>({});

  useEffect(() => {
    const cards = gallerySectionRef.current?.querySelectorAll<HTMLElement>('[data-gallery-idx]');
    if (!cards?.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const idx = Number((entry.target as HTMLElement).dataset.galleryIdx);
          if (Number.isNaN(idx)) return;

          setVisibleGalleryCards((prev) => (prev[idx] ? prev : { ...prev, [idx]: true }));
        });
      },
      { threshold: 0.25, rootMargin: '0px 0px -10% 0px' }
    );

    cards.forEach((card) => observer.observe(card));
    return () => observer.disconnect();
  }, []);

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
      cardClass: 'h-[280px] md:h-[420px]'
    },
    {
      src: 'https://framerusercontent.com/images/iCuv1hnq9hAalYZSbiXDKScy31M.jpg?scale-down-to=512&width=2560&height=1707',
      cardClass: 'h-[220px] md:h-[320px]'
    },
    {
      src: 'https://framerusercontent.com/images/cMKEugcBZTYApEhuh47taqgdc8Q.jpg?scale-down-to=512&width=612&height=422',
      cardClass: 'h-[180px] md:h-[250px]'
    }
  ];

  const galleryRightImages = [
    {
      src: 'https://framerusercontent.com/images/VDjJLyomenB1LFHPI6jBfB068.png?scale-down-to=1024&width=2268&height=3402',
      cardClass: 'h-[320px] md:h-[520px]'
    },
    {
      src: 'https://framerusercontent.com/images/KNYITojpSxAW0RVdzBr8gV0gxg.jpg?scale-down-to=512&width=3000&height=3000',
      cardClass: 'h-[250px] md:h-[360px]'
    },
    {
      src: 'https://framerusercontent.com/images/5W3fKf5FwyglyFVBHEXLuqopg.png?scale-down-to=1024&width=1536&height=1024',
      cardClass: 'h-[210px] md:h-[300px]'
    }
  ];

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
        <div ref={gallerySectionRef} className="mb-20 animate-pop-out opacity-0" style={{ animationDelay: '500ms' }}>
          <div className="relative">
            <div className="sticky top-24 z-30 flex justify-center mb-8 md:mb-10">
              <div className="text-center px-6 py-4 rounded-2xl glass border border-white/20">
                <img
                  src={currentLogo}
                  alt="Lifewood"
                  className="h-14 md:h-16 w-auto mx-auto"
                />
                <p className="mt-4 text-xl md:text-3xl font-medium text-lifewood-serpent dark:text-white">
                  Be Amazed
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 pt-12 md:pt-16">
              <div className="space-y-8 md:space-y-12 md:pt-24">
                {galleryLeftImages.map((image, idx) => (
                  <div
                    key={`left-${idx}`}
                    data-gallery-idx={idx * 2}
                    tabIndex={0}
                    className={`group relative rounded-3xl overflow-hidden shadow-xl border border-white/20 ${image.cardClass} transform-gpu transition-all duration-700 ${
                      visibleGalleryCards[idx * 2] ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'
                    } focus-visible:opacity-100 focus-visible:translate-y-0 focus-visible:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lifewood-green/60`}
                  >
                    <img
                      src={image.src}
                      alt={`Lifewood gallery left ${idx + 1}`}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                    />
                  </div>
                ))}
              </div>

              <div className="space-y-8 md:space-y-12 md:pt-12">
                {galleryRightImages.map((image, idx) => (
                  <div
                    key={`right-${idx}`}
                    data-gallery-idx={idx * 2 + 1}
                    tabIndex={0}
                    className={`group relative rounded-3xl overflow-hidden shadow-xl border border-white/20 ${image.cardClass} transform-gpu transition-all duration-700 ${
                      visibleGalleryCards[idx * 2 + 1] ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'
                    } focus-visible:opacity-100 focus-visible:translate-y-0 focus-visible:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lifewood-green/60`}
                  >
                    <img
                      src={image.src}
                      alt={`Lifewood gallery right ${idx + 1}`}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        {/* CTA Section */}
        <div className="p-12 rounded-3xl glass-alt border border-white/20 text-center shadow-2xl relative overflow-hidden animate-pop-out opacity-0" style={{ animationDelay: '600ms' }}>
          <div className="absolute inset-0 bg-gradient-to-br from-lifewood-green/10 via-transparent to-lifewood-saffron/10 pointer-events-none"></div>
          <h3 className="text-3xl md:text-4xl font-heading font-bold text-lifewood-serpent dark:text-white mb-4">
            Ready to Transform Your Data?
          </h3>
          <p className="text-lg text-lifewood-serpent/60 dark:text-white/60 mb-8 max-w-2xl mx-auto">
            Join us on our mission to revolutionize AI through ethical data solutions.
          </p>
          <button 
            onClick={() => navigateTo?.('contact')}
            className="group inline-flex items-center gap-3 px-8 py-4 bg-lifewood-green text-white rounded-full font-bold hover:shadow-xl hover:shadow-lifewood-green/30 transition-all hover:scale-105"
          >
            Contact Us
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};






