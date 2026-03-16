import { useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';
import { authService } from '../services/authService';

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
        const user = authService.getCurrentUser();
        if (!user || !isActive) return;

        const { data, error } = await supabase
          .from('user_accounts')
          .select('id, email, first_name, last_name, roles(name)')
          .eq('id', user.id)
          .single();

        if (error || !data || !isActive) return;

        setProfile((prev) => ({
          ...prev,
          firstName: typeof data.first_name === 'string' ? data.first_name : '',
          lastName: typeof data.last_name === 'string' ? data.last_name : '',
          role: user.role_name || ''
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
