import React, { useMemo, useState } from 'react';
import {
  BookOpen,
  Calendar,
  ClipboardList,
  ChevronDown,
  LayoutDashboard,
  LineChart,
  LogOut,
  Menu,
  NotebookPen,
  PieChart,
  TrendingUp,
  UserCircle2,
  Users
} from 'lucide-react';
import { LOGO_URL } from '../constants';
import { AdminNotificationBell } from './AdminNotificationBell';
import { AdminProfileModal } from './AdminProfileModal';
import { useAdminProfile } from './adminProfile';

interface AdminAnalyticsProps {
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

const monthlyOutput = [52, 58, 61, 67, 73, 78, 84];
const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];

export const AdminAnalytics: React.FC<AdminAnalyticsProps> = ({ navigateTo }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { profile, setProfile, adminGmail } = useAdminProfile();

  const chartPath = useMemo(() => {
    const max = Math.max(...monthlyOutput);
    const min = Math.min(...monthlyOutput);
    const range = Math.max(max - min, 1);
    return monthlyOutput
      .map((value, i) => {
        const x = (i / (monthlyOutput.length - 1)) * 100;
        const y = 100 - ((value - min) / range) * 80 - 10;
        return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
      })
      .join(' ');
  }, []);

  const handleEditProfile = () => {
    setIsSidebarOpen(false);
    setIsProfileOpen(true);
  };

  return (
    <section className="min-h-screen bg-transparent lg:h-screen lg:overflow-hidden">
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

          <div className="px-4 pt-4">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="flex items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  {profile.avatarDataUrl ? (
                    <img
                      src={profile.avatarDataUrl}
                      alt="Admin avatar"
                      className="h-12 w-12 rounded-full border border-white/20 object-cover"
                    />
                  ) : (
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white">
                      <UserCircle2 className="h-7 w-7" />
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-white">
                      {profile.firstName} {profile.lastName}
                    </p>
                    <p className="truncate text-xs text-white/65">{profile.role || 'Internal Access'}</p>
                  </div>
                </div>
                <button
                  onClick={handleEditProfile}
                  className="rounded-xl border border-white/20 bg-white/5 px-3 py-2 text-xs font-semibold text-white transition hover:bg-white/10"
                >
                  Edit
                </button>
              </div>
            </div>
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
              onClick={() => setIsSidebarOpen(false)}
              className="flex items-center gap-3 rounded-xl bg-lifewood-green px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-lifewood-green/30"
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
              onClick={() => {
                setIsSidebarOpen(false);
                navigateTo?.('admin-reports');
              }}
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-white/70 transition hover:bg-white/10 hover:text-white"
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

        <main className="relative flex-1 overflow-hidden p-4 md:p-6 animate-pop-out opacity-0 lg:h-screen lg:overflow-y-auto">
          <div className="relative z-10 mx-auto max-w-6xl space-y-5">
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
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-lifewood-green">Analytics</p>
                  <h1 className="text-2xl font-black text-lifewood-serpent md:text-3xl">Workforce Performance</h1>
                </div>
                <button className="inline-flex items-center gap-2 rounded-xl border border-lifewood-serpent/10 bg-lifewood-seaSalt px-3 py-2 text-xs font-semibold text-lifewood-serpent">
                  Last 30 Days
                  <ChevronDown className="h-4 w-4" />
                </button>
              </div>

              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-2xl border border-lifewood-serpent/10 bg-lifewood-seaSalt p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.15em] text-lifewood-serpent/60">Total Interns</p>
                  <p className="mt-2 text-3xl font-black text-lifewood-serpent">31</p>
                  <p className="text-xs text-lifewood-serpent/60">Active internship cohort</p>
                </div>
                <div className="rounded-2xl border border-lifewood-serpent/10 bg-lifewood-seaSalt p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.15em] text-lifewood-serpent/60">Total Employees</p>
                  <p className="mt-2 text-3xl font-black text-lifewood-serpent">20</p>
                  <p className="text-xs text-lifewood-serpent/60">Internal employees on roster</p>
                </div>
                <div className="rounded-2xl border border-lifewood-serpent/10 bg-lifewood-seaSalt p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.15em] text-lifewood-serpent/60">On Leave</p>
                  <p className="mt-2 text-3xl font-black text-lifewood-serpent">1</p>
                  <p className="text-xs text-lifewood-serpent/60">Planned and approved leaves</p>
                </div>
                <div className="rounded-2xl border border-lifewood-serpent/10 bg-lifewood-serpent p-4 text-white">
                  <p className="text-xs font-semibold uppercase tracking-[0.15em] text-white/65">Attendance Rate</p>
                  <p className="mt-2 text-3xl font-black text-lifewood-yellow">95%</p>
                  <p className="text-xs text-white/70">Updated every 30 minutes</p>
                </div>
              </div>
            </div>

            <div className="grid gap-4 xl:grid-cols-[1.5fr_1fr]">
              <div className="rounded-3xl border border-lifewood-serpent/10 bg-white p-5">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-lg font-bold text-lifewood-serpent">Monthly Output Trend</h3>
                  <TrendingUp className="h-5 w-5 text-lifewood-green" />
                </div>
                <div className="rounded-2xl bg-lifewood-seaSalt p-4">
                  <svg viewBox="0 0 100 100" className="h-48 w-full">
                    <path d="M 0 90 L 100 90" stroke="rgba(19,48,32,0.15)" strokeWidth="0.8" />
                    <path d="M 0 60 L 100 60" stroke="rgba(19,48,32,0.12)" strokeWidth="0.8" />
                    <path d="M 0 30 L 100 30" stroke="rgba(19,48,32,0.09)" strokeWidth="0.8" />
                    <path d={chartPath} fill="none" stroke="#046241" strokeWidth="2.5" strokeLinecap="round" />
                    {monthlyOutput.map((value, i) => {
                      const max = Math.max(...monthlyOutput);
                      const min = Math.min(...monthlyOutput);
                      const range = Math.max(max - min, 1);
                      const x = (i / (monthlyOutput.length - 1)) * 100;
                      const y = 100 - ((value - min) / range) * 80 - 10;
                      return <circle key={value + i} cx={x} cy={y} r="1.8" fill="#e5b53a" />;
                    })}
                  </svg>
                  <div className="mt-2 grid grid-cols-7 text-center text-[11px] font-semibold text-lifewood-serpent/55">
                    {monthLabels.map((label) => (
                      <span key={label}>{label}</span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-lifewood-serpent/10 bg-white p-5">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-lg font-bold text-lifewood-serpent">Attendance Split</h3>
                  <PieChart className="h-5 w-5 text-lifewood-green" />
                </div>
                <div className="space-y-3">
                  <div className="rounded-xl bg-lifewood-seaSalt p-3">
                    <div className="mb-2 flex items-center justify-between text-sm font-semibold text-lifewood-serpent">
                      <span className="inline-flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-lifewood-green"></span> Present</span>
                      <span>19</span>
                    </div>
                    <div className="h-2 rounded-full bg-lifewood-serpent/10">
                      <div className="h-2 w-[95%] rounded-full bg-lifewood-green"></div>
                    </div>
                  </div>
                  <div className="rounded-xl bg-lifewood-seaSalt p-3">
                    <div className="mb-2 flex items-center justify-between text-sm font-semibold text-lifewood-serpent">
                      <span className="inline-flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-lifewood-yellow"></span> On Leave</span>
                      <span>1</span>
                    </div>
                    <div className="h-2 rounded-full bg-lifewood-serpent/10">
                      <div className="h-2 w-[5%] rounded-full bg-lifewood-yellow"></div>
                    </div>
                  </div>
                  <div className="rounded-xl bg-lifewood-seaSalt p-3">
                    <div className="mb-2 flex items-center justify-between text-sm font-semibold text-lifewood-serpent">
                      <span className="inline-flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-lifewood-saffron"></span> Absent</span>
                      <span>0</span>
                    </div>
                    <div className="h-2 rounded-full bg-lifewood-serpent/10">
                      <div className="h-2 w-[0%] rounded-full bg-lifewood-saffron"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-4 xl:grid-cols-[1.2fr_1fr]">
              <div className="rounded-3xl border border-lifewood-serpent/10 bg-white p-5">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-lg font-bold text-lifewood-serpent">Team Productivity</h3>
                  <Users className="h-5 w-5 text-lifewood-green" />
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[520px] text-left">
                    <thead>
                      <tr className="text-xs uppercase tracking-[0.14em] text-lifewood-serpent/55">
                        <th className="pb-3">Team</th>
                        <th className="pb-3">Tasks Closed</th>
                        <th className="pb-3">Quality</th>
                        <th className="pb-3">SLA</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm">
                      <tr className="border-t border-lifewood-serpent/10">
                        <td className="py-3 font-semibold text-lifewood-serpent">Data Labeling</td>
                        <td className="py-3 text-lifewood-serpent">486</td>
                        <td className="py-3 text-lifewood-green">97.2%</td>
                        <td className="py-3 text-lifewood-serpent">99.1%</td>
                      </tr>
                      <tr className="border-t border-lifewood-serpent/10">
                        <td className="py-3 font-semibold text-lifewood-serpent">QA Review</td>
                        <td className="py-3 text-lifewood-serpent">231</td>
                        <td className="py-3 text-lifewood-green">98.0%</td>
                        <td className="py-3 text-lifewood-serpent">98.4%</td>
                      </tr>
                      <tr className="border-t border-lifewood-serpent/10">
                        <td className="py-3 font-semibold text-lifewood-serpent">Linguistics</td>
                        <td className="py-3 text-lifewood-serpent">175</td>
                        <td className="py-3 text-lifewood-green">95.5%</td>
                        <td className="py-3 text-lifewood-serpent">96.9%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="rounded-3xl border border-lifewood-serpent/10 bg-white p-5">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-lg font-bold text-lifewood-serpent">Operational Notes</h3>
                  <Calendar className="h-5 w-5 text-lifewood-green" />
                </div>
                <div className="space-y-2 text-sm">
                  <div className="rounded-xl bg-lifewood-seaSalt p-3 text-lifewood-serpent">Peak productivity observed from 9:00 AM to 12:00 PM.</div>
                  <div className="rounded-xl bg-lifewood-seaSalt p-3 text-lifewood-serpent">Attendance dipped 3% on Wednesday due to weather disruptions.</div>
                  <div className="rounded-xl bg-lifewood-seaSalt p-3 text-lifewood-serpent">Quality improvements linked to revised QA checklist rollout.</div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      <AdminProfileModal
        open={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        profile={profile}
        adminGmail={adminGmail}
        onSave={setProfile}
      />
    </section>
  );
};

export default AdminAnalytics;


