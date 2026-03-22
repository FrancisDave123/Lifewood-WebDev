
import React from 'react';
import { 
  ArrowRight, 
  Database, 
  Cpu, 
  Car, 
  MessageSquare, 
  Languages, 
  Scan, 
  GitFork, 
  ArrowUpRight,
  Sparkles,
  BarChart3,
  Layers3
} from 'lucide-react';
import { PageTitleBanner } from './PageTitleBanner';

interface AIProjectsProps {
  theme?: 'light' | 'dark';
  navigateTo?: (page: import('../routes/routeTypes').PageRoute) => void;
}

interface ProjectAccordionItem {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  highlight: string;
  stats: string[];
}

export const AIProjects: React.FC<AIProjectsProps> = ({ navigateTo }) => {
  const projectItems: ProjectAccordionItem[] = [
    {
      id: '2.1',
      title: '2.1 AI Data Extraction',
      description: 'Using AI, we optimize the acquisition of image and text from multiple sources. Techniques include onsite scanning, drone photography, negotiation with archives and the formation of alliances with corporations, religious organizations and governments.',
      icon: <Database className="w-5 h-5" />,
      highlight: 'High-volume capture pipelines',
      stats: ['Image + text', 'Archive workflows', 'Source partnerships']
    },
    {
      id: '2.2',
      title: '2.2 Machine Learning Enablement',
      description: 'From simple data to deep learning, our data solutions are highly flexible and can enable a wide variety of ML systems, no matter how complex the model.',
      icon: <Cpu className="w-5 h-5" />,
      highlight: 'Flexible model-ready data',
      stats: ['Training sets', 'Deep learning', 'Workflow tuning']
    },
    {
      id: '2.3',
      title: '2.3 Autonomous Driving Technology',
      description: 'Our expertise in precision data labelling lays the groundwork for AI, so that it can process and adapt to the complexities of real-world conditions. We have implemented a diverse mapping methodology, that employs a wide range of data types, including 2D and 3D models, and combinations of both, to create a fully visualized cognitive driving system.\n\nMillions of images, videos and mapping data were annotated, effectively transitioning this technology from theoretical models to real-world applications - a significant leap forward for autonomous transport.\n\nLifewood remains at the forefront of this technology, pioneering the evolution of safe, efficient autonomous driving solutions.',
      icon: <Car className="w-5 h-5" />,
      highlight: '2D / 3D driving annotation',
      stats: ['Millions annotated', 'Road scenes', 'Safety-first']
    },
    {
      id: '2.4',
      title: '2.4 AI-Enabled Customer Service',
      description: 'AI-enabled customer service is now the quickest and most effective route for institutions to deliver personalized, proactive experiences that drive customer engagement. AI powered services can increase customer engagement, multiplying cross-sell and upsell opportunities. Guided by our experts AI customer service can transform customer relationships creating an improved cycle of service, satisfaction and increased customer engagement.',
      icon: <MessageSquare className="w-5 h-5" />,
      highlight: 'Personalized service systems',
      stats: ['Proactive support', 'Engagement loops', 'Upsell paths']
    },
    {
      id: '2.5',
      title: '2.5 Natural Language Processing and Speech Acquisition',
      description: 'We have partnered with some of the world\'s most advanced companies in NLP development. With a managed workforce that spans the globe, we offer solutions in over 50 language capabilities and can assess various dialects and accents for both text and audio data. We specialize in collecting and transcribing recordings from native speakers. This has involved tens of thousands of conversations, a scale made possible by our expertise in adapting industrial processes and our integration with AI.',
      icon: <Languages className="w-5 h-5" />,
      highlight: '50+ languages and dialects',
      stats: ['Native speakers', 'Text + audio', 'Global workforce']
    },
    {
      id: '2.6',
      title: '2.6 Computer Vision (CV)',
      description: 'Training AI to see and understand the world requires a high volume of quality training data. Lifewood provides total data solutions for your CV development from collection to annotation to classification and more, for video and image datasets enabling machines to interpret visual information. We have experience in a wide variety of applications including autonomous vehicles, farm monitoring, face recognition and more.',
      icon: <Scan className="w-5 h-5" />,
      highlight: 'Visual intelligence at scale',
      stats: ['Video + images', 'Classification', 'Real-world use']
    },
    {
      id: '2.7',
      title: '2.7 Genealogy',
      description: 'Powered by AI, Lifewood processes genealogical material at speed and scale, to conserve and illuminate family histories, national archives, corporate lists and records of all types. Lifewood has more than 18 years of experience capturing, scanning and processing genealogical data. In fact, Lifewood started with genealogy data as its core business, so that over the years we have accumulated vast knowledge in diverse types of genealogy indexing.\n\nWe have worked with all the major genealogy companies and have extensive experience in transcribing and indexing genealogical content in a wide variety of formats, including tabular, pre-printed forms and paragraph-style records.\n\nWorking across borders, with offices on every continent, our ability with multi-language projects has built an extensive capability spanning more than 50 languages and associated dialects. Now, powered by AI and the latest inter-office communication systems, we are transforming ever more efficient ways to service our clients, while keeping humanity at the centre of our activity.\n\nGenealogical material that we have experience with includes:\n\n- Census\n- Vital - BMD\n- Church and Parish Registers\n- Passenger Lists\n- Naturalisation\n- Military Records\n- Legal Records\n- Yearbooks',
      icon: <GitFork className="w-5 h-5" />,
      highlight: 'Preservation and indexing',
      stats: ['18+ years', '50+ languages', 'Archive scale']
    }
  ];

  return (
    <div className="pt-32 pb-20 animate-pop-out opacity-0">
      <div className="container mx-auto px-6">
        {/* Header Section */}
        <div className="mb-20 max-w-4xl animate-pop-out opacity-0" style={{ animationDelay: '100ms' }}>
          <PageTitleBanner
            id="ai-projects-page-title"
            title="AI PROJECTS"
            titleClassName="text-5xl md:text-7xl font-heading font-black tracking-tight text-lifewood-serpent dark:text-white uppercase"
            className="mb-10"
          />
          
          <p className="text-lg md:text-xl text-lifewood-serpent/60 dark:text-white/60 leading-relaxed mb-10 max-w-4xl font-medium">
            From building AI datasets in diverse languages and environments, to developing platforms that enhance productivity and open new opportunities in under-resourced economies, you'll see how Lifewood is shaping the future with innovation, integrity and a focus on people.
          </p>

          <button 
            onClick={() => navigateTo?.('contact-us')}
            className="group relative px-8 py-3 bg-lifewood-serpent dark:bg-lifewood-seaSalt text-white dark:text-lifewood-serpent rounded-full font-bold text-sm flex items-center gap-3 transition-all hover:scale-105 active:scale-95 shadow-[0_10px_30px_rgba(19,48,32,0.15)] dark:shadow-[0_10px_30px_rgba(0,0,0,0.3)]"
          >
            Contact Us 
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Handling Section */}
        <div className="mt-40 text-center mb-20">
          <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-lifewood-serpent dark:bg-white text-white dark:text-lifewood-serpent rounded-full font-black text-xs uppercase tracking-widest mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            Projects
          </div>
          <h2 className="text-4xl md:text-6xl font-heading font-black text-lifewood-serpent dark:text-white">
            What we currently handle
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[0.95fr_1.05fr] gap-12 xl:gap-16 items-start">
          <div className="lg:sticky lg:top-32 space-y-6">
            <div className="relative overflow-hidden rounded-[2.5rem] shadow-[0_35px_90px_-35px_rgba(0,0,0,0.45)] border border-white/40 dark:border-white/10 group">
              <img
                src="https://framerusercontent.com/images/RIqv6T7aFrp5Q9X85Zqy55KQ8x4.png?scale-down-to=1024&width=1856&height=2464"
                className="h-[540px] w-full object-cover transition-transform duration-[4s] group-hover:scale-110"
                alt="Workspace"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent"></div>
              <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
                <div className="max-w-sm rounded-[1.75rem] border border-white/15 bg-black/40 backdrop-blur-md p-5 text-white">
                  <p className="text-[10px] uppercase tracking-[0.35em] text-white/60 mb-2">Projects Lens</p>
                  <p className="text-sm md:text-base leading-relaxed text-white/85">
                    A visual snapshot of Lifewood&apos;s AI project landscape — capture, model enablement, mobility, service, NLP, vision, and archival intelligence.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {[
                { value: '7', label: 'Project areas' },
                { value: '50+', label: 'Languages' },
                { value: '18+', label: 'Years experience' }
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-[1.5rem] border border-lifewood-serpent/10 bg-white/75 dark:bg-white/5 p-4 text-center shadow-sm backdrop-blur-md"
                >
                  <div className="text-2xl md:text-3xl font-black text-lifewood-serpent dark:text-white">
                    {stat.value}
                  </div>
                  <div className="mt-1 text-[10px] uppercase tracking-[0.28em] text-lifewood-serpent/55 dark:text-white/55">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-5">
            {projectItems.map((item, index) => (
              <div
                key={item.id}
                className="group relative overflow-hidden rounded-[2rem] border border-lifewood-serpent/10 bg-white/80 dark:bg-white/5 p-6 md:p-7 shadow-[0_18px_50px_-30px_rgba(4,98,65,0.25)] backdrop-blur-md transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_24px_70px_-28px_rgba(4,98,65,0.38)]"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-lifewood-green/0 via-lifewood-saffron/0 to-lifewood-green/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative z-10 grid gap-5 md:grid-cols-[auto_1fr] md:items-start">
                  <div className="flex items-center gap-4 md:flex-col md:items-start md:gap-3">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-lifewood-serpent/5 dark:bg-white/10 text-lifewood-green transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6">
                      {item.icon}
                    </div>
                    <div className="rounded-full border border-lifewood-serpent/10 bg-white/85 dark:bg-white/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.28em] text-lifewood-serpent/60 dark:text-white/60">
                      {String(index + 1).padStart(2, '0')}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="text-xl md:text-2xl font-heading font-black text-lifewood-serpent dark:text-white">
                          {item.title}
                        </h3>
                        <div className="flex h-8 items-center rounded-full border border-lifewood-green/15 bg-lifewood-green/8 px-3 text-[10px] font-bold uppercase tracking-[0.24em] text-lifewood-green">
                          {item.highlight}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {item.stats.map((stat) => (
                        <span
                          key={stat}
                          className="inline-flex items-center gap-2 rounded-full border border-lifewood-serpent/10 bg-white/90 dark:bg-white/8 px-3 py-1.5 text-[11px] font-semibold text-lifewood-serpent/70 dark:text-white/70"
                        >
                          <BarChart3 className="h-3.5 w-3.5 text-lifewood-saffron" />
                          {stat}
                        </span>
                      ))}
                    </div>

                    <p className="max-w-3xl text-sm md:text-base leading-relaxed text-lifewood-serpent/72 dark:text-white/72">
                      {item.description}
                    </p>

                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
