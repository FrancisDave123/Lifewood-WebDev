import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Bell, Trash2, X } from 'lucide-react';
import { createPortal } from 'react-dom';

type NotificationItem = {
  id: string;
  title: string;
  description: string;
  time: string;
  read: boolean;
};

const seedNotifications: NotificationItem[] = [
  {
    id: 'n1',
    title: 'Evaluation queue updated for NLP team',
    description: '3 new activities were queued and assigned for reviewer validation.',
    time: '2m ago',
    read: false
  },
  {
    id: 'n2',
    title: '2 applicants moved to interview stage',
    description: 'Applicant records were advanced after initial screening approval.',
    time: '18m ago',
    read: false
  },
  {
    id: 'n3',
    title: 'Attendance sync completed for today',
    description: 'Attendance logs from interns and employees are now fully synchronized.',
    time: '42m ago',
    read: true
  },
  {
    id: 'n4',
    title: 'Reports preview refreshed by admin',
    description: 'The monthly report preview reflects the latest productivity metrics.',
    time: '1h ago',
    read: true
  },
  {
    id: 'n5',
    title: 'New intern profile submitted for review',
    description: 'A profile was submitted and is waiting for mentor approval.',
    time: '2h ago',
    read: false
  }
];

export const AdminNotificationBell: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSelectMode, setIsSelectMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>(seedNotifications);
  const [searchTerm, setSearchTerm] = useState('');
  const [confirmDeleteIds, setConfirmDeleteIds] = useState<string[] | null>(null);
  const [panelStyle, setPanelStyle] = useState<{ top: number; left: number; width: number }>({
    top: 0,
    left: 0,
    width: 320
  });
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const confirmModalRef = useRef<HTMLDivElement | null>(null);

  const PANEL_MAX_WIDTH = 320;
  const VIEWPORT_GAP = 8;
  const BADGE_COUNT = 3;

  const unreadCount = useMemo(
    () => notifications.filter((notification) => !notification.read).length,
    [notifications]
  );
  const filteredNotifications = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return notifications;
    return notifications.filter((notification) => (
      notification.title.toLowerCase().includes(query) ||
      notification.description.toLowerCase().includes(query)
    ));
  }, [notifications, searchTerm]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (!wrapperRef.current) return;
      if (wrapperRef.current.contains(target)) return;
      if (panelRef.current?.contains(target)) return;
      if (confirmModalRef.current?.contains(target)) return;
      setIsOpen(false);
      setIsSelectMode(false);
      setSelectedIds([]);
      setSearchTerm('');
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const updatePanelPosition = () => {
      const trigger = wrapperRef.current?.getBoundingClientRect();
      if (!trigger) return;

      const viewportWidth = window.innerWidth;
      const maxWidth = Math.min(PANEL_MAX_WIDTH, viewportWidth - VIEWPORT_GAP * 2);
      const canOpenRight = trigger.right + 12 + maxWidth <= viewportWidth - VIEWPORT_GAP;

      let left = canOpenRight ? trigger.right + 12 : trigger.left - maxWidth;
      left = Math.max(VIEWPORT_GAP, Math.min(left, viewportWidth - maxWidth - VIEWPORT_GAP));

      setPanelStyle({
        top: trigger.bottom + 8,
        left,
        width: maxWidth
      });
    };

    updatePanelPosition();
    window.addEventListener('resize', updatePanelPosition);
    window.addEventListener('scroll', updatePanelPosition, true);

    return () => {
      window.removeEventListener('resize', updatePanelPosition);
      window.removeEventListener('scroll', updatePanelPosition, true);
    };
  }, [isOpen]);

  const toggleSelected = (id: string) => {
    setSelectedIds((prev) => (
      prev.includes(id) ? prev.filter((entry) => entry !== id) : [...prev, id]
    ));
  };

  const handleCancelSelection = () => {
    setIsSelectMode(false);
    setSelectedIds([]);
  };

  const handleConfirmDelete = () => {
    if (!confirmDeleteIds || !confirmDeleteIds.length) return;

    setNotifications((prev) => prev.filter((notification) => !confirmDeleteIds.includes(notification.id)));
    setSelectedIds((prev) => prev.filter((id) => !confirmDeleteIds.includes(id)));
    setConfirmDeleteIds(null);
    setIsSelectMode(false);
  };

  const visibleIds = filteredNotifications.map((notification) => notification.id);
  const isAllSelected = visibleIds.length > 0 && visibleIds.every((id) => selectedIds.includes(id));
  const portalTarget = typeof document !== 'undefined' ? document.body : null;

  return (
    <div ref={wrapperRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="relative rounded-lg p-2 text-white/70 transition hover:bg-white/10 hover:text-white"
        aria-label="Notifications"
      >
        <Bell className="h-4 w-4" />
        <span className="absolute -top-1 -right-1 inline-flex min-w-[18px] items-center justify-center rounded-full bg-lifewood-saffron px-1 text-[10px] font-bold text-lifewood-serpent">
          {BADGE_COUNT}
        </span>
      </button>

      {portalTarget && createPortal(
        <>
          <div
            ref={panelRef}
            style={{ top: panelStyle.top, left: panelStyle.left, width: panelStyle.width }}
            className={`fixed z-[1000] rounded-2xl border border-white/15 bg-lifewood-serpent/95 p-3 shadow-[0_20px_45px_rgba(0,0,0,0.35)] backdrop-blur transition-all duration-200 ease-out ${
              isOpen ? 'translate-y-0 scale-100 opacity-100' : 'pointer-events-none -translate-y-1 scale-95 opacity-0'
            }`}
          >
        <div className="mb-2 flex items-center justify-between gap-2 px-1">
          <div className="flex items-center gap-2">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-white/70">Notifications</p>
            <span className="rounded-full bg-lifewood-yellow/20 px-2 py-0.5 text-[10px] font-semibold text-lifewood-yellow">
              {unreadCount} unread
            </span>
          </div>
          <button
            type="button"
            onClick={() => {
              setIsOpen(false);
              setIsSelectMode(false);
              setSelectedIds([]);
              setSearchTerm('');
              setConfirmDeleteIds(null);
            }}
            className="rounded-md p-1 text-white/70 transition hover:bg-white/10 hover:text-white"
            aria-label="Close notifications"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="mb-2 px-1">
          <input
            type="text"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search title or description..."
            className="w-full rounded-lg border border-white/15 bg-white/5 px-2.5 py-1.5 text-xs text-white placeholder:text-white/45 focus:border-lifewood-yellow/60 focus:outline-none"
          />
        </div>

        <div className="mb-2 flex flex-wrap items-center gap-2 px-1">
          {!isSelectMode ? (
            <button
              type="button"
              onClick={() => setIsSelectMode(true)}
              className="rounded-lg border border-white/15 bg-white/5 px-2 py-1 text-[11px] font-semibold text-white/80 transition hover:bg-white/10"
            >
              Select
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={() => setSelectedIds((prev) => {
                  if (isAllSelected) return prev.filter((id) => !visibleIds.includes(id));
                  return Array.from(new Set([...prev, ...visibleIds]));
                })}
                className="rounded-lg border border-white/15 bg-white/5 px-2 py-1 text-[11px] font-semibold text-white/80 transition hover:bg-white/10"
              >
                {isAllSelected ? 'Clear' : 'Select all'}
              </button>
              <button
                type="button"
                onClick={handleCancelSelection}
                className="rounded-lg border border-white/15 bg-white/5 px-2 py-1 text-[11px] font-semibold text-white/80 transition hover:bg-white/10"
              >
                Cancel
              </button>
              {selectedIds.length > 0 && (
                <button
                  type="button"
                  onClick={() => setConfirmDeleteIds(selectedIds)}
                  className="rounded-lg border border-red-300/30 bg-red-500/20 px-2 py-1 text-[11px] font-semibold text-red-100 transition hover:bg-red-500/30"
                >
                  Delete selected
                </button>
              )}
            </>
          )}
        </div>

        <div className="max-h-[260px] space-y-2 overflow-y-auto pr-1">
          {filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`rounded-xl border p-3 ${
                notification.read
                  ? 'border-white/10 bg-white/5 text-white/70'
                  : 'border-lifewood-yellow/40 bg-lifewood-yellow/10 text-white'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-start gap-2">
                  {isSelectMode && (
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(notification.id)}
                      onChange={() => toggleSelected(notification.id)}
                      className="mt-0.5 h-4 w-4 rounded border-white/30 bg-white/10 text-lifewood-yellow focus:ring-lifewood-yellow/50"
                      aria-label={`Select ${notification.title}`}
                    />
                  )}
                  <p className="text-sm font-semibold leading-snug">{notification.title}</p>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  {!notification.read && <span className="mt-0.5 h-2 w-2 rounded-full bg-lifewood-yellow" />}
                  <button
                    type="button"
                    onClick={() => setConfirmDeleteIds([notification.id])}
                    className="rounded-md p-1 text-white/60 transition hover:bg-white/10 hover:text-red-100"
                    aria-label={`Delete ${notification.title}`}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
              <p className="mt-1 text-[12px] leading-snug text-white/70">{notification.description}</p>
              <p className="mt-1 text-[11px] text-white/60">{notification.time}</p>
            </div>
          ))}

          {!filteredNotifications.length && (
            <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-center text-xs text-white/60">
              No matching notifications.
            </div>
          )}
        </div>
          </div>

          <div
            className={`fixed inset-0 z-[1010] flex items-center justify-center bg-black/45 px-4 transition duration-200 ${
              confirmDeleteIds ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
            }`}
          >
            <div
              ref={confirmModalRef}
              className={`w-full max-w-xs rounded-2xl border border-white/20 bg-lifewood-serpent p-4 shadow-2xl transition-all duration-200 ${
                confirmDeleteIds ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-2 scale-95 opacity-0'
              }`}
            >
              <p className="text-sm font-semibold text-white">
                Delete notification{confirmDeleteIds && confirmDeleteIds.length > 1 ? 's' : ''}?
              </p>
              <p className="mt-1 text-xs text-white/70">This action cannot be undone.</p>

              <div className="mt-4 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setConfirmDeleteIds(null)}
                  className="rounded-lg border border-white/20 px-3 py-1.5 text-xs font-semibold text-white/80 transition hover:bg-white/10"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDelete}
                  className="rounded-lg border border-red-300/30 bg-red-500/20 px-3 py-1.5 text-xs font-semibold text-red-100 transition hover:bg-red-500/30"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </>,
        portalTarget
      )}
    </div>
  );
};

export default AdminNotificationBell;
