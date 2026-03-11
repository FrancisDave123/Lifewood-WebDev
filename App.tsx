import React, { useState, useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AppRoutes } from './routes/AppRoutes';
import { ADMIN_PROFILE_STORAGE_KEY, DEFAULT_ADMIN_PROFILE } from './components/adminProfile';

const AUTH_STORAGE_KEY = 'lifewood_admin_authenticated';
const ADMIN_EMAIL_STORAGE_KEY = 'lifewood_admin_email';
const ROLE_ID_STORAGE_KEY = 'lifewood_role_id';
const ROLE_NAME_STORAGE_KEY = 'lifewood_role_name';
const THEME_STORAGE_KEY = 'lifewood_theme';

const App: React.FC = () => {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem(AUTH_STORAGE_KEY) === 'true';
  });
  const [authRoleId, setAuthRoleId] = useState<number | null>(() => {
    if (typeof window === 'undefined') return null;
    const stored = localStorage.getItem(ROLE_ID_STORAGE_KEY);
    if (!stored) return null;
    const parsed = Number(stored);
    return Number.isFinite(parsed) ? parsed : null;
  });
  const [authRoleName, setAuthRoleName] = useState<string | null>(() => {
    if (typeof window === 'undefined') return null;
    const stored = localStorage.getItem(ROLE_NAME_STORAGE_KEY);
    return stored ? stored : null;
  });

  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(THEME_STORAGE_KEY);
      if (saved === 'dark') return 'dark';
      if (saved === 'light') return 'light';
    }
    return 'light';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  useEffect(() => {
    let isActive = true;

    const checkSession = async () => {
      try {
        const response = await fetch('/api/auth/session', { credentials: 'include' });
        const payload = await response.json().catch(() => null);

        if (!isActive) return;

        if (response.ok) {
          setIsAdminAuthenticated(true);
          localStorage.setItem(AUTH_STORAGE_KEY, 'true');
          const email = payload?.data?.email;
          if (typeof email === 'string' && email.trim()) {
            localStorage.setItem(ADMIN_EMAIL_STORAGE_KEY, email.trim().toLowerCase());
          }
          const roleId = payload?.data?.role_id;
          if (typeof roleId === 'number' && Number.isFinite(roleId)) {
            setAuthRoleId(roleId);
            localStorage.setItem(ROLE_ID_STORAGE_KEY, String(roleId));
          }
          const roleName = payload?.data?.role_name;
          if (typeof roleName === 'string' && roleName.trim()) {
            setAuthRoleName(roleName);
            localStorage.setItem(ROLE_NAME_STORAGE_KEY, roleName);
            try {
              const raw = localStorage.getItem(ADMIN_PROFILE_STORAGE_KEY);
              const parsed = raw ? (JSON.parse(raw) as Record<string, unknown>) : {};
              const nextProfile = {
                ...DEFAULT_ADMIN_PROFILE,
                ...parsed,
                role: roleName
              };
              localStorage.setItem(ADMIN_PROFILE_STORAGE_KEY, JSON.stringify(nextProfile));
            } catch {}
          }
          return;
        }

        setIsAdminAuthenticated(false);
        setAuthRoleId(null);
        setAuthRoleName(null);
        localStorage.removeItem(AUTH_STORAGE_KEY);
        localStorage.removeItem(ROLE_ID_STORAGE_KEY);
        localStorage.removeItem(ROLE_NAME_STORAGE_KEY);
      } catch {
        if (!isActive) return;
        setIsAdminAuthenticated(false);
        setAuthRoleId(null);
        setAuthRoleName(null);
      }
    };

    checkSession();

    return () => {
      isActive = false;
    };
  }, []);

  return (
    <BrowserRouter>
      <AppRoutes
        theme={theme}
        isAdminAuthenticated={isAdminAuthenticated}
        setIsAdminAuthenticated={setIsAdminAuthenticated}
        authRoleId={authRoleId}
        setAuthRoleId={setAuthRoleId}
        authRoleName={authRoleName}
        setAuthRoleName={setAuthRoleName}
      />
    </BrowserRouter>
  );
};

export default App;
