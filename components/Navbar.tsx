
import React, { useState, useEffect } from 'react';
import { NAV_ITEMS, LOGO_URL } from '../constants';
import { ThemeToggle } from './ThemeToggle';
import { Menu, X, ChevronDown, Sparkles, Layers } from 'lucide-react';

interface NavbarProps {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  navigateTo: (page: 'home' | 'services') => void;
  currentPage: 'home' | 'services';
}

export const Navbar: React.FC<NavbarProps> = ({ theme, toggleTheme, navigateTo, currentPage }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, item: any) => {
    e.preventDefault();
    const href = item.href;
    const targetId = href.replace('#', '');
    
    // Routing for Home
    if (targetId === 'home') {
      navigateTo('home');
      setMobileMenuOpen(false);
      return;
    }

    // Routing and allowed scroll for AI Services
    if (targetId === 'services') {
      navigateTo('services');
      setMobileMenuOpen(false);
      return;
    }

    // Remove the click-to-scroll feature for all other items
    // We do nothing here except close the mobile menu if it's open
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
          {/* Logo */}
          <a 
            href="#home" 
            onClick={(e) => handleNavClick(e, { href: '#home' })}
            className="flex items-center gap-2 group"
          >
            <img src={LOGO_URL} alt="Lifewood" className="h-8 md:h-10 transition-transform group-hover:scale-105" />
          </a>

          {/* Desktop Navigation */}
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
                  className={`text-sm font-bold flex items-center gap-1.5 hover:text-lifewood-green dark:hover:text-lifewood-yellow transition-colors relative ${
                    item.subItems ? 'cursor-default' : 'cursor-pointer'
                  }`}
                >
                  {item.label}
                  {item.subItems && (
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${activeDropdown === item.label ? 'rotate-180' : ''}`} />
                  )}
                  <span className={`absolute -bottom-1 left-0 h-0.5 bg-lifewood-green dark:bg-lifewood-yellow transition-all duration-300 ${activeDropdown === item.label ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
                </a>

                {/* Dropdown Menu */}
                {item.subItems && (
                  <div className={`absolute left-0 top-full pt-4 transition-all duration-300 ${activeDropdown === item.label ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
                    <div className="glass shadow-2xl rounded-3xl p-3 min-w-[220px] ring-1 ring-white/20">
                      {item.subItems.map((sub, idx) => (
                        <a
                          key={sub.label}
                          href={sub.href}
                          onClick={(e) => handleNavClick(e, sub)}
                          className="flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-2xl hover:bg-lifewood-green/10 hover:text-lifewood-green transition-all"
                        >
                          <div className="w-8 h-8 rounded-xl bg-lifewood-green/5 flex items-center justify-center">
                            {idx === 0 ? <Sparkles className="w-4 h-4" /> : <Layers className="w-4 h-4" />}
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
            <ThemeToggle theme={theme} toggle={toggleTheme} />
            <button 
              className="lg:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X /> : <Menu />}
            </button>
            <a 
              href="#contact" 
              onClick={(e) => handleNavClick(e, { href: '#contact' })}
              className="hidden sm:block px-6 py-2 bg-lifewood-green text-white dark:bg-lifewood-yellow dark:text-lifewood-serpent rounded-full font-bold text-sm hover:shadow-lg hover:shadow-lifewood-green/20 transition-all active:scale-95"
            >
              Get Started
            </a>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`lg:hidden fixed inset-0 z-40 bg-lifewood-seaSalt/95 dark:bg-[#050c08]/95 backdrop-blur-xl transition-all duration-500 ${
        mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}>
        <div className="flex flex-col items-center justify-center h-full gap-4 p-6 overflow-y-auto pt-24">
          {NAV_ITEMS.map((item) => (
            <div key={item.label} className="flex flex-col items-center gap-2">
              <a
                href={item.href}
                onClick={(e) => handleNavClick(e, item)}
                className="text-2xl font-black hover:text-lifewood-green transition-colors"
              >
                {item.label}
              </a>
              {item.subItems && (
                <div className="flex flex-col items-center gap-4 py-2 border-l-2 border-lifewood-green/20 pl-4 mb-4">
                  {item.subItems.map((sub) => (
                    <a
                      key={sub.label}
                      href={sub.href}
                      onClick={(e) => handleNavClick(e, sub)}
                      className="text-lg font-bold opacity-60 hover:opacity-100 transition-opacity"
                    >
                      {sub.label}
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
          <a 
            href="#contact"
            onClick={(e) => handleNavClick(e, { href: '#contact' })}
            className="mt-8 px-10 py-4 bg-lifewood-green text-white rounded-full text-lg font-bold shadow-xl shadow-lifewood-green/20"
          >
            Contact Us
          </a>
        </div>
      </div>
    </nav>
  );
};
