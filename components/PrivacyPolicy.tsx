
import React from 'react';
import { ArrowLeft, Sparkles, Shield, Lock, Eye, FileText, Globe, UserCheck, Clock, Bell, Scale, MessageSquare } from 'lucide-react';

interface PrivacyPolicyProps {
  navigateTo?: (page: any) => void;
}

export const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({ navigateTo }) => {
  const sections = [
    { id: 'definitions', title: '1. Definitions', icon: FileText },
    { id: 'collection', title: '2. Information Collection', icon: Eye },
    { id: 'use', title: '3. Use of Information', icon: Globe },
    { id: 'sharing', title: '4. Data Sharing and Disclosure', icon: UserCheck },
    { id: 'security', title: '5. Data Security Measures', icon: Shield },
    { id: 'rights', title: '6. User Rights and Controls', icon: Lock },
    { id: 'retention', title: '7. Data Retention Periods', icon: Clock },
    { id: 'cookies', title: '8. Cookies and Tracking Technologies', icon: Sparkles },
    { id: 'transfers', title: '9. International Data Transfers', icon: Globe },
    { id: 'breach', title: '10. Data Breach Procedures', icon: Bell },
    { id: 'commercial', title: '11. Commercial Use of Data', icon: Scale },
    { id: 'third-party', title: '12. Third-Party Services and Links', icon: Globe },
    { id: 'children', title: '13. Children\'s Privacy', icon: UserCheck },
    { id: 'updates', title: '14. Policy Updates and Notifications', icon: Bell },
    { id: 'compliance', title: '15. Compliance and Regulatory Framework', icon: Scale },
    { id: 'contact', title: '16. Contact Information and Complaints', icon: MessageSquare },
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
            <Shield className="w-4 h-4 text-lifewood-green" />
            <span className="text-xs font-black uppercase tracking-[0.24em] text-lifewood-serpent/70 dark:text-white/70">
              Legal & Privacy
            </span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-heading font-black mb-6 tracking-tight text-lifewood-serpent dark:text-white uppercase">
            Privacy Policy
          </h1>
          <p className="text-xl text-lifewood-serpent/60 dark:text-white/60 max-w-3xl">
            This Privacy Policy has been duly approved and adopted by Lifewood Data Technology Limited and shall be effective from 3 November 2025.
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
                <section id="background" className="mb-12">
                  <h2 className="text-3xl font-bold mb-6">Background</h2>
                  <div className="space-y-6 text-lifewood-serpent/80 dark:text-white/80">
                    <div>
                      <h3 className="text-xl font-bold mb-3">A. Company Operations and Data Processing Context</h3>
                      <p>Lifewood Data Technology Limited operates as a dynamic technology company dedicated to delivering cutting-edge AI and data-driven solutions. Building on a decades-long legacy of innovative global data services and industrialized workflow technologies, Lifewood specializes in collecting, processing, and securely managing diverse forms of personal data, including text, audio, pictures, videos, and AI-generated content.</p>
                      <p>The Company operates globally through corporate offices, franchise partners, subcontractors, and affiliated entities located in multiple jurisdictions including Hong Kong, Malaysia, China, the United States, the Philippines, Bangladesh, Indonesia, and other countries, and may also engage with participants from European Union member states for specific data collection projects.</p>
                      <p>Leveraging its proprietary cloud-based platform, LiFT, Lifewood seamlessly integrates multimedia data annotation, labeling, and quality assurance through this global network of partners and data centers. It supports clients across industries such as autonomous driving, digital media, and enterprise AI development.</p>
                      <p>Committed to compliance and aligned with international best practices, Lifewood emphasizes stringent data security, transparent user rights, and responsible data governance to empower innovation while safeguarding privacy across its services worldwide.</p>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-3">B. Commitment to Privacy Protection</h3>
                      <p>The Company is committed to protecting the privacy and personal data of all individuals who interact with our services, recognizing that privacy protection is fundamental to maintaining trust and ensuring compliance with applicable data protection laws and regulations.</p>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-3">C. Regulatory Compliance Framework</h3>
                      <p>This Privacy Policy has been developed to ensure compliance with Hong Kong privacy laws and regulations, including the Personal Data (Privacy) Ordinance (Cap. 486) and any amendments thereto, as well as applicable privacy and data protection laws in all jurisdictions where the Company operates or engages with data subjects.</p>
                      <p>This includes, but is not limited to, Malaysia, China, the United States, the Philippines, Bangladesh, Indonesia, and European Union member states, alongside adherence to international best practices for data protection such as GDPR standards.</p>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-3">D. Purpose and Scope of Policy</h3>
                      <p>This Privacy Policy serves to:</p>
                      <ul className="list-disc pl-6 space-y-2">
                        <li>Inform users about our data handling practices;</li>
                        <li>Explain their rights regarding personal data; and</li>
                        <li>Establish transparent procedures for data collection, use, sharing, security, and retention across all our business operations and technology platforms.</li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-3">E. Business Context and Data Usage</h3>
                      <p>As a technology company operating in the digital economy, Lifewood processes personal data for various legitimate business purposes including:</p>
                      <ul className="list-disc pl-6 space-y-2">
                        <li>Service delivery</li>
                        <li>Customer support</li>
                        <li>Product development</li>
                        <li>Analytics</li>
                        <li>AI model training</li>
                        <li>Marketing communications</li>
                        <li>Other commercial activities essential to its operations</li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-3">F. International Operations Consideration</h3>
                      <p>Given that Lifewood’s business operations may involve cross-border data transfers and international service delivery — including engagement with participants from European Union member states for specific projects — this Privacy Policy addresses the handling of personal data in compliance with Hong Kong law while considering international data protection standards and transfer mechanisms for global operations.</p>
                    </div>
                  </div>
                </section>

                {sections.map((section) => (
                  <section key={section.id} id={section.id} className="pt-16 scroll-mt-32 border-t border-lifewood-serpent/10 dark:border-white/10 first:border-0 first:pt-0">
                    <div className="flex items-center gap-4 mb-8">
                      <div className="w-12 h-12 rounded-2xl bg-lifewood-green/10 flex items-center justify-center">
                        <section.icon className="w-6 h-6 text-lifewood-green" />
                      </div>
                      <h2 className="text-3xl font-bold">{section.title}</h2>
                    </div>
                    
                    <div className="space-y-6 text-lifewood-serpent/80 dark:text-white/80">
                      {section.id === 'definitions' && (
                        <div className="grid gap-6">
                          <div>
                            <h4 className="font-bold mb-2">1.1 Personal Data</h4>
                            <p>means any data, whether true or not, about an individual who can be identified from that data, or from that data and other information to which we have or are likely to have access, including but not limited to names, identification numbers, location data, online identifiers, and factors specific to the physical, physiological, genetic, mental, economic, cultural, or social identity of that individual.</p>
                          </div>
                          <div>
                            <h4 className="font-bold mb-2">1.2 Processing</h4>
                            <p>means any operation or set of operations performed on personal data or sets of personal data, whether or not by automated means, such as collection, recording, organisation, structuring, storage, adaptation or alteration, retrieval, consultation, use, disclosure by transmission, dissemination or otherwise making available, alignment or combination, restriction, erasure or destruction.</p>
                          </div>
                          <div>
                            <h4 className="font-bold mb-2">1.3 Data Subject</h4>
                            <p>means an identified or identifiable natural person who is the subject of personal data, including users, customers, website visitors, employees, and any other individuals whose personal data we collect, process, or store.</p>
                          </div>
                          <div>
                            <h4 className="font-bold mb-2">1.4 Data Controller / Processor</h4>
                            <p>depending on the activity, Lifewood acts either:</p>
                            <p className="pl-4">(i) as a data processor / data intermediary / service provider when processing Personal Data on documented instructions of a client (the controller), or</p>
                            <p className="pl-4">(ii) as an independent controller for Lifewood-run functions (e.g., HR, recruitment, security logging, finance, marketing).</p>
                            <p>Where Lifewood acts as a processor, the client’s privacy notice governs and Lifewood will not determine the purposes or means beyond client instructions.</p>
                          </div>
                          <div>
                            <h4 className="font-bold mb-2">1.5 Data processor</h4>
                            <p>means any natural or legal person, public authority, agency or other body which processes personal data on behalf of the data controller.</p>
                          </div>
                          <div>
                            <h4 className="font-bold mb-2">1.6 Third Party</h4>
                            <p>means any natural or legal person, public authority, agency or body other than the data subject, the data controller, the data processor and persons who, under the direct authority of the controller or processor, are authorised to process personal data.</p>
                          </div>
                          <div>
                            <h4 className="font-bold mb-2">1.7 Consent</h4>
                            <p>means any freely given, specific, informed and unambiguous indication of the data subject's wishes by which the data subject, by a statement or by a clear affirmative action, signifies agreement to the processing of personal data relating to him or her.</p>
                          </div>
                          <div>
                            <h4 className="font-bold mb-2">1.8 Services</h4>
                            <p>means all technology solutions, platforms, websites, applications, software, and related services provided by the Company to users and customers.</p>
                          </div>
                          <div>
                            <h4 className="font-bold mb-2">1.9 User Account</h4>
                            <p>means any account created by a user to access our Services, including associated login credentials, preferences, and account information.</p>
                          </div>
                          <div>
                            <h4 className="font-bold mb-2">1.10 Cookies</h4>
                            <p>means small text files that are placed on a user's device when visiting our website or using our Services to store and retrieve information about the user's browsing behaviour and preferences.</p>
                          </div>
                          <div>
                            <h4 className="font-bold mb-2">1.11 AI-Generated Content</h4>
                            <p>means any content, including but not limited to text, images, audio, or video, that is created, modified, or enhanced through artificial intelligence, machine learning algorithms, or automated systems operated by the Company.</p>
                          </div>
                          <div>
                            <h4 className="font-bold mb-2">1.12 Data Breach</h4>
                            <p>means a breach of security leading to the accidental or unlawful destruction, loss, alteration, unauthorised disclosure of, or access to, personal data transmitted, stored or otherwise processed.</p>
                          </div>
                          <div>
                            <h4 className="font-bold mb-2">1.13 Retention Period</h4>
                            <p>means the period for which personal data is stored and processed by the Company before it is deleted or anonymised, as specified in this Privacy Policy or as required by applicable law.</p>
                          </div>
                          <div>
                            <h4 className="font-bold mb-2">1.14 Cross-Border Transfer</h4>
                            <p>means the transfer of personal data from Hong Kong to a jurisdiction outside Hong Kong, whether directly or indirectly through intermediate jurisdictions.</p>
                          </div>
                          <div>
                            <h4 className="font-bold mb-2">1.15 Legitimate Interest</h4>
                            <p>means the lawful basis for processing personal data where such processing is necessary for the purposes of the legitimate interests pursued by the Company or by a third party, except where such interests are overridden by the interests or fundamental rights and freedoms of the data subject.</p>
                          </div>
                          <div>
                            <h4 className="font-bold mb-2">1.16 Anonymisation</h4>
                            <p>means the process of removing or modifying personal data in such a way that the data subject can no longer be identified directly or indirectly by the Company or any other party.</p>
                          </div>
                          <div>
                            <h4 className="font-bold mb-2">1.17 Data Protection Officer (DPO)</h4>
                            <p>means the individual appointed by the Company to monitor compliance with data protection laws and serve as the primary contact for data protection matters.</p>
                          </div>
                          <div>
                            <h4 className="font-bold mb-2">1.18 Regulatory Authority</h4>
                            <p>means the Privacy Commissioner for Personal Data in Hong Kong or any other competent supervisory authority with jurisdiction over data protection matters affecting the Company or data subjects.</p>
                          </div>
                        </div>
                      )}

                      {section.id === 'collection' && (
                        <div className="grid gap-6">
                          <h3 className="text-xl font-bold">2.1 Types of Personal Data Collected</h3>
                          <p>We collect and process various categories of personal data necessary for providing our Services, including but not limited to:</p>
                          <div className="pl-4 space-y-4">
                            <div>
                              <h4 className="font-bold mb-1">2.1.1 Identity and Contact Information</h4>
                              <p>Full name, email addresses, telephone numbers, postal addresses, job titles, company affiliations, and other contact details.</p>
                            </div>
                            <div>
                              <h4 className="font-bold mb-1">2.1.2 Account and Authentication Data</h4>
                              <p>Usernames, passwords, security questions and answers, account preferences, and authentication credentials.</p>
                            </div>
                            <div>
                              <h4 className="font-bold mb-1">2.1.3 Technical and Usage Information</h4>
                              <p>IP addresses, device identifiers, browser types and versions, operating system information, referring URLs, access times, and usage patterns.</p>
                            </div>
                            <div>
                              <h4 className="font-bold mb-1">2.1.4 Content Data</h4>
                              <p>Text files, documents, audio recordings, images, videos, and other content materials uploaded, created, or processed through our Services.</p>
                            </div>
                            <div>
                              <h4 className="font-bold mb-1">2.1.5 AI-Generated Content</h4>
                              <p>Data outputs, results, and derivatives created through artificial intelligence processing, including machine learning models and algorithmic outputs based on User input.</p>
                            </div>
                            <div>
                              <h4 className="font-bold mb-1">2.1.6 Communication Records</h4>
                              <p>Correspondence, support tickets, feedback, survey responses, and other communications between Users and the Company.</p>
                            </div>
                            <div>
                              <h4 className="font-bold mb-1">2.1.7 Financial Information</h4>
                              <p>Billing addresses, payment method details, transaction records, and invoicing information where applicable to paid Services.</p>
                            </div>
                            <div>
                              <h4 className="font-bold mb-1">2.1.8 Likeness and Performance Rights</h4>
                              <p>Where datasets capture an individual’s image, voice, or performance, Lifewood (acting as processor) requires the controller or data supplier to warrant that all necessary consents, licences, waivers of moral rights (where applicable), and publicity/portrait rights clearances have been obtained for the project scope, territory, media and duration, including use in quality assurance and security review. Lifewood will not expand use beyond the authorised scope.</p>
                            </div>
                          </div>
                          <h3 className="text-xl font-bold mt-4">2.2 Methods of Data Collection</h3>
                          <div className="pl-4 space-y-4">
                            <div>
                              <h4 className="font-bold mb-1">2.2.1 Direct Collection</h4>
                              <p>We collect Personal Data directly from Data Subjects through registration forms, account creation processes, service usage, file uploads, and direct communications.</p>
                            </div>
                            <div>
                              <h4 className="font-bold mb-1">2.2.2 Automated Collection</h4>
                              <p>We automatically collect certain data through Cookies, web beacons, server logs, and other tracking technologies when Users access our Services.</p>
                            </div>
                            <div>
                              <h4 className="font-bold mb-1">2.2.3 Third-Party Sources</h4>
                              <p>We may receive Personal Data from business partners, service providers, publicly available sources, and integrated third-party platforms with appropriate consent or legal basis.</p>
                            </div>
                            <div>
                              <h4 className="font-bold mb-1">2.2.4 Device and Browser Collection</h4>
                              <p>Technical information is collected through Users' devices and browsers when accessing our platforms and Services.</p>
                            </div>
                          </div>
                          <h3 className="text-xl font-bold mt-4">2.3 Circumstances of Collection</h3>
                          <p>Personal Data is collected during account registration, service activation, content upload and processing, customer support interactions, marketing communications, and ongoing service usage.</p>
                          <p>Collection occurs when Users voluntarily provide information, engage with our Services, participate in surveys or feedback processes, or interact with our customer support teams.</p>
                          <p>Automated data collection takes place continuously during service usage to ensure proper functionality, security monitoring, and service optimization.</p>
                          <h3 className="text-xl font-bold mt-4">2.4 Legal Basis for Collection</h3>
                          <p>We collect Personal Data based on legitimate business interests, contractual necessity for service provision, legal compliance requirements, and with explicit Consent where required by applicable law.</p>
                          <p>For AI-Generated Content and related Processing, collection is based on contractual necessity and legitimate interests in providing advanced technology services and improving our AI capabilities.</p>
                        </div>
                      )}

                      {section.id === 'use' && (
                        <div className="grid gap-6">
                          <h3 className="text-xl font-bold">3.1 Service Provision and Operations</h3>
                          <p>We process Personal Data to provide, maintain, and improve our Services, including user authentication, account management, and delivery of requested technology solutions.</p>
                          <p>Personal Data is used to customize and personalize user experiences, configure system settings, and ensure proper functionality of our technology platforms.</p>
                          <p>We process data to fulfill contractual obligations, process transactions, generate invoices, and manage billing and payment processes.</p>
                          <h3 className="text-xl font-bold mt-4">3.2 Customer Support and Communications</h3>
                          <p>Personal Data is processed to respond to user inquiries, provide technical support, troubleshoot issues, and maintain communication records for quality assurance purposes.</p>
                          <p>We use contact information to send service-related notifications, system updates, security alerts, and other essential communications regarding our Services.</p>
                          <p>Communication data including text, audio, and video content may be processed to resolve support requests and improve service quality.</p>
                          <h3 className="text-xl font-bold mt-4">3.3 Analytics and Performance Monitoring</h3>
                          <p>We process Personal Data to analyze usage patterns, monitor system performance, generate statistical reports, and conduct research to enhance our Services.</p>
                          <p>Data is used to identify trends, measure service effectiveness, and develop insights for business intelligence and strategic planning purposes.</p>
                          <p>We may process aggregated and anonymized data for benchmarking, industry analysis, and service optimization. For avoidance of doubt, aggregated data could be derived from your personal data but is not considered personal data in law as this data will not directly or indirectly reveal your identity. For example, we may aggregate your Usage Data to calculate the percentage of users accessing a specific website feature. However, if we combine or connect Aggregated Data with your personal data which will be used in accordance with this privacy policy.</p>
                          <h3 className="text-xl font-bold mt-4">3.4 AI Model Training and Development</h3>
                          <p>Lifewood will not use client-provided datasets containing Personal Data to train, fine-tune, or evaluate models except where (i) the client (as controller) has provided documented instructions and appropriate lawful basis/notice, or (b) the data has been irreversibly anonymised by or for the client such that no person is identifiable by Lifewood or any third party. For the avoidance of doubt, ‘Anonymised’ means de-identification that is irreversible, with technical and organisational measures to prevent re-identification. By default, client datasets are siloed to that client’s project scope; Lifewood does not repurpose such data for unrelated model development.</p>
                          <p>AI-Generated Content created through our Services may be processed for model refinement, quality assessment, and system enhancement purposes.</p>
                          <p>Data processing for AI purposes includes pattern recognition, machine learning model training, and automated content generation improvement.</p>
                          <h3 className="text-xl font-bold mt-4">3.5 Marketing and Commercial Communications</h3>
                          <p>Subject to appropriate Consent or Legitimate Interest, we process Personal Data to send marketing communications, promotional materials, newsletters, and information about new products or services.</p>
                          <p>We use data for market research, customer segmentation, targeted advertising, and developing marketing strategies relevant to user interests.</p>
                          <p>Marketing communications may be delivered through various channels including email, SMS, phone calls, and digital platforms, where legally permitted.</p>
                          <p>Non-essential cookies/marketing communications are opt-in where required. We do not sell Personal Data or engage in cross-context behavioural advertising. Any third-party marketing pixels are disabled by default and activated only upon consent.</p>
                          <h3 className="text-xl font-bold mt-4">3.6 Security and Fraud Prevention</h3>
                          <p>Personal Data is processed to maintain system security, detect and prevent fraud, unauthorized access, and other security threats to our Services and users.</p>
                          <p>We use data for identity verification, risk assessment, monitoring suspicious activities, and implementing appropriate security measures.</p>
                          <h3 className="text-xl font-bold mt-4">3.7 Legal Compliance and Business Operations</h3>
                          <p>We process Personal Data to comply with legal obligations, respond to lawful requests from authorities, and meet regulatory requirements applicable to our business operations.</p>
                          <p>Data is processed for business administration, financial reporting, audit purposes, and maintaining corporate records as required by law.</p>
                          <p>Personal Data may be processed in connection with business transactions, mergers, acquisitions, or corporate restructuring activities.</p>
                          <h3 className="text-xl font-bold mt-4">3.8 Data Quality and Management</h3>
                          <p>We process Personal Data to maintain data accuracy, completeness, and currency, including data validation, correction, and update procedures.</p>
                          <p>Data processing includes backup and recovery operations, data migration, and system maintenance activities to ensure service continuity.</p>
                          <h3 className="text-xl font-bold mt-4">3.9 Likeness and Performance Rights (Images, Audio, Video, Biometric-Derived Data)</h3>
                          <p>This clause applies where Personal Data includes an identifiable person’s image, voice, or performance (including data derived from such materials).</p>
                          <p>Where we process on a client’s documented instructions, the client is the controller and is responsible for the lawful basis, notices, and all required permissions (e.g., consents, publicity/portrait rights, performers’ permissions, and – where permitted – moral-rights waivers).</p>
                          <p>We use likeness/voice/performances only to:</p>
                          <ul className="list-disc pl-6 space-y-2">
                            <li>(i) perform the contracted services (collection, annotation, classification, transcription, QA, acceptance testing, delivery),</li>
                            <li>(ii) enforce platform integrity and security (access control, fraud/leakage detection, incident investigation),</li>
                            <li>(iii) comply with legal, audit, or regulatory obligations, and</li>
                            <li>(iv) in our controller capacity only, manage recruitment and workforce administration.</li>
                          </ul>
                          <p>We do not sell, license, promote, or otherwise exploit a person’s image, voice, or performance for our own purposes; we do not use such material for advertising without explicit consent or controller confirmation that valid consent has been obtained.</p>
                          <p>Client-provided material containing Personal Data (including likeness/voice) is not used to train, fine-tune, or evaluate models unless expressly instructed by the controller and permitted by law with appropriate notice/consent, or the material has been irreversibly anonymised with contractual and technical prohibitions on re-identification.</p>
                          <p>Where materials involve children/minors, we rely on the controller to ensure verifiable parental/guardian consent or another valid legal basis; absent such basis, the controller must instruct deletion or provide suitably masked/blurred or de-identified alternatives.</p>
                          <p>Any third party assisting us with such processing is bound by written terms that restrict use to the instructed purpose, impose equivalent confidentiality, security, and deletion obligations, and prohibit independent reuse or re-identification.</p>
                          <p>Where feasible and consistent with project accuracy, we apply pseudonymisation, masking/blur, redaction, access controls, audit logging, and (where appropriate) watermarking/fingerprinting and export controls to deter unauthorised copying.</p>
                          <p>We retain such materials only as necessary for the purposes in (c) and in accordance with controller instructions and applicable law, then delete or irreversibly anonymise and require subprocessors to do the same.</p>
                          <p>Individuals wishing to exercise data-subject or publicity/portrait/performer rights for client projects should contact the controller. Where we act as controller (e.g., recruitment), contact hr@lifewood.com.</p>
                        </div>
                      )}

                      {section.id === 'sharing' && (
                        <div className="grid gap-6">
                          <h3 className="text-xl font-bold">4.1 Categories of Third Party Recipients</h3>
                          <p>We may share your Personal Data with the following categories of third parties: service providers and contractors who assist in our business operations; professional advisors including lawyers, accountants, and auditors; technology partners and cloud service providers; payment processors and financial institutions; marketing and analytics service providers; and affiliates and subsidiary companies within our corporate group.</p>
                          <p>We may also share Personal Data with regulatory authorities, law enforcement agencies, courts, and other governmental bodies when required by law or legal process.</p>
                          <h3 className="text-xl font-bold mt-4">4.2 Service Providers and Contractors</h3>
                          <p>We engage third party service providers to perform functions on our behalf, including IT infrastructure management, customer support services, data analytics, marketing automation, payment processing, and AI model training and development.</p>
                          <p>Service providers are contractually bound to process Personal Data only for the specific purposes outlined in our agreements with them and in accordance with our instructions and applicable data protection requirements.</p>
                          <h3 className="text-xl font-bold mt-4">4.3 Business Partners and Affiliates</h3>
                          <p>We do not disclose client-provided Personal Data to ‘business partners’ for their own purposes. Any partner access is as our processors/sub-processors under contract, limited to the project purpose and prohibited from independent reuse.</p>
                          <p>Personal Data may be shared with affiliated companies within our corporate group for internal business operations, consolidated reporting, and service delivery across our organization.</p>
                          <h3 className="text-xl font-bold mt-4">4.4 Legal and Regulatory Disclosure</h3>
                          <p>We will disclose Personal Data when required by applicable law, court order, subpoena, or other legal process, or when we believe disclosure is necessary to protect our rights, property, or safety, or that of our users or the public.</p>
                          <p>In the event of a merger, acquisition, sale of assets, or similar corporate transaction, Personal Data may be transferred to the acquiring entity, subject to appropriate confidentiality protections and user notification.</p>
                          <h3 className="text-xl font-bold mt-4">4.5 Commercial and Marketing Purposes</h3>
                          <p>We may share aggregated, anonymized, or de-identified data with third parties for commercial purposes, market research, industry analysis, or product development, provided such data cannot reasonably be used to identify individual Data Subjects.</p>
                          <p>Personal Data may be shared with marketing partners for targeted advertising or promotional campaigns, only with appropriate user consent or where permitted by applicable law for legitimate business interests.</p>
                          <h3 className="text-xl font-bold mt-4">4.6 Conditions for Data Sharing</h3>
                          <p>All data sharing is conducted based on one or more of the following legal bases: user consent; performance of a contract; compliance with legal obligations; protection of vital interests; performance of tasks in the public interest; or legitimate business interests that do not override individual privacy rights.</p>
                          <p>Before sharing Personal Data, we ensure recipients have appropriate technical and organizational measures in place to protect the data and comply with applicable privacy laws and our contractual requirements.</p>
                          <h3 className="text-xl font-bold mt-4">4.7 User Control and Opt-Out Rights</h3>
                          <p>Users may withdraw consent for certain data sharing activities where consent is the legal basis for processing, and may opt-out of marketing-related data sharing through account settings or by contacting us directly.</p>
                          <p>Certain data sharing may be necessary for service delivery or legal compliance and cannot be opted out of while maintaining an active account or receiving our Services.</p>
                        </div>
                      )}

                      {section.id === 'security' && (
                        <div className="grid gap-6">
                          <h3 className="text-xl font-bold">5.1 Data Security Framework</h3>
                          <p>The Company implements comprehensive technical and organizational security measures designed to protect Personal Data against unauthorized access, disclosure, alteration, destruction, or loss, taking into account the nature, scope, context, and purposes of Processing as well as the risks to Data Subjects.</p>
                          <h3 className="text-xl font-bold mt-4">5.2 Technical Security Measures</h3>
                          <p>The Company employs industry-standard encryption protocols to protect Personal Data both in transit and at rest, including but not limited to SSL/TLS encryption for data transmission and AES-256 encryption for data storage.</p>
                          <p>Access controls are implemented through multi-factor authentication systems, role-based access permissions, and regular access reviews to ensure that only authorized personnel can access Personal Data on a need-to-know basis.</p>
                          <p>Network security measures include firewalls, intrusion detection systems, and regular security monitoring to prevent unauthorized access to our systems and infrastructure.</p>
                          <p>Data backup and recovery systems are maintained with encrypted backup storage and regular testing of recovery procedures to ensure data integrity and availability.</p>
                          <h3 className="text-xl font-bold mt-4">5.3 Organizational Security Measures</h3>
                          <p>All employees with access to Personal Data undergo mandatory privacy and data security training upon employment and receive regular updates on security protocols and best practices.</p>
                          <p>The Company maintains strict confidentiality agreements with all staff members and Third Party service providers who may have access to Personal Data during the course of their duties.</p>
                          <p>Clear data handling procedures and security policies are established and regularly reviewed to ensure ongoing compliance with security standards and regulatory requirements.</p>
                          <p>Regular security audits and vulnerability assessments are conducted to identify and address potential security risks and ensure the effectiveness of implemented security measures.</p>
                          <h3 className="text-xl font-bold mt-4">5.4 Physical Security Controls</h3>
                          <p>Physical access to facilities containing Personal Data is restricted through secure access controls, surveillance systems, and environmental controls to protect against unauthorized physical access, theft, or damage to data storage systems.</p>
                          <h3 className="text-xl font-bold mt-4">5.5 Third Party Security Requirements</h3>
                          <p>All Third Party service providers and data processors are required to implement appropriate technical and organizational security measures equivalent to those maintained by the Company and must provide adequate assurances regarding the security of Personal Data Processing.</p>
                          <h3 className="text-xl font-bold mt-4">5.6 Security Incident Response</h3>
                          <p>The Company maintains documented procedures for detecting, reporting, and responding to security incidents, including immediate containment measures, impact assessment, and notification procedures in accordance with applicable legal requirements.</p>
                          <h3 className="text-xl font-bold mt-4">5.7 Continuous Security Improvement</h3>
                          <p>Security measures are regularly reviewed and updated to address evolving threats, technological developments, and regulatory changes, ensuring that Personal Data protection remains effective and compliant with current standards.</p>
                        </div>
                      )}

                      {section.id === 'rights' && (
                        <div className="grid gap-6">
                          <h3 className="text-xl font-bold">6.1 Right of Access</h3>
                          <p>Data Subjects have the right to request access to their Personal Data held by the Company and to receive information about the purposes of Processing, categories of Personal Data involved, and recipients of the data.</p>
                          <h3 className="text-xl font-bold mt-4">6.2 Right to Rectification</h3>
                          <p>Data Subjects have the right to request the correction of inaccurate or incomplete Personal Data held by the Company without undue delay.</p>
                          <h3 className="text-xl font-bold mt-4">6.3 Right to Erasure (Right to be Forgotten)</h3>
                          <p>Data Subjects have the right to request the deletion of their Personal Data where the data is no longer necessary for the purposes for which it was collected, or where Consent has been withdrawn and no other legal basis for Processing exists.</p>
                          <h3 className="text-xl font-bold mt-4">6.4 Right to Restriction of Processing</h3>
                          <p>Data Subjects have the right to request the restriction of Processing where the accuracy of the Personal Data is contested, the Processing is unlawful, or the data is no longer needed for the original purposes but is required for legal claims.</p>
                          <h3 className="text-xl font-bold mt-4">6.5 Right to Data Portability</h3>
                          <p>Data Subjects have the right to receive their Personal Data in a structured, commonly used, and machine-readable format and have the right to transmit that data to another controller without hindrance from the Company.</p>
                          <h3 className="text-xl font-bold mt-4">6.6 Right to Object</h3>
                          <p>Data Subjects have the right to object to the Processing of their Personal Data for direct marketing purposes or where Processing is based on Legitimate Interests, unless the Company demonstrates compelling legitimate grounds for the Processing.</p>
                          <h3 className="text-xl font-bold mt-4">6.7 Exercise of Rights</h3>
                          <p>All rights requests must be submitted in writing to the DPO using the contact details provided in Section 16, accompanied by sufficient information to verify the identity of the requestor.</p>
                          <p>The Company may request additional information to verify identity and prevent fraudulent requests, particularly for sensitive requests such as data access or erasure.</p>
                          <p>Rights requests will be processed free of charge unless requests are manifestly unfounded, excessive, or repetitive, in which case the Company may charge a reasonable administrative fee or refuse the request.</p>
                          <h3 className="text-xl font-bold mt-4">6.8 Response Timeframes</h3>
                          <p>The Company will acknowledge receipt of rights requests within five (5) business days and respond within the period required by applicable law (for example, up to forty (40) days in Hong Kong for data access requests). Where law permits, we may extend once for complex requests and will inform you of the reasons.</p>
                          <p>Complex requests may require extension of the response period by an additional thirty (30) days, of which the data subject will be notified along with reasons for the delay.</p>
                          <h3 className="text-xl font-bold mt-4">6.9 Appeal Process</h3>
                          <p>Where a rights request is refused or the data subject is dissatisfied with the Company's response, they may file a complaint with the Privacy Commissioner for Personal Data in Hong Kong.</p>
                          <p>Data subjects retain the right to seek judicial remedy through Hong Kong courts for alleged violations of their privacy rights under applicable law.</p>
                        </div>
                      )}

                      {section.id === 'retention' && (
                        <div className="grid gap-6">
                          <h3 className="text-xl font-bold">7.1 General Retention Principle</h3>
                          <p>The Company retains Personal Data only for as long as necessary to fulfil the purposes described in this notice (or as instructed by the relevant controller), to comply with legal, regulatory, tax, accounting, or reporting obligations, to maintain security and audit trails, and to establish, exercise, or defend legal claims. When data is no longer required, we delete or irreversibly anonymise it.</p>
                          <h3 className="text-xl font-bold mt-4">7.2 Processor vs. Controller</h3>
                          <div className="pl-4 space-y-4">
                            <div>
                              <h4 className="font-bold mb-1">7.2.1 Processor Role (Client Projects)</h4>
                              <p>Retention, deletion, and return are governed by the client’s documented instructions and applicable law; our internal default schedules do not override controller mandates.</p>
                            </div>
                            <div>
                              <h4 className="font-bold mb-1">7.2.2 Controller Role (Our Own Business Operations)</h4>
                              <p>We apply the purpose-based periods set out below or any mandatory statutory period, whichever is longer.</p>
                            </div>
                          </div>
                          <h3 className="text-xl font-bold mt-4">7.3 Typical Retention Periods (Non-Exhaustive, for Lifewood-Controller Data)</h3>
                          <p>These are indicative and may vary by law and system of record:</p>
                          <div className="pl-4 space-y-4">
                            <div>
                              <h4 className="font-bold mb-1">7.3.1 Customer & User Account Records (Business contacts, portal accounts, role/access metadata):</h4>
                              <p>retained for the life of the account and typically up to 24 months after closure, unless a longer period is needed for audit, security, or dispute resolution.</p>
                            </div>
                            <div>
                              <h4 className="font-bold mb-1">7.3.2 Customer Support & Communications (Tickets, emails, chat logs):</h4>
                              <p>retained for service history and QA and typically up to 24–36 months after resolution, unless a longer period is required by law or to resolve a dispute.</p>
                            </div>
                            <div>
                              <h4 className="font-bold mb-1">7.3.3 Financial & Tax Records (Invoices, POs, payment confirmations):</h4>
                              <p>retained for at least seven (7) years or longer where required by applicable law.</p>
                            </div>
                            <div>
                              <h4 className="font-bold mb-1">7.3.4 Security & Access Logs (Authentication, activity, anomaly signals):</h4>
                              <p>retained typically 12–24 months, subject to security and fraud-prevention needs.</p>
                            </div>
                            <div>
                              <h4 className="font-bold mb-1">7.3.5 Marketing Preferences & Outreach</h4>
                              <p>Retained until you opt out or we no longer need the data for lawful marketing, then suppressed to respect future opt-outs.</p>
                            </div>
                            <div>
                              <h4 className="font-bold mb-1">7.3.6 Recruitment Data (Applicants)</h4>
                              <p>Retained typically up to 12–24 months after the process ends unless hired or local law requires otherwise.</p>
                            </div>
                            <div>
                              <h4 className="font-bold mb-1">7.3.6 Recruitment Data (Applicants)</h4>
                              <p>Retained typically up to 12–24 months after the process ends unless hired or local law requires otherwise.</p>
                            </div>
                            <div>
                              <h4 className="font-bold mb-1">7.3.7 AI-Generated Content and Training Data</h4>
                              <p>We typically retain authorised training artefacts only for the period specified by the controller and no longer than necessary for audit and model validation. Where feasible we retain only anonymised, non-personal artefacts for longer-term improvement, with re-identification prohibited.</p>
                            </div>
                          </div>
                        </div>
                      )}

                      {section.id === 'cookies' && (
                        <div className="grid gap-6">
                          <h3 className="text-xl font-bold">8.1 Types of Tracking Technologies Used</h3>
                          <p>The Company uses cookies, which are small text files stored on users' devices to enhance website functionality and user experience.</p>
                          <p>We employ web beacons (also known as pixel tags) to track user interactions with our websites and email communications.</p>
                          <p>Our Services may utilize local storage technologies, including HTML5 local storage and browser cache, to store user preferences and technical information.</p>
                          <p>We implement analytics tracking tools and software development kits (SDKs) to collect usage statistics and performance data.</p>
                          <h3 className="text-xl font-bold mt-4">8.2 Categories of Cookies</h3>
                          <div className="pl-4 space-y-4">
                            <div>
                              <h4 className="font-bold mb-1">8.2.1 Essential Cookies</h4>
                              <p>Necessary for basic website functionality, user authentication, and security features, and cannot be disabled without affecting core Services.</p>
                            </div>
                            <div>
                              <h4 className="font-bold mb-1">8.2.2 Performance Cookies</h4>
                              <p>Collect aggregated information about website usage, page load times, and technical performance to improve our Services.</p>
                            </div>
                            <div>
                              <h4 className="font-bold mb-1">8.2.3 Functional Cookies</h4>
                              <p>Remember user preferences, language settings, and customization choices to enhance user experience.</p>
                            </div>
                            <div>
                              <h4 className="font-bold mb-1">8.2.4 Marketing Cookies</h4>
                              <p>Track user behavior across websites to deliver targeted advertising and measure campaign effectiveness.</p>
                            </div>
                          </div>
                          <h3 className="text-xl font-bold mt-4">8.3 Purposes of Data Collection</h3>
                          <p>Tracking technologies are used to maintain user sessions, remember login credentials, and provide personalized content recommendations.</p>
                          <p>We collect analytics data to understand user behavior patterns, optimize website performance, and improve our technology solutions.</p>
                          <p>Marketing cookies enable us to deliver relevant advertisements, measure marketing campaign performance, and conduct A/B testing of our Services.</p>
                          <p>Technical cookies support fraud prevention, security monitoring, and system diagnostics essential for maintaining service integrity.</p>
                          <h3 className="text-xl font-bold mt-4">8.4 Third-Party Tracking Technologies</h3>
                          <p>Our websites may contain third-party tracking technologies from analytics providers, advertising networks, and social media platforms.</p>
                          <p>Third-party cookies are governed by the respective privacy policies of external service providers, and we do not control their data collection practices.</p>
                          <p>We may share aggregated and anonymized data collected through tracking technologies with business partners and service providers for commercial purposes.</p>
                          <h3 className="text-xl font-bold mt-4">8.5 User Control and Management Options</h3>
                          <p>Users can manage cookie preferences through their browser settings, including blocking, deleting, or restricting certain types of cookies.</p>
                          <p>We provide a cookie consent management tool on our website allowing users to customize their tracking preferences for non-essential cookies.</p>
                          <p>Users may opt out of marketing cookies and targeted advertising through industry opt-out mechanisms and third-party preference centers.</p>
                          <p>Disabling essential cookies may result in reduced website functionality and limited access to certain Services features.</p>
                          <h3 className="text-xl font-bold mt-4">8.6 Data Retention for Tracking Technologies</h3>
                          <p>When acting as processor, client instructions and applicable law govern retention and deletion; Lifewood’s default schedules do not override controller mandates. For Lifewood-controller data, we retain only as long as necessary for stated purposes and legal obligations, then delete or irreversibly anonymise.</p>
                          <h3 className="text-xl font-bold mt-4">8.7 Cross-Site Tracking and Advertising</h3>
                          <p>We may participate in cross-site tracking activities to deliver personalized advertising experiences across different websites and platforms.</p>
                          <p>Users can enable "Do Not Track" browser settings, though we cannot guarantee that all third-party services will honor such requests.</p>
                          <p>We comply with applicable advertising industry standards and guidelines regarding behavioral advertising and user privacy preferences.</p>
                        </div>
                      )}

                      {section.id === 'transfers' && (
                        <div className="grid gap-6">
                          <h3 className="text-xl font-bold">9.1 Cross-Border Transfer Framework</h3>
                          <p>Transfers rely on recognised safeguards (e.g., Standard Contractual Clauses, intragroup agreements, or other approved mechanisms). Where a client mandates residency (e.g., EU-only processing), Lifewood will enforce geographic access controls and contractual flow-down to all subprocessors.</p>
                          <h3 className="text-xl font-bold mt-4">9.2 Adequacy Assessments</h3>
                          <p>Before transferring Personal Data to any jurisdiction outside Hong Kong, the Company conducts assessments to determine whether the receiving jurisdiction provides adequate protection for Personal Data comparable to the standards required under Hong Kong law.</p>
                          <h3 className="text-xl font-bold mt-4">9.3 Transfer Safeguards</h3>
                          <p>Where Personal Data is transferred to jurisdictions that do not provide adequate protection, the Company implements appropriate safeguards including:</p>
                          <ul className="list-disc pl-6 space-y-2">
                            <li>Standard contractual clauses approved by relevant data protection authorities;</li>
                            <li>Binding corporate rules for transfers within our corporate group;</li>
                            <li>Certification schemes and codes of conduct that demonstrate adequate protection;</li>
                            <li>Specific contractual obligations requiring recipients to maintain equivalent data protection standards.</li>
                          </ul>
                          <h3 className="text-xl font-bold mt-4">9.4 Consent-Based Transfers</h3>
                          <p>In certain circumstances, the Company may rely on explicit consent from Data Subjects for Cross-Border Transfers where other safeguards are not available, provided such consent is freely given, specific, informed, and unambiguous.</p>
                          <h3 className="text-xl font-bold mt-4">9.5 Transfer Documentation</h3>
                          <p>The Company maintains records of all Cross-Border Transfers including:</p>
                          <ul className="list-disc pl-6 space-y-2">
                            <li>Details of receiving parties and their locations;</li>
                            <li>Categories of Personal Data transferred;</li>
                            <li>Safeguards implemented for each transfer;</li>
                            <li>Legal basis and necessity for the transfer.</li>
                          </ul>
                          <h3 className="text-xl font-bold mt-4">9.6 Third-Party Processor Obligations</h3>
                          <p>All Third Parties receiving Personal Data through Cross-Border Transfers must:</p>
                          <ul className="list-disc pl-6 space-y-2">
                            <li>Process Personal Data only for specified purposes and in accordance with our instructions;</li>
                            <li>Implement appropriate technical and organizational security measures;</li>
                            <li>Notify the Company immediately of any Data Breach or unauthorized access;</li>
                            <li>Assist the Company in responding to Data Subject rights requests.</li>
                          </ul>
                          <h3 className="text-xl font-bold mt-4">9.7 Transfer Restrictions</h3>
                          <p>The Company will not transfer Personal Data to jurisdictions or entities subject to international sanctions, trade restrictions, or where such transfer would violate applicable laws or compromise Data Subject rights.</p>
                          <h3 className="text-xl font-bold mt-4">9.8 Notification of Changes</h3>
                          <p>Data Subjects will be notified of any material changes to Cross-Border Transfer practices through policy updates, direct communication, or website notifications as appropriate to the circumstances.</p>
                        </div>
                      )}

                      {section.id === 'breach' && (
                        <div className="grid gap-6">
                          <h3 className="text-xl font-bold">10.1 Data Breach Detection and Assessment</h3>
                          <p>The Company maintains continuous monitoring systems and procedures to detect potential Data Breaches affecting Personal Data under our control or processing.</p>
                          <p>Upon discovery of a suspected Data Breach, the Company will immediately conduct a preliminary assessment to determine the nature, scope, and potential impact of the incident within 24 hours of detection.</p>
                          <p>The assessment shall evaluate the categories of Personal Data involved, the number of Data Subjects potentially affected, the likelihood of harm, and the severity of consequences for affected individuals.</p>
                          <h3 className="text-xl font-bold mt-4">10.2 Internal Breach Response Team</h3>
                          <p>The Company has established a dedicated data breach response team comprising representatives from information technology, legal, compliance, and senior management to coordinate breach response activities.</p>
                          <p>The Data Protection Officer or designated privacy lead shall serve as the primary coordinator for all Data Breach response activities and external communications.</p>
                          <h3 className="text-xl font-bold mt-4">10.3 Containment and Risk Mitigation</h3>
                          <p>Upon confirmation of a Data Breach, the Company will immediately implement containment measures to prevent further unauthorized access, use, or disclosure of Personal Data.</p>
                          <p>The Company will take all reasonable steps to mitigate potential harm to affected Data Subjects, which may include resetting passwords, suspending compromised accounts, or implementing additional security measures.</p>
                          <p>Where technically feasible, the Company will attempt to recover any Personal Data that has been improperly accessed or disclosed.</p>
                          <h3 className="text-xl font-bold mt-4">10.4 Regulatory Notification Requirements</h3>
                          <p>The Company will notify regulators and affected individuals in accordance with applicable law in each jurisdiction (e.g., “as soon as practicable or within statutory time limits where prescribed) We assess materiality, harm likelihood, and scale to determine notification.</p>
                          <p>The notification to regulatory authorities will include a description of the nature of the breach, categories and approximate number of Data Subjects affected, likely consequences, and measures taken or proposed to address the breach.</p>
                          <p>Where the initial notification cannot contain all required information, the Company will provide additional information in phases without undue delay as it becomes available.</p>
                          <h3 className="text-xl font-bold mt-4">10.5 Individual Notification Procedures</h3>
                          <p>The Company will notify affected Data Subjects without undue delay when a Data Breach is likely to result in a high risk to their rights and freedoms, privacy, or may cause significant harm.</p>
                          <p>Individual notifications will be communicated through the most effective means available, including email, direct mail, telephone contact, or prominent website notices, depending on the circumstances and available contact information.</p>
                          <p>The notification to individuals will be written in clear and plain language and include a description of the nature of the breach, categories of Personal Data involved, steps taken to address the breach, recommendations for protective measures, and contact information for further inquiries.</p>
                          <h3 className="text-xl font-bold mt-4">10.6 Documentation and Record Keeping</h3>
                          <p>The Company will maintain comprehensive documentation of all Data Breaches, including the facts surrounding the breach, its effects, and remedial actions taken.</p>
                          <p>Breach records will be retained for a minimum period of seven (7) years and will be made available to regulatory authorities upon request.</p>
                          <h3 className="text-xl font-bold mt-4">10.7 Post-Breach Review and Improvement</h3>
                          <p>Following resolution of any Data Breach, the Company will conduct a thorough post-incident review to identify root causes, evaluate the effectiveness of response measures, and implement improvements to prevent similar incidents.</p>
                          <p>The Company will update its security measures, policies, and procedures based on lessons learned from Data Breach incidents and evolving threat landscapes.</p>
                          <h3 className="text-xl font-bold mt-4">10.8 Third Party Processor Breaches</h3>
                          <p>Where a Data Breach occurs at a Third Party Data Processor acting on behalf of the Company, the processor must notify the Company immediately upon becoming aware of the breach.</p>
                          <p>The Company will coordinate with Third Party processors to ensure appropriate breach response measures are implemented and regulatory notification obligations are met within required timeframes.</p>
                        </div>
                      )}

                      {section.id === 'commercial' && (
                        <div className="grid gap-6">
                          <h3 className="text-xl font-bold">11.1 General Commercial Use Principles</h3>
                          <p>The Company may use Personal Data for legitimate commercial purposes that support our business operations, service delivery, and growth objectives, provided such use is lawful, fair, and transparent to Data Subjects.</p>
                          <h3 className="text-xl font-bold mt-4">11.2 Marketing and Communications</h3>
                          <p>We may use Personal Data to send marketing communications, promotional materials, newsletters, and service updates through email, SMS, or other communication channels where we have obtained appropriate Consent or have a Legitimate Interest to do so, in compliance with applicable laws including GDPR requirements for EU data subjects.</p>
                          <p>Marketing communications may include information about new products, services, features, special offers, industry insights, and company updates relevant to our technology solutions.</p>
                          <p>Data Subjects may opt out of marketing communications at any time through unsubscribe links, account settings, or by contacting us directly using the information provided in Section 16.</p>
                          <h3 className="text-xl font-bold mt-4">11.3 Product Development and Innovation</h3>
                          <p>Personal Data may be used to develop, improve, test, and enhance our technology products and Services, including the development of new features, functionalities, and AI-Generated Content capabilities.</p>
                          <p>We may analyze usage patterns, user feedback, and interaction data to identify opportunities for product improvements and to create more personalized user experiences.</p>
                          <p>AI model training and machine learning activities may utilize Personal Data to improve the accuracy, performance, and capabilities of our technology solutions, subject to appropriate data protection safeguards.</p>
                          <h3 className="text-xl font-bold mt-4">11.4 Business Analytics and Intelligence</h3>
                          <p>We process Personal Data for business analytics purposes including market research, trend analysis, performance measurement, and strategic planning to support informed business decision-making.</p>
                          <p>Analytics activities may involve creating aggregated, statistical, or trend reports that help us understand user behaviour, service performance, and market opportunities.</p>
                          <p>Where possible, we utilize Anonymisation techniques to reduce privacy risks while maintaining the analytical value of data for commercial insights. For avoidance of doubt, aggregated data could be derived from your personal data but is not considered personal data in law as this data will not directly or indirectly reveal your identity. For example, we may aggregate your Usage Data to calculate the percentage of users accessing a specific website feature. However, if we combine or connect Aggregated Data with your personal data which will be used in accordance with this privacy policy.</p>
                          <h3 className="text-xl font-bold mt-4">11.5 Customer Relationship Management</h3>
                          <p>Personal Data is used to manage customer relationships, provide personalized service experiences, and maintain comprehensive records of customer interactions and preferences.</p>
                          <p>We may use Personal Data to segment customers for targeted service delivery, customize user interfaces, and provide relevant content and recommendations.</p>
                          <h3 className="text-xl font-bold mt-4">11.6 Revenue Generation and Monetisation</h3>
                          <p>Personal Data may be used to support revenue-generating activities including subscription management, billing processes, payment processing, and financial reporting.</p>
                          <p>We may analyze purchasing patterns and user behavior to develop pricing strategies, identify cross-selling opportunities, and optimize our commercial offerings.</p>
                          <h3 className="text-xl font-bold mt-4">11.7 Legal Basis for Commercial Use</h3>
                          <p>Commercial use of Personal Data is conducted under appropriate legal bases including Consent, Legitimate Interest, contractual necessity, or legal obligation as required by applicable Hong Kong privacy laws.</p>
                          <p>Where we rely on Legitimate Interest as a legal basis (including under GDPR Article 6(1)(f) for EU data subjects), we conduct balancing assessments to ensure our commercial interests do not override the fundamental rights and freedoms of Data Subjects.</p>
                          <h3 className="text-xl font-bold mt-4">11.8 Limitations and Safeguards</h3>
                          <p>Commercial use of Personal Data is subject to the data minimization principle, ensuring we only process data that is necessary, relevant, and proportionate to the specified commercial purposes.</p>
                          <p>All commercial data processing activities are conducted in accordance with our Data Security measures outlined in Section 5 and are subject to the Data Retention periods specified in Section 7.</p>
                          <p>Data Subjects retain all rights specified in Section 6 regarding Personal Data used for commercial purposes, including the right to object to Processing based on Legitimate Interest.</p>
                        </div>
                      )}

                      {section.id === 'third-party' && (
                        <div className="grid gap-6">
                          <h3 className="text-xl font-bold">12.1 Third-Party Websites and Services</h3>
                          <p>Our Services may contain links to third-party websites, applications, or services that are not owned or controlled by the Company. This Privacy Policy does not apply to such third-party websites or services.</p>
                          <h3 className="text-xl font-bold mt-4">12.2 Limitation of Responsibility</h3>
                          <p>The Company is not responsible for the privacy practices, content, or policies of any third-party websites, applications, or services that may be accessed through links provided on our Services.</p>
                          <h3 className="text-xl font-bold mt-4">12.3 User Responsibility for Third-Party Interactions</h3>
                          <p>When you access third-party websites or services through our Services, you do so at your own risk and subject to the terms and privacy policies of those third parties.</p>
                          <h3 className="text-xl font-bold mt-4">12.4 Third-Party Service Providers</h3>
                          <p>We may engage third-party service providers to assist in delivering our Services, including cloud storage providers, analytics services, payment processors, and marketing platforms. Such third parties are bound by contractual obligations to protect Personal Data in accordance with this Privacy Policy.</p>
                          <h3 className="text-xl font-bold mt-4">12.5 Data Sharing with Third-Party Service Providers</h3>
                          <p>Personal Data shared with third-party service providers including but not limited to:</p>
                          <ul className="list-disc pl-6 space-y-2">
                            <li>(i) business partners, suppliers, and subcontractors for contract performance,</li>
                            <li>(ii) professional advisers acting as processors or joint controllers including lawyers, bankers, auditors, and insurers, and</li>
                            <li>(iii) regulators, authorities, and enforcement agencies is limited to what is necessary for them to perform their designated functions and is subject to appropriate data protection safeguards and confidentiality obligations.</li>
                          </ul>
                          <h3 className="text-xl font-bold mt-4">12.6 Social Media Integration</h3>
                          <p>Our Services may include social media features and widgets provided by third parties. These features may collect information about your IP address, pages visited, and may set Cookies to enable proper functionality.</p>
                          <h3 className="text-xl font-bold mt-4">12.7 Recommendation to Review Third-Party Policies</h3>
                          <p>We strongly encourage users to read the privacy policies and terms of service of any third-party websites or services before providing Personal Data or engaging with such platforms.</p>
                          <h3 className="text-xl font-bold mt-4">12.8 Changes to Third-Party Relationships</h3>
                          <p>The Company reserves the right to add, remove, or modify third-party service relationships as necessary for business operations, with appropriate notice provided for material changes that may affect Personal Data processing.</p>
                        </div>
                      )}

                      {section.id === 'children' && (
                        <div className="grid gap-6">
                          <h3 className="text-xl font-bold">13.1 Age Restrictions and Service Eligibility</h3>
                          <p>Our Services are not intended for use by individuals under the age of 18 years. We do not knowingly collect, use, or disclose Personal Data from children under 18 years of age without appropriate parental or guardian consent as required by applicable law. Any minor data in client archives is controller-authorised, and Lifewood applies heightened safeguards as processor.</p>
                          <h3 className="text-xl font-bold mt-4">13.2 Verification of Age</h3>
                          <p>We implement reasonable measures to verify the age of users during account registration and service access. Users are required to confirm their age and represent that they are at least 18 years old or have obtained appropriate parental consent.</p>
                          <h3 className="text-xl font-bold mt-4">13.3 Parental Consent Requirements</h3>
                          <p>Where we become aware that Personal Data of a child under 18 has been collected without proper parental consent, we will take immediate steps to obtain such consent or delete the Personal Data.</p>
                          <p>Parents or legal guardians may provide consent for their child's use of our Services by contacting us using the details provided in Section 16 of this Privacy Policy.</p>
                          <p>We may require additional verification measures to confirm the identity of parents or guardians before processing consent requests.</p>
                          <h3 className="text-xl font-bold mt-4">13.4 Enhanced Protection for Children's Data</h3>
                          <p>When processing Personal Data of children with appropriate consent, we apply additional safeguards including limited data collection, enhanced security measures, and restricted data sharing.</p>
                          <p>We do not use children's Personal Data for direct marketing purposes or behavioral advertising without explicit parental consent.</p>
                          <p>Children's Personal Data is subject to shorter Retention Periods and more restrictive access controls than adult user data.</p>
                          <h3 className="text-xl font-bold mt-4">13.5 Parental Rights and Controls</h3>
                          <p>Parents or guardians have the right to access, review, modify, or request deletion of their child's Personal Data at any time.</p>
                          <p>Parents may withdraw consent for their child's use of our Services, which may result in account termination and data deletion.</p>
                          <p>We will respond to parental requests regarding children's Personal Data within 30 days of receipt.</p>
                          <h3 className="text-xl font-bold mt-4">13.6 Discovery of Underage Users</h3>
                          <p>If we discover that we have collected Personal Data from a child under 18 without appropriate consent, we will delete such information within 30 days unless legally required to retain it or unless valid parental consent is obtained within that timeframe.</p>
                          <h3 className="text-xl font-bold mt-4">13.7 Educational and Training Content</h3>
                          <p>Where our Services include AI-Generated Content or training materials that may be accessed by children, we ensure such content is appropriate and does not collect additional Personal Data beyond what is necessary for service provision.</p>
                        </div>
                      )}

                      {section.id === 'updates' && (
                        <div className="grid gap-6">
                          <h3 className="text-xl font-bold">14.1 Policy Modification Authority</h3>
                          <p>The Company reserves the right to modify, update, or amend this Privacy Policy at any time to reflect changes in our business practices, legal requirements, or regulatory developments.</p>
                          <h3 className="text-xl font-bold mt-4">14.2 Types of Changes</h3>
                          <div className="pl-4 space-y-4">
                            <div>
                              <h4 className="font-bold mb-1">14.2.1 Material Changes</h4>
                              <p>Include modifications that significantly affect how we collect, use, share, or protect personal data, changes to user rights, alterations to data retention periods, or modifications to our legal basis for processing.</p>
                            </div>
                            <div>
                              <h4 className="font-bold mb-1">14.2.2 Non-Material Changes</h4>
                              <p>Include administrative updates, clarifications of existing practices, contact information updates, or minor editorial corrections that do not substantively alter our data handling practices.</p>
                            </div>
                          </div>
                          <h3 className="text-xl font-bold mt-4">14.3 Notification Methods for Material Changes</h3>
                          <p>We will provide thirty (30) days advance notice of material changes through prominent notice on our website homepage and primary service interfaces.</p>
                          <p>Direct notification will be sent to users via email to their registered email addresses for material changes that may affect their rights or our processing activities.</p>
                          <p>In-application notifications will be displayed to active users upon their next login or service access following material policy changes.</p>
                          <h3 className="text-xl font-bold mt-4">14.4 Non-Material Change Notifications</h3>
                          <p>Non-material changes will be communicated through updated version information on our website and within the policy document itself, without requirement for advance notice.</p>
                          <h3 className="text-xl font-bold mt-4">14.5 Effective Date Implementation</h3>
                          <p>Material changes become effective thirty (30) days after notification, allowing users time to review changes and exercise their rights.</p>
                          <p>Non-material changes become effective immediately upon publication of the updated policy.</p>
                          <p>The "Last Updated" date at the beginning of this policy will reflect the most recent modification date.</p>
                          <h3 className="text-xl font-bold mt-4">14.6 User Response to Changes</h3>
                          <p>Continued use of our Services after the effective date of material changes constitutes acceptance of the updated Privacy Policy.</p>
                          <p>Users who disagree with material changes may discontinue use of our Services and request data deletion in accordance with Section 6 (User Rights and Controls).</p>
                          <h3 className="text-xl font-bold mt-4">14.7 Version Control and Archive</h3>
                          <p>We maintain version control for all policy updates with clear identification of version numbers and modification dates.</p>
                          <p>Previous versions of this Privacy Policy will be archived and made available upon request for a period of three (3) years from their replacement date.</p>
                          <h3 className="text-xl font-bold mt-4">14.8 Emergency Updates</h3>
                          <p>In cases of data security incidents or urgent legal compliance requirements, we may implement immediate policy changes with concurrent notification to affected users and subsequent formal notice procedures.</p>
                        </div>
                      )}

                      {section.id === 'compliance' && (
                        <div className="grid gap-6">
                          <h3 className="text-xl font-bold">15.1 Applicable Laws and Regulations</h3>
                          <p>This Privacy Policy and the Company's data processing activities are governed primarily by the Personal Data (Privacy) Ordinance (Cap. 486) of Hong Kong and all applicable amendments, subsidiary legislation, and codes of practice issued thereunder.</p>
                          <p>Additionally, the Company complies with applicable privacy and data protection laws in all jurisdictions where it operates or engages with data subjects, including but not limited to Malaysia's Personal Data Protection Act, relevant Chinese data protection regulations, United States federal and state privacy laws, Philippine Data Privacy Act, Bangladesh Data Protection Act, Indonesian data protection regulations, the European Union General Data Protection Regulation (GDPR) for engagement with EU data subjects, and other applicable local privacy laws.</p>
                          <h3 className="text-xl font-bold mt-4">15.2 Data Protection Principles Compliance</h3>
                          <p>The Company commits to adhering to the six Data Protection Principles established under the Personal Data (Privacy) Ordinance and equivalent principles under applicable privacy laws in all jurisdictions where it operates or engages with data subjects, including GDPR principles for EU data subjects.</p>
                          <p>These principles encompass purpose limitation, accuracy, retention limitation, data security, openness, and access principles in all data processing activities.</p>
                          <h3 className="text-xl font-bold mt-4">15.3 Privacy Commissioner Guidelines</h3>
                          <p>The Company follows guidance, codes of practice, and enforcement notices issued by the Privacy Commissioner for Personal Data, Hong Kong, and equivalent regulatory authorities in all jurisdictions where it operates or engages with data subjects, including European data protection authorities for GDPR compliance.</p>
                          <p>The Company regularly reviews its practices to ensure ongoing compliance with regulatory expectations and best practices across multiple legal frameworks.</p>
                          <h3 className="text-xl font-bold mt-4">15.4 Cross-Border Transfer Compliance</h3>
                          <p>Where personal data is transferred outside Hong Kong or between other jurisdictions where the Company operates or engages with data subjects, including transfers involving EU data subjects, the Company ensures compliance with:</p>
                          <ul className="list-disc pl-6 space-y-2">
                            <li>Prescribed requirements under Data Protection Principle 3 of the Hong Kong Ordinance,</li>
                            <li>GDPR adequacy and safeguard requirements, and</li>
                            <li>Equivalent cross-border transfer requirements under applicable laws in all relevant jurisdictions, including any exemptions or prescribed circumstances as defined in the respective privacy legislation.</li>
                          </ul>
                          <h3 className="text-xl font-bold mt-4">15.5 Regulatory Monitoring and Updates</h3>
                          <p>The Company maintains ongoing monitoring of changes to privacy laws and regulations, and all other jurisdictions where it operates or engages with data subjects — including GDPR developments and European data protection regulations.</p>
                          <p>Necessary updates are implemented to policies, procedures, and technical measures to ensure continued compliance with evolving legal requirements across multiple regulatory frameworks.</p>
                          <h3 className="text-xl font-bold mt-4">15.6 Industry Standards Alignment</h3>
                          <p>In addition to legal compliance, the Company strives to align its data protection practices with recognized international standards and industry best practices for data security and privacy protection in the technology sector.</p>
                          <h3 className="text-xl font-bold mt-4">15.7 Compliance Auditing and Review</h3>
                          <p>The Company conducts regular internal audits and reviews of its data processing activities, privacy controls, and compliance measures to ensure adherence to applicable laws and the effectiveness of implemented safeguards.</p>
                          <h3 className="text-xl font-bold mt-4">15.8 Legal Basis for Processing</h3>
                          <p>All personal data processing activities are conducted based on lawful grounds including consent, contractual necessity, legal obligation, vital interests, public task, or legitimate interests as recognized under applicable Hong Kong privacy law and equivalent legal bases under privacy legislation in all jurisdictions where the Company operates or engages with data subjects, including the six lawful bases under GDPR for EU data subjects.</p>
                        </div>
                      )}

                      {section.id === 'contact' && (
                        <div className="grid gap-6">
                          <h3 className="text-xl font-bold">16.1 Contact Information and Complaints</h3>
                          <p>All privacy-related inquiries, requests, and communications should be directed to our designated privacy contact:</p>
                          <div className="glass p-6 rounded-2xl border border-lifewood-green/20">
                            <p className="font-bold text-lifewood-green mb-2">Email:</p>
                            <p className="mb-4">hr@lifewood.com</p>
                            <p className="font-bold text-lifewood-green mb-2">Postal Address:</p>
                            <p>Lifewood Data Technology Limited, Unit 19, 9/F, Core C, Cyberport 3, 100 Cyberport Road, Hong Kong</p>
                          </div>
                          <h3 className="text-xl font-bold mt-4">16.2 Response Time Commitments</h3>
                          <p>We will acknowledge receipt of privacy inquiries within three (3) business days of receiving your communication.</p>
                          <p>We will provide a substantive response to data subject rights requests within thirty (30) days of verification of your identity and request validity.</p>
                          <p>Complex requests may require additional time, in which case we will notify you of the extended timeframe and provide regular updates on progress.</p>
                          <h3 className="text-xl font-bold mt-4">16.3 Identity Verification Requirements</h3>
                          <p>To protect your privacy and prevent unauthorized access to personal data, we may require verification of your identity before processing certain requests.</p>
                          <p>Acceptable forms of identification include government-issued photo identification, account credentials, or other verification methods as determined appropriate by the Company.</p>
                          <h3 className="text-xl font-bold mt-4">16.4 Complaints Procedure</h3>
                          <p>If you are not satisfied with our handling of your privacy inquiry or believe we have violated your privacy rights, you may file a formal complaint with us using the contact information provided in Clause 16.1.</p>
                          <p>We will investigate all complaints thoroughly and provide a written response within forty-five (45) days of receiving the complaint.</p>
                          <h3 className="text-xl font-bold mt-4">16.5 Regulatory Authority Complaints</h3>
                          <p>You have the right to lodge a complaint with the relevant regulatory authority in Hong Kong regarding our data processing practices.</p>
                          <div className="pl-4 space-y-4">
                            <div>
                              <h4 className="font-bold mb-1">Primary Regulatory Authority:</h4>
                              <p>Privacy Commissioner for Personal Data, Hong Kong</p>
                              <p>Address: 12/F, Sunlight Tower, 248 Queen's Road East, Wan Chai, Hong Kong</p>
                              <p>Telephone: +852 2827 2827</p>
                              <p>Fax: +852 2877 7026</p>
                              <p>Email: communications@pcpd.org.hk</p>
                              <p>Website: www.pcpd.org.hk</p>
                            </div>
                          </div>
                          <p>You may file a complaint with the regulatory authority at any time, regardless of whether you have first contacted us directly about your concerns.</p>
                          <p>Additional Regulatory Authorities - Depending on your location and the nature of your inquiry, you may also contact relevant data protection authorities in other jurisdictions where the Company operates:</p>
                          <ul className="list-disc pl-6 space-y-2">
                            <li>Malaysia: Personal Data Protection Department, Ministry of Digital, Malaysia</li>
                            <li>United States: Federal Trade Commission or relevant state attorneys general</li>
                            <li>Philippines: National Privacy Commission of the Philippines</li>
                            <li>European Union: Relevant Data Protection Authorities in EU member states, including the Dutch Data Protection Authority (Autoriteit Persoyensgegevens) for GDPR-related matters</li>
                            <li>Other Jurisdictions: Contact details for relevant authorities available upon request</li>
                          </ul>
                          <h3 className="text-xl font-bold mt-4">16.6 Contact Information Updates</h3>
                          <p>We may update our contact information from time to time and will publish any changes on our website and through appropriate communication channels.</p>
                          <p>Current contact information is always available on our website.</p>
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
