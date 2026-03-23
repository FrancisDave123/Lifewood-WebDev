import { supabase } from './supabaseClient';

export interface AuthUser {
  // This is the Supabase Auth user id (`auth.users.id`), used by your `user_accounts.auth_user_id` FK/policy.
  id: string;
  email: string;
  role_id: number;
  role_name: string | null;
}

const extractRoleName = (rolesField: unknown): string | null => {
  if (!rolesField) return null;
  if (typeof rolesField === 'string') return rolesField;
  if (Array.isArray(rolesField)) {
    const first = rolesField[0] as any;
    return typeof first?.name === 'string' ? first.name : null;
  }
  const obj = rolesField as any;
  return typeof obj?.name === 'string' ? obj.name : null;
};

const fetchRoleForAuthUser = async (authUserId: string): Promise<AuthUser | null> => {
  const { data, error } = await supabase
    .from('user_accounts')
    .select('email, role_id, roles(name)')
    // Your policy uses: (auth_user_id = auth.uid())
    .eq('auth_user_id', authUserId)
    .single();

  if (error || !data) return null;

  return {
    id: authUserId,
    email: typeof data.email === 'string' ? data.email : '',
    role_id: Number(data.role_id),
    role_name: extractRoleName(data.roles)
  };
};

export const authService = {
  // Login via Supabase Auth (no custom/localStorage token)
  async login(email: string, password: string): Promise<AuthUser> {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error || !data.user) {
      throw new Error(error?.message || 'Invalid credentials');
    }

    const roleUser = await fetchRoleForAuthUser(data.user.id);
    if (!roleUser) {
      throw new Error('Your account is not registered for internal access.');
    }

    return roleUser;
  },

  async logout(): Promise<void> {
    await supabase.auth.signOut();
  },

  // Supabase-auth aware current user + role
  async getCurrentUser(): Promise<AuthUser | null> {
    const { data: authUserData, error } = await supabase.auth.getUser();
    if (error || !authUserData?.user) return null;

    return fetchRoleForAuthUser(authUserData.user.id);
  },

  async isAdmin(): Promise<boolean> {
    const user = await this.getCurrentUser();
    return user !== null && user.role_id === 1;
  }
};
