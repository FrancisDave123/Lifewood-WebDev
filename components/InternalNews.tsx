
import React from 'react';
import { ArrowRight } from 'lucide-react';
import type { PageRoute } from '../routes/routeTypes';
import { PageHeroHeader } from './PageHeroHeader';

interface InternalNewsProps {
  navigateTo?: (page: PageRoute) => void;
}

export const InternalNews: React.FC<InternalNewsProps> = ({ navigateTo }) => {
  const handleContactClick = () => {
    navigateTo?.('contact-us');
  };

  return (
    <div className="pt-32 pb-20 min-h-screen bg-lifewood-seaSalt dark:bg-[#020804] relative overflow-x-hidden animate-pop-out opacity-0">
      {/* Animated background elements to match AboutUs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-lifewood-green/10 dark:bg-lifewood-green/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-lifewood-saffron/10 dark:bg-lifewood-saffron/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
      {/* Header Section */}
        <div className="mb-20 animate-pop-out opacity-0" style={{ animationDelay: '100ms' }}>
          <PageHeroHeader
            id="internal-news-page-title"
            eyebrow="Latest update"
            title="Rootstech 2026"
            description="Coming Soon! Stay tuned for more updates on our participation in Rootstech 2026. We are excited to showcase our latest innovations in AI data solutions and global research capabilities."
            cta={
              <button 
                onClick={handleContactClick}
                className="group inline-flex items-center gap-3 rounded-full bg-lifewood-serpent px-8 py-3 text-sm font-bold text-white shadow-[0_10px_30px_rgba(19,48,32,0.15)] transition-transform hover:scale-105 dark:bg-lifewood-seaSalt dark:text-lifewood-serpent"
              >
                Contact Us <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            }
          />
        </div>

        {/* Video Section */}
        <div className="animate-pop-out opacity-0" style={{ animationDelay: '200ms' }}>
          <div className="bg-gray-100 dark:bg-white/5 rounded-[2.5rem] p-4 md:p-8 shadow-inner">
            <div className="relative aspect-video w-full rounded-2xl overflow-hidden shadow-2xl">
              <iframe 
                className="absolute inset-0 w-full h-full"
                src="https://www.youtube.com/embed/ccyrQ87EJag?si=IaEMhioSCF9R-Q-4" 
                title="YouTube video player" 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                referrerPolicy="strict-origin-when-cross-origin" 
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
