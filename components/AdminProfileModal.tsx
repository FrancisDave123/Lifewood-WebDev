import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Pencil, UserCircle2, X } from 'lucide-react';
import { AdminProfileData, ROLE_OPTIONS } from './adminProfile';
import { supabase } from '../services/supabaseClient';
import { Toast, useToast } from './Toast';

interface AdminProfileModalProps {
  open: boolean;
  onClose: () => void;
  profile: AdminProfileData;
  adminGmail: string;
  authUserId: string | null;
  onSave: (profile: AdminProfileData) => Promise<{ error: string | null }>;
}

export const AdminProfileModal: React.FC<AdminProfileModalProps> = ({
  open,
  onClose,
  profile,
  adminGmail,
  authUserId,
  onSave,
}) => {
  const today = new Date();
  const maxBirthday = new Date(today.getTime() - today.getTimezoneOffset() * 60000)
    .toISOString()
    .split('T')[0];
  const avatarInputRef = useRef<HTMLInputElement | null>(null);
  const closeTimerRef = useRef<number | null>(null);
  const pendingObjectUrlRef = useRef<string | null>(null);
  const [draft, setDraft] = useState<AdminProfileData>(profile);
  const [pendingAvatarFile, setPendingAvatarFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [showImagePreview, setShowImagePreview] = useState(false);
  const [closing, setClosing] = useState(false);
  const { toasts, show: showToast, dismiss } = useToast();

  useEffect(() => {
    if (!open) return;
    setClosing(false);
    setDraft(profile);
    setPendingAvatarFile(null);
    setShowImagePreview(false);
    if (pendingObjectUrlRef.current) {
      URL.revokeObjectURL(pendingObjectUrlRef.current);
      pendingObjectUrlRef.current = null;
    }
    if (avatarInputRef.current) {
      avatarInputRef.current.value = '';
    }
  }, [open, profile]);

  useEffect(() => {
    return () => {
      if (closeTimerRef.current) {
        window.clearTimeout(closeTimerRef.current);
      }
      if (pendingObjectUrlRef.current) {
        URL.revokeObjectURL(pendingObjectUrlRef.current);
      }
    };
  }, []);

  const closeWithFade = () => {
    if (closing) return;
    setClosing(true);
    if (closeTimerRef.current) {
      window.clearTimeout(closeTimerRef.current);
    }
    closeTimerRef.current = window.setTimeout(() => {
      onClose();
      closeTimerRef.current = null;
    }, 320);
  };

  const setAvatarPreview = (file: File) => {
    if (pendingObjectUrlRef.current) {
      URL.revokeObjectURL(pendingObjectUrlRef.current);
    }
    const objectUrl = URL.createObjectURL(file);
    pendingObjectUrlRef.current = objectUrl;
    setPendingAvatarFile(file);
    setDraft((prev) => ({ ...prev, avatarUrl: objectUrl }));
  };

  const resetPendingAvatar = () => {
    if (pendingObjectUrlRef.current) {
      URL.revokeObjectURL(pendingObjectUrlRef.current);
      pendingObjectUrlRef.current = null;
    }
    setPendingAvatarFile(null);
    setDraft((prev) => ({ ...prev, avatarUrl: profile.avatarUrl || '' }));
    if (avatarInputRef.current) {
      avatarInputRef.current.value = '';
    }
  };

  const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setAvatarPreview(file);
    setShowImagePreview(true);
  };

  const uploadAvatarIfNeeded = async (): Promise<string> => {
    if (!pendingAvatarFile) {
      return draft.avatarUrl;
    }

    const resolvedUserId = authUserId || (await supabase.auth.getUser()).data.user?.id || '';
    if (!resolvedUserId) {
      throw new Error('Not authenticated.');
    }

    const file = pendingAvatarFile;
    const fileExtension = file.name.split('.').pop()?.trim().toLowerCase() || 'png';
    const filePath = `profiles/profile_pics/${resolvedUserId}-${Date.now()}.${fileExtension}`;

    setUploadingAvatar(true);
    try {
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) {
        throw new Error(uploadError.message);
      }

      const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
      return data.publicUrl;
    } finally {
      setUploadingAvatar(false);
    }
  };

  const saveProfile = async () => {
    if (!draft.firstName.trim() || !draft.lastName.trim()) {
      showToast('First name and last name are required.', 'rejected');
      return;
    }

    if (draft.birthday && draft.birthday > maxBirthday) {
      showToast('Birthday cannot be in the future.', 'rejected');
      return;
    }

    setSaving(true);
    try {
      const avatarUrl = await uploadAvatarIfNeeded();
      const result = await onSave({
        ...draft,
        firstName: draft.firstName.trim(),
        lastName: draft.lastName.trim(),
        avatarUrl,
      });

      if (result.error) {
        showToast('Failed to save: ' + result.error, 'rejected');
        return;
      }

      showToast('Profile updated successfully!', 'hired');
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          closeWithFade();
        });
      });
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Failed to save profile.', 'rejected');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    resetPendingAvatar();
    closeWithFade();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: closing ? 0 : 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[120] flex items-center justify-center bg-black/60 p-4 backdrop-blur-md"
        >
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: closing ? 0 : 1, y: closing ? 10 : 0, scale: closing ? 0.985 : 1 }}
            exit={{ opacity: 0, y: 14, scale: 0.97 }}
            transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-xl rounded-3xl border border-white/20 bg-lifewood-serpent p-6 text-white shadow-[0_24px_60px_rgba(0,0,0,0.45)]"
          >
            <div className="mb-5 flex items-start justify-between">
              <div>
                <h3 className="text-2xl font-black">Edit Profile</h3>
                <p className="text-sm text-white/60">Update your internal admin details</p>
              </div>
              <button
                type="button"
                onClick={handleCancel}
                className="rounded-lg bg-white/10 p-2 text-white/80 transition hover:bg-white/20 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                void saveProfile();
              }}
              className="grid gap-4 md:grid-cols-[140px_1fr]"
            >
              <div className="rounded-2xl border border-white/15 bg-white/5 p-4">
                {draft.avatarUrl ? (
                  <button
                    type="button"
                    onClick={() => setShowImagePreview(true)}
                    className="mx-auto block h-20 w-20 overflow-hidden rounded-full border border-white/20 focus:outline-none focus:ring-2 focus:ring-lifewood-green"
                  >
                    <img
                      src={draft.avatarUrl}
                      alt="Profile preview"
                      className="h-full w-full object-cover"
                    />
                  </button>
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
                  onClick={() => {
                    if (avatarInputRef.current) {
                      avatarInputRef.current.value = '';
                      avatarInputRef.current.click();
                    }
                  }}
                  disabled={uploadingAvatar}
                  className="mx-auto mt-3 flex items-center gap-1 rounded-full bg-lifewood-green px-3 py-1 text-xs font-bold text-white disabled:opacity-60"
                >
                  <Pencil className="h-3 w-3" />
                  {uploadingAvatar ? 'Uploading...' : 'Upload'}
                </button>

                {pendingAvatarFile && (
                  <button
                    type="button"
                    onClick={resetPendingAvatar}
                    className="mx-auto mt-2 block text-[11px] font-semibold text-white/65 transition hover:text-white"
                  >
                    Cancel change
                  </button>
                )}
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-white/70">Email</label>
                  <p className="mt-1 break-all rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm text-white/90">
                    {adminGmail}
                  </p>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-semibold text-white/70">First Name *</label>
                    <input
                      required
                      value={draft.firstName}
                      onChange={(e) => setDraft((p) => ({ ...p, firstName: e.target.value }))}
                      className="mt-1 w-full rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-white/45 focus:border-lifewood-green focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-white/70">Last Name *</label>
                    <input
                      required
                      value={draft.lastName}
                      onChange={(e) => setDraft((p) => ({ ...p, lastName: e.target.value }))}
                      className="mt-1 w-full rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-white/45 focus:border-lifewood-green focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-white/70">Birthday</label>
                    <input
                      type="date"
                      value={draft.birthday}
                      max={maxBirthday}
                      onChange={(e) => setDraft((p) => ({ ...p, birthday: e.target.value }))}
                      className="mt-1 w-full rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm text-white focus:border-lifewood-green focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-white/70">Role</label>
                    <select
                      value={draft.roleId}
                      disabled
                      className="mt-1 w-full rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm text-white/60 focus:border-lifewood-green focus:outline-none"
                    >
                      {ROLE_OPTIONS.map((r) => (
                        <option key={r.id} value={r.id}>{r.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-white/70">Address</label>
                  <input
                    value={draft.address}
                    onChange={(e) => setDraft((p) => ({ ...p, address: e.target.value }))}
                    className="mt-1 w-full rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-white/45 focus:border-lifewood-green focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-white/70">School</label>
                  <input
                    value={draft.school}
                    onChange={(e) => setDraft((p) => ({ ...p, school: e.target.value }))}
                    className="mt-1 w-full rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-white/45 focus:border-lifewood-green focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-white/70">Short Bio</label>
                  <textarea
                    rows={3}
                    value={draft.shortBio}
                    onChange={(e) => setDraft((p) => ({ ...p, shortBio: e.target.value }))}
                    className="mt-1 w-full resize-none rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-white/45 focus:border-lifewood-green focus:outline-none"
                  />
                </div>
              </div>

              <div className="md:col-span-2 flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="rounded-xl border border-white/15 px-4 py-2 text-xs font-semibold text-white/80 transition hover:bg-white/10"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving || uploadingAvatar}
                  className="rounded-xl bg-lifewood-green px-4 py-2 text-xs font-bold text-white transition hover:bg-lifewood-green/90 disabled:opacity-60"
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}

      <AnimatePresence>
        {showImagePreview && draft.avatarUrl && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[130] flex items-center justify-center bg-black/60 p-4 backdrop-blur-md"
            onClick={() => setShowImagePreview(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 14, scale: 0.97 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="w-full max-w-md rounded-3xl border border-white/20 bg-lifewood-serpent p-6 text-white shadow-[0_24px_60px_rgba(0,0,0,0.45)]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-black">Profile Image</h3>
                  <p className="text-sm text-white/60">Preview and manage your profile picture</p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowImagePreview(false)}
                  className="rounded-lg bg-white/10 p-2 text-white/80 transition hover:bg-white/20 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="mb-6 flex justify-center">
                <div className="relative">
                  <img
                    src={draft.avatarUrl}
                    alt="Profile preview"
                    className="h-48 w-48 rounded-full border-4 border-white/20 object-cover"
                  />
                  <div className="absolute inset-0 rounded-full bg-black/20" />
                </div>
              </div>

              <div className="flex justify-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowImagePreview(false);
                    if (avatarInputRef.current) {
                      avatarInputRef.current.value = '';
                      avatarInputRef.current.click();
                    }
                  }}
                  disabled={uploadingAvatar}
                  className="inline-flex items-center gap-2 rounded-xl bg-lifewood-green px-4 py-2 text-sm font-bold text-white transition hover:bg-lifewood-green/90 disabled:opacity-60"
                >
                  <Pencil className="h-4 w-4" />
                  Change Profile
                </button>
                <button
                  type="button"
                  onClick={() => setShowImagePreview(false)}
                  className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-4 py-2 text-sm font-semibold text-white/80 transition hover:bg-white/10"
                >
                  <X className="h-4 w-4" />
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Toast toasts={toasts} onDismiss={dismiss} />
    </AnimatePresence>
  );
};
