
import React, { useState } from 'react';
import { LOGO_URL } from '../constants';
import { Linkedin, Facebook, Instagram, Youtube, Mail, ArrowUpRight, ArrowRight, X } from 'lucide-react';

interface FooterProps {
  navigateTo?: (page: 'home' | 'services' | 'projects' | 'contact' | 'privacy' | 'cookie-policy' | 'terms') => void;
}

export const Footer: React.FC<FooterProps> = ({ navigateTo }) => {
  const [showCookieSettings, setShowCookieSettings] = useState(false);
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const socialLinks = [
    { Icon: Linkedin, label: 'LinkedIn', href: 'https://www.linkedin.com/company/lifewood-data-technology-ltd.' },
    { Icon: Facebook, label: 'Facebook', href: 'https://www.facebook.com/LifewoodPH' },
    { Icon: Instagram, label: 'Instagram', href: 'https://www.instagram.com/lifewood_official' },
    { Icon: Youtube, label: 'Youtube', href: 'https://www.youtube.com/@LifewoodDataTechnology' }
  ];

  return (
    <footer id="contact" className="relative overflow-hidden bg-gradient-to-b from-lifewood-seaSalt via-lifewood-seaSalt to-lifewood-serpent/10 pt-32 pb-16">
      {/* Background Decoration */}
      <div className="absolute bottom-0 left-0 right-0 h-[600px] bg-gradient-to-t from-lifewood-green/10 to-transparent pointer-events-none"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="mb-8 rounded-[4rem] border border-lifewood-green/20 bg-gradient-to-br from-lifewood-serpent via-[#0c3a27] to-lifewood-green p-12 text-white shadow-2xl ring-1 ring-white/10 transition-transform duration-500 md:p-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start mb-20">
            {/* Mission Section */}
            <div className="lg:col-span-6">
              <img src={LOGO_URL} alt="Lifewood" className="h-10 mb-10 hover:scale-105 transition-transform" />
              <h4 className="mb-8 font-heading text-3xl font-bold leading-tight text-white md:text-4xl">
                We provide global Data Engineering Services to enable AI Solutions.
              </h4>
              <div className="pt-4">
                <button 
                  onClick={() => navigateTo?.('contact')}
                  className="group relative px-8 py-4 bg-lifewood-green text-white rounded-full font-bold text-base flex items-center gap-3 transition-all hover:scale-105 active:scale-95 shadow-[0_15px_40px_rgba(4,98,65,0.25)]"
                >
                  Contact Us
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform duration-300" />
                </button>
              </div>
            </div>

            {/* Social & Back to Top */}
            <div className="lg:col-span-6 flex flex-col md:items-end gap-12">
              <div className="text-left md:text-right space-y-8">
                <h5 className="mb-6 text-xs font-black uppercase tracking-[0.4em] text-lifewood-yellow">Find Us On:</h5>
                <div className="flex flex-wrap md:justify-end gap-4">
                  {socialLinks.map(({ Icon, label, href }) => (
                    <a 
                      key={label} 
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      className="group relative flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl border border-white/20 bg-white/10 text-white shadow-lg transition-all duration-500 hover:-translate-y-4 hover:rotate-[15deg] hover:scale-125 hover:bg-lifewood-green hover:text-white hover:shadow-[0_0_30px_rgba(4,98,65,0.4)]"
                    >
                      <div className="absolute inset-0 bg-gradient-to-tr from-lifewood-saffron/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      <Icon className="w-6 h-6 relative z-10 group-hover:animate-bounce" />
                    </a>
                  ))}
                </div>
              </div>

              <div className="pt-8">
                <button 
                  onClick={scrollToTop}
                  className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.3em] text-white/60 transition-opacity hover:text-white md:ml-auto"
                >
                  Back to top <ArrowUpRight className="w-4 h-4 rotate-[-45deg]" />
                </button>
              </div>
            </div>
          </div>

          {/* Divider Line */}
          <div className="mb-10 h-px w-full bg-white/20"></div>

          {/* Legal & Copyright Section - Inside the Card */}
          <div className="flex flex-col items-center justify-between gap-10 text-center text-[10px] font-black uppercase tracking-[0.2em] text-white/70 md:text-xs lg:flex-row lg:text-left">
            <p className="whitespace-nowrap">&copy; 2026 Lifewood - All Rights Reserved</p>
            
            <div className="flex flex-wrap justify-center gap-x-8 gap-y-4">
              <button onClick={() => navigateTo?.('privacy')} className="uppercase transition-colors hover:text-lifewood-yellow">Privacy Policy</button>
              <button onClick={() => navigateTo?.('cookie-policy')} className="uppercase transition-colors hover:text-lifewood-yellow">Cookie Policy</button>
              <button onClick={() => navigateTo?.('terms')} className="uppercase transition-colors hover:text-lifewood-yellow">Terms and Conditions</button>
              <button onClick={() => setShowCookieSettings(true)} className="uppercase transition-colors hover:text-lifewood-yellow">Cookie Settings</button>
            </div>
          </div>
        </div>
      </div>

      {/* Cookie Settings Modal */}
      {showCookieSettings && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowCookieSettings(false)}></div>
          <div className="relative glass-card rounded-[2.5rem] p-10 max-w-md w-full border-white/20 shadow-2xl animate-pop-out">
            <button 
              onClick={() => setShowCookieSettings(false)}
              className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-2xl font-heading font-bold mb-6 text-lifewood-serpent dark:text-white">Cookie Settings</h3>
            <p className="text-lifewood-serpent/70 dark:text-white/70 mb-8 leading-relaxed">
              We use cookies to personalize content, run ads, and analyze traffic.
            </p>
            <div className="flex gap-4">
              <button 
                onClick={() => setShowCookieSettings(false)}
                className="flex-1 py-3 bg-lifewood-green text-white rounded-full font-bold hover:scale-105 transition-transform"
              >
                Accept
              </button>
              <button 
                onClick={() => setShowCookieSettings(false)}
                className="flex-1 py-3 border border-lifewood-serpent/20 dark:border-white/20 rounded-full font-bold hover:bg-black/5 transition-colors"
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};

