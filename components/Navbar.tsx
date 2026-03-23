import React, { useState, useEffect } from 'react';
import { NAV_ITEMS } from '../constants';
import { Menu, X, ChevronDown, Sparkles, Layers, Database, Mic, Car } from 'lucide-react';
import type { PageRoute } from '../routes/routeTypes';

interface NavbarProps {
  navigateTo: (page: PageRoute) => void;
  currentPage: PageRoute;
  isAdminAuthenticated: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ navigateTo, currentPage, isAdminAuthenticated }) => {
  const NAVBAR_LOGO_URL = 'https://framerusercontent.com/images/BZSiFYgRc4wDUAuEybhJbZsIBQY.png?width=1519&height=429';
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const logoSizeClass = 'h-6 md:h-8';

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navRouteMap: Record<string, PageRoute[]> = {
    Home: ['home'],
    'AI Initiatives': ['ai-services', 'ai-projects'],
    'Our Company': ['about-us', 'offices'],
    'What We Offer': [
      'type-a-data-servicing',
      'type-b-horizontal-llm-data',
      'type-c-vertical-llm-data',
      'type-d-aigc'
    ],
    'Philanthropy & Impact': ['philanthropy-impact'],
    Careers: ['careers', 'join-us', 'join-us-as', 'join-us-as-employee', 'join-us-as-intern'],
    'Contact Us': ['contact-us'],
    'Internal News': ['internal-news']
  };

  const subItemRouteMap: Record<string, PageRoute> = {
    '#services': 'ai-services',
    '#project': 'ai-projects',
    '#about': 'about-us',
    '#offices': 'offices',
    '#type-a-data-servicing': 'type-a-data-servicing',
    '#type-b-horizontal-llm-data': 'type-b-horizontal-llm-data',
    '#type-c-vertical-llm-data': 'type-c-vertical-llm-data',
    '#type-d-aigc': 'type-d-aigc'
  };

  const isItemActive = (label: string) => (navRouteMap[label] || []).includes(currentPage);
  const isSubItemActive = (href: string) => subItemRouteMap[href] === currentPage;

  const scrollToSection = (targetId: string) => {
    if (targetId === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const el = document.getElementById(targetId);
    if (el) {
      const offset = 80;
      const elementPosition = el.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  };

  const spawnParticles = (element: HTMLElement) => {
    const rect = element.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    element.style.position = 'relative';

    const particleCount = 14;
    const colors = ['#046241', '#0f5132', '#f0b347', '#ffffff'];
    const particleHost = document.createElement('span');
    particleHost.className = 'nav-particles';
    particleHost.style.left = `${centerX}px`;
    particleHost.style.top = `${centerY}px`;
    element.appendChild(particleHost);

    for (let index = 0; index < particleCount; index++) {
      const angle = (Math.PI * 2 * index) / particleCount + (Math.random() * 0.35 - 0.175);
      const distance = 14 + Math.random() * 20;
      const particle = document.createElement('span');
      const point = document.createElement('span');

      particle.className = 'nav-particle';
      point.className = 'nav-point';

      particle.style.setProperty('--dx', `${Math.cos(angle) * distance}px`);
      particle.style.setProperty('--dy', `${Math.sin(angle) * distance}px`);
      particle.style.setProperty('--time', `${520 + Math.random() * 320}ms`);
      particle.style.setProperty('--color', colors[Math.floor(Math.random() * colors.length)] || '#046241');
      particle.style.setProperty('--scale', `${0.85 + Math.random() * 0.55}`);
      particle.appendChild(point);
      particleHost.appendChild(particle);

      window.setTimeout(() => {
        particle.remove();
      }, 1000);
    }

    window.setTimeout(() => {
      particleHost.remove();
    }, 1100);
  };

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, item: any) => {
    e.preventDefault();

    if (item.subItems && !e.currentTarget.dataset.isSub) {
      return;
    }

    const href = item.href;
    const targetId = href.replace('#', '');

    if (targetId === 'home') {
      if (currentPage === 'home') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        navigateTo('home');
        setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 50);
      }
      setMobileMenuOpen(false);
      return;
    }

    if (targetId === 'services') {
      navigateTo('ai-services');
      setMobileMenuOpen(false);
      return;
    }

    if (targetId === 'project') {
      navigateTo('ai-projects');
      setMobileMenuOpen(false);
      return;
    }

    if (targetId === 'contact') {
      navigateTo('contact-us');
      setMobileMenuOpen(false);
      return;
    }

    if (targetId === 'about') {
      navigateTo('about-us');
      setMobileMenuOpen(false);
      return;
    }

    if (targetId === 'offices') {
      navigateTo('offices');
      setMobileMenuOpen(false);
      return;
    }

    if (targetId === 'impact') {
      navigateTo('philanthropy-impact');
      setMobileMenuOpen(false);
      return;
    }

    if (targetId === 'careers') {
      navigateTo('careers');
      setMobileMenuOpen(false);
      return;
    }

    if (targetId === 'news') {
      navigateTo('internal-news');
      setMobileMenuOpen(false);
      return;
    }

    if (targetId === 'type-a-data-servicing') {
      navigateTo('type-a-data-servicing');
      setMobileMenuOpen(false);
      return;
    }

    if (targetId === 'type-b-horizontal-llm-data') {
      navigateTo('type-b-horizontal-llm-data');
      setMobileMenuOpen(false);
      return;
    }

    if (targetId === 'type-c-vertical-llm-data') {
      navigateTo('type-c-vertical-llm-data');
      setMobileMenuOpen(false);
      return;
    }

    if (targetId === 'type-d-aigc') {
      navigateTo('type-d-aigc');
      setMobileMenuOpen(false);
      return;
    }

    if (currentPage !== 'home') {
      navigateTo('home');
      setTimeout(() => scrollToSection(targetId), 100);
    } else {
      scrollToSection(targetId);
    }

    setMobileMenuOpen(false);
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${isScrolled ? 'py-3' : 'py-6'}`}>
      <style>{`
        .nav-particles {
          position: absolute;
          width: 0;
          height: 0;
          pointer-events: none;
          overflow: visible;
        }

        .nav-particle {
          position: absolute;
          left: 0;
          top: 0;
          width: 16px;
          height: 16px;
          transform: translate(-50%, -50%);
          animation: nav-particle-burst var(--time) ease-out forwards;
        }

        .nav-point {
          display: block;
          width: 100%;
          height: 100%;
          border-radius: 9999px;
          background: var(--color);
          transform: scale(0);
          opacity: 0;
          animation: nav-point-pop var(--time) ease-out forwards;
          filter: blur(0.5px);
        }

        @keyframes nav-particle-burst {
          0% {
            transform: translate(-50%, -50%) translate(0, 0);
            opacity: 1;
          }
          70% {
            transform: translate(-50%, -50%) translate(var(--dx), var(--dy));
            opacity: 1;
          }
          100% {
            transform: translate(-50%, -50%) translate(calc(var(--dx) * 1.4), calc(var(--dy) * 1.4));
            opacity: 0;
          }
        }

        @keyframes nav-point-pop {
          0% {
            transform: scale(0);
            opacity: 0;
          }
          20% {
            opacity: 1;
          }
          55% {
            transform: scale(var(--scale));
            opacity: 1;
          }
          100% {
            transform: scale(0);
            opacity: 0;
          }
        }
      `}</style>
      <div className="container mx-auto px-6">
        <div className={`mx-auto max-w-7xl rounded-full transition-all duration-500 px-6 py-3 flex items-center justify-between ${
          isScrolled ? 'glass shadow-xl translate-y-2' : 'bg-transparent'
        }`}>
          <a
            href="#home"
            onClick={(e) => handleNavClick(e, { href: '#home' })}
            className="flex items-center gap-2 group"
          >
            <img
              src={NAVBAR_LOGO_URL}
              alt="Lifewood"
              className={`${logoSizeClass} w-auto object-contain transition-transform group-hover:scale-105`}
            />
          </a>

          <div className="hidden lg:flex items-center gap-6 relative">
            {NAV_ITEMS.map((item) => (
              <div
                key={item.label}
                className="relative group py-2"
                onMouseEnter={() => item.subItems && setActiveDropdown(item.label)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <a
                  href={item.href}
                  onClick={(e) => {
                    spawnParticles(e.currentTarget);
                    handleNavClick(e, item);
                  }}
                  className={`text-sm font-bold flex items-center gap-1.5 transition-colors relative overflow-visible ${
                    isItemActive(item.label)
                      ? 'text-lifewood-green dark:text-lifewood-yellow'
                      : 'text-black dark:text-white hover:text-lifewood-green dark:hover:text-lifewood-yellow'
                  } ${
                    item.subItems ? 'cursor-default' : ''
                  }`}
                >
                  {item.label}
                  {item.subItems && (
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${activeDropdown === item.label ? 'rotate-180' : ''}`} />
                  )}
                  <span className={`absolute -bottom-1 left-0 h-0.5 bg-lifewood-green dark:bg-lifewood-yellow transition-all duration-300 ${
                    isItemActive(item.label) ? 'w-full' : activeDropdown === item.label ? 'w-full' : 'w-0 group-hover:w-full'
                  }`}></span>
                </a>

                {item.subItems && (
                  <div className={`absolute left-0 top-full pt-4 transition-all duration-300 ${activeDropdown === item.label ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
                    <div className="backdrop-blur-md bg-white/80 dark:bg-black/40 shadow-2xl rounded-3xl p-3 min-w-[220px] ring-1 ring-white/30 dark:ring-white/20">
                      {item.subItems.map((sub, idx) => (
                        <a
                          key={sub.label}
                          href={sub.href}
                          data-is-sub="true"
                          onClick={(e) => {
                            spawnParticles(e.currentTarget);
                            handleNavClick(e, sub);
                          }}
                          className={`flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-2xl transition-all relative overflow-visible ${
                            isSubItemActive(sub.href)
                              ? 'bg-lifewood-green/10 text-lifewood-green dark:bg-white/10 dark:text-lifewood-yellow'
                              : 'text-black dark:text-white hover:bg-lifewood-green/10 hover:text-lifewood-green dark:hover:text-lifewood-yellow'
                          }`}
                        >
                          <div className="w-8 h-8 rounded-xl bg-lifewood-green/5 flex items-center justify-center">
                            {sub.label.includes('Type A') ? <Database className="w-4 h-4" /> :
                             sub.label.includes('Type B') ? <Mic className="w-4 h-4" /> :
                             sub.label.includes('Type C') ? <Car className="w-4 h-4" /> :
                             sub.label.includes('Type D') ? <Sparkles className="w-4 h-4" /> :
                             idx === 0 ? <Sparkles className="w-4 h-4" /> : <Layers className="w-4 h-4" />}
                          </div>
                          {sub.label}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <button
              className="lg:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X /> : <Menu />}
            </button>
            {isAdminAuthenticated ? (
              <button
                onClick={() => navigateTo('admin-dashboard')}
                className="hidden sm:block px-6 py-2 bg-lifewood-green text-white dark:bg-lifewood-yellow dark:text-lifewood-serpent rounded-full font-bold text-sm hover:shadow-lg hover:shadow-lifewood-green/20 transition-all active:scale-95"
              >
                Dashboard
              </button>
            ) : (
              <button
                onClick={() => navigateTo('signin')}
                className="hidden sm:block px-6 py-2 bg-lifewood-green text-white dark:bg-lifewood-yellow dark:text-lifewood-serpent rounded-full font-bold text-sm hover:shadow-lg hover:shadow-lifewood-green/20 transition-all active:scale-95"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>

      <div className={`lg:hidden fixed inset-0 z-40 transition-all duration-500 ${mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <button
          type="button"
          aria-label="Close mobile menu"
          onClick={() => setMobileMenuOpen(false)}
          className="absolute inset-0 bg-black/45 backdrop-blur-sm"
        />

        <div className={`absolute inset-y-0 right-0 w-[92vw] max-w-sm transform transition-transform duration-500 ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="flex h-full flex-col border-l border-lifewood-serpent/10 bg-[#fbfaf6] shadow-[0_24px_80px_rgba(0,0,0,0.25)] dark:bg-[#07120d]">
            <div className="flex items-center justify-between border-b border-lifewood-serpent/10 px-5 py-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-lifewood-serpent/45 dark:text-white/45">Navigation</p>
                <h2 className="mt-0.5 text-lg font-black text-lifewood-serpent dark:text-white">Menu</h2>
              </div>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-lifewood-serpent/10 bg-white text-lifewood-serpent shadow-sm transition hover:border-lifewood-green hover:text-lifewood-green dark:bg-white/5 dark:text-white"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-5">
              <div className="space-y-3">
                {NAV_ITEMS.map((item) => (
                  <div key={item.label} className="overflow-hidden rounded-3xl border border-lifewood-serpent/10 bg-white/80 shadow-[0_10px_30px_rgba(19,48,32,0.06)] dark:bg-white/5">
                    <a
                      href={item.href}
                      onClick={(e) => handleNavClick(e, item)}
                      className={`flex items-center justify-between px-4 py-4 text-base font-black transition-colors ${
                        isItemActive(item.label)
                          ? 'text-lifewood-green dark:text-lifewood-yellow'
                          : 'text-lifewood-serpent hover:text-lifewood-green dark:text-white dark:hover:text-lifewood-yellow'
                      } ${
                        item.subItems ? 'cursor-default' : ''
                      }`}
                    >
                      <span className={`relative inline-flex pb-1 ${
                        isItemActive(item.label)
                          ? 'after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:bg-current after:content-[\'\']'
                          : ''
                      }`}>{item.label}</span>
                      {item.subItems && <ChevronDown className="h-4 w-4 text-lifewood-serpent/35 dark:text-white/35" />}
                    </a>

                    {item.subItems && (
                      <div className="border-t border-lifewood-serpent/10 px-3 py-3">
                        <div className="grid gap-2">
                          {item.subItems.map((sub) => (
                            <a
                              key={sub.label}
                              href={sub.href}
                              data-is-sub="true"
                              onClick={(e) => handleNavClick(e, sub)}
                              className={`flex items-center gap-3 rounded-2xl border px-3 py-3 text-sm font-semibold transition ${
                                isSubItemActive(sub.href)
                                  ? 'border-lifewood-green/30 bg-lifewood-green/10 text-lifewood-green dark:border-lifewood-yellow/30 dark:bg-white/10 dark:text-lifewood-yellow'
                                  : 'border-transparent bg-lifewood-seaSalt/70 text-lifewood-serpent hover:border-lifewood-green/20 hover:bg-lifewood-green/5 hover:text-lifewood-green dark:bg-white/5 dark:text-white dark:hover:bg-white/10 dark:hover:text-white'
                              }`}
                            >
                              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white text-lifewood-green shadow-sm dark:bg-black/20">
                                {sub.label.includes('Type A') ? <Database className="h-4 w-4" /> :
                                 sub.label.includes('Type B') ? <Mic className="h-4 w-4" /> :
                                 sub.label.includes('Type C') ? <Car className="h-4 w-4" /> :
                                 sub.label.includes('Type D') ? <Sparkles className="h-4 w-4" /> :
                                 <Sparkles className="h-4 w-4" />}
                              </div>
                              <span className="leading-snug">{sub.label}</span>
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-lifewood-serpent/10 p-4">
              <div className="grid gap-2">
                <button
                  onClick={() => {
                    navigateTo(isAdminAuthenticated ? 'admin-dashboard' : 'signin');
                    setMobileMenuOpen(false);
                  }}
                  className="inline-flex items-center justify-center rounded-2xl bg-lifewood-green px-4 py-3 text-sm font-bold text-white shadow-[0_12px_26px_rgba(4,98,65,0.18)] transition hover:bg-lifewood-green/90"
                >
                  {isAdminAuthenticated ? 'Dashboard' : 'Sign In'}
                </button>
                <a
                  href="#contact"
                  onClick={(e) => handleNavClick(e, { href: '#contact' })}
                  className="inline-flex items-center justify-center rounded-2xl border border-lifewood-serpent/10 bg-white px-4 py-3 text-sm font-bold text-lifewood-serpent transition hover:border-lifewood-green hover:text-lifewood-green dark:bg-white/5 dark:text-white"
                >
                  Contact Us
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};
