import React from 'react';

type HeroSummaryItem = {
  label: string;
  detail: string;
};

interface PageHeroHeaderProps {
  id?: string;
  eyebrow?: string;
  title: string;
  description?: React.ReactNode;
  cta?: React.ReactNode;
  summaryLabel?: string;
  summaryTitle?: string;
  summaryText?: string;
  summaryItems?: HeroSummaryItem[];
  className?: string;
  titleClassName?: string;
}

export const PageHeroHeader: React.FC<PageHeroHeaderProps> = ({
  id,
  eyebrow,
  title,
  description,
  cta,
  summaryLabel,
  summaryTitle,
  summaryText,
  summaryItems,
  className,
  titleClassName
}) => {
  return (
    <div
      id={id}
      className={`relative overflow-hidden rounded-[2.75rem] bg-gradient-to-br from-white via-lifewood-seaSalt/90 to-lifewood-green/5 px-6 py-8 shadow-[0_28px_80px_-48px_rgba(4,98,65,0.45)] dark:from-[#07110c] dark:via-[#020804] dark:to-[#0c1f16] md:px-10 md:py-10 ${className || ''}`}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(4,98,65,0.12),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(255,179,71,0.12),transparent_28%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(4,98,65,0.035)_1px,transparent_1px),linear-gradient(to_bottom,rgba(4,98,65,0.035)_1px,transparent_1px)] bg-[size:44px_44px] opacity-30 dark:opacity-20" />

      <div className={`relative grid gap-8 ${summaryItems && summaryItems.length > 0 ? 'lg:grid-cols-[1.15fr_0.85fr] lg:items-end' : ''}`}>
        <div>
          {eyebrow && (
            <div className="mb-5 flex items-center gap-4">
              <div className="h-px w-12 bg-gradient-to-r from-lifewood-green via-lifewood-saffron to-transparent" />
              <span className="text-[11px] font-black uppercase tracking-[0.34em] text-lifewood-serpent/55 dark:text-white/55">
                {eyebrow}
              </span>
            </div>
          )}

          <h1
            className={
              titleClassName ||
              'text-4xl md:text-6xl font-heading font-black tracking-tight leading-[0.96] text-lifewood-serpent dark:text-white uppercase whitespace-pre-line'
            }
          >
            {title}
          </h1>

          {description && (
            <div className="mt-6 max-w-4xl text-lg md:text-xl leading-relaxed text-lifewood-serpent/65 dark:text-white/65">
              {description}
            </div>
          )}

          {cta && <div className="mt-8">{cta}</div>}
        </div>

        {summaryItems && summaryItems.length > 0 && (
          <aside className="relative rounded-[2rem] bg-white/75 p-6 shadow-[0_22px_60px_-40px_rgba(19,48,32,0.35)] backdrop-blur-md dark:bg-white/5 md:p-7">
            <div className="mb-4">
              {summaryLabel && (
                <p className="text-[10px] font-black uppercase tracking-[0.34em] text-lifewood-serpent/45 dark:text-white/45">
                  {summaryLabel}
                </p>
              )}
              {summaryTitle && (
                <h2 className="mt-2 text-2xl font-heading font-bold tracking-tight text-lifewood-serpent dark:text-white">
                  {summaryTitle}
                </h2>
              )}
              {summaryText && (
                <p className="mt-3 text-sm leading-relaxed text-lifewood-serpent/65 dark:text-white/65">
                  {summaryText}
                </p>
              )}
            </div>

            <div className="space-y-3">
              {summaryItems.map((item) => (
                <div
                  key={item.label}
                  className="rounded-[1.35rem] bg-white/80 px-4 py-4 shadow-[0_10px_30px_-24px_rgba(4,98,65,0.45)] dark:bg-white/5"
                >
                  <p className="text-[10px] font-black uppercase tracking-[0.28em] text-lifewood-green dark:text-lifewood-saffron">
                    {item.label}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-lifewood-serpent/70 dark:text-white/70">
                    {item.detail}
                  </p>
                </div>
              ))}
            </div>
          </aside>
        )}
      </div>
    </div>
  );
};
