
import React, { useState } from 'react';
import { 
  ArrowRight, 
  Database, 
  Cpu, 
  Car, 
  MessageSquare, 
  Languages, 
  Scan, 
  GitFork, 
  Plus, 
  X,
  ArrowUpRight
} from 'lucide-react';

interface AIProjectsProps {
  theme?: 'light' | 'dark';
}

interface ProjectAccordionItem {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

export const AIProjects: React.FC<AIProjectsProps> = ({ theme = 'light' }) => {
  const [expandedId, setExpandedId] = useState<string | null>('2.1');

  const scrollToContact = () => {
    const el = document.getElementById('contact');
    if (el) {
      const offset = 80;
      const elementPosition = el.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  };

  const projectItems: ProjectAccordionItem[] = [
    {
      id: '2.1',
      title: '2.1 AI Data Extraction',
      description: 'Using AI, we optimize the acquisition of image and text from multiple sources. Techniques include onsite scanning, drone photography, negotiation with archives and the formation of alliances with corporations, religious organizations and governments.',
      icon: <Database className="w-5 h-5" />
    },
    {
      id: '2.2',
      title: '2.2 Machine Learning Enablement',
      description: 'From simple data to deep learning, our data solutions are highly flexible and can enable a wide variety of ML systems, no matter how complex the model.',
      icon: <Cpu className="w-5 h-5" />
    },
    {
      id: '2.3',
      title: '2.3 Autonomous Driving Technology',
      description: 'Our expertise in precision data labelling lays the groundwork for AI, so that it can process and adapt to the complexities of real-world conditions. We have implemented a diverse mapping methodology, that employs a wide range of data types, including 2D and 3D models, and combinations of both, to create a fully visualized cognitive driving system.\n\nMillions of images, videos and mapping data were annotated, effectively transitioning this technology from theoretical models to real-world applications - a significant leap forward for autonomous transport.\n\nLifewood remains at the forefront of this technology, pioneering the evolution of safe, efficient autonomous driving solutions.',
      icon: <Car className="w-5 h-5" />
    },
    {
      id: '2.4',
      title: '2.4 AI-Enabled Customer Service',
      description: 'AI-enabled customer service is now the quickest and most effective route for institutions to deliver personalized, proactive experiences that drive customer engagement. AI powered services can increase customer engagement, multiplying cross-sell and upsell opportunities. Guided by our experts AI customer service can transform customer relationships creating an improved cycle of service, satisfaction and increased customer engagement.',
      icon: <MessageSquare className="w-5 h-5" />
    },
    {
      id: '2.5',
      title: '2.5 Natural Language Processing and Speech Acquisition',
      description: 'We have partnered with some of the world\'s most advanced companies in NLP development. With a managed workforce that spans the globe, we offer solutions in over 50 language capabilities and can assess various dialects and accents for both text and audio data. We specialize in collecting and transcribing recordings from native speakers. This has involved tens of thousands of conversations, a scale made possible by our expertise in adapting industrial processes and our integration with AI.',
      icon: <Languages className="w-5 h-5" />
    },
    {
      id: '2.6',
      title: '2.6 Computer Vision (CV)',
      description: 'Training AI to see and understand the world requires a high volume of quality training data. Lifewood provides total data solutions for your CV development from collection to annotation to classification and more, for video and image datasets enabling machines to interpret visual information. We have experience in a wide variety of applications including autonomous vehicles, farm monitoring, face recognition and more.',
      icon: <Scan className="w-5 h-5" />
    },
    {
      id: '2.7',
      title: '2.7 Genealogy',
      description: 'Powered by AI, Lifewood processes genealogical material at speed and scale, to conserve and illuminate family histories, national archives, corporate lists and records of all types. Lifewood has more than 18 years of experience capturing, scanning and processing genealogical data. In fact, Lifewood started with genealogy data as its core business, so that over the years we have accumulated vast knowledge in diverse types of genealogy indexing.\n\nWe have worked with all the major genealogy companies and have extensive experience in transcribing and indexing genealogical content in a wide variety of formats, including tabular, pre-printed forms and paragraph-style records.\n\nWorking across borders, with offices on every continent, our ability with multi-language projects has built an extensive capability spanning more than 50 languages and associated dialects. Now, powered by AI and the latest inter-office communication systems, we are transforming ever more efficient ways to service our clients, while keeping humanity at the centre of our activity.\n\nGenealogical material that we have experience with includes:\n\n- Census\n- Vital - BMD\n- Church and Parish Registers\n- Passenger Lists\n- Naturalisation\n- Military Records\n- Legal Records\n- Yearbooks',
      icon: <GitFork className="w-5 h-5" />
    }
  ];

  return (
    <div className="pt-32 pb-20 animate-pop-out opacity-0">
      <div className="container mx-auto px-6">
        {/* Header Section */}
        <div className="mb-20 max-w-4xl animate-pop-out opacity-0" style={{ animationDelay: '100ms' }}>
          <div className="flex items-center gap-4 mb-6">
            <div className="flex gap-2">
              <div className="w-4 h-4 rounded-full bg-lifewood-saffron"></div>
              <div className="w-4 h-4 rounded-full border-2 border-lifewood-serpent dark:border-white"></div>
            </div>
            <div className="w-24 h-px bg-lifewood-serpent/30 dark:bg-white/30 border-dashed border-t"></div>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-heading font-black mb-10 tracking-tight text-lifewood-serpent dark:text-white uppercase">
            AI Projects
          </h1>
          
          <p className="text-lg md:text-xl text-lifewood-serpent/60 dark:text-white/60 leading-relaxed mb-10 max-w-4xl font-medium">
            From building AI datasets in diverse languages and environments, to developing platforms that enhance productivity and open new opportunities in under-resourced economies, you'll see how Lifewood is shaping the future with innovation, integrity and a focus on people.
          </p>

          <button 
            onClick={scrollToContact}
            className="group flex items-center gap-2 px-6 py-2.5 bg-lifewood-saffron text-lifewood-serpent rounded-full font-bold text-sm hover:scale-105 transition-all shadow-lg"
          >
            Contact Us 
            <div className="w-6 h-6 rounded-full bg-lifewood-serpent flex items-center justify-center text-white">
              <ArrowUpRight className="w-3 h-3" />
            </div>
          </button>
        </div>

        {/* Handling Section */}
        <div className="mt-40 text-center mb-20">
          <div className="inline-block px-4 py-1.5 bg-lifewood-serpent dark:bg-white text-white dark:text-lifewood-serpent rounded-full font-black text-xs uppercase tracking-widest mb-6">
            Projects
          </div>
          <h2 className="text-4xl md:text-6xl font-heading font-black text-lifewood-serpent dark:text-white">
            What we currently handle
          </h2>
        </div>

        {/* Content Split */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Image Side */}
          <div className="relative rounded-[2rem] overflow-hidden shadow-2xl group aspect-[4/3] lg:aspect-auto lg:h-[700px]">
            <img 
              src="https://framerusercontent.com/images/RIqv6T7aFrp5Q9X85Zqy55KQ8x4.png?scale-down-to=1024&width=1856&height=2464" 
              className="w-full h-full object-cover transition-transform duration-[4s] group-hover:scale-110" 
              alt="Workspace" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
          </div>

          {/* Accordion Side */}
          <div className="flex flex-col border-t border-lifewood-serpent/10 dark:border-white/10">
            {projectItems.map((item) => (
              <div 
                key={item.id}
                className="border-b border-lifewood-serpent/10 dark:border-white/10 overflow-hidden transition-all duration-500"
              >
                <button
                  onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
                  className={`w-full flex items-center justify-between py-8 text-left group transition-colors ${
                    expandedId === item.id 
                      ? 'text-lifewood-serpent dark:text-white' 
                      : 'text-lifewood-serpent/40 dark:text-white/40 hover:text-lifewood-serpent dark:hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-6">
                    <div className={`transition-transform duration-500 ${expandedId === item.id ? 'scale-110 rotate-12 text-lifewood-green' : 'group-hover:scale-110'}`}>
                      {item.icon}
                    </div>
                    <span className="text-xl md:text-2xl font-heading font-bold uppercase tracking-tight">
                      {item.title}
                    </span>
                  </div>
                  <div className="flex-shrink-0 ml-4">
                    {expandedId === item.id ? (
                      <X className="w-6 h-6 opacity-40" strokeWidth={1} />
                    ) : (
                      <Plus className="w-6 h-6 opacity-40 group-hover:opacity-100 transition-opacity" strokeWidth={1} />
                    )}
                  </div>
                </button>
                
                <div 
                  className={`transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] overflow-hidden ${
                    expandedId === item.id ? 'max-h-[1000px] opacity-100 mb-8' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="pl-6 md:pl-14 pr-2 md:pr-4">
                    <div className="space-y-4 text-lifewood-serpent/60 dark:text-white/60 leading-relaxed font-medium text-base md:text-lg max-w-full lg:max-w-2xl">
                      {item.description.split('\n\n').map((para, pIdx) => {
                        const lines = para.split('\n').map(l => l.trim()).filter(Boolean);
                        const isList = lines.length > 0 && lines.every(l => l.startsWith('-'));

                        if (isList) {
                          const items = lines.map(l => l.replace(/^-\s*/, ''));
                          return (
                            <ul key={pIdx} className="list-disc pl-6 space-y-2">
                              {items.map((it, i) => (
                                <li key={i}>{it}</li>
                              ))}
                            </ul>
                          );
                        }

                        return <p key={pIdx}>{para}</p>;
                      })}
                    </div>
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
