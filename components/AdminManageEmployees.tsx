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
import {
  AttendanceRecord,
  AttendanceStatus,
  ATTENDANCE_STATUS_LEGEND,
  ATTENDANCE_STATUS_OPTIONS,
  getAttendanceCellClass,
  getAttendanceLabel,
  LegacyAttendanceException,
  mergeLegacyAttendanceRecords
} from './attendanceStatus';
import { MANAGE_EMPLOYEES_STORAGE_KEY } from './adminPeopleStorage';
import type { PageRoute } from '../routes/routeTypes';

interface AdminManageEmployeesProps {
  navigateTo?: (page: PageRoute) => void;
}

type EmployeeRecord = {
  id: string;
  employeeId: string;
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
  role: string;
  team: string;
  certifications: string;
  workload: string;
  attendance: string;
  currentFocus: string;
  status: string;
  roleHistory: string[];
  projectHistory: Array<{ project: string; supervisor: string; period: string }>;
  attendanceRecords: AttendanceRecord[];
};

type StoredEmployeeRecord = EmployeeRecord & { attendanceExceptions?: LegacyAttendanceException[] };

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

export const defaultEmployeeRecords: EmployeeRecord[] = [
  {
    id: 'emp-arianne',
    employeeId: 'EMP-204',
    name: 'Arianne Cruz',
    firstName: 'Arianne',
    lastName: 'Cruz',
    email: 'arianne.cruz@lifewood.example',
    gender: 'Female',
    age: 28,
    school: 'Ateneo de Davao University',
    phoneNumber: '+63 917 555 2040',
    position: 'Senior QA Lead',
    currentAddress: 'Agdao, Davao City',
    country: 'Philippines',
    role: 'Senior QA Lead',
    team: 'Image QA',
    certifications: 'ISO 9001, HIPAA',
    workload: '82%',
    attendance: '98%',
    currentFocus: 'Reviewer calibration rollout',
    status: 'Stable',
    roleHistory: ['QA Analyst', 'Senior QA Reviewer', 'Senior QA Lead'],
    projectHistory: [
      { project: 'Invoice OCR QA', supervisor: 'J. Mendoza', period: '2024 - 2025' },
      { project: 'Document Verification Program', supervisor: 'K. Fernandez', period: '2025 - Present' }
    ],
    attendanceRecords: [{ date: '2026-02-09', status: 'absent', reason: 'Approved medical leave' }]
  },
  {
    id: 'emp-marco',
    employeeId: 'EMP-193',
    name: 'Marco Navarro',
    firstName: 'Marco',
    lastName: 'Navarro',
    email: 'marco.navarro@lifewood.example',
    gender: 'Male',
    age: 31,
    school: 'University of Mindanao',
    phoneNumber: '+63 998 445 1933',
    position: 'Operations Supervisor',
    currentAddress: 'Catalunan Pequeno, Davao City',
    country: 'Philippines',
    role: 'Operations Supervisor',
    team: 'Speech Programs',
    certifications: 'GDPR, SOC 2',
    workload: '94%',
    attendance: '93%',
    currentFocus: 'Backlog reduction sprint',
    status: 'Near capacity',
    roleHistory: ['Team Coordinator', 'Operations Specialist', 'Operations Supervisor'],
    projectHistory: [
      { project: 'Voice Agent Tag Cleanup', supervisor: 'L. Rivera', period: '2024 - 2025' },
      { project: 'Call Intent Classification', supervisor: 'S. Ramos', period: '2025 - Present' }
    ],
    attendanceRecords: [
      { date: '2026-02-05', status: 'remote', reason: 'Field operations meeting' },
      { date: '2026-02-18', status: 'absent', reason: 'Approved personal leave' }
    ]
  },
  {
    id: 'emp-rica',
    employeeId: 'EMP-176',
    name: 'Rica Salazar',
    firstName: 'Rica',
    lastName: 'Salazar',
    email: 'rica.salazar@lifewood.example',
    gender: 'Female',
    age: 29,
    school: 'Holy Cross of Davao College',
    phoneNumber: '+63 905 661 1760',
    position: 'People Operations',
    currentAddress: 'Buhangin, Davao City',
    country: 'Philippines',
    role: 'People Operations',
    team: 'Workforce Admin',
    certifications: 'Labor Compliance',
    workload: '71%',
    attendance: '96%',
    currentFocus: 'Cycle onboarding and contracts',
    status: 'Balanced',
    roleHistory: ['HR Assistant', 'People Operations Associate', 'People Operations'],
    projectHistory: [
      { project: 'Internship Onboarding Revamp', supervisor: 'G. Lim', period: '2024 - 2025' },
      { project: 'Contract Compliance Tracking', supervisor: 'G. Lim', period: '2025 - Present' }
    ],
    attendanceRecords: [{ date: '2026-02-22', status: 'remote', reason: 'Government document processing' }]
  }
];

const hydrateEmployeeRecord = (record: StoredEmployeeRecord): EmployeeRecord => ({
  ...record,
  attendanceRecords: mergeLegacyAttendanceRecords(record.attendanceRecords, record.attendanceExceptions)
});

const readEmployeeRecordsFromStorage = (): EmployeeRecord[] => {
  if (typeof window === 'undefined') {
    return defaultEmployeeRecords.map((record) => hydrateEmployeeRecord(record));
  }
  const saved = localStorage.getItem(MANAGE_EMPLOYEES_STORAGE_KEY);
  if (saved) {
    try {
      const parsed = JSON.parse(saved) as StoredEmployeeRecord[];
      return parsed.map(hydrateEmployeeRecord);
    } catch {}
  }
  return defaultEmployeeRecords.map((record) => hydrateEmployeeRecord(record));
};

export const AdminManageEmployees: React.FC<AdminManageEmployeesProps> = ({ navigateTo }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { profile, setProfile, adminGmail, saveProfile } = useAdminProfile();
  const canEditCalendar =
    adminGmail.toLowerCase().includes('admin') || profile.role.toLowerCase().includes('admin');
  const [isSelectMode, setIsSelectMode] = useState(false);
  const [employees, setEmployees] = useState<EmployeeRecord[]>(() => readEmployeeRecordsFromStorage());
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [modalEmployee, setModalEmployee] = useState<EmployeeRecord | null>(null);
  const [calendarMonth, setCalendarMonth] = useState(new Date(2026, 1, 1));
  const [selectedCalendarDate, setSelectedCalendarDate] = useState<string | null>(null);
  const [calendarEditorStatus, setCalendarEditorStatus] = useState<AttendanceStatus>('present');
  const [calendarEditorReason, setCalendarEditorReason] = useState('');
  const [confirmDelete, setConfirmDelete] = useState<{ mode: 'single' | 'selected'; id?: string; name?: string } | null>(null);
  const [confirmSuspend, setConfirmSuspend] = useState<{ id: string; name: string; action: 'suspend' | 'reinstate' } | null>(null);

  const filteredEmployees = useMemo(
    () => employees.filter((employee) => employee.name.toLowerCase().includes(searchTerm.toLowerCase())),
    [employees, searchTerm]
  );

  const areAllFilteredSelected =
    filteredEmployees.length > 0 && filteredEmployees.every((employee) => selectedIds.includes(employee.id));

  const toggleSelectAll = () => {
    if (areAllFilteredSelected) {
      setSelectedIds((prev) => prev.filter((id) => !filteredEmployees.some((employee) => employee.id === id)));
      return;
    }
    setSelectedIds((prev) => Array.from(new Set([...prev, ...filteredEmployees.map((employee) => employee.id)])));
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
      setEmployees((prev) => prev.filter((employee) => employee.id !== confirmDelete.id));
      setSelectedIds((prev) => prev.filter((selectedId) => selectedId !== confirmDelete.id));
      setModalEmployee((prev) => (prev?.id === confirmDelete.id ? null : prev));
    } else if (confirmDelete.mode === 'selected') {
      setEmployees((prev) => prev.filter((employee) => !selectedIds.includes(employee.id)));
      setModalEmployee((prev) => (prev && selectedIds.includes(prev.id) ? null : prev));
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
    setEmployees((prev) =>
      prev.map((entry) => (entry.id === confirmSuspend.id ? { ...entry, status: nextStatus } : entry))
    );
    setModalEmployee((prev) => (prev?.id === confirmSuspend.id ? null : prev));
    setConfirmSuspend(null);
  };

  const closeSuspendModal = () => {
    setConfirmSuspend(null);
  };

  useEffect(() => {
    localStorage.setItem(MANAGE_EMPLOYEES_STORAGE_KEY, JSON.stringify(employees));
  }, [employees]);

  useEffect(() => {
    setSelectedCalendarDate(null);
    setCalendarEditorStatus('present');
    setCalendarEditorReason('');
  }, [modalEmployee]);

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

  const formatCalendarDateLabel = (iso: string) => {
    const [year, month, day] = iso.split('-').map((value) => Number(value));
    const parsedDate = new Date(year, month - 1, day);
    if (Number.isNaN(parsedDate.getTime())) return iso;
    return parsedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  };

  const handleCalendarDaySelect = (date: Date) => {
    if (!canEditCalendar || !modalEmployee) return;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const compareDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    if (compareDate.getTime() > today.getTime()) return;
    const iso = toIsoDate(date);
    const existingRecord = modalEmployee.attendanceRecords.find((entry) => entry.date === iso);
    setSelectedCalendarDate(iso);
    setCalendarEditorStatus(existingRecord?.status ?? 'present');
    setCalendarEditorReason(existingRecord?.reason ?? '');
  };

  const handleCalendarSave = () => {
    if (!modalEmployee || !selectedCalendarDate) return;
    const normalizedReason =
      calendarEditorStatus === 'present' ? undefined : calendarEditorReason.trim() || undefined;
    const targetId = modalEmployee.id;
    const nextRecords = (modalEmployee.attendanceRecords || [])
      .filter((entry) => entry.date !== selectedCalendarDate);
    if (calendarEditorStatus !== 'present') {
      nextRecords.push({
        date: selectedCalendarDate,
        status: calendarEditorStatus,
        reason: normalizedReason
      });
    }
    nextRecords.sort((a, b) => a.date.localeCompare(b.date));

    setEmployees((prev) =>
      prev.map((employee) => (employee.id === targetId ? { ...employee, attendanceRecords: nextRecords } : employee))
    );
    setModalEmployee((prev) =>
      prev && prev.id === targetId ? { ...prev, attendanceRecords: nextRecords } : prev
    );
    setCalendarEditorReason(normalizedReason ?? '');
  };

  const handleCalendarReset = () => {
    setSelectedCalendarDate(null);
    setCalendarEditorStatus('present');
    setCalendarEditorReason('');
  };

  const handleEditProfile = () => {
    setIsProfileOpen(true);
  };

  const suspendEmployee = (employee: EmployeeRecord) => {
    const isSuspended = employee.status.toLowerCase().includes('suspend');
    setConfirmSuspend({ id: employee.id, name: employee.name, action: isSuspended ? 'reinstate' : 'suspend' });
  };

  const modalEmployeeName = modalEmployee ? splitPersonName(modalEmployee.name) : { firstName: '', lastName: '' };

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
              className="flex items-center gap-3 rounded-xl bg-lifewood-green px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-lifewood-green/30"
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
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-lifewood-green">Workforce</p>
              <h1 className="mt-1 text-2xl font-black text-lifewood-serpent md:text-3xl">Manage Employees</h1>
              <p className="mt-2 text-sm text-lifewood-serpent/65">
                View team assignment, workload health, certification status, and attendance trends for employees.
              </p>

              <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-2xl border border-lifewood-serpent/10 bg-lifewood-seaSalt p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.15em] text-lifewood-serpent/60">Total Employees</p>
                  <p className="mt-2 text-3xl font-black text-lifewood-serpent">20</p>
                </div>
                <div className="rounded-2xl border border-lifewood-serpent/10 bg-lifewood-seaSalt p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.15em] text-lifewood-serpent/60">Team Leads</p>
                  <p className="mt-2 text-3xl font-black text-lifewood-serpent">4</p>
                </div>
                <div className="rounded-2xl border border-lifewood-serpent/10 bg-lifewood-seaSalt p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.15em] text-lifewood-serpent/60">Attendance (30d)</p>
                  <p className="mt-2 text-3xl font-black text-lifewood-green">95%</p>
                </div>
                <div className="rounded-2xl border border-lifewood-serpent/10 bg-lifewood-serpent p-4 text-white">
                  <p className="text-xs font-semibold uppercase tracking-[0.15em] text-white/65">High Workload Alerts</p>
                  <p className="mt-2 text-3xl font-black text-lifewood-yellow">2</p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-lifewood-serpent/10 bg-white p-5">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-lg font-bold text-lifewood-serpent">Employee Directory</h3>
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
                      className="inline-flex items-center gap-1 rounded-xl bg-rose-600 px-3 py-2 text-xs font-semibold text-white hover:bg-rose-700"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Fire Selected
                    </button>
                  )}
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[1080px] table-auto text-left">
                  <thead className="bg-lifewood-seaSalt/70">
                    <tr className="text-xs uppercase tracking-[0.14em] text-lifewood-serpent/55">
                      {isSelectMode && (
                        <th className="px-4 py-3">
                          <input type="checkbox" checked={areAllFilteredSelected} onChange={toggleSelectAll} />
                        </th>
                      )}
                      <th className="px-4 py-3">Employee</th>
                      <th className="px-4 py-3">Role</th>
                      <th className="px-4 py-3">Team</th>
                      <th className="px-4 py-3">Certifications</th>
                      <th className="px-4 py-3">Workload</th>
                      <th className="px-4 py-3">Attendance</th>
                      <th className="px-4 py-3">Current Focus</th>
                      <th className="px-4 py-3">Status</th>
                      {isSelectMode && <th className="px-4 py-3">Actions</th>}
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {filteredEmployees.map((employee) => (
                      <tr
                        key={employee.id}
                        onClick={() => setModalEmployee(employee)}
                        className="cursor-pointer border-t border-lifewood-serpent/10 transition odd:bg-white even:bg-lifewood-seaSalt/35 hover:bg-lifewood-seaSalt/60"
                      >
                        {isSelectMode && (
                          <td className="px-4 py-4" onClick={(e) => e.stopPropagation()}>
                            <input
                              type="checkbox"
                              checked={selectedIds.includes(employee.id)}
                              onChange={() => toggleSelectRow(employee.id)}
                            />
                          </td>
                        )}
                        <td className="px-4 py-4 font-semibold text-lifewood-serpent">
                          <p>{employee.name}</p>
                          <p className="mt-1 text-xs font-medium text-lifewood-serpent/60">Employee ID: {employee.employeeId}</p>
                        </td>
                        <td className="px-4 py-4 text-lifewood-serpent">{employee.role}</td>
                        <td className="px-4 py-4 text-lifewood-serpent">{employee.team}</td>
                        <td className="px-4 py-4 text-lifewood-serpent">{employee.certifications}</td>
                        <td className="px-4 py-4 text-lifewood-serpent">{employee.workload}</td>
                        <td className="px-4 py-4 text-lifewood-serpent">{employee.attendance}</td>
                        <td className="px-4 py-4 text-lifewood-serpent">{employee.currentFocus}</td>
                        <td className="px-4 py-4">
                          <span
                            className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                              employee.status.toLowerCase().includes('suspend')
                                ? 'bg-red-100 text-red-700'
                                : 'bg-lifewood-green/10 text-lifewood-green'
                            }`}
                          >
                            {employee.status}
                          </span>
                        </td>
                        {isSelectMode && (
                          <td className="px-4 py-4" onClick={(e) => e.stopPropagation()}>
                            <button
                              type="button"
                              onClick={() => deleteOne(employee.id, employee.name)}
                              className="inline-flex items-center gap-1 rounded-lg bg-rose-600 px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-rose-700"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                              Fire
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
        authUserId={null}
        onSave={saveProfile}
      />

      <AnimatePresence>
        {modalEmployee && (
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
              <h3 className="text-lg font-bold text-lifewood-serpent">Employee Details: {modalEmployee.name}</h3>
              <button
                type="button"
                onClick={() => setModalEmployee(null)}
                className="rounded-lg border border-lifewood-serpent/15 px-3 py-1 text-xs font-semibold text-lifewood-serpent"
              >
                Close
              </button>
            </div>
            <p className="mt-1 text-sm text-lifewood-serpent/65">
              Role progression, project and supervisor history, and attendance summary.
            </p>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl bg-lifewood-seaSalt/60 p-3 text-sm text-lifewood-serpent"><span className="font-semibold">First Name:</span> {normalizeOptionalText(modalEmployee.firstName) || normalizeOptionalText(modalEmployeeName.firstName) || 'Juan'}</div>
              <div className="rounded-xl bg-lifewood-seaSalt/60 p-3 text-sm text-lifewood-serpent"><span className="font-semibold">Last Name:</span> {normalizeOptionalText(modalEmployee.lastName) || normalizeOptionalText(modalEmployeeName.lastName) || 'Dela Cruz'}</div>
              <div className="rounded-xl bg-lifewood-seaSalt/60 p-3 text-sm text-lifewood-serpent"><span className="font-semibold">Email:</span> {normalizeOptionalText(modalEmployee.email) || 'employee@example.com'}</div>
              <div className="rounded-xl bg-lifewood-seaSalt/60 p-3 text-sm text-lifewood-serpent"><span className="font-semibold">Gender:</span> {normalizeOptionalText(modalEmployee.gender) || 'Not specified'}</div>
              <div className="rounded-xl bg-lifewood-seaSalt/60 p-3 text-sm text-lifewood-serpent"><span className="font-semibold">Age:</span> {typeof modalEmployee.age === 'number' ? modalEmployee.age : 25}</div>
              <div className="rounded-xl bg-lifewood-seaSalt/60 p-3 text-sm text-lifewood-serpent"><span className="font-semibold">School:</span> {normalizeOptionalText(modalEmployee.school) || 'Sample University'}</div>
              <div className="rounded-xl bg-lifewood-seaSalt/60 p-3 text-sm text-lifewood-serpent"><span className="font-semibold">Phone Number:</span> {normalizeOptionalText(modalEmployee.phoneNumber) || '+63 900 000 0000'}</div>
              <div className="rounded-xl bg-lifewood-seaSalt/60 p-3 text-sm text-lifewood-serpent"><span className="font-semibold">Position:</span> {normalizeOptionalText(modalEmployee.position) || normalizeOptionalText(modalEmployee.role) || 'Operations Associate'}</div>
              <div className="rounded-xl bg-lifewood-seaSalt/60 p-3 text-sm text-lifewood-serpent"><span className="font-semibold">Country:</span> {normalizeOptionalText(modalEmployee.country) || 'Philippines'}</div>
              <div className="rounded-xl bg-lifewood-seaSalt/60 p-3 text-sm text-lifewood-serpent sm:col-span-2"><span className="font-semibold">Current Address:</span> {normalizeOptionalText(modalEmployee.currentAddress) || 'Davao City'}</div>
            </div>

            <div className="mt-4 grid gap-4 lg:grid-cols-2">
              <div className="rounded-2xl border border-lifewood-serpent/10 bg-lifewood-seaSalt/60 p-4">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-lifewood-serpent/55">Role History</p>
                <ul className="mt-3 space-y-2 text-sm text-lifewood-serpent">
                  {modalEmployee.roleHistory.map((role) => (
                    <li key={role} className="rounded-lg bg-white px-3 py-2">{role}</li>
                  ))}
                </ul>
              </div>

              <div className="rounded-2xl border border-lifewood-serpent/10 bg-lifewood-seaSalt/60 p-4">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-lifewood-serpent/55">Project + Supervisor History</p>
                <div className="mt-3 space-y-2 text-sm">
                  {modalEmployee.projectHistory.map((entry) => (
                    <div key={`${entry.project}-${entry.period}`} className="rounded-lg bg-white px-3 py-2 text-lifewood-serpent">
                      <p className="font-semibold">{entry.project}</p>
                      <p className="text-xs text-lifewood-serpent/70">Supervisor: {entry.supervisor}</p>
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
                  <p className="text-center text-xs font-bold uppercase tracking-[0.14em] text-lifewood-serpent/55">
                    {monthLabel}
                  </p>
                  <button
                    type="button"
                    onClick={() => shiftCalendarMonth(1)}
                    className="rounded-md border border-lifewood-serpent/15 bg-white p-1.5 text-lifewood-serpent"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-xs text-lifewood-serpent/70">
                  {ATTENDANCE_STATUS_LEGEND.map((legend) => (
                    <span className="inline-flex items-center gap-1" key={legend.value}>
                      <span className={`h-3 w-3 rounded ${legend.legendClass}`}></span>
                      {legend.label}
                    </span>
                  ))}
                </div>
                <p className="mt-1 text-[10px] text-lifewood-serpent/60">Only today and past dates can be edited.</p>
              </div>
              <div className="mb-2 grid grid-cols-7 gap-2 text-center text-[10px] font-bold text-lifewood-serpent/55">
                {['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'].map((day) => (
                  <span key={day}>{day}</span>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-2 text-center">
                {calendarCells.map((date, idx) => {
                  if (!date) return <div key={`empty-employee-${idx}`} className="h-8 rounded-lg bg-transparent" />;
                  const iso = toIsoDate(date);
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  const compareDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
                  const isFuture = compareDate.getTime() > today.getTime();
                  const isWeekend = date.getDay() === 0 || date.getDay() === 6;
                  const attendanceRecord = modalEmployee.attendanceRecords.find((entry) => entry.date === iso);
                  const baseClass = attendanceRecord
                    ? getAttendanceCellClass(attendanceRecord.status)
                    : isWeekend || isFuture
                      ? 'bg-lifewood-serpent/10 text-lifewood-serpent/50'
                      : getAttendanceCellClass('present');
                  const selectedClass = selectedCalendarDate === iso ? ' ring-2 ring-lifewood-green/70 ring-offset-1 ring-offset-white/60' : '';
                  const titleLabel = attendanceRecord
                    ? `${getAttendanceLabel(attendanceRecord.status)}${attendanceRecord.reason ? `: ${attendanceRecord.reason}` : ''}`
                    : isWeekend
                      ? 'Weekend'
                      : isFuture
                        ? 'No record yet'
                        : 'Present';
                  return (
                    <div
                      key={`modal-employee-day-${iso}`}
                      title={titleLabel}
                    onClick={canEditCalendar && !isFuture ? () => handleCalendarDaySelect(date) : undefined}
                    className={`rounded-lg px-2 py-2 text-xs font-semibold ${baseClass} ${canEditCalendar && !isFuture ? 'cursor-pointer' : ''}${isFuture && canEditCalendar ? ' cursor-not-allowed' : ''}${selectedClass}`}
                    >
                      {date.getDate()}
                    </div>
                  );
                })}
              </div>
              {canEditCalendar && (
                <div className="mt-4 rounded-2xl border border-lifewood-serpent/10 bg-white/80 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-lifewood-serpent/55">Attendance edits</p>
                      <p className="text-[10px] text-lifewood-serpent/60">Only admins can adjust the calendar entries.</p>
                    </div>
                    <button
                      type="button"
                      onClick={handleCalendarReset}
                      className="rounded-xl border border-lifewood-serpent/15 px-3 py-1 text-xs font-semibold text-lifewood-serpent"
                    >
                      Clear selection
                    </button>
                  </div>
                  {selectedCalendarDate ? (
                    <div className="mt-3 space-y-3">
                      <p className="text-sm font-semibold text-lifewood-serpent">
                        Editing {formatCalendarDateLabel(selectedCalendarDate)}
                      </p>
                      <div className="grid gap-3 md:grid-cols-2">
                        <label className="text-xs font-semibold text-lifewood-serpent/60">
                          Status
                          <select
                            value={calendarEditorStatus}
                            onChange={(event) => setCalendarEditorStatus(event.target.value as AttendanceStatus)}
                            className="mt-2 w-full rounded-xl border border-lifewood-serpent/15 px-3 py-2 text-xs text-lifewood-serpent focus:border-lifewood-green focus:outline-none"
                          >
                            {ATTENDANCE_STATUS_OPTIONS.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </label>
                        <label className="text-xs font-semibold text-lifewood-serpent/60">
                          Reason
                          <input
                            type="text"
                            value={calendarEditorReason}
                            onChange={(event) => setCalendarEditorReason(event.target.value)}
                            placeholder="Optional note (e.g. left early, medical)"
                            disabled={calendarEditorStatus === 'present'}
                            className="mt-2 w-full rounded-xl border border-lifewood-serpent/15 px-3 py-2 text-xs text-lifewood-serpent/70 focus:border-lifewood-green focus:outline-none disabled:text-lifewood-serpent/40"
                          />
                          <span className="text-[10px] text-lifewood-serpent/60">
                            Provide a note when the status is not Present.
                          </span>
                        </label>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={handleCalendarSave}
                          className="rounded-xl bg-lifewood-green px-3 py-2 text-xs font-bold text-white hover:bg-lifewood-green/90 disabled:bg-lifewood-green/60"
                        >
                          Save to calendar
                        </button>
                        <button
                          type="button"
                          onClick={handleCalendarReset}
                          className="rounded-xl border border-lifewood-serpent/15 px-3 py-2 text-xs font-semibold text-lifewood-serpent"
                        >
                          Cancel edits
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="mt-3 text-xs text-lifewood-serpent/60">
                      Select a date to edit the attendance status or clear the selection.
                    </p>
                  )}
                </div>
              )}
            </div>

            <div className="mt-4 rounded-2xl border border-lifewood-serpent/10 bg-white p-4">
              <p className="text-sm font-semibold text-lifewood-serpent">Employee Actions</p>
              <p className="mt-1 text-xs text-lifewood-serpent/60">
                Suspend this employee and mark the status accordingly.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => suspendEmployee(modalEmployee)}
                  className={`rounded-xl px-3 py-2 text-xs font-semibold text-white ${
                    modalEmployee.status.toLowerCase().includes('suspend')
                      ? 'bg-lifewood-green hover:bg-lifewood-green/90'
                      : 'bg-red-700 hover:bg-red-800'
                  }`}
                >
                  {modalEmployee.status.toLowerCase().includes('suspend') ? 'Reinstate' : 'Suspend'}
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
            <h4 className="text-lg font-bold text-lifewood-serpent">Confirm Fire</h4>
            <p className="mt-2 text-sm text-lifewood-serpent/70">
              {confirmDelete.mode === 'single'
                ? `Are you sure you want to fire this employee (${confirmDelete.name})?`
                : `Are you sure you want to fire ${selectedIds.length} selected employee(s)?`}
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
                className="rounded-xl bg-rose-600 px-3 py-2 text-xs font-semibold text-white hover:bg-rose-700"
              >
                Fire
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

export default AdminManageEmployees;


