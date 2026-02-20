import React from 'react';

interface OfficesProps {
  theme?: 'light' | 'dark';
}

const officeStats = [
  { value: '56,788', label: 'Online Resources' },
  { value: '30 +', label: 'Countries' },
  { value: '40 +', label: 'Centers' }
];

export const Offices: React.FC<OfficesProps> = ({ theme = 'light' }) => {
  const frameUrl = 'https://lifewoodworldwidemap.vercel.app/';
  const headingColor = theme === 'dark' ? 'text-white' : 'text-lifewood-serpent';

  return (
    <section className="pt-32 pb-20 animate-pop-out opacity-0">
      <div className="container mx-auto px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className={`text-4xl md:text-6xl font-heading font-black leading-[0.95] tracking-tight mb-10 ${headingColor}`}>
            Largest Global Data Collection
            <br />
            Resources Distribution
          </h1>

          <div className="hidden lg:flex justify-end mb-4">
            <div className="relative w-40 h-40">
              <div className="absolute inset-0 rounded-full border border-lifewood-serpent/25 dark:border-white/20 animate-spin-slow"></div>
              <div
                className="absolute inset-5 rounded-full border border-lifewood-saffron/40 animate-spin-slow"
                style={{ animationDirection: 'reverse', animationDuration: '14s' }}
              ></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-6 h-6 rounded-full bg-lifewood-saffron ring-4 ring-white/80 dark:ring-white/20"></div>
              </div>
              <p className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-[0.3em] text-lifewood-serpent/70 dark:text-white/70 whitespace-nowrap">
                be amazed
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_250px] gap-6 items-stretch">
            <div className="rounded-2xl overflow-hidden shadow-xl border border-[#9bc4d6] h-[380px] md:h-[460px] bg-[#9dc8d8]">
              <iframe
                title="Lifewood Worldwide Map"
                src={frameUrl}
                className="w-full h-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer"
                sandbox="allow-same-origin allow-scripts allow-downloads allow-forms allow-modals allow-orientation-lock allow-pointer-lock allow-popups allow-popups-to-escape-sandbox allow-presentation allow-storage-access-by-user-activation allow-top-navigation-by-user-activation"
              />
            </div>

            <aside className="rounded-2xl bg-lifewood-saffron text-lifewood-serpent px-8 py-10 flex flex-col justify-between shadow-xl">
              {officeStats.map((stat, idx) => (
                <div key={stat.label}>
                  <p className="text-5xl md:text-4xl lg:text-5xl font-black mb-3">{stat.value}</p>
                  <p className="text-xl md:text-lg font-semibold">{stat.label}</p>
                  {idx < officeStats.length - 1 && <div className="my-8 h-px bg-white/60"></div>}
                </div>
              ))}
            </aside>
          </div>
        </div>
      </div>
    </section>
  );
};
