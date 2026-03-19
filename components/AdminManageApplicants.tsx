import React, { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  BookOpen,
  Calendar,
  ClipboardList,
  Filter,
  LayoutDashboard,
  LogOut,
  Menu,
  SlidersHorizontal,
  Trash2,
  UserCircle2
} from 'lucide-react';
import { LOGO_URL } from '../constants';
import { supabase } from '../services/supabaseClient';
import { applicantService } from '../services/applicantService';
import { storageService } from '../services/storageService';
import { emailService } from '../services/emailService';
import { AdminNotificationBell } from './AdminNotificationBell';
import { AdminProfileModal } from './AdminProfileModal';
import { useAdminProfile } from './adminProfile';
import type { PageRoute } from '../routes/routeTypes';

interface AdminManageApplicantsProps {
  navigateTo?: (page: PageRoute) => void;
}

type ApplicantRecord = {
  id: string;
  firstName: string;
  lastName: string;
  middleName?: string | null;
  gender: string;
  age: number;
  phoneNumber: string;
  emailAddress: string;
  positionApplied: string;
  designationName?: string | null;
  country: string;
  currentAddress: string;
  schoolName?: string | null;
  uploadedCv: boolean;
  cvPath?: string | null;
  statusName?: string | null;
  newApplicantStatus: boolean;
  createdAt: string;
};

type ApplicantSummary = {
  pending: number;
  hired: number;
  rejected: number;
};

export const AdminManageApplicants: React.FC<AdminManageApplicantsProps> = ({ navigateTo }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { profile, setProfile, adminGmail } = useAdminProfile();
  const [isSelectMode, setIsSelectMode] = useState(false);
  const [applicants, setApplicants] = useState<ApplicantRecord[]>([]);
  const [summary, setSummary] = useState<ApplicantSummary>({
    pending: 0,
    hired: 0,
    rejected: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSummaryLoading, setIsSummaryLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [createdFrom, setCreatedFrom] = useState('');
  const [createdTo, setCreatedTo] = useState('');
  const [createdOn, setCreatedOn] = useState('');
  const [designationFilter, setDesignationFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [newOnly, setNewOnly] = useState(false);
  const [sortOrder, setSortOrder] = useState<
    'newest' | 'oldest' | 'first_name_asc' | 'first_name_desc' | 'last_name_asc' | 'last_name_desc'
  >('newest');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [modalApplicant, setModalApplicant] = useState<ApplicantRecord | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<{ mode: 'single' | 'selected'; id?: string; name?: string } | null>(null);
  const [assignmentNotice, setAssignmentNotice] = useState('');
  const [isEmailSending, setIsEmailSending] = useState(false);
  const [pageOffset, setPageOffset] = useState(0);
  const [pageLimit] = useState(20);
  const [hasMore, setHasMore] = useState(false);
  const isFilterActive = Boolean(
    createdOn || createdFrom || createdTo || designationFilter || newOnly || statusFilter
  );
  const isSortActive = sortOrder !== 'newest';

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

  const filteredApplicants = useMemo(
    () => applicants.filter((applicant) => `${applicant.firstName} ${applicant.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())),
    [applicants, searchTerm]
  );

  const areAllFilteredSelected =
    filteredApplicants.length > 0 && filteredApplicants.every((applicant) => selectedIds.includes(applicant.id));

  const toggleSelectAll = () => {
    if (areAllFilteredSelected) {
      setSelectedIds((prev) => prev.filter((id) => !filteredApplicants.some((applicant) => applicant.id === id)));
      return;
    }
    setSelectedIds((prev) => Array.from(new Set([...prev, ...filteredApplicants.map((applicant) => applicant.id)])));
  };

  const toggleSelectRow = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((selectedId) => selectedId !== id) : [...prev, id]));
  };

  const deleteOne = (id: string, name: string) => {
    setConfirmDelete({ mode: 'single', id, name });
  };

  const deleteSelected = () => {
    if (!selectedIds.length) return;
    setConfirmDelete({ mode: 'selected' });
  };

  const cancelSelection = () => {
    setIsSelectMode(false);
    setSelectedIds([]);
  };

  const deleteApplicantsByIds = async (ids: string[]) => {
    if (!ids.length) return;
    try {
      await applicantService.deleteApplicants(ids);
      setApplicants((prev) => prev.filter((applicant) => !ids.includes(applicant.id)));
      setModalApplicant((prev) => (prev && ids.includes(prev.id) ? null : prev));
      setSelectedIds((prev) => prev.filter((selectedId) => !ids.includes(selectedId)));
      setAssignmentNotice(ids.length > 1 ? `${ids.length} applicants deleted.` : 'Applicant deleted.');
      void loadSummary();
    } catch (error) {
      setAssignmentNotice(error instanceof Error ? error.message : 'Unable to delete applicants.');
    }
  };

  const confirmDeleteAction = async () => {
    if (!confirmDelete) return;
    if (confirmDelete.mode === 'single' && confirmDelete.id) {
      await deleteApplicantsByIds([confirmDelete.id]);
    } else if (confirmDelete.mode === 'selected') {
      await deleteApplicantsByIds(selectedIds);
    }
    setConfirmDelete(null);
    setIsSelectMode(false);
  };

  const closeDeleteModal = () => {
    setConfirmDelete(null);
    cancelSelection();
  };

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
    if (!isoDate) return '—';
    const parsed = new Date(isoDate);
    if (Number.isNaN(parsed.getTime())) return '—';
    return parsed.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const loadApplicants = async (offset = pageOffset) => {
    setIsLoading(true);
    setLoadError('');
    try {
      const result = await applicantService.getApplicants(pageLimit, offset, {
        created_from: createdFrom || undefined,
        created_to: createdTo || undefined,
        created_on: createdOn || undefined,
        designation_id: designationFilter || undefined,
        new_only: newOnly || undefined,
        status: statusFilter || undefined,
        sort: sortOrder as any
      });

      const normalized = (result.applicants || []).map((record: any) => ({
        id: String(record.id ?? ''),
        firstName: formatPersonName(String(record.first_name ?? '')),
        lastName: formatPersonName(String(record.last_name ?? '')),
        middleName: record.middle_name ? formatPersonName(String(record.middle_name)) : null,
        gender: String(record.gender ?? ''),
        age: Number(record.age ?? 0),
        phoneNumber: String(record.phone_number ?? ''),
        emailAddress: String(record.email ?? ''),
        positionApplied: String(record.position_applied ?? ''),
        designationName: record.designations?.designation_name ? String(record.designations.designation_name) : null,
        country: String(record.country ?? ''),
        currentAddress: String(record.current_address ?? ''),
        schoolName: record.schools?.school_name ? String(record.schools.school_name) : null,
        uploadedCv: Boolean(record.uploaded_cv),
        cvPath: record.cv_path ? String(record.cv_path) : null,
        statusName: record.applicant_statuses?.status_name ? String(record.applicant_statuses.status_name) : null,
        newApplicantStatus: Boolean(record.new_applicant_status),
        createdAt: String(record.created_at ?? '')
      })) as ApplicantRecord[];

      setApplicants(normalized);
      setHasMore(result.has_more || false);
      setPageOffset(result.offset);
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : 'Unable to load applicants.');
    } finally {
      setIsLoading(false);
    }
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
    } catch {
      setSummary({
        pending: 0,
        hired: 0,
        rejected: 0
      });
    } finally {
      setIsSummaryLoading(false);
    }
  };

  useEffect(() => {
    void loadApplicants(pageOffset);
    void loadSummary();
  }, [pageOffset]);

  useEffect(() => {
    if (pageOffset !== 0) {
      setPageOffset(0);
      return;
    }
    void loadApplicants(0);
  }, [createdFrom, createdTo, createdOn, designationFilter, newOnly, sortOrder, statusFilter]);

  const handleEditProfile = () => {
    setIsProfileOpen(true);
  };

  const updateApplicantStatus = async (applicantId: string, statusName: string, successMessage: string) => {
    setAssignmentNotice('');
    try {
      const { data: allStatuses } = await supabase
        .from('applicant_statuses')
        .select('id, status_name');

      const statusRecord = allStatuses?.find(
        (s: any) => s.status_name?.toLowerCase() === statusName.toLowerCase()
      );

      if (!statusRecord) {
        throw new Error(`Status "${statusName}" not found.`);
      }

      await applicantService.updateApplicant(applicantId, {
        status_id: statusRecord.id,
        new_applicant_status: false
      });

      setApplicants((prev) =>
        prev.map((applicant) =>
          applicant.id === applicantId
            ? { ...applicant, statusName, newApplicantStatus: false }
            : applicant
        )
      );
      setModalApplicant((prev) =>
        prev && prev.id === applicantId
          ? { ...prev, statusName, newApplicantStatus: false }
          : prev
      );
      setAssignmentNotice(successMessage);
      void loadSummary();
    } catch (error) {
      setAssignmentNotice(error instanceof Error ? error.message : 'Unable to update applicant status.');
    }
  };

  const markAsHired = (applicant: ApplicantRecord) => {
    void updateApplicantStatus(
      applicant.id,
      'hired',
      `${applicant.firstName} ${applicant.lastName} marked as hired.`
    );
    // Send hired email
    void emailService
      .sendHiredEmail(
        applicant.emailAddress,
        `${applicant.firstName} ${applicant.lastName}`,
        applicant.positionApplied
      )
      .catch((error) => {
        console.error('Email sending failed:', error);
      });
  };

  const markAsRejected = (applicant: ApplicantRecord) => {
    void updateApplicantStatus(
      applicant.id,
      'rejected',
      `${applicant.firstName} ${applicant.lastName} marked as rejected.`
    );
    // Send rejected email
    void emailService
      .sendRejectedEmail(
        applicant.emailAddress,
        `${applicant.firstName} ${applicant.lastName}`,
        applicant.positionApplied
      )
      .catch((error) => {
        console.error('Email sending failed:', error);
      });
  };

  const sendAIScreeningEmail = async () => {
    if (!modalApplicant) return;
    setAssignmentNotice('');
    setIsEmailSending(true);
    try {
      await emailService.sendAIScreeningEmail(
        modalApplicant.emailAddress,
        `${modalApplicant.firstName} ${modalApplicant.lastName}`,
        modalApplicant.positionApplied
      );
      setAssignmentNotice('AI screening email sent successfully.');
    } catch (error) {
      setAssignmentNotice(error instanceof Error ? error.message : 'Unable to send AI screening email.');
    } finally {
      setIsEmailSending(false);
    }
  };

  const fetchCvUrl = async (applicantId: string) => {
    if (!modalApplicant?.cvPath) {
      throw new Error('CV path not available.');
    }
    return await storageService.getSignedCVUrl(modalApplicant.cvPath, 900);
  };

  const openCv = async (applicant: ApplicantRecord) => {
    if (!applicant.cvPath) {
      setAssignmentNotice('CV not available.');
      return;
    }

    try {
      const url = await fetchCvUrl(applicant.id);
      window.open(url, '_blank', 'noopener,noreferrer');
    } catch (error) {
      setAssignmentNotice(error instanceof Error ? error.message : 'Unable to open CV.');
    }
  };

  const downloadCv = async (applicant: ApplicantRecord) => {
    if (!applicant.cvPath) {
      setAssignmentNotice('CV not available.');
      return;
    }

    try {
      const url = await fetchCvUrl(applicant.id);
      const safeName = `${applicant.lastName}_${applicant.firstName}_CV`.replace(/\s+/g, '_');
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Unable to download CV.');
      }
      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = objectUrl;
      link.download = `${safeName}.pdf`;
      link.rel = 'noopener noreferrer';
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(objectUrl);
    } catch (error) {
      setAssignmentNotice(error instanceof Error ? error.message : 'Unable to download CV.');
    }
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
              onClick={() => {
                setIsSidebarOpen(false);
                navigateTo?.('admin-manage-applicants');
              }}
              className="flex items-center gap-3 rounded-xl bg-lifewood-green px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-lifewood-green/30"
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

        <main className="relative flex-1 overflow-hidden p-4 md:p-6 animate-pop-out opacity-0 lg:h-screen lg:overflow-y-auto min-w-0">
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
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-lifewood-green">Recruitment</p>
              <h1 className="mt-1 text-2xl font-black text-lifewood-serpent md:text-3xl">Applicants</h1>
              <p className="mt-2 text-sm text-lifewood-serpent/65">
                Track applicant status, school details, and CV uploads across the hiring pipeline.
              </p>

              <div className="mt-5 grid gap-4 md:grid-cols-3">
                <div className="rounded-2xl border border-lifewood-serpent/10 bg-[#FFC370] p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.15em] text-lifewood-serpent/80">Pending</p>
                  <p className="mt-2 text-3xl font-black text-lifewood-serpent">
                    {isSummaryLoading ? '-' : summary.pending}
                  </p>
                </div>
                <div className="rounded-2xl border border-lifewood-serpent/10 bg-[#046241] p-4 text-white">
                  <p className="text-xs font-semibold uppercase tracking-[0.15em] text-white/80">Hired</p>
                  <p className="mt-2 text-3xl font-black text-lifewood-yellow">
                    {isSummaryLoading ? '-' : summary.hired}
                  </p>
                </div>
                <div className="rounded-2xl border border-lifewood-serpent/10 bg-red-500 p-4 text-white">
                  <p className="text-xs font-semibold uppercase tracking-[0.15em] text-white/80">Rejected</p>
                  <p className="mt-2 text-3xl font-black text-white">
                    {isSummaryLoading ? '-' : summary.rejected}
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
              <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-lg font-bold text-lifewood-serpent">Applicant Pipeline</h3>
                <Calendar className="h-5 w-5 text-lifewood-green" />
              </div>
              <div className="mb-4 flex flex-wrap items-center gap-2">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by name..."
                  className="min-w-[220px] rounded-xl border border-lifewood-serpent/15 px-3 py-2 text-sm text-lifewood-serpent focus:border-lifewood-green focus:outline-none"
                />
                <div className="relative">
                  {isFilterOpen && (
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setIsFilterOpen(false)}
                    />
                  )}
                  <div className="inline-flex items-center">
                    <button
                      type="button"
                      onClick={() => {
                        setIsFilterOpen((prev) => !prev);
                        setIsSortOpen(false);
                      }}
                      aria-pressed={isFilterActive}
                      className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-semibold transition ${
                        isFilterActive
                          ? 'rounded-r-none border-r-0 border-lifewood-green bg-lifewood-green text-white shadow-[0_6px_16px_rgba(4,98,65,0.25)]'
                          : 'border-lifewood-serpent/15 bg-white text-lifewood-serpent'
                      }`}
                    >
                      <Filter className={`h-4 w-4 ${isFilterActive ? 'text-white' : ''}`} />
                      Filter
                      {isFilterActive && <span className="ml-1 inline-flex h-2 w-2 rounded-full bg-lifewood-yellow" />}
                    </button>
                    {isFilterActive && (
                      <button
                        type="button"
                        onClick={() => {
                          setCreatedOn('');
                          setCreatedFrom('');
                          setCreatedTo('');
                          setDesignationFilter('');
                          setStatusFilter('');
                          setNewOnly(false);
                          setIsFilterOpen(false);
                        }}
                        className="inline-flex items-center rounded-xl rounded-l-none border border-lifewood-green bg-lifewood-green px-2 py-2 text-xs font-bold text-white hover:bg-lifewood-green/80"
                      >
                        ×
                      </button>
                    )}
                  </div>
                  {isFilterOpen && (
                    <div className="absolute left-0 top-full z-20 mt-2 w-[320px] rounded-2xl border border-lifewood-serpent/15 bg-white p-4 shadow-[0_18px_40px_rgba(19,48,32,0.12)]">
                      <div className="space-y-3 text-xs text-lifewood-serpent/70">
                        <div>
                          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-lifewood-serpent/60">
                            Created On
                          </p>
                          <input
                            type="date"
                            value={createdOn}
                            onChange={(e) => setCreatedOn(e.target.value)}
                            className="mt-2 w-full rounded-lg border border-lifewood-serpent/10 px-3 py-2 text-xs text-lifewood-serpent focus:border-lifewood-green focus:outline-none"
                          />
                        </div>
                        <div>
                          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-lifewood-serpent/60">
                            Date Range
                          </p>
                          <div className="mt-2 flex items-center gap-2">
                            <input
                              type="date"
                              value={createdFrom}
                              onChange={(e) => setCreatedFrom(e.target.value)}
                              className="w-full rounded-lg border border-lifewood-serpent/10 px-2 py-2 text-xs text-lifewood-serpent focus:border-lifewood-green focus:outline-none"
                            />
                            <span className="text-lifewood-serpent/40">to</span>
                            <input
                              type="date"
                              value={createdTo}
                              onChange={(e) => setCreatedTo(e.target.value)}
                              className="w-full rounded-lg border border-lifewood-serpent/10 px-2 py-2 text-xs text-lifewood-serpent focus:border-lifewood-green focus:outline-none"
                            />
                          </div>
                        </div>
                        <div>
                          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-lifewood-serpent/60">
                            Designation
                          </p>
                          <select
                            value={designationFilter}
                            onChange={(e) => setDesignationFilter(e.target.value)}
                            className="mt-2 w-full rounded-lg border border-lifewood-serpent/10 bg-white px-3 py-2 text-xs font-semibold text-lifewood-serpent"
                          >
                            <option value="">All Designations</option>
                            <option value="1">Intern</option>
                            <option value="2">Employee</option>
                          </select>
                        </div>
                        <div>
                          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-lifewood-serpent/60">
                            Status
                          </p>
                          <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="mt-2 w-full rounded-lg border border-lifewood-serpent/10 bg-white px-3 py-2 text-xs font-semibold text-lifewood-serpent"
                          >
                            <option value="">All Statuses</option>
                            <option value="pending">Pending</option>
                            <option value="hired">Hired</option>
                            <option value="rejected">Rejected</option>
                          </select>
                        </div>
                        <label className="flex items-center gap-2 rounded-lg border border-lifewood-serpent/10 bg-lifewood-seaSalt/60 px-3 py-2 text-xs font-semibold text-lifewood-serpent">
                          <input
                            type="checkbox"
                            checked={newOnly}
                            onChange={(e) => setNewOnly(e.target.checked)}
                            className="h-4 w-4 rounded border-lifewood-serpent/30 text-lifewood-green focus:ring-lifewood-green"
                          />
                          New applicants only
                        </label>
                        <p className="text-[11px] text-lifewood-serpent/50">
                          Specific date overrides the range.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
                <div className="relative">
                  {isSortOpen && (
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setIsSortOpen(false)}
                    />
                  )}
                  <div className="inline-flex items-center">
                    <button
                      type="button"
                      onClick={() => {
                        setIsSortOpen((prev) => !prev);
                        setIsFilterOpen(false);
                      }}
                      aria-pressed={isSortActive}
                      className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-semibold transition ${
                        isSortActive
                          ? 'rounded-r-none border-r-0 border-lifewood-green bg-lifewood-green text-white shadow-[0_6px_16px_rgba(4,98,65,0.25)]'
                          : 'border-lifewood-serpent/15 bg-white text-lifewood-serpent'
                      }`}
                    >
                      <SlidersHorizontal className={`h-4 w-4 ${isSortActive ? 'text-white' : ''}`} />
                      Sort
                      {isSortActive && <span className="ml-1 inline-flex h-2 w-2 rounded-full bg-lifewood-yellow" />}
                    </button>
                    {isSortActive && (
                      <button
                        type="button"
                        onClick={() => {
                          setSortOrder('newest');
                          setIsSortOpen(false);
                        }}
                        className="inline-flex items-center rounded-xl rounded-l-none border border-lifewood-green bg-lifewood-green px-2 py-2 text-xs font-bold text-white hover:bg-lifewood-green/80"
                      >
                        ×
                      </button>
                    )}
                  </div>
                  {isSortOpen && (
                    <div className="absolute left-0 top-full z-20 mt-2 w-[260px] rounded-2xl border border-lifewood-serpent/15 bg-white p-4 shadow-[0_18px_40px_rgba(19,48,32,0.12)]">
                      <div className="space-y-2 text-xs text-lifewood-serpent/70">
                        <label className="flex items-center gap-2 font-semibold text-lifewood-serpent">
                          <input
                            type="checkbox"
                            checked={sortOrder === 'newest'}
                            onChange={() => {
                              setSortOrder('newest');
                              setIsSortOpen(false);
                            }}
                            className="h-4 w-4 rounded border-lifewood-serpent/30 text-lifewood-green focus:ring-lifewood-green"
                          />
                          Newest first
                        </label>
                        <label className="flex items-center gap-2 font-semibold text-lifewood-serpent">
                          <input
                            type="checkbox"
                            checked={sortOrder === 'oldest'}
                            onChange={() => {
                              setSortOrder('oldest');
                              setIsSortOpen(false);
                            }}
                            className="h-4 w-4 rounded border-lifewood-serpent/30 text-lifewood-green focus:ring-lifewood-green"
                          />
                          Oldest first
                        </label>
                        <label className="flex items-center gap-2 font-semibold text-lifewood-serpent">
                          <input
                            type="checkbox"
                            checked={sortOrder === 'first_name_asc'}
                            onChange={() => {
                              setSortOrder('first_name_asc');
                              setIsSortOpen(false);
                            }}
                            className="h-4 w-4 rounded border-lifewood-serpent/30 text-lifewood-green focus:ring-lifewood-green"
                          />
                          A-Z (First name)
                        </label>
                        <label className="flex items-center gap-2 font-semibold text-lifewood-serpent">
                          <input
                            type="checkbox"
                            checked={sortOrder === 'first_name_desc'}
                            onChange={() => {
                              setSortOrder('first_name_desc');
                              setIsSortOpen(false);
                            }}
                            className="h-4 w-4 rounded border-lifewood-serpent/30 text-lifewood-green focus:ring-lifewood-green"
                          />
                          Z-A (First name)
                        </label>
                        <label className="flex items-center gap-2 font-semibold text-lifewood-serpent">
                          <input
                            type="checkbox"
                            checked={sortOrder === 'last_name_asc'}
                            onChange={() => {
                              setSortOrder('last_name_asc');
                              setIsSortOpen(false);
                            }}
                            className="h-4 w-4 rounded border-lifewood-serpent/30 text-lifewood-green focus:ring-lifewood-green"
                          />
                          A-Z (Last name)
                        </label>
                        <label className="flex items-center gap-2 font-semibold text-lifewood-serpent">
                          <input
                            type="checkbox"
                            checked={sortOrder === 'last_name_desc'}
                            onChange={() => {
                              setSortOrder('last_name_desc');
                              setIsSortOpen(false);
                            }}
                            className="h-4 w-4 rounded border-lifewood-serpent/30 text-lifewood-green focus:ring-lifewood-green"
                          />
                          Z-A (Last name)
                        </label>
                      </div>
                    </div>
                  )}
                </div>
                {!isSelectMode && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsSelectMode(true);
                      setSelectedIds([]);
                    }}
                    className="rounded-xl border border-lifewood-serpent/15 bg-lifewood-seaSalt px-3 py-2 text-xs font-semibold text-lifewood-serpent"
                  >
                    Select
                  </button>
                )}
                {isSelectMode && (
                  <button
                    type="button"
                    onClick={toggleSelectAll}
                    className="rounded-xl border border-lifewood-serpent/15 bg-lifewood-seaSalt px-3 py-2 text-xs font-semibold text-lifewood-serpent"
                  >
                    {areAllFilteredSelected ? 'Unselect All' : 'Select All'}
                  </button>
                )}
                {isSelectMode && (
                  <button
                    type="button"
                    onClick={cancelSelection}
                    className="rounded-xl border border-lifewood-serpent/15 bg-white px-3 py-2 text-xs font-semibold text-lifewood-serpent"
                  >
                    Cancel
                  </button>
                )}
                {isSelectMode && selectedIds.length > 0 && (
                  <button
                    type="button"
                    onClick={deleteSelected}
                    className="inline-flex items-center gap-1 rounded-xl bg-red-500 px-3 py-2 text-xs font-semibold text-white hover:bg-red-600"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Delete Selected
                  </button>
                )}
              </div>
              {loadError && (
                <p className="mb-3 text-xs font-semibold text-red-600">
                  {loadError}
                </p>
              )}
              {!loadError && isLoading && (
                <div className="mb-3 flex items-center gap-3 text-sm font-semibold text-lifewood-serpent/70">
                  <span className="h-6 w-6 animate-spin rounded-full border-4 border-lifewood-serpent/20 border-t-lifewood-green" />
                  Loading applicants...
                </div>
              )}
              {!loadError && !isLoading && filteredApplicants.length === 0 && (
                <p className="mb-3 text-xs font-semibold text-lifewood-serpent/60">
                  No applicants found.
                </p>
              )}
              {assignmentNotice && !modalApplicant && (
                <p className="mb-3 text-xs font-semibold text-lifewood-green">
                  {assignmentNotice}
                </p>
              )}
              <div className="overflow-auto max-h-[480px]">
                <table className="w-full min-w-[860px] table-auto text-left relative">
                  <thead className="bg-lifewood-seaSalt/70 sticky top-0 z-10">
                    <tr className="text-xs uppercase tracking-[0.14em] text-lifewood-serpent/55">
                      {isSelectMode && (
                        <th className="px-4 py-3">
                          <input type="checkbox" checked={areAllFilteredSelected} onChange={toggleSelectAll} />
                        </th>
                      )}
                      <th className="px-4 py-3">Applicant</th>
                      <th className="px-4 py-3">Position Applied</th>
                      <th className="px-4 py-3">Applying As</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">CV</th>
                      {isSelectMode && <th className="px-4 py-3">Actions</th>}
                      <th className="px-4 py-3 text-right" aria-label="New applicant indicator" />
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {filteredApplicants.map((applicant) => (
                      <tr
                        key={applicant.id}
                        onClick={() => {
                          setAssignmentNotice('');
                          setModalApplicant(applicant);
                        }}
                        className={[
                          'cursor-pointer border-t border-lifewood-serpent/10 transition',
                          applicant.newApplicantStatus
                            ? 'bg-lifewood-green/10 hover:bg-lifewood-green/15'
                            : 'odd:bg-white even:bg-lifewood-seaSalt/35 hover:bg-lifewood-seaSalt/60'
                        ].join(' ')}
                      >
                        {isSelectMode && (
                          <td className="px-4 py-4" onClick={(e) => e.stopPropagation()}>
                            <input
                              type="checkbox"
                              checked={selectedIds.includes(applicant.id)}
                              onChange={() => toggleSelectRow(applicant.id)}
                            />
                          </td>
                        )}
                        <td className="px-4 py-4 font-semibold text-lifewood-serpent">
                          <p>{applicant.firstName} {applicant.lastName}</p>
                          <p className="mt-1 text-xs font-medium text-lifewood-serpent/60">
                            Applied: {formatAppliedDate(applicant.createdAt)}
                          </p>
                        </td>
                        <td className="px-4 py-4 text-lifewood-serpent">{applicant.positionApplied}</td>
                        <td className="px-4 py-4 text-lifewood-serpent">{formatTitleCase(applicant.designationName) || '—'}</td>
                        <td className="px-4 py-4">
                          <span className={`inline-block w-24 rounded-full py-1 text-center text-xs font-semibold ${getStatusColorClasses(applicant.statusName)}`}>
                            {formatStatusLabel(applicant.statusName)}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-lifewood-serpent">
                          {applicant.cvPath ? 'Uploaded' : 'Missing'}
                        </td>
                        {isSelectMode && (
                          <td className="px-4 py-4" onClick={(e) => e.stopPropagation()}>
                            <button
                              type="button"
                              onClick={() => deleteOne(applicant.id, `${applicant.firstName} ${applicant.lastName}`)}
                              className="inline-flex items-center gap-1 rounded-lg bg-red-500 px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-red-600"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                              Delete
                            </button>
                          </td>
                        )}
                        <td className="px-4 py-4 text-right">
                          {applicant.newApplicantStatus && (
                            <span className="inline-flex h-2.5 w-2.5 rounded-full bg-lifewood-green shadow-[0_0_0_4px_rgba(34,197,94,0.12)]" />
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs font-semibold text-lifewood-serpent/70">
                <span>
                  Showing {pageOffset + 1}–{pageOffset + applicants.length}
                </span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setPageOffset(Math.max(0, pageOffset - pageLimit))}
                    disabled={pageOffset === 0}
                    className={`rounded-lg px-3 py-1.5 ${
                      pageOffset === 0
                        ? 'cursor-not-allowed bg-lifewood-serpent/10 text-lifewood-serpent/40'
                        : 'bg-lifewood-seaSalt text-lifewood-serpent hover:bg-lifewood-seaSalt/80'
                    }`}
                  >
                    Previous
                  </button>
                  <button
                    type="button"
                    onClick={() => setPageOffset(pageOffset + pageLimit)}
                    disabled={!hasMore}
                    className={`rounded-lg px-3 py-1.5 ${
                      !hasMore
                        ? 'cursor-not-allowed bg-lifewood-serpent/10 text-lifewood-serpent/40'
                        : 'bg-lifewood-green text-white hover:bg-lifewood-green/90'
                    }`}
                  >
                    Next
                  </button>
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

      <AnimatePresence>
        {modalApplicant && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-[180] flex items-center justify-center bg-black/45 p-4"
            onClick={() => setModalApplicant(null)}
          >
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 14, scale: 0.97 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="max-h-[90vh] w-full max-w-3xl flex flex-col rounded-3xl border border-lifewood-serpent/10 bg-white overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
            <div className="flex shrink-0 items-center justify-between border-b border-lifewood-serpent/10 px-5 py-4">
              <h3 className="text-lg font-bold text-lifewood-serpent">Applicant Details: {modalApplicant.firstName} {modalApplicant.lastName}</h3>
              <button
                type="button"
                onClick={() => setModalApplicant(null)}
                className="rounded-lg border border-lifewood-serpent/15 px-3 py-1 text-xs font-semibold text-lifewood-serpent"
              >
                Close
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-4">
              <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_260px]">
                <div className="space-y-4">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-xl bg-lifewood-seaSalt/60 p-3"><p className="text-[10px] font-bold uppercase tracking-[0.15em] text-lifewood-serpent/50">First Name</p><p className="mt-1 text-sm font-semibold text-lifewood-serpent">{modalApplicant.firstName}</p></div>
                    <div className="rounded-xl bg-lifewood-seaSalt/60 p-3"><p className="text-[10px] font-bold uppercase tracking-[0.15em] text-lifewood-serpent/50">Last Name</p><p className="mt-1 text-sm font-semibold text-lifewood-serpent">{modalApplicant.lastName}</p></div>
                    <div className="rounded-xl bg-lifewood-seaSalt/60 p-3"><p className="text-[10px] font-bold uppercase tracking-[0.15em] text-lifewood-serpent/50">Middle Name</p><p className="mt-1 text-sm font-semibold text-lifewood-serpent">{modalApplicant.middleName || '—'}</p></div>
                    <div className="rounded-xl bg-lifewood-seaSalt/60 p-3"><p className="text-[10px] font-bold uppercase tracking-[0.15em] text-lifewood-serpent/50">Gender</p><p className="mt-1 text-sm font-semibold text-lifewood-serpent">{modalApplicant.gender}</p></div>
                    <div className="rounded-xl bg-lifewood-seaSalt/60 p-3"><p className="text-[10px] font-bold uppercase tracking-[0.15em] text-lifewood-serpent/50">Age</p><p className="mt-1 text-sm font-semibold text-lifewood-serpent">{modalApplicant.age}</p></div>
                    <div className="rounded-xl bg-lifewood-seaSalt/60 p-3"><p className="text-[10px] font-bold uppercase tracking-[0.15em] text-lifewood-serpent/50">Phone Number</p><p className="mt-1 text-sm font-semibold text-lifewood-serpent">{modalApplicant.phoneNumber}</p></div>
                    <div className="rounded-xl bg-lifewood-seaSalt/60 p-3"><p className="text-[10px] font-bold uppercase tracking-[0.15em] text-lifewood-serpent/50">Email Address</p><p className="mt-1 text-sm font-semibold text-lifewood-serpent break-all">{modalApplicant.emailAddress}</p></div>
                    <div className="rounded-xl bg-lifewood-seaSalt/60 p-3"><p className="text-[10px] font-bold uppercase tracking-[0.15em] text-lifewood-serpent/50">Position Applied</p><p className="mt-1 text-sm font-semibold text-lifewood-serpent">{modalApplicant.positionApplied}</p></div>
                    <div className="rounded-xl bg-lifewood-seaSalt/60 p-3"><p className="text-[10px] font-bold uppercase tracking-[0.15em] text-lifewood-serpent/50">Applying As</p><p className="mt-1 text-sm font-semibold text-lifewood-serpent">{formatTitleCase(modalApplicant.designationName) || '—'}</p></div>
                    <div className="rounded-xl bg-lifewood-seaSalt/60 p-3"><p className="text-[10px] font-bold uppercase tracking-[0.15em] text-lifewood-serpent/50">School</p><p className="mt-1 text-sm font-semibold text-lifewood-serpent">{modalApplicant.schoolName || '—'}</p></div>
                    <div className="rounded-xl bg-lifewood-seaSalt/60 p-3"><p className="text-[10px] font-bold uppercase tracking-[0.15em] text-lifewood-serpent/50">Country</p><p className="mt-1 text-sm font-semibold text-lifewood-serpent">{modalApplicant.country}</p></div>
                    <div className="rounded-xl bg-lifewood-seaSalt/60 p-3"><p className="text-[10px] font-bold uppercase tracking-[0.15em] text-lifewood-serpent/50">Status</p><p className="mt-1 text-sm font-semibold text-lifewood-serpent">{formatStatusLabel(modalApplicant.statusName)}</p></div>
                    <div className="rounded-xl bg-lifewood-seaSalt/60 p-3"><p className="text-[10px] font-bold uppercase tracking-[0.15em] text-lifewood-serpent/50">New Applicant</p><p className="mt-1 text-sm font-semibold text-lifewood-serpent">{modalApplicant.newApplicantStatus ? 'Yes' : 'No'}</p></div>
                    <div className="rounded-xl bg-lifewood-seaSalt/60 p-3"><p className="text-[10px] font-bold uppercase tracking-[0.15em] text-lifewood-serpent/50">Applied Date</p><p className="mt-1 text-sm font-semibold text-lifewood-serpent">{formatAppliedDate(modalApplicant.createdAt)}</p></div>
                    <div className="rounded-xl bg-lifewood-seaSalt/60 p-3 sm:col-span-2"><p className="text-[10px] font-bold uppercase tracking-[0.15em] text-lifewood-serpent/50">Current Address</p><p className="mt-1 text-sm font-semibold text-lifewood-serpent">{formatTitleCase(modalApplicant.currentAddress)}</p></div>
                  </div>

                </div>

                <div className="space-y-4">
                  <div className="rounded-2xl border border-lifewood-serpent/10 bg-white p-4">
                    <p className="text-sm font-semibold text-lifewood-serpent">Update Applicant Status</p>
                    <p className="mt-1 text-xs text-lifewood-serpent/60">
                      Set the final decision for this applicant.
                    </p>
                    <div className="mt-3 flex flex-col gap-2">
                      <button
                        type="button"
                        onClick={() => markAsHired(modalApplicant)}
                        disabled={modalApplicant.statusName?.toLowerCase() === 'hired'}
                        className={`rounded-xl px-3 py-2 text-xs font-semibold ${
                          modalApplicant.statusName?.toLowerCase() === 'hired'
                            ? 'cursor-not-allowed bg-lifewood-serpent/15 text-lifewood-serpent/50'
                            : 'bg-lifewood-green text-white hover:bg-lifewood-green/90'
                        }`}
                      >
                        Mark as Hired
                      </button>
                      <button
                        type="button"
                        onClick={() => markAsRejected(modalApplicant)}
                        disabled={modalApplicant.statusName?.toLowerCase() === 'rejected'}
                        className={`rounded-xl px-3 py-2 text-xs font-semibold ${
                          modalApplicant.statusName?.toLowerCase() === 'rejected'
                            ? 'cursor-not-allowed bg-lifewood-serpent/15 text-lifewood-serpent/50'
                            : 'bg-red-500 text-white hover:bg-red-600'
                        }`}
                      >
                        Mark as Rejected
                      </button>
                    </div>

                    <div className="mt-4 border-t border-lifewood-serpent/10 pt-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-lifewood-serpent/60">Email Templates</p>
                      <div className="mt-2 flex flex-col gap-2">
                        <button
                          type="button"
                          onClick={sendAIScreeningEmail}
                          disabled={isEmailSending}
                          className={`rounded-xl px-3 py-2 text-xs font-semibold ${
                            isEmailSending
                              ? 'cursor-not-allowed bg-lifewood-serpent/15 text-lifewood-serpent/50'
                              : 'border border-lifewood-serpent/20 bg-lifewood-seaSalt text-lifewood-serpent hover:bg-lifewood-seaSalt/80'
                          }`}
                        >
                          Email Applicant for AI Screening
                        </button>
                      </div>
                    </div>
                    {assignmentNotice && <p className="mt-3 text-xs font-semibold text-lifewood-green">{assignmentNotice}</p>}
                  </div>
                  <div className="rounded-2xl border border-lifewood-serpent/10 bg-lifewood-seaSalt/60 p-4">
                    <p className="text-sm font-semibold text-lifewood-serpent">CV Upload</p>
                    <p className="mt-1 text-xs text-lifewood-serpent/70">
                      {modalApplicant.cvPath ? 'Uploaded' : 'Not uploaded'}
                    </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => openCv(modalApplicant)}
                        disabled={!modalApplicant.cvPath}
                        className={`rounded-xl px-3 py-2 text-xs font-semibold ${
                          modalApplicant.cvPath
                            ? 'bg-lifewood-green text-white hover:bg-lifewood-green/90'
                            : 'cursor-not-allowed bg-lifewood-serpent/15 text-lifewood-serpent/50'
                        }`}
                      >
                        View CV
                      </button>
                    <button
                      type="button"
                      onClick={() => downloadCv(modalApplicant)}
                      disabled={!modalApplicant.cvPath}
                      className={`rounded-xl px-3 py-2 text-xs font-semibold ${
                        modalApplicant.cvPath
                          ? 'bg-lifewood-serpent text-white hover:bg-lifewood-serpent/90'
                          : 'cursor-not-allowed bg-lifewood-serpent/15 text-lifewood-serpent/50'
                      }`}
                    >
                      Download CV
                    </button>
                  </div>
                </div>
              </div>
            </div>
            </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {confirmDelete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-[180] flex items-center justify-center bg-black/45 p-4"
            onClick={closeDeleteModal}
          >
            <motion.div
              initial={{ opacity: 0, y: 16, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.97 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="w-full max-w-md rounded-2xl border border-lifewood-serpent/10 bg-white p-5"
              onClick={(e) => e.stopPropagation()}
            >
            <h4 className="text-lg font-bold text-lifewood-serpent">Confirm Delete</h4>
            <p className="mt-2 text-sm text-lifewood-serpent/70">
              {confirmDelete.mode === 'single'
                ? `Are you sure you want to delete ${confirmDelete.name}?`
                : `Are you sure you want to delete ${selectedIds.length} selected applicant(s)?`}
            </p>
            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={closeDeleteModal}
                className="rounded-xl border border-lifewood-serpent/15 px-3 py-2 text-xs font-semibold text-lifewood-serpent"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDeleteAction}
                className="rounded-xl bg-red-500 px-3 py-2 text-xs font-semibold text-white hover:bg-red-600"
              >
                Delete
              </button>
            </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default AdminManageApplicants;


