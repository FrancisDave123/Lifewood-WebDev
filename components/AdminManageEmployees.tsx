import React, { useMemo, useState } from 'react';
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
  Settings,
  Trash2,
  UserCircle2,
  Users
} from 'lucide-react';
import { LOGO_URL } from '../constants';
import { AdminNotificationBell } from './AdminNotificationBell';

interface AdminManageEmployeesProps {
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

type EmployeeAttendanceException = {
  date: string;
  reason: string;
};

type EmployeeRecord = {
  id: string;
  employeeId: string;
  name: string;
  role: string;
  team: string;
  certifications: string;
  workload: string;
  attendance: string;
  currentFocus: string;
  status: string;
  roleHistory: string[];
  projectHistory: Array<{ project: string; supervisor: string; period: string }>;
  attendanceExceptions: EmployeeAttendanceException[];
};

const employeeRecords: EmployeeRecord[] = [
  {
    id: 'emp-arianne',
    employeeId: 'EMP-204',
    name: 'Arianne Cruz',
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
    attendanceExceptions: [{ date: '2026-02-09', reason: 'Approved medical leave' }]
  },
  {
    id: 'emp-marco',
    employeeId: 'EMP-193',
    name: 'Marco Navarro',
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
    attendanceExceptions: [
      { date: '2026-02-05', reason: 'Field operations meeting' },
      { date: '2026-02-18', reason: 'Approved personal leave' }
    ]
  },
  {
    id: 'emp-rica',
    employeeId: 'EMP-176',
    name: 'Rica Salazar',
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
    attendanceExceptions: [{ date: '2026-02-22', reason: 'Government document processing' }]
  }
];

export const AdminManageEmployees: React.FC<AdminManageEmployeesProps> = ({ navigateTo }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSelectMode, setIsSelectMode] = useState(false);
  const [employees, setEmployees] = useState(employeeRecords);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [modalEmployee, setModalEmployee] = useState<EmployeeRecord | null>(null);
  const [calendarMonth, setCalendarMonth] = useState(new Date(2026, 1, 1));
  const [confirmDelete, setConfirmDelete] = useState<{ mode: 'single' | 'selected'; id?: string; name?: string } | null>(null);

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
                        <td className="px-4 py-4"><span className="rounded-full bg-lifewood-green/10 px-2.5 py-1 text-xs font-semibold text-lifewood-green">{employee.status}</span></td>
                        {isSelectMode && (
                          <td className="px-4 py-4" onClick={(e) => e.stopPropagation()}>
                            <button
                              type="button"
                              onClick={() => deleteOne(employee.id, employee.name)}
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
      {modalEmployee && (
        <div className="fixed inset-0 z-[180] flex items-center justify-center bg-black/45 p-4">
          <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-3xl border border-lifewood-serpent/10 bg-white p-5 animate-pop-out opacity-0">
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
                  if (!date) return <div key={`empty-employee-${idx}`} className="h-8 rounded-lg bg-transparent" />;
                  const iso = toIsoDate(date);
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  const compareDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
                  const isFuture = compareDate.getTime() > today.getTime();
                  const isWeekend = date.getDay() === 0 || date.getDay() === 6;
                  const absentEntry = modalEmployee.attendanceExceptions.find((entry) => entry.date === iso);
                  const isAbsent = Boolean(absentEntry);
                  const dayClass = isAbsent
                    ? 'bg-red-400/80 text-white'
                    : isWeekend || isFuture
                      ? 'bg-lifewood-serpent/10 text-lifewood-serpent/50'
                      : 'bg-lifewood-green/70 text-white';
                  return (
                    <div
                      key={`modal-employee-day-${iso}`}
                      title={isAbsent ? `Absent: ${absentEntry?.reason}` : isWeekend ? 'No work day' : isFuture ? 'No record yet' : 'Present'}
                      className={`rounded-lg px-2 py-2 text-xs font-semibold ${dayClass}`}
                    >
                      {date.getDate()}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
      {confirmDelete && (
        <div className="fixed inset-0 z-[190] flex items-center justify-center bg-black/45 p-4">
          <div className="w-full max-w-md rounded-2xl border border-lifewood-serpent/10 bg-white p-5 animate-pop-out opacity-0">
            <h4 className="text-lg font-bold text-lifewood-serpent">Confirm Delete</h4>
            <p className="mt-2 text-sm text-lifewood-serpent/70">
              {confirmDelete.mode === 'single'
                ? `Are you sure you want to delete ${confirmDelete.name}?`
                : `Are you sure you want to delete ${selectedIds.length} selected employee(s)?`}
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
          </div>
        </div>
      )}
    </section>
  );
};

export default AdminManageEmployees;
