import React, { useState, useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AppRoutes } from './routes/AppRoutes';
import { supabase } from './services/supabaseClient';
import { authService } from './services/authService';

const THEME_STORAGE_KEY = 'lifewood_theme';

const App: React.FC = () => {
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(false);
  const [authRoleId, setAuthRoleId] = useState<number | null>(null);
  const [authRoleName, setAuthRoleName] = useState<string | null>(null);

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

    const loadRoleFromSession = async () => {
      try {
        if (!isActive) return;
        const user = await authService.getCurrentUser();

        if (!isActive) return;
        if (!user) {
          setIsAdminAuthenticated(false);
          setAuthRoleId(null);
          setAuthRoleName(null);
          return;
        }

        setIsAdminAuthenticated(user.role_id === 1);
        setAuthRoleId(user.role_id);
        setAuthRoleName(user.role_name);
        
      } finally {
        if (!isActive) return;
        setIsAuthLoading(false);
      }
    };

    void loadRoleFromSession();

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange(() => {
      void loadRoleFromSession();
    });

    return () => {
      isActive = false;
      subscription.unsubscribe();
    };
  }, []);

  return (
    <BrowserRouter>
      <AppRoutes
        theme={theme}
        isAuthLoading={isAuthLoading}
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
