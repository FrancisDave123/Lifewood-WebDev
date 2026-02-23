import React, { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  BookOpen,
  Calendar,
  ChevronLeft,
  ChevronRight,
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
import { defaultEmployeeRecords } from './AdminManageEmployees';
import { MANAGE_EMPLOYEES_STORAGE_KEY, MANAGE_INTERNS_STORAGE_KEY } from './adminPeopleStorage';

interface AdminManageInternsProps {
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

type AttendanceException = {
  date: string;
  reason: string;
};

type InternRecord = {
  id: string;
  name: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  gender?: string;
  age?: number;
  school?: string;
  phoneNumber?: string;
  position?: string;
  currentAddress?: string;
  country?: string;
  batch: string;
  track: string;
  currentProject: string;
  mentor: string;
  attendanceRate: string;
  quality: string;
  status: string;
  notes: string;
  trackHistory: string[];
  projectHistory: Array<{ project: string; mentor: string; period: string }>;
  attendanceExceptions: AttendanceException[];
};

type EmployeeRecord = (typeof defaultEmployeeRecords)[number];

const splitPersonName = (fullName: string) => {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return { firstName: '', lastName: '' };
  if (parts.length === 1) return { firstName: parts[0], lastName: '' };
  return { firstName: parts.slice(0, -1).join(' '), lastName: parts[parts.length - 1] };
};

const normalizeOptionalText = (value?: string) => {
  const text = value?.trim();
  if (!text) return '';
  const normalized = text.toLowerCase();
  if (normalized === 'n/a' || normalized === 'na' || normalized === 'not provided') return '';
  return text;
};

export const defaultInternRecords: InternRecord[] = [
  {
    id: 'intern-justine',
    name: 'Justine Mhars Tacatani',
    firstName: 'Justine Mhars',
    lastName: 'Tacatani',
    email: 'justine.tacatani@lifewood.example',
    gender: 'Female',
    age: 23,
    school: 'University of Southeastern Philippines',
    phoneNumber: '+63 917 100 1101',
    position: 'Text Annotation Intern',
    currentAddress: 'J.P. Laurel Ave, Davao City',
    country: 'Philippines',
    batch: 'Batch 08',
    track: 'Text Annotation',
    currentProject: 'Healthcare Entity Labeling',
    mentor: 'A. Cruz',
    attendanceRate: '97%',
    quality: '98.1%',
    status: 'On track',
    notes: 'Candidate for lead-shadowing next cycle',
    trackHistory: ['Text Annotation Foundations', 'Medical NLP Entity Labeling', 'Quality Calibration Sprint'],
    projectHistory: [
      { project: 'Insurance Claims PII Redaction', mentor: 'A. Cruz', period: 'Nov 2025 - Dec 2025' },
      { project: 'Clinical NER Training Set', mentor: 'A. Cruz', period: 'Jan 2026 - Feb 2026' }
    ],
    attendanceExceptions: [
      { date: '2026-02-07', reason: 'Medical appointment' },
      { date: '2026-02-19', reason: 'Family emergency leave' }
    ]
  },
  {
    id: 'intern-darin',
    name: 'Darin Jan Antopina',
    firstName: 'Darin Jan',
    lastName: 'Antopina',
    email: 'darin.antopina@lifewood.example',
    gender: 'Male',
    age: 22,
    school: 'Tagum Doctors College',
    phoneNumber: '+63 905 331 1188',
    position: 'Speech Tagging Intern',
    currentAddress: 'Apokon, Tagum City',
    country: 'Philippines',
    batch: 'Batch 08',
    track: 'Speech Tagging',
    currentProject: 'Call Intent Classification',
    mentor: 'M. Navarro',
    attendanceRate: '93%',
    quality: '95.8%',
    status: 'Needs coaching',
    notes: 'Schedule QA calibration with mentor',
    trackHistory: ['Audio Preprocessing Basics', 'Speech Intent Labeling', 'Escalation and QA Review'],
    projectHistory: [
      { project: 'Voice Agent Tag Cleanup', mentor: 'M. Navarro', period: 'Nov 2025 - Jan 2026' },
      { project: 'Call Intent Classification', mentor: 'M. Navarro', period: 'Jan 2026 - Present' }
    ],
    attendanceExceptions: [
      { date: '2026-02-03', reason: 'Late transport disruption' },
      { date: '2026-02-14', reason: 'Flu symptoms (advised rest)' },
      { date: '2026-02-23', reason: 'Approved personal leave' }
    ]
  },
  {
    id: 'intern-francis',
    name: 'Francis Merc Mandado',
    firstName: 'Francis Merc',
    lastName: 'Mandado',
    email: 'francis.mandado@lifewood.example',
    gender: 'Male',
    age: 24,
    school: 'University of Mindanao',
    phoneNumber: '+63 998 441 2020',
    position: 'Image QA Intern',
    currentAddress: 'Lanang, Davao City',
    country: 'Philippines',
    batch: 'Batch 08',
    track: 'Image QA',
    currentProject: 'Document Verification',
    mentor: 'R. Salazar',
    attendanceRate: '99%',
    quality: '98.7%',
    status: 'Top performer',
    notes: 'Recommended for evaluator panel support',
    trackHistory: ['Image Annotation Basics', 'QA Defect Taxonomy', 'Senior Reviewer Shadow Track'],
    projectHistory: [
      { project: 'Invoice OCR QA', mentor: 'R. Salazar', period: 'Oct 2025 - Dec 2025' },
      { project: 'Document Verification', mentor: 'R. Salazar', period: 'Jan 2026 - Present' }
    ],
    attendanceExceptions: [{ date: '2026-02-12', reason: 'Approved half-day leave' }]
  }
];

export const AdminManageInterns: React.FC<AdminManageInternsProps> = ({ navigateTo }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { profile, setProfile, adminGmail } = useAdminProfile();
  const [isSelectMode, setIsSelectMode] = useState(false);
  const [interns, setInterns] = useState<InternRecord[]>(() => {
    const saved = localStorage.getItem(MANAGE_INTERNS_STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved) as InternRecord[];
      } catch {}
    }
    return defaultInternRecords;
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [modalIntern, setModalIntern] = useState<InternRecord | null>(null);
  const [calendarMonth, setCalendarMonth] = useState(new Date(2026, 1, 1));
  const [confirmDelete, setConfirmDelete] = useState<{ mode: 'single' | 'selected'; id?: string; name?: string } | null>(null);
  const [confirmSuspend, setConfirmSuspend] = useState<{ id: string; name: string; action: 'suspend' | 'reinstate' } | null>(null);

  const filteredInterns = useMemo(
    () => interns.filter((intern) => intern.name.toLowerCase().includes(searchTerm.toLowerCase())),
    [interns, searchTerm]
  );

  const areAllFilteredSelected =
    filteredInterns.length > 0 && filteredInterns.every((intern) => selectedIds.includes(intern.id));

  const toggleSelectAll = () => {
    if (areAllFilteredSelected) {
      setSelectedIds((prev) => prev.filter((id) => !filteredInterns.some((intern) => intern.id === id)));
      return;
    }
    setSelectedIds((prev) => Array.from(new Set([...prev, ...filteredInterns.map((intern) => intern.id)])));
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
      setInterns((prev) => prev.filter((intern) => intern.id !== confirmDelete.id));
      setSelectedIds((prev) => prev.filter((selectedId) => selectedId !== confirmDelete.id));
      setModalIntern((prev) => (prev?.id === confirmDelete.id ? null : prev));
    } else if (confirmDelete.mode === 'selected') {
      setInterns((prev) => prev.filter((intern) => !selectedIds.includes(intern.id)));
      setModalIntern((prev) => (prev && selectedIds.includes(prev.id) ? null : prev));
      setSelectedIds([]);
    }
    setConfirmDelete(null);
    setIsSelectMode(false);
  };

  const closeDeleteModal = () => {
    setConfirmDelete(null);
    cancelSelection();
  };

  const confirmSuspendAction = () => {
    if (!confirmSuspend) return;
    const nextStatus =
      confirmSuspend.action === 'suspend' ? 'Suspended until further notice' : 'Active';
    setInterns((prev) =>
      prev.map((entry) => (entry.id === confirmSuspend.id ? { ...entry, status: nextStatus } : entry))
    );
    setModalIntern((prev) => (prev?.id === confirmSuspend.id ? null : prev));
    setConfirmSuspend(null);
  };

  const closeSuspendModal = () => {
    setConfirmSuspend(null);
  };

  useEffect(() => {
    localStorage.setItem(MANAGE_INTERNS_STORAGE_KEY, JSON.stringify(interns));
  }, [interns]);

  const monthLabel = useMemo(
    () => calendarMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
    [calendarMonth]
  );

  const calendarCells = useMemo(() => {
    const y = calendarMonth.getFullYear();
    const m = calendarMonth.getMonth();
    const first = new Date(y, m, 1);
    const start = first.getDay();
    const total = new Date(y, m + 1, 0).getDate();
    const cells: Array<Date | null> = [];
    for (let i = 0; i < start; i++) cells.push(null);
    for (let day = 1; day <= total; day++) cells.push(new Date(y, m, day));
    while (cells.length < 42) cells.push(null);
    return cells;
  }, [calendarMonth]);

  const shiftCalendarMonth = (offset: number) => {
    setCalendarMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + offset, 1));
  };

  const toIsoDate = (date: Date) => {
    const y = date.getFullYear();
    const m = `${date.getMonth() + 1}`.padStart(2, '0');
    const d = `${date.getDate()}`.padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  const handleEditProfile = () => {
    setIsProfileOpen(true);
  };

  const toEmployeeRole = (track: string) => {
    const text = track.toLowerCase();
    if (text.includes('image')) return 'Image QA Associate';
    if (text.includes('speech') || text.includes('audio')) return 'Speech Operations Associate';
    if (text.includes('nlp') || text.includes('text')) return 'NLP Annotation Associate';
    return 'Operations Associate';
  };

  const toEmployeeTeam = (track: string) => {
    const text = track.toLowerCase();
    if (text.includes('image')) return 'Image QA';
    if (text.includes('speech') || text.includes('audio')) return 'Speech Programs';
    if (text.includes('nlp') || text.includes('text')) return 'NLP Annotation';
    return 'Operations';
  };

  const getEmployeeNumericId = (internId: string) => {
    const seed = internId.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
    return `${(seed % 900) + 100}`.padStart(3, '0');
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

  const promoteToEmployee = (intern: InternRecord) => {
    const existingEmployees = readStoredEmployees();
    const employeeRecordId = `emp-${intern.id.replace(/^intern-/, '')}`;
    const internName = splitPersonName(intern.name);

    if (existingEmployees.some((entry) => entry.id === employeeRecordId)) {
      setInterns((prev) => prev.filter((entry) => entry.id !== intern.id));
      setSelectedIds((prev) => prev.filter((selectedId) => selectedId !== intern.id));
      setModalIntern(null);
      return;
    }

    const convertedEmployee: EmployeeRecord = {
      id: employeeRecordId,
      employeeId: `EMP-${getEmployeeNumericId(intern.id)}`,
      name: intern.name,
      firstName: intern.firstName || internName.firstName,
      lastName: intern.lastName || internName.lastName,
      email: normalizeOptionalText(intern.email) || 'employee@lifewood.example',
      gender: normalizeOptionalText(intern.gender) || 'Not specified',
      age: intern.age,
      school: normalizeOptionalText(intern.school) || 'Sample University',
      phoneNumber: normalizeOptionalText(intern.phoneNumber) || '+63 900 000 0000',
      position: normalizeOptionalText(intern.position) || toEmployeeRole(intern.track),
      currentAddress: normalizeOptionalText(intern.currentAddress) || 'Davao City',
      country: normalizeOptionalText(intern.country) || 'Philippines',
      role: toEmployeeRole(intern.track),
      team: toEmployeeTeam(intern.track),
      certifications: 'Pending onboarding',
      workload: '0%',
      attendance: intern.attendanceRate || 'Pending',
      currentFocus: intern.currentProject || 'Transitioning from internship',
      status: 'New hire',
      roleHistory: [toEmployeeRole(intern.track)],
      projectHistory: [
        {
          project: intern.currentProject || 'Transitioning Project',
          supervisor: intern.mentor || 'TBD',
          period: 'Starting'
        }
      ],
      attendanceExceptions: intern.attendanceExceptions.map((entry) => ({
        date: entry.date,
        reason: entry.reason
      }))
    };

    localStorage.setItem(MANAGE_EMPLOYEES_STORAGE_KEY, JSON.stringify([...existingEmployees, convertedEmployee]));
    setInterns((prev) => prev.filter((entry) => entry.id !== intern.id));
    setSelectedIds((prev) => prev.filter((selectedId) => selectedId !== intern.id));
    setModalIntern(null);
  };

  const suspendIntern = (intern: InternRecord) => {
    const isSuspended = intern.status.toLowerCase().includes('suspend');
    setConfirmSuspend({ id: intern.id, name: intern.name, action: isSuspended ? 'reinstate' : 'suspend' });
  };

  const modalInternName = modalIntern ? splitPersonName(modalIntern.name) : { firstName: '', lastName: '' };

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
              className="flex items-center gap-3 rounded-xl bg-lifewood-green px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-lifewood-green/30"
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
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-lifewood-green">People Management</p>
              <h1 className="mt-1 text-2xl font-black text-lifewood-serpent md:text-3xl">Manage Interns</h1>
              <p className="mt-2 text-sm text-lifewood-serpent/65">
                Monitor cohort status, assigned mentors, attendance, and current project placement.
              </p>

              <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-2xl border border-lifewood-serpent/10 bg-lifewood-seaSalt p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.15em] text-lifewood-serpent/60">Active Interns</p>
                  <p className="mt-2 text-3xl font-black text-lifewood-serpent">31</p>
                </div>
                <div className="rounded-2xl border border-lifewood-serpent/10 bg-lifewood-seaSalt p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.15em] text-lifewood-serpent/60">Probation Watch</p>
                  <p className="mt-2 text-3xl font-black text-lifewood-serpent">3</p>
                </div>
                <div className="rounded-2xl border border-lifewood-serpent/10 bg-lifewood-seaSalt p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.15em] text-lifewood-serpent/60">Avg Attendance</p>
                  <p className="mt-2 text-3xl font-black text-lifewood-green">95%</p>
                </div>
                <div className="rounded-2xl border border-lifewood-serpent/10 bg-lifewood-serpent p-4 text-white">
                  <p className="text-xs font-semibold uppercase tracking-[0.15em] text-white/65">Mentor Coverage</p>
                  <p className="mt-2 text-3xl font-black text-lifewood-yellow">100%</p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-lifewood-serpent/10 bg-white p-5">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-lg font-bold text-lifewood-serpent">Intern Roster</h3>
                <Calendar className="h-5 w-5 text-lifewood-green" />
              </div>
              <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-2">
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
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[1020px] table-auto text-left">
                  <thead className="bg-lifewood-seaSalt/70">
                    <tr className="text-xs uppercase tracking-[0.14em] text-lifewood-serpent/55">
                      {isSelectMode && (
                        <th className="px-4 py-3">
                          <input type="checkbox" checked={areAllFilteredSelected} onChange={toggleSelectAll} />
                        </th>
                      )}
                      <th className="px-4 py-3">Intern</th>
                      <th className="px-4 py-3">Track</th>
                      <th className="px-4 py-3">Current Project</th>
                      <th className="px-4 py-3">Mentor</th>
                      <th className="px-4 py-3">Attendance</th>
                      <th className="px-4 py-3">Quality</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Notes</th>
                      {isSelectMode && <th className="px-4 py-3">Actions</th>}
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {filteredInterns.map((intern) => {
                      return (
                        <tr
                          key={intern.id}
                          onClick={() => setModalIntern(intern)}
                          className="cursor-pointer border-t border-lifewood-serpent/10 transition odd:bg-white even:bg-lifewood-seaSalt/35 hover:bg-lifewood-seaSalt/60"
                        >
                          {isSelectMode && (
                            <td className="px-4 py-4" onClick={(e) => e.stopPropagation()}>
                              <input
                                type="checkbox"
                                checked={selectedIds.includes(intern.id)}
                                onChange={() => toggleSelectRow(intern.id)}
                              />
                            </td>
                          )}
                          <td className="px-4 py-4 font-semibold text-lifewood-serpent">
                            <p>{intern.name}</p>
                            <p className="mt-1 text-xs font-medium text-lifewood-serpent/60">{intern.batch}</p>
                          </td>
                          <td className="px-4 py-4 text-lifewood-serpent">{intern.track}</td>
                          <td className="px-4 py-4 text-lifewood-serpent">{intern.currentProject}</td>
                          <td className="px-4 py-4 text-lifewood-serpent">{intern.mentor}</td>
                          <td className="px-4 py-4 text-lifewood-serpent">{intern.attendanceRate}</td>
                          <td className="px-4 py-4 font-semibold text-lifewood-green">{intern.quality}</td>
                          <td className="px-4 py-4">
                            <span
                              className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                                intern.status.toLowerCase().includes('suspend')
                                  ? 'bg-red-100 text-red-700'
                                  : 'bg-lifewood-green/10 text-lifewood-green'
                              }`}
                            >
                              {intern.status}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-lifewood-serpent/70">{intern.notes}</td>
                          {isSelectMode && (
                            <td className="px-4 py-4" onClick={(e) => e.stopPropagation()}>
                              <button
                                type="button"
                                onClick={() => deleteOne(intern.id, intern.name)}
                                className="inline-flex items-center gap-1 rounded-lg bg-red-500 px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-red-600"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                                Delete
                              </button>
                            </td>
                          )}
                        </tr>
                      );
                    })}
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
        {modalIntern && (
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
              className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-3xl border border-lifewood-serpent/10 bg-white p-5"
            >
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-lg font-bold text-lifewood-serpent">Intern Details: {modalIntern.name}</h3>
              <button
                type="button"
                onClick={() => setModalIntern(null)}
                className="rounded-lg border border-lifewood-serpent/15 px-3 py-1 text-xs font-semibold text-lifewood-serpent"
              >
                Close
              </button>
            </div>
            <p className="mt-1 text-sm text-lifewood-serpent/65">
              Track history, project history with mentor mapping, and attendance for the current month.
            </p>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl bg-lifewood-seaSalt/60 p-3 text-sm text-lifewood-serpent"><span className="font-semibold">Batch:</span> {modalIntern.batch || 'Batch 00'}</div>
              <div className="rounded-xl bg-lifewood-seaSalt/60 p-3 text-sm text-lifewood-serpent"><span className="font-semibold">First Name:</span> {normalizeOptionalText(modalIntern.firstName) || normalizeOptionalText(modalInternName.firstName) || 'Juan'}</div>
              <div className="rounded-xl bg-lifewood-seaSalt/60 p-3 text-sm text-lifewood-serpent"><span className="font-semibold">Last Name:</span> {normalizeOptionalText(modalIntern.lastName) || normalizeOptionalText(modalInternName.lastName) || 'Dela Cruz'}</div>
              <div className="rounded-xl bg-lifewood-seaSalt/60 p-3 text-sm text-lifewood-serpent"><span className="font-semibold">Email:</span> {normalizeOptionalText(modalIntern.email) || 'user@example.com'}</div>
              <div className="rounded-xl bg-lifewood-seaSalt/60 p-3 text-sm text-lifewood-serpent"><span className="font-semibold">Gender:</span> {normalizeOptionalText(modalIntern.gender) || 'Not specified'}</div>
              <div className="rounded-xl bg-lifewood-seaSalt/60 p-3 text-sm text-lifewood-serpent"><span className="font-semibold">Age:</span> {typeof modalIntern.age === 'number' ? modalIntern.age : 21}</div>
              <div className="rounded-xl bg-lifewood-seaSalt/60 p-3 text-sm text-lifewood-serpent"><span className="font-semibold">School:</span> {normalizeOptionalText(modalIntern.school) || 'Sample University'}</div>
              <div className="rounded-xl bg-lifewood-seaSalt/60 p-3 text-sm text-lifewood-serpent"><span className="font-semibold">Phone Number:</span> {normalizeOptionalText(modalIntern.phoneNumber) || '+63 900 000 0000'}</div>
              <div className="rounded-xl bg-lifewood-seaSalt/60 p-3 text-sm text-lifewood-serpent"><span className="font-semibold">Position:</span> {normalizeOptionalText(modalIntern.position) || `${modalIntern.track} Intern`}</div>
              <div className="rounded-xl bg-lifewood-seaSalt/60 p-3 text-sm text-lifewood-serpent"><span className="font-semibold">Country:</span> {normalizeOptionalText(modalIntern.country) || 'Philippines'}</div>
              <div className="rounded-xl bg-lifewood-seaSalt/60 p-3 text-sm text-lifewood-serpent sm:col-span-2"><span className="font-semibold">Current Address:</span> {normalizeOptionalText(modalIntern.currentAddress) || 'Davao City'}</div>
            </div>

            <div className="mt-4 grid gap-4 lg:grid-cols-2">
              <div className="rounded-2xl border border-lifewood-serpent/10 bg-lifewood-seaSalt/60 p-4">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-lifewood-serpent/55">Track History</p>
                <ul className="mt-3 space-y-2 text-sm text-lifewood-serpent">
                  {modalIntern.trackHistory.map((track) => (
                    <li key={track} className="rounded-lg bg-white px-3 py-2">{track}</li>
                  ))}
                </ul>
              </div>

              <div className="rounded-2xl border border-lifewood-serpent/10 bg-lifewood-seaSalt/60 p-4">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-lifewood-serpent/55">Project + Mentor History</p>
                <div className="mt-3 space-y-2 text-sm">
                  {modalIntern.projectHistory.map((entry) => (
                    <div key={`${entry.project}-${entry.period}`} className="rounded-lg bg-white px-3 py-2 text-lifewood-serpent">
                      <p className="font-semibold">{entry.project}</p>
                      <p className="text-xs text-lifewood-serpent/70">Mentor: {entry.mentor}</p>
                      <p className="text-xs text-lifewood-serpent/60">{entry.period}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

              <div className="mt-4 rounded-2xl border border-lifewood-serpent/10 bg-lifewood-seaSalt/60 p-4">
                <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                  <div className="grid w-[220px] grid-cols-[32px_1fr_32px] items-center gap-2">
                    <button
                      type="button"
                      onClick={() => shiftCalendarMonth(-1)}
                      className="rounded-md border border-lifewood-serpent/15 bg-white p-1.5 text-lifewood-serpent"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <p className="text-center text-xs font-bold uppercase tracking-[0.14em] text-lifewood-serpent/55">{monthLabel}</p>
                    <button
                      type="button"
                      onClick={() => shiftCalendarMonth(1)}
                      className="rounded-md border border-lifewood-serpent/15 bg-white p-1.5 text-lifewood-serpent"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-lifewood-serpent/70">
                    <span className="inline-flex items-center gap-1"><span className="h-3 w-3 rounded bg-lifewood-green/70"></span>Present</span>
                    <span className="inline-flex items-center gap-1"><span className="h-3 w-3 rounded bg-red-400/80"></span>Absent</span>
                  </div>
                </div>
              <div className="mb-2 grid grid-cols-7 gap-2 text-center text-[10px] font-bold text-lifewood-serpent/55">
                {['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'].map((day) => (
                  <span key={day}>{day}</span>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-2 text-center">
                {calendarCells.map((date, idx) => {
                  if (!date) {
                    return <div key={`empty-${idx}`} className="h-8 rounded-lg bg-transparent" />;
                  }
                  const iso = toIsoDate(date);
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  const compareDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
                  const isFuture = compareDate.getTime() > today.getTime();
                  const isWeekend = date.getDay() === 0 || date.getDay() === 6;
                  const absentEntry = modalIntern.attendanceExceptions.find((entry) => entry.date === iso);
                  const isAbsent = Boolean(absentEntry);
                  const dayClass = isWeekend
                    ? 'bg-lifewood-serpent/10 text-lifewood-serpent/50'
                    : isAbsent
                      ? 'bg-red-400/80 text-white'
                      : isFuture
                        ? 'bg-lifewood-serpent/10 text-lifewood-serpent/50'
                        : 'bg-lifewood-green/70 text-white';
                  return (
                    <div
                      key={`modal-day-${iso}`}
                      title={isWeekend ? 'No work day' : isAbsent ? `Absent: ${absentEntry?.reason}` : isFuture ? 'No record yet' : 'Present'}
                      className={`rounded-lg px-2 py-2 text-xs font-semibold ${dayClass}`}
                    >
                      {date.getDate()}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-4 rounded-2xl border border-lifewood-serpent/10 bg-white p-4">
              <p className="text-sm font-semibold text-lifewood-serpent">Intern Actions</p>
              <p className="mt-1 text-xs text-lifewood-serpent/60">
                Promote this intern to employee level or suspend intern access.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => promoteToEmployee(modalIntern)}
                  className="rounded-xl bg-lifewood-green px-3 py-2 text-xs font-bold text-white hover:bg-lifewood-green/90"
                >
                  Promote to Employee
                </button>
                <button
                  type="button"
                  onClick={() => suspendIntern(modalIntern)}
                  className={`rounded-xl px-3 py-2 text-xs font-semibold text-white ${
                    modalIntern.status.toLowerCase().includes('suspend')
                      ? 'bg-lifewood-green hover:bg-lifewood-green/90'
                      : 'bg-red-700 hover:bg-red-800'
                  }`}
                >
                  {modalIntern.status.toLowerCase().includes('suspend') ? 'Reinstate' : 'Suspend'}
                </button>
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
                : `Are you sure you want to delete ${selectedIds.length} selected intern(s)?`}
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
      <AnimatePresence>
        {confirmSuspend && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.16 }}
            className="fixed inset-0 z-[195] flex items-center justify-center bg-black/45 p-4"
          >
            <motion.div
              initial={{ opacity: 0, y: 16, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.97 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="w-full max-w-md rounded-2xl border border-lifewood-serpent/10 bg-white p-5"
            >
            <h4 className="text-lg font-bold text-lifewood-serpent">
              {confirmSuspend.action === 'suspend' ? 'Confirm Suspend' : 'Confirm Reinstate'}
            </h4>
            <p className="mt-2 text-sm text-lifewood-serpent/70">
              Are you sure you want to {confirmSuspend.action} {confirmSuspend.name}?
            </p>
            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={closeSuspendModal}
                className="rounded-xl border border-lifewood-serpent/15 px-3 py-2 text-xs font-semibold text-lifewood-serpent"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmSuspendAction}
                className={`rounded-xl px-3 py-2 text-xs font-semibold text-white ${
                  confirmSuspend.action === 'suspend'
                    ? 'bg-red-700 hover:bg-red-800'
                    : 'bg-lifewood-green hover:bg-lifewood-green/90'
                }`}
              >
                {confirmSuspend.action === 'suspend' ? 'Suspend' : 'Reinstate'}
              </button>
            </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default AdminManageInterns;


