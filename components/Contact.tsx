import React, { useState } from 'react';
import { Mail, Phone, MapPin, Linkedin, Facebook, Instagram, Youtube, Send, CheckCircle } from 'lucide-react';

interface ContactProps {
  theme?: 'light' | 'dark';
  navigateTo?: (page: 'home' | 'services' | 'projects' | 'contact') => void;
}

export const Contact: React.FC<ContactProps> = ({ theme = 'light', navigateTo }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Get email and phone from environment variables
  const contactEmail = import.meta.env.VITE_CONTACT_EMAIL || 'info@lifewood.com';
  const contactPhone = import.meta.env.VITE_CONTACT_PHONE || '+1 (555) 123-4567';

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitted(true);
    setIsLoading(false);
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setFormData({ name: '', email: '', subject: '', message: '' });
      setIsSubmitted(false);
    }, 3000);
  };

  const contactInfo = [
    {
      icon: <Mail className="w-6 h-6" />,
      label: 'Email',
      value: contactEmail,
      href: `mailto:${contactEmail}`
    },
    {
      icon: <Phone className="w-6 h-6" />,
      label: 'Phone',
      value: contactPhone,
      href: `tel:${contactPhone.replace(/\D/g, '')}`
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      label: 'Location',
      value: 'Global Operations',
      href: '#'
    }
  ];

  const socialLinks = [
    { icon: <Linkedin className="w-5 h-5" />, href: '#', label: 'LinkedIn' },
    { icon: <Facebook className="w-5 h-5" />, href: '#', label: 'Facebook' },
    { icon: <Instagram className="w-5 h-5" />, href: '#', label: 'Instagram' },
    { icon: <Youtube className="w-5 h-5" />, href: '#', label: 'YouTube' }
  ];

  return (
    <div className="pt-32 pb-20 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-lifewood-green/10 dark:bg-lifewood-green/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-lifewood-saffron/10 dark:bg-lifewood-saffron/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Header Section */}
        <div className="text-center mb-20">
          <div className="inline-block px-4 py-1.5 bg-lifewood-serpent dark:bg-white text-white dark:text-lifewood-serpent rounded-full font-black text-xs uppercase tracking-widest mb-6 animate-fade-in">
            Get In Touch
          </div>
          <h1 className="text-5xl md:text-7xl font-heading font-black mb-6 tracking-tight text-lifewood-serpent dark:text-white uppercase animate-fade-in">
            Contact Us
          </h1>
          <p className="text-lg md:text-xl text-lifewood-serpent/60 dark:text-white/60 leading-relaxed max-w-2xl mx-auto font-medium animate-fade-in">
            Have a question or project in mind? We'd love to hear from you. Reach out and let's discuss how we can help transform your data into AI advantages.
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Contact Info and Features */}
          <div className="space-y-8">
            {/* Contact Info Cards */}
            <div className="space-y-4">
              <h3 className="text-2xl md:text-3xl font-heading font-bold text-lifewood-serpent dark:text-white mb-6">
                Reach Out
              </h3>
              
              {contactInfo.map((info, idx) => (
                <a
                  key={idx}
                  href={info.href}
                  className="group flex items-start gap-4 p-6 rounded-2xl glass hover:glass-alt transition-all duration-300 hover:scale-105 hover:shadow-lg"
                >
                  <div className="w-12 h-12 rounded-xl bg-lifewood-green/10 dark:bg-lifewood-yellow/10 flex items-center justify-center text-lifewood-green dark:text-lifewood-yellow flex-shrink-0 group-hover:scale-110 transition-transform">
                    {info.icon}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-lifewood-serpent/50 dark:text-white/50 uppercase tracking-widest mb-1">
                      {info.label}
                    </p>
                    <p className="text-lg font-bold text-lifewood-serpent dark:text-white group-hover:text-lifewood-green dark:group-hover:text-lifewood-yellow transition-colors">
                      {info.value}
                    </p>
                  </div>
                </a>
              ))}
            </div>

            {/* Social Links */}
            <div className="pt-8 border-t border-lifewood-serpent/10 dark:border-white/10">
              <h4 className="text-lg font-bold text-lifewood-serpent dark:text-white mb-6">
                Find Us On
              </h4>
              <div className="flex gap-4">
                {socialLinks.map((social, idx) => (
                  <a
                    key={idx}
                    href={social.href}
                    aria-label={social.label}
                    className="w-12 h-12 rounded-xl glass flex items-center justify-center text-lifewood-serpent dark:text-white hover:text-lifewood-green dark:hover:text-lifewood-yellow hover:scale-110 transition-all duration-300 hover:shadow-lg"
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Right Side - Contact Form */}
          <div>
            <div className="relative">
              {/* Glossy form container */}
              <div className="relative glass-alt rounded-3xl p-8 md:p-10 shadow-2xl border border-white/20 overflow-hidden group">
                {/* Animated gradient background */}
                <div className="absolute inset-0 bg-gradient-to-br from-lifewood-green/5 via-transparent to-lifewood-saffron/5 dark:from-lifewood-yellow/5 dark:via-transparent dark:to-lifewood-green/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="relative z-10">
                  <h3 className="text-3xl md:text-4xl font-heading font-bold text-lifewood-serpent dark:text-white mb-8">
                    Send Message
                  </h3>

                  {isSubmitted ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center animate-fade-in">
                      <div className="w-16 h-16 rounded-full bg-lifewood-green/10 dark:bg-lifewood-yellow/10 flex items-center justify-center mb-4 animate-bounce">
                        <CheckCircle className="w-8 h-8 text-lifewood-green dark:text-lifewood-yellow" />
                      </div>
                      <h4 className="text-xl font-bold text-lifewood-serpent dark:text-white mb-2">
                        Message Sent!
                      </h4>
                      <p className="text-lifewood-serpent/60 dark:text-white/60">
                        Thank you for reaching out. We'll get back to you shortly.
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      {/* Name Input */}
                      <div>
                        <label className="block text-sm font-bold text-lifewood-serpent dark:text-white mb-3 uppercase tracking-widest">
                          Name
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="Your name"
                          className="w-full px-6 py-3 rounded-2xl bg-lifewood-seaSalt/50 dark:bg-white/5 border-2 border-lifewood-serpent/10 dark:border-white/10 text-lifewood-serpent dark:text-white placeholder-lifewood-serpent/40 dark:placeholder-white/40 focus:outline-none focus:border-lifewood-green dark:focus:border-lifewood-yellow focus:bg-lifewood-seaSalt dark:focus:bg-white/10 transition-all duration-300"
                          required
                        />
                      </div>

                      {/* Email Input */}
                      <div>
                        <label className="block text-sm font-bold text-lifewood-serpent dark:text-white mb-3 uppercase tracking-widest">
                          Email
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="your@email.com"
                          className="w-full px-6 py-3 rounded-2xl bg-lifewood-seaSalt/50 dark:bg-white/5 border-2 border-lifewood-serpent/10 dark:border-white/10 text-lifewood-serpent dark:text-white placeholder-lifewood-serpent/40 dark:placeholder-white/40 focus:outline-none focus:border-lifewood-green dark:focus:border-lifewood-yellow focus:bg-lifewood-seaSalt dark:focus:bg-white/10 transition-all duration-300"
                          required
                        />
                      </div>

                      {/* Subject Input */}
                      <div>
                        <label className="block text-sm font-bold text-lifewood-serpent dark:text-white mb-3 uppercase tracking-widest">
                          Subject
                        </label>
                        <input
                          type="text"
                          name="subject"
                          value={formData.subject}
                          onChange={handleInputChange}
                          placeholder="What's this about?"
                          className="w-full px-6 py-3 rounded-2xl bg-lifewood-seaSalt/50 dark:bg-white/5 border-2 border-lifewood-serpent/10 dark:border-white/10 text-lifewood-serpent dark:text-white placeholder-lifewood-serpent/40 dark:placeholder-white/40 focus:outline-none focus:border-lifewood-green dark:focus:border-lifewood-yellow focus:bg-lifewood-seaSalt dark:focus:bg-white/10 transition-all duration-300"
                          required
                        />
                      </div>

                      {/* Message Textarea */}
                      <div>
                        <label className="block text-sm font-bold text-lifewood-serpent dark:text-white mb-3 uppercase tracking-widest">
                          Message
                        </label>
                        <textarea
                          name="message"
                          value={formData.message}
                          onChange={handleInputChange}
                          placeholder="Your message here..."
                          rows={5}
                          className="w-full px-6 py-3 rounded-2xl bg-lifewood-seaSalt/50 dark:bg-white/5 border-2 border-lifewood-serpent/10 dark:border-white/10 text-lifewood-serpent dark:text-white placeholder-lifewood-serpent/40 dark:placeholder-white/40 focus:outline-none focus:border-lifewood-green dark:focus:border-lifewood-yellow focus:bg-lifewood-seaSalt dark:focus:bg-white/10 transition-all duration-300 resize-none"
                          required
                        ></textarea>
                      </div>

                      {/* Submit Button */}
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-4 px-6 bg-gradient-to-r from-lifewood-green to-lifewood-green/80 dark:from-lifewood-yellow dark:to-lifewood-yellow/80 text-white dark:text-lifewood-serpent rounded-2xl font-bold text-lg uppercase tracking-widest hover:shadow-2xl hover:shadow-lifewood-green/30 dark:hover:shadow-lifewood-yellow/30 hover:scale-105 transition-all duration-300 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                      >
                        {isLoading ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            Sending...
                          </>
                        ) : (
                          <>
                            Send Message
                            <Send className="w-5 h-5" />
                          </>
                        )}
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA Section */}
        <div className="mt-24 p-12 rounded-3xl glass-alt border border-white/20 text-center">
          <h3 className="text-3xl md:text-4xl font-heading font-bold text-lifewood-serpent dark:text-white mb-4">
            Looking for Something Specific?
          </h3>
          <p className="text-lg text-lifewood-serpent/60 dark:text-white/60 mb-8 max-w-2xl mx-auto">
            Explore our services and projects to understand how Lifewood can transform your data into AI advantages.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => navigateTo?.('services')}
              className="px-8 py-3 bg-lifewood-green text-white rounded-full font-bold hover:shadow-xl hover:shadow-lifewood-green/30 transition-all hover:scale-105"
            >
              View Services
            </button>
            <button 
              onClick={() => navigateTo?.('projects')}
              className="px-8 py-3 border-2 border-lifewood-serpent dark:border-white text-lifewood-serpent dark:text-white rounded-full font-bold hover:bg-lifewood-serpent/5 dark:hover:bg-white/5 transition-all hover:scale-105"
            >
              Explore Projects
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
