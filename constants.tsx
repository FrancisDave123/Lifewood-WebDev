
import { NavItem, StatItem, CapabilityItem } from './types';

export const LOGO_URL = "https://framerusercontent.com/images/BZSiFYgRc4wDUAuEybhJbZsIBQY.png";
// Updated with the dark-mode specific logo from the brand assets
export const LOGO_DARK_URL = "https://framerusercontent.com/images/BZSiFYgRc4wDUAuEybhJbZsIBQY.png";

export const NAV_ITEMS: NavItem[] = [
  { label: 'Home', href: '#home' },
  { 
    label: 'AI Initiatives', 
    href: '#initiatives',
    subItems: [
      { label: 'AI Services', href: '#services' },
      { label: 'AI Project', href: '#project' }
    ]
  },
  { label: 'Our Company', href: '#company' },
  { label: 'What We Offer', href: '#offer' },
  { label: 'Philanthropy & Impact', href: '#impact' },
  { label: 'Careers', href: '#careers' },
  { label: 'Contact Us', href: '#contact' },
  { label: 'Internal News', href: '#news' },
];

export const STATS: StatItem[] = [
  { 
    value: 40, 
    suffix: '+', 
    label: 'Global Delivery Centers',
    description: 'Lifewood operates 40+ secure delivery centers worldwide, providing the backbone for AI data operations. These hubs ensure sensitive data is processed in controlled environments, with industrialized workflows and strict compliance standards across all regions.'
  },
  { 
    value: 30, 
    suffix: '+', 
    label: 'Countries Across All Continents',
    description: 'Our physical presence spans across more than 30 countries, allowing us to source local expertise and provide hyper-localized data solutions for global brands.'
  },
  { 
    value: 50, 
    suffix: '+', 
    label: 'Language Capabilities and Dialects',
    description: 'We support a vast array of languages and specific regional dialects, ensuring your AI models are culturally nuanced and linguistically accurate.'
  },
  { 
    value: 56000, 
    suffix: '+', 
    label: 'Global Online Resources',
    description: 'Our extensive network of specialized contributors provides diverse datasets for every industry, from medical imaging to autonomous driving.'
  },
];

export const CAPABILITIES: CapabilityItem[] = [
  {
    title: 'Audio',
    description: 'High-fidelity audio transcription, speaker diarization, and emotive analysis for sophisticated speech AI models.',
    imageUrl: 'https://framerusercontent.com/images/kuZUhOvQEHugeoHtgKZVFUs8.png?scale-down-to=512&width=1024&height=1024',
    gradient: 'from-blue-500/20 to-lifewood-green/20'
  },
  {
    title: 'Text',
    description: 'Multi-lingual NLP datasets, sentiment analysis, and semantic tagging across hundreds of languages and dialects.',
    imageUrl: 'https://framerusercontent.com/images/ovEfxTUrgcgO1TrMPB68SxHjM0.png?scale-down-to=1024&width=2268&height=3402',
    gradient: 'from-lifewood-yellow/20 to-lifewood-green/20'
  },
  {
    title: 'Image',
    description: 'Precision image annotation, object detection, and segmentation for computer vision applications.',
    imageUrl: 'https://framerusercontent.com/images/8fY93Grrd08Utrptk3kjoPy6pA.jpg?scale-down-to=512&width=640&height=427',
    gradient: 'from-lifewood-saffron/20 to-lifewood-serpent/20'
  },
  {
    title: 'Video',
    description: 'Temporal video tracking, action recognition, and frame-by-frame annotation for dynamic visual systems.',
    imageUrl: 'https://framerusercontent.com/images/0QB9I1axbVfYe38G39RTGd72GXo.png?scale-down-to=1024&width=2268&height=3402',
    gradient: 'from-lifewood-green/20 to-lifewood-saffron/20'
  }
];
