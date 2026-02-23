import { useEffect, useState } from 'react';

export const ADMIN_PROFILE_STORAGE_KEY = 'admin_dashboard_profile';
export const ADMIN_EMAIL_STORAGE_KEY = 'lifewood_admin_email';
export const DEFAULT_ADMIN_GMAIL = 'admin@lifewood.test';

export interface AdminProfileData {
  firstName: string;
  lastName: string;
  birthday: string;
  address: string;
  school: string;
  role: string;
  shortBio: string;
  avatarDataUrl: string;
}

export const DEFAULT_ADMIN_PROFILE: AdminProfileData = {
  firstName: 'Admin',
  lastName: 'Admin',
  birthday: '',
  address: '',
  school: '',
  role: 'Internal Access',
  shortBio: '',
  avatarDataUrl: ''
};

export const useAdminProfile = () => {
  const [profile, setProfile] = useState<AdminProfileData>(DEFAULT_ADMIN_PROFILE);
  const [adminGmail, setAdminGmail] = useState(DEFAULT_ADMIN_GMAIL);

  useEffect(() => {
    const savedProfile = localStorage.getItem(ADMIN_PROFILE_STORAGE_KEY);
    if (savedProfile) {
      try {
        const parsedProfile = JSON.parse(savedProfile) as Partial<AdminProfileData>;
        setProfile((prev) => ({
          ...prev,
          ...parsedProfile
        }));
      } catch {}
    }

    const savedAdminEmail = localStorage.getItem(ADMIN_EMAIL_STORAGE_KEY)?.trim().toLowerCase();
    if (savedAdminEmail) {
      setAdminGmail(savedAdminEmail);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(ADMIN_PROFILE_STORAGE_KEY, JSON.stringify(profile));
  }, [profile]);

  return {
    profile,
    setProfile,
    adminGmail
  };
};
