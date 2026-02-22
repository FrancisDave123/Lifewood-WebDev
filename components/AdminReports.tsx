import React, { useState } from 'react';
import {
  BarChart3,
  BookOpen,
  ClipboardList,
  Download,
  FileSpreadsheet,
  FileText,
  LayoutDashboard,
  LineChart,
  LogOut,
  Menu,
  NotebookPen,
  UserCircle2,
  Users
} from 'lucide-react';
import { LOGO_URL } from '../constants';
import { AdminNotificationBell } from './AdminNotificationBell';

interface AdminReportsProps {
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
      | 'admin-manage-interns'
      | 'admin-manage-applicants'
      | 'admin-manage-employees'
  ) => void;
}

export const AdminReports: React.FC<AdminReportsProps> = ({ navigateTo }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <section className="min-h-screen bg-lifewood-seaSalt lg:h-screen lg:overflow-hidden">
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
            <AdminNotificationBell />
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
              onClick={() => {
                setIsSidebarOpen(false);
                navigateTo?.('admin-evaluation');
              }}
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-white/70 transition hover:bg-white/10 hover:text-white"
            >
              <NotebookPen className="h-4 w-4" />
              Evaluation
            </button>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="flex items-center gap-3 rounded-xl bg-lifewood-green px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-lifewood-green/30"
            >
              <BookOpen className="h-4 w-4" />
              Reports
            </button>
            <button
              onClick={() => {
                setIsSidebarOpen(false);
                navigateTo?.('admin-manage-interns');
              }}
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-white/70 transition hover:bg-white/10 hover:text-white"
            >
              <Users className="h-4 w-4" />
              Manage Interns
            </button>
            <button
              onClick={() => {
                setIsSidebarOpen(false);
                navigateTo?.('admin-manage-applicants');
              }}
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-white/70 transition hover:bg-white/10 hover:text-white"
            >
              <ClipboardList className="h-4 w-4" />
              Manage Applicants
            </button>
            <button
              onClick={() => {
                setIsSidebarOpen(false);
                navigateTo?.('admin-manage-employees');
              }}
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-white/70 transition hover:bg-white/10 hover:text-white"
            >
              <UserCircle2 className="h-4 w-4" />
              Manage Employees
            </button>
          </div>

          <div className="flex gap-2 px-4 pb-4 lg:hidden">
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
              <button
                onClick={() => navigateTo?.('signin')}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm text-white/70 transition hover:bg-white/10 hover:text-white"
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

        <main className="flex-1 bg-gradient-to-b from-white to-lifewood-seaSalt/70 p-4 md:p-6 animate-pop-out opacity-0 lg:h-screen lg:overflow-y-auto">
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
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-lifewood-green">Reports</p>
              <h1 className="mt-1 text-2xl font-black text-lifewood-serpent md:text-3xl">Generate Operations Reports</h1>
              <p className="mt-2 text-sm text-lifewood-serpent/65">
                Generate exports for production planning, project outputs, workforce attendance, and evaluation summaries.
              </p>

              <div className="mt-5 grid gap-4 md:grid-cols-3">
                <button className="rounded-2xl border border-lifewood-serpent/10 bg-lifewood-seaSalt p-4 text-left transition hover:border-lifewood-green/40">
                  <div className="mb-3 inline-flex rounded-xl bg-lifewood-green/10 p-2 text-lifewood-green">
                    <FileSpreadsheet className="h-5 w-5" />
                  </div>
                  <p className="font-bold text-lifewood-serpent">Daily Output Export (Excel)</p>
                  <p className="mt-1 text-xs text-lifewood-serpent/60">Raw daily project outputs for manual production planning</p>
                  <span className="mt-3 inline-flex items-center gap-2 text-xs font-semibold text-lifewood-green">
                    <Download className="h-3.5 w-3.5" />
                    Generate daily_output.xlsx
                  </span>
                </button>

                <button className="rounded-2xl border border-lifewood-serpent/10 bg-lifewood-seaSalt p-4 text-left transition hover:border-lifewood-green/40">
                  <div className="mb-3 inline-flex rounded-xl bg-lifewood-yellow/20 p-2 text-lifewood-serpent">
                    <BarChart3 className="h-5 w-5" />
                  </div>
                  <p className="font-bold text-lifewood-serpent">Project Output Report (PDF)</p>
                  <p className="mt-1 text-xs text-lifewood-serpent/60">Per-project throughput, quality, SLA, and blockers</p>
                  <span className="mt-3 inline-flex items-center gap-2 text-xs font-semibold text-lifewood-green">
                    <Download className="h-3.5 w-3.5" />
                    Generate output_report.pdf
                  </span>
                </button>

                <button className="rounded-2xl border border-lifewood-serpent/10 bg-lifewood-seaSalt p-4 text-left transition hover:border-lifewood-green/40">
                  <div className="mb-3 inline-flex rounded-xl bg-lifewood-saffron/20 p-2 text-lifewood-serpent">
                    <FileText className="h-5 w-5" />
                  </div>
                  <p className="font-bold text-lifewood-serpent">Evaluation Memo (Word)</p>
                  <p className="mt-1 text-xs text-lifewood-serpent/60">Cycle notes, top performers, and coaching actions</p>
                  <span className="mt-3 inline-flex items-center gap-2 text-xs font-semibold text-lifewood-green">
                    <Download className="h-3.5 w-3.5" />
                    Generate evaluation_memo.docx
                  </span>
                </button>
              </div>
            </div>

            <div className="rounded-3xl border border-lifewood-serpent/10 bg-white p-5">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h3 className="text-lg font-bold text-lifewood-serpent">Generated Report Preview</h3>
                  <p className="text-sm text-lifewood-serpent/60">
                    Preview of the PDF output report with KPI summary, project performance, and action notes.
                  </p>
                </div>
                <span className="inline-flex w-fit rounded-full bg-lifewood-green/10 px-3 py-1 text-xs font-semibold text-lifewood-green">
                  Report Date: 2026-02-22
                </span>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-2xl bg-lifewood-seaSalt p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-lifewood-serpent/55">Total Planned</p>
                  <p className="mt-2 text-2xl font-black text-lifewood-serpent">1,020</p>
                </div>
                <div className="rounded-2xl bg-lifewood-seaSalt p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-lifewood-serpent/55">Total Actual</p>
                  <p className="mt-2 text-2xl font-black text-lifewood-serpent">996</p>
                </div>
                <div className="rounded-2xl bg-lifewood-seaSalt p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-lifewood-serpent/55">Avg Quality</p>
                  <p className="mt-2 text-2xl font-black text-lifewood-green">97.1%</p>
                </div>
                <div className="rounded-2xl bg-lifewood-seaSalt p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-lifewood-serpent/55">SLA Compliance</p>
                  <p className="mt-2 text-2xl font-black text-lifewood-serpent">94%</p>
                </div>
              </div>

              <div className="mt-5 overflow-x-auto rounded-2xl border border-lifewood-serpent/10">
                <table className="w-full min-w-[760px] text-left">
                  <thead className="bg-lifewood-seaSalt/60">
                    <tr className="text-xs uppercase tracking-[0.14em] text-lifewood-serpent/55">
                      <th className="px-4 py-3">Date</th>
                      <th className="px-4 py-3">Project</th>
                      <th className="px-4 py-3">Planned</th>
                      <th className="px-4 py-3">Actual</th>
                      <th className="px-4 py-3">Variance</th>
                      <th className="px-4 py-3">Quality</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Action</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    <tr className="border-t border-lifewood-serpent/10">
                      <td className="px-4 py-3 text-lifewood-serpent">2026-02-22</td>
                      <td className="px-4 py-3 font-semibold text-lifewood-serpent">NLP Annotation</td>
                      <td className="px-4 py-3 text-lifewood-serpent">520</td>
                      <td className="px-4 py-3 text-lifewood-serpent">498</td>
                      <td className="px-4 py-3 text-lifewood-serpent">-22</td>
                      <td className="px-4 py-3 text-lifewood-green">97.2%</td>
                      <td className="px-4 py-3 text-lifewood-serpent">Near target</td>
                      <td className="px-4 py-3 text-lifewood-serpent/70">Increase staffing by 1 shift</td>
                    </tr>
                    <tr className="border-t border-lifewood-serpent/10">
                      <td className="px-4 py-3 text-lifewood-serpent">2026-02-22</td>
                      <td className="px-4 py-3 font-semibold text-lifewood-serpent">Image QA</td>
                      <td className="px-4 py-3 text-lifewood-serpent">310</td>
                      <td className="px-4 py-3 text-lifewood-serpent">322</td>
                      <td className="px-4 py-3 text-lifewood-green">+12</td>
                      <td className="px-4 py-3 text-lifewood-green">98.4%</td>
                      <td className="px-4 py-3 text-lifewood-serpent">Above target</td>
                      <td className="px-4 py-3 text-lifewood-serpent/70">Replicate checklist in other streams</td>
                    </tr>
                    <tr className="border-t border-lifewood-serpent/10">
                      <td className="px-4 py-3 text-lifewood-serpent">2026-02-22</td>
                      <td className="px-4 py-3 font-semibold text-lifewood-serpent">Speech Tagging</td>
                      <td className="px-4 py-3 text-lifewood-serpent">190</td>
                      <td className="px-4 py-3 text-lifewood-serpent">176</td>
                      <td className="px-4 py-3 text-lifewood-serpent">-14</td>
                      <td className="px-4 py-3 text-lifewood-green">95.8%</td>
                      <td className="px-4 py-3 text-lifewood-serpent">Needs support</td>
                      <td className="px-4 py-3 text-lifewood-serpent/70">Schedule calibration with QA lead</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="mt-4 rounded-2xl bg-lifewood-seaSalt p-4">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-lifewood-serpent/55">Summary Notes</p>
                <p className="mt-2 text-sm text-lifewood-serpent/75">
                  Overall output is at 97.6% of plan with strong quality performance. Priority follow-up is Speech Tagging backlog reduction and next-day staffing rebalance for NLP Annotation.
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </section>
  );
};

export default AdminReports;
