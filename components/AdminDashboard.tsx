import React, { useEffect, useState } from 'react';
import {
  BookOpen,
  ClipboardList,
  LayoutDashboard,
  Mail,
  Menu,
} from 'lucide-react';
import { applicantService } from '../services/applicantService';
import { messageService } from '../services/messageService';
import { AdminSidebar } from './AdminSidebar';
import { AdminProfileModal } from './AdminProfileModal';
import { useProfile } from './ProfileContext';
import { ROLE_OPTIONS } from './adminProfile';
import type { PageRoute } from '../routes/routeTypes';

interface AdminDashboardProps {
  navigateTo?: (page: PageRoute) => void;
}

type ApplicantSummary = {
  total: number;
  pending: number;
  hired: number;
  rejected: number;
  interns: number;
  employees: number;
  hiredInterns: number;
  hiredEmployees: number;
  pendingInterns: number;
  pendingEmployees: number;
  rejectedInterns: number;
  rejectedEmployees: number;
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

type BreakdownStat = {
  label: string;
  value: number;
  colorClassName: string;
};

type InquirySummary = {
  total: number;
  unread: number;
};

const EMPTY_SUMMARY: ApplicantSummary = {
  total: 0,
  pending: 0,
  hired: 0,
  rejected: 0,
  interns: 0,
  employees: 0,
  hiredInterns: 0,
  hiredEmployees: 0,
  pendingInterns: 0,
  pendingEmployees: 0,
  rejectedInterns: 0,
  rejectedEmployees: 0,
};

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ navigateTo }) => {
  const ADMIN_REDIRECT_NOTICE_KEY = 'lifewood_admin_block_notice';
  const { profile, adminGmail, saveProfile } = useProfile();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [redirectNotice, setRedirectNotice] = useState('');
  const [summary, setSummary] = useState<ApplicantSummary>(EMPTY_SUMMARY);
  const [isSummaryLoading, setIsSummaryLoading] = useState(true);
  const [inquirySummary, setInquirySummary] = useState<InquirySummary>({ total: 0, unread: 0 });
  const [isInquirySummaryLoading, setIsInquirySummaryLoading] = useState(true);
  const [recentApplicants, setRecentApplicants] = useState<ApplicantRecord[]>([]);
  const [isApplicantsLoading, setIsApplicantsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  const formatPersonName = (value?: string | null) => {
    if (!value) return '';
    return value
      .trim()
      .toLowerCase()
      .replace(/(^|[\s'-])([a-z])/g, (_match, boundary: string, letter: string) => boundary + letter.toUpperCase());
  };

  const formatTitleCase = (value?: string | null) => {
    if (!value) return '';
    return value
      .trim()
      .toLowerCase()
      .replace(/(^|[\s'-])([a-z])/g, (_match, boundary: string, letter: string) => boundary + letter.toUpperCase());
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
    }
    if (status === 'rejected') {
      return 'bg-red-500 text-white';
    }
    return 'bg-[#FFC370] text-lifewood-serpent';
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
      const result = await applicantService.getApplicants(10000, 0, { sort: 'newest' });
      const nextSummary = { ...EMPTY_SUMMARY };

      for (const applicant of result.applicants || []) {
        const designation = String(applicant.designations?.designation_name ?? '').trim().toLowerCase();
        const status = String(applicant.applicant_statuses?.status_name ?? '').trim().toLowerCase();

        nextSummary.total += 1;

        if (designation === 'intern') {
          nextSummary.interns += 1;
        } else if (designation === 'employee') {
          nextSummary.employees += 1;
        }

        if (status === 'pending') {
          nextSummary.pending += 1;
          if (designation === 'intern') nextSummary.pendingInterns += 1;
          if (designation === 'employee') nextSummary.pendingEmployees += 1;
        } else if (status === 'hired') {
          nextSummary.hired += 1;
          if (designation === 'intern') nextSummary.hiredInterns += 1;
          if (designation === 'employee') nextSummary.hiredEmployees += 1;
        } else if (status === 'rejected') {
          nextSummary.rejected += 1;
          if (designation === 'intern') nextSummary.rejectedInterns += 1;
          if (designation === 'employee') nextSummary.rejectedEmployees += 1;
        }
      }

      setSummary(nextSummary);
    } catch (error) {
      setSummary(EMPTY_SUMMARY);
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
        createdAt: String(record.created_at ?? ''),
      })) as ApplicantRecord[];
      setRecentApplicants(normalized);
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : 'Unable to load applicants.');
    } finally {
      setIsApplicantsLoading(false);
    }
  };

  const loadInquirySummary = async () => {
    setIsInquirySummaryLoading(true);
    try {
      const result = await messageService.getMessageSummary();
      setInquirySummary({
        total: result.total || 0,
        unread: result.unread || 0,
      });
    } catch (error) {
      setInquirySummary({ total: 0, unread: 0 });
      setLoadError((current) => current || (error instanceof Error ? error.message : 'Unable to load inquiries summary.'));
    } finally {
      setIsInquirySummaryLoading(false);
    }
  };

  useEffect(() => {
    void loadSummary();
    void loadInquirySummary();
    void loadRecentApplicants();
  }, []);

  const sidebarItems = [
    {
      label: 'Dashboard',
      icon: LayoutDashboard,
      active: true,
      onClick: () => setIsSidebarOpen(false),
    },
    {
      label: 'Applicants',
      icon: ClipboardList,
      onClick: () => {
        setIsSidebarOpen(false);
        navigateTo?.('admin-manage-applicants');
      },
    },
    {
      label: 'Inquiries',
      icon: Mail,
      onClick: () => {
        setIsSidebarOpen(false);
        navigateTo?.('admin-manage-inquiries');
      },
    },
    {
      label: 'Reports',
      icon: BookOpen,
      onClick: () => {
        setIsSidebarOpen(false);
        navigateTo?.('admin-reports');
      },
    },
  ];

  const displayValue = (value: number) => (isSummaryLoading ? '—' : value);
  const getPercent = (value: number, total: number) => (total > 0 ? Math.round((value / total) * 100) : 0);

  const typeBreakdown: BreakdownStat[] = [
    { label: 'Interns', value: summary.interns, colorClassName: 'bg-lifewood-green' },
    { label: 'Employees', value: summary.employees, colorClassName: 'bg-[#FFC370]' },
  ];

  const statusBreakdown = [
    {
      label: 'Hired',
      total: summary.hired,
      stats: [
        { label: 'Interns', value: summary.hiredInterns, colorClassName: 'bg-[#046241]' },
        { label: 'Employees', value: summary.hiredEmployees, colorClassName: 'bg-[#4ade80]' },
      ] as BreakdownStat[],
    },
    {
      label: 'Pending',
      total: summary.pending,
      stats: [
        { label: 'Interns', value: summary.pendingInterns, colorClassName: 'bg-[#c48a22]' },
        { label: 'Employees', value: summary.pendingEmployees, colorClassName: 'bg-[#FFC370]' },
      ] as BreakdownStat[],
    },
    {
      label: 'Rejected',
      total: summary.rejected,
      stats: [
        { label: 'Interns', value: summary.rejectedInterns, colorClassName: 'bg-[#991b1b]' },
        { label: 'Employees', value: summary.rejectedEmployees, colorClassName: 'bg-[#f87171]' },
      ] as BreakdownStat[],
    },
  ];

  return (
    <section className="min-h-screen bg-transparent lg:h-screen lg:overflow-hidden">
      <div className="flex min-h-screen flex-col lg:h-screen lg:flex-row">
        <AdminSidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          onEditProfile={() => {
            setIsSidebarOpen(false);
            setIsProfileOpen(true);
          }}
          onSignOut={() => navigateTo?.('signin')}
          onHome={() => navigateTo?.('home')}
          profileName={`${profile.firstName} ${profile.lastName}`.trim()}
          profileRole={ROLE_OPTIONS.find((r) => r.id === profile.roleId)?.label || 'Internal Access'}
          avatarSrc={profile.avatarUrl}
          items={sidebarItems}
        />

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
                  <h1 className="mt-1 text-2xl font-black text-lifewood-serpent md:text-3xl">Admin Overview</h1>
                  <p className="mt-2 text-sm text-lifewood-serpent/65">
                    Live counts based on the applicants database.
                  </p>
                </div>
              </div>

              {loadError && (
                <p className="mt-3 text-xs font-semibold text-red-600">{loadError}</p>
              )}

              <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-2xl bg-[#133020] p-4" style={{ background: 'linear-gradient(135deg, #133020 60%, #5a4600 100%)' }}>
                  <p className="text-xs font-semibold uppercase tracking-[0.15em] text-white/60">Total Applicants</p>
                  <p className="mt-2 text-3xl font-black text-[#FFE4B5]">{displayValue(summary.total)}</p>
                </div>
                <div className="rounded-2xl bg-[#133020] p-4" style={{ background: 'linear-gradient(135deg, #133020 60%, #3d2a00 100%)' }}>
                  <p className="text-xs font-semibold uppercase tracking-[0.15em] text-white/60">Pending Applicants</p>
                  <p className="mt-2 text-3xl font-black text-[#FFC370]">{displayValue(summary.pending)}</p>
                </div>
                <div className="rounded-2xl bg-[#133020] p-4" style={{ background: 'linear-gradient(135deg, #133020 60%, #064d32 100%)' }}>
                  <p className="text-xs font-semibold uppercase tracking-[0.15em] text-white/60">Hired Applicants</p>
                  <p className="mt-2 text-3xl font-black text-[#4ade80]">{displayValue(summary.hired)}</p>
                </div>
                <div className="rounded-2xl bg-[#133020] p-4" style={{ background: 'linear-gradient(135deg, #133020 60%, #4a1010 100%)' }}>
                  <p className="text-xs font-semibold uppercase tracking-[0.15em] text-white/60">Rejected Applicants</p>
                  <p className="mt-2 text-3xl font-black text-red-400">{displayValue(summary.rejected)}</p>
                </div>
              </div>

              {isSummaryLoading && (
                <div className="mt-4 flex items-center gap-3 text-sm font-semibold text-lifewood-serpent/70">
                  <span className="h-6 w-6 animate-spin rounded-full border-4 border-lifewood-serpent/20 border-t-lifewood-green" />
                  Loading summary...
                </div>
              )}

              <div className="mt-6 grid gap-4 xl:grid-cols-[1.05fr_1.35fr]">
                <div className="space-y-4">
                  <div className="rounded-3xl border border-lifewood-serpent/10 bg-[linear-gradient(180deg,#f8fbf6_0%,#eef6ef_100%)] p-5">
                    <div className="flex items-end justify-between gap-3">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-[0.15em] text-lifewood-green">Applicant Types</p>
                        <h3 className="mt-1 text-lg font-bold text-lifewood-serpent">Intern vs Employee</h3>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <p className="text-xs font-semibold text-lifewood-serpent/55">Share of all applicants</p>
                        <button
                          type="button"
                          onClick={() => navigateTo?.('admin-manage-applicants')}
                          className="inline-flex items-center rounded-xl bg-lifewood-green px-3 py-2 text-[11px] font-bold uppercase tracking-[0.12em] text-white shadow-sm transition hover:bg-lifewood-green/90"
                        >
                          View Applicants
                        </button>
                      </div>
                    </div>

                    <div className="mt-5 space-y-4">
                      {typeBreakdown.map((item) => (
                        <div key={item.label} className="space-y-2">
                          <div className="flex items-center justify-between text-sm font-semibold text-lifewood-serpent">
                            <span>{item.label}</span>
                            <span>
                              {displayValue(item.value)} {!isSummaryLoading && <span className="text-lifewood-serpent/50">({getPercent(item.value, summary.total)}%)</span>}
                            </span>
                          </div>
                          <div className="h-4 overflow-hidden rounded-full bg-lifewood-serpent/10">
                            <div
                              className={`h-full rounded-full ${item.colorClassName} transition-all duration-500`}
                              style={{ width: `${isSummaryLoading ? 0 : getPercent(item.value, summary.total)}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-3xl border border-lifewood-serpent/10 bg-[linear-gradient(180deg,#f9fbff_0%,#edf4fb_100%)] p-5">
                    <div className="flex items-end justify-between gap-3">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-[0.15em] text-lifewood-green">Inquiry Summary</p>
                        <h3 className="mt-1 text-lg font-bold text-lifewood-serpent">Contact Inbox</h3>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <p className="text-xs font-semibold text-lifewood-serpent/55">Based on unread and total inquiries</p>
                        <button
                          type="button"
                          onClick={() => navigateTo?.('admin-manage-inquiries')}
                          className="inline-flex items-center rounded-xl bg-lifewood-serpent px-3 py-2 text-[11px] font-bold uppercase tracking-[0.12em] text-white shadow-sm transition hover:bg-lifewood-serpent/90"
                        >
                          View Inquiries
                        </button>
                      </div>
                    </div>

                    <div className="mt-5 grid gap-4 sm:grid-cols-2">
                      <div className="rounded-2xl border border-lifewood-serpent/10 bg-white/80 p-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-lifewood-serpent/50">New Inquiries</p>
                        <p className="mt-2 text-3xl font-black text-lifewood-green">
                          {isInquirySummaryLoading ? '—' : inquirySummary.unread}
                        </p>
                        <div className="mt-3 h-2 overflow-hidden rounded-full bg-lifewood-serpent/10">
                          <div
                            className="h-full rounded-full bg-lifewood-green transition-all duration-500"
                            style={{
                              width: `${isInquirySummaryLoading ? 0 : getPercent(inquirySummary.unread, Math.max(inquirySummary.total, 1))}%`,
                            }}
                          />
                        </div>
                      </div>

                      <div className="rounded-2xl border border-lifewood-serpent/10 bg-white/80 p-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-lifewood-serpent/50">Total Inquiries</p>
                        <p className="mt-2 text-3xl font-black text-lifewood-serpent">
                          {isInquirySummaryLoading ? '—' : inquirySummary.total}
                        </p>
                        <p className="mt-3 text-xs font-semibold text-lifewood-serpent/55">
                          {isInquirySummaryLoading ? 'Loading inbox summary...' : `${getPercent(inquirySummary.unread, Math.max(inquirySummary.total, 1))}% currently unread`}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-3xl border border-lifewood-serpent/10 bg-[linear-gradient(180deg,#fffaf0_0%,#f7f4eb_100%)] p-5">
                  <div className="flex items-end justify-between gap-3">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.15em] text-lifewood-green">Status Graph</p>
                      <h3 className="mt-1 text-lg font-bold text-lifewood-serpent">Status by Designation</h3>
                    </div>
                    <p className="text-xs font-semibold text-lifewood-serpent/55">Interns and employees per status</p>
                  </div>

                  <div className="mt-5 space-y-5">
                    {statusBreakdown.map((group) => (
                      <div key={group.label} className="space-y-3 rounded-2xl border border-lifewood-serpent/8 bg-white/70 p-4">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-bold text-lifewood-serpent">{group.label}</p>
                          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-lifewood-serpent/45">
                            Total {displayValue(group.total)}
                          </p>
                        </div>

                        <div className="space-y-3">
                          {group.stats.map((stat) => (
                            <div key={`${group.label}-${stat.label}`} className="grid gap-2 sm:grid-cols-[92px_minmax(0,1fr)_64px] sm:items-center">
                              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-lifewood-serpent/55">{stat.label}</p>
                              <div className="h-3 overflow-hidden rounded-full bg-lifewood-serpent/10">
                                <div
                                  className={`h-full rounded-full ${stat.colorClassName} transition-all duration-500`}
                                  style={{ width: `${isSummaryLoading ? 0 : getPercent(stat.value, Math.max(group.total, 1))}%` }}
                                />
                              </div>
                              <p className="text-right text-sm font-bold text-lifewood-serpent">{displayValue(stat.value)}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-lifewood-serpent/10 bg-white p-5">
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-lifewood-serpent">Recent Applicants</h3>
                  <p className="mt-0.5 text-xs text-lifewood-serpent/45">Showing 5 most recent</p>
                </div>
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
                  <div
                    key={applicant.id}
                    className="flex flex-col gap-2 rounded-2xl border border-lifewood-serpent/10 bg-lifewood-seaSalt/60 p-4 md:flex-row md:items-center md:justify-between"
                  >
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
                      <span className={`min-w-[80px] rounded-full px-2.5 py-1 text-center text-xs font-semibold ${getStatusColorClasses(applicant.statusName)}`}>
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
        authUserId={null}
        onSave={saveProfile}
      />
    </section>
  );
};

export default AdminDashboard;
