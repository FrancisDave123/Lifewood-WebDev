
import React from 'react';
import { ArrowLeft, Sparkles, FileText, UserCheck, Edit, Shield, Lock, Globe, AlertCircle, Scale, MessageSquare } from 'lucide-react';

interface TermsConditionsProps {
  navigateTo?: (page: any) => void;
}

export const TermsConditions: React.FC<TermsConditionsProps> = ({ navigateTo }) => {
  const sections = [
    { id: 'acceptance', title: '1. Acceptance of these Terms', icon: UserCheck },
    { id: 'who-we-are', title: '2. Who we are and how to contact us', icon: Globe },
    { id: 'changes', title: '3. Changes to these Terms and the Site', icon: Edit },
    { id: 'eligibility', title: '4. Eligibility', icon: UserCheck },
    { id: 'permitted-use', title: '5. Your permitted use', icon: Shield },
    { id: 'prohibited-use', title: '6. Prohibited use and acceptable use rules', icon: Lock },
    { id: 'intellectual-property', title: '7. Intellectual Property Rights', icon: Sparkles },
    { id: 'scraping-restrictions', title: '8. Restrictions on scraping, text and data mining, and AI/ML use', icon: AlertCircle },
    { id: 'submissions', title: '9. Submissions, feedback, and IP complaints', icon: MessageSquare },
    { id: 'third-party', title: '10. Third-party links and resources', icon: Globe },
    { id: 'privacy', title: '11. Privacy and cookies', icon: Shield },
    { id: 'disclaimers', title: '12. Disclaimers', icon: AlertCircle },
    { id: 'limitation-liability', title: '13. Limitation of liability', icon: Scale },
    { id: 'indemnity', title: '14. Indemnity', icon: Shield },
    { id: 'suspension', title: '15. Suspension and termination', icon: Lock },
    { id: 'general', title: '16. General terms', icon: FileText },
    { id: 'governing-law', title: '17. Governing law and jurisdiction', icon: Scale },
    { id: 'contact', title: '18. Contact', icon: MessageSquare },
  ];

  return (
    <div className="pt-32 pb-20 min-h-screen bg-lifewood-seaSalt dark:bg-[#020804] relative">
      {/* Background Decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[50rem] h-[50rem] bg-lifewood-green/5 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-0 left-0 w-[40rem] h-[40rem] bg-lifewood-saffron/5 rounded-full blur-[100px]"></div>
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
            <FileText className="w-4 h-4 text-lifewood-green" />
            <span className="text-xs font-black uppercase tracking-[0.24em] text-lifewood-serpent/70 dark:text-white/70">
              Legal & Terms
            </span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-heading font-black mb-6 tracking-tight text-lifewood-serpent dark:text-white uppercase">
            Terms and Conditions
          </h1>
          <p className="text-xl text-lifewood-serpent/60 dark:text-white/60 max-w-3xl">
            Please read these terms carefully before using our services. By accessing or using the Site, you agree to be bound by these Terms.
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
                      {section.id === 'acceptance' && (
                        <div className="space-y-4">
                          <p>1.1 These Terms govern your access to and use of lifewood.com (the “Site”) and any content, features or functionality made available through it (together, the “Services”).</p>
                          <p>1.2 By accessing or using the Site, you agree to be bound by these Terms. If you do not agree, do not use the Site.</p>
                          <p>1.3 If you are using the Site on behalf of a company or other organisation, you represent and warrant that you have authority to bind that entity to these Terms. In that case, “you” and “your” refers to that entity and you.</p>
                        </div>
                      )}

                      {section.id === 'who-we-are' && (
                        <div className="space-y-4">
                          <p>2.1 The Site is operated by Lifewood Data Technology Limited (“Lifewood”, “we”, “us”, “our”).</p>
                          <p>2.2 Contact: hr@lifewood.com (or via our Contact Us page). Postal address: Lifewood Data Technology Limited, Unit 19, 9/F, Core C, Cyberport 3, 100 Cyberport Road, Hong Kong. For IP complaints, see clause 9.4.</p>
                        </div>
                      )}

                      {section.id === 'changes' && (
                        <div className="space-y-4">
                          <p>3.1 We may update these Terms from time to time. The “Last updated” date indicates when changes were made. Your continued use of the Site after changes become effective means you accept the updated Terms.</p>
                          <p>3.2 We may update, suspend, withdraw or restrict availability of all or any part of the Site for business, operational, legal or security reasons.</p>
                        </div>
                      )}

                      {section.id === 'eligibility' && (
                        <div className="space-y-4">
                          <p>4.1 The Site is intended for business and professional audiences. If you are under the age of majority in your jurisdiction, you may use the Site only with permission and supervision of a parent or legal guardian.</p>
                        </div>
                      )}

                      {section.id === 'permitted-use' && (
                        <div className="space-y-4">
                          <p>5.1 You may view, download and print copies of pages from the Site solely for your internal, lawful, non-commercial reference purposes (e.g., evaluating Lifewood’s capabilities or services).</p>
                          <p>5.2 You may share links (URLs) to the Site, provided you do so fairly and legally, and do not misrepresent your relationship with Lifewood.</p>
                        </div>
                      )}

                      {section.id === 'prohibited-use' && (
                        <div className="space-y-4">
                          <p>6.1 You must not use the Site:</p>
                          <ul className="list-disc pl-6 space-y-2">
                            <li>(a) in any way that breaches any applicable law or regulation;</li>
                            <li>(b) to infringe, misappropriate or violate our rights or the rights of any third party;</li>
                            <li>(c) to transmit or upload malware, or to interfere with or disrupt the Site or any networks or systems connected to it;</li>
                            <li>(d) to attempt to gain unauthorised access to the Site, our servers or systems, or to any user accounts;</li>
                            <li>(e) to impersonate another person or entity, or to misrepresent your affiliation with any person or entity.</li>
                          </ul>
                          <p>6.2 You must not:</p>
                          <ul className="list-disc pl-6 space-y-2">
                            <li>(a) reproduce, duplicate, copy, sell, trade, resell or exploit any portion of the Site or Content (defined below) except as expressly permitted by these Terms;</li>
                            <li>(b) remove, obscure or alter any proprietary notices (including copyright and trademark notices);</li>
                            <li>(c) use the Site in a way that could damage, disable, overburden or impair it.</li>
                          </ul>
                        </div>
                      )}

                      {section.id === 'intellectual-property' && (
                        <div className="space-y-4">
                          <p>7.1 “Content” means all materials on the Site, including text, software, code, layout, design, graphics, photographs, audio, video, logos, trademarks, service marks, and compilations (including selection and arrangement).</p>
                          <p>7.2 We (and/or our licensors) own all right, title and interest in and to the Site and Content, including all intellectual property rights. All rights are reserved.</p>
                          <p>7.3 Nothing in these Terms grants you any right to use any of our trademarks, logos or brand features without our prior written permission.</p>
                          <p>7.4 Any proprietary platforms, processes or technologies referenced on the Site (including the LiFT platform) are protected by intellectual property laws and are not licensed to you by virtue of your use of the Site.</p>
                        </div>
                      )}

                      {section.id === 'scraping-restrictions' && (
                        <div className="space-y-4">
                          <p>8.1 You must not access the Site or Content using any automated means (including robots, spiders, scrapers, data-mining tools, or similar technologies) except where:</p>
                          <ul className="list-disc pl-6 space-y-2">
                            <li>(a) such access is required for normal browser functionality; or</li>
                            <li>(b) you have our prior written permission.</li>
                          </ul>
                          <p>8.2 To the maximum extent permitted by applicable law, you must not (and must not permit any third party to):</p>
                          <ul className="list-disc pl-6 space-y-2">
                            <li>(a) perform text and data mining, web harvesting, or systematic extraction of Content; or</li>
                            <li>(b) use any Content (including any portion, excerpt, screenshot, dataset, or derivative) to train, develop, benchmark, fine-tune, evaluate or validate any artificial intelligence or machine learning model (including large language models), or to build or enrich any dataset for those purposes,</li>
                          </ul>
                          <p>in each case without our prior written consent.</p>
                          <p>8.3 You must not bypass or circumvent any measures used to prevent or restrict access to the Site (including rate limits, robots.txt, or other access controls).</p>
                        </div>
                      )}

                      {section.id === 'submissions' && (
                        <div className="space-y-4">
                          <p>9.1 If you submit information through the Site (e.g., through a contact form, email link, or job application portal), you agree that:</p>
                          <ul className="list-disc pl-6 space-y-2">
                            <li>(a) you will not submit confidential information unless we have agreed in writing to receive it on a confidential basis; and</li>
                            <li>(b) you are responsible for the accuracy and legality of your submissions.</li>
                          </ul>
                          <p>9.2 Any ideas, suggestions or feedback you provide about the Site or our services (“Feedback”) may be used by us without restriction and without compensation to you. You grant us a worldwide, perpetual, irrevocable, royalty-free licence to use, reproduce, modify, distribute and otherwise exploit Feedback for any purpose.</p>
                          <p>9.3 We do not waive any rights to use similar or related ideas previously known to us, developed independently, or obtained from other sources.</p>
                          <p>9.4 If you believe Content on the Site infringes your intellectual property rights, please notify us at hr@lifewood.com with:</p>
                          <ul className="list-disc pl-6 space-y-2">
                            <li>(a) sufficient detail to identify the material claimed to be infringing (including URLs);</li>
                            <li>(b) evidence of your rights; and</li>
                            <li>(c) your contact details and a statement of good faith belief.</li>
                          </ul>
                          <p>9.5 We may remove or disable access to material we reasonably believe may infringe third-party rights.</p>
                        </div>
                      )}

                      {section.id === 'third-party' && (
                        <div className="space-y-4">
                          <p>10.1 The Site may include links to third-party websites or resources. These links are provided for convenience only.</p>
                          <p>10.2 We do not control and are not responsible for the content, availability, security or practices of third-party sites. Your use of third-party sites is at your own risk and subject to their terms.</p>
                        </div>
                      )}

                      {section.id === 'privacy' && (
                        <div className="space-y-4">
                          <p>11.1 Our collection and use of personal information is described in our Privacy Policy and Cookie Policy, which form part of these Terms by reference.</p>
                        </div>
                      )}

                      {section.id === 'disclaimers' && (
                        <div className="space-y-4">
                          <p>12.1 The Site and Content are provided for general information only and do not constitute professional advice (including legal, regulatory, technical, or investment advice).</p>
                          <p>12.2 While we aim to keep the Site accurate and up to date, we make no warranties or representations that the Site or Content is accurate, complete, reliable, available, secure or error-free.</p>
                          <p>12.3 To the fullest extent permitted by law, the Site is provided on an “as is” and “as available” basis and we disclaim all warranties and conditions, whether express, implied or statutory, including implied warranties of merchantability, fitness for a particular purpose and non-infringement.</p>
                        </div>
                      )}

                      {section.id === 'limitation-liability' && (
                        <div className="space-y-4">
                          <p>13.1 Nothing in these Terms excludes or limits liability that cannot be excluded or limited by law (including liability for death or personal injury caused by negligence, fraud or fraudulent misrepresentation).</p>
                          <p>13.2 Subject to clause 13.1, to the fullest extent permitted by law, Lifewood and its affiliates will not be liable for any indirect, incidental, special, consequential or punitive damages, or for loss of profits, revenue, business, goodwill, anticipated savings, data, or business interruption, arising out of or in connection with your use of (or inability to use) the Site.</p>
                          <p>13.3 Subject to clause 13.1, our total aggregate liability to you arising out of or in connection with these Terms or the Site will not exceed USD 1,000.</p>
                        </div>
                      )}

                      {section.id === 'indemnity' && (
                        <div className="space-y-4">
                          <p>14.1 You agree to indemnify and hold harmless Lifewood, its affiliates, officers, directors, employees and agents from and against any claims, damages, liabilities, losses and expenses (including reasonable legal fees) arising out of or relating to:</p>
                          <ul className="list-disc pl-6 space-y-2">
                            <li>(a) your breach of these Terms;</li>
                            <li>(b) your misuse of the Site; or</li>
                            <li>(c) your infringement or misappropriation of any third-party rights.</li>
                          </ul>
                        </div>
                      )}

                      {section.id === 'suspension' && (
                        <div className="space-y-4">
                          <p>15.1 We may suspend, restrict or terminate your access to the Site at any time if we reasonably believe you have breached these Terms or your use poses a security, legal or reputational risk.</p>
                        </div>
                      )}

                      {section.id === 'general' && (
                        <div className="space-y-4">
                          <p>16.1 Assignment: We may assign or transfer our rights and obligations under these Terms. You may not assign or transfer your rights or obligations without our prior written consent.</p>
                          <p>16.2 Severability: If any provision is found unenforceable, the remaining provisions will remain in full force and effect.</p>
                          <p>16.3 No waiver: Our failure to enforce any provision is not a waiver of our right to do so later.</p>
                          <p>16.4 Entire agreement: These Terms (together with the Privacy Policy and Cookie Policy) constitute the entire agreement between you and us regarding your use of the Site, and supersede any prior understandings relating to the Site.</p>
                        </div>
                      )}

                      {section.id === 'governing-law' && (
                        <div className="space-y-4">
                          <p>17.1 These Terms and any dispute or claim arising out of or in connection with them (including non-contractual disputes or claims) are governed by the laws of Hong Kong Special Administrative Region.</p>
                          <p>17.2 The courts of Hong Kong shall have exclusive jurisdiction to settle any dispute or claim arising out of or in connection with these Terms or your use of the Site.</p>
                        </div>
                      )}

                      {section.id === 'contact' && (
                        <div className="glass p-6 rounded-2xl border border-lifewood-green/20">
                          <p className="font-bold text-lifewood-green mb-2">Email:</p>
                          <p className="mb-4">hr@lifewood.com</p>
                          <p className="font-bold text-lifewood-green mb-2">Address:</p>
                          <p>Lifewood Data Technology Limited, Unit 19, 9/F, Core C, Cyberport 3, 100 Cyberport Road, Hong Kong</p>
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
