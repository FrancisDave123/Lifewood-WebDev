
import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Stats } from './components/Stats';
import { Clients } from './components/Clients';
import { Innovation } from './components/Innovation';
import { Capabilities } from './components/Capabilities';
import { Footer } from './components/Footer';
import { AIServices } from './components/AIServices';
import { AIProjects } from './components/AIProjects';
import { Contact } from './components/Contact';
import { AboutUs } from './components/AboutUs';
import { Offices } from './components/Offices';
import { TypeA } from './components/TypeA';
import { TypeB } from './components/TypeB';
import { TypeC } from './components/TypeC';
import { TypeD } from './components/TypeD';
import { PhilanthropyImpact } from './components/PhilanthropyImpact';
import { Careers } from './components/Careers';
import { InternalNews } from './components/InternalNews';
import { PrivacyPolicy } from './components/PrivacyPolicy';
import { CookiePolicy } from './components/CookiePolicy';
import { TermsConditions } from './components/TermsConditions';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<'home' | 'services' | 'projects' | 'contact' | 'about' | 'offices' | 'impact' | 'careers' | 'type-a' | 'type-b' | 'type-c' | 'type-d' | 'internal-news' | 'privacy' | 'cookie-policy' | 'terms'>('home');
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      if (saved) return saved as 'light' | 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  const navigateTo = (page: 'home' | 'services' | 'projects' | 'contact' | 'about' | 'offices' | 'impact' | 'careers' | 'type-a' | 'type-b' | 'type-c' | 'type-d' | 'internal-news' | 'privacy' | 'cookie-policy' | 'terms') => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="relative min-h-screen bg-lifewood-seaSalt dark:bg-[#020804]">
      <Navbar theme={theme} toggleTheme={toggleTheme} navigateTo={navigateTo} currentPage={currentPage} />
      
      <main className="relative">
        {currentPage === 'home' && (
          <div key="home-page-wrapper">
            <Hero navigateTo={navigateTo} />
            <div className="relative z-10 bg-lifewood-seaSalt dark:bg-[#020804]">
              <About />
              <Stats />
              <Clients />
              <Innovation />
              <Capabilities />
            </div>
          </div>
        )}
        {currentPage === 'services' && (
          <div key="services-page-wrapper" className="relative z-10 bg-lifewood-seaSalt dark:bg-[#020804]">
            <AIServices theme={theme} navigateTo={navigateTo} />
          </div>
        )}
        {currentPage === 'projects' && (
          <div key="projects-page-wrapper" className="relative z-10 bg-lifewood-seaSalt dark:bg-[#020804]">
            <AIProjects theme={theme} />
          </div>
        )}
        {currentPage === 'contact' && (
          <div key="contact-page-wrapper" className="relative z-10 bg-lifewood-seaSalt dark:bg-[#020804]">
            <Contact theme={theme} navigateTo={navigateTo} />
          </div>
        )}
        {currentPage === 'about' && (
          <div key="about-page-wrapper" className="relative z-10 bg-lifewood-seaSalt dark:bg-[#020804]">
            <AboutUs theme={theme} navigateTo={navigateTo} />
          </div>
        )}
        {currentPage === 'offices' && (
          <div key="offices-page-wrapper" className="relative z-10 bg-lifewood-seaSalt dark:bg-[#020804]">
            <Offices theme={theme} />
          </div>
        )}
        {currentPage === 'impact' && (
          <div key="impact-page-wrapper" className="relative z-10 bg-lifewood-seaSalt dark:bg-[#020804]">
            <PhilanthropyImpact />
          </div>
        )}
        {currentPage === 'careers' && (
          <div key="careers-page-wrapper" className="relative z-10 bg-lifewood-seaSalt dark:bg-[#020804]">
            <Careers navigateTo={navigateTo} />
          </div>
        )}
        {currentPage === 'internal-news' && (
          <div key="internal-news-page-wrapper" className="relative z-10 bg-lifewood-seaSalt dark:bg-[#020804]">
            <InternalNews navigateTo={navigateTo} />
          </div>
        )}
        {currentPage === 'privacy' && (
          <div key="privacy-page-wrapper" className="relative z-10 bg-lifewood-seaSalt dark:bg-[#020804]">
            <PrivacyPolicy navigateTo={navigateTo} />
          </div>
        )}
        {currentPage === 'cookie-policy' && (
          <div key="cookie-policy-page-wrapper" className="relative z-10 bg-lifewood-seaSalt dark:bg-[#020804]">
            <CookiePolicy navigateTo={navigateTo} />
          </div>
        )}
        {currentPage === 'terms' && (
          <div key="terms-page-wrapper" className="relative z-10 bg-lifewood-seaSalt dark:bg-[#020804]">
            <TermsConditions navigateTo={navigateTo} />
          </div>
        )}
        {currentPage === 'type-a' && (
          <div key="type-a-page-wrapper" className="relative z-10 bg-lifewood-seaSalt dark:bg-[#020804]">
            <TypeA theme={theme} navigateTo={navigateTo} />
          </div>
        )}
        {currentPage === 'type-b' && (
          <div key="type-b-page-wrapper" className="relative z-10 bg-lifewood-seaSalt dark:bg-[#020804]">
            <TypeB theme={theme} navigateTo={navigateTo} />
          </div>
        )}
        {currentPage === 'type-c' && (
          <div key="type-c-page-wrapper" className="relative z-10 bg-lifewood-seaSalt dark:bg-[#020804]">
            <TypeC theme={theme} navigateTo={navigateTo} />
          </div>
        )}
        {currentPage === 'type-d' && (
          <div key="type-d-page-wrapper" className="relative z-10 bg-lifewood-seaSalt dark:bg-[#020804]">
            <TypeD navigateTo={navigateTo} />
          </div>
        )}
      </main>

      <div className="relative z-20 bg-lifewood-seaSalt dark:bg-[#020804]">
        <Footer navigateTo={navigateTo} />
      </div>

      {/* Background Decorative Blobs */}
      <div className="fixed top-[-10%] right-[-10%] w-[50%] h-[50%] bg-lifewood-green/5 dark:bg-lifewood-green/10 rounded-full blur-[120px] pointer-events-none z-0"></div>
      <div className="fixed bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-lifewood-saffron/5 dark:bg-lifewood-saffron/10 rounded-full blur-[120px] pointer-events-none z-0"></div>
    </div>
  );
};

export default App;
