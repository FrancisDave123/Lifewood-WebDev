import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '../services/supabaseClient';

interface AdminProfileData {
  firstName: string;
  lastName: string;
  birthday: string;
  address: string;
  school: string;
  roleId: number;
  role: string;  // Human-readable role name
  shortBio: string;
  avatarUrl: string;
  avatarDataUrl: string;  // Base64 data URL for avatar
}

const DEFAULT_ADMIN_PROFILE: AdminProfileData = {
  firstName: '',
  lastName: '',
  birthday: '',
  address: '',
  school: '',
  roleId: 1,
  role: 'Admin',
  shortBio: '',
  avatarUrl: '',
  avatarDataUrl: '',
};

interface ProfileContextType {
  profile: AdminProfileData;
  adminGmail: string;
  authUserId: string | null;
  saveProfile: (profile: AdminProfileData) => Promise<{ error: string | null }>;
  isLoading: boolean;
  error: string | null;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<AdminProfileData>(DEFAULT_ADMIN_PROFILE);
  const [adminGmail, setAdminGmail] = useState('');
  const [authUserId, setAuthUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProfile = async () => {
    try {
      const { data: authUserData, error: authError } = await supabase.auth.getUser();
      if (authError || !authUserData?.user) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      const uid = authUserData.user.id;
      setAuthUserId(uid);

      const { data, error } = await supabase
        .from('user_accounts')
        .select('email, first_name, last_name, birthday, role_id, address, school, bio, avatar_url')
        .eq('auth_user_id', uid)
        .single();

      if (error) {
        throw error;
      }

      if (data) {
        // Fetch role name from roles table
        const { data: roleData, error: roleError } = await supabase
          .from('roles')
          .select('name')
          .eq('id', data.role_id)
          .single();

        const roleName = roleError || !roleData ? 'Admin' : roleData.name;

        setProfile({
          firstName: data.first_name ?? '',
          lastName: data.last_name ?? '',
          birthday: data.birthday ?? '',
          address: data.address ?? '',
          school: data.school ?? '',
          roleId: Number(data.role_id) || 1,
          role: roleName,
          shortBio: data.bio ?? '',
          avatarUrl: data.avatar_url ?? '',
          avatarDataUrl: data.avatar_url ?? '', // Use avatar_url as avatarDataUrl for now
        });

        if (typeof data.email === 'string' && data.email.trim()) {
          const normalized = data.email.trim().toLowerCase();
          setAdminGmail(normalized);
        }
      }

      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load profile');
      setProfile(DEFAULT_ADMIN_PROFILE);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();

    // Listen for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        loadProfile();
      } else if (event === 'SIGNED_OUT') {
        setProfile(DEFAULT_ADMIN_PROFILE);
        setAdminGmail('');
        setAuthUserId(null);
        setIsLoading(false);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const saveProfile = async (newProfile: AdminProfileData) => {
    try {
      const resolvedUserId = authUserId || (await supabase.auth.getUser()).data.user?.id || '';
      if (!resolvedUserId) {
        return { error: 'No authenticated user' };
      }

      const { error } = await supabase
        .from('user_accounts')
        .update({
          first_name: newProfile.firstName.trim(),
          last_name: newProfile.lastName.trim(),
          birthday: newProfile.birthday || null,
          role_id: newProfile.roleId,
          address: newProfile.address.trim() || null,
          school: newProfile.school.trim() || null,
          bio: newProfile.shortBio.trim() || null,
          avatar_url: newProfile.avatarUrl || null,
        })
        .eq('auth_user_id', resolvedUserId);

      if (error) {
        return { error: error.message };
      }

      // Update profile but preserve avatarDataUrl (frontend representation)
      setProfile({
        ...newProfile,
        avatarDataUrl: newProfile.avatarDataUrl || newProfile.avatarUrl || ''
      });
      return { error: null };
    } catch (err) {
      return { error: err instanceof Error ? err.message : 'Failed to save profile' };
    }
  };

  return (
    <ProfileContext.Provider
      value={{
        profile,
        adminGmail,
        authUserId,
        saveProfile,
        isLoading,
        error
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = (): ProfileContextType => {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};
