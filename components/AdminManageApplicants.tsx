import React, { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  BookOpen,
  Calendar,
  ClipboardList,
  LayoutDashboard,
  LineChart,
  LogOut,
  Menu,
  NotebookPen,
  Trash2,
  UserCircle2,
  Users
} from 'lucide-react';
import { LOGO_URL } from '../constants';
import { AdminNotificationBell } from './AdminNotificationBell';
import { AdminProfileModal } from './AdminProfileModal';
import { useAdminProfile } from './adminProfile';
import { defaultInternRecords } from './AdminManageInterns';
import { defaultEmployeeRecords } from './AdminManageEmployees';
import {
  MANAGE_APPLICANTS_STORAGE_KEY,
  MANAGE_EMPLOYEES_STORAGE_KEY,
  MANAGE_INTERNS_STORAGE_KEY
} from './adminPeopleStorage';

interface AdminManageApplicantsProps {
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

type ApplicantRecord = {
  id: string;
  firstName: string;
  lastName: string;
  gender: string;
  age: number;
  phoneNumber: string;
  emailAddress: string;
  positionApplied: string;
  country: string;
  currentAddress: string;
  cvUrl: string;
  cvFileName: string;
  appliedDate: string;
  source: string;
  assessment: string;
  interview: string;
  availability: string;
  stage: string;
};

type InternRecord = (typeof defaultInternRecords)[number];
type EmployeeRecord = (typeof defaultEmployeeRecords)[number];

const applicantRecords: ApplicantRecord[] = [
  {
    id: 'applicant-maria',
    firstName: 'Maria Camille',
    lastName: 'Santos',
    gender: 'Female',
    age: 24,
    phoneNumber: '+63 917 000 1132',
    emailAddress: 'maria.santos@example.com',
    positionApplied: 'Image QA Intern',
    country: 'Philippines',
    currentAddress: 'Bajada, Davao City',
    cvUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    cvFileName: 'Maria_Camille_Santos_CV.pdf',
    appliedDate: 'Feb 18, 2026',
    source: 'Website Form',
    assessment: '91%',
    interview: 'Passed panel',
    availability: 'Immediate',
    stage: 'Offer ready'
  },
  {
    id: 'applicant-renz',
    firstName: 'Renz',
    lastName: 'Aquino',
    gender: 'Male',
    age: 22,
    phoneNumber: '+63 998 222 5104',
    emailAddress: 'renz.aquino@example.com',
    positionApplied: 'NLP Annotation Intern',
    country: 'Philippines',
    currentAddress: 'Mankilam, Tagum City',
    cvUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    cvFileName: 'Renz_Aquino_CV.pdf',
    appliedDate: 'Feb 17, 2026',
    source: 'Campus Partner',
    assessment: '84%',
    interview: 'Scheduled - Feb 24',
    availability: 'Within 2 weeks',
    stage: 'Interviewing'
  },
  {
    id: 'applicant-jean',
    firstName: 'Jean Paul',
    lastName: 'Natividad',
    gender: 'Male',
    age: 23,
    phoneNumber: '+63 905 444 2290',
    emailAddress: 'jean.natividad@example.com',
    positionApplied: 'Audio Tagging Intern',
    country: 'Philippines',
    currentAddress: 'Gredu, Panabo City',
    cvUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    cvFileName: 'Jean_Paul_Natividad_CV.pdf',
    appliedDate: 'Feb 16, 2026',
    source: 'Referral',
    assessment: '76%',
    interview: 'Pending invite',
    availability: 'Next month',
    stage: 'Screening'
  }
];

export const AdminManageApplicants: React.FC<AdminManageApplicantsProps> = ({ navigateTo }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { profile, setProfile, adminGmail } = useAdminProfile();
  const [isSelectMode, setIsSelectMode] = useState(false);
  const [applicants, setApplicants] = useState<ApplicantRecord[]>(() => {
    const saved = localStorage.getItem(MANAGE_APPLICANTS_STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved) as ApplicantRecord[];
      } catch {}
    }
    return applicantRecords;
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [modalApplicant, setModalApplicant] = useState<ApplicantRecord | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<{ mode: 'single' | 'selected'; id?: string; name?: string } | null>(null);
  const [assignmentNotice, setAssignmentNotice] = useState('');

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

  const confirmDeleteAction = () => {
    if (!confirmDelete) return;
    if (confirmDelete.mode === 'single' && confirmDelete.id) {
      setApplicants((prev) => prev.filter((applicant) => applicant.id !== confirmDelete.id));
      setSelectedIds((prev) => prev.filter((selectedId) => selectedId !== confirmDelete.id));
      setModalApplicant((prev) => (prev?.id === confirmDelete.id ? null : prev));
    } else if (confirmDelete.mode === 'selected') {
      setApplicants((prev) => prev.filter((applicant) => !selectedIds.includes(applicant.id)));
      setModalApplicant((prev) => (prev && selectedIds.includes(prev.id) ? null : prev));
      setSelectedIds([]);
    }
    setConfirmDelete(null);
    setIsSelectMode(false);
  };

  const closeDeleteModal = () => {
    setConfirmDelete(null);
    cancelSelection();
  };

  useEffect(() => {
    localStorage.setItem(MANAGE_APPLICANTS_STORAGE_KEY, JSON.stringify(applicants));
  }, [applicants]);

  const handleEditProfile = () => {
    setIsProfileOpen(true);
  };

  const toTrack = (positionApplied: string) => {
    const text = positionApplied.toLowerCase();
    if (text.includes('audio') || text.includes('speech')) return 'Speech Tagging';
    if (text.includes('image')) return 'Image QA';
    if (text.includes('nlp') || text.includes('text')) return 'Text Annotation';
    return 'General Operations';
  };

  const toTeam = (positionApplied: string) => {
    const text = positionApplied.toLowerCase();
    if (text.includes('audio') || text.includes('speech')) return 'Speech Programs';
    if (text.includes('image')) return 'Image QA';
    if (text.includes('nlp') || text.includes('text')) return 'NLP Annotation';
    return 'Operations';
  };

  const getEmployeeNumericId = (applicantId: string) => {
    const seed = applicantId.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
    return `${(seed % 900) + 100}`.padStart(3, '0');
  };

  const readStoredInterns = (): InternRecord[] => {
    const saved = localStorage.getItem(MANAGE_INTERNS_STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved) as InternRecord[];
      } catch {}
    }
    return [...defaultInternRecords];
  };

  const readStoredEmployees = (): EmployeeRecord[] => {
    const saved = localStorage.getItem(MANAGE_EMPLOYEES_STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved) as EmployeeRecord[];
      } catch {}
    }
    return [...defaultEmployeeRecords];
  };

  const removeApplicantFromPipeline = (applicantId: string) => {
    setApplicants((prev) => prev.filter((entry) => entry.id !== applicantId));
    setSelectedIds((prev) => prev.filter((selectedId) => selectedId !== applicantId));
    setModalApplicant((prev) => (prev?.id === applicantId ? null : prev));
  };

  const addAsIntern = (applicant: ApplicantRecord) => {
    const existingInterns = readStoredInterns();
    const internId = `intern-${applicant.id}`;

    if (existingInterns.some((entry) => entry.id === internId)) {
      setAssignmentNotice(`${applicant.firstName} ${applicant.lastName} is already in Manage Interns.`);
      return;
    }

    const internCandidate: InternRecord = {
      id: internId,
      name: `${applicant.firstName} ${applicant.lastName}`,
      firstName: applicant.firstName,
      lastName: applicant.lastName,
      email: applicant.emailAddress,
      gender: applicant.gender,
      age: applicant.age,
      school: 'Sample University',
      phoneNumber: applicant.phoneNumber,
      position: applicant.positionApplied,
      currentAddress: applicant.currentAddress,
      country: applicant.country,
      batch: 'Batch 09',
      track: toTrack(applicant.positionApplied),
      currentProject: `${applicant.positionApplied} Onboarding`,
      mentor: 'TBD',
      attendanceRate: '100%',
      quality: 'Pending review',
      status: 'Newly Added',
      notes: `Promoted from applicants (${applicant.appliedDate})`,
      trackHistory: [toTrack(applicant.positionApplied), 'Orientation & Compliance'],
      projectHistory: [
        {
          project: `${applicant.positionApplied} Onboarding`,
          mentor: 'TBD',
          period: 'Starting'
        }
      ],
      attendanceExceptions: []
    };

    localStorage.setItem(MANAGE_INTERNS_STORAGE_KEY, JSON.stringify([...existingInterns, internCandidate]));
    removeApplicantFromPipeline(applicant.id);
  };

  const addAsEmployee = (applicant: ApplicantRecord) => {
    const existingEmployees = readStoredEmployees();
    const employeeRecordId = `emp-${applicant.id}`;

    if (existingEmployees.some((entry) => entry.id === employeeRecordId)) {
      setAssignmentNotice(`${applicant.firstName} ${applicant.lastName} is already in Manage Employees.`);
      return;
    }

    const normalizedRole = applicant.positionApplied.replace(/\bIntern\b/i, 'Associate');
    const employeeCandidate: EmployeeRecord = {
      id: employeeRecordId,
      employeeId: `EMP-${getEmployeeNumericId(applicant.id)}`,
      name: `${applicant.firstName} ${applicant.lastName}`,
      firstName: applicant.firstName,
      lastName: applicant.lastName,
      email: applicant.emailAddress,
      gender: applicant.gender,
      age: applicant.age,
      school: 'Sample University',
      phoneNumber: applicant.phoneNumber,
      position: normalizedRole,
      currentAddress: applicant.currentAddress,
      country: applicant.country,
      role: normalizedRole,
      team: toTeam(applicant.positionApplied),
      certifications: 'Pending onboarding',
      workload: '0%',
      attendance: 'Pending check-in',
      currentFocus: 'Onboarding and initial training',
      status: 'New hire',
      roleHistory: [normalizedRole],
      projectHistory: [
        {
          project: 'Workforce Onboarding Program',
          supervisor: 'TBD',
          period: 'Starting'
        }
      ],
      attendanceExceptions: []
    };

    localStorage.setItem(MANAGE_EMPLOYEES_STORAGE_KEY, JSON.stringify([...existingEmployees, employeeCandidate]));
    removeApplicantFromPipeline(applicant.id);
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
              className="flex items-center gap-3 rounded-xl bg-lifewood-green px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-lifewood-green/30"
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
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-lifewood-green">Recruitment</p>
              <h1 className="mt-1 text-2xl font-black text-lifewood-serpent md:text-3xl">Manage Applicants</h1>
              <p className="mt-2 text-sm text-lifewood-serpent/65">
                Track pipeline stage, role preference, assessment score, and interview recommendations.
              </p>

              <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-2xl border border-lifewood-serpent/10 bg-lifewood-seaSalt p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.15em] text-lifewood-serpent/60">New Applications</p>
                  <p className="mt-2 text-3xl font-black text-lifewood-serpent">18</p>
                </div>
                <div className="rounded-2xl border border-lifewood-serpent/10 bg-lifewood-seaSalt p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.15em] text-lifewood-serpent/60">For Interview</p>
                  <p className="mt-2 text-3xl font-black text-lifewood-serpent">7</p>
                </div>
                <div className="rounded-2xl border border-lifewood-serpent/10 bg-lifewood-seaSalt p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.15em] text-lifewood-serpent/60">Offer Ready</p>
                  <p className="mt-2 text-3xl font-black text-lifewood-green">3</p>
                </div>
                <div className="rounded-2xl border border-lifewood-serpent/10 bg-lifewood-serpent p-4 text-white">
                  <p className="text-xs font-semibold uppercase tracking-[0.15em] text-white/65">Avg Turnaround</p>
                  <p className="mt-2 text-3xl font-black text-lifewood-yellow">4.2d</p>
                </div>
              </div>
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
              <div className="overflow-x-auto">
                <table className="w-full min-w-[980px] table-auto text-left">
                  <thead className="bg-lifewood-seaSalt/70">
                    <tr className="text-xs uppercase tracking-[0.14em] text-lifewood-serpent/55">
                      {isSelectMode && (
                        <th className="px-4 py-3">
                          <input type="checkbox" checked={areAllFilteredSelected} onChange={toggleSelectAll} />
                        </th>
                      )}
                      <th className="px-4 py-3">Applicant</th>
                      <th className="px-4 py-3">Position Applied</th>
                      <th className="px-4 py-3">Source</th>
                      <th className="px-4 py-3">Assessment</th>
                      <th className="px-4 py-3">Interview</th>
                      <th className="px-4 py-3">Availability</th>
                      <th className="px-4 py-3">Stage</th>
                      {isSelectMode && <th className="px-4 py-3">Actions</th>}
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
                        className="cursor-pointer border-t border-lifewood-serpent/10 transition odd:bg-white even:bg-lifewood-seaSalt/35 hover:bg-lifewood-seaSalt/60"
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
                          <p className="mt-1 text-xs font-medium text-lifewood-serpent/60">Applied: {applicant.appliedDate}</p>
                        </td>
                        <td className="px-4 py-4 text-lifewood-serpent">{applicant.positionApplied}</td>
                        <td className="px-4 py-4 text-lifewood-serpent">{applicant.source}</td>
                        <td className="px-4 py-4 font-semibold text-lifewood-green">{applicant.assessment}</td>
                        <td className="px-4 py-4 text-lifewood-serpent">{applicant.interview}</td>
                        <td className="px-4 py-4 text-lifewood-serpent">{applicant.availability}</td>
                        <td className="px-4 py-4"><span className="rounded-full bg-lifewood-green/10 px-2.5 py-1 text-xs font-semibold text-lifewood-green">{applicant.stage}</span></td>
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
                      </tr>
                    ))}
                  </tbody>
                </table>
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
          >
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 14, scale: 0.97 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl border border-lifewood-serpent/10 bg-white p-5"
            >
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-lg font-bold text-lifewood-serpent">Applicant Details: {modalApplicant.firstName} {modalApplicant.lastName}</h3>
              <button
                type="button"
                onClick={() => setModalApplicant(null)}
                className="rounded-lg border border-lifewood-serpent/15 px-3 py-1 text-xs font-semibold text-lifewood-serpent"
              >
                Close
              </button>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl bg-lifewood-seaSalt/60 p-3 text-sm text-lifewood-serpent"><span className="font-semibold">First Name:</span> {modalApplicant.firstName}</div>
              <div className="rounded-xl bg-lifewood-seaSalt/60 p-3 text-sm text-lifewood-serpent"><span className="font-semibold">Last Name:</span> {modalApplicant.lastName}</div>
              <div className="rounded-xl bg-lifewood-seaSalt/60 p-3 text-sm text-lifewood-serpent"><span className="font-semibold">Gender:</span> {modalApplicant.gender}</div>
              <div className="rounded-xl bg-lifewood-seaSalt/60 p-3 text-sm text-lifewood-serpent"><span className="font-semibold">Age:</span> {modalApplicant.age}</div>
              <div className="rounded-xl bg-lifewood-seaSalt/60 p-3 text-sm text-lifewood-serpent"><span className="font-semibold">Phone Number:</span> {modalApplicant.phoneNumber}</div>
              <div className="rounded-xl bg-lifewood-seaSalt/60 p-3 text-sm text-lifewood-serpent"><span className="font-semibold">Email Address:</span> {modalApplicant.emailAddress}</div>
              <div className="rounded-xl bg-lifewood-seaSalt/60 p-3 text-sm text-lifewood-serpent"><span className="font-semibold">Position Applied:</span> {modalApplicant.positionApplied}</div>
              <div className="rounded-xl bg-lifewood-seaSalt/60 p-3 text-sm text-lifewood-serpent"><span className="font-semibold">Country:</span> {modalApplicant.country}</div>
              <div className="rounded-xl bg-lifewood-seaSalt/60 p-3 text-sm text-lifewood-serpent sm:col-span-2"><span className="font-semibold">Current Address:</span> {modalApplicant.currentAddress}</div>
            </div>

            <div className="mt-4 rounded-2xl border border-lifewood-serpent/10 bg-lifewood-seaSalt/60 p-4">
              <p className="text-sm font-semibold text-lifewood-serpent">Uploaded CV</p>
              <p className="mt-1 text-xs text-lifewood-serpent/70">{modalApplicant.cvFileName}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <a
                  href={modalApplicant.cvUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-xl bg-lifewood-green px-3 py-2 text-xs font-bold text-white hover:bg-lifewood-green/90"
                >
                  View CV
                </a>
                <a
                  href={modalApplicant.cvUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-xl border border-lifewood-serpent/20 bg-white px-3 py-2 text-xs font-semibold text-lifewood-serpent hover:bg-lifewood-seaSalt"
                >
                  Download CV
                </a>
                <a
                  href={`mailto:${modalApplicant.emailAddress}?subject=Application Update - Lifewood`}
                  className="rounded-xl border border-lifewood-green/30 bg-lifewood-green/10 px-3 py-2 text-xs font-semibold text-lifewood-green hover:bg-lifewood-green/20"
                >
                  Email Applicant
                </a>
              </div>
            </div>

            <div className="mt-4 rounded-2xl border border-lifewood-serpent/10 bg-white p-4">
              <p className="text-sm font-semibold text-lifewood-serpent">Promote Applicant</p>
              <p className="mt-1 text-xs text-lifewood-serpent/60">
                Add this applicant directly to the corresponding management table.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => addAsIntern(modalApplicant)}
                  className="rounded-xl bg-lifewood-green px-3 py-2 text-xs font-bold text-white hover:bg-lifewood-green/90"
                >
                  Add as Intern
                </button>
                <button
                  type="button"
                  onClick={() => addAsEmployee(modalApplicant)}
                  className="rounded-xl border border-lifewood-serpent/20 bg-lifewood-seaSalt px-3 py-2 text-xs font-semibold text-lifewood-serpent hover:bg-lifewood-seaSalt/80"
                >
                  Add as Employee
                </button>
              </div>
              {assignmentNotice && <p className="mt-2 text-xs font-semibold text-lifewood-green">{assignmentNotice}</p>}
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
            transition={{ duration: 0.16 }}
            className="fixed inset-0 z-[190] flex items-center justify-center bg-black/45 p-4"
          >
            <motion.div
              initial={{ opacity: 0, y: 16, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.97 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="w-full max-w-md rounded-2xl border border-lifewood-serpent/10 bg-white p-5"
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


