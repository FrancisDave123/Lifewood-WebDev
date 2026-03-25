import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  BookOpen,
  Calendar,
  ClipboardList,
  Filter,
  LayoutDashboard,
  Loader2,
  Mail,
  Menu,
  SlidersHorizontal,
  X,
  Trash2,
  UserCircle2
} from 'lucide-react';
import { messageService } from '../services/messageService';
import { AdminSidebar } from './AdminSidebar';
import { AdminProfileModal } from './AdminProfileModal';
import { useProfile } from './ProfileContext';
import { ROLE_OPTIONS } from './adminProfile';
import { Toast, useToast } from './Toast';
import type { PageRoute } from '../routes/routeTypes';
import { emailService } from '../services/emailService';

interface AdminManageInquiriesProps {
  navigateTo?: (page: PageRoute) => void;
}

type MessageRecord = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  created_at: string;
  is_read: boolean;
  admin_response: boolean;
  admin_response_to: string | null;
};

type ReplyDraft = {
  target: MessageRecord;
  name: string;
  email: string;
  subject: string;
  message: string;
};

type MessageSummary = {
  total: number;
  today: number;
  unread: number;
};

export const AdminManageInquiries: React.FC<AdminManageInquiriesProps> = ({ navigateTo }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { profile, adminGmail, saveProfile } = useProfile();
  const [isSelectMode, setIsSelectMode] = useState(false);
  const [messages, setMessages] = useState<MessageRecord[]>([]);
  const [summary, setSummary] = useState<MessageSummary>({ total: 0, today: 0, unread: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [isSummaryLoading, setIsSummaryLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [appliedSearchTerm, setAppliedSearchTerm] = useState('');
  const [createdFrom, setCreatedFrom] = useState('');
  const [createdTo, setCreatedTo] = useState('');
  const [createdOn, setCreatedOn] = useState('');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest' | 'name_asc' | 'name_desc' | 'subject_asc' | 'subject_desc'>('newest');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [modalMessage, setModalMessage] = useState<MessageRecord | null>(null);
  const [previewMessage, setPreviewMessage] = useState<MessageRecord | null>(null);
  const [replyDraft, setReplyDraft] = useState<ReplyDraft | null>(null);
  const [isReplySending, setIsReplySending] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<{ mode: 'single' | 'selected'; id?: string; name?: string } | null>(null);
  const { toasts, show: showToast, dismiss: dismissToast } = useToast();
  const [pageOffset, setPageOffset] = useState(0);
  const [pageLimit] = useState(20);
  const [hasMore, setHasMore] = useState(false);
  const todayIso = new Date();
  const maxFilterDate = `${todayIso.getFullYear()}-${String(todayIso.getMonth() + 1).padStart(2, '0')}-${String(todayIso.getDate()).padStart(2, '0')}`;
  const isFilterActive = Boolean(createdOn || createdFrom || createdTo);
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
      onClick: () => {
        setIsSidebarOpen(false);
        navigateTo?.('admin-manage-applicants');
      }
    },
    {
      label: 'Inquiries',
      icon: Mail,
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
    }
  ];

  const formatPersonName = (value?: string | null) => {
    if (!value) return '';
    return value.trim().toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const formatTitleCase = (value?: string | null) => {
    if (!value) return '';
    return value.trim().toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const formatReplySubject = (subject?: string | null) => {
    const trimmed = subject?.trim() || '';
    if (!trimmed) return 'Re:';
    return /^re:/i.test(trimmed) ? trimmed : `Re: ${trimmed}`;
  };

  const filteredMessages = messages;

  const areAllFilteredSelected = filteredMessages.length > 0 && filteredMessages.every((message) => selectedIds.includes(message.id));

  const toggleSelectAll = () => {
    if (areAllFilteredSelected) { setSelectedIds((prev) => prev.filter((id) => !filteredMessages.some((message) => message.id === id))); return; }
    setSelectedIds((prev) => Array.from(new Set([...prev, ...filteredMessages.map((message) => message.id)])));
  };

  const toggleSelectRow = (id: string) => setSelectedIds((prev) => (prev.includes(id) ? prev.filter((selectedId) => selectedId !== id) : [...prev, id]));
  const deleteOne = (id: string, name: string) => setConfirmDelete({ mode: 'single', id, name });
  const deleteSelected = () => { if (!selectedIds.length) return; setConfirmDelete({ mode: 'selected' }); };
  const cancelSelection = () => { setIsSelectMode(false); setSelectedIds([]); };

  const openReplyModal = () => {
    if (!modalMessage) return;

    const adminName = `${profile.firstName} ${profile.lastName}`.trim() || 'Admin';
    const adminEmail = adminGmail.trim();

    setReplyDraft({
      target: modalMessage,
      name: adminName,
      email: adminEmail,
      subject: formatReplySubject(modalMessage.subject),
      message: ''
    });
  };

  const closeReplyModal = () => setReplyDraft(null);

  const sendReply = async () => {
    if (!replyDraft || isReplySending) return;

    const subject = replyDraft.subject.trim();
    const message = replyDraft.message.trim();
    const email = replyDraft.email.trim();
    const adminName = replyDraft.name.trim();
    const targetEmail = replyDraft.target.email.trim();

    if (!adminName) {
      showToast('Admin name is required.', 'delete');
      return;
    }

    if (!email) {
      showToast('Admin email is required.', 'delete');
      return;
    }

    if (!subject) {
      showToast('Subject is required.', 'delete');
      return;
    }

    if (!message) {
      showToast('Reply message is required.', 'delete');
      return;
    }

    setIsReplySending(true);
    try {
      await messageService.createReplyMessage({
        name: adminName,
        email,
        subject,
        message,
        admin_response_to: targetEmail
      });
      await emailService.sendAdminResponseEmail(
        targetEmail,
        targetEmail,
        subject,
        message,
        adminName,
        email
      );
      showToast('Reply sent and emailed.', 'hired');
      setReplyDraft(null);
      setModalMessage((prev) => (prev ? { ...prev, is_read: true } : prev));
      void loadSummary();
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Unable to send reply email.', 'delete');
    } finally {
      setIsReplySending(false);
    }
  };

  const deleteMessagesByIds = async (ids: string[]) => {
    if (!ids.length) return;
    try {
      await messageService.deleteMessages(ids);
      setMessages((prev) => prev.filter((message) => !ids.includes(message.id)));
      setModalMessage((prev) => (prev && ids.includes(prev.id) ? null : prev));
      setSelectedIds((prev) => prev.filter((selectedId) => !ids.includes(selectedId)));
      showToast(ids.length > 1 ? `${ids.length} messages deleted.` : 'Message deleted.', 'delete');
      void loadSummary();
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Unable to delete messages.', 'delete');
    }
  };

  const confirmDeleteAction = async () => {
    if (!confirmDelete) return;
    if (confirmDelete.mode === 'single' && confirmDelete.id) await deleteMessagesByIds([confirmDelete.id]);
    else if (confirmDelete.mode === 'selected') await deleteMessagesByIds(selectedIds);
    setConfirmDelete(null);
    setIsSelectMode(false);
  };

  const closeDeleteModal = () => { setConfirmDelete(null); cancelSelection(); };

  const formatMessageDate = (isoDate: string) => {
    if (!isoDate) return '—';
    const parsed = new Date(isoDate);
    if (Number.isNaN(parsed.getTime())) return '—';
    return parsed.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatMessageTime = (isoDate: string) => {
    if (!isoDate) return '—';
    const parsed = new Date(isoDate);
    if (Number.isNaN(parsed.getTime())) return '—';
    return parsed.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const loadMessages = async (offset = pageOffset) => {
    setIsLoading(true); setLoadError('');
    try {
      const result = await messageService.getMessages(pageLimit, offset, { search: appliedSearchTerm || undefined, created_from: createdFrom || undefined, created_to: createdTo || undefined, created_on: createdOn || undefined, sort: sortOrder as any });
      const normalized = (result.messages || []).map((record: any) => ({
        id: String(record.id ?? ''),
        name: formatPersonName(String(record.name ?? '')),
        email: String(record.email ?? ''),
        subject: formatTitleCase(String(record.subject ?? '')),
        message: String(record.message ?? ''),
        created_at: String(record.created_at ?? ''),
        is_read: Boolean(record.is_read ?? false),
        admin_response: Boolean(record.admin_response ?? false),
        admin_response_to: record.admin_response_to ? String(record.admin_response_to) : null
      })) as MessageRecord[];
      setMessages(normalized);
      setHasMore(result.has_more || false);
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : 'Unable to load messages.');
    } finally { setIsLoading(false); }
  };

  const loadSummary = async () => {
    setIsSummaryLoading(true);
    try {
      const summary = await messageService.getMessageSummary();
      setSummary({ total: summary.total || 0, today: summary.today || 0, unread: summary.unread || 0 });
    } catch { setSummary({ total: 0, today: 0, unread: 0 }); }
    finally { setIsSummaryLoading(false); }
  };

  useEffect(() => { void loadMessages(pageOffset); void loadSummary(); }, [pageOffset]);
  useEffect(() => { if (pageOffset !== 0) { setPageOffset(0); return; } void loadMessages(0); }, [appliedSearchTerm, createdFrom, createdTo, createdOn, sortOrder]);
  useEffect(() => { if (modalMessage && !modalMessage.is_read) void markMessageAsRead(modalMessage.id); }, [modalMessage]);

  const handleEditProfile = () => setIsProfileOpen(true);

  const deleteMessage = async (messageId: string) => {
    try {
      await messageService.deleteMessage(messageId);
      setMessages((prev) => prev.filter((message) => message.id !== messageId));
      setModalMessage((prev) => (prev && prev.id === messageId ? null : prev));
      showToast('Message deleted.', 'delete');
      void loadSummary();
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Unable to delete message.', 'delete');
    }
  };

  const markMessageAsRead = async (messageId: string) => {
    try {
      await messageService.markAsRead(messageId);
      setMessages((prev) => prev.map((message) => message.id === messageId ? { ...message, is_read: true } : message));
      setModalMessage((prev) => prev ? { ...prev, is_read: true } : null);
      void loadSummary();
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Unable to mark as read.', 'delete');
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
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-lifewood-green">Support</p>
              <h1 className="mt-1 text-2xl font-black text-lifewood-serpent md:text-3xl">Inquiries</h1>
              <p className="mt-2 text-sm text-lifewood-serpent/65">Manage support tickets and customer inquiries from the Contact Us form.</p>
              <div className="mt-5 grid gap-4 md:grid-cols-3">
                <div className="rounded-2xl border border-lifewood-serpent/10 bg-lifewood-seaSalt p-4"><p className="text-xs font-semibold uppercase tracking-[0.15em] text-lifewood-serpent/60">Total</p><p className="mt-2 text-3xl font-black text-lifewood-serpent">{isSummaryLoading ? '-' : summary.total}</p></div>
                <div className="rounded-2xl border border-lifewood-serpent/10 bg-lifewood-green/10 p-4"><p className="text-xs font-semibold uppercase tracking-[0.15em] text-lifewood-serpent/60">Today</p><p className="mt-2 text-3xl font-black text-lifewood-serpent">{isSummaryLoading ? '-' : summary.today}</p></div>
                <div className="rounded-2xl border border-lifewood-serpent/10 bg-lifewood-serpent p-4 text-white"><p className="text-xs font-semibold uppercase tracking-[0.15em] text-white/65">Unread</p><p className="mt-2 text-3xl font-black text-lifewood-yellow">{isSummaryLoading ? '-' : summary.unread}</p></div>
              </div>
              {isSummaryLoading && <div className="mt-4 flex items-center gap-3 text-sm font-semibold text-lifewood-serpent/70"><span className="h-6 w-6 animate-spin rounded-full border-4 border-lifewood-serpent/20 border-t-lifewood-green" />Loading summary...</div>}
            </div>

            <div className="rounded-3xl border border-lifewood-serpent/10 bg-white p-5">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-lg font-bold text-lifewood-serpent">Support Tickets</h3>
                <Mail className="h-5 w-5 text-lifewood-green" />
              </div>
              <div className="mb-4 flex flex-wrap items-center gap-2">
                <div className="relative">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        setPageOffset(0);
                        setAppliedSearchTerm(searchTerm.trim());
                      }
                    }}
                    placeholder="Search by name, email, or subject..."
                    className="min-w-[220px] rounded-xl border border-lifewood-serpent/15 px-3 py-2 pr-9 text-sm text-lifewood-serpent focus:border-lifewood-green focus:outline-none"
                  />
                  {(searchTerm || appliedSearchTerm) && (
                    <button
                      type="button"
                      onClick={() => {
                        setSearchTerm('');
                        setAppliedSearchTerm('');
                        setPageOffset(0);
                      }}
                      className="absolute right-2 top-1/2 inline-flex -translate-y-1/2 items-center justify-center rounded-md px-1 text-lifewood-serpent/45 transition hover:text-lifewood-serpent"
                      aria-label="Clear search"
                      title="Clear search"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
                <div className="relative">
                  {isFilterOpen && <div className="fixed inset-0 z-10" onClick={() => setIsFilterOpen(false)} />}
                  <div className="inline-flex items-center">
                    <button type="button" onClick={() => { setIsFilterOpen((prev) => !prev); setIsSortOpen(false); }} aria-pressed={isFilterActive} className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-semibold transition ${isFilterActive ? 'rounded-r-none border-r-0 border-lifewood-green bg-lifewood-green text-white shadow-[0_6px_16px_rgba(4,98,65,0.25)]' : 'border-lifewood-serpent/15 bg-white text-lifewood-serpent'}`}><Filter className={`h-4 w-4 ${isFilterActive ? 'text-white' : ''}`} />Filter{isFilterActive && <span className="ml-1 inline-flex h-2 w-2 rounded-full bg-lifewood-yellow" />}</button>
                    {isFilterActive && <button type="button" onClick={() => { setCreatedOn(''); setCreatedFrom(''); setCreatedTo(''); setIsFilterOpen(false); }} className="inline-flex items-center rounded-xl rounded-l-none border border-lifewood-green bg-lifewood-green px-2 py-2 text-xs font-bold text-white hover:bg-lifewood-green/80">×</button>}
                  </div>
                  {isFilterOpen && (
                    <div className="absolute left-0 top-full z-20 mt-2 w-[320px] rounded-2xl border border-lifewood-serpent/15 bg-white p-4 shadow-[0_18px_40px_rgba(19,48,32,0.12)]">
                      <div className="space-y-3 text-xs text-lifewood-serpent/70">
                        <div><p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-lifewood-serpent/60">Created On</p><input type="date" max={maxFilterDate} value={createdOn} onChange={(e) => setCreatedOn(e.target.value)} className="mt-2 w-full rounded-lg border border-lifewood-serpent/10 px-3 py-2 text-xs text-lifewood-serpent focus:border-lifewood-green focus:outline-none" /></div>
                        <div><p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-lifewood-serpent/60">Date Range</p><div className="mt-2 flex items-center gap-2"><input type="date" max={maxFilterDate} value={createdFrom} onChange={(e) => setCreatedFrom(e.target.value)} className="w-full rounded-lg border border-lifewood-serpent/10 px-2 py-2 text-xs text-lifewood-serpent focus:border-lifewood-green focus:outline-none" /><span className="text-lifewood-serpent/40">to</span><input type="date" max={maxFilterDate} value={createdTo} onChange={(e) => setCreatedTo(e.target.value)} className="w-full rounded-lg border border-lifewood-serpent/10 px-2 py-2 text-xs text-lifewood-serpent focus:border-lifewood-green focus:outline-none" /></div></div>
                        <p className="text-[11px] text-lifewood-serpent/50">Specific date overrides the range.</p>
                      </div>
                    </div>
                  )}
                </div>
                <div className="relative">
                  {isSortOpen && <div className="fixed inset-0 z-10" onClick={() => setIsSortOpen(false)} />}
                  <div className="inline-flex items-center">
                    <button type="button" onClick={() => { setIsSortOpen((prev) => !prev); setIsFilterOpen(false); }} aria-pressed={isSortActive} className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-semibold transition ${isSortActive ? 'rounded-r-none border-r-0 border-lifewood-green bg-lifewood-green text-white shadow-[0_6px_16px_rgba(4,98,65,0.25)]' : 'border-lifewood-serpent/15 bg-white text-lifewood-serpent'}`}><SlidersHorizontal className={`h-4 w-4 ${isSortActive ? 'text-white' : ''}`} />Sort{isSortActive && <span className="ml-1 inline-flex h-2 w-2 rounded-full bg-lifewood-yellow" />}</button>
                    {isSortActive && <button type="button" onClick={() => { setSortOrder('newest'); setIsSortOpen(false); }} className="inline-flex items-center rounded-xl rounded-l-none border border-lifewood-green bg-lifewood-green px-2 py-2 text-xs font-bold text-white hover:bg-lifewood-green/80">×</button>}
                  </div>
                  {isSortOpen && (
                    <div className="absolute left-0 top-full z-20 mt-2 w-[260px] rounded-2xl border border-lifewood-serpent/15 bg-white p-4 shadow-[0_18px_40px_rgba(19,48,32,0.12)]">
                      <div className="space-y-2 text-xs text-lifewood-serpent/70">
                        {(['newest','oldest','name_asc','name_desc','subject_asc','subject_desc'] as const).map((val) => (
                          <label key={val} className="flex items-center gap-2 font-semibold text-lifewood-serpent">
                            <input type="checkbox" checked={sortOrder === val} onChange={() => { setSortOrder(val); setIsSortOpen(false); }} className="h-4 w-4 rounded border-lifewood-serpent/30 text-lifewood-green focus:ring-lifewood-green" />
                            {val === 'newest' ? 'Newest first' : val === 'oldest' ? 'Oldest first' : val === 'name_asc' ? 'A-Z (Name)' : val === 'name_desc' ? 'Z-A (Name)' : val === 'subject_asc' ? 'A-Z (Subject)' : 'Z-A (Subject)'}
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
              {!loadError && isLoading && <div className="mb-3 flex items-center gap-3 text-sm font-semibold text-lifewood-serpent/70"><span className="h-6 w-6 animate-spin rounded-full border-4 border-lifewood-serpent/20 border-t-lifewood-green" />Loading inquiries...</div>}
              {!loadError && !isLoading && filteredMessages.length === 0 && <p className="mb-3 text-xs font-semibold text-lifewood-serpent/60">No inquiries found.</p>}
              <div className="overflow-auto max-h-[480px]">
                <table className="w-full min-w-[860px] table-auto text-left relative">
                  <thead className="bg-lifewood-seaSalt/70 sticky top-0 z-10">
                    <tr className="text-xs uppercase tracking-[0.14em] text-lifewood-serpent/55">
                      {isSelectMode && <th className="px-4 py-3"><input type="checkbox" checked={areAllFilteredSelected} onChange={toggleSelectAll} /></th>}
                      <th className="px-4 py-3">Customer</th>
                      <th className="px-4 py-3">Subject</th>
                      <th className="px-4 py-3">Message</th>
                      <th className="px-4 py-3">Date</th>
                      {isSelectMode && <th className="px-4 py-3">Actions</th>}
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {filteredMessages.map((message) => (
                      <tr key={message.id} onClick={() => setModalMessage(message)} className={['cursor-pointer border-t border-lifewood-serpent/10 transition', message.is_read ? 'odd:bg-white even:bg-lifewood-seaSalt/35 hover:bg-lifewood-seaSalt/60' : 'bg-lifewood-green/10 hover:bg-lifewood-green/15'].join(' ')}>
                        {isSelectMode && <td className="px-4 py-4" onClick={(e) => e.stopPropagation()}><input type="checkbox" checked={selectedIds.includes(message.id)} onChange={() => toggleSelectRow(message.id)} /></td>}
                        <td className="px-4 py-4 font-semibold text-lifewood-serpent">
                          <div className="flex items-center gap-2"><p>{formatPersonName(message.name)}</p>{!message.is_read && <span className="inline-flex h-2.5 w-2.5 rounded-full bg-lifewood-green shadow-[0_0_0_4px_rgba(34,197,94,0.12)]" />}</div>
                          <p className="mt-1 text-xs font-medium text-lifewood-serpent/60">{message.email}</p>
                        </td>
                        <td className="px-4 py-4 text-lifewood-serpent">{formatTitleCase(message.subject)}</td>
                        <td className="px-4 py-4 text-lifewood-serpent">{message.message.length > 100 ? `${message.message.substring(0, 100)}...` : message.message}</td>
                        <td className="px-4 py-4 text-lifewood-serpent"><div><p>{formatMessageDate(message.created_at)}</p><p className="mt-1 text-xs text-lifewood-serpent/60">{formatMessageTime(message.created_at)}</p></div></td>
                        {isSelectMode && <td className="px-4 py-4" onClick={(e) => e.stopPropagation()}><button type="button" onClick={() => deleteOne(message.id, message.name)} className="inline-flex items-center gap-1 rounded-lg bg-red-500 px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-red-600"><Trash2 className="h-3.5 w-3.5" />Delete</button></td>}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs font-semibold text-lifewood-serpent/70">
                <span>Showing {messages.length === 0 ? 0 : pageOffset + 1}–{pageOffset + messages.length}</span>
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
        {modalMessage && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }} className="fixed inset-0 z-[180] flex items-center justify-center bg-black/45 p-4" onClick={() => setModalMessage(null)}>
            <motion.div initial={{ opacity: 0, y: 20, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 14, scale: 0.97 }} transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }} className="max-h-[90vh] w-full max-w-3xl flex flex-col rounded-3xl border border-lifewood-serpent/10 bg-white overflow-hidden" onClick={(e) => e.stopPropagation()}>

              {/* ── Modal Header ── */}
              <div className="flex shrink-0 items-center justify-between bg-lifewood-serpent px-5 py-4">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/50">Inquiry Details</p>
                  <h3 className="mt-0.5 text-base font-bold text-white">{modalMessage.name}</h3>
                </div>
                <button type="button" onClick={() => setModalMessage(null)} className="rounded-lg border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-white/20">
                  Close
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-5 py-4">
                <div className="space-y-4">
                  <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_260px]">
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="rounded-xl bg-lifewood-seaSalt/60 p-3"><p className="text-[10px] font-bold uppercase tracking-[0.15em] text-lifewood-serpent/50">Name</p><p className="mt-1 text-sm font-semibold text-lifewood-serpent">{modalMessage.name}</p></div>
                      <div className="rounded-xl bg-lifewood-seaSalt/60 p-3"><p className="text-[10px] font-bold uppercase tracking-[0.15em] text-lifewood-serpent/50">Email</p><p className="mt-1 text-sm font-semibold text-lifewood-serpent break-all">{modalMessage.email}</p></div>
                      <div className="rounded-xl bg-lifewood-seaSalt/60 p-3"><p className="text-[10px] font-bold uppercase tracking-[0.15em] text-lifewood-serpent/50">Subject</p><p className="mt-1 text-sm font-semibold text-lifewood-serpent">{modalMessage.subject}</p></div>
                      <div className="rounded-xl bg-lifewood-seaSalt/60 p-3"><p className="text-[10px] font-bold uppercase tracking-[0.15em] text-lifewood-serpent/50">Date and Time</p><p className="mt-1 text-sm font-semibold text-lifewood-serpent">{formatMessageDate(modalMessage.created_at)} at {formatMessageTime(modalMessage.created_at)}</p></div>
                    </div>
                    <div className="space-y-4 lg:sticky lg:top-0 lg:self-start">
                      <div className="rounded-2xl border border-lifewood-serpent/10 bg-white p-4">
                        <p className="text-sm font-semibold text-lifewood-serpent">Actions</p>
                        <p className="mt-1 text-xs text-lifewood-serpent/60">Manage this inquiry.</p>
                        <div className="mt-3 flex flex-col gap-2">
                          <button type="button" onClick={openReplyModal} className="rounded-xl bg-lifewood-green px-3 py-2 text-xs font-semibold text-white hover:bg-lifewood-green/90">Reply</button>
                          <button type="button" onClick={() => setConfirmDelete({ mode: 'single', id: modalMessage.id, name: modalMessage.name })} className="rounded-xl bg-red-500 px-3 py-2 text-xs font-semibold text-white hover:bg-red-600">Delete Inquiry</button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="rounded-xl bg-lifewood-seaSalt/60 p-3">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-lifewood-serpent/50">Message</p>
                      <button
                        type="button"
                        onClick={() => setPreviewMessage(modalMessage)}
                        className="inline-flex items-center gap-1 rounded-lg border border-lifewood-serpent/15 bg-white px-3 py-1.5 text-[11px] font-semibold text-lifewood-serpent transition hover:border-lifewood-green hover:text-lifewood-green"
                      >
                        <BookOpen className="h-3.5 w-3.5" />
                        Full Preview
                      </button>
                    </div>
                    <div className="mt-2 max-h-[320px] overflow-y-auto rounded-lg bg-white/70 p-3">
                      <p className="text-sm font-semibold text-lifewood-serpent whitespace-pre-wrap">{modalMessage.message}</p>
                    </div>
                  </div>
                </div>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {previewMessage && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }} className="fixed inset-0 z-[182] flex items-center justify-center bg-black/55 p-4" onClick={() => setPreviewMessage(null)}>
            <motion.div initial={{ opacity: 0, y: 20, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 14, scale: 0.97 }} transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }} className="flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl border border-lifewood-serpent/10 bg-white shadow-[0_24px_70px_rgba(19,48,32,0.25)]" onClick={(e) => e.stopPropagation()}>
              <div className="flex shrink-0 items-center justify-between bg-lifewood-serpent px-5 py-4 text-white">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/60">Full Message Preview</p>
                  <h3 className="mt-0.5 text-base font-bold">{previewMessage.subject}</h3>
                  <p className="mt-1 text-xs text-white/70">{previewMessage.name}</p>
                </div>
                <button type="button" onClick={() => setPreviewMessage(null)} className="rounded-lg border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-white/20">
                  Close
                </button>
              </div>
              <div className="grid gap-4 border-b border-lifewood-serpent/10 bg-lifewood-seaSalt/35 px-5 py-4 text-sm text-lifewood-serpent md:grid-cols-3">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-lifewood-serpent/50">Sender</p>
                  <p className="mt-1 font-semibold">{previewMessage.name}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-lifewood-serpent/50">Email</p>
                  <p className="mt-1 break-all font-semibold">{previewMessage.email}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-lifewood-serpent/50">Received</p>
                  <p className="mt-1 font-semibold">{formatMessageDate(previewMessage.created_at)} at {formatMessageTime(previewMessage.created_at)}</p>
                </div>
              </div>
              <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5">
                <article className="mx-auto max-w-3xl rounded-2xl bg-lifewood-seaSalt/45 p-5">
                  <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-lifewood-serpent/50">Message</p>
                  <p className="mt-3 whitespace-pre-wrap text-base leading-8 text-lifewood-serpent">{previewMessage.message}</p>
                </article>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {replyDraft && modalMessage && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }} className="fixed inset-0 z-[185] flex items-center justify-center bg-black/50 p-4" onClick={closeReplyModal}>
            <motion.div initial={{ opacity: 0, y: 18, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 12, scale: 0.98 }} transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }} className="flex max-h-[min(90vh,820px)] w-full max-w-3xl flex-col overflow-hidden rounded-3xl border border-lifewood-serpent/10 bg-white shadow-[0_24px_70px_rgba(19,48,32,0.25)]" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between bg-lifewood-green px-5 py-4 text-white">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/70">Reply</p>
                  <h3 className="mt-0.5 text-base font-bold">Reply to {modalMessage.name}</h3>
                </div>
                <button type="button" onClick={closeReplyModal} className="rounded-lg border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-white/20">
                  Close
                </button>
              </div>

              <div className="min-h-0 flex-1 overflow-y-auto p-5">
                <div className="space-y-4">
                  <div className="min-h-0 space-y-4">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-xl bg-lifewood-seaSalt/60 p-3">
                      <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-lifewood-serpent/50">Name</p>
                      <input
                        type="text"
                        value={replyDraft.name}
                        onChange={(e) => setReplyDraft((prev) => (prev ? { ...prev, name: e.target.value } : prev))}
                        className="mt-1 w-full rounded-lg border border-lifewood-serpent/10 bg-white px-3 py-2 text-sm font-semibold text-lifewood-serpent focus:border-lifewood-green focus:outline-none"
                      />
                    </div>
                    <div className="rounded-xl bg-lifewood-seaSalt/60 p-3">
                      <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-lifewood-serpent/50">Email</p>
                      <input
                        type="email"
                        value={replyDraft.email}
                        onChange={(e) => setReplyDraft((prev) => (prev ? { ...prev, email: e.target.value } : prev))}
                        className="mt-1 w-full rounded-lg border border-lifewood-serpent/10 bg-white px-3 py-2 text-sm font-semibold text-lifewood-serpent focus:border-lifewood-green focus:outline-none"
                      />
                    </div>
                    <div className="rounded-xl bg-lifewood-seaSalt/60 p-3 sm:col-span-2">
                      <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-lifewood-serpent/50">Subject</p>
                      <input
                        type="text"
                        value={replyDraft.subject}
                        onChange={(e) => setReplyDraft((prev) => (prev ? { ...prev, subject: e.target.value } : prev))}
                        className="mt-1 w-full rounded-lg border border-lifewood-serpent/10 bg-white px-3 py-2 text-sm font-semibold text-lifewood-serpent focus:border-lifewood-green focus:outline-none"
                      />
                    </div>
                    <div className="rounded-xl bg-lifewood-seaSalt/60 p-3 sm:col-span-2">
                      <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-lifewood-serpent/50">Message</p>
                      <textarea
                        value={replyDraft.message}
                        onChange={(e) => setReplyDraft((prev) => (prev ? { ...prev, message: e.target.value } : prev))}
                        rows={8}
                        placeholder="Write your reply here..."
                        className="mt-1 w-full rounded-lg border border-lifewood-serpent/10 bg-white px-3 py-2 text-sm font-medium text-lifewood-serpent focus:border-lifewood-green focus:outline-none"
                      />
                    </div>
                  </div>
                  </div>

                  <div className="rounded-2xl border border-lifewood-serpent/10 bg-lifewood-seaSalt/40 p-4">
                    <p className="text-sm font-semibold text-lifewood-serpent">Reply target</p>
                    <p className="mt-1 text-xs leading-5 text-lifewood-serpent/60">This reply will be stored as an admin response and linked to:</p>
                    <p className="mt-3 break-all rounded-xl bg-white px-3 py-3 text-sm font-semibold text-lifewood-serpent shadow-sm">{replyDraft.target.email}</p>
                  </div>
                </div>

                <div className="mt-4 rounded-2xl border border-lifewood-serpent/10 bg-white p-5">
                  <p className="text-base font-semibold text-lifewood-serpent">Original inquiry</p>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-xl bg-lifewood-seaSalt/45 p-3">
                      <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-lifewood-serpent/50">From</p>
                      <p className="mt-2 break-all text-sm leading-6 text-lifewood-serpent">{replyDraft.target.name} &lt;{replyDraft.target.email}&gt;</p>
                    </div>
                    <div className="rounded-xl bg-lifewood-seaSalt/45 p-3">
                      <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-lifewood-serpent/50">Subject</p>
                      <p className="mt-2 text-sm leading-6 text-lifewood-serpent">{replyDraft.target.subject}</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-lifewood-serpent/50">Message</p>
                    <div className="mt-2 max-h-64 overflow-y-auto rounded-2xl border border-lifewood-serpent/10 bg-lifewood-seaSalt/45 px-4 py-3">
                      <p className="whitespace-pre-wrap break-words text-sm leading-7 text-lifewood-serpent/80">{replyDraft.target.message}</p>
                    </div>
                  </div>
                </div>

              </div>

              <div className="flex items-center justify-end gap-2 border-t border-lifewood-serpent/10 bg-white px-5 py-4">
                <button type="button" onClick={closeReplyModal} disabled={isReplySending} className={`rounded-xl border border-lifewood-serpent/15 px-4 py-2 text-xs font-semibold ${isReplySending ? 'cursor-not-allowed text-lifewood-serpent/40' : 'text-lifewood-serpent'}`}>Cancel</button>
                <button type="button" onClick={sendReply} disabled={isReplySending} className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold ${isReplySending ? 'cursor-not-allowed bg-lifewood-serpent/15 text-lifewood-serpent/50' : 'bg-lifewood-green text-white hover:bg-lifewood-green/90'}`}>{isReplySending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}{isReplySending ? 'Sending...' : 'Send Reply'}</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {confirmDelete && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.16 }} className="fixed inset-0 z-[190] flex items-center justify-center bg-black/45 p-4" onClick={closeDeleteModal}>
            <motion.div initial={{ opacity: 0, y: 16, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.97 }} transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }} className="w-full max-w-md rounded-2xl border border-lifewood-serpent/10 bg-white p-5" onClick={(e) => e.stopPropagation()}>
              <h4 className="text-lg font-bold text-lifewood-serpent">Confirm Delete</h4>
              <p className="mt-2 text-sm text-lifewood-serpent/70">{confirmDelete.mode === 'single' ? `Are you sure you want to delete the inquiry from ${confirmDelete.name}?` : `Are you sure you want to delete ${selectedIds.length} selected inquiry(ies)?`}</p>
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

export default AdminManageInquiries;
