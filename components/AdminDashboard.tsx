import React, { useEffect, useState } from 'react';
import {
  BookOpen,
  ClipboardList,
  LayoutDashboard,
  LogOut,
  Menu,
  UserCircle2
} from 'lucide-react';
import { LOGO_URL } from '../constants';
import { applicantService } from '../services/applicantService';
import { AdminNotificationBell } from './AdminNotificationBell';
import { AdminProfileModal } from './AdminProfileModal';
import { useAdminProfile } from './adminProfile';
import type { PageRoute } from '../routes/routeTypes';

interface AdminDashboardProps {
  navigateTo?: (page: PageRoute) => void;
}

type ApplicantSummary = {
  pending: number;
  hired: number;
  rejected: number;
};

type ApplicantRecord = {
  id: string;
  firstName: string;
  lastName: string;
  positionApplied: string;
  statusName?: string | null;
  designationName?: string | null;
  createdAt: string;
};

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ navigateTo }) => {
  const ADMIN_REDIRECT_NOTICE_KEY = 'lifewood_admin_block_notice';
  const { profile, setProfile, adminGmail } = useAdminProfile();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [redirectNotice, setRedirectNotice] = useState('');
  const [summary, setSummary] = useState<ApplicantSummary>({
    pending: 0,
    hired: 0,
    rejected: 0
  });
  const [isSummaryLoading, setIsSummaryLoading] = useState(true);
  const [recentApplicants, setRecentApplicants] = useState<ApplicantRecord[]>([]);
  const [isApplicantsLoading, setIsApplicantsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  const formatPersonName = (value?: string | null) => {
    if (!value) return '';
    return value
      .trim()
      .toLowerCase()
      .replace(/(^|[\\s'-])([a-z])/g, (_match, boundary: string, letter: string) => boundary + letter.toUpperCase());
  };

  const formatTitleCase = (value?: string | null) => {
    if (!value) return '';
    return value
      .trim()
      .toLowerCase()
      .replace(/(^|[\\s'-])([a-z])/g, (_match, boundary: string, letter: string) => boundary + letter.toUpperCase());
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const notice = sessionStorage.getItem(ADMIN_REDIRECT_NOTICE_KEY);
      if (notice) {
        setRedirectNotice(notice);
        sessionStorage.removeItem(ADMIN_REDIRECT_NOTICE_KEY);
      }
    }
  }, []);

  const formatStatusLabel = (statusName?: string | null) => {
    if (!statusName) return 'Unassigned';
    return statusName
      .replace(/_/g, ' ')
      .replace(/\bai\b/gi, 'AI')
      .replace(/\b\w/g, (match) => match.toUpperCase());
  };

  const getStatusColorClasses = (statusName?: string | null) => {
    const status = statusName?.toLowerCase();
    if (status === 'hired') {
      return 'bg-[#046241] text-white';
    } else if (status === 'rejected') {
      return 'bg-red-500 text-white';
    } else {
      return 'bg-[#FFC370] text-lifewood-serpent';
    }
  };

  const formatAppliedDate = (isoDate: string) => {
    if (!isoDate) return '?';
    const parsed = new Date(isoDate);
    if (Number.isNaN(parsed.getTime())) return '?';
    return parsed.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const loadSummary = async () => {
    setIsSummaryLoading(true);
    try {
      const summary = await applicantService.getApplicantSummary();
      setSummary({
        pending: summary['pending'] || 0,
        hired: summary['hired'] || 0,
        rejected: summary['rejected'] || 0
      });
    } catch (error) {
      setSummary({ pending: 0, hired: 0, rejected: 0 });
      setLoadError(error instanceof Error ? error.message : 'Unable to load applicant summary.');
    } finally {
      setIsSummaryLoading(false);
    }
  };

  const loadRecentApplicants = async () => {
    setIsApplicantsLoading(true);
    try {
      const result = await applicantService.getApplicants(5, 0);
      const normalized = (result.applicants || []).map((record: any) => ({
        id: String(record.id ?? ''),
        firstName: formatPersonName(String(record.first_name ?? '')),
        lastName: formatPersonName(String(record.last_name ?? '')),
        positionApplied: String(record.position_applied ?? ''),
        statusName: record.applicant_statuses?.status_name ? String(record.applicant_statuses.status_name) : null,
        designationName: record.designations?.designation_name ? String(record.designations.designation_name) : null,
        createdAt: String(record.created_at ?? '')
      })) as ApplicantRecord[];
      setRecentApplicants(normalized);
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : 'Unable to load applicants.');
    } finally {
      setIsApplicantsLoading(false);
    }
  };

  useEffect(() => {
    void loadSummary();
    void loadRecentApplicants();
  }, []);

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
                  onClick={() => setIsProfileOpen(true)}
                  className="rounded-xl border border-white/20 bg-white/5 px-3 py-2 text-xs font-semibold text-white transition hover:bg-white/10"
                >
                  Edit
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 p-4 sm:grid-cols-4 lg:grid-cols-1 lg:gap-2">
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="flex items-center gap-3 rounded-xl bg-lifewood-green px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-lifewood-green/30"
            >
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </button>
            <button
              onClick={() => {
                setIsSidebarOpen(false);
                navigateTo?.('admin-manage-applicants');
              }}
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-white/70 transition hover:bg-white/10 hover:text-white"
            >
              <ClipboardList className="h-4 w-4" />
              Applicants
            </button>
            <button
              onClick={() => {
                setIsSidebarOpen(false);
                navigateTo?.('admin-manage-inquiries');
              }}
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-white/70 transition hover:bg-white/10 hover:text-white"
            >
              <ClipboardList className="h-4 w-4" />
              Inquiries
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
            {redirectNotice && (
              <div className="flex items-center justify-between gap-3 rounded-2xl border border-lifewood-saffron/30 bg-lifewood-saffron/15 px-4 py-3 text-sm text-lifewood-serpent">
                <p className="font-semibold">{redirectNotice}</p>
                <button
                  type="button"
                  onClick={() => setRedirectNotice('')}
                  className="rounded-lg border border-lifewood-serpent/15 px-2 py-1 text-xs font-semibold text-lifewood-serpent transition hover:bg-lifewood-seaSalt"
                >
                  Dismiss
                </button>
              </div>
            )}

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
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-lifewood-green">Dashboard</p>
                  <h1 className="mt-1 text-2xl font-black text-lifewood-serpent md:text-3xl">Applicants Overview</h1>
                  <p className="mt-2 text-sm text-lifewood-serpent/65">
                    Live counts based on the applicants database.
                  </p>
                </div>
                <button
                  onClick={() => navigateTo?.('admin-manage-applicants')}
                  className="inline-flex items-center gap-2 rounded-xl bg-lifewood-green px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-lifewood-green/90"
                >
                  View Applicants
                </button>
              </div>

              {loadError && (
                <p className="mt-3 text-xs font-semibold text-red-600">{loadError}</p>
              )}

              <div className="mt-5 grid gap-4 md:grid-cols-3">
                <div className="rounded-2xl border border-lifewood-serpent/10 bg-[#FFC370] p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.15em] text-lifewood-serpent/80">Pending</p>
                  <p className="mt-2 text-3xl font-black text-lifewood-serpent">
                    {isSummaryLoading ? '—' : summary.pending}
                  </p>
                </div>
                <div className="rounded-2xl border border-lifewood-serpent/10 bg-[#046241] p-4 text-white">
                  <p className="text-xs font-semibold uppercase tracking-[0.15em] text-white/80">Hired</p>
                  <p className="mt-2 text-3xl font-black text-lifewood-yellow">
                    {isSummaryLoading ? '—' : summary.hired}
                  </p>
                </div>
                <div className="rounded-2xl border border-lifewood-serpent/10 bg-red-500 p-4 text-white">
                  <p className="text-xs font-semibold uppercase tracking-[0.15em] text-white/80">Rejected</p>
                  <p className="mt-2 text-3xl font-black text-white">
                    {isSummaryLoading ? '—' : summary.rejected}
                  </p>
                </div>
              </div>
              {isSummaryLoading && (
                <div className="mt-4 flex items-center gap-3 text-sm font-semibold text-lifewood-serpent/70">
                  <span className="h-6 w-6 animate-spin rounded-full border-4 border-lifewood-serpent/20 border-t-lifewood-green" />
                  Loading summary...
                </div>
              )}
            </div>

            <div className="rounded-3xl border border-lifewood-serpent/10 bg-white p-5">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-lg font-bold text-lifewood-serpent">Recent Applicants</h3>
                <button
                  onClick={() => navigateTo?.('admin-manage-applicants')}
                  className="text-xs font-semibold text-lifewood-green hover:text-lifewood-green/80"
                >
                  View All
                </button>
              </div>
              {isApplicantsLoading && (
                <div className="flex items-center gap-3 text-sm font-semibold text-lifewood-serpent/70">
                  <span className="h-6 w-6 animate-spin rounded-full border-4 border-lifewood-serpent/20 border-t-lifewood-green" />
                  Loading applicants...
                </div>
              )}
              {!isApplicantsLoading && recentApplicants.length === 0 && (
                <p className="text-xs font-semibold text-lifewood-serpent/60">No applicants found.</p>
              )}
              <div className="space-y-3">
                {recentApplicants.map((applicant) => (
                  <div key={applicant.id} className="flex flex-col gap-2 rounded-2xl border border-lifewood-serpent/10 bg-lifewood-seaSalt/60 p-4 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="text-sm font-semibold text-lifewood-serpent">
                        {applicant.firstName} {applicant.lastName}
                      </p>
                      <p className="text-xs text-lifewood-serpent/60">
                        {applicant.positionApplied}
                        {applicant.designationName && ` · Applying as ${formatTitleCase(applicant.designationName)}`}
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-lifewood-serpent/60">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusColorClasses(applicant.statusName)} min-w-[80px] text-center`}>
                        {formatStatusLabel(applicant.statusName)}
                      </span>
                      <span>Applied {formatAppliedDate(applicant.createdAt)}</span>
                    </div>
                  </div>
                ))}
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

export default AdminDashboard;
