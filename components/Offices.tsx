import React from 'react';
import { Building2, Globe, MapPin } from 'lucide-react';
import { PageHeroHeader } from './PageHeroHeader';

interface OfficesProps {
  theme?: 'light' | 'dark';
}

const officeStats = [
  { value: '56,788', label: 'Online Resources' },
  { value: '30 +', label: 'Countries' },
  { value: '40 +', label: 'Centers' }
];

const officeHighlights = [
  {
    title: 'Global network',
    description: 'A worldwide footprint spanning time zones and delivery hubs.',
    icon: Globe
  },
  {
    title: 'Regional centers',
    description: 'Distributed operations designed for scale, resilience, and local support.',
    icon: Building2
  },
  {
    title: 'Worldwide reach',
    description: 'Data collection teams and offices connected by one shared workflow.',
    icon: MapPin
  }
];

export const Offices: React.FC<OfficesProps> = ({ theme = 'light' }) => {
  const frameUrl = 'https://lifewoodworldwidemap.vercel.app/';
  const headingColor = theme === 'dark' ? 'text-white' : 'text-lifewood-serpent';

  return (
    <section className="pt-32 pb-20 relative overflow-x-hidden animate-pop-out opacity-0">
      <div className="container mx-auto px-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12 animate-pop-out opacity-0" style={{ animationDelay: '100ms' }}>
            <PageHeroHeader
              id="offices-page-title"
              eyebrow="Global footprint"
              title="Largest Global Data Collection\nResources Distribution"
              titleClassName={`text-4xl md:text-6xl font-heading font-black leading-[0.95] tracking-tight ${headingColor} uppercase whitespace-pre-line`}
              description="Explore where our teams operate, how our global collection network is organized, and the scale of our worldwide delivery presence."
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_300px] gap-6 items-stretch animate-pop-out opacity-0" style={{ animationDelay: '400ms' }}>
            <div className="relative rounded-[2rem] overflow-hidden shadow-[0_30px_80px_-35px_rgba(0,0,0,0.55)] border border-white/40 dark:border-white/10 h-[420px] md:h-[500px] bg-[#9dc8d8]">
              <div className="absolute inset-0 bg-gradient-to-tr from-lifewood-green/20 via-transparent to-lifewood-saffron/20 pointer-events-none"></div>
              <iframe
                title="Lifewood Worldwide Map"
                src={frameUrl}
                className="relative z-10 w-full h-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer"
                sandbox="allow-same-origin allow-scripts allow-downloads allow-forms allow-modals allow-orientation-lock allow-pointer-lock allow-popups allow-popups-to-escape-sandbox allow-presentation allow-storage-access-by-user-activation allow-top-navigation-by-user-activation"
              />
            </div>

            <aside className="rounded-[2rem] bg-white/80 dark:bg-white/5 border border-lifewood-serpent/10 shadow-[0_20px_60px_-30px_rgba(4,98,65,0.25)] backdrop-blur-md p-6 md:p-8 flex flex-col gap-4">
              <div className="rounded-[1.5rem] border border-lifewood-serpent/10 bg-white/85 dark:bg-white/5 p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.32em] text-lifewood-serpent/45 dark:text-white/45 mb-2">
                  Summary numbers
                </p>
                <p className="text-sm leading-relaxed text-lifewood-serpent/65 dark:text-white/65">
                  Our office network supports collection, delivery, and regional coordination across the world.
                </p>
              </div>
              <div className="grid grid-cols-1 gap-3 pt-2">
                {officeStats.map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-[1.5rem] border border-lifewood-saffron/20 bg-gradient-to-r from-lifewood-saffron/15 to-lifewood-green/10 px-4 py-4 text-lifewood-serpent shadow-sm"
                  >
                    <p className="text-3xl font-black">{stat.value}</p>
                    <p className="text-xs font-bold uppercase tracking-[0.28em] text-lifewood-serpent/60">{stat.label}</p>
                  </div>
                ))}
              </div>
            </aside>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 animate-pop-out opacity-0" style={{ animationDelay: '500ms' }}>
            {officeHighlights.map((highlight) => {
              const Icon = highlight.icon;
              return (
                <div
                  key={highlight.title}
                  className="rounded-[1.75rem] border border-lifewood-serpent/10 bg-white/80 dark:bg-white/5 p-5 shadow-[0_18px_50px_-35px_rgba(4,98,65,0.28)] backdrop-blur-md"
                >
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-lifewood-green/10 text-lifewood-green">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="text-lg font-black text-lifewood-serpent dark:text-white">{highlight.title}</h3>
                  </div>
                  <p className="text-sm leading-relaxed text-lifewood-serpent/65 dark:text-white/65">
                    {highlight.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
