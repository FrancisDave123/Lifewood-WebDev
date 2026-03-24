import React, { useEffect, useState } from 'react';
import type { LucideIcon } from 'lucide-react';

interface LegalSectionItem {
  id: string;
  title: string;
  icon: LucideIcon;
}

interface LegalDocumentSidebarProps {
  title: string;
  headerTargetId: string;
  sections: LegalSectionItem[];
}

export const LegalDocumentSidebar: React.FC<LegalDocumentSidebarProps> = ({
  title,
  headerTargetId,
  sections
}) => {
  const [showSidebarTitle, setShowSidebarTitle] = useState(false);

  useEffect(() => {
    const target = document.getElementById(headerTargetId);
    if (!target) {
      setShowSidebarTitle(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowSidebarTitle(!entry.isIntersecting);
      },
      {
        threshold: 0.2,
        rootMargin: '-96px 0px 0px 0px'
      }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [headerTargetId]);

  return (
    <div className="lg:col-span-4 sticky top-32 hidden lg:block self-start">
      <div className="glass-card rounded-3xl p-6 border-white/20 shadow-xl max-h-[calc(100vh-160px)] overflow-y-auto custom-scrollbar">
        <div
          className={`sticky top-0 z-20 overflow-hidden rounded-b-2xl bg-[#f7f5ef] shadow-[0_14px_28px_rgba(19,48,32,0.08)] transition-all duration-500 ease-out dark:bg-[#08110d] ${
            showSidebarTitle ? 'mb-6 max-h-28 opacity-100 translate-y-0' : 'mb-0 max-h-0 opacity-0 -translate-y-3'
          }`}
          aria-hidden={!showSidebarTitle}
        >
          <div className="border-b border-lifewood-serpent/10 px-1 pb-4 pt-2 dark:border-white/10">
            <p className="text-[11px] font-black uppercase tracking-[0.24em] text-lifewood-green dark:text-lifewood-yellow">
              Document
            </p>
            <h3 className="mt-2 text-2xl font-black tracking-tight text-lifewood-serpent dark:text-white">
              {title}
            </h3>
          </div>
        </div>

        <h3 className="text-lg font-bold mb-6 px-2 text-lifewood-serpent dark:text-white">Sections</h3>
        <nav className="space-y-1">
          {sections.map((section) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-lifewood-green/10 hover:text-lifewood-green transition-all group text-sm font-medium text-lifewood-serpent/70 dark:text-white/70"
            >
              <section.icon className="w-4 h-4 opacity-50 group-hover:opacity-100" />
              {section.title}
            </a>
          ))}
        </nav>
      </div>
    </div>
  );
};
