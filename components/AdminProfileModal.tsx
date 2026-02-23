import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Pencil, UserCircle2, X } from 'lucide-react';
import { AdminProfileData } from './adminProfile';

interface AdminProfileModalProps {
  open: boolean;
  onClose: () => void;
  profile: AdminProfileData;
  adminGmail: string;
  onSave: (profile: AdminProfileData) => void;
}

export const AdminProfileModal: React.FC<AdminProfileModalProps> = ({
  open,
  onClose,
  profile,
  adminGmail,
  onSave
}) => {
  const avatarInputRef = useRef<HTMLInputElement | null>(null);
  const [profileDraft, setProfileDraft] = useState<AdminProfileData>(profile);
  const [profileError, setProfileError] = useState('');

  useEffect(() => {
    if (!open) return;
    setProfileDraft(profile);
    setProfileError('');
  }, [open, profile]);

  const saveProfile = () => {
    if (!profileDraft.firstName.trim() || !profileDraft.lastName.trim()) {
      setProfileError('First name and last name are required.');
      return;
    }

    onSave({
      ...profileDraft,
      firstName: profileDraft.firstName.trim(),
      lastName: profileDraft.lastName.trim(),
      role: profileDraft.role.trim() || 'Internal Access'
    });
    setProfileError('');
    onClose();
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
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.16 }}
          className="fixed inset-0 z-[120] flex items-center justify-center bg-black/60 p-4 backdrop-blur-md"
        >
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 14, scale: 0.97 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-xl rounded-3xl border border-white/20 bg-lifewood-serpent p-6 text-white shadow-[0_24px_60px_rgba(0,0,0,0.45)]"
          >
        <div className="mb-5 flex items-start justify-between">
          <div>
            <h3 className="text-2xl font-black">Edit Profile</h3>
            <p className="text-sm text-white/60">Update your internal admin details</p>
          </div>
          <button
            onClick={onClose}
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
                  value={profileDraft.firstName}
                  onChange={(e) => setProfileDraft((prev) => ({ ...prev, firstName: e.target.value }))}
                  className="mt-1 w-full rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-white/45 focus:border-lifewood-green focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-white/70">Last Name *</label>
                <input
                  required
                  value={profileDraft.lastName}
                  onChange={(e) => setProfileDraft((prev) => ({ ...prev, lastName: e.target.value }))}
                  className="mt-1 w-full rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-white/45 focus:border-lifewood-green focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-white/70">Birthday</label>
                <input
                  type="date"
                  value={profileDraft.birthday}
                  onChange={(e) => setProfileDraft((prev) => ({ ...prev, birthday: e.target.value }))}
                  className="mt-1 w-full rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm text-white focus:border-lifewood-green focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-white/70">Role</label>
                <input
                  value={profileDraft.role}
                  onChange={(e) => setProfileDraft((prev) => ({ ...prev, role: e.target.value }))}
                  className="mt-1 w-full rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-white/45 focus:border-lifewood-green focus:outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-white/70">Address</label>
              <input
                value={profileDraft.address}
                onChange={(e) => setProfileDraft((prev) => ({ ...prev, address: e.target.value }))}
                className="mt-1 w-full rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-white/45 focus:border-lifewood-green focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-white/70">School</label>
              <input
                value={profileDraft.school}
                onChange={(e) => setProfileDraft((prev) => ({ ...prev, school: e.target.value }))}
                className="mt-1 w-full rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-white/45 focus:border-lifewood-green focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-white/70">Short Bio</label>
              <textarea
                rows={3}
                value={profileDraft.shortBio}
                onChange={(e) => setProfileDraft((prev) => ({ ...prev, shortBio: e.target.value }))}
                className="mt-1 w-full resize-none rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-white/45 focus:border-lifewood-green focus:outline-none"
              />
            </div>
            {profileError && <p className="text-xs font-semibold text-lifewood-saffron">{profileError}</p>}
          </div>

          <div className="md:col-span-2 flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-white/15 px-4 py-2 text-xs font-semibold text-white/80 transition hover:bg-white/10"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-xl bg-lifewood-green px-4 py-2 text-xs font-bold text-white transition hover:bg-lifewood-green/90"
            >
              Save Changes
            </button>
          </div>
        </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
