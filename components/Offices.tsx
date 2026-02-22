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
    <section className="pt-32 pb-20 relative overflow-x-hidden animate-pop-out opacity-0">
      <div className="container mx-auto px-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pop-out opacity-0" style={{ animationDelay: '100ms' }}>
            <div className="flex items-center gap-4 mb-6">
              <div className="flex gap-2">
                <div className="w-4 h-4 rounded-full bg-lifewood-saffron"></div>
                <div className="w-4 h-4 rounded-full border-2 border-lifewood-serpent dark:border-white"></div>
              </div>
              <div className="w-24 h-px bg-lifewood-serpent/30 dark:bg-white/30 border-dashed border-t"></div>
            </div>
          </div>

          <h1 className={`text-4xl md:text-6xl font-heading font-black leading-[0.95] tracking-tight mb-10 ${headingColor} animate-pop-out opacity-0`} style={{ animationDelay: '200ms' }}>
            Largest Global Data Collection
            <br />
            Resources Distribution
          </h1>

          <div className="hidden lg:flex justify-end mb-4 animate-pop-out opacity-0" style={{ animationDelay: '300ms' }}>
            <div className="relative w-48 h-64 flex flex-col items-center">
              <div className="relative w-40 h-40">
                {/* Outer dashed ring */}
                <div className="absolute inset-0 rounded-full border border-dashed border-lifewood-serpent/20 dark:border-white/20"></div>
                
                {/* Central Dot */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative w-8 h-8 rounded-full bg-lifewood-saffron flex items-center justify-center shadow-[0_0_20px_rgba(255,179,71,0.4)]">
                    <div className="w-3 h-3 rounded-full bg-white"></div>
                  </div>
                </div>
                
                {/* Circular Rotating Text */}
                <div className="absolute inset-0 animate-spin-slow" style={{ animationDuration: '20s' }}>
                  <svg viewBox="0 0 100 100" className="w-full h-full">
                    <defs>
                      <path
                        id="circlePath"
                        d="M 50, 50 m -38, 0 a 38,38 0 1,1 76,0 a 38,38 0 1,1 -76,0"
                      />
                    </defs>
                    <text className="text-[8px] font-bold fill-lifewood-serpent/80 dark:fill-white/80">
                      <textPath xlinkHref="#circlePath" textLength="238" lengthAdjust="spacing">
                        amazed . be . amazed . be .
                      </textPath>
                    </text>
                  </svg>
                </div>
              </div>
              
              {/* Downward Arrow Line */}
              <div className="h-16 w-px bg-gradient-to-b from-lifewood-saffron to-transparent relative mt-2">
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-2 border-b border-r border-lifewood-saffron/60 rotate-45"></div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_250px] gap-6 items-stretch animate-pop-out opacity-0" style={{ animationDelay: '400ms' }}>
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
