import React from 'react';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export const PhilanthropyImpact: React.FC = () => {
  const frameUrl = 'https://lifewoodworldwidemap.vercel.app/';

  const scrollToContact = () => {
    const el = document.getElementById('contact');
    if (!el) return;
    const offset = 80;
    const elementPosition = el.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - offset;
    window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
  };

  return (
    <section id="impact" className="py-16 md:py-20 relative overflow-x-hidden bg-lifewood-seaSalt dark:bg-[#020804] animate-pop-out opacity-0">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -left-24 w-72 h-72 rounded-full bg-lifewood-green/10 blur-[110px] animate-float-slow"></div>
        <div className="absolute top-[35%] -right-24 w-80 h-80 rounded-full bg-lifewood-saffron/10 blur-[120px] animate-float" style={{ animationDelay: '1.2s' }}></div>
      </div>
      <div className="container mx-auto px-6">
        <div className="w-full">
          <div className="mb-20 max-w-4xl animate-pop-out opacity-0" style={{ animationDelay: '100ms' }}>
            <div className="flex items-center gap-4 mb-6">
              <div className="flex gap-2">
                <div className="w-4 h-4 rounded-full bg-lifewood-saffron"></div>
                <div className="w-4 h-4 rounded-full border-2 border-lifewood-serpent dark:border-white"></div>
              </div>
              <div className="w-24 h-px bg-lifewood-serpent/30 dark:bg-white/30 border-dashed border-t"></div>
            </div>

            <h2 className="text-6xl md:text-7xl font-heading font-black mb-10 tracking-tight text-lifewood-serpent dark:text-white uppercase">
              Philanthropy and Impact
            </h2> 

            <p className="text-lg md:text-xl text-lifewood-serpent/60 dark:text-white/60 leading-relaxed mb-10 max-w-3xl font-medium">
              We direct resources into education and developmental projects that create lasting change. Our approach goes beyond giving:
              it builds sustainable growth and empowers communities for the future.
            </p>

            <button
              onClick={scrollToContact}
              className="group relative px-8 py-3 bg-lifewood-green text-white rounded-full font-bold text-sm inline-flex items-center gap-3 transition-all hover:scale-105 active:scale-95 shadow-[0_10px_30px_rgba(4,98,65,0.25)]"
            >
              Contact Us
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
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
              onClick={scrollToContact}
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

          <div className="border-t border-lifewood-serpent/15 dark:border-white/15 pt-10 pb-4">
            <div className="flex items-center gap-3 text-lifewood-serpent/65 dark:text-white/65 text-lg">
              <span className="w-10 h-px bg-lifewood-serpent/30 dark:bg-white/30"></span>
              Impact
            </div>
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
                </div>
                <div className="relative overflow-hidden rounded-xl">
                  <img
                    src="https://framerusercontent.com/images/H6g74f7ON0rYqleh3DuDC7wLLn4.png?width=1004&height=591"
                    alt="Partnership"
                    className="w-full h-[220px] md:h-[280px] object-cover group-hover:scale-[1.06] transition-transform duration-[1800ms]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent"></div>
                </div>
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
                <div className="relative overflow-hidden rounded-xl">
                  <img
                    src="https://framerusercontent.com/images/06PBWoX2dQvZzJ4GCFpMLVH9ZA.jpg?scale-down-to=1024&width=3458&height=5187"
                    alt="Application"
                    className="w-full h-[220px] md:h-[280px] object-cover group-hover:scale-[1.06] transition-transform duration-[1800ms]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                </div>
                <div className="text-left md:text-right">
                  <h4 className="text-2xl md:text-3xl font-heading font-semibold text-lifewood-serpent dark:text-white mb-5">
                    Application
                  </h4>
                  <p className="text-base md:text-lg text-lifewood-serpent/60 dark:text-white/60 leading-relaxed">
                    This requires the application of our methods and experience for the development of people in under resourced economies.
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
                </div>
                <div className="relative overflow-hidden rounded-xl">
                  <img
                    src="https://framerusercontent.com/images/YuQdLXDoPq70vyVGWddKObRr4.png?width=599&height=394"
                    alt="Expanding"
                    className="w-full h-[220px] md:h-[280px] object-cover group-hover:scale-[1.06] transition-transform duration-[1800ms]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                </div>
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
