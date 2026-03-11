import React from 'react';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import type { PageRoute } from '../routes/routeTypes';

interface AdminAccessDeniedProps {
  navigateTo?: (page: PageRoute) => void;
}

export const AdminAccessDenied: React.FC<AdminAccessDeniedProps> = ({ navigateTo }) => (
  <div className="relative min-h-screen w-full overflow-hidden bg-lifewood-seaSalt">
    <div className="absolute inset-0 bg-gradient-mesh opacity-60"></div>
    <div className="absolute -top-20 -right-20 h-72 w-72 rounded-full bg-lifewood-green/10 blur-[90px]"></div>
    <div className="absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-lifewood-saffron/20 blur-[110px]"></div>

    <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-3xl rounded-[2rem] border border-lifewood-serpent/10 bg-white/80 p-8 text-center shadow-[0_30px_80px_rgba(19,48,32,0.18)] backdrop-blur-lg md:p-12">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-lifewood-serpent/10 text-lifewood-serpent">
          <ShieldAlert className="h-8 w-8" />
        </div>
        <p className="mt-5 text-xs font-bold uppercase tracking-[0.3em] text-lifewood-green">Error 403</p>
        <h1 className="mt-3 text-3xl font-black text-lifewood-serpent md:text-4xl">Admin Access Required</h1>
        <p className="mt-3 text-sm text-lifewood-serpent/70 md:text-base">
          Your account does not have permission to access the admin console. If you believe this is a mistake, contact an
          administrator or sign in with an admin account.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => navigateTo?.('signin')}
            className="rounded-full bg-lifewood-green px-6 py-3 text-sm font-bold text-white transition hover:bg-lifewood-green/90"
          >
            Go to Sign In
          </button>
          <button
            onClick={() => navigateTo?.('home')}
            className="inline-flex items-center gap-2 rounded-full border border-lifewood-serpent/20 px-6 py-3 text-sm font-semibold text-lifewood-serpent transition hover:bg-lifewood-serpent/5"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </button>
        </div>
      </div>
    </div>
  </div>
);

export default AdminAccessDenied;
