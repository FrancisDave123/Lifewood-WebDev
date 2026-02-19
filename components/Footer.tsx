
import React from 'react';
import { LOGO_URL } from '../constants';
import { Linkedin, Facebook, Instagram, Youtube, Mail, Phone, ArrowUpRight, Globe } from 'lucide-react';

interface FooterProps {
  navigateTo?: (page: 'home' | 'services') => void;
}

export const Footer: React.FC<FooterProps> = ({ navigateTo }) => {
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    
    // Only allow routing for home and services, remove scroll-to-section for others
    if (id === 'home') {
      if (navigateTo) navigateTo('home');
      else window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (id === 'services') {
      if (navigateTo) navigateTo('services');
      return;
    }

    // Do nothing for other section links to satisfy "remove click to scroll"
  };

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <footer id="contact" className="relative pt-32 pb-16 overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute bottom-0 left-0 right-0 h-[600px] bg-gradient-to-t from-lifewood-green/10 to-transparent pointer-events-none"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="glass-card rounded-[4rem] p-12 md:p-20 shadow-2xl border-white/20 ring-1 ring-white/10 mb-20 animate-float">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            <div className="lg:col-span-5">
              <img src={LOGO_URL} alt="Lifewood" className="h-12 mb-10 hover:scale-105 transition-transform" />
              <h4 className="text-3xl font-heading font-bold mb-8 leading-tight">Engineering the data foundation for Tomorrow's Intelligence.</h4>
              <div className="space-y-6">
                <div className="flex items-center gap-5 group cursor-pointer">
                  <div className="w-12 h-12 rounded-2xl glass border-white/20 flex items-center justify-center group-hover:bg-lifewood-green group-hover:text-white transition-all">
                    <Globe className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs uppercase font-bold tracking-widest opacity-40">Global Presence</div>
                    <span className="font-semibold opacity-80">Operational Everywhere You Are</span>
                  </div>
                </div>
                <div className="flex items-center gap-5 group cursor-pointer">
                  <div className="w-12 h-12 rounded-2xl glass border-white/20 flex items-center justify-center group-hover:bg-lifewood-green group-hover:text-white transition-all">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs uppercase font-bold tracking-widest opacity-40">Inquiries</div>
                    <span className="font-semibold opacity-80">contact@lifewood.com</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-12">
              <div className="space-y-6">
                <h5 className="font-black text-xs uppercase tracking-[0.3em] text-lifewood-green">Navigation</h5>
                <ul className="space-y-4 font-bold opacity-60">
                  {[
                    { label: 'Home', id: 'home' },
                    { label: 'AI Initiatives', id: 'initiatives' },
                    { label: 'Our Company', id: 'company' },
                    { label: 'What We Offer', id: 'offer' }
                  ].map(link => (
                    <li key={link.label}>
                      <a 
                        href={`#${link.id}`} 
                        onClick={(e) => handleNavClick(e, link.id === 'initiatives' ? 'services' : link.id)}
                        className="hover:text-lifewood-green transition-colors flex items-center gap-1 group"
                      >
                        {link.label} <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="space-y-6">
                <h5 className="font-black text-xs uppercase tracking-[0.3em] text-lifewood-green">Engagement</h5>
                <ul className="space-y-4 font-bold opacity-60">
                  {[
                    { label: 'Careers', id: 'careers' },
                    { label: 'Philanthropy', id: 'impact' },
                    { label: 'Internal News', id: 'news' }
                  ].map(link => (
                    <li key={link.label}>
                      <a 
                        href={`#${link.id}`} 
                        onClick={(e) => handleNavClick(e, link.id)}
                        className="hover:text-lifewood-green transition-colors flex items-center gap-1 group"
                      >
                        {link.label} <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="col-span-2 md:col-span-1 space-y-8">
                <h5 className="font-black text-xs uppercase tracking-[0.3em] text-lifewood-green">Social Presence</h5>
                <div className="flex flex-wrap gap-4">
                  {[Linkedin, Facebook, Instagram, Youtube].map((Icon, idx) => (
                    <a 
                      key={idx} 
                      href="#" 
                      className="w-14 h-14 rounded-2xl glass border-white/20 flex items-center justify-center hover:bg-lifewood-green hover:text-white transition-all duration-500 hover:shadow-xl shadow-lg hover:-translate-y-2 group"
                    >
                      <Icon className="w-6 h-6" />
                    </a>
                  ))}
                </div>
                <div className="pt-4">
                   <button 
                    onClick={scrollToTop}
                    className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] opacity-40 hover:opacity-100 transition-opacity"
                   >
                     Back to top <ArrowUpRight className="w-4 h-4 rotate-[-45deg]" />
                   </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-8 opacity-40 text-xs font-black uppercase tracking-[0.2em] px-12">
          <p>© 2026 Lifewood - All Rights Reserved</p>
          <div className="flex gap-10">
            <a href="#" className="hover:text-lifewood-green">Privacy Policy</a>
            <a href="#" className="hover:text-lifewood-green">Terms of Service</a>
            <a href="#" className="hover:text-lifewood-green">Cookie Settings</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
