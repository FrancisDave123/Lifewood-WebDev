import React, { useRef, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import type { PageRoute } from '../routes/routeTypes';
import { PageHeroHeader } from './PageHeroHeader';

interface PhilanthropyImpactProps {
  navigateTo?: (page: PageRoute) => void;
}

const impactHighlights = [
  {
    title: 'Education Access',
    description:
      'We support programs that widen access to learning, digital literacy, and practical skills development in communities with limited resources.'
  },
  {
    title: 'Sustainable Livelihoods',
    description:
      'Our work is designed to create durable income opportunities through training, fair participation, and pathways into long-term employment.'
  },
  {
    title: 'Local Capacity Building',
    description:
      'We help communities strengthen local leadership, operational capability, and delivery models that can continue growing over time.'
  }
];

interface MagnetCardProps {
  title: string;
  description: string;
}

interface LanyardImageProps {
  src: string;
  alt: string;
  strapTint: string;
  overlayClassName: string;
}

const MagnetCard: React.FC<MagnetCardProps> = ({ title, description }) => {
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    const centerX = bounds.left + bounds.width / 2;
    const centerY = bounds.top + bounds.height / 2;
    const offsetX = (event.clientX - centerX) / 14;
    const offsetY = (event.clientY - centerY) / 14;

    setOffset({
      x: Math.max(-10, Math.min(10, offsetX)),
      y: Math.max(-10, Math.min(10, offsetY))
    });
  };

  const resetOffset = () => setOffset({ x: 0, y: 0 });

  return (
    <div
      className="h-full min-h-[15rem] rounded-[1.75rem] border border-white/30 bg-white/60 dark:bg-white/5 p-6 shadow-lg backdrop-blur-md transition-shadow duration-500 hover:shadow-xl"
      onMouseMove={handleMouseMove}
      onMouseLeave={resetOffset}
    >
      <div
        className="flex h-full flex-col rounded-[1.35rem] transition-transform duration-300 ease-out will-change-transform"
        style={{ transform: `translate3d(${offset.x}px, ${offset.y}px, 0)` }}
      >
        <p className="text-[10px] font-black uppercase tracking-[0.32em] text-lifewood-green mb-3">
          Focus Area
        </p>
        <h4 className="text-xl font-heading font-semibold text-lifewood-serpent dark:text-white mb-3">
          {title}
        </h4>
        <p className="text-sm md:text-base leading-relaxed text-lifewood-serpent/65 dark:text-white/65">
          {description}
        </p>
      </div>
    </div>
  );
};

const LanyardImage: React.FC<LanyardImageProps> = ({ src, alt, strapTint, overlayClassName }) => {
  const [swing, setSwing] = useState({ rotate: 0, x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (isDragging) return;

    const bounds = event.currentTarget.getBoundingClientRect();
    const px = (event.clientX - bounds.left) / bounds.width - 0.5;
    const py = (event.clientY - bounds.top) / bounds.height - 0.5;

    setSwing({
      rotate: Math.max(-7, Math.min(7, px * 14)),
      x: Math.max(-8, Math.min(8, px * 16)),
      y: Math.max(-4, Math.min(10, py * 14))
    });
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    dragStartRef.current = { x: event.clientX, y: event.clientY };
    setIsDragging(true);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;

    const deltaX = event.clientX - dragStartRef.current.x;
    const deltaY = event.clientY - dragStartRef.current.y;

    setSwing({
      rotate: Math.max(-16, Math.min(16, deltaX * -0.18)),
      x: Math.max(-28, Math.min(28, deltaX * -0.45)),
      y: Math.max(-6, Math.min(26, deltaY * 0.4))
    });
  };

  const resetSwing = () => {
    setIsDragging(false);
    setSwing({ rotate: 0, x: 0, y: 0 });
  };

  return (
    <div className="relative flex justify-center pt-10 md:pt-12">
      <div className="absolute top-0 left-1/2 z-20 h-4 w-4 -translate-x-1/2 rounded-full border border-white/60 bg-lifewood-seaSalt shadow-[0_6px_18px_rgba(0,0,0,0.12)] dark:bg-[#d7dfdb]" />
      <div
        className={`absolute top-3 left-1/2 z-10 h-12 md:h-14 w-[3px] -translate-x-1/2 rounded-full bg-gradient-to-b ${strapTint} shadow-[0_6px_18px_rgba(0,0,0,0.12)]`}
      />
      <div
        className={`relative w-full max-w-[24rem] origin-top will-change-transform ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
        style={{
          transform: `translate3d(${swing.x}px, ${swing.y}px, 0) rotate(${swing.rotate}deg)`,
          transition: isDragging ? 'none' : 'transform 420ms cubic-bezier(0.22, 1, 0.36, 1)'
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={resetSwing}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={resetSwing}
        onPointerCancel={resetSwing}
      >
        <div className="absolute inset-x-[12%] -top-3 z-20 h-6 rounded-full border border-white/40 bg-white/65 shadow-[0_12px_24px_rgba(0,0,0,0.08)] backdrop-blur-sm dark:bg-white/10" />
        <div className="relative overflow-hidden rounded-[1.6rem] border border-white/35 bg-white/70 p-3 shadow-[0_24px_50px_-24px_rgba(0,0,0,0.35)] backdrop-blur-md">
          <div className="relative overflow-hidden rounded-[1.15rem]">
            <img
              src={src}
              alt={alt}
              className="w-full h-[220px] md:h-[280px] object-cover transition-transform duration-500 ease-out hover:scale-[1.03]"
              draggable={false}
            />
            <div className={overlayClassName}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const PhilanthropyImpact: React.FC<PhilanthropyImpactProps> = ({ navigateTo }) => {
  const frameUrl = 'https://lifewoodworldwidemap.vercel.app/';

  return (
    <section id="impact" className="py-16 md:py-20 relative overflow-x-hidden bg-lifewood-seaSalt dark:bg-[#020804] animate-pop-out opacity-0">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -left-24 w-72 h-72 rounded-full bg-lifewood-green/10 blur-[110px] animate-float-slow"></div>
        <div className="absolute top-[35%] -right-24 w-80 h-80 rounded-full bg-lifewood-saffron/10 blur-[120px] animate-float" style={{ animationDelay: '1.2s' }}></div>
      </div>
      <div className="container mx-auto px-6">
        <div className="w-full">
          <div className="mb-20 animate-pop-out opacity-0" style={{ animationDelay: '100ms' }}>
            <PageHeroHeader
              id="philanthropy-impact-page-title"
              eyebrow="Giving back"
              title="Philanthropy and Impact"
              description="We direct resources into education and developmental projects that create lasting change. Our approach goes beyond giving: it builds sustainable growth and empowers communities for the future."
              cta={
                <button
                  onClick={() => navigateTo?.('contact-us')}
                  className="group inline-flex items-center gap-3 rounded-full bg-lifewood-green px-8 py-3 text-sm font-bold text-white shadow-[0_10px_30px_rgba(4,98,65,0.25)] transition-transform hover:scale-105"
                >
                  Contact Us
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              }
            />
          </div>

        </div>
      </div>

      <div className="relative w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] h-[76vh] md:h-[88vh] animate-pop-out opacity-0" style={{ animationDelay: '220ms' }}>
        <div className="sticky top-24 z-10 h-[62vh] md:h-[74vh] overflow-hidden group transition-all duration-700">
          <img
            src="https://framerusercontent.com/images/7RZ9ESz7UTTmxn6ifh8I9jHlHA.png?width=1004&height=591"
            alt="Philanthropy hero"
            className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-[2200ms]"
          />

          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent group-hover:from-black/15 transition-colors duration-700"></div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6">
        <div className="max-w-7xl mx-auto relative z-20 -mt-4 md:-mt-6 bg-lifewood-seaSalt/92 dark:bg-[#020804]/92 backdrop-blur-xl pt-7 md:pt-8 rounded-t-[2rem] animate-pop-out opacity-0" style={{ animationDelay: '340ms' }}>
          <div className="text-center mb-10">
            <div className="w-2 h-2 rounded-full bg-black dark:bg-white mx-auto mb-8"></div>
            <p className="text-2xl md:text-3xl font-heading font-medium text-lifewood-serpent dark:text-white leading-tight max-w-5xl mx-auto">
              Our vision is of a world where financial investment plays a central role in solving the social and environmental challenges facing the global community, specifically in Africa and the Indian sub-continent
            </p>
            <button
              onClick={() => navigateTo?.('about-us')}
              className="mt-7 group px-6 py-3 bg-lifewood-green text-white rounded-full text-sm font-bold inline-flex items-center gap-2 hover:scale-105 hover:shadow-[0_15px_35px_rgba(4,98,65,0.3)] transition-all"
            >
              Know Us Better
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="mb-8 flex items-center justify-between gap-4">
            <h3 className="text-3xl md:text-5xl font-heading font-bold leading-[0.95] text-lifewood-serpent dark:text-white">
              Transforming Communities
              <br />
              Worldwide
            </h3>

            <div className="hidden md:flex relative w-40 h-40 items-center justify-center">
              <div className="absolute inset-0 rounded-full border border-dashed border-lifewood-serpent/20 dark:border-white/20"></div>
              <div className="w-8 h-8 rounded-full bg-lifewood-saffron"></div>
              <div className="absolute inset-0 animate-spin-slow" style={{ animationDuration: '20s' }}>
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <defs>
                    <path id="impactCirclePath" d="M 50, 50 m -38, 0 a 38,38 0 1,1 76,0 a 38,38 0 1,1 -76,0" />
                  </defs>
                  <text className="text-[8px] font-bold fill-lifewood-serpent/80 dark:fill-white/80">
                    <textPath xlinkHref="#impactCirclePath" textLength="238" lengthAdjust="spacing">
                      amazed . be . amazed . be .
                    </textPath>
                  </text>
                </svg>
              </div>
            </div>
          </div>

          <div className="rounded-2xl overflow-hidden shadow-xl border border-[#9bc4d6] h-[340px] md:h-[430px] bg-[#9dc8d8] mb-10 hover:-translate-y-1 hover:shadow-2xl transition-all duration-500 animate-pop-out opacity-0" style={{ animationDelay: '420ms' }}>
            <iframe
              title="Lifewood Worldwide Map"
              src={frameUrl}
              className="w-full h-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer"
              sandbox="allow-same-origin allow-scripts allow-downloads allow-forms allow-modals allow-orientation-lock allow-pointer-lock allow-popups allow-popups-to-escape-sandbox allow-presentation allow-storage-access-by-user-activation allow-top-navigation-by-user-activation"
            />
          </div>

          <div className="mb-10 text-center max-w-4xl mx-auto px-4">
            <p className="text-[10px] font-black uppercase tracking-[0.35em] text-lifewood-serpent/45 dark:text-white/45 mb-3">
              Impact
            </p>
            <p className="text-lg md:text-2xl font-heading font-medium leading-relaxed text-lifewood-serpent dark:text-white">
              Through purposeful partnerships and sustainable investment, we empower communities across Africa and the Indian sub-continent to create lasting economic and social transformation.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-3 md:auto-rows-fr mb-10 animate-pop-out opacity-0" style={{ animationDelay: '470ms' }}>
            {impactHighlights.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 24, scale: 0.98 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.55, delay: index * 0.06 }}
                viewport={{ once: true, amount: 0.35 }}
                className="h-full transition-all duration-500 hover:-translate-y-1"
              >
                <MagnetCard title={item.title} description={item.description} />
              </motion.div>
            ))}
          </div>

          <div className="relative pb-12 md:pb-16 animate-pop-out opacity-0 overflow-hidden rounded-[2rem]" style={{ animationDelay: '520ms' }}>
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute -top-20 -left-16 w-56 h-56 rounded-full bg-lifewood-green/10 blur-[80px] animate-float-slow"></div>
              <div className="absolute top-1/3 -right-20 w-64 h-64 rounded-full bg-lifewood-saffron/10 blur-[100px] animate-float" style={{ animationDelay: '1.1s' }}></div>
              <div
                className="absolute inset-0 opacity-[0.06] dark:opacity-[0.12]"
                style={{ backgroundImage: 'radial-gradient(#046241 1px, transparent 1px)', backgroundSize: '20px 20px' }}
              ></div>
            </div>

            <motion.article
              initial={{ opacity: 0, y: 24, scale: 0.99 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true, amount: 0.25 }}
              className="group relative z-10 rounded-3xl border border-white/30 glass p-6 md:p-10 shadow-xl bg-lifewood-seaSalt/90 dark:bg-[#020804]/90 backdrop-blur-xl hover:-translate-y-1 hover:shadow-2xl hover:ring-1 hover:ring-lifewood-green/30 transition-all duration-500"
            >
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/10 via-transparent to-lifewood-green/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <h4 className="text-2xl md:text-3xl font-heading font-semibold text-lifewood-serpent dark:text-white mb-5">Partnership</h4>
                  <p className="text-base md:text-lg text-lifewood-serpent/60 dark:text-white/60 leading-relaxed">
                    In partnership with our philanthropic partners, Lifewood has expanded operations in South Africa, Nigeria, Republic of the Congo, Democratic Republic of the Congo, Ghana, Madagascar, Benin, Uganda, Kenya, Ivory Coast, Egypt, Ethiopia, Niger, Tanzania, Tunisia, Zambia, Zimbabwe, Togo, Cameroon and many others.
                  </p>
                  <p className="mt-4 text-sm md:text-base text-lifewood-serpent/60 dark:text-white/60 leading-relaxed">
                    These partnerships help us move beyond one-time support by connecting investment with delivery capacity, local employment, and region-specific development priorities.
                  </p>
                </div>
                <LanyardImage
                  src="https://framerusercontent.com/images/H6g74f7ON0rYqleh3DuDC7wLLn4.png?width=1004&height=591"
                  alt="Partnership"
                  strapTint="from-lifewood-green/75 via-lifewood-green/45 to-white/70"
                  overlayClassName="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent pointer-events-none"
                />
              </div>
            </motion.article>

            <motion.article
              initial={{ opacity: 0, y: 24, scale: 0.99 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.08 }}
              viewport={{ once: true, amount: 0.25 }}
              className="group relative z-20 mt-6 rounded-3xl border border-white/30 glass p-6 md:p-10 shadow-xl bg-lifewood-seaSalt/92 dark:bg-[#020804]/92 backdrop-blur-xl hover:-translate-y-1 hover:shadow-2xl hover:ring-1 hover:ring-lifewood-green/30 transition-all duration-500"
            >
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/10 via-transparent to-lifewood-saffron/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <LanyardImage
                  src="https://framerusercontent.com/images/06PBWoX2dQvZzJ4GCFpMLVH9ZA.jpg?scale-down-to=1024&width=3458&height=5187"
                  alt="Application"
                  strapTint="from-lifewood-saffron/80 via-lifewood-saffron/45 to-white/70"
                  overlayClassName="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"
                />
                <div className="text-left md:text-right">
                  <h4 className="text-2xl md:text-3xl font-heading font-semibold text-lifewood-serpent dark:text-white mb-5">
                    Application
                  </h4>
                  <p className="text-base md:text-lg text-lifewood-serpent/60 dark:text-white/60 leading-relaxed">
                    This requires the application of our methods and experience for the development of people in under resourced economies.
                  </p>
                  <p className="mt-4 text-sm md:text-base text-lifewood-serpent/60 dark:text-white/60 leading-relaxed">
                    We adapt our operating model to local conditions so programs can strengthen skills, improve participation, and turn capability-building into measurable community benefit.
                  </p>
                </div>
              </div>
            </motion.article>

            <motion.article
              initial={{ opacity: 0, y: 24, scale: 0.99 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              viewport={{ once: true, amount: 0.25 }}
              className="group relative z-30 mt-6 rounded-3xl border border-white/30 glass p-6 md:p-10 shadow-xl bg-lifewood-seaSalt/94 dark:bg-[#020804]/94 backdrop-blur-xl hover:-translate-y-1 hover:shadow-2xl hover:ring-1 hover:ring-lifewood-green/30 transition-all duration-500"
            >
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/10 via-transparent to-lifewood-green/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <h4 className="text-2xl md:text-3xl font-heading font-semibold text-lifewood-serpent dark:text-white mb-5">
                    Expanding
                  </h4>
                  <p className="text-base md:text-lg text-lifewood-serpent/60 dark:text-white/60 leading-relaxed">
                    We are expanding access to training, establishing equiatable wage structures and career and leadership progression to create sustainable change, by equipping individuals to take the lead and grow the business for themselves for the long term benefit of everyone.
                  </p>
                  <p className="mt-4 text-sm md:text-base text-lifewood-serpent/60 dark:text-white/60 leading-relaxed">
                    The goal is long-term resilience: stronger teams, more inclusive economic participation, and leadership pathways that allow communities to sustain growth from within.
                  </p>
                </div>
                <LanyardImage
                  src="https://framerusercontent.com/images/YuQdLXDoPq70vyVGWddKObRr4.png?width=599&height=394"
                  alt="Expanding"
                  strapTint="from-lifewood-green/80 via-lifewood-serpent/45 to-white/70"
                  overlayClassName="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"
                />
              </div>
            </motion.article>
          </div>

          <div className="text-center pt-6 pb-2">
            <p className="text-2xl md:text-3xl font-heading font-medium text-lifewood-serpent dark:text-white leading-tight">
              Working with new
              <br />
              intelligence for a better world.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
