import { useEffect, useState } from 'react';

export const ADMIN_PROFILE_STORAGE_KEY = 'admin_dashboard_profile';
export const ADMIN_EMAIL_STORAGE_KEY = 'lifewood_admin_email';
export const DEFAULT_ADMIN_GMAIL = '';

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
  firstName: '',
  lastName: '',
  birthday: '',
  address: '',
  school: '',
  role: '',
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
    let isActive = true;

    const fetchProfile = async () => {
      try {
        const response = await fetch('/api/auth/profile', { credentials: 'include' });
        const payload = await response.json().catch(() => null);
        if (!isActive || !response.ok || !payload?.data) return;

        const data = payload.data;
        setProfile((prev) => ({
          ...prev,
          firstName: typeof data.first_name === 'string' ? data.first_name : '',
          lastName: typeof data.last_name === 'string' ? data.last_name : '',
          role: typeof data.role_name === 'string' ? data.role_name : ''
        }));

        if (typeof data.email === 'string' && data.email.trim()) {
          const normalized = data.email.trim().toLowerCase();
          setAdminGmail(normalized);
          localStorage.setItem(ADMIN_EMAIL_STORAGE_KEY, normalized);
        }
      } catch {}
    };

    fetchProfile();

    return () => {
      isActive = false;
    };
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
