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
      <div className="flex items-start gap-4">
        <div className="mt-3 h-16 w-1.5 rounded-full bg-gradient-to-b from-lifewood-green to-lifewood-saffron" />
        <h1
          className={
            titleClassName ||
            'text-6xl md:text-7xl font-heading font-black tracking-tight text-lifewood-serpent dark:text-white uppercase'
          }
        >
          {title}
        </h1>
      </div>
    </div>
  );
};
