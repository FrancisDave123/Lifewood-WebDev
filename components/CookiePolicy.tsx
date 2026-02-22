
import React from 'react';
import { ArrowLeft, Sparkles, Shield, Eye, Globe, Info, Settings, Bell, MessageSquare } from 'lucide-react';

interface CookiePolicyProps {
  navigateTo?: (page: any) => void;
}

export const CookiePolicy: React.FC<CookiePolicyProps> = ({ navigateTo }) => {
  const sections = [
    { id: 'what-are-cookies', title: '1. What Are Cookies?', icon: Info },
    { id: 'how-we-use', title: '2. How Lifewood Uses Cookies', icon: Eye },
    { id: 'third-party', title: '3. Third-Party Cookies', icon: Globe },
    { id: 'choices', title: '4. Your Cookie Choices', icon: Settings },
    { id: 'managing', title: '5. Managing Cookies on Lifewood', icon: Settings },
    { id: 'changes', title: '6. Changes to This Cookie Policy', icon: Bell },
    { id: 'contact', title: '7. Contact Us', icon: MessageSquare },
  ];

  return (
    <div className="pt-32 pb-20 min-h-screen bg-lifewood-seaSalt dark:bg-[#020804] relative">
      {/* Background Decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-[50rem] h-[50rem] bg-lifewood-green/5 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-0 right-0 w-[40rem] h-[40rem] bg-lifewood-saffron/5 rounded-full blur-[100px]"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="mb-16 animate-pop-out">
          <button 
            onClick={() => navigateTo?.('home')}
            className="flex items-center gap-2 text-lifewood-serpent/60 dark:text-white/60 hover:text-lifewood-green transition-colors mb-8 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </button>
          
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full glass border border-lifewood-green/20 mb-6">
            <Sparkles className="w-4 h-4 text-lifewood-green" />
            <span className="text-xs font-black uppercase tracking-[0.24em] text-lifewood-serpent/70 dark:text-white/70">
              Legal & Privacy
            </span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-heading font-black mb-6 tracking-tight text-lifewood-serpent dark:text-white uppercase">
            Cookie Policy
          </h1>
          <p className="text-xl text-lifewood-serpent/60 dark:text-white/60 max-w-3xl">
            At Lifewood Data Technology Ltd., we use cookies and similar tracking technologies to enhance your experience, analyze site usage, and personalize content. This Cookie Policy explains what cookies are, how we use them, and how you can manage your preferences.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-4 sticky top-32 hidden lg:block self-start">
            <div className="glass-card rounded-3xl p-6 border-white/20 shadow-xl max-h-[calc(100vh-160px)] overflow-y-auto custom-scrollbar">
              <h3 className="text-lg font-bold mb-6 px-2">Sections</h3>
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

          {/* Content */}
          <div className="lg:col-span-8 space-y-16">
            <div className="glass-card rounded-[2.5rem] p-8 md:p-12 border-white/20 shadow-2xl">
              <div className="prose prose-lg dark:prose-invert max-w-none">
                {sections.map((section) => (
                  <section key={section.id} id={section.id} className="pt-16 scroll-mt-32 border-t border-lifewood-serpent/10 dark:border-white/10 first:border-0 first:pt-0">
                    <div className="flex items-center gap-4 mb-8">
                      <div className="w-12 h-12 rounded-2xl bg-lifewood-green/10 flex items-center justify-center">
                        <section.icon className="w-6 h-6 text-lifewood-green" />
                      </div>
                      <h2 className="text-3xl font-bold">{section.title}</h2>
                    </div>
                    
                    <div className="space-y-6 text-lifewood-serpent/80 dark:text-white/80">
                      {section.id === 'what-are-cookies' && (
                        <div className="space-y-4">
                          <p>Cookies are small text files that are stored on your device (computer, smartphone, or tablet) when you visit a website. They are used to store and track information about your actions and preferences, enabling the website to function properly and deliver a personalized experience.</p>
                          <p>There are several types of cookies:</p>
                          <div className="grid gap-4 mt-4">
                            <div className="glass p-4 rounded-xl border-white/10">
                              <h4 className="font-bold mb-2">Session Cookies</h4>
                              <p className="text-sm">Temporary cookies that expire once you close your browser. These are used to track your activity during a single session.</p>
                            </div>
                            <div className="glass p-4 rounded-xl border-white/10">
                              <h4 className="font-bold mb-2">Persistent Cookies</h4>
                              <p className="text-sm">These cookies remain on your device until they expire or are deleted, allowing the website to remember your preferences across sessions.</p>
                            </div>
                            <div className="glass p-4 rounded-xl border-white/10">
                              <h4 className="font-bold mb-2">First-party Cookies</h4>
                              <p className="text-sm">Cookies set by the website you are visiting.</p>
                            </div>
                            <div className="glass p-4 rounded-xl border-white/10">
                              <h4 className="font-bold mb-2">Third-party Cookies</h4>
                              <p className="text-sm">Cookies set by a domain other than the website you are visiting, often used for advertising and analytics purposes.</p>
                            </div>
                          </div>
                        </div>
                      )}

                      {section.id === 'how-we-use' && (
                        <div className="space-y-4">
                          <p>We use cookies to improve your browsing experience, streamline functionality, and enhance the performance of our website. Specifically, Lifewood uses cookies for the following purposes:</p>
                          <ul className="list-disc pl-6 space-y-4">
                            <li><strong>Essential Cookies:</strong> These cookies are necessary for the website to function properly. They allow you to navigate the site and use its features, such as accessing secure areas and completing transactions.</li>
                            <li><strong>Performance and Analytics Cookies:</strong> These cookies help us understand how visitors interact with our website by collecting information on site traffic, page views, and other key metrics. This data is used to improve the website’s performance and usability.</li>
                            <li><strong>Functionality Cookies:</strong> These cookies allow the website to remember your preferences and provide enhanced, personalized features. For example, they may remember your login details or language settings.</li>
                            <li><strong>Targeting and Advertising Cookies:</strong> These cookies are used to deliver relevant advertisements based on your browsing habits and to measure the effectiveness of our marketing campaigns. They may track your visit across different websites.</li>
                          </ul>
                        </div>
                      )}

                      {section.id === 'third-party' && (
                        <div className="space-y-4">
                          <p>We may allow third-party service providers, such as Google Analytics or social media platforms, to place cookies on your device to track usage, improve site functionality, and deliver targeted ads. These third parties may have access to certain information about your browsing habits but will not be able to identify you personally from this data.</p>
                          <p>We recommend reviewing the privacy policies of these third parties to understand how they handle your data.</p>
                        </div>
                      )}

                      {section.id === 'choices' && (
                        <div className="space-y-4">
                          <p>You have the right to accept or reject cookies. When you visit our website for the first time, you will be asked to consent to the use of cookies through a cookie banner. You can also manage or disable cookies by adjusting your browser settings.</p>
                          <p>Here’s how you can control cookies in popular browsers:</p>
                          <ul className="list-disc pl-6 space-y-2">
                            <li><strong>Google Chrome:</strong> Go to Settings &gt; Privacy and Security &gt; Cookies and other site data</li>
                            <li><strong>Mozilla Firefox:</strong> Go to Options &gt; Privacy &amp; Security &gt; Cookies and Site Data</li>
                            <li><strong>Microsoft Edge:</strong> Go to Settings &gt; Site Permissions &gt; Cookies and site data</li>
                            <li><strong>Safari:</strong> Go to Preferences &gt; Privacy &gt; Cookies and website data</li>
                          </ul>
                          <p>Please note that disabling certain cookies may affect the functionality of our website and limit your ability to use some of its features.</p>
                        </div>
                      )}

                      {section.id === 'managing' && (
                        <div className="space-y-4">
                          <p>You can manage your cookie preferences at any time by clicking on the "Cookie Settings" link in the footer of our website. From there, you can opt out of non-essential cookies, such as performance and marketing cookies.</p>
                          <p>If you do not want to receive cookies, you can also modify your browser settings to notify you when cookies are being used or to block cookies altogether. However, please be aware that some parts of our website may not function properly if you block essential cookies.</p>
                        </div>
                      )}

                      {section.id === 'changes' && (
                        <p>We may update this Cookie Policy from time to time to reflect changes in our practices, legal requirements, or the services we offer. We encourage you to review this page periodically to stay informed about how we use cookies.</p>
                      )}

                      {section.id === 'contact' && (
                        <div className="space-y-4">
                          <p>If you have any questions about our use of cookies or how to manage your preferences, please contact us at:</p>
                          <div className="glass p-6 rounded-2xl border border-lifewood-green/20">
                            <p className="font-bold text-lifewood-green mb-2">Email:</p>
                            <p>lifewood@gmail.com</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </section>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
