
import React from 'react';
import { LOGO_URL } from '../constants';
import { Linkedin, Facebook, Instagram, Youtube, Mail, ArrowUpRight } from 'lucide-react';

interface FooterProps {
  navigateTo?: (page: 'home' | 'services' | 'projects' | 'contact') => void;
}

export const Footer: React.FC<FooterProps> = ({ navigateTo }) => {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <footer id="contact" className="relative pt-32 pb-16 overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute bottom-0 left-0 right-0 h-[600px] bg-gradient-to-t from-lifewood-green/10 to-transparent pointer-events-none"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="glass-card rounded-[4rem] p-12 md:p-20 shadow-2xl border-white/20 ring-1 ring-white/10 mb-8 transition-transform duration-500">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start mb-20">
            {/* Mission Section */}
            <div className="lg:col-span-6">
              <img src={LOGO_URL} alt="Lifewood" className="h-10 mb-10 hover:scale-105 transition-transform" />
              <h4 className="text-3xl md:text-4xl font-heading font-bold mb-8 leading-tight">
                We provide global Data Engineering Services to enable AI Solutions.
              </h4>
              <div className="pt-4">
                <button 
                  onClick={() => navigateTo?.('contact')}
                  className="group inline-flex items-center gap-4 px-8 py-4 bg-lifewood-green text-white dark:bg-lifewood-yellow dark:text-lifewood-serpent rounded-full font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all active:scale-95 shadow-lg"
                >
                  Contact Us
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center group-hover:rotate-45 transition-transform">
                    <Mail className="w-4 h-4" />
                  </div>
                </button>
              </div>
            </div>

            {/* Social & Back to Top */}
            <div className="lg:col-span-6 flex flex-col md:items-end gap-12">
              <div className="text-left md:text-right space-y-8">
                <h5 className="font-black text-xs uppercase tracking-[0.4em] text-lifewood-green dark:text-lifewood-yellow mb-6">Find Us On:</h5>
                <div className="flex flex-wrap md:justify-end gap-4">
                  {[
                    { Icon: Linkedin, label: 'LinkedIn' },
                    { Icon: Facebook, label: 'Facebook' },
                    { Icon: Instagram, label: 'Instagram' },
                    { Icon: Youtube, label: 'Youtube' }
                  ].map(({ Icon, label }) => (
                    <a 
                      key={label} 
                      href="#" 
                      aria-label={label}
                      className="w-14 h-14 rounded-2xl glass border-white/20 flex items-center justify-center hover:bg-lifewood-green hover:text-white transition-all duration-500 hover:shadow-xl shadow-lg hover:-translate-y-2 group"
                    >
                      <Icon className="w-6 h-6" />
                    </a>
                  ))}
                </div>
              </div>

              <div className="pt-8">
                <button 
                  onClick={scrollToTop}
                  className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.3em] opacity-40 hover:opacity-100 transition-opacity md:ml-auto"
                >
                  Back to top <ArrowUpRight className="w-4 h-4 rotate-[-45deg]" />
                </button>
              </div>
            </div>
          </div>

          {/* Divider Line */}
          <div className="w-full h-px bg-lifewood-serpent/10 dark:bg-white/10 mb-10"></div>

          {/* Legal & Copyright Section - Inside the Card */}
          <div className="flex flex-col lg:flex-row items-center justify-between gap-10 opacity-60 text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-center lg:text-left">
            <p className="whitespace-nowrap">© 2026 Lifewood - All Rights Reserved</p>
            
            <div className="flex flex-wrap justify-center gap-x-8 gap-y-4">
              <a href="#" className="hover:text-lifewood-green transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-lifewood-green transition-colors">Cookie Policy</a>
              <a href="#" className="hover:text-lifewood-green transition-colors">Terms and Conditions</a>
              <a href="#" className="hover:text-lifewood-green transition-colors">Cookie Settings</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
