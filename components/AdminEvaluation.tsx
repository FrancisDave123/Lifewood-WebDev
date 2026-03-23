import React, { useMemo, useRef, useState } from 'react';
import {
  BookOpen,
  Calendar,
  CheckCircle2,
  ClipboardList,
  ChevronDown,
  LayoutDashboard,
  LineChart,
  Menu,
  NotebookPen,
  TrendingUp,
  Trash2,
  UserCircle2,
  Users
} from 'lucide-react';
import { AdminSidebar } from './AdminSidebar';
import { AdminProfileModal } from './AdminProfileModal';
import { useProfile } from './ProfileContext';
import type { PageRoute } from '../routes/routeTypes';

interface AdminEvaluationProps {
  navigateTo?: (page: PageRoute) => void;
}

type QueueActivity = {
  id: string;
  assignee: string;
  team: string;
  activity: string;
  submittedOn: string;
  dueDate: string;
  reviewer: string;
  status: string;
  priority: string;
  notes: string;
  projectDetails: string;
  milestones: string[];
};

const initialQueueActivities: QueueActivity[] = [
  {
    id: 'q-1',
    assignee: 'John Dominic Mumar Jr.',
    team: 'NLP Annotation',
    activity: 'Entity Labeling Quality Check',
    submittedOn: '2026-02-20',
    dueDate: '2026-02-24',
    reviewer: 'A. Cruz',
    status: 'Pending calibration',
    priority: 'High',
    notes: 'Pending final reviewer calibration',
    projectDetails: 'Healthcare dataset annotation cycle for symptom and diagnosis entities.',
    milestones: ['Self-review complete', 'Lead review pending', 'Final calibration pending']
  },
  {
    id: 'q-2',
    assignee: 'Gerard Luis Soriano',
    team: 'QA Validation',
    activity: 'Batch Defect Validation',
    submittedOn: '2026-02-19',
    dueDate: '2026-02-25',
    reviewer: 'R. Salazar',
    status: 'Awaiting sign-off',
    priority: 'Medium',
    notes: 'Awaiting supervisor sign-off',
    projectDetails: 'Validation pass for image QA defects and escalation mismatch handling.',
    milestones: ['Checklist complete', 'Supervisor review pending']
  },
  {
    id: 'q-3',
    assignee: 'DJ Jholmer Damayo',
    team: 'Audio Tagging',
    activity: 'Intent Bucket Reconciliation',
    submittedOn: '2026-02-21',
    dueDate: '2026-02-26',
    reviewer: 'M. Navarro',
    status: 'Pending reviewer',
    priority: 'Low',
    notes: 'Self-assessment submitted',
    projectDetails: 'Audio call labeling reconciliation for edge-case intent groups.',
    milestones: ['Self-assessment submitted', 'Reviewer assignment complete', 'Final action pending']
  }
];

export const AdminEvaluation: React.FC<AdminEvaluationProps> = ({ navigateTo }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { profile, adminGmail, saveProfile } = useProfile();
  const [isQueueView, setIsQueueView] = useState(false);
  const [isSelectMode, setIsSelectMode] = useState(false);
  const [queueItems, setQueueItems] = useState<QueueActivity[]>(initialQueueActivities);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [activityModal, setActivityModal] = useState<QueueActivity | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<{ mode: 'single' | 'selected'; id?: string; name?: string } | null>(null);
  const [isQueueTransitioning, setIsQueueTransitioning] = useState(false);
  const [queueTransitionDirection, setQueueTransitionDirection] = useState<'enter' | 'exit' | null>(null);
  const [queueTransitionStyle, setQueueTransitionStyle] = useState<React.CSSProperties | null>(null);
  const [queueOriginRect, setQueueOriginRect] = useState<{ top: number; left: number; width: number; height: number } | null>(null);
  const queueCardRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);

  const filteredQueue = useMemo(
    () => queueItems.filter((item) => item.assignee.toLowerCase().includes(searchTerm.toLowerCase())),
    [queueItems, searchTerm]
  );

  const areAllFilteredSelected =
    filteredQueue.length > 0 && filteredQueue.every((item) => selectedIds.includes(item.id));

  const toggleSelectAll = () => {
    if (areAllFilteredSelected) {
      setSelectedIds((prev) => prev.filter((id) => !filteredQueue.some((item) => item.id === id)));
      return;
    }
    setSelectedIds((prev) => Array.from(new Set([...prev, ...filteredQueue.map((item) => item.id)])));
  };

  const toggleSelectRow = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((selectedId) => selectedId !== id) : [...prev, id]));
  };

  const deleteOne = (id: string, name: string) => setConfirmDelete({ mode: 'single', id, name });
  const deleteSelected = () => selectedIds.length && setConfirmDelete({ mode: 'selected' });

  const cancelSelection = () => {
    setIsSelectMode(false);
    setSelectedIds([]);
  };

  const confirmDeleteAction = () => {
    if (!confirmDelete) return;
    if (confirmDelete.mode === 'single' && confirmDelete.id) {
      setQueueItems((prev) => prev.filter((item) => item.id !== confirmDelete.id));
      setSelectedIds((prev) => prev.filter((selectedId) => selectedId !== confirmDelete.id));
      setActivityModal((prev) => (prev?.id === confirmDelete.id ? null : prev));
    } else {
      setQueueItems((prev) => prev.filter((item) => !selectedIds.includes(item.id)));
      setActivityModal((prev) => (prev && selectedIds.includes(prev.id) ? null : prev));
      setSelectedIds([]);
    }
    setConfirmDelete(null);
    setIsSelectMode(false);
  };

  const closeDeleteModal = () => {
    setConfirmDelete(null);
    cancelSelection();
  };

  const startQueueEnterTransition = () => {
    if (!queueCardRef.current || !contentRef.current) {
      setIsQueueView(true);
      return;
    }
    const fromRect = queueCardRef.current.getBoundingClientRect();
    const toRect = contentRef.current.getBoundingClientRect();
    setQueueOriginRect({ top: fromRect.top, left: fromRect.left, width: fromRect.width, height: fromRect.height });
    setQueueTransitionDirection('enter');
    setIsQueueTransitioning(true);
    setQueueTransitionStyle({
      top: fromRect.top,
      left: fromRect.left,
      width: fromRect.width,
      height: fromRect.height,
      borderRadius: 24,
      opacity: 1
    });
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setQueueTransitionStyle({
          top: toRect.top,
          left: toRect.left,
          width: toRect.width,
          height: toRect.height,
          borderRadius: 24,
          opacity: 1
        });
      });
    });
  };

  const startQueueExitTransition = () => {
    if (!queueOriginRect || !contentRef.current) {
      setIsQueueView(false);
      return;
    }
    const fromRect = contentRef.current.getBoundingClientRect();
    setQueueTransitionDirection('exit');
    setIsQueueTransitioning(true);
    setQueueTransitionStyle({
      top: fromRect.top,
      left: fromRect.left,
      width: fromRect.width,
      height: fromRect.height,
      borderRadius: 24,
      opacity: 1
    });
    // Show overview immediately beneath the animated layer so it feels like closing a sheet.
    setIsQueueView(false);
    cancelSelection();
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setQueueTransitionStyle({
          top: queueOriginRect.top,
          left: queueOriginRect.left,
          width: queueOriginRect.width,
          height: queueOriginRect.height,
          borderRadius: 24,
          opacity: 1
        });
      });
    });
  };

  const handleQueueTransitionEnd = () => {
    if (queueTransitionDirection === 'enter') {
      setIsQueueView(true);
    }
    setIsQueueTransitioning(false);
    setQueueTransitionDirection(null);
    setQueueTransitionStyle(null);
  };

  const handleEditProfile = () => {
    setIsSidebarOpen(false);
    setIsProfileOpen(true);
  };

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
      label: 'Analytics',
      icon: LineChart,
      onClick: () => {
        setIsSidebarOpen(false);
        navigateTo?.('admin-analytics');
      }
    },
    {
      label: 'Evaluation',
      icon: NotebookPen,
      active: true,
      onClick: () => setIsSidebarOpen(false)
    },
    {
      label: 'Reports',
      icon: BookOpen,
      onClick: () => {
        setIsSidebarOpen(false);
        navigateTo?.('admin-reports');
      }
    },
    {
      label: 'Manage Interns',
      icon: Users,
      onClick: () => {
        setIsSidebarOpen(false);
        navigateTo?.('admin-manage-interns');
      }
    },
    {
      label: 'Manage Applicants',
      icon: ClipboardList,
      onClick: () => {
        setIsSidebarOpen(false);
        navigateTo?.('admin-manage-applicants');
      }
    },
    {
      label: 'Manage Employees',
      icon: UserCircle2,
      onClick: () => {
        setIsSidebarOpen(false);
        navigateTo?.('admin-manage-employees');
      }
    }
  ];

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
          profileRole={profile.role || 'Internal Access'}
          avatarSrc={profile.avatarUrl}
          items={sidebarItems}
        />

        <main className="relative flex-1 overflow-hidden p-4 md:p-6 animate-pop-out opacity-0 lg:h-screen lg:overflow-y-auto">
          <div
            ref={contentRef}
            className={`relative z-10 mx-auto max-w-6xl space-y-5 transition-opacity duration-150 ${
              isQueueTransitioning && queueTransitionDirection === 'enter'
                ? 'opacity-0 pointer-events-none select-none'
                : 'opacity-100'
            }`}
          >
            <div className="flex items-center justify-between rounded-2xl border border-lifewood-serpent/10 bg-white p-3 lg:hidden">
              <button type="button" onClick={() => setIsSidebarOpen(true)} className="inline-flex items-center gap-2 rounded-xl bg-lifewood-serpent px-3 py-2 text-xs font-bold uppercase tracking-[0.14em] text-white"><Menu className="h-4 w-4" />Menu</button>
              <button type="button" onClick={() => navigateTo?.('signin')} className="rounded-xl border border-lifewood-serpent/15 px-3 py-2 text-xs font-semibold text-lifewood-serpent">Sign out</button>
            </div>

            <div className="space-y-5">
            {isQueueView ? (
              <>
                <div className="rounded-3xl border border-lifewood-serpent/10 bg-white p-5 shadow-[0_16px_50px_rgba(19,48,32,0.08)]">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.2em] text-lifewood-green">Evaluation</p>
                      <h1 className="text-2xl font-black text-lifewood-serpent md:text-3xl">Queued Activities</h1>
                    </div>
                    <button type="button" onClick={startQueueExitTransition} className="rounded-xl border border-lifewood-serpent/15 bg-lifewood-seaSalt px-3 py-2 text-xs font-semibold text-lifewood-serpent">Back to Overview</button>
                  </div>
                </div>

                <div className="rounded-3xl border border-lifewood-serpent/10 bg-white p-5">
                  <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search by name..." className="min-w-[220px] rounded-xl border border-lifewood-serpent/15 px-3 py-2 text-sm text-lifewood-serpent focus:border-lifewood-green focus:outline-none" />
                      {!isSelectMode && <button type="button" onClick={() => { setIsSelectMode(true); setSelectedIds([]); }} className="rounded-xl border border-lifewood-serpent/15 bg-lifewood-seaSalt px-3 py-2 text-xs font-semibold text-lifewood-serpent">Select</button>}
                      {isSelectMode && <button type="button" onClick={toggleSelectAll} className="rounded-xl border border-lifewood-serpent/15 bg-lifewood-seaSalt px-3 py-2 text-xs font-semibold text-lifewood-serpent">{areAllFilteredSelected ? 'Unselect All' : 'Select All'}</button>}
                      {isSelectMode && <button type="button" onClick={cancelSelection} className="rounded-xl border border-lifewood-serpent/15 bg-white px-3 py-2 text-xs font-semibold text-lifewood-serpent">Cancel</button>}
                      {isSelectMode && selectedIds.length > 0 && <button type="button" onClick={deleteSelected} className="inline-flex items-center gap-1 rounded-xl bg-red-500 px-3 py-2 text-xs font-semibold text-white hover:bg-red-600"><Trash2 className="h-3.5 w-3.5" />Delete Selected</button>}
                    </div>
                    <button type="button" className="rounded-xl border border-lifewood-serpent/15 bg-white px-3 py-2 text-xs font-semibold text-lifewood-serpent">Add</button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[1120px] table-auto text-left">
                      <thead className="bg-lifewood-seaSalt/70">
                        <tr className="text-xs uppercase tracking-[0.14em] text-lifewood-serpent/55">
                          {isSelectMode && <th className="px-4 py-3"><input type="checkbox" checked={areAllFilteredSelected} onChange={toggleSelectAll} /></th>}
                          <th className="px-4 py-3">Assignee</th>
                          <th className="px-4 py-3">Team</th>
                          <th className="px-4 py-3">Activity</th>
                          <th className="px-4 py-3">Submitted</th>
                          <th className="px-4 py-3">Due</th>
                          <th className="px-4 py-3">Reviewer</th>
                          <th className="px-4 py-3">Priority</th>
                          <th className="px-4 py-3">Status</th>
                          {isSelectMode && <th className="px-4 py-3">Actions</th>}
                        </tr>
                      </thead>
                      <tbody className="text-sm">
                        {filteredQueue.map((item) => (
                          <tr key={item.id} onClick={() => setActivityModal(item)} className="cursor-pointer border-t border-lifewood-serpent/10 transition odd:bg-white even:bg-lifewood-seaSalt/35 hover:bg-lifewood-seaSalt/60">
                            {isSelectMode && <td className="px-4 py-4" onClick={(e) => e.stopPropagation()}><input type="checkbox" checked={selectedIds.includes(item.id)} onChange={() => toggleSelectRow(item.id)} /></td>}
                            <td className="px-4 py-4 font-semibold text-lifewood-serpent">{item.assignee}</td>
                            <td className="px-4 py-4 text-lifewood-serpent">{item.team}</td>
                            <td className="px-4 py-4 text-lifewood-serpent">{item.activity}</td>
                            <td className="px-4 py-4 text-lifewood-serpent">{item.submittedOn}</td>
                            <td className="px-4 py-4 text-lifewood-serpent">{item.dueDate}</td>
                            <td className="px-4 py-4 text-lifewood-serpent">{item.reviewer}</td>
                            <td className="px-4 py-4 text-lifewood-serpent">{item.priority}</td>
                            <td className="px-4 py-4"><span className="rounded-full bg-lifewood-yellow/20 px-2.5 py-1 text-xs font-semibold text-lifewood-serpent">{item.status}</span></td>
                            {isSelectMode && <td className="px-4 py-4" onClick={(e) => e.stopPropagation()}><button type="button" onClick={() => deleteOne(item.id, item.assignee)} className="inline-flex items-center gap-1 rounded-lg bg-red-500 px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-red-600"><Trash2 className="h-3.5 w-3.5" />Delete</button></td>}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="rounded-3xl border border-lifewood-serpent/10 bg-white p-5 shadow-[0_16px_50px_rgba(19,48,32,0.08)]">
                  <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.2em] text-lifewood-green">Evaluation</p>
                      <h1 className="text-2xl font-black text-lifewood-serpent md:text-3xl">Performance Assessment</h1>
                    </div>
                    <button className="inline-flex items-center gap-2 rounded-xl border border-lifewood-serpent/10 bg-lifewood-seaSalt px-3 py-2 text-xs font-semibold text-lifewood-serpent">Current Cycle<ChevronDown className="h-4 w-4" /></button>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    <div className="rounded-2xl border border-lifewood-serpent/10 bg-lifewood-seaSalt p-4"><p className="text-xs font-semibold uppercase tracking-[0.15em] text-lifewood-serpent/60">Average Score</p><p className="mt-2 text-3xl font-black text-lifewood-serpent">97.8</p><p className="text-xs text-lifewood-serpent/60">Across completed assessments</p></div>
                    <div className="rounded-2xl border border-lifewood-serpent/10 bg-lifewood-seaSalt p-4"><p className="text-xs font-semibold uppercase tracking-[0.15em] text-lifewood-serpent/60">Evaluated</p><p className="mt-2 text-3xl font-black text-lifewood-serpent">29</p><p className="text-xs text-lifewood-serpent/60">Assessed in current cycle</p></div>
                    <div className="rounded-2xl border border-lifewood-serpent/10 bg-lifewood-seaSalt p-4"><p className="text-xs font-semibold uppercase tracking-[0.15em] text-lifewood-serpent/60">Pending Review</p><p className="mt-2 text-3xl font-black text-lifewood-serpent">2</p><p className="text-xs text-lifewood-serpent/60">Awaiting final reviewer action</p></div>
                    <div className="rounded-2xl border border-lifewood-serpent/10 bg-lifewood-serpent p-4 text-white"><p className="text-xs font-semibold uppercase tracking-[0.15em] text-white/65">Highest Score</p><p className="mt-2 text-3xl font-black text-lifewood-yellow">98.7</p><p className="text-xs text-white/70">Top score this cycle</p></div>
                  </div>
                </div>

                <div className="grid gap-4">
                  <div ref={queueCardRef} onClick={startQueueEnterTransition} className="cursor-pointer rounded-3xl border border-lifewood-serpent/10 bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-[0_20px_45px_rgba(19,48,32,0.16)]">
                    <div className="mb-4 flex items-center justify-between"><h3 className="text-lg font-bold text-lifewood-serpent">Evaluation Queue</h3><Calendar className="h-5 w-5 text-lifewood-green" /></div>
                    <div className="space-y-2 text-sm">
                      <div className="rounded-xl border border-lifewood-serpent/10 bg-lifewood-seaSalt p-3"><p className="font-semibold text-lifewood-serpent">John Dominic Mumar Jr. - NLP Annotation</p><p className="text-xs text-lifewood-serpent/60">Pending final reviewer calibration</p></div>
                      <div className="rounded-xl border border-lifewood-serpent/10 bg-lifewood-seaSalt p-3"><p className="font-semibold text-lifewood-serpent">Gerard Luis Soriano - QA Validation</p><p className="text-xs text-lifewood-serpent/60">Awaiting supervisor sign-off</p></div>
                      <div className="rounded-xl border border-lifewood-serpent/10 bg-lifewood-seaSalt p-3"><p className="font-semibold text-lifewood-serpent">DJ Jholmer Damayo - Audio Tagging</p><p className="text-xs text-lifewood-serpent/60">Self-assessment submitted</p></div>
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 xl:grid-cols-[1.25fr_1fr]">
                  <div className="rounded-3xl border border-lifewood-serpent/10 bg-white p-5">
                    <div className="mb-4 flex items-center justify-between"><h3 className="text-lg font-bold text-lifewood-serpent">Top Performers (This Cycle)</h3><TrendingUp className="h-5 w-5 text-lifewood-green" /></div>
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[520px] text-left">
                        <thead><tr className="text-xs uppercase tracking-[0.14em] text-lifewood-serpent/55"><th className="pb-3">Name</th><th className="pb-3">Team</th><th className="pb-3">Score</th><th className="pb-3">Status</th></tr></thead>
                        <tbody className="text-sm">
                          <tr className="border-t border-lifewood-serpent/10"><td className="py-3 font-semibold text-lifewood-serpent">Francis Merc Mandado</td><td className="py-3 text-lifewood-serpent">Image QA</td><td className="py-3 text-lifewood-green">98.7</td><td className="py-3 text-lifewood-serpent">Promote Track</td></tr>
                          <tr className="border-t border-lifewood-serpent/10"><td className="py-3 font-semibold text-lifewood-serpent">Justine Mhars Tacatani</td><td className="py-3 text-lifewood-serpent">Text Annotation</td><td className="py-3 text-lifewood-green">97.9</td><td className="py-3 text-lifewood-serpent">Promote Track</td></tr>
                          <tr className="border-t border-lifewood-serpent/10"><td className="py-3 font-semibold text-lifewood-serpent">Darin Jan Antopina</td><td className="py-3 text-lifewood-serpent">Speech Tagging</td><td className="py-3 text-lifewood-green">96.8</td><td className="py-3 text-lifewood-serpent">Stable</td></tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div className="rounded-3xl border border-lifewood-serpent/10 bg-white p-5">
                    <div className="mb-4 flex items-center justify-between"><h3 className="text-lg font-bold text-lifewood-serpent">Cycle Health</h3><Users className="h-5 w-5 text-lifewood-green" /></div>
                    <div className="space-y-2 text-sm">
                      <div className="rounded-xl bg-lifewood-seaSalt p-3 text-lifewood-serpent">2 interns pending final review before cycle close.</div>
                      <div className="rounded-xl bg-lifewood-seaSalt p-3 text-lifewood-serpent">5 interns flagged for additional coaching sessions.</div>
                      <div className="rounded-xl bg-lifewood-seaSalt p-3 text-lifewood-serpent">Reviewer consistency improved by 4.3% vs previous cycle.</div>
                      <div className="rounded-xl border border-lifewood-green/20 bg-lifewood-green/5 p-3 text-lifewood-serpent"><span className="inline-flex items-center gap-2 font-semibold"><CheckCircle2 className="h-4 w-4 text-lifewood-green" />Overall evaluation readiness: Good</span></div>
                    </div>
                  </div>
                </div>
              </>
            )}
            </div>
          </div>
        </main>
      </div>

      <AdminProfileModal
        open={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        profile={profile}
        adminGmail={adminGmail}
        authUserId={null}      // ← new: from useAdminProfile()
        onSave={saveProfile}         // ← new: async DB save, not setProfile
      />

      {activityModal && (
        <div className="fixed inset-0 z-[180] flex items-center justify-center bg-black/45 p-4">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl border border-lifewood-serpent/10 bg-white p-5 animate-pop-out opacity-0">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-lg font-bold text-lifewood-serpent">Activity Details: {activityModal.assignee}</h3>
              <button type="button" onClick={() => setActivityModal(null)} className="rounded-lg border border-lifewood-serpent/15 px-3 py-1 text-xs font-semibold text-lifewood-serpent">Close</button>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl bg-lifewood-seaSalt/60 p-3 text-sm text-lifewood-serpent"><span className="font-semibold">Assignee:</span> {activityModal.assignee}</div>
              <div className="rounded-xl bg-lifewood-seaSalt/60 p-3 text-sm text-lifewood-serpent"><span className="font-semibold">Team:</span> {activityModal.team}</div>
              <div className="rounded-xl bg-lifewood-seaSalt/60 p-3 text-sm text-lifewood-serpent"><span className="font-semibold">Activity:</span> {activityModal.activity}</div>
              <div className="rounded-xl bg-lifewood-seaSalt/60 p-3 text-sm text-lifewood-serpent"><span className="font-semibold">Reviewer:</span> {activityModal.reviewer}</div>
              <div className="rounded-xl bg-lifewood-seaSalt/60 p-3 text-sm text-lifewood-serpent"><span className="font-semibold">Submitted On:</span> {activityModal.submittedOn}</div>
              <div className="rounded-xl bg-lifewood-seaSalt/60 p-3 text-sm text-lifewood-serpent"><span className="font-semibold">Due Date:</span> {activityModal.dueDate}</div>
              <div className="rounded-xl bg-lifewood-seaSalt/60 p-3 text-sm text-lifewood-serpent"><span className="font-semibold">Priority:</span> {activityModal.priority}</div>
              <div className="rounded-xl bg-lifewood-seaSalt/60 p-3 text-sm text-lifewood-serpent"><span className="font-semibold">Status:</span> {activityModal.status}</div>
              <div className="rounded-xl bg-lifewood-seaSalt/60 p-3 text-sm text-lifewood-serpent sm:col-span-2"><span className="font-semibold">Project Details:</span> {activityModal.projectDetails}</div>
              <div className="rounded-xl bg-lifewood-seaSalt/60 p-3 text-sm text-lifewood-serpent sm:col-span-2"><span className="font-semibold">Notes:</span> {activityModal.notes}</div>
            </div>
            <div className="mt-4 rounded-2xl border border-lifewood-serpent/10 bg-lifewood-seaSalt/60 p-4">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-lifewood-serpent/55">Milestones</p>
              <ul className="mt-2 space-y-2 text-sm text-lifewood-serpent">
                {activityModal.milestones.map((item) => (
                  <li key={item} className="rounded-lg bg-white px-3 py-2">{item}</li>
                ))}
              </ul>
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
                : `Are you sure you want to delete ${selectedIds.length} selected queued activity(ies)?`}
            </p>
            <div className="mt-4 flex justify-end gap-2">
              <button type="button" onClick={closeDeleteModal} className="rounded-xl border border-lifewood-serpent/15 px-3 py-2 text-xs font-semibold text-lifewood-serpent">Cancel</button>
              <button type="button" onClick={confirmDeleteAction} className="rounded-xl bg-red-500 px-3 py-2 text-xs font-semibold text-white hover:bg-red-600">Delete</button>
            </div>
          </div>
        </div>
      )}

      {isQueueTransitioning && queueTransitionStyle && (
        <div className="fixed inset-0 z-[175] pointer-events-none">
          <div
            onTransitionEnd={handleQueueTransitionEnd}
            className="fixed border border-lifewood-serpent/10 bg-white shadow-[0_24px_70px_rgba(19,48,32,0.22)] transition-all duration-500 ease-in-out will-change-[top,left,width,height,opacity]"
            style={queueTransitionStyle}
          />
        </div>
      )}
    </section>
  );
};

export default AdminEvaluation;


