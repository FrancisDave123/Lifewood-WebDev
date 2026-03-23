import { useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';

export const ADMIN_EMAIL_STORAGE_KEY = 'lifewood_admin_email';
export const DEFAULT_ADMIN_GMAIL = '';

export interface AdminProfileData {
  firstName: string;
  lastName: string;
  birthday: string;
  address: string;
  school: string;
  roleId: number;       // 1=Admin, 2=Intern, 3=Employee, 4=Applicant
  shortBio: string;
  avatarUrl: string;    // public URL from Supabase Storage (was avatarDataUrl)
}

export const DEFAULT_ADMIN_PROFILE: AdminProfileData = {
  firstName: '',
  lastName: '',
  birthday: '',
  address: '',
  school: '',
  roleId: 1,
  shortBio: '',
  avatarUrl: '',
};

export const ROLE_OPTIONS = [
  { id: 1, label: 'Admin' },
  { id: 2, label: 'Intern' },
  { id: 3, label: 'Employee' },
  { id: 4, label: 'Applicant' },
] as const;

export const useAdminProfile = () => {
  const [profile, setProfile] = useState<AdminProfileData>(DEFAULT_ADMIN_PROFILE);
  const [adminGmail, setAdminGmail] = useState(DEFAULT_ADMIN_GMAIL);
  const [authUserId, setAuthUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch profile from DB on mount
  useEffect(() => {
    let isActive = true;

    const fetchProfile = async () => {
      try {
        const { data: authUserData, error: authError } = await supabase.auth.getUser();
        if (authError || !authUserData?.user || !isActive) return;

        const uid = authUserData.user.id;
        setAuthUserId(uid);

        const { data, error } = await supabase
          .from('user_accounts')
          .select('email, first_name, last_name, birthday, role_id, address, school, bio, avatar_url')
          .eq('auth_user_id', uid)
          .single();

        if (error || !data || !isActive) return;

        setProfile({
          firstName:  data.first_name  ?? '',
          lastName:   data.last_name   ?? '',
          birthday:   data.birthday    ?? '',
          address:    data.address     ?? '',
          school:     data.school      ?? '',
          roleId:     Number(data.role_id) || 1,
          shortBio:   data.bio         ?? '',
          avatarUrl:  data.avatar_url  ?? '',
        });

        if (typeof data.email === 'string' && data.email.trim()) {
          const normalized = data.email.trim().toLowerCase();
          setAdminGmail(normalized);
          localStorage.setItem(ADMIN_EMAIL_STORAGE_KEY, normalized);
        }
      } catch {
        // silent — fall back to empty defaults
      } finally {
        if (isActive) setLoading(false);
      }
    };

    // Restore cached email immediately so UI doesn't flash empty
    const cachedEmail = localStorage.getItem(ADMIN_EMAIL_STORAGE_KEY)?.trim().toLowerCase();
    if (cachedEmail) setAdminGmail(cachedEmail);

    fetchProfile();
    return () => { isActive = false; };
  }, []);

  // Save updated profile to DB
  const saveProfile = async (updated: AdminProfileData): Promise<{ error: string | null }> => {
    if (!authUserId) return { error: 'Not authenticated.' };

    const { error } = await supabase
      .from('user_accounts')
      .update({
        first_name:  updated.firstName.trim(),
        last_name:   updated.lastName.trim(),
        birthday:    updated.birthday   || null,
        role_id:     updated.roleId,
        address:     updated.address.trim()  || null,
        school:      updated.school.trim()   || null,
        bio:         updated.shortBio.trim() || null,
        avatar_url:  updated.avatarUrl       || null,
      })
      .eq('auth_user_id', authUserId);

    if (error) return { error: error.message };

    setProfile(updated);
    return { error: null };
  };

  return {
    profile,
    setProfile,
    saveProfile,
    adminGmail,
    authUserId,
    loading,
  };
};