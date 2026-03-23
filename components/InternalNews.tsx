import React, { useState } from 'react';
import { ArrowRight, Calendar, Globe, Users, Zap, Award, MapPin, BookOpen } from 'lucide-react';
import type { PageRoute } from '../routes/routeTypes';
import { PageHeroHeader } from './PageHeroHeader';

interface InternalNewsProps {
  navigateTo?: (page: PageRoute) => void;
}

const newsItems = [
  {
    id: 1,
    category: 'Global Expansion',
    icon: Globe,
    date: 'March 2026',
    tag: 'New Office',
    title: 'Lifewood Opens New Delivery Centre in Jakarta',
    excerpt:
      'Our Indonesia expansion is officially live. The Jakarta Data Delivery Centre adds 200+ seats and deepens our ASEAN footprint, supporting multilingual AI data projects across Bahasa Indonesia, English, and Arabic.',
    accent: '#046241',
    light: '#E8F2ED',
  },
  {
    id: 2,
    category: 'People & Culture',
    icon: Users,
    date: 'February 2026',
    tag: 'ESG Milestone',
    title: 'Pottya Team Reaches 70% Female Workforce',
    excerpt:
      'Our Bangladesh Pottya team hit a landmark ESG milestone — over 70% of roles are now held by women, with continued focus on hiring people with disabilities. This reflects our commitment to inclusive growth across every region we operate in.',
    accent: '#FFB347',
    light: '#FFF5E5',
  },
  {
    id: 3,
    category: 'Technology',
    icon: Zap,
    date: 'January 2026',
    tag: 'Product Update',
    title: 'IVA (Intelligent Virtual Assistant) Enters Beta',
    excerpt:
      'The long-anticipated IVA platform is now in internal beta. IVA integrates GPT and Gemini models with Lifewood\'s proprietary data library to deliver context-aware responses for enterprise clients across ASEAN and China.',
    accent: '#046241',
    light: '#E8F2ED',
  },
  {
    id: 4,
    category: 'Events',
    icon: Award,
    date: 'March 2026',
    tag: 'Live Now',
    title: 'Rootstech 2026 — Lifewood on the World Stage',
    excerpt:
      'We are live at Rootstech 2026, showcasing our AI-powered genealogy data solutions. The team is presenting Lifewood\'s bridge between Eastern and Western data ecosystems to an audience of global research partners and investors.',
    accent: '#FFB347',
    light: '#FFF5E5',
    featured: true,
  },
  {
    id: 5,
    category: 'Strategy',
    icon: MapPin,
    date: 'December 2025',
    tag: 'Partnership',
    title: 'Malaysia HQ Strengthens ASEAN–China Bridge Role',
    excerpt:
      'Following the November 2023 Strategic Positioning document, Lifewood\'s Kuala Lumpur headquarters has been formally designated as the primary conduit for cross-border data projects connecting China, Singapore, and South-East Asia.',
    accent: '#046241',
    light: '#E8F2ED',
  },
  {
    id: 6,
    category: 'People & Culture',
    icon: Users,
    date: 'November 2025',
    tag: 'Internal',
    title: 'Global Town Hall: Innovation & You',
    excerpt:
      'Over 1,200 Lifewood team members across 8 countries joined our annual Global Town Hall. Leadership shared the 2026 roadmap focused on AI data library expansion, IVA roll-out, and the next phase of ESG reporting aligned with global standards.',
    accent: '#FFB347',
    light: '#FFF5E5',
  },
  {
    id: 7,
    category: 'Learning & Development',
    icon: BookOpen,
    date: 'October 2025',
    tag: 'Training',
    title: 'Lifewood Academy Launches AI Upskilling Programme',
    excerpt:
      'Lifewood Academy has rolled out a company-wide AI upskilling programme for all departments. The 12-week curriculum covers prompt engineering, data annotation best practices, and responsible AI usage — available in English, Mandarin, and Bahasa Malaysia.',
    accent: '#046241',
    light: '#E8F2ED',
  },
];

export const InternalNews: React.FC<InternalNewsProps> = ({ navigateTo }) => {
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  const handleContactClick = () => {
    navigateTo?.('contact-us');
  };

  const featured = newsItems.find((n) => n.featured);
  const rest = newsItems.filter((n) => !n.featured);

  return (
    <div
      className="pt-32 pb-20 min-h-screen bg-lifewood-seaSalt dark:bg-[#020804] relative overflow-x-hidden animate-pop-out opacity-0"
      style={{ fontFamily: "'Manrope', sans-serif" }}
    >
      {/* Background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-lifewood-green/10 dark:bg-lifewood-green/5 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-lifewood-saffron/10 dark:bg-lifewood-saffron/5 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: '1s' }}
        />
      </div>

      <div className="container mx-auto px-6 relative z-10">

        {/* ── HERO HEADER ── */}
        <div className="mb-16 animate-pop-out opacity-0" style={{ animationDelay: '100ms' }}>
          <PageHeroHeader
            id="internal-news-page-title"
            eyebrow="Latest update"
            title="Rootstech 2026"
            description="Coming Soon! Stay tuned for more updates on our participation in Rootstech 2026. We are excited to showcase our latest innovations in AI data solutions and global research capabilities."
            cta={
              <button
                onClick={handleContactClick}
                className="group inline-flex items-center gap-3 rounded-full bg-lifewood-serpent px-8 py-3 text-sm font-bold text-white shadow-[0_10px_30px_rgba(19,48,32,0.15)] transition-transform hover:scale-105 dark:bg-lifewood-seaSalt dark:text-lifewood-serpent"
              >
                Contact Us <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            }
          />
        </div>

        {/* ── VIDEO ── */}
        <div className="animate-pop-out opacity-0 mb-20" style={{ animationDelay: '200ms' }}>
          <div className="bg-gray-100 dark:bg-white/5 rounded-[2.5rem] p-4 md:p-8 shadow-inner">
            <div className="relative aspect-video w-full rounded-2xl overflow-hidden shadow-2xl">
              <iframe
                className="absolute inset-0 w-full h-full"
                src="https://www.youtube.com/embed/ccyrQ87EJag?si=IaEMhioSCF9R-Q-4"
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            </div>
          </div>
        </div>

        {/* ── SECTION LABEL ── */}
        <div className="animate-pop-out opacity-0 mb-10" style={{ animationDelay: '280ms' }}>
          <div className="flex items-center gap-4">
            <div className="h-px flex-1 bg-lifewood-serpent/15 dark:bg-white/10" />
            <span
              className="text-xs font-bold tracking-[0.2em] uppercase px-4 py-1.5 rounded-full"
              style={{ color: '#046241', background: '#E8F2ED' }}
            >
              Internal News
            </span>
            <div className="h-px flex-1 bg-lifewood-serpent/15 dark:bg-white/10" />
          </div>
        </div>

        {/* ── FEATURED CARD ── */}
        {featured && (
          <div
            className="animate-pop-out opacity-0 mb-8 rounded-3xl overflow-hidden shadow-xl cursor-pointer transition-transform duration-300 hover:-translate-y-1"
            style={{
              animationDelay: '340ms',
              background: '#133020',
            }}
            onMouseEnter={() => setHoveredId(featured.id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            <div className="p-8 md:p-10 flex flex-col md:flex-row gap-8 items-start">
              {/* Icon bubble */}
              <div
                className="flex-shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center"
                style={{ background: '#FFB347' }}
              >
                <featured.icon className="w-8 h-8 text-white" strokeWidth={1.8} />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-3 mb-3">
                  <span
                    className="text-xs font-bold tracking-widest uppercase px-3 py-1 rounded-full"
                    style={{ background: '#FFB347', color: '#133020' }}
                  >
                    {featured.tag}
                  </span>
                  <span className="flex items-center gap-1.5 text-xs text-white/50">
                    <Calendar className="w-3.5 h-3.5" />
                    {featured.date}
                  </span>
                  <span className="text-xs text-white/40 uppercase tracking-widest">{featured.category}</span>
                </div>

                <h3 className="text-2xl md:text-3xl font-bold text-white mb-3 leading-snug">
                  {featured.title}
                </h3>
                <p className="text-white/65 text-sm leading-relaxed max-w-2xl">{featured.excerpt}</p>
              </div>
            </div>
          </div>
        )}

        {/* ── NEWS GRID ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {rest.map((item, idx) => {
            const Icon = item.icon;
            const isHovered = hoveredId === item.id;

            return (
              <div
                key={item.id}
                className="animate-pop-out opacity-0 group rounded-2xl overflow-hidden shadow-md cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-xl flex flex-col"
                style={{
                  animationDelay: `${380 + idx * 60}ms`,
                  background: 'var(--card-bg, #ffffff)',
                }}
                onMouseEnter={() => setHoveredId(item.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                {/* Top accent strip */}
                <div
                  className="h-1.5 w-full transition-all duration-300"
                  style={{ background: isHovered ? item.accent : item.light }}
                />

                <div className="p-6 flex flex-col flex-1 bg-white dark:bg-white/5">
                  {/* Header row */}
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: item.light }}
                    >
                      <Icon className="w-5 h-5" style={{ color: item.accent }} strokeWidth={1.8} />
                    </div>
                    <span
                      className="text-xs font-bold tracking-widest uppercase px-2.5 py-1 rounded-full"
                      style={{ background: item.light, color: item.accent }}
                    >
                      {item.tag}
                    </span>
                  </div>

                  {/* Meta */}
                  <div className="flex items-center gap-2 mb-3">
                    <Calendar className="w-3 h-3 text-lifewood-serpent/40 dark:text-white/30" />
                    <span className="text-xs text-lifewood-serpent/50 dark:text-white/40">{item.date}</span>
                    <span className="text-lifewood-serpent/20 dark:text-white/20">·</span>
                    <span className="text-xs text-lifewood-serpent/50 dark:text-white/40 uppercase tracking-wide">{item.category}</span>
                  </div>

                  {/* Title */}
                  <h3
                    className="text-base font-bold mb-2 leading-snug transition-colors duration-200"
                    style={{ color: isHovered ? item.accent : '#133020' }}
                  >
                    {item.title}
                  </h3>

                  {/* Excerpt */}
                  <p className="text-xs leading-relaxed text-lifewood-serpent/60 dark:text-white/50 flex-1">
                    {item.excerpt}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── BOTTOM CTA ── */}
        <div
          className="animate-pop-out opacity-0 mt-16 rounded-3xl p-10 text-center"
          style={{ animationDelay: '700ms', background: '#f5eedb' }}
        >
          <p className="text-xs font-bold tracking-[0.2em] uppercase mb-3" style={{ color: '#046241' }}>
            Always On · Never Off
          </p>
          <h4 className="text-2xl font-bold mb-2" style={{ color: '#133020' }}>
            Have a story to share?
          </h4>
          <p className="text-sm text-lifewood-serpent/60 mb-6">
            Submit your team update or milestone to the communications team.
          </p>
          <button
            onClick={handleContactClick}
            className="group inline-flex items-center gap-2 rounded-full px-7 py-3 text-sm font-bold text-white transition-transform hover:scale-105"
            style={{ background: '#133020' }}
          >
            Get in touch <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

      </div>
    </div>
  );
};