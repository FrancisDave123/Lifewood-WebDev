import React from 'react';

interface StickyPageTitleProps {
  title: string;
  wrapperClassName?: string;
  titleClassName?: string;
  id?: string;
}

export const StickyPageTitle: React.FC<StickyPageTitleProps> = ({
  title,
  wrapperClassName,
  titleClassName,
  id
}) => {
  return (
    <div id={id} className={`w-fit max-w-full ${wrapperClassName || ''}`}>
      <div className="inline-flex max-w-full items-center gap-4 rounded-full border border-lifewood-serpent/10 bg-white/85 px-5 py-4 shadow-[0_16px_40px_-24px_rgba(4,98,65,0.5)] backdrop-blur-md dark:border-white/10 dark:bg-white/5 md:px-7 md:py-5">
        <div className="h-10 w-1.5 flex-shrink-0 rounded-full bg-gradient-to-b from-lifewood-green to-lifewood-saffron md:h-12" />
        <h1
          className={
            titleClassName ||
            'text-5xl md:text-7xl font-heading font-black tracking-tight text-lifewood-serpent dark:text-white uppercase'
          }
        >
          {title}
        </h1>
      </div>
    </div>
  );
};
