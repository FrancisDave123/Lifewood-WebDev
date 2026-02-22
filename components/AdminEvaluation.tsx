import React, { useState } from 'react';
import {
  Bell,
  BookOpen,
  Calendar,
  CheckCircle2,
  ChevronDown,
  LayoutDashboard,
  LineChart,
  LogOut,
  Menu,
  NotebookPen,
  Settings,
  Target,
  TrendingUp,
  Users
} from 'lucide-react';
import { LOGO_URL } from '../constants';

interface AdminEvaluationProps {
  navigateTo?: (
    page:
      | 'home'
      | 'services'
      | 'projects'
      | 'contact'
      | 'about'
      | 'offices'
      | 'impact'
      | 'careers'
      | 'type-a'
      | 'type-b'
      | 'type-c'
      | 'type-d'
      | 'internal-news'
      | 'privacy'
      | 'cookie-policy'
      | 'terms'
      | 'signin'
      | 'admin-dashboard'
      | 'admin-analytics'
      | 'admin-evaluation'
      | 'admin-reports'
  ) => void;
}

export const AdminEvaluation: React.FC<AdminEvaluationProps> = ({ navigateTo }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <section className="min-h-screen bg-lifewood-seaSalt animate-pop-out opacity-0 lg:h-screen lg:overflow-hidden">
      <div className="flex min-h-screen flex-col lg:h-screen lg:flex-row">
        <aside
          className={`fixed inset-y-0 left-0 z-[130] w-[290px] border-r border-lifewood-serpent/10 bg-lifewood-serpent text-white transition-transform duration-300 lg:sticky lg:top-0 lg:z-auto lg:h-screen lg:translate-x-0 lg:overflow-y-auto ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
            <button
              onClick={() => navigateTo?.('home')}
              className="group flex items-center gap-3 rounded-xl px-2 py-1 transition hover:bg-white/5"
            >
              <img src={LOGO_URL} alt="Lifewood" className="h-5 w-auto max-w-[120px] object-contain" />
              <span className="rounded-md bg-white/10 px-2 py-0.5 text-[10px] font-bold tracking-[0.2em] text-lifewood-yellow">
                ADMIN
              </span>
            </button>
            <button className="rounded-lg p-2 text-white/70 transition hover:bg-white/10 hover:text-white">
              <Bell className="h-4 w-4" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3 p-4 sm:grid-cols-4 lg:grid-cols-1 lg:gap-2">
            <button
              onClick={() => {
                setIsSidebarOpen(false);
                navigateTo?.('admin-dashboard');
              }}
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-white/70 transition hover:bg-white/10 hover:text-white"
            >
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </button>
            <button
              onClick={() => {
                setIsSidebarOpen(false);
                navigateTo?.('admin-analytics');
              }}
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-white/70 transition hover:bg-white/10 hover:text-white"
            >
              <LineChart className="h-4 w-4" />
              Analytics
            </button>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="flex items-center gap-3 rounded-xl bg-lifewood-green px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-lifewood-green/30"
            >
              <NotebookPen className="h-4 w-4" />
              Evaluation
            </button>
            <button
              onClick={() => {
                setIsSidebarOpen(false);
                navigateTo?.('admin-reports');
              }}
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-white/70 transition hover:bg-white/10 hover:text-white"
            >
              <BookOpen className="h-4 w-4" />
              Reports
            </button>
          </div>

          <div className="flex gap-2 px-4 pb-4 lg:hidden">
            <button className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-xs font-semibold text-white/80 transition hover:bg-white/10">
              <Settings className="h-4 w-4" />
              Settings
            </button>
            <button
              onClick={() => navigateTo?.('signin')}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-xs font-semibold text-white/80 transition hover:bg-white/10"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </div>

          <div className="hidden px-4 pb-4 lg:block">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/45">Settings</p>
              <button className="mt-3 flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm text-white/70 transition hover:bg-white/10 hover:text-white">
                <Settings className="h-4 w-4" />
                Preferences
              </button>
              <button
                onClick={() => navigateTo?.('signin')}
                className="mt-2 flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm text-white/70 transition hover:bg-white/10 hover:text-white"
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </button>
            </div>
          </div>
        </aside>

        {isSidebarOpen && (
          <button
            type="button"
            aria-label="Close sidebar"
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 z-[120] bg-black/45 backdrop-blur-[1px] lg:hidden"
          />
        )}

        <main className="flex-1 bg-gradient-to-b from-white to-lifewood-seaSalt/70 p-4 md:p-6 lg:h-screen lg:overflow-y-auto">
          <div className="mx-auto max-w-6xl space-y-5">
            <div className="flex items-center justify-between rounded-2xl border border-lifewood-serpent/10 bg-white p-3 lg:hidden">
              <button
                type="button"
                onClick={() => setIsSidebarOpen(true)}
                className="inline-flex items-center gap-2 rounded-xl bg-lifewood-serpent px-3 py-2 text-xs font-bold uppercase tracking-[0.14em] text-white"
              >
                <Menu className="h-4 w-4" />
                Menu
              </button>
              <button
                type="button"
                onClick={() => navigateTo?.('signin')}
                className="rounded-xl border border-lifewood-serpent/15 px-3 py-2 text-xs font-semibold text-lifewood-serpent"
              >
                Sign out
              </button>
            </div>

            <div className="rounded-3xl border border-lifewood-serpent/10 bg-white p-5 shadow-[0_16px_50px_rgba(19,48,32,0.08)]">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-lifewood-green">Evaluation</p>
                  <h1 className="text-2xl font-black text-lifewood-serpent md:text-3xl">Performance Assessment</h1>
                </div>
                <button className="inline-flex items-center gap-2 rounded-xl border border-lifewood-serpent/10 bg-lifewood-seaSalt px-3 py-2 text-xs font-semibold text-lifewood-serpent">
                  Current Cycle
                  <ChevronDown className="h-4 w-4" />
                </button>
              </div>

              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-2xl border border-lifewood-serpent/10 bg-lifewood-seaSalt p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.15em] text-lifewood-serpent/60">Total Interns</p>
                  <p className="mt-2 text-3xl font-black text-lifewood-serpent">31</p>
                  <p className="text-xs text-lifewood-serpent/60">Matches dashboard baseline</p>
                </div>
                <div className="rounded-2xl border border-lifewood-serpent/10 bg-lifewood-seaSalt p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.15em] text-lifewood-serpent/60">Total Employees</p>
                  <p className="mt-2 text-3xl font-black text-lifewood-serpent">20</p>
                  <p className="text-xs text-lifewood-serpent/60">Internal employee count</p>
                </div>
                <div className="rounded-2xl border border-lifewood-serpent/10 bg-lifewood-seaSalt p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.15em] text-lifewood-serpent/60">Attendance Rate</p>
                  <p className="mt-2 text-3xl font-black text-lifewood-serpent">95%</p>
                  <p className="text-xs text-lifewood-serpent/60">Shared with analytics</p>
                </div>
                <div className="rounded-2xl border border-lifewood-serpent/10 bg-lifewood-serpent p-4 text-white">
                  <p className="text-xs font-semibold uppercase tracking-[0.15em] text-white/65">Evaluations Completed</p>
                  <p className="mt-2 text-3xl font-black text-lifewood-yellow">29 / 31</p>
                  <p className="text-xs text-white/70">93.5% cycle completion</p>
                </div>
              </div>
            </div>

            <div className="grid gap-4 xl:grid-cols-[1.35fr_1fr]">
              <div className="rounded-3xl border border-lifewood-serpent/10 bg-white p-5">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-lg font-bold text-lifewood-serpent">Evaluation Queue</h3>
                  <Calendar className="h-5 w-5 text-lifewood-green" />
                </div>
                <div className="space-y-2 text-sm">
                  <div className="rounded-xl border border-lifewood-serpent/10 bg-lifewood-seaSalt p-3">
                    <p className="font-semibold text-lifewood-serpent">John Dominic Mumar Jr. - NLP Annotation</p>
                    <p className="text-xs text-lifewood-serpent/60">Pending final reviewer calibration</p>
                  </div>
                  <div className="rounded-xl border border-lifewood-serpent/10 bg-lifewood-seaSalt p-3">
                    <p className="font-semibold text-lifewood-serpent">Gerard Luis Soriano - QA Validation</p>
                    <p className="text-xs text-lifewood-serpent/60">Awaiting supervisor sign-off</p>
                  </div>
                  <div className="rounded-xl border border-lifewood-serpent/10 bg-lifewood-seaSalt p-3">
                    <p className="font-semibold text-lifewood-serpent">DJ Jholmer Damayo - Audio Tagging</p>
                    <p className="text-xs text-lifewood-serpent/60">Self-assessment submitted</p>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-lifewood-serpent/10 bg-white p-5">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-lg font-bold text-lifewood-serpent">Rubric Summary</h3>
                  <Target className="h-5 w-5 text-lifewood-green" />
                </div>
                <div className="space-y-3">
                  <div>
                    <div className="mb-1 flex items-center justify-between text-xs font-semibold text-lifewood-serpent/70">
                      <span>Quality Accuracy</span>
                      <span>96%</span>
                    </div>
                    <div className="h-2 rounded-full bg-lifewood-serpent/10">
                      <div className="h-2 w-[96%] rounded-full bg-lifewood-green"></div>
                    </div>
                  </div>
                  <div>
                    <div className="mb-1 flex items-center justify-between text-xs font-semibold text-lifewood-serpent/70">
                      <span>Productivity</span>
                      <span>92%</span>
                    </div>
                    <div className="h-2 rounded-full bg-lifewood-serpent/10">
                      <div className="h-2 w-[92%] rounded-full bg-lifewood-yellow"></div>
                    </div>
                  </div>
                  <div>
                    <div className="mb-1 flex items-center justify-between text-xs font-semibold text-lifewood-serpent/70">
                      <span>Compliance</span>
                      <span>98%</span>
                    </div>
                    <div className="h-2 rounded-full bg-lifewood-serpent/10">
                      <div className="h-2 w-[98%] rounded-full bg-lifewood-saffron"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-4 xl:grid-cols-[1.25fr_1fr]">
              <div className="rounded-3xl border border-lifewood-serpent/10 bg-white p-5">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-lg font-bold text-lifewood-serpent">Top Performers (This Cycle)</h3>
                  <TrendingUp className="h-5 w-5 text-lifewood-green" />
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[520px] text-left">
                    <thead>
                      <tr className="text-xs uppercase tracking-[0.14em] text-lifewood-serpent/55">
                        <th className="pb-3">Name</th>
                        <th className="pb-3">Team</th>
                        <th className="pb-3">Score</th>
                        <th className="pb-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm">
                      <tr className="border-t border-lifewood-serpent/10">
                        <td className="py-3 font-semibold text-lifewood-serpent">Francis Merc Mandado</td>
                        <td className="py-3 text-lifewood-serpent">Image QA</td>
                        <td className="py-3 text-lifewood-green">98.7</td>
                        <td className="py-3 text-lifewood-serpent">Promote Track</td>
                      </tr>
                      <tr className="border-t border-lifewood-serpent/10">
                        <td className="py-3 font-semibold text-lifewood-serpent">Justine Mhars Tacatani</td>
                        <td className="py-3 text-lifewood-serpent">Text Annotation</td>
                        <td className="py-3 text-lifewood-green">97.9</td>
                        <td className="py-3 text-lifewood-serpent">Promote Track</td>
                      </tr>
                      <tr className="border-t border-lifewood-serpent/10">
                        <td className="py-3 font-semibold text-lifewood-serpent">Darin Jan Antopina</td>
                        <td className="py-3 text-lifewood-serpent">Speech Tagging</td>
                        <td className="py-3 text-lifewood-green">96.8</td>
                        <td className="py-3 text-lifewood-serpent">Stable</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="rounded-3xl border border-lifewood-serpent/10 bg-white p-5">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-lg font-bold text-lifewood-serpent">Cycle Health</h3>
                  <Users className="h-5 w-5 text-lifewood-green" />
                </div>
                <div className="space-y-2 text-sm">
                  <div className="rounded-xl bg-lifewood-seaSalt p-3 text-lifewood-serpent">
                    2 interns pending final review before cycle close.
                  </div>
                  <div className="rounded-xl bg-lifewood-seaSalt p-3 text-lifewood-serpent">
                    5 interns flagged for additional coaching sessions.
                  </div>
                  <div className="rounded-xl bg-lifewood-seaSalt p-3 text-lifewood-serpent">
                    Reviewer consistency improved by 4.3% vs previous cycle.
                  </div>
                  <div className="rounded-xl border border-lifewood-green/20 bg-lifewood-green/5 p-3 text-lifewood-serpent">
                    <span className="inline-flex items-center gap-2 font-semibold">
                      <CheckCircle2 className="h-4 w-4 text-lifewood-green" />
                      Overall evaluation readiness: Good
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </section>
  );
};

export default AdminEvaluation;
