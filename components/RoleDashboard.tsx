import React from 'react';
import { ArrowLeft, Sparkles } from 'lucide-react';
import type { PageRoute } from '../routes/routeTypes';

interface RoleDashboardProps {
  roleLabel: string;
  navigateTo?: (page: PageRoute) => void;
}

export const RoleDashboard: React.FC<RoleDashboardProps> = ({ roleLabel, navigateTo }) => (
  <div className="relative min-h-screen w-full overflow-hidden bg-lifewood-seaSalt">
    <div className="absolute inset-0 bg-gradient-mesh opacity-60"></div>
    <div className="absolute -top-24 -right-24 h-80 w-80 rounded-full bg-lifewood-green/12 blur-[120px]"></div>
    <div className="absolute -bottom-28 -left-28 h-96 w-96 rounded-full bg-lifewood-saffron/20 blur-[140px]"></div>

    <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-4xl rounded-[2.5rem] border border-lifewood-serpent/10 bg-white/85 p-8 shadow-[0_30px_80px_rgba(19,48,32,0.18)] backdrop-blur-xl md:p-12">
        <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-lifewood-green">Portal Preview</p>
            <h1 className="mt-3 text-3xl font-black text-lifewood-serpent md:text-4xl">
              {roleLabel} Dashboard
            </h1>
            <p className="mt-3 max-w-xl text-sm text-lifewood-serpent/70 md:text-base">
              This role dashboard is under construction. You are authenticated and ready to go once the portal
              experience is built.
            </p>
          </div>

          <div className="flex flex-col items-start gap-4 rounded-2xl border border-lifewood-serpent/10 bg-lifewood-seaSalt/70 p-5">
            <div className="flex items-center gap-3 text-lifewood-serpent">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-lifewood-green/10 text-lifewood-green">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-lifewood-serpent/60">Status</p>
                <p className="text-sm font-bold text-lifewood-serpent">Coming Soon</p>
              </div>
            </div>
            <button
              onClick={() => navigateTo?.('home')}
              className="inline-flex items-center gap-2 rounded-full border border-lifewood-serpent/20 px-4 py-2 text-xs font-semibold text-lifewood-serpent transition hover:bg-lifewood-serpent/5"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default RoleDashboard;
