import React, { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  BookOpen,
  Calendar,
  ClipboardList,
  Filter,
  LayoutDashboard,
  Mail,
  Menu,
  SlidersHorizontal,
  Trash2,
  UserCircle2
} from 'lucide-react';
import { supabase } from '../services/supabaseClient';
import { applicantService } from '../services/applicantService';
import { storageService } from '../services/storageService';
import { emailService } from '../services/emailService';
import { AdminSidebar } from './AdminSidebar';
import { AdminProfileModal } from './AdminProfileModal';
import { useProfile } from './ProfileContext';
import { ROLE_OPTIONS } from './adminProfile';
import { Toast, useToast } from './Toast';
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
  const { profile, adminGmail, saveProfile } = useProfile();
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
  const { toasts, show: showToast, dismiss: dismissToast } = useToast();
  const [isEmailSending, setIsEmailSending] = useState(false);
  const [pageOffset, setPageOffset] = useState(0);
  const [pageLimit] = useState(20);
  const [hasMore, setHasMore] = useState(false);
  const isFilterActive = Boolean(
    createdOn || createdFrom || createdTo || designationFilter || newOnly || statusFilter
  );
  const isSortActive = sortOrder !== 'newest';

  const sidebarItems = [
    {
      label: 'Dashboard',
      icon: LayoutDashboard,
      onClick: () => {
        setIsSidebarOpen(false);
        navigateTo?.('admin-dashboard');
      }
    },
    {
      label: 'Applicants',
      icon: ClipboardList,
      active: true,
      onClick: () => setIsSidebarOpen(false)
    },
    {
      label: 'Inquiries',
      icon: Mail,
      onClick: () => {
        setIsSidebarOpen(false);
        navigateTo?.('admin-manage-inquiries');
      }
    },
    {
      label: 'Reports',
      icon: BookOpen,
      onClick: () => {
        setIsSidebarOpen(false);
        navigateTo?.('admin-reports');
      }
    }
  ];

  const formatPersonName = (value?: string | null) => {
    if (!value) return '';
    return value
      .trim()
      .toLowerCase()
      // Both formatPersonName and formatTitleCase
      .replace(/(^|[\s\-'])([a-z])/g, (_match, boundary: string, letter: string) => boundary + letter.toUpperCase());
  };

  const formatTitleCase = (value?: string | null) => {
    if (!value) return '';
    return value
      .trim()
      .toLowerCase()
      // Both formatPersonName and formatTitleCase
      .replace(/(^|[\s\-'])([a-z])/g, (_match, boundary: string, letter: string) => boundary + letter.toUpperCase());
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
      showToast(ids.length > 1 ? `${ids.length} applicants deleted.` : 'Applicant deleted.', 'delete');
      void loadSummary();
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Unable to delete applicants.', 'delete');
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

  const updateApplicantStatus = async (applicantId: string, statusName: string, successMessage: string, toastVariant: import('./Toast').ToastVariant) => {
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
      showToast(successMessage, toastVariant);
      void loadSummary();
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Unable to update applicant status.', 'delete');
    }
  };

  const markAsHired = (applicant: ApplicantRecord) => {
    void updateApplicantStatus(
      applicant.id,
      'hired',
      `${applicant.firstName} ${applicant.lastName} marked as hired. Applicant notified via email.`,
      'hired'
    );
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
      `${applicant.firstName} ${applicant.lastName} marked as rejected. Applicant notified via email.`,
      'rejected'
    );
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
    setIsEmailSending(true);
    try {
      await emailService.sendAIScreeningEmail(
        modalApplicant.emailAddress,
        `${modalApplicant.firstName} ${modalApplicant.lastName}`,
        modalApplicant.positionApplied
      );
      showToast('AI screening email sent successfully.', 'ai-screening');
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Unable to send AI screening email.', 'delete');
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
      showToast('CV not available.', 'delete');
      return;
    }
    try {
      const url = await fetchCvUrl(applicant.id);
      window.open(url, '_blank', 'noopener,noreferrer');
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Unable to open CV.', 'delete');
    }
  };

  const downloadCv = async (applicant: ApplicantRecord) => {
    if (!applicant.cvPath) {
      showToast('CV not available.', 'delete');
      return;
    }
    try {
      const url = await fetchCvUrl(applicant.id);
      const safeName = `${applicant.lastName}_${applicant.firstName}_CV`.replace(/\s+/g, '_');
      const response = await fetch(url);
      if (!response.ok) throw new Error('Unable to download CV.');
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
      showToast(error instanceof Error ? error.message : 'Unable to download CV.', 'delete');
    }
  };

  return (
    <section className="min-h-screen bg-transparent lg:h-screen lg:overflow-hidden">
      <div className="flex min-h-screen flex-col lg:h-screen lg:flex-row">
        <AdminSidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          onEditProfile={handleEditProfile}
          onSignOut={() => navigateTo?.('signin')}
          onHome={() => navigateTo?.('home')}
          profileName={`${profile.firstName} ${profile.lastName}`.trim()}
          profileRole={ROLE_OPTIONS.find((r) => r.id === profile.roleId)?.label || 'Internal Access'}
          avatarSrc={profile.avatarUrl}
          items={sidebarItems}
        />

        <main className="relative flex-1 overflow-hidden p-4 md:p-6 animate-pop-out opacity-0 lg:h-screen lg:overflow-y-auto min-w-0">
          <div className="relative z-10 mx-auto max-w-6xl space-y-5">
            <div className="flex items-center justify-between rounded-2xl border border-lifewood-serpent/10 bg-white p-3 lg:hidden">
              <button type="button" onClick={() => setIsSidebarOpen(true)} className="inline-flex items-center gap-2 rounded-xl bg-lifewood-serpent px-3 py-2 text-xs font-bold uppercase tracking-[0.14em] text-white"><Menu className="h-4 w-4" />Menu</button>
              <button type="button" onClick={() => navigateTo?.('signin')} className="rounded-xl border border-lifewood-serpent/15 px-3 py-2 text-xs font-semibold text-lifewood-serpent">Sign out</button>
            </div>

            <div className="rounded-3xl border border-lifewood-serpent/10 bg-white p-5 shadow-[0_16px_50px_rgba(19,48,32,0.08)]">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-lifewood-green">Recruitment</p>
              <h1 className="mt-1 text-2xl font-black text-lifewood-serpent md:text-3xl">Applicants</h1>
              <p className="mt-2 text-sm text-lifewood-serpent/65">Track applicant status, school details, and CV uploads across the hiring pipeline.</p>
              <div className="mt-3 flex flex-wrap items-center gap-1.5 text-xs font-semibold text-lifewood-serpent/50">
                {isSummaryLoading ? (
                  <span className="text-lifewood-serpent/40">Loading...</span>
                ) : (
                  <>
                    <span className="text-lifewood-serpent/70">{summary.pending + summary.hired + summary.rejected} total</span>
                    <span className="text-lifewood-serpent/25">·</span>
                    <span className="text-[#b07800]">{summary.pending} pending</span>
                    <span className="text-lifewood-serpent/25">·</span>
                    <span className="text-[#046241]">{summary.hired} hired</span>
                    <span className="text-lifewood-serpent/25">·</span>
                    <span className="text-red-500">{summary.rejected} rejected</span>
                  </>
                )}
              </div>
            </div>

            <div className="rounded-3xl border border-lifewood-serpent/10 bg-white p-5">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-lg font-bold text-lifewood-serpent">Applicant Pipeline</h3>
                <Calendar className="h-5 w-5 text-lifewood-green" />
              </div>
              <div className="mb-4 flex flex-wrap items-center gap-2">
                <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search by name..." className="min-w-[220px] rounded-xl border border-lifewood-serpent/15 px-3 py-2 text-sm text-lifewood-serpent focus:border-lifewood-green focus:outline-none" />
                <div className="relative">
                  {isFilterOpen && <div className="fixed inset-0 z-10" onClick={() => setIsFilterOpen(false)} />}
                  <div className="inline-flex items-center">
                    <button type="button" onClick={() => { setIsFilterOpen((prev) => !prev); setIsSortOpen(false); }} aria-pressed={isFilterActive} className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-semibold transition ${isFilterActive ? 'rounded-r-none border-r-0 border-lifewood-green bg-lifewood-green text-white shadow-[0_6px_16px_rgba(4,98,65,0.25)]' : 'border-lifewood-serpent/15 bg-white text-lifewood-serpent'}`}>
                      <Filter className={`h-4 w-4 ${isFilterActive ? 'text-white' : ''}`} />Filter{isFilterActive && <span className="ml-1 inline-flex h-2 w-2 rounded-full bg-lifewood-yellow" />}
                    </button>
                    {isFilterActive && <button type="button" onClick={() => { setCreatedOn(''); setCreatedFrom(''); setCreatedTo(''); setDesignationFilter(''); setStatusFilter(''); setNewOnly(false); setIsFilterOpen(false); }} className="inline-flex items-center rounded-xl rounded-l-none border border-lifewood-green bg-lifewood-green px-2 py-2 text-xs font-bold text-white hover:bg-lifewood-green/80">×</button>}
                  </div>
                  {isFilterOpen && (
                    <div className="absolute left-0 top-full z-20 mt-2 w-[320px] rounded-2xl border border-lifewood-serpent/15 bg-white p-4 shadow-[0_18px_40px_rgba(19,48,32,0.12)]">
                      <div className="space-y-3 text-xs text-lifewood-serpent/70">
                        <div><p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-lifewood-serpent/60">Created On</p><input type="date" value={createdOn} onChange={(e) => setCreatedOn(e.target.value)} className="mt-2 w-full rounded-lg border border-lifewood-serpent/10 px-3 py-2 text-xs text-lifewood-serpent focus:border-lifewood-green focus:outline-none" /></div>
                        <div><p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-lifewood-serpent/60">Date Range</p><div className="mt-2 flex items-center gap-2"><input type="date" value={createdFrom} onChange={(e) => setCreatedFrom(e.target.value)} className="w-full rounded-lg border border-lifewood-serpent/10 px-2 py-2 text-xs text-lifewood-serpent focus:border-lifewood-green focus:outline-none" /><span className="text-lifewood-serpent/40">to</span><input type="date" value={createdTo} onChange={(e) => setCreatedTo(e.target.value)} className="w-full rounded-lg border border-lifewood-serpent/10 px-2 py-2 text-xs text-lifewood-serpent focus:border-lifewood-green focus:outline-none" /></div></div>
                        <div><p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-lifewood-serpent/60">Designation</p><select value={designationFilter} onChange={(e) => setDesignationFilter(e.target.value)} className="mt-2 w-full rounded-lg border border-lifewood-serpent/10 bg-white px-3 py-2 text-xs font-semibold text-lifewood-serpent"><option value="">All Designations</option><option value="1">Intern</option><option value="2">Employee</option></select></div>
                        <div><p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-lifewood-serpent/60">Status</p><select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="mt-2 w-full rounded-lg border border-lifewood-serpent/10 bg-white px-3 py-2 text-xs font-semibold text-lifewood-serpent"><option value="">All Statuses</option><option value="pending">Pending</option><option value="hired">Hired</option><option value="rejected">Rejected</option></select></div>
                        <label className="flex items-center gap-2 rounded-lg border border-lifewood-serpent/10 bg-lifewood-seaSalt/60 px-3 py-2 text-xs font-semibold text-lifewood-serpent"><input type="checkbox" checked={newOnly} onChange={(e) => setNewOnly(e.target.checked)} className="h-4 w-4 rounded border-lifewood-serpent/30 text-lifewood-green focus:ring-lifewood-green" />New applicants only</label>
                        <p className="text-[11px] text-lifewood-serpent/50">Specific date overrides the range.</p>
                      </div>
                    </div>
                  )}
                </div>
                <div className="relative">
                  {isSortOpen && <div className="fixed inset-0 z-10" onClick={() => setIsSortOpen(false)} />}
                  <div className="inline-flex items-center">
                    <button type="button" onClick={() => { setIsSortOpen((prev) => !prev); setIsFilterOpen(false); }} aria-pressed={isSortActive} className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-semibold transition ${isSortActive ? 'rounded-r-none border-r-0 border-lifewood-green bg-lifewood-green text-white shadow-[0_6px_16px_rgba(4,98,65,0.25)]' : 'border-lifewood-serpent/15 bg-white text-lifewood-serpent'}`}>
                      <SlidersHorizontal className={`h-4 w-4 ${isSortActive ? 'text-white' : ''}`} />Sort{isSortActive && <span className="ml-1 inline-flex h-2 w-2 rounded-full bg-lifewood-yellow" />}
                    </button>
                    {isSortActive && <button type="button" onClick={() => { setSortOrder('newest'); setIsSortOpen(false); }} className="inline-flex items-center rounded-xl rounded-l-none border border-lifewood-green bg-lifewood-green px-2 py-2 text-xs font-bold text-white hover:bg-lifewood-green/80">×</button>}
                  </div>
                  {isSortOpen && (
                    <div className="absolute left-0 top-full z-20 mt-2 w-[260px] rounded-2xl border border-lifewood-serpent/15 bg-white p-4 shadow-[0_18px_40px_rgba(19,48,32,0.12)]">
                      <div className="space-y-2 text-xs text-lifewood-serpent/70">
                        {(['newest','oldest','first_name_asc','first_name_desc','last_name_asc','last_name_desc'] as const).map((val) => (
                          <label key={val} className="flex items-center gap-2 font-semibold text-lifewood-serpent">
                            <input type="checkbox" checked={sortOrder === val} onChange={() => { setSortOrder(val); setIsSortOpen(false); }} className="h-4 w-4 rounded border-lifewood-serpent/30 text-lifewood-green focus:ring-lifewood-green" />
                            {val === 'newest' ? 'Newest first' : val === 'oldest' ? 'Oldest first' : val === 'first_name_asc' ? 'A-Z (First name)' : val === 'first_name_desc' ? 'Z-A (First name)' : val === 'last_name_asc' ? 'A-Z (Last name)' : 'Z-A (Last name)'}
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                {!isSelectMode && <button type="button" onClick={() => { setIsSelectMode(true); setSelectedIds([]); }} className="rounded-xl border border-lifewood-serpent/15 bg-lifewood-seaSalt px-3 py-2 text-xs font-semibold text-lifewood-serpent">Select</button>}
                {isSelectMode && <button type="button" onClick={toggleSelectAll} className="rounded-xl border border-lifewood-serpent/15 bg-lifewood-seaSalt px-3 py-2 text-xs font-semibold text-lifewood-serpent">{areAllFilteredSelected ? 'Unselect All' : 'Select All'}</button>}
                {isSelectMode && <button type="button" onClick={cancelSelection} className="rounded-xl border border-lifewood-serpent/15 bg-white px-3 py-2 text-xs font-semibold text-lifewood-serpent">Cancel</button>}
                {isSelectMode && selectedIds.length > 0 && <button type="button" onClick={deleteSelected} className="inline-flex items-center gap-1 rounded-xl bg-red-500 px-3 py-2 text-xs font-semibold text-white hover:bg-red-600"><Trash2 className="h-3.5 w-3.5" />Delete Selected</button>}
              </div>
              {loadError && <p className="mb-3 text-xs font-semibold text-red-600">{loadError}</p>}
              {!loadError && isLoading && <div className="mb-3 flex items-center gap-3 text-sm font-semibold text-lifewood-serpent/70"><span className="h-6 w-6 animate-spin rounded-full border-4 border-lifewood-serpent/20 border-t-lifewood-green" />Loading applicants...</div>}
              {!loadError && !isLoading && filteredApplicants.length === 0 && <p className="mb-3 text-xs font-semibold text-lifewood-serpent/60">No applicants found.</p>}
              <div className="overflow-auto max-h-[480px]">
                <table className="w-full min-w-[860px] table-auto text-left relative">
                  <thead className="bg-lifewood-seaSalt/70 sticky top-0 z-10">
                    <tr className="text-xs uppercase tracking-[0.14em] text-lifewood-serpent/55">
                      {isSelectMode && <th className="px-4 py-3"><input type="checkbox" checked={areAllFilteredSelected} onChange={toggleSelectAll} /></th>}
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
                      <tr key={applicant.id} onClick={() => setModalApplicant(applicant)} className={['cursor-pointer border-t border-lifewood-serpent/10 transition', applicant.newApplicantStatus ? 'bg-lifewood-green/10 hover:bg-lifewood-green/15' : 'odd:bg-white even:bg-lifewood-seaSalt/35 hover:bg-lifewood-seaSalt/60'].join(' ')}>
                        {isSelectMode && <td className="px-4 py-4" onClick={(e) => e.stopPropagation()}><input type="checkbox" checked={selectedIds.includes(applicant.id)} onChange={() => toggleSelectRow(applicant.id)} /></td>}
                        <td className="px-4 py-4 font-semibold text-lifewood-serpent"><p>{applicant.firstName} {applicant.lastName}</p><p className="mt-1 text-xs font-medium text-lifewood-serpent/60">Applied: {formatAppliedDate(applicant.createdAt)}</p></td>
                        <td className="px-4 py-4 text-lifewood-serpent">{applicant.positionApplied}</td>
                        <td className="px-4 py-4 text-lifewood-serpent">{formatTitleCase(applicant.designationName) || '—'}</td>
                        <td className="px-4 py-4"><span className={`inline-block w-24 rounded-full py-1 text-center text-xs font-semibold ${getStatusColorClasses(applicant.statusName)}`}>{formatStatusLabel(applicant.statusName)}</span></td>
                        <td className="px-4 py-4 text-lifewood-serpent">{applicant.cvPath ? 'Uploaded' : 'Missing'}</td>
                        {isSelectMode && <td className="px-4 py-4" onClick={(e) => e.stopPropagation()}><button type="button" onClick={() => deleteOne(applicant.id, `${applicant.firstName} ${applicant.lastName}`)} className="inline-flex items-center gap-1 rounded-lg bg-red-500 px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-red-600"><Trash2 className="h-3.5 w-3.5" />Delete</button></td>}
                        <td className="px-4 py-4 text-right">{applicant.newApplicantStatus && <span className="inline-flex h-2.5 w-2.5 rounded-full bg-lifewood-green shadow-[0_0_0_4px_rgba(34,197,94,0.12)]" />}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs font-semibold text-lifewood-serpent/70">
                <span>Showing {pageOffset + 1}–{pageOffset + applicants.length}</span>
                <div className="flex gap-2">
                  <button type="button" onClick={() => setPageOffset(Math.max(0, pageOffset - pageLimit))} disabled={pageOffset === 0} className={`rounded-lg px-3 py-1.5 ${pageOffset === 0 ? 'cursor-not-allowed bg-lifewood-serpent/10 text-lifewood-serpent/40' : 'bg-lifewood-seaSalt text-lifewood-serpent hover:bg-lifewood-seaSalt/80'}`}>Previous</button>
                  <button type="button" onClick={() => setPageOffset(pageOffset + pageLimit)} disabled={!hasMore} className={`rounded-lg px-3 py-1.5 ${!hasMore ? 'cursor-not-allowed bg-lifewood-serpent/10 text-lifewood-serpent/40' : 'bg-lifewood-green text-white hover:bg-lifewood-green/90'}`}>Next</button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      <AdminProfileModal open={isProfileOpen} onClose={() => setIsProfileOpen(false)} profile={profile} adminGmail={adminGmail} authUserId={null} onSave={saveProfile} />

      <AnimatePresence>
        {modalApplicant && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }} className="fixed inset-0 z-[180] flex items-center justify-center bg-black/45 p-4" onClick={() => setModalApplicant(null)}>
            <motion.div initial={{ opacity: 0, y: 20, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 14, scale: 0.97 }} transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }} className="max-h-[90vh] w-full max-w-3xl flex flex-col rounded-3xl border border-lifewood-serpent/10 bg-white overflow-hidden" onClick={(e) => e.stopPropagation()}>

              {/* ── Modal Header ── */}
              <div className="flex shrink-0 items-center justify-between bg-lifewood-serpent px-5 py-4">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/50">Applicant Details</p>
                  <h3 className="mt-0.5 text-base font-bold text-white">{modalApplicant.firstName} {modalApplicant.lastName}</h3>
                </div>
                <button type="button" onClick={() => setModalApplicant(null)} className="rounded-lg border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-white/20">
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
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-lifewood-serpent">Update Applicant Status</p>
                        <div className="group relative flex items-center">
                          <button type="button" aria-label="Email notification info" className="flex h-4 w-4 items-center justify-center rounded-full border border-lifewood-serpent/30 text-[9px] font-bold text-lifewood-serpent/50 transition hover:border-lifewood-green hover:text-lifewood-green">i</button>
                          <div className="pointer-events-none absolute top-full right-0 z-50 mt-2 w-56 scale-95 rounded-xl border border-lifewood-serpent/10 bg-lifewood-serpent px-3 py-2 text-xs font-medium leading-snug text-white opacity-0 shadow-lg transition-all duration-150 group-hover:scale-100 group-hover:opacity-100">
                            Marking as hired or rejected will automatically notify the applicant via email.
                            <span className="absolute right-1.5 bottom-full border-4 border-transparent border-b-lifewood-serpent" />
                          </div>
                        </div>
                      </div>
                      <p className="mt-1 text-xs text-lifewood-serpent/60">Set the final decision for this applicant.</p>
                      <div className="mt-3 flex flex-col gap-2">
                        <button type="button" onClick={() => markAsHired(modalApplicant)} disabled={modalApplicant.statusName?.toLowerCase() === 'hired'} className={`rounded-xl px-3 py-2 text-xs font-semibold ${modalApplicant.statusName?.toLowerCase() === 'hired' ? 'cursor-not-allowed bg-lifewood-serpent/15 text-lifewood-serpent/50' : 'bg-lifewood-green text-white hover:bg-lifewood-green/90'}`}>Mark as Hired</button>
                        <button type="button" onClick={() => markAsRejected(modalApplicant)} disabled={modalApplicant.statusName?.toLowerCase() === 'rejected'} className={`rounded-xl px-3 py-2 text-xs font-semibold ${modalApplicant.statusName?.toLowerCase() === 'rejected' ? 'cursor-not-allowed bg-lifewood-serpent/15 text-lifewood-serpent/50' : 'bg-red-500 text-white hover:bg-red-600'}`}>Mark as Rejected</button>
                      </div>
                      <div className="mt-4 border-t border-lifewood-serpent/10 pt-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-lifewood-serpent/60">Email Templates</p>
                        <div className="mt-2 flex flex-col gap-2">
                          <button type="button" onClick={sendAIScreeningEmail} disabled={isEmailSending} className={`rounded-xl px-3 py-2 text-xs font-semibold ${isEmailSending ? 'cursor-not-allowed bg-lifewood-serpent/15 text-lifewood-serpent/50' : 'border border-lifewood-serpent/20 bg-lifewood-seaSalt text-lifewood-serpent hover:bg-lifewood-seaSalt/80'}`}>Email Applicant for AI Screening</button>
                        </div>
                      </div>
                    </div>
                    <div className="rounded-2xl border border-lifewood-serpent/10 bg-lifewood-seaSalt/60 p-4">
                      <p className="text-sm font-semibold text-lifewood-serpent">CV Upload</p>
                      <p className="mt-1 text-xs text-lifewood-serpent/70">{modalApplicant.cvPath ? 'Uploaded' : 'Not uploaded'}</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <button type="button" onClick={() => openCv(modalApplicant)} disabled={!modalApplicant.cvPath} className={`rounded-xl px-3 py-2 text-xs font-semibold ${modalApplicant.cvPath ? 'bg-lifewood-green text-white hover:bg-lifewood-green/90' : 'cursor-not-allowed bg-lifewood-serpent/15 text-lifewood-serpent/50'}`}>View CV</button>
                        <button type="button" onClick={() => downloadCv(modalApplicant)} disabled={!modalApplicant.cvPath} className={`rounded-xl px-3 py-2 text-xs font-semibold ${modalApplicant.cvPath ? 'bg-lifewood-serpent text-white hover:bg-lifewood-serpent/90' : 'cursor-not-allowed bg-lifewood-serpent/15 text-lifewood-serpent/50'}`}>Download CV</button>
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
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }} className="fixed inset-0 z-[180] flex items-center justify-center bg-black/45 p-4" onClick={closeDeleteModal}>
            <motion.div initial={{ opacity: 0, y: 16, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.97 }} transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }} className="w-full max-w-md rounded-2xl border border-lifewood-serpent/10 bg-white p-5" onClick={(e) => e.stopPropagation()}>
              <h4 className="text-lg font-bold text-lifewood-serpent">Confirm Delete</h4>
              <p className="mt-2 text-sm text-lifewood-serpent/70">{confirmDelete.mode === 'single' ? `Are you sure you want to delete ${confirmDelete.name}?` : `Are you sure you want to delete ${selectedIds.length} selected applicant(s)?`}</p>
              <div className="mt-4 flex justify-end gap-2">
                <button type="button" onClick={closeDeleteModal} className="rounded-xl border border-lifewood-serpent/15 px-3 py-2 text-xs font-semibold text-lifewood-serpent">Cancel</button>
                <button type="button" onClick={confirmDeleteAction} className="rounded-xl bg-red-500 px-3 py-2 text-xs font-semibold text-white hover:bg-red-600">Delete</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Toast toasts={toasts} onDismiss={dismissToast} />
    </section>
  );
};

export default AdminManageApplicants;
