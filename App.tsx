
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

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<'home' | 'services'>('home');
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

  const navigateTo = (page: 'home' | 'services') => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="relative min-h-screen bg-lifewood-seaSalt dark:bg-[#020804]">
      <Navbar theme={theme} toggleTheme={toggleTheme} navigateTo={navigateTo} currentPage={currentPage} />
      
      <main className="relative">
        {currentPage === 'home' ? (
          <>
            <Hero />
            <div className="relative z-10 bg-lifewood-seaSalt dark:bg-[#020804]">
              <About />
              <Stats />
              <Clients />
              <Innovation />
              <Capabilities />
            </div>
          </>
        ) : (
          <div className="relative z-10 bg-lifewood-seaSalt dark:bg-[#020804]">
            <AIServices />
          </div>
        )}
      </main>

      <div className="relative z-20 bg-lifewood-seaSalt dark:bg-[#020804]">
        <Footer navigateTo={navigateTo} />
      </div>

      {/* Background Decorative Blobs - Moved to z-0 or lower if needed, or kept for ambient depth */}
      <div className="fixed top-[-10%] right-[-10%] w-[50%] h-[50%] bg-lifewood-green/5 dark:bg-lifewood-green/10 rounded-full blur-[120px] pointer-events-none z-0"></div>
      <div className="fixed bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-lifewood-saffron/5 dark:bg-lifewood-saffron/10 rounded-full blur-[120px] pointer-events-none z-0"></div>
    </div>
  );
};

export default App;
