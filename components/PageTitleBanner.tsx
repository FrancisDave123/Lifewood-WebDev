import React from 'react';

interface PageTitleBannerProps {
  title: string;
  id?: string;
  className?: string;
  titleClassName?: string;
}

export const PageTitleBanner: React.FC<PageTitleBannerProps> = ({
  title,
  id,
  className,
  titleClassName
}) => {
  return (
    <div id={id} className={`w-full max-w-5xl ${className || ''}`}>
      <div className="rounded-[2rem] bg-gradient-to-r from-lifewood-green via-lifewood-saffron to-lifewood-green p-[1px] shadow-[0_18px_45px_-24px_rgba(4,98,65,0.45)]">
        <div className="flex min-h-[92px] w-full items-center rounded-[calc(2rem-1px)] bg-lifewood-seaSalt/95 px-6 py-5 dark:bg-[#06110c]/95 md:px-8 md:py-6">
          <h1
            className={
              titleClassName ||
              'text-5xl md:text-7xl font-heading font-black tracking-tight text-lifewood-serpent dark:text-white uppercase whitespace-pre-line'
            }
          >
            {title}
          </h1>
        </div>
      </div>
    </div>
  );
};
