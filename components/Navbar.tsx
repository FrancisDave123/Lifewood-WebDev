
import React, { useState, useEffect } from 'react';
import { NAV_ITEMS } from '../constants';
import { Menu, X, ChevronDown, Sparkles, Layers, Database, Mic, Car } from 'lucide-react';

interface NavbarProps {
  navigateTo: (page: 'home' | 'services' | 'projects' | 'contact' | 'about' | 'offices' | 'impact' | 'careers' | 'type-a' | 'type-b' | 'type-c' | 'type-d' | 'internal-news' | 'privacy' | 'cookie-policy' | 'terms' | 'signin' | 'admin-dashboard' | 'admin-analytics' | 'admin-evaluation' | 'admin-reports' | 'admin-manage-interns' | 'admin-manage-applicants' | 'admin-manage-employees') => void;
  currentPage: 'home' | 'services' | 'projects' | 'contact' | 'about' | 'offices' | 'impact' | 'careers' | 'type-a' | 'type-b' | 'type-c' | 'type-d' | 'internal-news' | 'privacy' | 'cookie-policy' | 'terms' | 'signin' | 'admin-dashboard' | 'admin-analytics' | 'admin-evaluation' | 'admin-reports' | 'admin-manage-interns' | 'admin-manage-applicants' | 'admin-manage-employees';
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
      navigateTo('services');
      setMobileMenuOpen(false);
      return;
    }

    if (targetId === 'project') {
      navigateTo('projects');
      setMobileMenuOpen(false);
      return;
    }

    if (targetId === 'contact') {
      navigateTo('contact');
      setMobileMenuOpen(false);
      return;
    }

    if (targetId === 'about') {
      navigateTo('about');
      setMobileMenuOpen(false);
      return;
    }

    if (targetId === 'offices') {
      navigateTo('offices');
      setMobileMenuOpen(false);
      return;
    }
    
    if (targetId === 'impact') {
      navigateTo('impact');
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

    if (targetId === 'type-a') {
      navigateTo('type-a');
      setMobileMenuOpen(false);
      return;
    }

    if (targetId === 'type-b') {
      navigateTo('type-b');
      setMobileMenuOpen(false);
      return;
    }

    if (targetId === 'type-c') {
      navigateTo('type-c');
      setMobileMenuOpen(false);
      return;
    }

    if (targetId === 'type-d') {
      navigateTo('type-d');
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
    <nav
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${
        isScrolled ? 'py-3' : 'py-6'
      }`}
    >
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

          <div className="hidden lg:flex items-center gap-6">
            {NAV_ITEMS.map((item) => (
              <div 
                key={item.label} 
                className="relative group py-2"
                onMouseEnter={() => item.subItems && setActiveDropdown(item.label)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <a
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item)}
                  className={`text-sm font-bold flex items-center gap-1.5 text-black dark:text-white hover:text-lifewood-green dark:hover:text-lifewood-yellow transition-colors relative ${
                    item.subItems ? 'cursor-default' : ''
                  }`}
                >
                  {item.label}
                  {item.subItems && (
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${activeDropdown === item.label ? 'rotate-180' : ''}`} />
                  )}
                  <span className={`absolute -bottom-1 left-0 h-0.5 bg-lifewood-green dark:bg-lifewood-yellow transition-all duration-300 ${activeDropdown === item.label ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
                </a>

                {item.subItems && (
                  <div className={`absolute left-0 top-full pt-4 transition-all duration-300 ${activeDropdown === item.label ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
                    <div className="backdrop-blur-md bg-white/80 dark:bg-black/40 shadow-2xl rounded-3xl p-3 min-w-[220px] ring-1 ring-white/30 dark:ring-white/20">
                      {item.subItems.map((sub, idx) => (
                        <a
                          key={sub.label}
                          href={sub.href}
                          data-is-sub="true"
                          onClick={(e) => handleNavClick(e, sub)}
                          className="flex items-center gap-3 px-4 py-3 text-sm font-semibold text-black dark:text-white rounded-2xl hover:bg-lifewood-green/10 hover:text-lifewood-green transition-all"
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

      <div className={`lg:hidden fixed inset-0 z-40 bg-lifewood-seaSalt/95 dark:bg-[#050c08]/95 backdrop-blur-xl transition-all duration-500 ${
        mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}>
        <div className="flex flex-col items-center justify-center h-full gap-4 p-6 overflow-y-auto pt-24">
          {NAV_ITEMS.map((item) => (
            <div key={item.label} className="flex flex-col items-center gap-2">
              <a
                href={item.href}
                onClick={(e) => handleNavClick(e, item)}
                className={`text-2xl font-black text-black dark:text-white hover:text-lifewood-green transition-colors ${
                  item.subItems ? 'cursor-default' : ''
                }`}
              >
                {item.label}
              </a>
              {item.subItems && (
                <div className="flex flex-col items-center gap-4 py-2 border-l-2 border-lifewood-green/20 pl-4 mb-4">
                  {item.subItems.map((sub) => (
                    <a
                      key={sub.label}
                      href={sub.href}
                      data-is-sub="true"
                      onClick={(e) => handleNavClick(e, sub)}
                      className="text-lg font-bold text-black dark:text-white opacity-60 hover:opacity-100 transition-opacity flex items-center gap-3"
                    >
                      <div className="w-6 h-6 rounded-lg bg-lifewood-green/10 flex items-center justify-center">
                        {sub.label.includes('Type A') ? <Database className="w-3 h-3" /> : 
                         sub.label.includes('Type B') ? <Mic className="w-3 h-3" /> :
                         sub.label.includes('Type C') ? <Car className="w-3 h-3" /> :
                         sub.label.includes('Type D') ? <Sparkles className="w-3 h-3" /> :
                         <Sparkles className="w-3 h-3" />}
                      </div>
                      {sub.label}
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
          <button
            onClick={() => {
              navigateTo(isAdminAuthenticated ? 'admin-dashboard' : 'signin');
              setMobileMenuOpen(false);
            }}
            className="mt-4 text-lg font-black text-lifewood-green dark:text-lifewood-yellow"
          >
            {isAdminAuthenticated ? 'Dashboard' : 'Sign In'}
          </button>
          <a 
            href="#contact"
            onClick={(e) => handleNavClick(e, { href: '#contact' })}
            className="group relative mt-8 px-8 py-4 bg-lifewood-serpent dark:bg-lifewood-seaSalt text-white dark:text-lifewood-serpent rounded-full font-bold text-base flex items-center gap-3 transition-all hover:scale-105 active:scale-95 shadow-[0_15px_40px_rgba(19,48,32,0.15)] dark:shadow-[0_15px_40px_rgba(0,0,0,0.3)]"
          >
            Contact Us
            <svg className="w-5 h-5 group-hover:translate-x-1.5 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
          </a>
        </div>
      </div>
    </nav>
  );
};
