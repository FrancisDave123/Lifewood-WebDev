import { compare } from 'bcryptjs';
import { supabase } from './supabaseClient';

export interface AuthUser {
  id: string;
  email: string;
  role_id: number;
  role_name: string | null;
}

export interface AuthToken {
  token: string;
  expiresAt: number;
}

const TOKEN_EXPIRY_MS = 24 * 60 * 60 * 1000; // 24 hours

export const authService = {
  // Generate a simple JWT-like token (for demo - in production use proper JWT)
  generateToken(): AuthToken {
    const expiresAt = Date.now() + TOKEN_EXPIRY_MS;
    // In production, use jsonwebtoken library to create proper JWT
    const token = btoa(`${Date.now()}.${Math.random()}`);
    return { token, expiresAt };
  },

  // Login with email and password
  async login(email: string, password: string): Promise<AuthUser> {
    try {
      // Query user_accounts from Supabase
      const { data: user, error } = await supabase
        .from('user_accounts')
        .select('id, email, password, role_id, roles(name)')
        .eq('email', email.toLowerCase())
        .single();

      if (error || !user) {
        throw new Error('Invalid credentials');
      }

      // Verify password using bcryptjs
      const isPasswordValid = await compare(password, user.password || '');
      if (!isPasswordValid) {
        throw new Error('Invalid credentials');
      }

      const authUser: AuthUser = {
        id: user.id,
        email: user.email,
        role_id: user.role_id,
        role_name: user.roles && Array.isArray(user.roles) && user.roles.length > 0
          ? (user.roles[0] as any)?.name || null
          : null
      };

      // Generate token and store in localStorage
      const { token, expiresAt } = this.generateToken();
      this.saveSession(authUser, token, expiresAt);

      return authUser;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message || 'Login failed');
      }
      throw error;
    }
  },

  // Save session to localStorage
  saveSession(user: AuthUser, token: string, expiresAt: number): void {
    localStorage.setItem('lifewood_token', token);
    localStorage.setItem('lifewood_token_expiry', String(expiresAt));
    localStorage.setItem('lifewood_admin_authenticated', 'true');
    localStorage.setItem('lifewood_admin_email', user.email);
    localStorage.setItem('lifewood_role_id', String(user.role_id));
    localStorage.setItem('lifewood_role_name', user.role_name || '');
    localStorage.setItem('lifewood_admin_user_id', user.id);
  },

  // Get current session from localStorage
  getSession(): AuthUser | null {
    if (typeof window === 'undefined') return null;

    const token = localStorage.getItem('lifewood_token');
    const expiryStr = localStorage.getItem('lifewood_token_expiry');
    const isAuthenticated = localStorage.getItem('lifewood_admin_authenticated');

    if (!token || !expiryStr || isAuthenticated !== 'true') {
      return null;
    }

    const expiresAt = Number(expiryStr);
    if (Date.now() > expiresAt) {
      this.logout();
      return null;
    }

    const email = localStorage.getItem('lifewood_admin_email');
    const roleIdStr = localStorage.getItem('lifewood_role_id');
    const roleName = localStorage.getItem('lifewood_role_name');
    const userId = localStorage.getItem('lifewood_admin_user_id');

    if (!email || !roleIdStr || !userId) {
      return null;
    }

    return {
      id: userId,
      email,
      role_id: Number(roleIdStr),
      role_name: roleName
    };
  },

  // Logout and clear session
  logout(): void {
    localStorage.removeItem('lifewood_token');
    localStorage.removeItem('lifewood_token_expiry');
    localStorage.removeItem('lifewood_admin_authenticated');
    localStorage.removeItem('lifewood_admin_email');
    localStorage.removeItem('lifewood_role_id');
    localStorage.removeItem('lifewood_role_name');
    localStorage.removeItem('lifewood_admin_user_id');
  },

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return this.getSession() !== null;
  },

  // Get current user
  getCurrentUser(): AuthUser | null {
    return this.getSession();
  },

  // Check if user is admin (role_id = 1)
  isAdmin(): boolean {
    const user = this.getSession();
    return user !== null && user.role_id === 1;
  }
};
