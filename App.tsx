import React, { useState, useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AppRoutes } from './routes/AppRoutes';

const AUTH_STORAGE_KEY = 'lifewood_admin_authenticated';
const THEME_STORAGE_KEY = 'lifewood_theme';

const App: React.FC = () => {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem(AUTH_STORAGE_KEY) === 'true';
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

  return (
    <BrowserRouter>
      <AppRoutes
        theme={theme}
        isAdminAuthenticated={isAdminAuthenticated}
        setIsAdminAuthenticated={setIsAdminAuthenticated}
      />
    </BrowserRouter>
  );
};

export default App;
