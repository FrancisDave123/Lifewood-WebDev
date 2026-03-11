import React from 'react';
import { Briefcase, GraduationCap } from 'lucide-react';
import type { PageRoute } from '../routes/routeTypes';

interface JoinUsAsProps {
  navigateTo?: (page: PageRoute) => void;
}

export const JoinUsAs: React.FC<JoinUsAsProps> = ({ navigateTo }) => (
  <section className="min-h-screen bg-lifewood-seaSalt dark:bg-[#020804] pt-28 pb-16 animate-pop-out opacity-0">
    <div className="container mx-auto px-6 max-w-5xl">
      <button
        type="button"
        onClick={() => navigateTo?.('careers')}
        className="mb-6 inline-flex items-center text-xs font-semibold text-lifewood-serpent/70 hover:text-lifewood-serpent transition"
      >
        â† Back to Careers
      </button>

      <div className="mb-8 space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-lifewood-serpent/60">
          Join Lifewood
        </p>
        <h1 className="text-3xl md:text-4xl font-heading font-black text-lifewood-serpent dark:text-white">
          Choose Your Application Path
        </h1>
        <p className="text-sm md:text-base text-lifewood-serpent/70 dark:text-white/70 max-w-2xl">
          Select the role you want to apply for. You can update details in the multi-step form afterward.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <button
          type="button"
          onClick={() => navigateTo?.('join-us-as-employee')}
          className="group rounded-3xl border border-lifewood-serpent/10 bg-white/80 p-6 text-left shadow-xl backdrop-blur-lg transition hover:-translate-y-1 hover:shadow-2xl"
        >
          <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-lifewood-green/15 text-lifewood-green">
            <Briefcase className="h-6 w-6" />
          </div>
          <h2 className="text-xl font-heading font-semibold text-lifewood-serpent">
            Apply as Employee
          </h2>
          <p className="mt-2 text-sm text-lifewood-serpent/70">
            Full application flow for experienced team members.
          </p>
        </button>

        <button
          type="button"
          onClick={() => navigateTo?.('join-us-as-intern')}
          className="group rounded-3xl border border-lifewood-serpent/10 bg-white/80 p-6 text-left shadow-xl backdrop-blur-lg transition hover:-translate-y-1 hover:shadow-2xl"
        >
          <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-lifewood-saffron/20 text-lifewood-serpent">
            <GraduationCap className="h-6 w-6" />
          </div>
          <h2 className="text-xl font-heading font-semibold text-lifewood-serpent">
            Apply as Intern
          </h2>
          <p className="mt-2 text-sm text-lifewood-serpent/70">
            Internship application flow with additional academic details.
          </p>
        </button>
      </div>
    </div>
  </section>
);

export default JoinUsAs;
