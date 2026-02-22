import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowUpRight,
  BookOpen,
  Calendar,
  ClipboardList,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  LineChart,
  LogOut,
  NotebookPen,
  Menu,
  Pencil,
  PieChart,
  Plus,
  Sparkles,
  Target,
  Trash2,
  Users,
  UserCircle2,
  X
} from 'lucide-react';
import { LOGO_URL } from '../constants';
import { AdminNotificationBell } from './AdminNotificationBell';

interface AdminDashboardProps {
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

const days = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'];
const MAX_GOALS = 10;
const MAX_GOAL_CHARS = 100;

interface ProfileData {
  firstName: string;
  lastName: string;
  birthday: string;
  address: string;
  school: string;
  role: string;
  shortBio: string;
  avatarDataUrl: string;
}

type GoalDeleteIntent =
  | { mode: 'single'; goalId: string }
  | { mode: 'all' }
  | null;

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ navigateTo }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement | null>(null);
  const [calendarDate, setCalendarDate] = useState(() => new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isInlineEventFormOpen, setIsInlineEventFormOpen] = useState(false);
  const [eventTitle, setEventTitle] = useState('');
  const [eventType, setEventType] = useState<'event' | 'deadline' | 'appointment' | 'meeting'>('event');
  const [calendarEvents, setCalendarEvents] = useState<Array<{ id: string; title: string; type: 'event' | 'deadline' | 'appointment' | 'meeting'; date: string }>>([]);
  const [isGoalFormOpen, setIsGoalFormOpen] = useState(false);
  const [goalTitle, setGoalTitle] = useState('');
  const [adminGoals, setAdminGoals] = useState<Array<{ id: string; title: string }>>([]);
  const [goalDeleteIntent, setGoalDeleteIntent] = useState<GoalDeleteIntent>(null);
  const [profile, setProfile] = useState<ProfileData>({
    firstName: 'Admin',
    lastName: 'Admin',
    birthday: '',
    address: '',
    school: '',
    role: 'Internal Access',
    shortBio: '',
    avatarDataUrl: ''
  });
  const [profileDraft, setProfileDraft] = useState<ProfileData>({
    firstName: 'Admin',
    lastName: 'Admin',
    birthday: '',
    address: '',
    school: '',
    role: 'Internal Access',
    shortBio: '',
    avatarDataUrl: ''
  });
  const [profileError, setProfileError] = useState('');

  const monthLabel = useMemo(
    () => calendarDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
    [calendarDate]
  );

  const calendarCells = useMemo(() => {
    const year = calendarDate.getFullYear();
    const month = calendarDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const startWeekDay = firstDay.getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const cells: Array<{ date: Date; inCurrentMonth: boolean }> = [];

    for (let i = 0; i < startWeekDay; i++) {
      const date = new Date(year, month, -(startWeekDay - 1 - i));
      cells.push({ date, inCurrentMonth: false });
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      cells.push({ date, inCurrentMonth: true });
    }

    while (cells.length % 7 !== 0) {
      const nextDay = cells.length - (startWeekDay + daysInMonth) + 1;
      const date = new Date(year, month + 1, nextDay);
      cells.push({ date, inCurrentMonth: false });
    }

    return cells;
  }, [calendarDate]);

  const shiftMonth = (offset: number) => {
    setCalendarDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + offset, 1));
  };

  const toIsoDate = (date: Date) => {
    const y = date.getFullYear();
    const m = `${date.getMonth() + 1}`.padStart(2, '0');
    const d = `${date.getDate()}`.padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  const toDisplayDate = (iso: string) => {
    if (!iso) return 'Select date';
    const [y, m, d] = iso.split('-').map(Number);
    const date = new Date(y, (m || 1) - 1, d || 1);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  useEffect(() => {
    const savedEvents = localStorage.getItem('admin_dashboard_events');
    const savedGoals = localStorage.getItem('admin_dashboard_goals');
    const savedProfile = localStorage.getItem('admin_dashboard_profile');
    if (savedEvents) {
      setCalendarEvents(JSON.parse(savedEvents));
    }
    if (savedGoals) {
      const parsedGoals = JSON.parse(savedGoals) as Array<{ id?: string; title?: string }>;
      setAdminGoals(
        parsedGoals
          .map((goal, index) => ({
            id: goal.id || `legacy-goal-${index}`,
            title: goal.title || ''
          }))
          .filter((goal) => goal.title.trim())
      );
    } else {
      setAdminGoals([
        { id: 'g1', title: 'Review annotation QA for healthcare datasets' },
        { id: 'g2', title: 'Complete compliance checks for new language program' },
        { id: 'g3', title: 'Prepare leadership report for Monday sync' }
      ]);
    }

    if (savedProfile) {
      const parsedProfile = JSON.parse(savedProfile) as Partial<ProfileData>;
      setProfile((prev) => ({
        ...prev,
        ...parsedProfile
      }));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('admin_dashboard_events', JSON.stringify(calendarEvents));
  }, [calendarEvents]);

  useEffect(() => {
    localStorage.setItem('admin_dashboard_goals', JSON.stringify(adminGoals));
  }, [adminGoals]);

  useEffect(() => {
    localStorage.setItem('admin_dashboard_profile', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    if (!isProfileOpen) return;
    setProfileDraft(profile);
    setProfileError('');
  }, [isProfileOpen, profile]);

  const hasEventOnDate = (date: Date) => {
    const key = toIsoDate(date);
    return calendarEvents.some((entry) => entry.date === key);
  };

  const addCalendarEvent = () => {
    if (!eventTitle.trim() || !selectedDate) return;
    setCalendarEvents((prev) => [
      {
        id: `${Date.now()}`,
        title: eventTitle.trim(),
        type: eventType,
        date: toIsoDate(selectedDate)
      },
      ...prev
    ]);
    setEventTitle('');
    setEventType('event');
    setIsInlineEventFormOpen(false);
  };

  const addGoal = () => {
    const normalizedGoal = goalTitle.trim();
    if (!normalizedGoal || normalizedGoal.length > MAX_GOAL_CHARS || adminGoals.length >= MAX_GOALS) return;
    setAdminGoals((prev) => [
      { id: `${Date.now()}`, title: normalizedGoal },
      ...prev
    ]);
    setGoalTitle('');
    setIsGoalFormOpen(false);
  };

  const removeGoal = (goalId: string) => {
    setGoalDeleteIntent({ mode: 'single', goalId });
  };

  const clearAllGoals = () => {
    if (!adminGoals.length) return;
    setGoalDeleteIntent({ mode: 'all' });
  };

  const confirmGoalDelete = () => {
    if (!goalDeleteIntent) return;
    if (goalDeleteIntent.mode === 'all') {
      setAdminGoals([]);
      setIsGoalFormOpen(false);
      setGoalTitle('');
    } else {
      setAdminGoals((prev) => prev.filter((goal) => goal.id !== goalDeleteIntent.goalId));
    }
    setGoalDeleteIntent(null);
  };

  const cancelGoalDelete = () => {
    setGoalDeleteIntent(null);
  };

  const saveProfile = () => {
    if (!profileDraft.firstName.trim() || !profileDraft.lastName.trim()) {
      setProfileError('First name and last name are required.');
      return;
    }

    setProfile({
      ...profileDraft,
      firstName: profileDraft.firstName.trim(),
      lastName: profileDraft.lastName.trim(),
      role: profileDraft.role.trim() || 'Internal Access'
    });
    setProfileError('');
    setIsProfileOpen(false);
  };

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setProfileDraft((prev) => ({
        ...prev,
        avatarDataUrl: typeof reader.result === 'string' ? reader.result : prev.avatarDataUrl
      }));
    };
    reader.readAsDataURL(file);
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
              onClick={() => setIsSidebarOpen(false)}
              className="flex items-center gap-3 rounded-xl bg-lifewood-green px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-lifewood-green/30"
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

            <div className="rounded-3xl border border-lifewood-serpent/10 bg-white/90 p-4 shadow-[0_16px_50px_rgba(19,48,32,0.08)] md:p-5">
              <div className="mb-4 flex flex-col items-start justify-between gap-3 md:flex-row md:items-center">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-lifewood-green">Overview</p>
                  <h1 className="text-2xl font-black text-lifewood-serpent md:text-3xl">Admin Dashboard</h1>
                </div>
                <div className="inline-flex items-center gap-2 rounded-full border border-lifewood-serpent/10 bg-lifewood-seaSalt px-4 py-2 text-xs font-semibold text-lifewood-serpent">
                  <span className="h-2 w-2 rounded-full bg-lifewood-green"></span>
                  Spring Term 2026
                </div>
              </div>

              <div className="grid gap-4 xl:grid-cols-[1.7fr_1fr]">
                <div className="overflow-hidden rounded-[2rem] bg-lifewood-serpent p-6 text-white shadow-[0_20px_60px_rgba(4,98,65,0.3)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(4,98,65,0.38)]">
                  <div className="absolute"></div>
                  <p className="inline-flex items-center gap-2 rounded-full border border-lifewood-green/40 bg-lifewood-green/15 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.15em] text-lifewood-yellow">
                    <Sparkles className="h-3 w-3" />
                    In Progress
                  </p>
                  <h2 className="mt-5 max-w-lg text-2xl font-black leading-tight sm:text-3xl md:text-5xl">
                    Data Operations
                    <span className="text-lifewood-yellow"> Performance</span> Snapshot
                  </h2>
                  <p className="mt-3 max-w-xl text-sm text-white/70">
                    Real-time quality and delivery monitoring for enterprise AI workflows.
                  </p>
                  <div className="mt-6 flex flex-wrap items-center gap-3">
                    <button
                      onClick={() => navigateTo?.('admin-evaluation')}
                      className="inline-flex items-center gap-2 rounded-full bg-lifewood-green px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-lifewood-green/30 transition hover:-translate-y-0.5 hover:bg-lifewood-green/90"
                    >
                      Continue Review
                      <ArrowUpRight className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="mt-8 grid grid-cols-3 gap-2 sm:gap-4">
                    <div>
                      <div className="text-2xl font-black text-lifewood-yellow sm:text-3xl">82%</div>
                      <p className="text-[11px] uppercase tracking-[0.16em] text-white/50">Completion</p>
                    </div>
                    <div>
                      <div className="text-2xl font-black sm:text-3xl">14h</div>
                      <p className="text-[11px] uppercase tracking-[0.16em] text-white/50">Spent</p>
                    </div>
                    <div>
                      <div className="text-2xl font-black text-lifewood-saffron sm:text-3xl">A+</div>
                      <p className="text-[11px] uppercase tracking-[0.16em] text-white/50">Quality</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-[2rem] border border-lifewood-serpent/10 bg-lifewood-serpent p-5 text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_45px_rgba(4,98,65,0.32)]">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-lg font-bold">{monthLabel}</h3>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          if (!selectedDate) return;
                          setIsInlineEventFormOpen((prev) => !prev);
                        }}
                        disabled={!selectedDate}
                        className={`rounded-lg px-2.5 py-1 text-[11px] font-bold text-white transition ${
                          selectedDate
                            ? 'bg-lifewood-green/85 hover:bg-lifewood-green'
                            : 'cursor-not-allowed bg-white/15 text-white/45'
                        }`}
                      >
                        + Add
                      </button>
                      <button
                        type="button"
                        onClick={() => shiftMonth(-1)}
                        className="rounded-lg bg-white/10 p-1.5 transition hover:bg-white/20"
                        aria-label="Previous month"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => shiftMonth(1)}
                        className="rounded-lg bg-white/10 p-1.5 transition hover:bg-white/20"
                        aria-label="Next month"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-7 gap-2 text-center text-[10px] font-semibold tracking-[0.15em] text-white/50">
                    {days.map((day) => (
                      <span key={day}>{day}</span>
                    ))}
                  </div>
                  <div className="mt-2 grid grid-cols-7 gap-2">
                    {calendarCells.map(({ date, inCurrentMonth }) => (
                      <button
                        type="button"
                        key={date.toISOString()}
                        onClick={() => {
                          setSelectedDate(date);
                          setIsInlineEventFormOpen(true);
                        }}
                        className={`relative flex h-8 items-center justify-center rounded-lg text-sm font-semibold transition ${
                          selectedDate &&
                          date.toDateString() === selectedDate.toDateString()
                            ? 'bg-lifewood-green text-white'
                            : inCurrentMonth
                              ? 'text-white/85 hover:bg-white/10'
                              : 'text-white/35 hover:bg-white/5'
                        }`}
                      >
                        {date.getDate()}
                        {hasEventOnDate(date) && (
                          <span className="absolute top-1 right-1 h-1.5 w-1.5 rounded-full bg-lifewood-saffron" />
                        )}
                      </button>
                    ))}
                  </div>
                  <div className="mt-3 max-h-16 space-y-1 overflow-y-auto pr-1 text-[11px] text-white/75">
                    {calendarEvents.slice(0, 3).map((entry) => (
                      <p key={entry.id} className="truncate">
                        {toDisplayDate(entry.date)} - {entry.title} ({entry.type})
                      </p>
                    ))}
                  </div>
                  {isInlineEventFormOpen && selectedDate && (
                    <div className="mt-4 rounded-2xl border border-white/12 bg-white/5 p-3">
                      <div className="mb-3 flex items-center justify-between">
                        <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-lifewood-yellow">
                          Add Item for {toDisplayDate(toIsoDate(selectedDate))}
                        </p>
                        <button
                          type="button"
                          onClick={() => setIsInlineEventFormOpen(false)}
                          className="rounded-md bg-white/10 p-1 text-white/80 transition hover:bg-white/20"
                          aria-label="Close add item form"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <div className="space-y-2">
                        <input
                          type="text"
                          value={eventTitle}
                          onChange={(e) => setEventTitle(e.target.value)}
                          placeholder="Title"
                          className="w-full rounded-xl border border-white/20 bg-black/20 px-3 py-2 text-sm text-white placeholder:text-white/45 focus:border-lifewood-yellow focus:outline-none"
                        />
                        <select
                          value={eventType}
                          onChange={(e) => setEventType(e.target.value as 'event' | 'deadline' | 'appointment' | 'meeting')}
                          className="w-full rounded-xl border border-white/20 bg-black/20 px-3 py-2 text-sm text-white focus:border-lifewood-yellow focus:outline-none"
                        >
                          <option value="event">Event</option>
                          <option value="deadline">Deadline</option>
                          <option value="appointment">Appointment</option>
                          <option value="meeting">Meeting</option>
                        </select>
                        <div className="pt-1 text-right">
                          <button
                            type="button"
                            onClick={addCalendarEvent}
                            className="rounded-xl bg-lifewood-green px-4 py-2 text-xs font-bold text-white transition hover:bg-lifewood-green/90"
                          >
                            Save Item
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="grid gap-4 lg:grid-cols-[1.2fr_1fr_1fr]">
              <div
                onClick={() => navigateTo?.('admin-evaluation')}
                className="cursor-pointer rounded-3xl border border-lifewood-serpent/10 bg-white p-5 shadow-[0_14px_35px_rgba(19,48,32,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_45px_rgba(19,48,32,0.16)]"
              >
                <div className="mb-3 flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-lifewood-serpent">Activity</h3>
                    <p className="text-xs text-lifewood-serpent/50">Recent updates</p>
                  </div>
                  <button className="rounded-lg bg-lifewood-seaSalt p-2 text-lifewood-serpent/60">
                    <Calendar className="h-4 w-4" />
                  </button>
                </div>
                <div className="space-y-2">
                  <div className="rounded-2xl border border-lifewood-serpent/10 bg-lifewood-serpent p-3 text-white">
                    <p className="text-xs text-lifewood-yellow">98% Quiz Score</p>
                    <p className="font-semibold">React Hooks Evaluation</p>
                  </div>
                  <div className="rounded-2xl border border-lifewood-serpent/10 bg-lifewood-seaSalt p-3">
                    <p className="text-xs text-lifewood-serpent/60">Pipeline Health</p>
                    <p className="font-semibold text-lifewood-serpent">12 datasets validated today</p>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl bg-lifewood-green p-5 text-white shadow-[0_14px_35px_rgba(4,98,65,0.35)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_45px_rgba(4,98,65,0.4)]">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/70">Efficiency</p>
                <div className="mt-3 flex items-center justify-between">
                  <p className="text-5xl font-black">98%</p>
                  <CheckCircle2 className="h-6 w-6 text-lifewood-yellow" />
                </div>
                <p className="mt-3 text-sm text-white/80">4.1 task submissions this week</p>
              </div>

              <div className="rounded-3xl border border-lifewood-serpent/10 bg-lifewood-serpent p-5 text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_45px_rgba(19,48,32,0.26)]">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/50">Level</p>
                <p className="mt-3 text-5xl font-black">04</p>
                <p className="mt-2 text-sm text-white/70">Senior Intern</p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <div
                onClick={() => navigateTo?.('admin-manage-interns')}
                className="cursor-pointer rounded-3xl border border-lifewood-serpent/10 bg-white p-5 shadow-[0_14px_35px_rgba(19,48,32,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_45px_rgba(19,48,32,0.16)]"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-lifewood-serpent/55">Total Interns</p>
                    <p className="mt-2 text-4xl font-black text-lifewood-serpent">31</p>
                  </div>
                  <div className="rounded-xl bg-lifewood-green/10 p-2 text-lifewood-green">
                    <Users className="h-5 w-5" />
                  </div>
                </div>
                <p className="mt-3 text-xs text-lifewood-serpent/60">Active internship cohort</p>
              </div>

              <div
                onClick={() => navigateTo?.('admin-manage-employees')}
                className="cursor-pointer rounded-3xl border border-lifewood-serpent/10 bg-white p-5 shadow-[0_14px_35px_rgba(19,48,32,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_45px_rgba(19,48,32,0.16)]"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-lifewood-serpent/55">Employees Present</p>
                    <p className="mt-2 text-4xl font-black text-lifewood-serpent">19</p>
                  </div>
                  <div className="rounded-xl bg-lifewood-yellow/20 p-2 text-lifewood-serpent">
                    <ClipboardList className="h-5 w-5" />
                  </div>
                </div>
                <p className="mt-3 text-xs text-lifewood-serpent/60">Out of 20 scheduled today</p>
              </div>

              <div
                onClick={() => navigateTo?.('admin-manage-employees')}
                className="cursor-pointer rounded-3xl border border-lifewood-serpent/10 bg-white p-5 shadow-[0_14px_35px_rgba(19,48,32,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_45px_rgba(19,48,32,0.16)]"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-lifewood-serpent/55">On Leave</p>
                    <p className="mt-2 text-4xl font-black text-lifewood-serpent">1</p>
                  </div>
                  <div className="rounded-xl bg-lifewood-saffron/20 p-2 text-lifewood-serpent">
                    <Calendar className="h-5 w-5" />
                  </div>
                </div>
                <p className="mt-3 text-xs text-lifewood-serpent/60">Planned and approved leaves</p>
              </div>

              <div className="rounded-3xl border border-lifewood-serpent/10 bg-lifewood-serpent p-5 text-white shadow-[0_14px_35px_rgba(4,98,65,0.2)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_45px_rgba(4,98,65,0.3)]">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/60">Attendance Rate</p>
                    <p className="mt-2 text-4xl font-black text-lifewood-yellow">95%</p>
                  </div>
                  <div className="rounded-xl bg-white/10 p-2 text-lifewood-yellow">
                    <PieChart className="h-5 w-5" />
                  </div>
                </div>
                <p className="mt-3 text-xs text-white/70">Updated every 30 minutes</p>
              </div>
            </div>

            <div className="grid items-start gap-4 xl:grid-cols-[1fr_1.3fr]">
              <div className="self-start rounded-3xl border border-lifewood-serpent/10 bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(19,48,32,0.12)]">
                <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
                  <div className="flex items-center gap-3">
                    {profile.avatarDataUrl ? (
                      <img
                        src={profile.avatarDataUrl}
                        alt="Admin avatar"
                        className="h-12 w-12 rounded-full border border-lifewood-serpent/15 object-cover"
                      />
                    ) : (
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-lifewood-serpent text-white">
                        <UserCircle2 className="h-7 w-7" />
                      </div>
                    )}
                    <div>
                      <p className="font-semibold text-lifewood-serpent">
                        {profile.firstName} {profile.lastName}
                      </p>
                      <p className="text-xs text-lifewood-serpent/60">{profile.role || 'Internal Access'}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsProfileOpen(true)}
                    className="rounded-xl border border-lifewood-serpent/10 bg-lifewood-seaSalt px-3 py-2 text-xs font-semibold text-lifewood-serpent transition hover:border-lifewood-green/50 hover:text-lifewood-green"
                  >
                    Edit
                  </button>
                </div>
              </div>

              <div className="relative rounded-3xl border border-lifewood-serpent/10 bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(19,48,32,0.12)]">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-lg font-bold text-lifewood-serpent">Weekly Goals</h3>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={clearAllGoals}
                      disabled={!adminGoals.length}
                      className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-[11px] font-bold transition ${
                        adminGoals.length
                          ? 'bg-lifewood-saffron/20 text-lifewood-serpent hover:bg-lifewood-saffron/30'
                          : 'cursor-not-allowed bg-lifewood-serpent/10 text-lifewood-serpent/40'
                      }`}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Delete All
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsGoalFormOpen((prev) => !prev)}
                      disabled={adminGoals.length >= MAX_GOALS}
                      className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-[11px] font-bold text-white transition ${
                        adminGoals.length >= MAX_GOALS
                          ? 'cursor-not-allowed bg-lifewood-serpent/30 text-lifewood-serpent/55'
                          : 'bg-lifewood-green hover:bg-lifewood-green/90'
                      }`}
                    >
                      <Plus className="h-3.5 w-3.5" />
                      {isGoalFormOpen ? 'Close' : 'Add'}
                    </button>
                    <Target className="h-5 w-5 text-lifewood-green" />
                  </div>
                </div>
                <p className="mb-2 text-xs font-semibold text-lifewood-serpent/55">
                  {adminGoals.length}/{MAX_GOALS} goals used
                </p>
                <div className="space-y-2 text-sm">
                  {adminGoals.map((goal) => (
                    <div key={goal.id} className="flex items-start justify-between gap-3 rounded-xl bg-lifewood-seaSalt p-3 text-lifewood-serpent">
                      <p className="pr-2">{goal.title}</p>
                      <button
                        type="button"
                        onClick={() => removeGoal(goal.id)}
                        className="rounded-lg bg-lifewood-saffron/20 p-1.5 text-lifewood-serpent transition hover:bg-lifewood-saffron/30"
                        aria-label="Delete goal"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
                {isGoalFormOpen && (
                  <div className="mt-3 rounded-2xl border border-lifewood-serpent/12 bg-lifewood-seaSalt p-3">
                    <label className="block text-xs font-semibold uppercase tracking-[0.14em] text-lifewood-serpent/65">
                      Goal Description
                    </label>
                    <textarea
                      rows={3}
                      value={goalTitle}
                      maxLength={MAX_GOAL_CHARS}
                      onChange={(e) => setGoalTitle(e.target.value.slice(0, MAX_GOAL_CHARS))}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          addGoal();
                        }
                      }}
                      placeholder="Write your personal goal for this week..."
                      className="mt-2 w-full resize-none rounded-xl border border-lifewood-serpent/20 bg-white px-3 py-2 text-sm text-lifewood-serpent placeholder:text-lifewood-serpent/40 focus:border-lifewood-green/60 focus:outline-none"
                    />
                    <div className="mt-2 text-right">
                      <p className="mb-2 text-left text-[11px] font-semibold text-lifewood-serpent/55">
                        {goalTitle.length}/{MAX_GOAL_CHARS} characters
                      </p>
                      <button
                        type="button"
                        onClick={addGoal}
                        disabled={adminGoals.length >= MAX_GOALS || !goalTitle.trim() || goalTitle.trim().length > MAX_GOAL_CHARS}
                        className={`rounded-xl px-4 py-2 text-xs font-bold text-white transition ${
                          adminGoals.length >= MAX_GOALS || !goalTitle.trim() || goalTitle.trim().length > MAX_GOAL_CHARS
                            ? 'cursor-not-allowed bg-lifewood-serpent/30 text-lifewood-serpent/55'
                            : 'bg-lifewood-green hover:bg-lifewood-green/90'
                        }`}
                      >
                        Save Goal
                      </button>
                    </div>
                    {adminGoals.length >= MAX_GOALS && (
                      <p className="mt-2 text-xs font-semibold text-lifewood-saffron">
                        Goal limit reached. Remove older goals to add new ones.
                      </p>
                    )}
                  </div>
                )}
                {goalDeleteIntent && (
                  <div className="absolute inset-0 z-20 flex items-center justify-center rounded-3xl bg-white/75 p-4 backdrop-blur-[1px]">
                    <div className="w-full max-w-sm rounded-2xl border border-lifewood-serpent/15 bg-white p-4 shadow-[0_18px_35px_rgba(19,48,32,0.2)]">
                      <h4 className="text-sm font-bold text-lifewood-serpent">Delete Goal</h4>
                      <p className="mt-1 text-xs text-lifewood-serpent/70">
                        {goalDeleteIntent.mode === 'all'
                          ? 'Are you sure you want to delete all goals?'
                          : 'Are you sure you want to delete this goal?'}
                      </p>
                      <div className="mt-4 flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={cancelGoalDelete}
                          className="rounded-lg border border-lifewood-serpent/20 px-3 py-1.5 text-xs font-semibold text-lifewood-serpent transition hover:bg-lifewood-seaSalt"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={confirmGoalDelete}
                          className="rounded-lg bg-lifewood-saffron/25 px-3 py-1.5 text-xs font-bold text-lifewood-serpent transition hover:bg-lifewood-saffron/35"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>

      {isProfileOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/60 p-4 backdrop-blur-md">
          <div className="w-full max-w-xl rounded-3xl border border-white/20 bg-lifewood-serpent p-6 text-white shadow-[0_24px_60px_rgba(0,0,0,0.45)] animate-pop-out opacity-0">
            <div className="mb-5 flex items-start justify-between">
              <div>
                <h3 className="text-2xl font-black">Edit Profile</h3>
                <p className="text-sm text-white/60">Update your internal admin details</p>
              </div>
              <button
                onClick={() => setIsProfileOpen(false)}
                className="rounded-lg bg-white/10 p-2 text-white/80 transition hover:bg-white/20 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                saveProfile();
              }}
              className="grid gap-4 md:grid-cols-[140px_1fr]"
            >
              <div className="rounded-2xl border border-white/15 bg-white/5 p-4">
                {profileDraft.avatarDataUrl ? (
                  <img
                    src={profileDraft.avatarDataUrl}
                    alt="Profile preview"
                    className="mx-auto h-20 w-20 rounded-full border border-white/20 object-cover"
                  />
                ) : (
                  <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-lifewood-green/20">
                    <UserCircle2 className="h-10 w-10 text-lifewood-yellow" />
                  </div>
                )}
                <input
                  ref={avatarInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => avatarInputRef.current?.click()}
                  className="mx-auto mt-3 flex items-center gap-1 rounded-full bg-lifewood-green px-3 py-1 text-xs font-bold text-white"
                >
                  <Pencil className="h-3 w-3" />
                  Upload
                </button>
              </div>

              <div className="space-y-3">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-semibold text-white/70">First Name *</label>
                    <input
                      required
                      type="text"
                      value={profileDraft.firstName}
                      onChange={(e) => setProfileDraft((prev) => ({ ...prev, firstName: e.target.value }))}
                      className="mt-1 w-full rounded-xl border border-white/20 bg-black/20 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:border-lifewood-yellow focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-white/70">Last Name *</label>
                    <input
                      required
                      type="text"
                      value={profileDraft.lastName}
                      onChange={(e) => setProfileDraft((prev) => ({ ...prev, lastName: e.target.value }))}
                      className="mt-1 w-full rounded-xl border border-white/20 bg-black/20 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:border-lifewood-yellow focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-semibold text-white/70">Birthday (Optional)</label>
                    <input
                      type="date"
                      value={profileDraft.birthday}
                      onChange={(e) => setProfileDraft((prev) => ({ ...prev, birthday: e.target.value }))}
                      className="mt-1 w-full rounded-xl border border-white/20 bg-black/20 px-3 py-2 text-sm text-white focus:border-lifewood-yellow focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-white/70">Role (Optional)</label>
                    <input
                      type="text"
                      value={profileDraft.role}
                      onChange={(e) => setProfileDraft((prev) => ({ ...prev, role: e.target.value }))}
                      placeholder="Internal Access"
                      className="mt-1 w-full rounded-xl border border-white/20 bg-black/20 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:border-lifewood-yellow focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-white/70">Address (Optional)</label>
                  <input
                    type="text"
                    value={profileDraft.address}
                    onChange={(e) => setProfileDraft((prev) => ({ ...prev, address: e.target.value }))}
                    className="mt-1 w-full rounded-xl border border-white/20 bg-black/20 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:border-lifewood-yellow focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-white/70">School (Optional)</label>
                  <input
                    type="text"
                    value={profileDraft.school}
                    onChange={(e) => setProfileDraft((prev) => ({ ...prev, school: e.target.value }))}
                    className="mt-1 w-full rounded-xl border border-white/20 bg-black/20 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:border-lifewood-yellow focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-white/70">Short Bio (Optional)</label>
                  <textarea
                    rows={3}
                    value={profileDraft.shortBio}
                    onChange={(e) => setProfileDraft((prev) => ({ ...prev, shortBio: e.target.value }))}
                    className="mt-1 w-full resize-none rounded-xl border border-white/20 bg-black/20 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:border-lifewood-yellow focus:outline-none"
                  />
                </div>
                {profileError && <p className="text-xs font-semibold text-lifewood-saffron">{profileError}</p>}
                <div className="pt-2 text-right">
                  <button
                    type="submit"
                    className="w-full rounded-xl bg-lifewood-green px-6 py-2.5 text-sm font-bold text-white transition hover:bg-lifewood-green/90 sm:w-auto"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

    </section>
  );
};

export default AdminDashboard;
