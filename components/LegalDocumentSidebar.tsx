import React, { useEffect, useRef, useState } from 'react';
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
  const [activeSectionId, setActiveSectionId] = useState<string>(sections[0]?.id ?? '');
  const scrollContainerRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    if (!sections.length) return;

    const updateActiveSection = () => {
      const threshold = 220;
      let currentId = sections[0].id;

      for (const section of sections) {
        const element = document.getElementById(section.id);
        if (!element) continue;

        const rect = element.getBoundingClientRect();
        if (rect.top <= threshold) {
          currentId = section.id;
        } else {
          break;
        }
      }

      setActiveSectionId((previous) => (previous === currentId ? previous : currentId));
    };

    updateActiveSection();
    window.addEventListener('scroll', updateActiveSection, { passive: true });
    window.addEventListener('resize', updateActiveSection);

    return () => {
      window.removeEventListener('scroll', updateActiveSection);
      window.removeEventListener('resize', updateActiveSection);
    };
  }, [sections]);

  return (
    <div className="lg:col-span-4 sticky top-32 hidden lg:flex lg:max-h-[calc(100vh-8rem)] lg:flex-col self-start">
      <div
        className={`flex-shrink-0 px-1 pb-4 transition-all duration-500 ease-out ${
          showSidebarTitle ? 'max-h-24 opacity-100 translate-y-0' : 'max-h-0 opacity-0 -translate-y-3 pointer-events-none'
        }`}
        aria-hidden={!showSidebarTitle}
      >
        <div className="flex items-start gap-3">
          <div className="mt-1 h-12 w-1.5 rounded-full bg-gradient-to-b from-lifewood-green to-lifewood-saffron" />
          <div className="min-w-0">
            <p className="text-[10px] font-black uppercase tracking-[0.26em] text-lifewood-green dark:text-lifewood-yellow">
              Document
            </p>
            <h3 className="mt-1 text-2xl font-black tracking-tight text-lifewood-serpent dark:text-white">
              {title}
            </h3>
          </div>
        </div>
      </div>

      <div
        ref={scrollContainerRef}
        onWheel={(event) => {
          const container = scrollContainerRef.current;
          if (!container) return;

          const canScroll = container.scrollHeight > container.clientHeight;
          if (!canScroll) return;

          event.preventDefault();
          event.stopPropagation();
          container.scrollTop += event.deltaY;
        }}
        className="glass-card min-h-0 flex-1 rounded-3xl border-white/20 shadow-xl overflow-y-auto overscroll-contain custom-scrollbar"
      >
        <div
          className="sticky top-0 z-20 mb-4 border-b border-lifewood-serpent/10 bg-[#f7f5ef] px-6 py-5 dark:border-white/10 dark:bg-[#08110d]"
        >
          <h3 className="text-lg font-bold text-lifewood-serpent dark:text-white">Sections</h3>
        </div>
        <nav className="space-y-1 px-6 pb-6">
          {sections.map((section) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              onClick={(event) => {
                event.preventDefault();
                setActiveSectionId(section.id);
                const target = document.getElementById(section.id);
                if (!target) return;

                const offset = 120;
                const top = target.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({ top, behavior: 'smooth' });
              }}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group text-sm font-medium ${
                activeSectionId === section.id
                  ? 'bg-lifewood-green/10 text-lifewood-green shadow-[inset_0_0_0_1px_rgba(4,98,65,0.08)] dark:bg-white/10 dark:text-lifewood-yellow'
                  : 'text-lifewood-serpent/70 hover:bg-lifewood-green/10 hover:text-lifewood-green dark:text-white/70 dark:hover:text-lifewood-yellow'
              }`}
            >
              <section.icon className={`w-4 h-4 transition-opacity duration-300 ${
                activeSectionId === section.id ? 'opacity-100' : 'opacity-50 group-hover:opacity-100'
              }`} />
              {section.title}
            </a>
          ))}
        </nav>
      </div>
    </div>
  );
};
